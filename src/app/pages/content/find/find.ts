import { Component, AfterViewInit, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageHeader } from '../../../components/page-header/page-header';
import { InputComponent } from '../../../components/ui/input/input';
import { ButtonComponent } from '../../../components/ui/button/button';
import { AccountTypeSelectorComponent, AccountTypeOption } from '../../../components/account-type-selector/account-type-selector.component';
import * as L from 'leaflet';

@Component({
  selector: 'app-find',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PageHeader,
    InputComponent,
    ButtonComponent,
    AccountTypeSelectorComponent
  ],
  templateUrl: './find.html',
  styleUrl: './find.scss',
})
export class Find implements AfterViewInit {
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  private map: L.Map | undefined;

  // Filter States
  location: string = '';
  maxDistance: string = '10';
  specialization: string = '';
  skill: string = '';
  maxHourlyRate: string = '';
  minRating: string = 'any';
  onlyAvailable: boolean = true;

  // Options
  ratingOptions: AccountTypeOption[] = [
    { title: 'Any', value: 'any', description: 'All ratings', icon: 'bi-star' },
    { title: '4.5 & up', value: '4.5', description: 'Excellent', icon: 'bi-star-fill' },
    { title: '4.0 & up', value: '4.0', description: 'Very Good', icon: 'bi-star-half' },
    { title: '3.0 & up', value: '3.0', description: 'Good', icon: 'bi-star' },
  ];

  // UI State
  activeTab: 'artisans' | 'services' = 'artisans';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  setActiveTab(tab: 'artisans' | 'services') {
    this.activeTab = tab;
    // Re-initialize map if switching back to artisans tab
    if (tab === 'artisans' && isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        if (this.map) {
          this.map.invalidateSize();
        }
      }, 0);
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Delay map initialization to ensure container has dimensions
      setTimeout(() => {
        this.initMap();
      }, 100);
    }
  }

  private initMap(): void {
    if (!this.mapContainer || !this.mapContainer.nativeElement) {
      console.error('Map container not found');
      return;
    }

    const lagosCoords: L.LatLngExpression = [6.5244, 3.3792]; // Lagos, Nigeria

    try {
      this.map = L.map(this.mapContainer.nativeElement, {
        center: lagosCoords,
        zoom: 13,
        zoomControl: true,
        attributionControl: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(this.map);

      // Force map to recalculate size after initialization
      setTimeout(() => {
        if (this.map) {
          this.map.invalidateSize();
        }
      }, 100);

      // Sample Markers
      const artisans = [
        { coords: [6.5244, 3.3792], title: 'John Doe - Plumber' },
        { coords: [6.5000, 3.3500], title: 'Jane Smith - Electrician' },
        { coords: [6.5300, 3.4000], title: 'Mike Ross - Carpenter' }
      ];

      artisans.forEach(artisan => {
        if (this.map) {
          L.marker(artisan.coords as L.LatLngExpression)
            .addTo(this.map)
            .bindPopup(artisan.title);
        }
      });

      // Fix for broken marker icons in Angular/Leaflet
      const iconRetinaUrl = 'assets/icon/marker-icon-2x.png';
      const iconUrl = 'assets/icon/marker-icon.png';
      const shadowUrl = 'assets/icon/marker-shadow.png';
      const iconDefault = L.icon({
        iconRetinaUrl,
        iconUrl,
        shadowUrl,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41]
      });
      L.Marker.prototype.options.icon = iconDefault;
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }

  onUseLocation() {
    console.log('Use my location clicked');
    if (navigator.geolocation && this.map) {
      navigator.geolocation.getCurrentPosition((position) => {
        const coords: L.LatLngExpression = [position.coords.latitude, position.coords.longitude];
        this.map?.setView(coords, 15);
        L.marker(coords).addTo(this.map!).bindPopup('You are here').openPopup();
        this.location = 'Current Location';
      }, () => {
        alert('Could not get your location');
      });
    }
  }

  onSearch() {
    console.log('Searching artisans...', {
      location: this.location,
      distance: this.maxDistance,
      specialization: this.specialization,
      skill: this.skill,
      rating: this.minRating,
      rate: this.maxHourlyRate,
      available: this.onlyAvailable
    });
  }
}
