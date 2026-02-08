import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { InputComponent } from '../../../components/ui/input/input';
import { AccountTypeSelectorComponent, AccountTypeOption } from '../../../components/account-type-selector/account-type-selector.component';
import { ButtonComponent } from '../../../components/ui/button/button';
import { PageHeader } from '../../../components/page-header/page-header';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth';
import { MarketplaceService } from '../../../services/marketplace.service';
import { BookingService, Artisan } from '../../../services/booking.service';

interface MarketplaceListing {
  id: string;
  name: string;
  title: string;
  avatar?: string;
  image?: string;
  category: string;
  rating?: number;
  reviews?: number;
  priceRange?: string;
  location?: string;
  description: string;
  responseTime?: string;
  phone?: string;
  availability?: ('online' | 'in-person')[];
}

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
  listings: MarketplaceListing[] = [];
  isLoading: boolean = false;
  private authSubscription?: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService,
    private marketplaceService: MarketplaceService,
    private bookingService: BookingService // Keep for fallback to mock data
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

    // Load marketplace listings from API
    this.loadMarketplaceListings();
  }

  loadMarketplaceListings(): void {
    this.isLoading = true;
    this.marketplaceService.getListings().subscribe({
      next: (response: any) => {
        // Map API response to local listing format
        if (Array.isArray(response)) {
          this.listings = response.map((listing: any) => this.mapToMarketplaceListing(listing));
          // Also update artisans for backward compatibility with template
          this.artisans = this.listings.map(l => this.convertListingToArtisan(l));
        } else if (response?.data && Array.isArray(response.data)) {
          this.listings = response.data.map((listing: any) => this.mapToMarketplaceListing(listing));
          this.artisans = this.listings.map(l => this.convertListingToArtisan(l));
        } else {
          console.warn('Unexpected API response format, using fallback data');
          this.useFallbackData();
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load marketplace listings:', err);
        // Fallback to mock data from BookingService
        this.useFallbackData();
        this.isLoading = false;
      }
    });
  }

  private useFallbackData(): void {
    this.artisans = this.bookingService.getArtisans();
    this.listings = this.artisans.map(a => ({
      id: a.id,
      name: a.name,
      title: a.title,
      avatar: a.avatar,
      image: a.image,
      category: a.category,
      rating: a.rating,
      reviews: a.reviews,
      priceRange: a.priceRange,
      location: a.location,
      description: a.description,
      responseTime: a.responseTime,
      phone: a.phone,
      availability: a.availability
    }));
  }

  private mapToMarketplaceListing(apiListing: any): MarketplaceListing {
    return {
      id: apiListing.id || apiListing.listingId,
      name: apiListing.name || apiListing.title || 'Unknown',
      title: apiListing.title || apiListing.serviceType || '',
      avatar: apiListing.avatar || apiListing.imageUrl,
      image: apiListing.image || apiListing.imageUrl,
      category: apiListing.category || 'General',
      rating: apiListing.rating || 0,
      reviews: apiListing.reviewCount || apiListing.reviews || 0,
      priceRange: apiListing.priceRange || apiListing.price,
      location: apiListing.location,
      description: apiListing.description || '',
      responseTime: apiListing.responseTime,
      phone: apiListing.phone || apiListing.contactPhone,
      availability: apiListing.availability || ['online', 'in-person']
    };
  }

  private convertListingToArtisan(listing: MarketplaceListing): Artisan {
    return {
      id: listing.id,
      name: listing.name,
      title: listing.title,
      avatar: listing.avatar || 'https://i.pravatar.cc/150',
      category: listing.category,
      rating: listing.rating || 0,
      reviews: listing.reviews || 0,
      priceRange: listing.priceRange || 'Contact for pricing',
      location: listing.location || 'Location not specified',
      description: listing.description,
      image: listing.image || listing.avatar || 'https://via.placeholder.com/400',
      responseTime: listing.responseTime || 'N/A',
      phone: listing.phone || '',
      availability: listing.availability || ['online', 'in-person']
    };
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }
}
