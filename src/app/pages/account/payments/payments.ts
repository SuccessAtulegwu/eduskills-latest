import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageHeader } from '../../../components/page-header/page-header';
import { ButtonComponent } from '../../../components/ui/button/button';
import { InputComponent } from '../../../components/ui/input/input';
import { AccountTypeSelectorComponent } from '../../../components/account-type-selector/account-type-selector.component';


export interface Payment {
  id: string;
  date: Date;
  description: string;
  amount: number;
  status: 'success' | 'failed' | 'pending';
  method: string;
  transactionId: string;
  category: string;
}



@Component({
  selector: 'app-payments',
  imports: [CommonModule, FormsModule, PageHeader, InputComponent, AccountTypeSelectorComponent],
  templateUrl: './payments.html',
  styleUrl: './payments.scss',
})        
export class Payments implements OnInit {
  payments: Payment[] = [];
  filteredPayments: Payment[] = [];
  selectedStatus: string = 'all';
  searchQuery: string = '';
  
  // Statistics
  totalAmount: number = 0;
  successfulPayments: number = 0;
  failedPayments: number = 0;
  pendingPayments: number = 0;

  statusOptions = [
    { title: 'All Status', description: 'Show all payments', value: 'all', icon: 'bi-list' },
    { title: 'Successful', description: 'Completed payments', value: 'success', icon: 'bi-check-circle-fill' },
    { title: 'Pending', description: 'Processing payments', value: 'pending', icon: 'bi-clock-fill' },
    { title: 'Failed', description: 'Failed transactions', value: 'failed', icon: 'bi-x-circle-fill' }
  ];

  ngOnInit(): void {
    this.loadPayments();
    this.calculateStatistics();
    this.filteredPayments = [...this.payments];
  }

  loadPayments(): void {
    // Sample payment data - replace with actual API call
    this.payments = [
      {
        id: '1',
        date: new Date('2024-01-15'),
        description: 'Web Development Course',
        amount: 299.99,
        status: 'success',
        method: 'Credit Card',
        transactionId: 'TXN-2024-001',
        category: 'Course'
      },
      {
        id: '2',
        date: new Date('2024-01-10'),
        description: 'Premium Subscription - Monthly',
        amount: 49.99,
        status: 'success',
        method: 'PayPal',
        transactionId: 'TXN-2024-002',
        category: 'Subscription'
      },
      {
        id: '3',
        date: new Date('2024-01-08'),
        description: 'Python Programming Masterclass',
        amount: 199.99,
        status: 'failed',
        method: 'Credit Card',
        transactionId: 'TXN-2024-003',
        category: 'Course'
      },
      {
        id: '4',
        date: new Date('2024-01-05'),
        description: 'UI/UX Design Workshop',
        amount: 149.99,
        status: 'pending',
        method: 'Bank Transfer',
        transactionId: 'TXN-2024-004',
        category: 'Workshop'
      },
      {
        id: '5',
        date: new Date('2024-01-03'),
        description: 'Data Science Bootcamp',
        amount: 499.99,
        status: 'success',
        method: 'Credit Card',
        transactionId: 'TXN-2024-005',
        category: 'Bootcamp'
      },
      {
        id: '6',
        date: new Date('2024-01-01'),
        description: 'Annual Subscription',
        amount: 499.99,
        status: 'success',
        method: 'PayPal',
        transactionId: 'TXN-2024-006',
        category: 'Subscription'
      },
      {
        id: '7',
        date: new Date('2023-12-28'),
        description: 'Machine Learning Course',
        amount: 349.99,
        status: 'failed',
        method: 'Credit Card',
        transactionId: 'TXN-2023-107',
        category: 'Course'
      },
      {
        id: '8',
        date: new Date('2023-12-25'),
        description: 'Professional Certification',
        amount: 599.99,
        status: 'pending',
        method: 'Bank Transfer',
        transactionId: 'TXN-2023-108',
        category: 'Certification'
      },
      {
        id: '9',
        date: new Date('2023-12-20'),
        description: 'JavaScript Advanced Course',
        amount: 249.99,
        status: 'success',
        method: 'Credit Card',
        transactionId: 'TXN-2023-109',
        category: 'Course'
      },
      {
        id: '10',
        date: new Date('2023-12-15'),
        description: 'Monthly Subscription',
        amount: 49.99,
        status: 'success',
        method: 'PayPal',
        transactionId: 'TXN-2023-110',
        category: 'Subscription'
      }
    ];
  }

  calculateStatistics(): void {
    this.successfulPayments = this.payments.filter(p => p.status === 'success').length;
    this.failedPayments = this.payments.filter(p => p.status === 'failed').length;
    this.pendingPayments = this.payments.filter(p => p.status === 'pending').length;
    this.totalAmount = this.payments
      .filter(p => p.status === 'success')
      .reduce((sum, p) => sum + p.amount, 0);
  }

  filterPayments(): void {
    let filtered = [...this.payments];

    // Filter by status
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(p => p.status === this.selectedStatus);
    }

    // Filter by search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.description.toLowerCase().includes(query) ||
        p.transactionId.toLowerCase().includes(query) ||
        p.method.toLowerCase().includes(query)
      );
    }

    this.filteredPayments = filtered;
  }

  onStatusChange(): void {
    this.filterPayments();
  }

  onSearchChange(): void {
    this.filterPayments();
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'success': return 'badge-success';
      case 'failed': return 'badge-danger';
      case 'pending': return 'badge-warning';
      default: return 'badge-secondary';
    }
  }

  getStatusIcon(status: string): string {
    switch(status) {
      case 'success': return 'bi-check-circle-fill';
      case 'failed': return 'bi-x-circle-fill';
      case 'pending': return 'bi-clock-fill';
      default: return 'bi-question-circle-fill';
    }
  }

  downloadReceipt(payment: Payment): void {
    console.log('Downloading receipt for:', payment.transactionId);
    // Implement download logic
  }

  retryPayment(payment: Payment): void {
    console.log('Retrying payment:', payment.transactionId);
    // Implement retry logic
  }

  viewDetails(payment: Payment): void {
    console.log('Viewing details for:', payment.transactionId);
    // Implement view details logic
  }

  exportPayments(): void {
    console.log('Exporting payments...');
    // Implement export logic
  }

  onClear(): void {
    this.searchQuery = '';
    this.selectedStatus = 'all';
    this.filteredPayments = [...this.payments];
  }
}
