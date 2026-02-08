import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  CreatePaymentRequest,
  RefundPaymentDto
} from '../models/api.models';
import { PaymentDetails, PaymentItem } from '../components/ui/payment-modal/payment-modal.component';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private readonly endpoint = '/Payment';
  private paystackPublicKey: string = 'pk_test_xxxxxxxxxxxxx'; // Replace with your Paystack public key
  private stripePublicKey: string = 'pk_test_xxxxxxxxxxxxx'; // Replace with your Stripe public key

  constructor(private api: ApiService) { }

  // API Methods
  createPayment(body: CreatePaymentRequest): Observable<any> {
    return this.api.post(`${this.endpoint}/CreatePayment`, body);
  }

  callback(reference?: string): Observable<any> {
    return this.api.get(`${this.endpoint}/Callback/callback`, { reference });
  }

  getMyPayments(): Observable<any> {
    return this.api.get(`${this.endpoint}/GetMyPayments`);
  }

  getPayment(reference: string): Observable<any> {
    return this.api.get(`${this.endpoint}/GetPayment/${reference}`);
  }

  refundPayment(reference: string, body: RefundPaymentDto): Observable<any> {
    return this.api.post(`${this.endpoint}/RefundPayment/${reference}/refund`, body);
  }

  // Helper Methods for UI Components

  /**
   * Initialize Paystack payment
   */
  initializePaystack(paymentDetails: PaymentDetails, callback?: (response: any) => void): void {
    // Calculate amount in kobo (Paystack uses smallest currency unit)
    const amountInKobo = Math.round(paymentDetails.total * 100);

    // Create payment handler
    const handler = (window as any).PaystackPop?.setup({
      key: this.paystackPublicKey,
      email: 'user@example.com', // Get from current user
      amount: amountInKobo,
      currency: paymentDetails.currency || 'NGN',
      ref: 'TXN-' + Date.now(),
      metadata: {
        items: JSON.stringify(paymentDetails.items),
        custom_fields: [
          {
            display_name: 'Items',
            variable_name: 'items',
            value: paymentDetails.items.map(i => i.name).join(', ')
          }
        ]
      },
      callback: (response: any) => {
        if (callback) {
          callback(response);
        }
        // Handle successful payment
        console.log('Payment successful:', response);
      },
      onClose: () => {
        // Handle payment cancellation
        console.log('Payment cancelled');
      }
    });

    handler?.openIframe();
  }

  /**
   * Initialize Stripe payment
   */
  async initializeStripe(paymentDetails: PaymentDetails, callback?: (response: any) => void): Promise<void> {
    // Load Stripe.js if not already loaded
    if (!(window as any).Stripe) {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      script.onload = () => this.processStripePayment(paymentDetails, callback);
      document.head.appendChild(script);
    } else {
      await this.processStripePayment(paymentDetails, callback);
    }
  }

  private async processStripePayment(paymentDetails: PaymentDetails, callback?: (response: any) => void): Promise<void> {
    const stripe = (window as any).Stripe(this.stripePublicKey);

    // Create payment intent on your backend first
    // For demo purposes, we'll show how to redirect to Stripe Checkout
    const sessionId = await this.createStripeCheckoutSession(paymentDetails);

    if (sessionId) {
      stripe.redirectToCheckout({
        sessionId: sessionId
      }).then((result: any) => {
        if (result.error) {
          console.error('Stripe error:', result.error);
        }
      });
    }
  }

  /**
   * Create Stripe Checkout Session (should be called from your backend)
   * This is a placeholder - implement this on your backend
   */
  private async createStripeCheckoutSession(paymentDetails: PaymentDetails): Promise<string | null> {
    // This should be an API call to your backend
    // Backend should create a Stripe Checkout Session and return session ID
    try {
      // Example API call (replace with your actual endpoint)
      // const response = await fetch('/api/create-checkout-session', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     items: paymentDetails.items,
      //     total: paymentDetails.total,
      //     currency: paymentDetails.currency || 'USD'
      //   })
      // });
      // const { sessionId } = await response.json();
      // return sessionId;

      // For demo, return null (implement actual backend call)
      console.log('Create Stripe Checkout Session for:', paymentDetails);
      return null;
    } catch (error) {
      console.error('Error creating Stripe session:', error);
      return null;
    }
  }

  /**
   * Calculate payment details from items
   */
  calculatePaymentDetails(items: PaymentItem[], taxRate: number = 0, discount: number = 0): PaymentDetails {
    const subtotal = items.reduce((sum, item) => {
      const quantity = item.quantity || 1;
      return sum + (item.price * quantity);
    }, 0);

    const tax = subtotal * (taxRate / 100);
    const total = subtotal + tax - discount;

    return {
      items,
      subtotal,
      tax: tax > 0 ? tax : undefined,
      discount: discount > 0 ? discount : undefined,
      total,
      currency: 'NGN'
    };
  }
}
