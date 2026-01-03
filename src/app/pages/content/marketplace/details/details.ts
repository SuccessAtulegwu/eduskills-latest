import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../../components/ui/button/button';

@Component({
  selector: 'app-details',
  imports: [CommonModule, RouterModule, ButtonComponent],
  templateUrl: './details.html',
  styleUrl: './details.scss',
})
export class Details implements OnInit {
  id: number | null = null;
  item: any = null;

  // Mock data (shared source would be better in real app)
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

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = Number(params.get('id'));
      this.item = this.listings.find(l => l.id === this.id);
    });
  }
}
