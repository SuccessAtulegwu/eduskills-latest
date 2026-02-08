import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ThemeToggleComponent } from '../../../components/ui/theme-toggle/theme-toggle.component';
import { AuthApiService } from '../../../services/auth-api.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ThemeToggleComponent],
  templateUrl: './otp.html',
  styleUrl: './otp.scss'
})
export class OtpComponent implements OnInit {
  otpForm: FormGroup;
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  email: string = '';

  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private apiService: AuthApiService,
    private toastService: ToastService
  ) {
    this.otpForm = this.fb.group({
      digits: this.fb.array(new Array(6).fill('').map(() => this.fb.control('', [Validators.required, Validators.pattern('[0-9]')]))),
    });
  }


  ngOnInit(): void {
    this.email = this.route.snapshot.queryParamMap.get('email')!;
    console.log('OTP for email:', this.email);
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
    if (!this.email) {
      this.toastService.warning('Email is missing. Please try again.');
      this.isLoading = false;
      return;
    }

    this.apiService.VerifyResetOtp({ email: this.email, token: code })
      .subscribe({
        next: (response) => {
          setTimeout(() => {
            this.isLoading = false;
            this.successMessage = 'Verification successful! Redirecting...';
            this.toastService.success(`Verification successful! Redirecting...`);
            this.otpForm.reset();
            this.router.navigate(['/reset-password'], { queryParams: { email: this.email, token: code } });
          }, 1500);
        },
        error: (error: any) => {
          this.isLoading = false;
          this.errorMessage = error?.error?.message || error?.message || 'An error occurred. Please try again.';
          //this.toastService.error(this.errorMessage);
           this.otpForm.reset();
           setTimeout(() => {
             this.errorMessage = '';
           }, 3000);
        }
      });
  }

  resendCode(): void {
    // Mock Resend
    console.log('Resending code...');
  }
}
