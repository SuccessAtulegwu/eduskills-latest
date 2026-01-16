import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookingService, Artisan } from '../../../../../services/booking.service';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking-form.component.html',
  styleUrl: './booking-form.component.scss'
})
export class BookingFormComponent implements OnInit, OnChanges {
  @Input() artisan: Artisan | null = null;
  @Input() showModal: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() bookingSubmitted = new EventEmitter<void>();

  // Booking form data
  bookingForm = {
    selectedDate: '',
    selectedTime: '',
    duration: '60',
    notes: '',
    address: '',
    meetingLink: '',
    locationType: 'in-person' as 'online' | 'in-person'
  };

  // Time slots
  timeSlots = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
    '04:00 PM', '05:00 PM', '06:00 PM'
  ];

  // Duration options
  durationOptions = [
    { value: '30', label: '30 minutes' },
    { value: '60', label: '1 hour' },
    { value: '90', label: '1.5 hours' },
    { value: '120', label: '2 hours' },
    { value: '180', label: '3 hours' },
    { value: '240', label: '4 hours' }
  ];

  constructor(
    private bookingService: BookingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    this.bookingForm.selectedDate = today;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['artisan'] && this.artisan) {
      // Set location type based on availability
      if (this.artisan.availability.includes('in-person')) {
        this.bookingForm.locationType = 'in-person';
      } else {
        this.bookingForm.locationType = 'online';
      }
    }
  }

  closeModal(): void {
    this.resetBookingForm();
    this.close.emit();
    
    // Clear query params
    this.router.navigate([], {
      queryParams: {},
      queryParamsHandling: ''
    });
  }

  resetBookingForm(): void {
    const today = new Date().toISOString().split('T')[0];
    this.bookingForm = {
      selectedDate: today,
      selectedTime: '',
      duration: '60',
      notes: '',
      address: '',
      meetingLink: '',
      locationType: 'in-person'
    };
  }

  submitBooking(): void {
    // Validate form
    if (!this.bookingForm.selectedDate || !this.bookingForm.selectedTime) {
      alert('Please select date and time');
      return;
    }

    if (this.bookingForm.locationType === 'in-person' && !this.bookingForm.address) {
      alert('Please provide your address for in-person service');
      return;
    }

    if (!this.artisan) {
      return;
    }

    // Create new booking using service
    const newBooking = this.bookingService.createBookingFromArtisan(
      this.artisan,
      this.bookingForm
    );

    // Add to bookings via service
    this.bookingService.addBooking(newBooking);

    // Close modal and emit event
    this.closeModal();
    this.bookingSubmitted.emit();
  }

  getMinDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  canSelectOnline(): boolean {
    return this.artisan?.availability.includes('online') || false;
  }

  canSelectInPerson(): boolean {
    return this.artisan?.availability.includes('in-person') || false;
  }
}

