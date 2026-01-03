import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header-title',
  imports: [CommonModule],
  templateUrl: './header-title.html',
  styleUrl: './header-title.scss'
})
export class HeaderTitleComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() icon: string = '';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() showDivider: boolean = true;
  @Input() breadcrumbs: string[] = [];
}
