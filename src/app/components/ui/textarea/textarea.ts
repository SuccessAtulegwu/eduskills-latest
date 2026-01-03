import { Component, Input, Self, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NgControl, ReactiveFormsModule, FormGroupDirective } from '@angular/forms';

@Component({
    selector: 'app-textarea',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './textarea.html',
    styleUrl: './textarea.scss'
})
export class TextareaComponent implements ControlValueAccessor {
    @Input() label: string = '';
    @Input() placeholder: string = '';
    @Input() id: string = '';
    @Input() name: string = '';
    @Input() required: boolean = false;
    @Input() disabled: boolean = false;
    @Input() readonly: boolean = false;
    @Input() rows: number = 3;
    @Input() helpText: string = '';
    @Input() maxlength: number | null = null;

    value: any = '';
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
        return !!(this.ngControl.invalid && (this.ngControl.touched || isSubmitted));
    }

    get errorMessage(): string {
        if (!this.showErrorState) {
            return '';
        }

        const errors = this.ngControl.control?.errors;
        if (!errors) return '';

        if (errors['required']) return `${this.label || 'Field'} is required`;
        if (errors['minlength']) return `${this.label || 'Field'} must be at least ${errors['minlength'].requiredLength} characters`;
        if (errors['maxlength']) return `${this.label || 'Field'} cannot exceed ${errors['maxlength'].requiredLength} characters`;

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
        const target = event.target as HTMLTextAreaElement;
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
}
