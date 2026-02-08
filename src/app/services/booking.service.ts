import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  BookingCreateRequestDto,
  RejectBookingDto,
  CompleteBookingDto,
  CancelBookingDto,
  SendMessageDto
} from '../models/api.models';

// Re-export Artisan from here or just define it
export interface Artisan {
  id: string;
  name: string;
  title: string;
  avatar: string;
  category: string;
  rating: number;
  reviews: number;
  priceRange: string;
  location: string;
  description: string;
  image: string;
  responseTime: string;
  phone: string;
  availability: ('online' | 'in-person')[];
}

export interface Booking {
  id: string;
  consultantName: string;
  consultantTitle: string;
  consultantAvatar: string;
  category?: string; // Category from artisan (Plumbing, Electrical, etc.)
  serviceType: 'consultation' | 'mentoring' | 'tutoring' | 'review';
  bookingDate: Date;
  scheduledTime: string;
  duration: number;
  status: 'upcoming' | 'completed' | 'rescheduled' | 'cancelled';
  location: 'online' | 'in-person';
  meetingLink?: string;
  address?: string;
  price: number;
  paymentStatus: 'paid' | 'pending' | 'refunded';
  notes?: string;
  source: 'application' | 'marketplace';
  createdAt: Date;
  cancelledAt?: Date;
  completedAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private readonly endpoint = '/Booking';

  // Legacy Mock Data for Marketplace
  private artisansSubject = new BehaviorSubject<Artisan[]>([]);
  public artisans$ = this.artisansSubject.asObservable();

  private bookingsSubject = new BehaviorSubject<Booking[]>([]);
  public bookings$ = this.bookingsSubject.asObservable();

  constructor(private api: ApiService) {
    this.loadMockArtisans();
    this.loadMockBookings();
  }

  private loadMockArtisans(): void {
    const artisans: Artisan[] = [
      {
        id: 'a1',
        name: 'John Doe',
        title: 'Professional Plumber',
        avatar: 'https://i.pravatar.cc/150?img=12',
        category: 'Plumbing',
        rating: 4.8,
        reviews: 45,
        priceRange: '₦2,000 - 5,000',
        location: 'Gwarinpa, Abuja',
        description: 'Expert in pipe repairs, installations, and emergency plumbing services.',
        image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=400',
        responseTime: '2 hours',
        phone: '+234 803 123 4567',
        availability: ['online', 'in-person']
      },
      {
        id: 'a2',
        name: 'Michael Smith',
        title: 'Licensed Electrician',
        avatar: 'https://i.pravatar.cc/150?img=33',
        category: 'Electrical',
        rating: 4.9,
        reviews: 67,
        priceRange: '₦4,000 - 10,000',
        location: 'Apo, Abuja',
        description: 'Specialized in wiring, installation, and electrical maintenance.',
        image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=400',
        responseTime: '1 hour',
        phone: '+234 802 234 5678',
        availability: ['online', 'in-person']
      },
      {
        id: 'a3',
        name: 'Sarah Williams',
        title: 'Professional Carpenter',
        avatar: 'https://i.pravatar.cc/150?img=45',
        category: 'Carpentry',
        rating: 4.7,
        reviews: 52,
        priceRange: '₦3,000 - 8,000',
        location: 'Wuse, Abuja',
        description: 'Custom furniture, repairs, and woodwork installations.',
        image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=400',
        responseTime: '3 hours',
        phone: '+234 805 345 6789',
        availability: ['in-person']
      },
      {
        id: 'a4',
        name: 'David Johnson',
        title: 'HVAC Technician',
        avatar: 'https://i.pravatar.cc/150?img=15',
        category: 'HVAC',
        rating: 5.0,
        reviews: 89,
        priceRange: '₦5,000 - 15,000',
        location: 'Maitama, Abuja',
        description: 'Air conditioning installation, repair, and maintenance services.',
        image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=400',
        responseTime: '2 hours',
        phone: '+234 807 456 7890',
        availability: ['online', 'in-person']
      },
      {
        id: 'a5',
        name: 'Emily Brown',
        title: 'Professional Painter',
        avatar: 'https://i.pravatar.cc/150?img=28',
        category: 'Painting',
        rating: 4.6,
        reviews: 38,
        priceRange: '₦2,500 - 7,000',
        location: 'Garki, Abuja',
        description: 'Interior and exterior painting, wallpaper installation.',
        image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=400',
        responseTime: '4 hours',
        phone: '+234 810 567 8901',
        availability: ['in-person']
      },
      {
        id: 'a6',
        name: 'Robert Garcia',
        title: 'Appliance Repair Expert',
        avatar: 'https://i.pravatar.cc/150?img=51',
        category: 'Appliance Repair',
        rating: 4.8,
        reviews: 71,
        priceRange: '₦3,500 - 9,000',
        location: 'Asokoro, Abuja',
        description: 'Repair and maintenance of all household appliances.',
        image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=400',
        responseTime: '2 hours',
        phone: '+234 813 678 9012',
        availability: ['online', 'in-person']
      }
    ];
    this.artisansSubject.next(artisans);
  }

