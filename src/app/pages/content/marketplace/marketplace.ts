import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { InputComponent } from '../../../components/ui/input/input';
import { AccountTypeSelectorComponent, AccountTypeOption } from '../../../components/account-type-selector/account-type-selector.component';
import { ButtonComponent } from '../../../components/ui/button/button';
import { PageHeader } from '../../../components/page-header/page-header';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth';
import { BookingService, Artisan } from '../../../services/booking.service';

@Component({
  selector: 'app-marketplace',
  standalone: true,
  imports: [CommonModule, InputComponent, AccountTypeSelectorComponent, ButtonComponent, PageHeader],
  templateUrl: './marketplace.html',
  styleUrl: './marketplace.scss',
})
export class Marketplace implements OnInit, OnDestroy {
  isAuthenticated: boolean = false;
  artisans: Artisan[] = [];
  private authSubscription?: Subscription;
  
  constructor(
    private router: Router,
    private authService: AuthService,
    private bookingService: BookingService
  ) { }

  viewDetails(id: string) {
    this.router.navigate(['/content/market-place', id]);
  }

  bookArtisan(id: string) {
    // Navigate to bookings page with artisan ID
    this.router.navigate(['/account/bookings'], { 
      queryParams: { artisanId: id } 
    });
  }
  categoryOptions: AccountTypeOption[] = [
    { title: 'All Categories', value: 'all', description: 'Show all service categories', icon: 'bi-grid' },
    { title: 'Plumbing', value: 'plumbing', description: 'Pipes, drains, and water systems', icon: 'bi-tools' },
    { title: 'Electrical', value: 'electrical', description: 'Wiring, circuits, and appliances', icon: 'bi-lightning' },
    { title: 'Carpentry', value: 'carpentry', description: 'Woodwork and furniture repair', icon: 'bi-hammer' },
    { title: 'Painting', value: 'painting', description: 'Interior and exterior painting', icon: 'bi-paint-bucket' },
    { title: 'Cleaning', value: 'cleaning', description: 'Home and office cleaning services', icon: 'bi-stars' },
    { title: 'Landscaping', value: 'landscaping', description: 'Garden maintenance and design', icon: 'bi-flower1' },
    { title: 'Automotive', value: 'automotive', description: 'Car repair and maintenance', icon: 'bi-car-front' }
  ];

  sortOptions: AccountTypeOption[] = [
    { title: 'Newest', value: 'newest', description: 'Show recently added listings first', icon: 'bi-clock' },
    { title: 'Price: Low to High', value: 'price_asc', description: 'Cheapest options first', icon: 'bi-arrow-up' },
    { title: 'Price: High to Low', value: 'price_desc', description: 'Expensive options first', icon: 'bi-arrow-down' }
  ];

  ngOnInit(): void {
    this.authSubscription = this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
    });

    // Load artisans from service
    this.artisans = this.bookingService.getArtisans();
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }
}
