import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { InputComponent } from '../../../components/ui/input/input';
import { AccountTypeSelectorComponent, AccountTypeOption } from '../../../components/account-type-selector/account-type-selector.component';
import { ButtonComponent } from '../../../components/ui/button/button';
import { PageHeader } from '../../../components/page-header/page-header';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-marketplace',
  standalone: true,
  imports: [CommonModule, InputComponent, AccountTypeSelectorComponent, ButtonComponent, PageHeader],
  templateUrl: './marketplace.html',
  styleUrl: './marketplace.scss',
})
export class Marketplace implements OnInit {
  isAuthenticated: boolean = false;
  private authSubscription?: Subscription;
  constructor(private router: Router,
    private authService: AuthService
  ) { }

  viewDetails(id: number) {
    this.router.navigate(['/content/market-place', id]);
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

  listings = [
    {
      id: 1,
      category: 'Plumbing',
      date: 'Dec 03',
      title: 'Professional Plumbing Services',
      description: 'I am a professional plumbing services provider with over 5 years of experience...',
      priceRange: '₦2,000 - 5,000',
      location: 'Sabo Bakin Zuwo Street, Gwarinpa, Nigeria',
      image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=2072&auto=format&fit=crop'
    },
    {
      id: 2,
      category: 'Electrical',
      date: 'Nov 21',
      title: 'Expert Electrical Repairs',
      description: 'Highly skilled electrician available for home and office repairs. Wiring, installation, and maintenance.',
      priceRange: '₦4,000 - 10,000',
      location: '67, Zone D, Apo Resettlement, Abuja',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop'
    },
    {
      id: 3,
      category: 'Academic',
      date: 'Nov 21',
      title: 'Learn Academic Research',
      description: 'Learn academic research with an experience and dedicated researcher. Thesis and project assistance.',
      priceRange: '₦3,000 - 10,000',
      location: 'Conference Center ABU Zaria',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop'
    }
  ];

  ngOnInit(): void {
    this.authSubscription = this.authService.isAuthenticated$.subscribe(isAuth => {
      // Filter menu items based on authentication status
      this.isAuthenticated = isAuth;
    });
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }
}
