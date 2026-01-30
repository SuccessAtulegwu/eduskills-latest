import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { SecureStorageService } from './secure-storage.service';
import { ToastService } from './toast.service';

/**
 * Session Timeout Service
 * Handles automatic logout after specified duration (2 days by default)
 * Also handles activity-based session extension
 */
@Injectable({
    providedIn: 'root'
})
export class SessionTimeoutService {
    private readonly SESSION_DURATION = 2 * 24 * 60 * 60 * 1000; // 2 days in milliseconds
    private readonly CHECK_INTERVAL = 60 * 1000; // Check every minute
    private readonly WARNING_BEFORE_LOGOUT = 5 * 60 * 1000; // Warn 5 minutes before logout

    private timeoutCheckInterval: any;
    private warningShown = false;

    constructor(
        private secureStorage: SecureStorageService,
        private router: Router,
        private toastService: ToastService,
        private ngZone: NgZone
    ) { }

    /**
     * Start session timeout monitoring
     * Call this after successful login
     */
    startSessionMonitoring(): void {
        // Store login timestamp
        const loginTimestamp = Date.now();
        this.secureStorage.setItem('loginTimestamp', loginTimestamp.toString());
        this.warningShown = false;

        // Clear any existing interval
        this.stopSessionMonitoring();

        // Start checking session timeout
        this.ngZone.runOutsideAngular(() => {
            this.timeoutCheckInterval = setInterval(() => {
                this.ngZone.run(() => {
                    this.checkSessionTimeout();
                });
            }, this.CHECK_INTERVAL);
        });

        console.log('Session monitoring started. Auto-logout in 2 days.');
    }

    /**
     * Stop session timeout monitoring
     * Call this on logout
     */
    stopSessionMonitoring(): void {
        if (this.timeoutCheckInterval) {
            clearInterval(this.timeoutCheckInterval);
            this.timeoutCheckInterval = null;
        }
        this.warningShown = false;
    }

    /**
     * Check if session has expired
     */
    private checkSessionTimeout(): void {
        const loginTimestampStr = this.secureStorage.getItem('loginTimestamp');

        if (!loginTimestampStr) {
            // No login timestamp, user not logged in
            return;
        }

        const loginTimestamp = parseInt(loginTimestampStr, 10);
        const currentTime = Date.now();
        const sessionDuration = currentTime - loginTimestamp;

        // Check if session has expired
        if (sessionDuration >= this.SESSION_DURATION) {
            this.handleSessionExpired();
            return;
        }

        // Check if we should show warning
        const timeRemaining = this.SESSION_DURATION - sessionDuration;
        if (timeRemaining <= this.WARNING_BEFORE_LOGOUT && !this.warningShown) {
            this.showExpirationWarning(timeRemaining);
        }
    }

    /**
     * Handle session expiration
     */
    private handleSessionExpired(): void {
        console.log('Session expired after 2 days. Logging out...');

        // Stop monitoring
        this.stopSessionMonitoring();

        // Clear all auth data
        this.clearAuthData();

        // Show message
        this.toastService.show('Your session has expired after 2 days. Please login again.', 'warning');

        // Redirect to login
        setTimeout(() => {
            this.router.navigate(['/login']);
        }, 2000);
    }

    /**
     * Show warning before session expires
     */
    private showExpirationWarning(timeRemaining: number): void {
        this.warningShown = true;
        const minutesRemaining = Math.floor(timeRemaining / (60 * 1000));

        this.toastService.show(
            `Your session will expire in ${minutesRemaining} minutes. Please save your work.`,
            'warning'
        );
    }

    /**
     * Extend session (reset login timestamp)
     * Call this on user activity or manual refresh
     */
    extendSession(): void {
        const loginTimestampStr = this.secureStorage.getItem('loginTimestamp');

        if (loginTimestampStr) {
            // Update login timestamp to current time
            this.secureStorage.setItem('loginTimestamp', Date.now().toString());
            this.warningShown = false;
            console.log('Session extended for another 2 days.');
        }
    }

    /**
     * Get remaining session time in milliseconds
     */
    getRemainingSessionTime(): number {
        const loginTimestampStr = this.secureStorage.getItem('loginTimestamp');

        if (!loginTimestampStr) {
            return 0;
        }

        const loginTimestamp = parseInt(loginTimestampStr, 10);
        const currentTime = Date.now();
        const sessionDuration = currentTime - loginTimestamp;
        const remaining = this.SESSION_DURATION - sessionDuration;

        return remaining > 0 ? remaining : 0;
    }

    /**
     * Get remaining session time as human-readable string
     */
    getRemainingSessionTimeString(): string {
        const remaining = this.getRemainingSessionTime();

        if (remaining === 0) {
            return 'Session expired';
        }

        const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
        const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));

        if (days > 0) {
            return `${days} day${days > 1 ? 's' : ''}, ${hours} hour${hours !== 1 ? 's' : ''}`;
        } else if (hours > 0) {
            return `${hours} hour${hours !== 1 ? 's' : ''}, ${minutes} minute${minutes !== 1 ? 's' : ''}`;
        } else {
            return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
        }
    }

    /**
     * Check if session is still valid
     */
    isSessionValid(): boolean {
        return this.getRemainingSessionTime() > 0;
    }

    /**
     * Clear all authentication data
     */
    private clearAuthData(): void {
        this.secureStorage.removeItem('authToken');
        this.secureStorage.removeItem('refreshToken');
        this.secureStorage.removeItem('currentUser');
        this.secureStorage.removeItem('loginTimestamp');

        // Clear legacy storage
        localStorage.removeItem('authToken');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        localStorage.removeItem('currentUser');
    }

    /**
     * Get session configuration
     */
    getSessionConfig() {
        return {
            duration: this.SESSION_DURATION,
            durationDays: this.SESSION_DURATION / (24 * 60 * 60 * 1000),
            warningTime: this.WARNING_BEFORE_LOGOUT,
            checkInterval: this.CHECK_INTERVAL
        };
    }
}