  private loadMockBookings(): void {
    const bookings: Booking[] = [
      {
        id: 'b1',
        consultantName: 'Dr. Sarah Johnson',
        consultantTitle: 'Senior Web Development Consultant',
        consultantAvatar: 'https://i.pravatar.cc/150?img=47',
        serviceType: 'consultation',
        bookingDate: new Date('2024-01-20T14:00:00'),
        scheduledTime: '2:00 PM',
        duration: 60,
        status: 'upcoming',
        location: 'online',
        meetingLink: 'https://meet.example.com/session-123',
        price: 150.00,
        paymentStatus: 'paid',
        notes: 'Need help with React performance optimization',
        source: 'application',
        createdAt: new Date('2024-01-15')
      },
      {
        id: 'b2',
        consultantName: 'John Doe',
        consultantTitle: 'Professional Plumber',
        consultantAvatar: 'https://i.pravatar.cc/150?img=12',
        category: 'Plumbing',
        serviceType: 'consultation',
        bookingDate: new Date('2024-01-25T10:00:00'),
        scheduledTime: '10:00 AM',
        duration: 120,
        status: 'completed',
        location: 'in-person',
        address: '123 Main St, Gwarinpa, Abuja',
        price: 3500,
        paymentStatus: 'paid',
        notes: 'Kitchen sink repair',
        source: 'marketplace',
        createdAt: new Date('2024-01-20'),
        completedAt: new Date('2024-01-25')
      }
    ];
    this.bookingsSubject.next(bookings);
  }

  // Legacy accessor for Marketplace
  getArtisansLegacy(): Artisan[] {
    return this.artisansSubject.value;
  }

  // Alias for legacy compatibility since component uses getArtisans() expecting array
  getArtisansList(): Artisan[] { // Renamed from getArtisans to avoid conflict with API method if I add one. 
    // Wait, Component expects getArtisans() to return Artisan[].
    // API method might be getBookings or getArtisans?
    // If I name this getArtisans, and I have API getArtisans returning Observable, that's a conflict.
    // But currently I don't have getArtisans() API method in this file. I have getBookings().
    // So I can name this getArtisans() safely.
    return this.artisansSubject.value;
  }

  getArtisans(): Artisan[] {
    return this.artisansSubject.value;
  }

  getArtisanById(id: string): Artisan | undefined {
    return this.artisansSubject.value.find(a => a.id === id);
  }

  createBookingFromArtisan(
    artisan: Artisan,
    bookingData: {
      selectedDate: string;
      selectedTime: string;
      duration: string;
      notes: string;
      address: string;
      meetingLink: string;
      locationType: 'online' | 'in-person';
    }
  ): Booking {
    const currentBookings = this.bookingsSubject.value;
    const newId = 'b' + (currentBookings.length + 1);

    return {
      id: newId,
      consultantName: artisan.name,
      consultantTitle: artisan.title,
      consultantAvatar: artisan.avatar,
      category: artisan.category,
      serviceType: 'consultation',
      bookingDate: new Date(bookingData.selectedDate + 'T' + this.convertTo24Hour(bookingData.selectedTime)),
      scheduledTime: bookingData.selectedTime,
      duration: parseInt(bookingData.duration),
      status: 'upcoming',
      location: bookingData.locationType,
      address: bookingData.locationType === 'in-person' ? bookingData.address : undefined,
      meetingLink: bookingData.locationType === 'online' ? (bookingData.meetingLink || `https://meet.example.com/session-${this.uuidv4()}`) : undefined,
      price: this.extractMinPrice(artisan.priceRange),
      paymentStatus: 'pending',
      notes: bookingData.notes,
      source: 'marketplace',
      createdAt: new Date()
    };
  }

  addBooking(booking: Booking): void {
    const current = this.bookingsSubject.value;
    this.bookingsSubject.next([booking, ...current]);
  }

  private convertTo24Hour(time12h: string): string {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') hours = '00';
    if (modifier === 'PM') hours = String(parseInt(hours, 10) + 12);
    return `${hours}:${minutes}:00`;
  }

  private extractMinPrice(priceRange: string): number {
    const match = priceRange.match(/[\d,]+/);
    if (match) return parseFloat(match[0].replace(/,/g, ''));
    return 0;
  }

  private uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // API Methods
  getBookings(query?: { status?: string }): Observable<any> {
    return this.api.get(`${this.endpoint}`, query);
  }

  createBooking(body: BookingCreateRequestDto): Observable<any> {
    return this.api.post(`${this.endpoint}`, body);
  }

  getBooking(id: string): Observable<any> {
    return this.api.get(`${this.endpoint}/${id}`);
  }

  confirmBooking(id: string): Observable<any> {
    return this.api.post(`${this.endpoint}/${id}/confirm`, {});
  }

  rejectBooking(id: string, body: RejectBookingDto): Observable<any> {
    return this.api.post(`${this.endpoint}/${id}/reject`, body);
  }

  startBooking(id: string): Observable<any> {
    return this.api.post(`${this.endpoint}/${id}/start`, {});
  }

  completeBooking(id: string, body: CompleteBookingDto): Observable<any> {
    return this.api.post(`${this.endpoint}/${id}/complete`, body);
  }

  cancelBooking(id: string, body: CancelBookingDto): Observable<any> {
    return this.api.post(`${this.endpoint}/${id}/cancel`, body);
  }

  sendMessage(id: string, body: SendMessageDto): Observable<any> {
    return this.api.post(`${this.endpoint}/${id}/message`, body);
  }
}
