# Payment Modal Usage Example

## Basic Usage

```typescript
import { Component } from '@angular/core';
import { PaymentModalComponent, PaymentDetails, PaymentItem } from '../../../components/ui/payment-modal/payment-modal.component';
import { PaymentService } from '../../../services/payment.service';

@Component({
  selector: 'app-example',
  imports: [PaymentModalComponent],
  template: `
    <button (click)="openPaymentModal()">Pay Now</button>
    
    <app-payment-modal
      [showModal]="showPaymentModal"
      [paymentDetails]="paymentDetails"
      [paymentProvider]="'both'"
      (close)="closePaymentModal()"
      (payWithPaystack)="handlePaystack($event)"
      (payWithStripe)="handleStripe($event)">
    </app-payment-modal>
  `
})
export class ExampleComponent {
  showPaymentModal = false;
  paymentDetails: PaymentDetails | null = null;

  constructor(private paymentService: PaymentService) {}

  openPaymentModal() {
    const items: PaymentItem[] = [
      {
        id: '1',
        name: 'Web Development Course',
        type: 'course',
        price: 299.99,
        quantity: 1
      },
      {
        id: '2',
        name: 'Plumber Service',
        type: 'marketplace',
        price: 150.00,
        quantity: 1
      }
    ];

    this.paymentDetails = this.paymentService.calculatePaymentDetails(items, 7.5, 0);
    this.showPaymentModal = true;
  }

  closePaymentModal() {
    this.showPaymentModal = false;
  }

  handlePaystack(details: PaymentDetails) {
    this.paymentService.initializePaystack(details, (response) => {
      console.log('Payment successful:', response);
      this.showPaymentModal = false;
      // Handle success (e.g., redirect, show success message)
    });
  }

  handleStripe(details: PaymentDetails) {
    this.paymentService.initializeStripe(details).then(() => {
      // Stripe will redirect to checkout
    });
  }
}
```

## Payment Provider Options

- `'both'` - Shows both Paystack and Stripe buttons
- `'paystack'` - Shows only Paystack button
- `'stripe'` - Shows only Stripe button

## Payment Item Types

- `'course'` - Course purchase
- `'marketplace'` - Marketplace item/service
- `'subscription'` - Subscription purchase
- `'booking'` - Booking payment
- `'other'` - Other items
