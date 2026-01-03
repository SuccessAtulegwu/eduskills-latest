import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-input',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search-input.html',
  styleUrl: './search-input.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchInputComponent),
      multi: true
    }
  ]
})
export class SearchInputComponent implements ControlValueAccessor {
  @Input() placeholder: string = 'Search...';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() variant: 'default' | 'rounded' | 'minimal' = 'default';
  @Input() showIcon: boolean = true;
  @Input() showClearButton: boolean = true;
  @Input() debounceTime: number = 300; // milliseconds
  @Input() disabled: boolean = false;
  @Input() fullWidth: boolean = false;
  @Input() label: string = '';
  @Input() position: 'standalone' | 'navbar' | 'inline' = 'standalone';
  @Input() autofocus: boolean = false;
  @Input() loading: boolean = false;
  
  @Output() searchChanged = new EventEmitter<string>();
  @Output() searchSubmit = new EventEmitter<string>();
  @Output() cleared = new EventEmitter<void>();

  value: string = '';
  isFocused: boolean = false;
  private debounceTimer: any;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: any): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
    
    // Clear existing timer
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    
    // Set new timer for debounced search
    this.debounceTimer = setTimeout(() => {
      this.searchChanged.emit(this.value);
    }, this.debounceTime);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.onSubmit();
    } else if (event.key === 'Escape') {
      this.clear();
    }
  }

  onSubmit(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    this.searchSubmit.emit(this.value);
  }

  clear(): void {
    this.value = '';
    this.onChange('');
    this.searchChanged.emit('');
    this.cleared.emit();
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
  }

  onFocus(): void {
    this.isFocused = true;
  }

  onBlur(): void {
    this.isFocused = false;
    this.onTouched();
  }

  get sizeClass(): string {
    return `search-${this.size}`;
  }

  get variantClass(): string {
    return `search-${this.variant}`;
  }

  get positionClass(): string {
    return `search-${this.position}`;
  }
}
