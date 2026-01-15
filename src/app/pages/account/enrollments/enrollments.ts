import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageHeader } from '../../../components/page-header/page-header';
import { InputComponent } from '../../../components/ui/input/input';
import { AccountTypeSelectorComponent } from '../../../components/account-type-selector/account-type-selector.component';

export interface Enrollment {
  id: string;
  programName: string;
  programType: string;
  enrollmentDate: Date;
  expiryDate: Date;
  status: 'active' | 'expired' | 'pending' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'failed';
  amount: number;
  duration: string;
  instructor: string;
  accessLevel: string;
  thumbnail: string;
}

@Component({
  selector: 'app-enrollments',
  imports: [CommonModule, FormsModule, PageHeader, InputComponent, AccountTypeSelectorComponent],
  templateUrl: './enrollments.html',
  styleUrl: './enrollments.scss',
})
export class Enrollments implements OnInit {
  enrollments: Enrollment[] = [];
  filteredEnrollments: Enrollment[] = [];
  selectedStatus: string = 'all';
  searchQuery: string = '';
  
  // Statistics
  totalEnrollments: number = 0;
  activeEnrollments: number = 0;
  expiredEnrollments: number = 0;
  pendingEnrollments: number = 0;

  // Modal
  showModal: boolean = false;
  selectedEnrollment: Enrollment | null = null;

  statusOptions = [
    { title: 'All Enrollments', description: 'Show all enrollments', value: 'all', icon: 'bi-list' },
    { title: 'Active', description: 'Currently active', value: 'active', icon: 'bi-check-circle-fill' },
    { title: 'Expired', description: 'Enrollment ended', value: 'expired', icon: 'bi-x-circle-fill' },
    { title: 'Pending', description: 'Awaiting activation', value: 'pending', icon: 'bi-clock-fill' },
    { title: 'Cancelled', description: 'Cancelled enrollments', value: 'cancelled', icon: 'bi-slash-circle-fill' }
  ];

  ngOnInit(): void {
    this.loadEnrollments();
    this.calculateStatistics();
    this.filteredEnrollments = [...this.enrollments];
  }

  loadEnrollments(): void {
    // Sample data - replace with actual API call
    this.enrollments = [
      {
        id: '1',
        programName: 'Full Stack Web Development Bootcamp',
        programType: 'Bootcamp',
        enrollmentDate: new Date('2024-01-15'),
        expiryDate: new Date('2024-07-15'),
        status: 'active',
        paymentStatus: 'paid',
        amount: 1299.99,
        duration: '6 months',
        instructor: 'John Smith',
        accessLevel: 'Premium',
        thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400'
      },
      {
        id: '2',
        programName: 'Data Science Professional Certificate',
        programType: 'Certificate Program',
        enrollmentDate: new Date('2024-01-10'),
        expiryDate: new Date('2024-04-10'),
        status: 'active',
        paymentStatus: 'paid',
        amount: 899.99,
        duration: '3 months',
        instructor: 'Dr. Sarah Johnson',
        accessLevel: 'Premium',
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400'
      },
      {
        id: '3',
        programName: 'UI/UX Design Specialization',
        programType: 'Specialization',
        enrollmentDate: new Date('2023-12-01'),
        expiryDate: new Date('2024-01-01'),
        status: 'expired',
        paymentStatus: 'paid',
        amount: 599.99,
        duration: '1 month',
        instructor: 'Emily Chen',
        accessLevel: 'Standard',
        thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400'
      },
      {
        id: '4',
        programName: 'Digital Marketing Mastery Program',
        programType: 'Course Bundle',
        enrollmentDate: new Date('2024-01-20'),
        expiryDate: new Date('2024-06-20'),
        status: 'pending',
        paymentStatus: 'pending',
        amount: 749.99,
        duration: '5 months',
        instructor: 'Michael Brown',
        accessLevel: 'Standard',
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400'
      },
      {
        id: '5',
        programName: 'Cloud Computing with AWS',
        programType: 'Professional Course',
        enrollmentDate: new Date('2024-01-05'),
        expiryDate: new Date('2025-01-05'),
        status: 'active',
        paymentStatus: 'paid',
        amount: 1499.99,
        duration: '12 months',
        instructor: 'David Wilson',
        accessLevel: 'Premium Plus',
        thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400'
      },
      {
        id: '6',
        programName: 'Mobile App Development with React Native',
        programType: 'Bootcamp',
        enrollmentDate: new Date('2023-11-15'),
        expiryDate: new Date('2023-12-15'),
        status: 'expired',
        paymentStatus: 'paid',
        amount: 999.99,
        duration: '1 month',
        instructor: 'Lisa Anderson',
        accessLevel: 'Premium',
        thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400'
      },
      {
        id: '7',
        programName: 'Cybersecurity Fundamentals',
        programType: 'Certificate Program',
        enrollmentDate: new Date('2024-01-18'),
        expiryDate: new Date('2024-04-18'),
        status: 'active',
        paymentStatus: 'paid',
        amount: 799.99,
        duration: '3 months',
        instructor: 'Robert Taylor',
        accessLevel: 'Standard',
        thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400'
      },
      {
        id: '8',
        programName: 'Business Analytics Specialization',
        programType: 'Specialization',
        enrollmentDate: new Date('2024-01-12'),
        expiryDate: new Date('2024-03-12'),
        status: 'cancelled',
        paymentStatus: 'failed',
        amount: 649.99,
        duration: '2 months',
        instructor: 'Jennifer Lee',
        accessLevel: 'Standard',
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400'
      },
      {
        id: '9',
        programName: 'Machine Learning Engineer Track',
        programType: 'Career Track',
        enrollmentDate: new Date('2024-01-08'),
        expiryDate: new Date('2024-07-08'),
        status: 'active',
        paymentStatus: 'paid',
        amount: 1799.99,
        duration: '6 months',
        instructor: 'Dr. James Martinez',
        accessLevel: 'Premium Plus',
        thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400'
      },
      {
        id: '10',
        programName: 'Graphic Design Essentials',
        programType: 'Course Bundle',
        enrollmentDate: new Date('2024-01-22'),
        expiryDate: new Date('2024-04-22'),
        status: 'pending',
        paymentStatus: 'pending',
        amount: 449.99,
        duration: '3 months',
        instructor: 'Amanda White',
        accessLevel: 'Standard',
        thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400'
      }
    ];
  }

