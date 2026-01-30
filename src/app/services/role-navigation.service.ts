import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth';

/**
 * Role-based Navigation Service
 * Handles navigation based on user roles
 */
@Injectable({
    providedIn: 'root'
})
export class RoleNavigationService {
    constructor(
        private router: Router,
        private authService: AuthService
    ) { }

    /**
     * Navigate user to appropriate dashboard based on role
     */
    navigateByRole(): void {
        const user = this.authService.getCurrentUser();

        if (!user) {
            this.router.navigate(['/login']);
            return;
        }

        if (user.role.includes('admin')) {
             this.router.navigate(['/admin/dashboard']);
        } else {
            this.router.navigate(['/home']);
        }

        /*  switch (user.role?.toLowerCase()) {
             case 'admin':
                
                 break;
 
             case 'teacher':
             case 'instructor':
                 this.router.navigate(['/account/courses']);
                 break;
 
             case 'student':
             case 'learner':
             default:
               
                 break;
         } */
    }

    /**
     * Check if user has admin role
     */
    isAdmin(): boolean {
        const user = this.authService.getCurrentUser();
        return user?.role?.toLowerCase() === 'admin';
    }

    /**
     * Check if user has teacher role
     */
    isTeacher(): boolean {
        const user = this.authService.getCurrentUser();
        const role = user?.role?.toLowerCase();
        return role === 'teacher' || role === 'instructor';
    }

    /**
     * Check if user has student role
     */
    isStudent(): boolean {
        const user = this.authService.getCurrentUser();
        const role = user?.role?.toLowerCase();
        return role === 'student' || role === 'learner';
    }

    /**
     * Get dashboard route for current user
     */
    getDashboardRoute(): string {
        const user = this.authService.getCurrentUser();

        if (!user) {
            return '/login';
        }

        switch (user.role?.toLowerCase()) {
            case 'admin':
                return '/admin/dashboard';

            case 'teacher':
            case 'instructor':
                return '/account/courses';

            case 'student':
            case 'learner':
            default:
                return '/home';
        }
    }
}
