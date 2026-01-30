import { Injectable } from '@angular/core';
import { Observable, tap, throwError } from 'rxjs';
import { ApiService } from './api.service';
import { AuthService } from './auth';
import { SecureStorageService } from './secure-storage.service';
import { SessionTimeoutService } from './session-timeout.service';
import { AuthResponse, LoginCredentials, signUpDto, User } from '../models/model';

/**
 * Authentication API Service
 * Handles API calls for authentication (login, register, password reset, etc.)
 * Uses AuthService for state management
 * Uses SecureStorageService for encrypted storage
 * Includes automatic token refresh and session timeout
 */
@Injectable({
    providedIn: 'root'
})
export class AuthApiService {
    constructor(
        private apiService: ApiService,
        private authService: AuthService,
        private secureStorage: SecureStorageService,
        private sessionTimeout: SessionTimeoutService
    ) {
        // Start session monitoring if user is logged in
        if (this.authService.isAuthenticated()) {
            this.sessionTimeout.startSessionMonitoring();
        }
    }

    /**
     * Login user
     */
    login(credentials: LoginCredentials): Observable<AuthResponse> {
        return this.apiService.post<AuthResponse>('/auth/login', credentials).pipe(
            tap(response => {
                this.handleAuthSuccess(response);
                // Start session monitoring after successful login
                this.sessionTimeout.startSessionMonitoring();
            })
        );
    }

    /**
     * Register new user
     * Does NOT automatically log in - user must login with their new credentials
     */
    register(data: signUpDto): Observable<AuthResponse> {
        return this.apiService.post<AuthResponse>('/auth/register', data);
    }

    /**
     * Logout user
     */
    logout(): Observable<any> {
        return this.apiService.post('/auth/logout', {}).pipe(
            tap(() => {
                this.clearSession();
                // Stop session monitoring
                this.sessionTimeout.stopSessionMonitoring();
            })
        );
    }

    /**
     * Refresh authentication token
     * Called automatically by interceptor when token expires
     */
    refreshToken(): Observable<AuthResponse> {
        const refreshToken = this.secureStorage.getItem('refreshToken');

        if (!refreshToken) {
            // No refresh token available - logout user
            console.warn('No refresh token available. Logging out user.');
            this.logout().subscribe();
            return throwError(() => new Error('No refresh token available'));
        }

        return this.apiService.post<AuthResponse>('/auth/refresh-token', { refreshToken }).pipe(
            tap(response => {
                // Update tokens
                this.apiService.setAuthToken(response.token);

                if (response.refreshToken) {
                    this.apiService.setRefreshToken(response.refreshToken);
                }

                // Update login timestamp (extend session)
                this.secureStorage.setItem('loginTimestamp', Date.now().toString());
            })
        );
    }

    /**
     * Get current user profile from API
     */
    getCurrentUser(): Observable<User> {
        return this.apiService.get<User>('/auth/me').pipe(
            tap(user => {
                this.authService.setCurrentUser(user);
            })
        );
    }

    /**
     * Update user profile
     */
    updateProfile(data: Partial<User>): Observable<User> {
        return this.apiService.put<User>('/auth/profile', data).pipe(
            tap(user => {
                this.authService.updateUser(user);
            })
        );
    }

    /**
     * Change password
     */
    changePassword(data: { current_password: string; new_password: string; new_password_confirmation: string }): Observable<any> {
        return this.apiService.post('/auth/change-password', data);
    }

    /**
     * Request password reset
     */
    forgotPassword(email: string): Observable<any> {
        return this.apiService.post('/auth/forgot-password', { email });
    }

    /**
     * Reset password with token
     */
    resetPassword(data: { token: string; email: string; password: string; password_confirmation: string }): Observable<any> {
        return this.apiService.post('/auth/reset-password', data);
    }

    /**
     * Verify email
     */
    verifyEmail(token: string): Observable<any> {
        return this.apiService.post('/auth/verify-email', { token });
    }

    /**
     * Resend verification email
     */
    resendVerification(): Observable<any> {
        return this.apiService.post('/auth/resend-verification', {});
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return this.apiService.isAuthenticated();
    }

    /**
     * Get current user value (synchronous)
     */
    getCurrentUserValue(): User | null {
        return this.authService.getCurrentUser();
    }

    /**
     * Handle successful authentication
     * Stores token and user data securely
     */
    private handleAuthSuccess(response: AuthResponse): void {
        // Store token securely
        this.apiService.setAuthToken(response.token);

        // Store refresh token if provided
        if (response.refreshToken) {
            this.apiService.setRefreshToken(response.refreshToken);
        }

        // Construct User object from flat response structure
        // Note: API response is flat (firstName, lastName, etc) but our app expects a User object
        const user: User = {
            id: response.id,
            firstname: response.firstName,
            lastname: response.lastName,
            email: response.email,
            name: `${response.firstName} ${response.lastName}`,
            username: `${response.firstName} ${response.lastName}`,
            role: response.roles || 'student',
            phone: '',
            accountType: response.isCreator ? 'creator' : 'learner',
            creatorconsent: response.isCreator,
            rememberMe: false
        };

        // Update current user via AuthService
        this.authService.setCurrentUser(user);
    }

    /**
     * Clear user session
     * Removes all auth data from secure storage
     */
    private clearSession(): void {
        // Clear all auth data from secure storage
        this.apiService.clearAuthData();

        // Clear current user via AuthService
        this.authService.setCurrentUser(null);
    }



    /**
     * Refresh user data from API
     * Useful after profile updates or to sync with backend
     */
    refreshUser(): Observable<User> {
        return this.getCurrentUser();
    }

    /**
     * Check if user has specific role
     */
    hasRole(role: string): boolean {
        const user = this.getCurrentUserValue();
        return user?.role === role;
    }

    /**
     * Check if user has any of the specified roles
     */
    hasAnyRole(roles: string[]): boolean {
        const user = this.getCurrentUserValue();
        return user ? roles.includes(user.role) : false;
    }
}

