import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-button',
  imports: [CommonModule, RouterModule],
  templateUrl: './button.html',
  styleUrl: './button.scss'
})
export class ButtonComponent {
  @Input() label: string = '';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'link' = 'primary';
  @Input() outline: boolean = false;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() icon: string = '';
  @Input() iconPosition: 'left' | 'right' = 'left';
  @Input() fullWidth: boolean = false;
  @Input() rounded: boolean = false;
  @Input() routerLink: string = '';
  @Input() href: string = '';
  @Input() target: string = '';
  @Input() class: string = '';
  
  @Output() clicked = new EventEmitter<Event>();

  onClick(event: Event): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit(event);
    }
  }

  get buttonClass(): string {
    const classes: string[] = ['btn'];
    
    // Variant
    if (this.outline) {
      classes.push(`btn-outline-${this.variant}`);
    } else {
      classes.push(`btn-${this.variant}`);
    }
    
    // Size
    if (this.size !== 'md') {
      classes.push(`btn-${this.size}`);
    }
    
    // Full width
    if (this.fullWidth) {
      classes.push('w-100');
    }
    
    // Rounded
    if (this.rounded) {
      classes.push('rounded-pill');
    }
    
    // Loading state
    if (this.loading) {
      classes.push('btn-loading');
    }
    
    // Custom classes
    if (this.class) {
      classes.push(this.class);
    }
    
    return classes.join(' ');
  }

  get isLink(): boolean {
    return !!this.routerLink || !!this.href;
  }
}
