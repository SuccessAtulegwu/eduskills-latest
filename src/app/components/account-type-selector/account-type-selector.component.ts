import { Component, Input, forwardRef, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule, FormsModule } from '@angular/forms';

export interface AccountTypeOption {
    label?: string; // Legacy support
    title: string;
    description: string;
    value: string;
    icon: string;
}

@Component({
    selector: 'app-account-type-selector',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule],
    templateUrl: './account-type-selector.component.html',
    styleUrl: './account-type-selector.component.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AccountTypeSelectorComponent),
            multi: true
        }
    ]
})
export class AccountTypeSelectorComponent implements ControlValueAccessor {
    @Input() label: string = 'Account Type';
    @Input() id: string = 'accountType';
    @Input() placeholder: string = 'Select Account Type (Optional)';
    @Input() required: boolean = false;
    @Input() errorMessage: string = '';
    @Input() isTouched: boolean = false; // External touched state
    @Input() accountTypes: AccountTypeOption[] = []

    value: any = '';
    isDisabled: boolean = false;
    internalTouched: boolean = false;
    isOpen: boolean = false;
    
    onChange: (value: any) => void = () => { };
    onTouched: () => void = () => { };

    constructor(private elementRef: ElementRef) { }

    get selectedOption(): AccountTypeOption | undefined {
        return this.accountTypes.find(type => type.value === this.value);
    }

    get disabled(): boolean {
        return this.isDisabled;
    }

    @Input()
    set disabled(value: boolean) {
        this.isDisabled = value;
    }

    writeValue(value: any): void {
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

    toggleDropdown(event: Event) {
        if (this.isDisabled) return;
        this.isOpen = !this.isOpen;

        if (!this.isOpen) {
            this.onBlur();
        }
    }

    selectOption(option: AccountTypeOption, event: Event) {
        event.stopPropagation();
        this.value = option.value;
        this.onChange(this.value);
        this.isOpen = false;
        this.onBlur();
    }

    onBlur() {
        this.internalTouched = true;
        this.onTouched();
    }

    @HostListener('document:click', ['$event'])
    onClickOutside(event: Event) {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.isOpen = false;
            // Note: We might mark as touched here if needed, but usually only on explicit blur/interaction
        }
    }
}
