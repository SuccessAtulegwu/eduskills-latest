import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

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
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$: Observable<Notification[]> = this.notificationsSubject.asObservable();

  private settingsSubject = new BehaviorSubject<NotificationSettings>({
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
  public settings$: Observable<NotificationSettings> = this.settingsSubject.asObservable();

  constructor() {
    this.loadSampleNotifications();
    this.loadSettings();
  }

  private loadSampleNotifications(): void {
    const sampleNotifications: Notification[] = [
      {
        id: 'n1',
        type: 'course',
        title: 'New Course Available',
        message: 'A new course "Advanced Angular Development" has been added to your learning path',
        icon: 'bi-book',
        read: false,
        createdAt: new Date('2024-01-20T10:30:00'),
        link: '/content/courses',
        priority: 'medium'
      },
      {
        id: 'n2',
        type: 'assignment',
        title: 'Assignment Due Tomorrow',
        message: 'Your assignment "Project Submission" is due tomorrow at 11:59 PM',
        icon: 'bi-clipboard-check',
        read: false,
        createdAt: new Date('2024-01-19T14:20:00'),
        link: '/account/courses',
        priority: 'high'
      },
      {
        id: 'n3',
        type: 'job',
        title: 'New Job Alert',
        message: 'A new job matching your profile: "Senior Frontend Developer" at Tech Corp',
        icon: 'bi-briefcase',
        read: false,
        createdAt: new Date('2024-01-20T09:15:00'),
        link: '/content/intenship',
        priority: 'high'
      },
      {
        id: 'n4',
        type: 'system',
        title: 'System Maintenance',
        message: 'Scheduled maintenance will occur on January 22, 2024 from 2:00 AM to 4:00 AM',
        icon: 'bi-tools',
        read: true,
        createdAt: new Date('2024-01-18T16:00:00'),
        priority: 'medium'
      },
      {
        id: 'n5',
        type: 'booking',
        title: 'Booking Confirmed',
        message: 'Your booking with John Doe (Plumber) has been confirmed for January 25, 2024 at 2:00 PM',
        icon: 'bi-calendar-check',
        read: false,
        createdAt: new Date('2024-01-20T08:45:00'),
        link: '/account/bookings',
        priority: 'medium'
      },
      {
        id: 'n6',
        type: 'payment',
        title: 'Payment Successful',
        message: 'Your payment of $49.99 for "Web Development Course" has been processed successfully',
        icon: 'bi-check-circle',
        read: true,
        createdAt: new Date('2024-01-19T11:30:00'),
        link: '/account/payments',
        priority: 'low'
      },
      {
        id: 'n7',
        type: 'support',
        title: 'Support Ticket Update',
        message: 'Your support ticket ST-2024-001 has been updated. Check the response from our team',
        icon: 'bi-headset',
        read: false,
        createdAt: new Date('2024-01-20T12:00:00'),
        link: '/account/support',
        priority: 'medium'
      },
      {
        id: 'n8',
        type: 'job',
        title: 'Job Application Status',
        message: 'Your application for "Full Stack Developer" at StartupXYZ is under review',
        icon: 'bi-briefcase',
        read: false,
        createdAt: new Date('2024-01-19T15:20:00'),
        link: '/account/progress',
        priority: 'high'
      },
      {
        id: 'n9',
        type: 'course',
        title: 'Course Completion',
        message: 'Congratulations! You have completed "Introduction to React" course',
        icon: 'bi-trophy',
        read: true,
        createdAt: new Date('2024-01-18T10:00:00'),
        link: '/account/courses',
        priority: 'low'
      },
      {
        id: 'n10',
        type: 'general',
        title: 'Welcome to EduSkills',
        message: 'Thank you for joining EduSkills! Explore our courses and start your learning journey',
        icon: 'bi-star',
        read: true,
        createdAt: new Date('2024-01-15T09:00:00'),
        priority: 'low'
      }
    ];
    this.notificationsSubject.next(sampleNotifications);
  }

  private loadSettings(): void {
    // Load from localStorage if available, otherwise use defaults
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      try {
        this.settingsSubject.next(JSON.parse(savedSettings));
      } catch (e) {
        // Use defaults if parsing fails
      }
    }
  }

  getNotifications(): Notification[] {
    return this.notificationsSubject.value;
  }

  getUnreadCount(): number {
    return this.notificationsSubject.value.filter(n => !n.read).length;
  }

  markAsRead(id: string): void {
    const notifications = this.notificationsSubject.value.map(n =>
      n.id === id ? { ...n, read: true } : n
    );
    this.notificationsSubject.next(notifications);
  }

  markAllAsRead(): void {
    const notifications = this.notificationsSubject.value.map(n => ({ ...n, read: true }));
    this.notificationsSubject.next(notifications);
  }

  deleteNotification(id: string): void {
    const notifications = this.notificationsSubject.value.filter(n => n.id !== id);
    this.notificationsSubject.next(notifications);
  }

  clearAll(): void {
    this.notificationsSubject.next([]);
  }

  addNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'read'>): void {
    const newNotification: Notification = {
      ...notification,
      id: 'n' + Date.now(),
      read: false,
      createdAt: new Date()
    };
    const notifications = [newNotification, ...this.notificationsSubject.value];
    this.notificationsSubject.next(notifications);
  }

  getSettings(): NotificationSettings {
    return this.settingsSubject.value;
  }

  updateSettings(settings: Partial<NotificationSettings>): void {
    const currentSettings = this.settingsSubject.value;
    const updatedSettings = { ...currentSettings, ...settings };
    this.settingsSubject.next(updatedSettings);
    localStorage.setItem('notificationSettings', JSON.stringify(updatedSettings));
  }

  getNotificationsByType(type: Notification['type']): Notification[] {
    return this.notificationsSubject.value.filter(n => n.type === type);
  }

  getUnreadNotifications(): Notification[] {
    return this.notificationsSubject.value.filter(n => !n.read);
  }
}