  calculateStatistics(): void {
    this.totalEnrollments = this.enrollments.length;
    this.activeEnrollments = this.enrollments.filter(e => e.status === 'active').length;
    this.expiredEnrollments = this.enrollments.filter(e => e.status === 'expired').length;
    this.pendingEnrollments = this.enrollments.filter(e => e.status === 'pending').length;
  }

  filterEnrollments(): void {
    let filtered = [...this.enrollments];

    // Filter by status
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(e => e.status === this.selectedStatus);
    }

    // Filter by search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(e => 
        e.programName.toLowerCase().includes(query) ||
        e.programType.toLowerCase().includes(query) ||
        e.instructor.toLowerCase().includes(query)
      );
    }

    this.filteredEnrollments = filtered;
  }

  onStatusChange(): void {
    this.filterEnrollments();
  }

  onSearchChange(): void {
    this.filterEnrollments();
  }

  onClear(): void {
    this.searchQuery = '';
    this.selectedStatus = 'all';
    this.filteredEnrollments = [...this.enrollments];
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'active': return 'text-success bg-success-subtle border-success-subtle';
      case 'expired': return 'text-danger bg-danger-subtle border-danger-subtle';
      case 'pending': return 'text-warning bg-warning-subtle border-warning-subtle';
      case 'cancelled': return 'text-secondary bg-secondary-subtle border-secondary-subtle';
      default: return 'text-secondary bg-secondary-subtle border-secondary-subtle';
    }
  }

  getPaymentStatusClass(status: string): string {
    switch(status) {
      case 'paid': return 'text-success bg-success-subtle border-success-subtle';
      case 'pending': return 'text-warning bg-warning-subtle border-warning-subtle';
      case 'failed': return 'text-danger bg-danger-subtle border-danger-subtle';
      default: return 'text-secondary bg-secondary-subtle border-secondary-subtle';
    }
  }

  getStatusText(status: string): string {
    switch(status) {
      case 'active': return 'Active';
      case 'expired': return 'Expired';
      case 'pending': return 'Pending';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  }

  getPaymentStatusText(status: string): string {
    switch(status) {
      case 'paid': return 'Paid';
      case 'pending': return 'Pending';
      case 'failed': return 'Failed';
      default: return status;
    }
  }

  getDaysRemaining(expiryDate: Date): number {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  viewEnrollment(enrollment: Enrollment): void {
    this.selectedEnrollment = enrollment;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedEnrollment = null;
  }

  renewEnrollment(enrollment: Enrollment): void {
    console.log('Renewing enrollment:', enrollment.programName);
    // Implement renewal logic
  }

  cancelEnrollment(enrollment: Enrollment): void {
    console.log('Cancelling enrollment:', enrollment.programName);
    // Implement cancellation logic
  }

  downloadInvoice(enrollment: Enrollment): void {
    console.log('Downloading invoice for:', enrollment.programName);
    // Implement invoice download
  }

  accessProgram(enrollment: Enrollment): void {
    console.log('Accessing program:', enrollment.programName);
    // Implement navigation to program
  }
}
