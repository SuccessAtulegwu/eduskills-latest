import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DropdownItem {
  label: string;
  value: any;
  icon?: string;
  divider?: boolean;
  header?: boolean;
  disabled?: boolean;
  action?: () => void;
}

@Component({
  selector: 'app-dropdown',
  imports: [CommonModule],
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.scss'
})
export class DropdownComponent {
  @Input() label: string = 'Dropdown';
  @Input() items: DropdownItem[] = [];
  @Input() variant: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' = 'primary';
  @Input() outline: boolean = false;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() icon: string = '';
  @Input() disabled: boolean = false;
  @Input() align: 'left' | 'right' = 'left';
  
  @Output() itemSelected = new EventEmitter<DropdownItem>();

  isOpen = false;

  ngOnInit(): void {
    // Close dropdown when clicking outside
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        this.isOpen = false;
      }
    });
  }

  toggle(event: Event): void {
    event.stopPropagation();
    if (!this.disabled) {
      this.isOpen = !this.isOpen;
    }
  }

  selectItem(event: Event, item: DropdownItem): void {
    event.preventDefault();
    if (!item.disabled && !item.divider && !item.header) {
      this.itemSelected.emit(item);
      if (item.action) {
        item.action();
      }
      this.isOpen = false;
    }
  }

  get buttonClass(): string {
    const classes = ['btn', 'dropdown-toggle'];
    classes.push(this.outline ? `btn-outline-${this.variant}` : `btn-${this.variant}`);
    if (this.size !== 'md') classes.push(`btn-${this.size}`);
    return classes.join(' ');
  }
}
