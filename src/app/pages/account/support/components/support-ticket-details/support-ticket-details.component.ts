import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupportTicket } from '../../support.types';

@Component({
  selector: 'app-support-ticket-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './support-ticket-details.component.html',
  styleUrl: './support-ticket-details.component.scss'
})
export class SupportTicketDetailsComponent {
  @Input() ticket: SupportTicket | null = null;
  @Input() showModal: boolean = false;
  @Output() close = new EventEmitter<void>();

  closeModal(): void {
    this.close.emit();
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

  getAuthorRoleClass(role: string): string {
    switch(role) {
      case 'support': return 'bg-primary-subtle text-primary';
      case 'admin': return 'bg-success-subtle text-success';
      case 'user': return 'bg-body-tertiary text-body';
      default: return 'bg-body-tertiary text-body';
    }
  }
}

