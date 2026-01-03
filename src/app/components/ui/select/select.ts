import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

export interface SelectOption {
  label: string;
  value: any;
  disabled?: boolean;
}

@Component({
  selector: 'app-select',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './select.html',
  styleUrl: './select.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ]
})
export class SelectComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() id: string = '';
  @Input() name: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() multiple: boolean = false;
  @Input() options: SelectOption[] = [];
  @Input() placeholder: string = 'Select an option';
  @Input() helpText: string = '';
  @Input() errorMessage: string = '';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() icon: string = '';

  value: any = '';
  @Input() isTouched: boolean = false;
  isFocused: boolean = false;

  private onChange: (value: any) => void = () => { };
  private onTouched: () => void = () => { };

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

  onSelectChange(event: Event): void {
    const target = event.target as HTMLSelectElement;

    if (this.multiple) {
      const selectedOptions = Array.from(target.selectedOptions).map(opt => opt.value);
      this.value = selectedOptions;
      this.onChange(selectedOptions);
    } else {
      this.value = target.value;
      this.onChange(target.value);
    }
  }

  onBlur(): void {
    this.isTouched = true;
    this.isFocused = false;
    this.onTouched();
  }

  onFocus(): void {
    this.isFocused = true;
  }

  get sizeClass(): string {
    return `form-select-${this.size}`;
  }
}
