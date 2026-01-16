import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../components/ui/button/button';
import { BookingService, Artisan } from '../../../../services/booking.service';

@Component({
  selector: 'app-details',
  imports: [CommonModule, RouterModule, ButtonComponent, FormsModule],
  templateUrl: './details.html',
  styleUrl: './details.scss',
})
export class Details implements OnInit {
  id: string | null = null;
  artisan: Artisan | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (this.id) {
        this.artisan = this.bookingService.getArtisanById(this.id) || null;
      }
    });
  }

  bookNow() {
    if (this.id) {
      // Navigate to bookings page with artisan ID
      this.router.navigate(['/account/bookings'], { 
        queryParams: { artisanId: this.id } 
      });
    }
  }
}
