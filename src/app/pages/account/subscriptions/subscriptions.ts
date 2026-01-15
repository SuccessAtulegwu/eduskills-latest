import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageHeader } from '../../../components/page-header/page-header';
import { InputComponent } from '../../../components/ui/input/input';
import { AccountTypeSelectorComponent } from '../../../components/account-type-selector/account-type-selector.component';
import { ButtonComponent } from '../../../components/ui/button/button';

export interface CourseSubscription {
  id: string;
  title: string;
  category: string;
  instructor: string;
  subscriptionDate: Date;
  renewalDate: Date;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  status: 'active' | 'cancelled' | 'expired' | 'paused';
  duration: string;
  thumbnail: string;
  description: string;
  lessons: number;
  autoRenew: boolean;
  progress: number;
  accessLevel: 'basic' | 'premium' | 'pro';
}

@Component({
  selector: 'app-subscriptions',
  imports: [CommonModule, FormsModule, PageHeader, InputComponent, AccountTypeSelectorComponent, ButtonComponent],
  templateUrl: './subscriptions.html',
  styleUrl: './subscriptions.scss',
})
export class Subscriptions implements OnInit {
  subscriptions: CourseSubscription[] = [];
  filteredSubscriptions: CourseSubscription[] = [];
  selectedStatus: string = 'all';
  searchQuery: string = '';
  
  // Statistics
  totalSubscriptions: number = 0;
  activeSubscriptions: number = 0;
  monthlySpend: number = 0;
  expiringSoon: number = 0;

  // Modal
  showModal: boolean = false;
  selectedSubscription: CourseSubscription | null = null;

  statusOptions = [
    { title: 'All Subscriptions', description: 'Show all subscriptions', value: 'all', icon: 'bi-collection' },
    { title: 'Active', description: 'Currently active', value: 'active', icon: 'bi-check-circle-fill' },
    { title: 'Cancelled', description: 'Cancelled subscriptions', value: 'cancelled', icon: 'bi-x-circle-fill' },
    { title: 'Expired', description: 'Expired subscriptions', value: 'expired', icon: 'bi-clock-history' },
    { title: 'Paused', description: 'Temporarily paused', value: 'paused', icon: 'bi-pause-circle-fill' }
  ];

  ngOnInit(): void {
    this.loadSubscriptions();
    this.calculateStatistics();
    this.filteredSubscriptions = [...this.subscriptions];
  }

  loadSubscriptions(): void {
    // Sample data - replace with actual API call
    this.subscriptions = [
      {
        id: '1',
        title: 'Complete Web Development Bootcamp - Premium Access',
        category: 'Web Development',
        instructor: 'Dr. Angela Yu',
        subscriptionDate: new Date('2023-06-15'),
        renewalDate: new Date('2024-06-15'),
        price: 29.99,
        billingCycle: 'monthly',
        status: 'active',
        duration: '52 hours',
        thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
        description: 'Unlimited access to web development courses with monthly updates and new content.',
        lessons: 156,
        autoRenew: true,
        progress: 65,
        accessLevel: 'premium'
      },
      {
        id: '2',
        title: 'Data Science & ML Pro Subscription',
        category: 'Data Science',
        instructor: 'Jose Portilla',
        subscriptionDate: new Date('2023-01-10'),
        renewalDate: new Date('2025-01-10'),
        price: 299.99,
        billingCycle: 'yearly',
        status: 'active',
        duration: '100+ hours',
        thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400',
        description: 'Full access to all data science, machine learning, and AI courses with certification.',
        lessons: 250,
        autoRenew: true,
        progress: 42,
        accessLevel: 'pro'
      },
      {
        id: '3',
        title: 'UI/UX Design Masterclass Bundle',
        category: 'Design',
        instructor: 'Daniel Walter Scott',
        subscriptionDate: new Date('2023-11-01'),
        renewalDate: new Date('2024-02-10'),
        price: 19.99,
        billingCycle: 'monthly',
        status: 'cancelled',
        duration: '40 hours',
        thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
        description: 'Access to design courses including Figma, Adobe XD, and UI/UX principles.',
        lessons: 120,
        autoRenew: false,
        progress: 78,
        accessLevel: 'basic'
      },
      {
        id: '4',
        title: 'React & Next.js Pro Membership',
        category: 'Web Development',
        instructor: 'Maximilian Schwarzmüller',
        subscriptionDate: new Date('2024-01-05'),
        renewalDate: new Date('2024-02-05'),
        price: 39.99,
        billingCycle: 'monthly',
        status: 'active',
        duration: '60 hours',
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
        description: 'Premium subscription for React, Next.js, and modern JavaScript frameworks.',
        lessons: 180,
        autoRenew: true,
        progress: 23,
        accessLevel: 'pro'
      },
      {
        id: '5',
        title: 'Digital Marketing Suite',
        category: 'Marketing',
        instructor: 'Phil Ebiner',
        subscriptionDate: new Date('2022-08-01'),
        renewalDate: new Date('2023-08-01'),
        price: 24.99,
        billingCycle: 'monthly',
        status: 'expired',
        duration: '35 hours',
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
        description: 'Complete digital marketing courses including SEO, social media, and email marketing.',
        lessons: 95,
        autoRenew: false,
        progress: 100,
        accessLevel: 'premium'
      },
      {
        id: '6',
        title: 'AWS Cloud Architect Annual Plan',
        category: 'Cloud Computing',
        instructor: 'Stephane Maarek',
        subscriptionDate: new Date('2023-03-15'),
        renewalDate: new Date('2024-03-15'),
        price: 399.99,
        billingCycle: 'yearly',
        status: 'active',
        duration: '80 hours',
        thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400',
        description: 'Complete AWS certification preparation with hands-on labs and practice exams.',
        lessons: 200,
        autoRenew: true,
        progress: 55,
        accessLevel: 'pro'
      },
      {
        id: '7',
        title: 'JavaScript Mastery Subscription',
        category: 'Programming',
        instructor: 'Jonas Schmedtmann',
        subscriptionDate: new Date('2023-12-01'),
        renewalDate: new Date('2024-03-01'),
        price: 15.99,
        billingCycle: 'monthly',
        status: 'paused',
        duration: '70 hours',
        thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400',
        description: 'Modern JavaScript from basics to advanced, including ES6+, async/await, and more.',
        lessons: 165,
        autoRenew: false,
        progress: 88,
        accessLevel: 'basic'
      },
      {
        id: '8',
        title: 'DevOps & Kubernetes Pro',
        category: 'DevOps',
        instructor: 'Stephen Grider',
        subscriptionDate: new Date('2023-10-20'),
        renewalDate: new Date('2024-10-20'),
        price: 349.99,
        billingCycle: 'yearly',
        status: 'active',
        duration: '50 hours',
        thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400',
        description: 'Complete DevOps training with Docker, Kubernetes, CI/CD, and cloud deployment.',
        lessons: 140,
        autoRenew: true,
        progress: 34,
        accessLevel: 'pro'
      }
    ];
  }

