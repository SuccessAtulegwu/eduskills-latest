import { Component, Input, Self, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NgControl, ReactiveFormsModule, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input.html',
  styleUrl: './input.scss'
})
export class InputComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() id: string = '';
  @Input() name: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() icon: string = '';
  @Input() iconPosition: 'left' | 'right' = 'left';
  @Input() helpText: string = '';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() min: string | number = '';
  @Input() max: string | number = '';
  @Input() step: string | number = '';
  @Input() pattern: string = '';
  @Input() maxlength: number | null = null;
  @Input() autocomplete: string = 'off';

  value: any = '';
  showPassword: boolean = false;
  isFocused: boolean = false;

  constructor(
    @Optional() @Self() public ngControl: NgControl,
    @Optional() private formGroup: FormGroupDirective
  ) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  get showErrorState(): boolean {
    if (!this.ngControl || !this.ngControl.control) return false;
    const isSubmitted = this.formGroup && this.formGroup.submitted;
    // Show error if invalid AND (touched OR submitted)
    return !!(this.ngControl.invalid && (this.ngControl.touched || isSubmitted));
  }

  get errorMessage(): string {
    if (!this.showErrorState) {
      return '';
    }

    const errors = this.ngControl.control?.errors;
    if (!errors) return '';

    if (errors['required']) return `${this.label || 'Field'} is required`;
    if (errors['email']) return 'Please enter a valid email address';
    if (errors['minlength']) return `${this.label || 'Field'} must be at least ${errors['minlength'].requiredLength} characters`;
    if (errors['maxlength']) return `${this.label || 'Field'} cannot exceed ${errors['maxlength'].requiredLength} characters`;
    if (errors['pattern']) return 'Invalid format';

    return 'Invalid value';
  }

  get isInvalid(): boolean {
    return this.showErrorState;
  }

  onChange: (value: any) => void = () => { };
  onTouched: () => void = () => { };

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
  }

  onBlur(): void {
    this.isFocused = false;
    this.onTouched();
  }

  onFocus(): void {
    this.isFocused = true;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  get inputType(): string {
    if (this.type === 'password' && this.showPassword) {
      return 'text';
    }
    return this.type;
  }

  get sizeClass(): string {
    return `form-control-${this.size}`;
  }
}
