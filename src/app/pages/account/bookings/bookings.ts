import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PageHeader } from '../../../components/page-header/page-header';
import { InputComponent } from '../../../components/ui/input/input';
import { AccountTypeSelectorComponent } from '../../../components/account-type-selector/account-type-selector.component';
import { ButtonComponent } from '../../../components/ui/button/button';
import { BookingService, Booking, Artisan } from '../../../services/booking.service';
import { Subscription } from 'rxjs';
import { BookingFormComponent } from './components/booking-form/booking-form.component';
import { BookingDetailsComponent } from './components/booking-details/booking-details.component';

@Component({
  selector: 'app-bookings',
  imports: [CommonModule, FormsModule, PageHeader, InputComponent, AccountTypeSelectorComponent, ButtonComponent, BookingFormComponent, BookingDetailsComponent],
  templateUrl: './bookings.html',
  styleUrl: './bookings.scss',
})
export class Bookings implements OnInit, OnDestroy {
  bookings: Booking[] = [];
  filteredBookings: Booking[] = [];
  selectedStatus: string = 'all';
  searchQuery: string = '';
  
  // Statistics
  totalBookings: number = 0;
  upcomingBookings: number = 0;
  completedBookings: number = 0;
  cancelledBookings: number = 0;

  // Modal
  showModal: boolean = false;
  selectedBooking: Booking | null = null;

  // Booking creation
  showBookingFormModal: boolean = false;
  showSuccessModal: boolean = false;
  selectedArtisan: Artisan | null = null;

  // Subscriptions
  private bookingsSubscription?: Subscription;
  private routeSubscription?: Subscription;

  statusOptions = [
    { title: 'All Bookings', description: 'Show all bookings', value: 'all', icon: 'bi-calendar-check' },
    { title: 'Upcoming', description: 'Scheduled bookings', value: 'upcoming', icon: 'bi-clock-fill' },
    { title: 'Completed', description: 'Finished sessions', value: 'completed', icon: 'bi-check-circle-fill' },
    { title: 'Cancelled', description: 'Cancelled bookings', value: 'cancelled', icon: 'bi-x-circle-fill' },
    { title: 'Rescheduled', description: 'Rescheduled sessions', value: 'rescheduled', icon: 'bi-arrow-repeat' }
  ];

  constructor(
    private bookingService: BookingService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to bookings from service
    this.bookingsSubscription = this.bookingService.bookings$.subscribe(bookings => {
      this.bookings = bookings;
      this.calculateStatistics();
      this.filterBookings();
    });

    // Check if artisan ID is passed from marketplace
    this.routeSubscription = this.route.queryParams.subscribe(params => {
      const artisanId = params['artisanId'];
      if (artisanId) {
        const artisan = this.bookingService.getArtisanById(artisanId);
        if (artisan) {
          this.selectedArtisan = artisan;
          this.showBookingFormModal = true;
        }
      }
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    if (this.bookingsSubscription) {
      this.bookingsSubscription.unsubscribe();
    }
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  calculateStatistics(): void {
    this.totalBookings = this.bookings.length;
    this.upcomingBookings = this.bookings.filter(b => b.status === 'upcoming').length;
    this.completedBookings = this.bookings.filter(b => b.status === 'completed').length;
    this.cancelledBookings = this.bookings.filter(b => b.status === 'cancelled').length;
  }

  filterBookings(): void {
    let filtered = [...this.bookings];

    // Filter by status
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(b => b.status === this.selectedStatus);
    }

    // Filter by search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(b => 
        b.consultantName.toLowerCase().includes(query) ||
        b.consultantTitle.toLowerCase().includes(query) ||
        b.serviceType.toLowerCase().includes(query) ||
        b.notes?.toLowerCase().includes(query)
      );
    }

    this.filteredBookings = filtered;
  }

  onStatusChange(): void {
    this.filterBookings();
  }

  onSearchChange(): void {
    this.filterBookings();
  }

  onClear(): void {
    this.searchQuery = '';
    this.selectedStatus = 'all';
    this.filteredBookings = [...this.bookings];
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

  viewBooking(booking: Booking): void {
    this.selectedBooking = booking;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedBooking = null;
  }

  joinMeeting(booking: Booking): void {
    if (booking.meetingLink) {
      window.open(booking.meetingLink, '_blank');
    }
  }

  cancelBooking(booking: Booking): void {
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.bookingService.cancelBooking(booking.id);
      this.closeModal();
    }
  }

  rescheduleBooking(booking: Booking): void {
    console.log('Rescheduling booking:', booking.id);
    // TODO: Implement reschedule modal
    alert('Reschedule feature coming soon!');
  }

  downloadReceipt(booking: Booking): void {
    console.log('Downloading receipt for booking:', booking.id);
    // Implement receipt download
  }

  viewConsultantProfile(booking: Booking): void {
    console.log('Viewing consultant profile:', booking.consultantName);
    // Implement navigation to consultant profile
  }

  createNewBooking(): void {
    // Navigate to marketplace to select artisan
    this.router.navigate(['/content/market-place']);
  }

  closeBookingFormModal(): void {
    this.showBookingFormModal = false;
    this.selectedArtisan = null;
    
    // Clear query params
    this.router.navigate([], {
      queryParams: {},
      queryParamsHandling: ''
    });
  }

  onBookingSubmitted(): void {
    this.showSuccessModal = true;
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false;
  }
}
