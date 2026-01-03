import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-toggle-button',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './toggle-button.html',
  styleUrl: './toggle-button.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleButton),
      multi: true
    }
  ]
})
export class ToggleButton implements ControlValueAccessor {
  @Input() label: string = ''; // Optional specific label if needed, but projected content is flexible
  value: boolean = false;
  isDisabled: boolean = false;

  onChange: any = () => { };
  onTouched: any = () => { };

  writeValue(value: boolean): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onToggleChange(event: any) {
    this.value = event.target.checked;
    this.onChange(this.value);
    this.onTouched();
  }
}
