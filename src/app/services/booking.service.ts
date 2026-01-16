import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

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
  private bookingsSubject = new BehaviorSubject<Booking[]>([]);
  public bookings$ = this.bookingsSubject.asObservable();

  private artisansSubject = new BehaviorSubject<Artisan[]>([]);
  public artisans$ = this.artisansSubject.asObservable();

  constructor() {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    // Load artisans
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

    // Load bookings
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
        consultantName: 'Prof. Michael Chen',
        consultantTitle: 'Data Science & ML Expert',
        consultantAvatar: 'https://i.pravatar.cc/150?img=12',
        serviceType: 'mentoring',
        bookingDate: new Date('2024-01-18T10:00:00'),
        scheduledTime: '10:00 AM',
        duration: 90,
        status: 'completed',
        location: 'online',
        meetingLink: 'https://meet.example.com/session-122',
        price: 200.00,
        paymentStatus: 'paid',
        notes: 'Career guidance session',
        source: 'marketplace',
        createdAt: new Date('2024-01-10'),
        completedAt: new Date('2024-01-18T11:30:00')
      },
      {
        id: 'b3',
        consultantName: 'Emily Rodriguez',
        consultantTitle: 'UI/UX Design Specialist',
        consultantAvatar: 'https://i.pravatar.cc/150?img=45',
        serviceType: 'tutoring',
        bookingDate: new Date('2024-01-22T16:00:00'),
        scheduledTime: '4:00 PM',
        duration: 45,
        status: 'upcoming',
        location: 'in-person',
        address: '123 Design Studio, New York, NY 10001',
        price: 120.00,
        paymentStatus: 'paid',
        notes: 'Figma advanced techniques',
        source: 'application',
        createdAt: new Date('2024-01-16')
      },
      {
        id: 'b4',
        consultantName: 'James Wilson',
        consultantTitle: 'Cloud Architecture Consultant',
        consultantAvatar: 'https://i.pravatar.cc/150?img=33',
        serviceType: 'consultation',
        bookingDate: new Date('2024-01-19T09:00:00'),
        scheduledTime: '9:00 AM',
        duration: 60,
        status: 'cancelled',
        location: 'online',
        price: 180.00,
        paymentStatus: 'refunded',
        notes: 'AWS infrastructure planning',
        source: 'marketplace',
        createdAt: new Date('2024-01-12'),
        cancelledAt: new Date('2024-01-17')
      },
      {
        id: 'b5',
        consultantName: 'Dr. Lisa Anderson',
        consultantTitle: 'DevOps & CI/CD Expert',
        consultantAvatar: 'https://i.pravatar.cc/150?img=20',
        serviceType: 'review',
        bookingDate: new Date('2024-01-25T13:00:00'),
        scheduledTime: '1:00 PM',
        duration: 30,
        status: 'upcoming',
        location: 'online',
        meetingLink: 'https://meet.example.com/session-124',
        price: 100.00,
        paymentStatus: 'pending',
        notes: 'Code review session',
        source: 'application',
        createdAt: new Date('2024-01-17')
      },
      {
        id: 'b6',
        consultantName: 'Robert Taylor',
        consultantTitle: 'Full Stack Development Mentor',
        consultantAvatar: 'https://i.pravatar.cc/150?img=51',
        serviceType: 'mentoring',
        bookingDate: new Date('2024-01-16T15:00:00'),
        scheduledTime: '3:00 PM',
        duration: 60,
        status: 'completed',
        location: 'online',
        price: 140.00,
        paymentStatus: 'paid',
        notes: 'Project architecture discussion',
        source: 'marketplace',
        createdAt: new Date('2024-01-08'),
        completedAt: new Date('2024-01-16T16:00:00')
      },
      {
        id: 'b7',
        consultantName: 'Maria Garcia',
        consultantTitle: 'Mobile App Development Consultant',
        consultantAvatar: 'https://i.pravatar.cc/150?img=28',
        serviceType: 'consultation',
        bookingDate: new Date('2024-01-24T11:00:00'),
        scheduledTime: '11:00 AM',
        duration: 60,
        status: 'rescheduled',
        location: 'online',
        meetingLink: 'https://meet.example.com/session-125',
        price: 160.00,
        paymentStatus: 'paid',
        notes: 'React Native best practices',
        source: 'application',
        createdAt: new Date('2024-01-14')
      },
      {
        id: 'b8',
        consultantName: 'David Kim',
        consultantTitle: 'Cybersecurity Specialist',
        consultantAvatar: 'https://i.pravatar.cc/150?img=15',
        serviceType: 'consultation',
        bookingDate: new Date('2024-01-21T14:00:00'),
        scheduledTime: '2:00 PM',
        duration: 90,
        status: 'upcoming',
        location: 'in-person',
        address: '456 Security Hub, San Francisco, CA 94102',
        price: 250.00,
        paymentStatus: 'paid',
        notes: 'Security audit consultation',
        source: 'marketplace',
        createdAt: new Date('2024-01-13')
      }
    ];

    this.artisansSubject.next(artisans);
    this.bookingsSubject.next(bookings);
  }

  // Get all bookings
  getBookings(): Booking[] {
    return this.bookingsSubject.value;
  }

  // Get all artisans
  getArtisans(): Artisan[] {
    return this.artisansSubject.value;
  }

  // Get artisan by ID
  getArtisanById(id: string): Artisan | undefined {
    return this.artisansSubject.value.find(a => a.id === id);
  }

  // Add new booking
  addBooking(booking: Booking): void {
    const currentBookings = this.bookingsSubject.value;
    this.bookingsSubject.next([booking, ...currentBookings]);
  }

  // Update booking
  updateBooking(id: string, updates: Partial<Booking>): void {
    const currentBookings = this.bookingsSubject.value;
    const index = currentBookings.findIndex(b => b.id === id);
    
    if (index !== -1) {
      currentBookings[index] = { ...currentBookings[index], ...updates };
      this.bookingsSubject.next([...currentBookings]);
    }
  }

  // Cancel booking
  cancelBooking(id: string): void {
    this.updateBooking(id, {
      status: 'cancelled',
      cancelledAt: new Date(),
      paymentStatus: 'refunded'
    });
  }

  // Reschedule booking
  rescheduleBooking(id: string, newDate: Date, newTime: string): void {
    this.updateBooking(id, {
      status: 'rescheduled',
      bookingDate: newDate,
      scheduledTime: newTime
    });
  }

  // Complete booking
  completeBooking(id: string): void {
    this.updateBooking(id, {
      status: 'completed',
      completedAt: new Date()
    });
  }

  // Create booking from artisan
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
      meetingLink: bookingData.locationType === 'online' ? (bookingData.meetingLink || `https://meet.example.com/session-${newId}`) : undefined,
      price: this.extractMinPrice(artisan.priceRange),
      paymentStatus: 'pending',
      notes: bookingData.notes,
      source: 'marketplace',
      createdAt: new Date()
    };
  }

  // Helper: Convert 12-hour to 24-hour format
  private convertTo24Hour(time12h: string): string {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    
    if (hours === '12') {
      hours = '00';
    }
    
    if (modifier === 'PM') {
      hours = String(parseInt(hours, 10) + 12);
    }
    
    return `${hours}:${minutes}:00`;
  }

  // Helper: Extract minimum price from range
  private extractMinPrice(priceRange: string): number {
    const match = priceRange.match(/[\d,]+/);
    if (match) {
      return parseFloat(match[0].replace(/,/g, ''));
    }
    return 0;
  }

  // Get booking statistics
  getStatistics() {
    const bookings = this.bookingsSubject.value;
    return {
      total: bookings.length,
      upcoming: bookings.filter(b => b.status === 'upcoming').length,
      completed: bookings.filter(b => b.status === 'completed').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length,
      rescheduled: bookings.filter(b => b.status === 'rescheduled').length
    };
  }
}

