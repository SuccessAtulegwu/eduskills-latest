import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService, NotificationSettings } from '../../../../../services/notification.service';

@Component({
  selector: 'app-notification-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notification-settings.component.html',
  styleUrl: './notification-settings.component.scss'
})
export class NotificationSettingsComponent implements OnInit {
  @Input() showModal: boolean = false;
  @Output() close = new EventEmitter<void>();

  settings: NotificationSettings = {
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
  };

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.notificationService.settings$.subscribe(settings => {
      this.settings = { ...settings };
    });
  }

  closeModal(): void {
    this.close.emit();
  }

  saveSettings(): void {
    this.notificationService.updateSettings(this.settings);
    this.closeModal();
  }

  toggleEmailNotifications(): void {
    this.settings.emailNotifications = !this.settings.emailNotifications;
  }

  togglePushNotifications(): void {
    this.settings.pushNotifications = !this.settings.pushNotifications;
  }

  toggleQuietHours(): void {
    this.settings.quietHours.enabled = !this.settings.quietHours.enabled;
  }
}
