import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Booking } from '../../../../../services/booking.service';

@Component({
  selector: 'app-booking-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking-details.component.html',
  styleUrl: './booking-details.component.scss'
})
export class BookingDetailsComponent {
  @Input() booking: Booking | null = null;
  @Input() showModal: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() joinMeeting = new EventEmitter<Booking>();
  @Output() rescheduleBooking = new EventEmitter<Booking>();
  @Output() cancelBooking = new EventEmitter<Booking>();
  @Output() downloadReceipt = new EventEmitter<Booking>();
  @Output() viewConsultantProfile = new EventEmitter<Booking>();

  closeModal(): void {
    this.close.emit();
  }

  onJoinMeeting(): void {
    if (this.booking) {
      this.joinMeeting.emit(this.booking);
    }
  }

  onRescheduleBooking(): void {
    if (this.booking) {
      this.rescheduleBooking.emit(this.booking);
    }
  }

  onCancelBooking(): void {
    if (this.booking) {
      this.cancelBooking.emit(this.booking);
    }
  }

  onDownloadReceipt(): void {
    if (this.booking) {
      this.downloadReceipt.emit(this.booking);
    }
  }

  onViewConsultantProfile(): void {
    if (this.booking) {
      this.viewConsultantProfile.emit(this.booking);
    }
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'upcoming': return 'text-primary bg-primary-subtle border-primary-subtle';
      case 'completed': return 'text-success bg-success-subtle border-success-subtle';
      case 'cancelled': return 'text-danger bg-danger-subtle border-danger-subtle';
      case 'rescheduled': return 'text-warning bg-warning-subtle border-warning-subtle';
      default: return 'text-secondary bg-secondary-subtle border-secondary-subtle';
    }
  }

  getStatusIcon(status: string): string {
    switch(status) {
      case 'upcoming': return 'bi-clock-fill';
      case 'completed': return 'bi-check-circle-fill';
      case 'cancelled': return 'bi-x-circle-fill';
      case 'rescheduled': return 'bi-arrow-repeat';
      default: return 'bi-question-circle-fill';
    }
  }

  getStatusText(status: string): string {
    switch(status) {
      case 'upcoming': return 'Upcoming';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      case 'rescheduled': return 'Rescheduled';
      default: return status;
    }
  }

  getPaymentStatusClass(status: string): string {
    switch(status) {
      case 'paid': return 'text-success bg-success-subtle border-success-subtle';
      case 'pending': return 'text-warning bg-warning-subtle border-warning-subtle';
      case 'refunded': return 'text-info bg-info-subtle border-info-subtle';
      default: return 'text-secondary bg-secondary-subtle border-secondary-subtle';
    }
  }

  getServiceTypeIcon(type: string): string {
    switch(type) {
      case 'consultation': return 'bi-chat-dots-fill';
      case 'mentoring': return 'bi-person-check-fill';
      case 'tutoring': return 'bi-book-fill';
      case 'review': return 'bi-clipboard-check-fill';
      default: return 'bi-calendar-check';
    }
  }

  getDaysUntilBooking(bookingDate: Date): number {
    const now = new Date();
    const booking = new Date(bookingDate);
    const diffTime = booking.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}

