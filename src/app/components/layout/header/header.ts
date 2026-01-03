import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth';
import { ThemeService } from '../../../services/theme';
import { LucideAngularModule, Menu, Search } from 'lucide-angular';
import { Subscription } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../../models/model';
import { ConfirmationService } from '../../../services/confirmation.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, LucideAngularModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit, OnDestroy {
  @Output() sidebarToggle = new EventEmitter<void>();
  @Output() sidebarCollapseToggle = new EventEmitter<void>();
  @Output() rightPanelToggle = new EventEmitter<void>();

  currentUser: User | null = null;
  isDarkMode = false;
  showUserDropdown = false;
  showNotificationDropdown = false;
  fullname: string = 'Musa Abdullahi';
  isAuthenticated = false;
  accountType: string = '';
  private authSubscription?: Subscription;

  // Register Lucide icons
  readonly Menu = Menu;

  constructor(
    private authService: AuthService,
    private themeService: ThemeService,
    private router: Router,
    private confirmationService: ConfirmationService
  ) { }


  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.fullname = this.currentUser?.firstname + ' ' + this.currentUser?.lastname;
      this.accountType = this.currentUser?.accountType!;
    });
    this.authSubscription = this.authService.isAuthenticated$.subscribe(isAuth => {
      // Filter menu items based on authentication status
      this.isAuthenticated = isAuth;
    });

    this.themeService.theme$.subscribe(theme => {
      this.isDarkMode = theme === 'dark';
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown')) {
        this.showUserDropdown = false;
        this.showNotificationDropdown = false;
      }
    });
  }

  placeholdername() {
    return `https://eu.ui-avatars.com/api/?name=${this.fullname}&background=FF8D00&color=fff&size=35&rounded=true&font-size=0.50&bold=true`;
  }

  toggleSidebar(): void {
    this.sidebarToggle.emit();
  }

  toggleSidebarCollapse(): void {
    this.sidebarCollapseToggle.emit();
  }

  toggleRightPanel(): void {
    this.rightPanelToggle.emit();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleUserDropdown(event: Event): void {
    event.stopPropagation();
    this.showUserDropdown = !this.showUserDropdown;
    this.showNotificationDropdown = false;
  }

  toggleNotificationDropdown(event: Event): void {
    event.stopPropagation();
    this.showNotificationDropdown = !this.showNotificationDropdown;
    this.showUserDropdown = false;
  }

  closeDropdowns(): void {
    this.showUserDropdown = false;
    this.showNotificationDropdown = false;
  }

  async logout() {
    this.closeDropdowns();
    const confirmed = await this.confirmationService.confirm({
      title: 'Logout',
      message: 'Are you sure you want to logout from this account?',
      confirmText: 'Logout',
      cancelText: 'Cancel',
      type: 'info'
    });
    if (confirmed) {
      this.authService.logout();
    }
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }
}
