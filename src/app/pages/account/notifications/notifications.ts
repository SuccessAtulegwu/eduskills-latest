import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PageHeader } from '../../../components/page-header/page-header';
import { InputComponent } from '../../../components/ui/input/input';
import { AccountTypeSelectorComponent } from '../../../components/account-type-selector/account-type-selector.component';
import { ButtonComponent } from '../../../components/ui/button/button';
import { NotificationService, Notification } from '../../../services/notification.service';
import { NotificationSettingsComponent } from './components/notification-settings/notification-settings.component';

@Component({
  selector: 'app-notifications',
  imports: [CommonModule, FormsModule, RouterModule, PageHeader, InputComponent, AccountTypeSelectorComponent, ButtonComponent, NotificationSettingsComponent],
  templateUrl: './notifications.html',
  styleUrl: './notifications.scss',
})
export class Notifications implements OnInit {
  notifications: Notification[] = [];
  filteredNotifications: Notification[] = [];
  selectedType: string = 'all';
  searchQuery: string = '';
  showSettings: boolean = false;

  // Statistics
  totalNotifications: number = 0;
  unreadNotifications: number = 0;
  jobAlerts: number = 0;

  typeOptions = [
    { title: 'All Types', description: 'Show all notifications', value: 'all', icon: 'bi-bell' },
    { title: 'Course', description: 'Course related', value: 'course', icon: 'bi-book' },
    { title: 'Assignment', description: 'Assignments', value: 'assignment', icon: 'bi-clipboard-check' },
    { title: 'Job Alerts', description: 'Job opportunities', value: 'job', icon: 'bi-briefcase' },
    { title: 'Booking', description: 'Booking updates', value: 'booking', icon: 'bi-calendar-check' },
    { title: 'Payment', description: 'Payment updates', value: 'payment', icon: 'bi-credit-card' },
    { title: 'Support', description: 'Support tickets', value: 'support', icon: 'bi-headset' },
    { title: 'System', description: 'System updates', value: 'system', icon: 'bi-tools' },
    { title: 'General', description: 'General notifications', value: 'general', icon: 'bi-star' }
  ];

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.loadNotifications();
    this.calculateStatistics();
  }

  loadNotifications(): void {
    this.notificationService.notifications$.subscribe(notifications => {
      this.notifications = notifications;
      this.filteredNotifications = [...notifications];
      this.calculateStatistics();
    });
  }

  calculateStatistics(): void {
    this.totalNotifications = this.notifications.length;
    this.unreadNotifications = this.notifications.filter(n => !n.read).length;
    this.jobAlerts = this.notifications.filter(n => n.type === 'job' && !n.read).length;
  }

  filterNotifications(): void {
    let filtered = [...this.notifications];

    // Filter by type
    if (this.selectedType !== 'all') {
      filtered = filtered.filter(n => n.type === this.selectedType);
    }

    // Filter by search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(n =>
        n.title.toLowerCase().includes(query) ||
        n.message.toLowerCase().includes(query) ||
        n.type.toLowerCase().includes(query)
      );
    }

    this.filteredNotifications = filtered;
  }

  onTypeChange(): void {
    this.filterNotifications();
  }

  onSearchChange(): void {
    this.filterNotifications();
  }

  onClear(): void {
    this.searchQuery = '';
    this.selectedType = 'all';
    this.filteredNotifications = [...this.notifications];
  }

  markAsRead(notification: Notification): void {
    if (!notification.read) {
      this.notificationService.markAsRead(notification.id);
    }
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead();
  }

  deleteNotification(notification: Notification, event: Event): void {
    event.stopPropagation();
    this.notificationService.deleteNotification(notification.id);
  }

  getTypeIcon(type: string): string {
    switch(type) {
      case 'course': return 'bi-book';
      case 'assignment': return 'bi-clipboard-check';
      case 'job': return 'bi-briefcase';
      case 'booking': return 'bi-calendar-check';
      case 'payment': return 'bi-credit-card';
      case 'support': return 'bi-headset';
      case 'system': return 'bi-tools';
      case 'general': return 'bi-star';
      default: return 'bi-bell';
    }
  }

  getTypeClass(type: string): string {
    switch(type) {
      case 'course': return 'bg-primary-subtle text-primary';
      case 'assignment': return 'bg-warning-subtle text-warning';
      case 'job': return 'bg-success-subtle text-success';
      case 'booking': return 'bg-info-subtle text-info';
      case 'payment': return 'bg-success-subtle text-success';
      case 'support': return 'bg-primary-subtle text-primary';
      case 'system': return 'bg-secondary-subtle text-secondary';
      case 'general': return 'bg-body-tertiary text-body';
      default: return 'bg-body-tertiary text-body';
    }
  }

  getPriorityClass(priority: string): string {
    switch(priority) {
      case 'high': return 'bg-danger text-white';
      case 'medium': return 'bg-warning text-dark';
      case 'low': return 'bg-secondary text-white';
      default: return 'bg-secondary text-white';
    }
  }

  getDaysSince(date: Date): number {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffTime = now.getTime() - notificationDate.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffTime = now.getTime() - notificationDate.getTime();
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return notificationDate.toLocaleDateString();
  }

  openSettings(): void {
    this.showSettings = true;
  }

  closeSettings(): void {
    this.showSettings = false;
  }

  navigateToNotification(notification: Notification): void {
    if (notification.link) {
      window.location.href = notification.link;
    }
    this.markAsRead(notification);
  }
}
