import { HttpInterceptorFn, HttpErrorResponse, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError, timeout, switchMap, filter, take } from 'rxjs';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ToastService } from './toast.service';
import { SecureStorageService } from './secure-storage.service';
import { ApiService } from './api.service';

/**
 * Public endpoints that don't require authentication
 * Add your public endpoints here
 */
const PUBLIC_ENDPOINTS = [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/verify-email',
    '/auth/refresh-token',  // Don't add token to refresh endpoint
    '/public',
    '/health',
    '/status'
];

/**
 * Check if endpoint requires authentication
 */
function requiresAuth(url: string): boolean {
    // Check if URL matches any public endpoint
    return !PUBLIC_ENDPOINTS.some(endpoint => url.includes(endpoint));
}

/**
 * Token refresh state
 */
let isRefreshing = false;
let refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

/**
 * HTTP Interceptor for API requests
 * - Automatically adds authentication token to protected endpoints
 * - Handles automatic token refresh on 401 errors
 * - Handles request timeout
 * - Provides centralized error handling
 * - Uses secure storage for tokens
 */
export const apiInterceptor: HttpInterceptorFn = (req, next) => {
    const toastService = inject(ToastService);
    const secureStorage = inject(SecureStorageService);
    const router = inject(Router);

    // Get auth token from secure storage
    const token = secureStorage.getItem('authToken');

    // Clone the request and add headers
    let modifiedReq = addHeaders(req, token);

    // Handle the request with timeout and error handling
    return next(modifiedReq).pipe(
        timeout(environment.apiTimeout),
        catchError((error: HttpErrorResponse) => {
            // Handle 401 errors with token refresh
            if (error.status === 401 && requiresAuth(req.url) && !req.url.includes('/auth/refresh-token')) {
                return handle401Error(req, next, secureStorage, toastService, router);
            }
            return handleError(error, toastService, secureStorage, router, req.url);
        })
    );
};

/**
 * Add headers to request
 */
function addHeaders(req: HttpRequest<any>, token: string | null): HttpRequest<any> {
    const isFormData = req.body instanceof FormData;

    // Base headers
    let headers: any = {
        'Accept': 'application/json'
    };

    // Add Content-Type for non-FormData requests
    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }

    // Add authorization header if token exists and endpoint requires auth
    if (token && requiresAuth(req.url)) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return req.clone({ setHeaders: headers });
}

/**
 * Handle 401 error with automatic token refresh
 */
function handle401Error(
    req: HttpRequest<any>,
    next: HttpHandlerFn,
    secureStorage: SecureStorageService,
    toastService: ToastService,
    router: Router
): Observable<any> {
    const refreshToken = secureStorage.getItem('refreshToken');

    if (!refreshToken) {
        // No refresh token, logout user
        return logoutUser(secureStorage, toastService, router);
    }

    if (!isRefreshing) {
        isRefreshing = true;
        refreshTokenSubject.next(null);

        // Call refresh token endpoint
        return refreshAuthToken(refreshToken, secureStorage).pipe(
            switchMap((newToken: string) => {
                isRefreshing = false;
                refreshTokenSubject.next(newToken);

                // Retry the original request with new token
                return next(addHeaders(req, newToken));
            }),
            catchError((error) => {
                isRefreshing = false;
                // Refresh failed, logout user
                return logoutUser(secureStorage, toastService, router);
            })
        );
    } else {
        // Wait for token refresh to complete
        return refreshTokenSubject.pipe(
            filter(token => token !== null),
            take(1),
            switchMap(token => {
                return next(addHeaders(req, token));
            })
        );
    }
}

/**
 * Refresh authentication token
 */
