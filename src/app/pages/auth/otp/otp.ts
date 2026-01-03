import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ThemeToggleComponent } from '../../../components/ui/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ThemeToggleComponent],
  templateUrl: './otp.html',
  styleUrl: './otp.scss'
})
export class OtpComponent {
  otpForm: FormGroup;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.otpForm = this.fb.group({
      digits: this.fb.array(new Array(6).fill('').map(() => this.fb.control('', [Validators.required, Validators.pattern('[0-9]')]))),
    });
  }

  get digits(): FormArray {
    return this.otpForm.get('digits') as FormArray;
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    // Handle Backspace
    if (event.key === 'Backspace') {
      if (!value && index > 0) {
        this.focusInput(index - 1);
      }
    }
  }

  onInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Handle Paste (simplified for single digit inputs)
    if (value.length > 1) {
      // Logic for pasting full code could go here, but for now duplicate input is prevented by maxlength=1
      input.value = value[0];
      this.digits.at(index).setValue(value[0]);
    }

    if (value && index < 5) {
      this.focusInput(index + 1);
    }

    // Auto submit if all filled
    if (this.otpForm.valid) {
      this.verifyOtp();
    }
  }

  focusInput(index: number): void {
    const inputs = this.otpInputs.toArray();
    if (inputs[index]) {
      inputs[index].nativeElement.focus();
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const clipboardData = event.clipboardData || (window as any).clipboardData;
    const pastedData = clipboardData.getData('Text');

    if (!pastedData || !/^\d+$/.test(pastedData)) return;

    const digits = pastedData.split('').slice(0, 6);
    digits.forEach((digit: string, index: number) => {
      if (index < 6) {
        this.digits.at(index).setValue(digit);
      }
    });

    // Focus last filled or first empty
    const targetIndex = Math.min(digits.length, 5);
    this.focusInput(targetIndex);

    if (this.otpForm.valid) {
      this.verifyOtp();
    }
  }

  verifyOtp(): void {
    this.isLoading = true;
    this.otpForm.disable(); // Prevent editing while submitting

    const code = this.digits.value.join('');
    console.log('Verifying OTP:', code);

    // Simulate API
    setTimeout(() => {
      this.isLoading = false;
      this.successMessage = 'Verification successful! Redirecting...';
      setTimeout(() => {
        this.router.navigate(['/reset-password']); 
      }, 1000);
    }, 1500);
  }

  resendCode(): void {
    // Mock Resend
    console.log('Resending code...');
  }
}
