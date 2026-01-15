import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageHeader } from '../../../components/page-header/page-header';
import { InputComponent } from '../../../components/ui/input/input';
import { AccountTypeSelectorComponent } from '../../../components/account-type-selector/account-type-selector.component';
import { ButtonComponent } from '../../../components/ui/button/button';
import { SupportTicketDetailsComponent } from './components/support-ticket-details/support-ticket-details.component';
import { CreateSupportTicketComponent } from './components/create-support-ticket/create-support-ticket.component';
import { SupportTicket } from './support.types';

@Component({
  selector: 'app-support',
  imports: [CommonModule, FormsModule, PageHeader, InputComponent, AccountTypeSelectorComponent, ButtonComponent, SupportTicketDetailsComponent, CreateSupportTicketComponent],
  templateUrl: './support.html',
  styleUrl: './support.scss',
})
export class Support implements OnInit {
  tickets: SupportTicket[] = [];
  filteredTickets: SupportTicket[] = [];
  selectedStatus: string = 'all';
  selectedCategory: string = 'all';
  searchQuery: string = '';

  // Statistics
  totalTickets: number = 0;
  openTickets: number = 0;
  inProgressTickets: number = 0;
  resolvedTickets: number = 0;
  closedTickets: number = 0;

  // Modals
  showDetailsModal: boolean = false;
  showCreateModal: boolean = false;
  selectedTicket: SupportTicket | null = null;

  statusOptions = [
    { title: 'All Tickets', description: 'Show all tickets', value: 'all', icon: 'bi-ticket-perforated' },
    { title: 'Open', description: 'New tickets', value: 'open', icon: 'bi-circle' },
    { title: 'In Progress', description: 'Being worked on', value: 'in-progress', icon: 'bi-arrow-repeat' },
    { title: 'Resolved', description: 'Resolved tickets', value: 'resolved', icon: 'bi-check-circle' },
    { title: 'Closed', description: 'Closed tickets', value: 'closed', icon: 'bi-x-circle' }
  ];

  categoryOptions = [
    { title: 'All Categories', description: 'Show all categories', value: 'all', icon: 'bi-grid' },
    { title: 'Technical', description: 'Technical issues', value: 'technical', icon: 'bi-gear' },
    { title: 'Billing', description: 'Payment and billing', value: 'billing', icon: 'bi-credit-card' },
    { title: 'Account', description: 'Account issues', value: 'account', icon: 'bi-person' },
    { title: 'Course', description: 'Course related', value: 'course', icon: 'bi-book' },
    { title: 'General', description: 'General inquiries', value: 'general', icon: 'bi-question-circle' }
  ];

  ngOnInit(): void {
    this.loadTickets();
    this.calculateStatistics();
    this.filteredTickets = [...this.tickets];
  }

  loadTickets(): void {
    // Sample support tickets data
    this.tickets = [
      {
        id: 't1',
        ticketNumber: 'ST-2024-001',
        subject: 'Unable to access my course materials',
        category: 'course',
        priority: 'high',
        status: 'in-progress',
        description: 'I purchased a course last week but I cannot access the course materials. When I click on the course, it shows an error message.',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-16'),
        assignedTo: 'Support Team',
        responses: [
          {
            id: 'r1',
            message: 'Thank you for contacting us. We are looking into this issue and will get back to you shortly.',
            author: 'Support Team',
            authorRole: 'support',
            createdAt: new Date('2024-01-15T10:30:00')
          },
          {
            id: 'r2',
            message: 'We have identified the issue and are working on a fix. This should be resolved within 24 hours.',
            author: 'Support Team',
            authorRole: 'support',
            createdAt: new Date('2024-01-16T09:15:00')
          }
        ]
      },
      {
        id: 't2',
        ticketNumber: 'ST-2024-002',
        subject: 'Payment not processed',
        category: 'billing',
        priority: 'urgent',
        status: 'resolved',
        description: 'I tried to purchase a subscription but my payment was not processed. The money was deducted from my account but I did not receive the subscription.',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-12'),
        resolvedAt: new Date('2024-01-12'),
        assignedTo: 'Billing Team',
        responses: [
          {
            id: 'r3',
            message: 'We apologize for the inconvenience. Your payment has been processed and your subscription is now active.',
            author: 'Billing Team',
            authorRole: 'support',
            createdAt: new Date('2024-01-12T14:20:00')
          }
        ]
      },
      {
        id: 't3',
        ticketNumber: 'ST-2024-003',
        subject: 'Password reset not working',
        category: 'account',
        priority: 'medium',
        status: 'open',
        description: 'I forgot my password and tried to reset it, but I am not receiving the reset email.',
        createdAt: new Date('2024-01-18'),
        updatedAt: new Date('2024-01-18'),
        responses: []
      },
      {
        id: 't4',
        ticketNumber: 'ST-2024-004',
        subject: 'Video playback issues',
        category: 'technical',
        priority: 'high',
        status: 'in-progress',
        description: 'Videos in my enrolled courses are not playing properly. They keep buffering and sometimes stop completely.',
        createdAt: new Date('2024-01-14'),
        updatedAt: new Date('2024-01-17'),
        assignedTo: 'Technical Team',
        responses: [
          {
            id: 'r4',
            message: 'Could you please provide more details about your internet connection and device? This will help us diagnose the issue.',
            author: 'Technical Team',
            authorRole: 'support',
            createdAt: new Date('2024-01-17T11:00:00')
          }
        ]
      },
      {
        id: 't5',
        ticketNumber: 'ST-2024-005',
        subject: 'Certificate download issue',
        category: 'course',
        priority: 'low',
        status: 'resolved',
        description: 'I completed a course but cannot download my certificate. The download button is not working.',
        createdAt: new Date('2024-01-08'),
        updatedAt: new Date('2024-01-09'),
        resolvedAt: new Date('2024-01-09'),
        responses: [
          {
            id: 'r5',
            message: 'The issue has been fixed. You should now be able to download your certificate. Please try again.',
            author: 'Support Team',
            authorRole: 'support',
            createdAt: new Date('2024-01-09T16:45:00')
          }
        ]
      },
      {
        id: 't6',
        ticketNumber: 'ST-2024-006',
        subject: 'Refund request',
        category: 'billing',
        priority: 'medium',
        status: 'open',
        description: 'I would like to request a refund for a course I purchased. The course did not meet my expectations.',
        createdAt: new Date('2024-01-19'),
        updatedAt: new Date('2024-01-19'),
        responses: []
      },
      {
        id: 't7',
        ticketNumber: 'ST-2024-007',
        subject: 'Account verification',
        category: 'account',
        priority: 'low',
        status: 'closed',
        description: 'I need help verifying my account. I submitted the documents but haven\'t received confirmation.',
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-07'),
        resolvedAt: new Date('2024-01-07'),
        responses: [
          {
            id: 'r6',
            message: 'Your account has been verified. You should now have full access to all features.',
            author: 'Admin',
            authorRole: 'admin',
            createdAt: new Date('2024-01-07T10:30:00')
          }
        ]
      },
      {
        id: 't8',
        ticketNumber: 'ST-2024-008',
        subject: 'Feature request',
        category: 'general',
        priority: 'low',
        status: 'open',
        description: 'I would like to suggest adding a dark mode feature to the platform. This would be very helpful for users who prefer dark themes.',
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20'),
        responses: []
      }
    ];
  }

