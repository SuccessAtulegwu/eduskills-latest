import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { ThemeService } from '../../../services/theme';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.scss']
})
export class AdminLayout implements OnInit {
  sidebarCollapsed = false;
  currentUser: any;
  currentTheme: string = 'light';
  currentPage: string = 'Dashboard';
  notificationCount: number = 5;

  constructor(
    private authService: AuthService,
    private themeService: ThemeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Get current user
    this.currentUser = this.authService.getCurrentUser();

    // Check if user is admin
    if (this.currentUser?.role?.toLowerCase() !== 'admin') {
      // Redirect non-admin users
      this.router.navigate(['/home']);
      return;
    }

    // Subscribe to theme changes
    this.themeService.theme$.subscribe(theme => {
      this.currentTheme = theme;
    });

    // Update current page based on route
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateCurrentPage(event.url);
      });

    // Set initial page
    this.updateCurrentPage(this.router.url);

    // Check screen size for initial sidebar state
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  getInitials(): string {
    if (!this.currentUser) return 'AD';

    const firstname = this.currentUser.firstname || '';
    const lastname = this.currentUser.lastname || '';

    return (firstname.charAt(0) + lastname.charAt(0)).toUpperCase() || 'AD';
  }

  backToMainSite(): void {
    this.router.navigate(['/home']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private updateCurrentPage(url: string): void {
    const segments = url.split('/').filter(s => s);
    const lastSegment = segments[segments.length - 1] || 'dashboard';

    // Capitalize first letter
    this.currentPage = lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
  }

  private checkScreenSize(): void {
    if (window.innerWidth < 992) {
      this.sidebarCollapsed = true;
    } else {
      this.sidebarCollapsed = false;
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', () => this.checkScreenSize());
  }
}
