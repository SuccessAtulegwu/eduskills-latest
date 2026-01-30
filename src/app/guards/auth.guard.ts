import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth';

/**
 * Auth Guard
 * Protects routes that require authentication
 * Redirects to login if user is not authenticated
 */
export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticated()) {
        return true;
    }

    // Store the attempted URL for redirecting after login
    localStorage.setItem('redirectUrl', state.url);

    // Redirect to login page
    router.navigate(['/login']);
    return false;
};

/**
 * Guest Guard
 * Prevents authenticated users from accessing guest-only pages (login, register)
 * Redirects to home if user is already authenticated
 */
export const guestGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
        return true;
    }

    // Redirect to home page
    router.navigate(['/']);
    return false;
};

/**
 * Role Guard Factory
 * Creates a guard that checks if user has required role(s)
 * Usage: canActivate: [roleGuard(['admin', 'moderator'])]
 */
export function roleGuard(allowedRoles: string[]): CanActivateFn {
    return (route, state) => {
        const authService = inject(AuthService);
        const router = inject(Router);

        if (!authService.isAuthenticated()) {
            router.navigate(['/login']);
            return false;
        }

        const user = authService.getCurrentUser();
        if (user && allowedRoles.includes(user.role)) {
            return true;
        }

        // Redirect to unauthorized page or home
        router.navigate(['/unauthorized']);
        return false;
    };
}