  calculateStatistics(): void {
    this.totalTickets = this.tickets.length;
    this.openTickets = this.tickets.filter(t => t.status === 'open').length;
    this.inProgressTickets = this.tickets.filter(t => t.status === 'in-progress').length;
    this.resolvedTickets = this.tickets.filter(t => t.status === 'resolved').length;
    this.closedTickets = this.tickets.filter(t => t.status === 'closed').length;
  }

  filterTickets(): void {
    let filtered = [...this.tickets];

    // Filter by status
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(t => t.status === this.selectedStatus);
    }

    // Filter by category
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(t => t.category === this.selectedCategory);
    }

    // Filter by search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(t =>
        t.subject.toLowerCase().includes(query) ||
        t.ticketNumber.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query)
      );
    }

    this.filteredTickets = filtered;
  }

  onStatusChange(): void {
    this.filterTickets();
  }

  onCategoryChange(): void {
    this.filterTickets();
  }

  onSearchChange(): void {
    this.filterTickets();
  }

  onClear(): void {
    this.searchQuery = '';
    this.selectedStatus = 'all';
    this.selectedCategory = 'all';
    this.filteredTickets = [...this.tickets];
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'open': return 'text-warning bg-warning-subtle border-warning-subtle';
      case 'in-progress': return 'text-info bg-info-subtle border-info-subtle';
      case 'resolved': return 'text-success bg-success-subtle border-success-subtle';
      case 'closed': return 'text-secondary bg-secondary-subtle border-secondary-subtle';
      default: return 'text-secondary bg-secondary-subtle border-secondary-subtle';
    }
  }

  getStatusIcon(status: string): string {
    switch(status) {
      case 'open': return 'bi-circle';
      case 'in-progress': return 'bi-arrow-repeat';
      case 'resolved': return 'bi-check-circle-fill';
      case 'closed': return 'bi-x-circle-fill';
      default: return 'bi-question-circle';
    }
  }

  getStatusText(status: string): string {
    switch(status) {
      case 'open': return 'Open';
      case 'in-progress': return 'In Progress';
      case 'resolved': return 'Resolved';
      case 'closed': return 'Closed';
      default: return status;
    }
  }

  getPriorityClass(priority: string): string {
    switch(priority) {
      case 'urgent': return 'bg-danger text-white';
      case 'high': return 'bg-warning text-dark';
      case 'medium': return 'bg-info text-white';
      case 'low': return 'bg-secondary text-white';
      default: return 'bg-secondary text-white';
    }
  }

  getPriorityIcon(priority: string): string {
    switch(priority) {
      case 'urgent': return 'bi-exclamation-triangle-fill';
      case 'high': return 'bi-arrow-up-circle-fill';
      case 'medium': return 'bi-dash-circle-fill';
      case 'low': return 'bi-arrow-down-circle-fill';
      default: return 'bi-circle';
    }
  }

  getCategoryIcon(category: string): string {
    switch(category) {
      case 'technical': return 'bi-gear-fill';
      case 'billing': return 'bi-credit-card-fill';
      case 'account': return 'bi-person-fill';
      case 'course': return 'bi-book-fill';
      case 'general': return 'bi-question-circle-fill';
      default: return 'bi-ticket-perforated';
    }
  }

  getCategoryText(category: string): string {
    switch(category) {
      case 'technical': return 'Technical';
      case 'billing': return 'Billing';
      case 'account': return 'Account';
      case 'course': return 'Course';
      case 'general': return 'General';
      default: return category;
    }
  }

  getDaysSinceCreated(date: Date): number {
    const now = new Date();
    const created = new Date(date);
    const diffTime = now.getTime() - created.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  viewTicket(ticket: SupportTicket): void {
    this.selectedTicket = ticket;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedTicket = null;
  }

  openCreateModal(): void {
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  onTicketCreated(): void {
    // Reload tickets after creating a new one
    this.loadTickets();
    this.calculateStatistics();
    this.filterTickets();
    this.closeCreateModal();
  }
}

