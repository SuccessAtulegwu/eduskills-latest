import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../models/model';
import { SecureStorageService } from './secure-storage.service';
import { ApiService } from './api.service';

/**
 * Authentication State Management Service
 * Manages user state, authentication status, and session data
 * Does NOT handle API calls - use AuthApiService for that
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private router: Router,
    private secureStorage: SecureStorageService,
    private apiService: ApiService
  ) {
    // Load user state from storage on initialization
    this.checkAuthStatus();
  }

  /**
   * Check authentication status from storage
   */
  private checkAuthStatus(): void {
    const token = this.secureStorage.getItem('authToken');
    const user = this.secureStorage.getObject<User>('user_data');

    if (token && user) {
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
    }
  }

  /**
   * Set current user and authentication state
   * Called by AuthApiService after successful login/registration
   */
  setCurrentUser(user: User | null): void {
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(!!user);

    if (user) {
      this.secureStorage.setItem('user_data', JSON.stringify(user));
    }
  }

  /**
   * Get current user (synchronous)
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * Get authentication token
   */
  getToken(): string | null {
    return this.secureStorage.getItem('authToken');
  }

  /**
   * Logout user - calls API, clears session and redirects to login
   */
  logout(): void {
    if (this.isAuthenticated()) {
      this.apiService.post('/auth/logout', {}).subscribe({
        next: () => {
          this.clearSession();
          this.router.navigate(['/login']);
        },
        error: () => {
          // Clear session even if API call fails
          this.clearSession();
          this.router.navigate(['/login']);
        }
      });
    } else {
      // Not authenticated, just clear and redirect
      this.clearSession();
      this.router.navigate(['/login']);
    }
  }

  /**
   * Clear user session data
   */
  private clearSession(): void {
    // Clear secure storage
    this.secureStorage.removeItem('authToken');
    this.secureStorage.removeItem('user_data');
    this.secureStorage.removeItem('refreshToken');
    // Reset state
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  /**
   * Update user data in storage and state
   */
  updateUser(user: User): void {
    this.currentUserSubject.next(user);
    this.secureStorage.setItem('user_data', JSON.stringify(user));
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role?.toLowerCase() === role.toLowerCase();
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    if (!user || !user.role) return false;

    return roles.some(role =>
      user.role.toLowerCase() === role.toLowerCase()
    );
  }
}