  calculateStatistics(): void {
    this.totalSubscriptions = this.subscriptions.length;
    this.activeSubscriptions = this.subscriptions.filter(s => s.status === 'active').length;
    
    // Calculate monthly spend (convert yearly to monthly)
    this.monthlySpend = this.subscriptions
      .filter(s => s.status === 'active')
      .reduce((sum, s) => {
        const monthlyPrice = s.billingCycle === 'yearly' ? s.price / 12 : s.price;
        return sum + monthlyPrice;
      }, 0);
    
    // Count subscriptions expiring in next 30 days
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    this.expiringSoon = this.subscriptions.filter(s => 
      s.status === 'active' && s.renewalDate <= thirtyDaysFromNow && s.renewalDate >= now
    ).length;
  }

  filterSubscriptions(): void {
    let filtered = [...this.subscriptions];

    // Filter by status
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(s => s.status === this.selectedStatus);
    }

    // Filter by search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(s => 
        s.title.toLowerCase().includes(query) ||
        s.category.toLowerCase().includes(query) ||
        s.instructor.toLowerCase().includes(query)
      );
    }

    this.filteredSubscriptions = filtered;
  }

  onStatusChange(): void {
    this.filterSubscriptions();
  }

  onSearchChange(): void {
    this.filterSubscriptions();
  }

  onClear(): void {
    this.searchQuery = '';
    this.selectedStatus = 'all';
    this.filteredSubscriptions = [...this.subscriptions];
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'active': return 'text-success bg-success-subtle border-success-subtle';
      case 'cancelled': return 'text-danger bg-danger-subtle border-danger-subtle';
      case 'expired': return 'text-secondary bg-secondary-subtle border-secondary-subtle';
      case 'paused': return 'text-warning bg-warning-subtle border-warning-subtle';
      default: return 'text-secondary bg-secondary-subtle border-secondary-subtle';
    }
  }

  getStatusIcon(status: string): string {
    switch(status) {
      case 'active': return 'bi-check-circle-fill';
      case 'cancelled': return 'bi-x-circle-fill';
      case 'expired': return 'bi-clock-history';
      case 'paused': return 'bi-pause-circle-fill';
      default: return 'bi-question-circle-fill';
    }
  }

  getStatusText(status: string): string {
    switch(status) {
      case 'active': return 'Active';
      case 'cancelled': return 'Cancelled';
      case 'expired': return 'Expired';
      case 'paused': return 'Paused';
      default: return status;
    }
  }

  getAccessLevelClass(level: string): string {
    switch(level) {
      case 'pro': return 'text-purple bg-purple-subtle border-purple-subtle';
      case 'premium': return 'text-primary bg-primary-subtle border-primary-subtle';
      case 'basic': return 'text-info bg-info-subtle border-info-subtle';
      default: return 'text-secondary bg-secondary-subtle border-secondary-subtle';
    }
  }

  getDaysUntilRenewal(renewalDate: Date): number {
    const now = new Date();
    const renewal = new Date(renewalDate);
    const diffTime = renewal.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  viewSubscription(subscription: CourseSubscription): void {
    this.selectedSubscription = subscription;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedSubscription = null;
  }

  continuelearning(subscription: CourseSubscription): void {
    console.log('Continue learning:', subscription.title);
    this.closeModal();
    // Implement navigation to course player
  }

  cancelSubscription(subscription: CourseSubscription): void {
    console.log('Cancelling subscription:', subscription.title);
    // Implement cancellation logic
  }

  renewSubscription(subscription: CourseSubscription): void {
    console.log('Renewing subscription:', subscription.title);
    // Implement renewal logic
  }

  pauseSubscription(subscription: CourseSubscription): void {
    console.log('Pausing subscription:', subscription.title);
    // Implement pause logic
  }

  resumeSubscription(subscription: CourseSubscription): void {
    console.log('Resuming subscription:', subscription.title);
    // Implement resume logic
  }

  managePayment(subscription: CourseSubscription): void {
    console.log('Managing payment for:', subscription.title);
    // Implement payment management
  }

  browseSubscriptions(): void {
    console.log('Browse available subscriptions');
    // Implement navigation to subscription marketplace
  }
}


