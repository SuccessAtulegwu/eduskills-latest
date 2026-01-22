import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface PaymentItem {
  id: string;
  name: string;
  type: 'course' | 'marketplace' | 'subscription' | 'booking' | 'other';
  price: number;
  quantity?: number;
}

export interface PaymentDetails {
  items: PaymentItem[];
  subtotal: number;
  tax?: number;
  discount?: number;
  total: number;
  currency?: string;
}

@Component({
  selector: 'app-payment-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-modal.component.html',
  styleUrl: './payment-modal.component.scss'
})
export class PaymentModalComponent {
  @Input() showModal: boolean = false;
  @Input() paymentDetails: PaymentDetails | null = null;
  @Input() paymentProvider: 'paystack' | 'stripe' | 'both' = 'both';
  @Output() close = new EventEmitter<void>();
  @Output() payWithPaystack = new EventEmitter<PaymentDetails>();
  @Output() payWithStripe = new EventEmitter<PaymentDetails>();

  closeModal(): void {
    this.close.emit();
  }

  handlePaystackPayment(): void {
    if (this.paymentDetails) {
      this.payWithPaystack.emit(this.paymentDetails);
    }
  }

  handleStripePayment(): void {
    if (this.paymentDetails) {
      this.payWithStripe.emit(this.paymentDetails);
    }
  }

  getItemTypeIcon(type: string): string {
    switch(type) {
      case 'course': return 'bi-book';
      case 'marketplace': return 'bi-bag';
      case 'subscription': return 'bi-credit-card';
      case 'booking': return 'bi-calendar-check';
      default: return 'bi-box';
    }
  }

  getItemTypeLabel(type: string): string {
    switch(type) {
      case 'course': return 'Course';
      case 'marketplace': return 'Marketplace';
      case 'subscription': return 'Subscription';
      case 'booking': return 'Booking';
      default: return 'Item';
    }
  }

  getCurrencySymbol(currency?: string): string {
    return currency === 'NGN' ? '₦' : currency === 'USD' ? '$' : '₦';
  }
}
