import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuService, MenuItem } from '../../../services/menu.service';
import { AuthService } from '../../../services/auth';
import { Subscription } from 'rxjs';
import { LucideAngularModule } from 'lucide-angular';
import { ConfirmationService } from '../../../services/confirmation.service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar implements OnInit, OnDestroy {
  @Input() isOpen = false;
  @Input() isCollapsed = false;
  @Output() sidebarClose = new EventEmitter<void>();

  // Start with all submenus open
  openSubmenus: Set<string> = new Set(['content', 'discover', 'account', 'auth-actions']);

  // Dynamic menu items
  menuItems: MenuItem[] = [];
  collapsedMenuItems: MenuItem[] = []; // Items with icons for collapsed view
  private menuSubscription?: Subscription;
  private authSubscription?: Subscription;

  constructor(
    private menuService: MenuService,
    private authService: AuthService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    // Subscribe to authentication status changes
    this.authSubscription = this.authService.isAuthenticated$.subscribe(isAuth => {
      // Filter menu items based on authentication status
      this.menuService.filterByAuthStatus(isAuth);
    });

    // Subscribe to menu items from the service
    this.menuSubscription = this.menuService.menuItems$.subscribe(items => {
      this.menuItems = items.filter(item => item.visible !== false);
      // Filter items with icons for collapsed view
      this.collapsedMenuItems = this.filterItemsWithIcons(this.menuItems);
    });
  }

  /**
   * Filter menu items to only include those with icons (including children)
   */
  private filterItemsWithIcons(items: MenuItem[]): MenuItem[] {
    const result: MenuItem[] = [];

    items.forEach(item => {
      // If item has icon, include it
      if (item.icon) {
        result.push(item);
      }

      // If item has children, recursively filter them
      if (item.children && item.children.length > 0) {
        const childrenWithIcons = item.children.filter(child => child.icon);
        childrenWithIcons.forEach(child => {
          result.push(child);
        });
      }
    });

    return result;
  }

  ngOnDestroy(): void {
    this.menuSubscription?.unsubscribe();
    this.authSubscription?.unsubscribe();
  }

  closeSidebar(): void {
    this.sidebarClose.emit();
  }

  onMenuItemClick(id: string): void {
    // Check if we're on mobile/tablet (below lg breakpoint)
    if (window.innerWidth < 992) {
      this.closeSidebar();
    }
    if (id === 'logout') {
      this.handleLogout();
    }
  }

  toggleSubmenu(event: Event, submenu: string): void {
    event.preventDefault();
    if (this.isCollapsed) {
      return; // Don't toggle submenu when sidebar is collapsed
    }

    if (this.openSubmenus.has(submenu)) {
      this.openSubmenus.delete(submenu);
    } else {
      this.openSubmenus.add(submenu);
    }
  }

  isSubmenuOpen(submenu: string): boolean {
    return this.openSubmenus.has(submenu);
  }

  hasChildren(item: MenuItem): boolean {
    return item.children !== undefined && item.children.length > 0;
  }

  async handleLogout() {
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
}
