import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupportTicket } from '../../support.types';

@Component({
  selector: 'app-create-support-ticket',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-support-ticket.component.html',
  styleUrl: './create-support-ticket.component.scss'
})
export class CreateSupportTicketComponent implements OnInit {
  @Input() showModal: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() ticketCreated = new EventEmitter<SupportTicket>();

  ticketForm = {
    subject: '',
    category: 'general' as 'technical' | 'billing' | 'account' | 'course' | 'general',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    description: ''
  };

  categoryOptions = [
    { value: 'technical', label: 'Technical', icon: 'bi-gear-fill' },
    { value: 'billing', label: 'Billing', icon: 'bi-credit-card-fill' },
    { value: 'account', label: 'Account', icon: 'bi-person-fill' },
    { value: 'course', label: 'Course', icon: 'bi-book-fill' },
    { value: 'general', label: 'General', icon: 'bi-question-circle-fill' }
  ];

  priorityOptions = [
    { value: 'low', label: 'Low', icon: 'bi-arrow-down-circle-fill', color: 'text-secondary' },
    { value: 'medium', label: 'Medium', icon: 'bi-dash-circle-fill', color: 'text-info' },
    { value: 'high', label: 'High', icon: 'bi-arrow-up-circle-fill', color: 'text-warning' },
    { value: 'urgent', label: 'Urgent', icon: 'bi-exclamation-triangle-fill', color: 'text-danger' }
  ];

  ngOnInit(): void {
    this.resetForm();
  }

  closeModal(): void {
    this.resetForm();
    this.close.emit();
  }

  resetForm(): void {
    this.ticketForm = {
      subject: '',
      category: 'general',
      priority: 'medium',
      description: ''
    };
  }

  submitTicket(): void {
    // Validate form
    if (!this.ticketForm.subject.trim()) {
      alert('Please enter a subject');
      return;
    }

    if (!this.ticketForm.description.trim()) {
      alert('Please enter a description');
      return;
    }

    // Generate ticket number
    const ticketNumber = 'ST-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 1000)).padStart(3, '0');

    // Create new ticket
    const newTicket: SupportTicket = {
      id: 't' + Date.now(),
      ticketNumber: ticketNumber,
      subject: this.ticketForm.subject,
      category: this.ticketForm.category,
      priority: this.ticketForm.priority,
      status: 'open',
      description: this.ticketForm.description,
      createdAt: new Date(),
      updatedAt: new Date(),
      responses: []
    };

    // Emit event
    this.ticketCreated.emit(newTicket);
    this.resetForm();
  }

  getCategoryIcon(category: string): string {
    const option = this.categoryOptions.find(opt => opt.value === category);
    return option?.icon || 'bi-question-circle';
  }

  getPriorityIcon(priority: string): string {
    const option = this.priorityOptions.find(opt => opt.value === priority);
    return option?.icon || 'bi-circle';
  }

  getPriorityColor(priority: string): string {
    const option = this.priorityOptions.find(opt => opt.value === priority);
    return option?.color || 'text-secondary';
  }
}

