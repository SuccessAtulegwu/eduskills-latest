import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';
import { RightPanel } from '../right-panel/right-panel';
import { Footer } from '../footer/footer';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-main-layout',
  imports: [CommonModule, RouterOutlet, Header, Sidebar, RightPanel, Footer],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout implements OnInit, OnDestroy {
  sidebarOpen = false;
  sidebarCollapsed = false;
  rightPanelOpen = false;
  showRightPanel = true; // Default to show when authenticated
  isAuthenticated = false;
  
  private authSubscription?: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Subscribe to authentication status
    this.authSubscription = this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      // Show right panel by default when authenticated
      this.showRightPanel = isAuth;
    });
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  toggleSidebarCollapse(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  toggleRightPanel(): void {
    this.rightPanelOpen = !this.rightPanelOpen;
  }

  closeRightPanel(): void {
    this.rightPanelOpen = false;
  }

  toggleRightPanelVisibility(): void {
    this.showRightPanel = !this.showRightPanel;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    // Close mobile panels when resizing to desktop
    if (event.target.innerWidth >= 992) {
      this.sidebarOpen = false;
      this.rightPanelOpen = false;
    }
  }
}
