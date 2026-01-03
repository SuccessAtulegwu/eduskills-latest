import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  currentYear = new Date().getFullYear();
  
  socialLinks = [
    { name: 'Facebook', icon: 'bi-facebook', url: '#' },
    { name: 'Twitter', icon: 'bi-twitter', url: '#' },
    { name: 'LinkedIn', icon: 'bi-linkedin', url: '#' },
    { name: 'Instagram', icon: 'bi-instagram', url: '#' },
    { name: 'YouTube', icon: 'bi-youtube', url: '#' }
  ];

  quickLinks = [
    { label: 'About Us', route: '/about' },
    { label: 'Courses', route: '/courses' },
    { label: 'Instructors', route: '/instructors' },
    { label: 'Contact', route: '/contact' }
  ];

  supportLinks = [
    { label: 'Help Center', route: '/help' },
    { label: 'Terms of Service', route: '/terms' },
    { label: 'Privacy Policy', route: '/privacy' },
    { label: 'FAQ', route: '/faq' }
  ];
}