function refreshAuthToken(refreshToken: string, secureStorage: SecureStorageService): Observable<string> {
    const apiUrl = environment.apiUrl;

    return new Observable(observer => {
        fetch(`${apiUrl}/auth/refresh-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ refreshToken })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Token refresh failed');
                }
                return response.json();
            })
            .then(data => {
                // Store new tokens
                const newToken = data.token || data.data?.token;
                const newRefreshToken = data.refreshToken || data.data?.refreshToken;

                if (newToken) {
                    secureStorage.setItem('authToken', newToken);

                    if (newRefreshToken) {
                        secureStorage.setItem('refreshToken', newRefreshToken);
                    }

                    // Update login timestamp
                    secureStorage.setItem('loginTimestamp', Date.now().toString());

                    observer.next(newToken);
                    observer.complete();
                } else {
                    observer.error(new Error('No token in response'));
                }
            })
            .catch(error => {
                observer.error(error);
            });
    });
}

/**
 * Logout user and redirect to login
 */
function logoutUser(secureStorage: SecureStorageService, toastService: ToastService, router: Router): Observable<never> {
    // Clear all auth data
    secureStorage.removeItem('authToken');
    secureStorage.removeItem('refreshToken');
    secureStorage.removeItem('currentUser');
    secureStorage.removeItem('loginTimestamp');
    // Show message
    toastService.show('Session expired. Please login again.', 'warning');

    // Redirect to login using Angular Router
    setTimeout(() => {
        router.navigate(['/login']);
    }, 1000);

    return throwError(() => new Error('Session expired'));
}

/**
 * Extract error message from API response
 * Handles multiple .NET error formats:
 * - Array of objects with description/message
 * - Object with properties containing error arrays (e.g., { PhoneNumber: ['error'] })
 * - Object with message property
 * - String error
 */
function extractErrorMessage(error: any, fallbackMessage: string): string {
    // Handle .NET validation errors (array format)
    if (Array.isArray(error)) {
        const errors = error.map((err: any) => err.description || err.message).filter(Boolean);
        return errors.length > 0 ? errors.join(' ') : fallbackMessage;
    }

    // Handle object with message property
    if (error?.message) {
        return error.message;
    }

    // Handle string error
    if (typeof error === 'string') {
        return error;
    }

    // Handle object with properties containing error arrays
    // Example: { PhoneNumber: ['This phone number is already registered.'] }
    if (error && typeof error === 'object' && !Array.isArray(error)) {
        const allErrors: string[] = [];

        // Iterate through all properties
        for (const key in error) {
            if (error.hasOwnProperty(key)) {
                const value = error[key];

                // If value is an array, extract messages
                if (Array.isArray(value)) {
                    const messages = value.filter(msg => typeof msg === 'string');
                    allErrors.push(...messages);
                }
                // If value is a string, add it
                else if (typeof value === 'string') {
                    allErrors.push(value);
                }
            }
        }

        if (allErrors.length > 0) {
            return allErrors.join(' ');
        }
    }

    // Fallback
    return fallbackMessage;
}

/**
 * Centralized error handling
 */
function handleError(
    error: HttpErrorResponse,
    toastService: ToastService,
    secureStorage: SecureStorageService,
    router: Router,
    requestUrl?: string
): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Error: ${error.error.message}`;
    } else {
        // Server-side error
        console.log('Server Error', error);
        switch (error.status) {
            case 0:
                errorMessage = 'No internet connection. Please check your network.';
                break;
            case 400:
                errorMessage = extractErrorMessage(error.error, 'Bad request. Please check your input.');
                break;
            case 401:
                // Only logout if this is a protected endpoint
                // For public endpoints (like login), just show the error
                if (requestUrl && requiresAuth(requestUrl)) {
                    errorMessage = extractErrorMessage(error.error, 'Unauthorized. Please login again.');
                    return logoutUser(secureStorage, toastService, router);
                } else {
                    errorMessage = extractErrorMessage(error.error, 'Invalid credentials.');
                }
                break;
            case 403:
                errorMessage = extractErrorMessage(error.error, 'Access forbidden. You do not have permission.');
                break;
            case 404:
                errorMessage = extractErrorMessage(error.error, 'Resource not found.');
                break;
            case 422:
                errorMessage = extractErrorMessage(error.error, 'Validation error. Please check your input.');
                break;
            case 500:
                errorMessage = extractErrorMessage(error.error, 'Server error. Please try again later.');
                break;
            case 503:
                errorMessage = extractErrorMessage(error.error, 'Service unavailable. Please try again later.');
                break;
            default:
                errorMessage = extractErrorMessage(error.error, `Error: ${error.status} - ${error.statusText}`);
        }
    }

    // Show error toast (except for 401 which redirects)
    if (error.status !== 401) {
        toastService.show(errorMessage, 'error');
    }

    // Log error in development
    if (!environment.production) {
        console.error('API Error:', {
            status: error.status,
            message: errorMessage,
            url: error.url,
            error: error
        });
    }

    return throwError(() => new Error(errorMessage));
}
