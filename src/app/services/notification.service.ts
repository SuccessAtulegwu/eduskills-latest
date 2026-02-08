import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Notification {
  id: string;
  type: 'course' | 'assignment' | 'system' | 'job' | 'booking' | 'payment' | 'support' | 'general';
  title: string;
  message: string;
  icon: string;
  read: boolean;
  createdAt: Date;
  link?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  courseNotifications: boolean;
  assignmentNotifications: boolean;
  jobAlerts: boolean;
  bookingNotifications: boolean;
  paymentNotifications: boolean;
  supportNotifications: boolean;
  systemNotifications: boolean;
  quietHours: {
    enabled: boolean;
    start: string; // HH:mm format
    end: string; // HH:mm format
  };
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly endpoint = '/Notification';


  // Subject for components to subscribe to
  public notifications$ = new BehaviorSubject<Notification[]>([]);
  public settings$ = new BehaviorSubject<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    courseNotifications: true,
    assignmentNotifications: true,
    jobAlerts: true,
    bookingNotifications: true,
    paymentNotifications: true,
    supportNotifications: true,
    systemNotifications: true,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    }
  });

  constructor(private api: ApiService) {
    // Load initial notifications from API
    this.loadNotifications();
  }

  loadNotifications(query?: { unreadOnly?: boolean; limit?: number }) {
    this.getNotificationsApi(query).subscribe({
      next: (response: any) => {
        // Assuming response.data is where the array is, or response itself if it's an array
        // The API service usually returns ApiResponse<T>.
        // If we look at ApiService handleResponse, it returns data if success.
        // So response should be the data.
        // We need to map it to Notification interface if backend DTO differs.
        // For now assuming compatibility or just casting.
        const notifs = Array.isArray(response) ? response : (response.data || []);

        // Map backend fields to frontend Notification interface if needed
        // Mocking mapping for robustness since I don't perfectly know backend DTO
        const mappedNotifs: Notification[] = notifs.map((n: any) => ({
          id: n.id,
          type: n.type || 'general',
          title: n.title,
          message: n.message,
          icon: n.icon || 'bi-bell',
          read: n.isRead || n.read,
          createdAt: n.createdAt ? new Date(n.createdAt) : new Date(),
          link: n.link,
          priority: n.priority || 'low'
        }));

        this.notifications$.next(mappedNotifs);
      },
      error: (err) => console.error('Failed to load notifications', err)
    });
  }

  // API Methods
  getNotificationsApi(query?: { unreadOnly?: boolean; limit?: number }): Observable<any> {
    return this.api.get(`${this.endpoint}/GetNotifications`, query);
  }

  getUnreadCount(): number {
    return this.notifications$.value.filter(n => !n.read).length;
  }

  // API for unread count if needed separately, but we have local count
  getUnreadCountApi(): Observable<any> {
    return this.api.get(`${this.endpoint}/GetUnreadCount/unread-count`);
  }

  getRecent(count?: number): Observable<any> {
    return this.api.get(`${this.endpoint}/GetRecent/recent`, { count });
  }

  markAsRead(id: string): void {
    // Optimistic update
    const current = this.notifications$.value;
    const updated = current.map(n => n.id === id ? { ...n, read: true } : n);
    this.notifications$.next(updated);

    this.api.post(`${this.endpoint}/MarkAsRead/${id}/mark-as-read`, {}).subscribe();
  }

  markAllAsRead(): void {
    // Optimistic update
    const current = this.notifications$.value;
    const updated = current.map(n => ({ ...n, read: true }));
    this.notifications$.next(updated);

    this.api.post(`${this.endpoint}/MarkAllAsRead/mark-all-as-read`, {}).subscribe();
  }

  deleteNotification(id: string): void {
    // Optimistic update
    const current = this.notifications$.value;
    const updated = current.filter(n => n.id !== id);
    this.notifications$.next(updated);

    this.api.delete(`${this.endpoint}/DeleteNotification/${id}`).subscribe();
  }

  updateSettings(settings: Partial<NotificationSettings>): void {
    const current = this.settings$.value;
    const updated = { ...current, ...settings };
    this.settings$.next(updated);
    // Persist to backend if API exists, or local storage
    // localStorage.setItem('notificationSettings', JSON.stringify(updated));
  }
}
