import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { InputComponent } from '../../../components/ui/input/input';
import { ThemeToggleComponent } from '../../../components/ui/theme-toggle/theme-toggle.component';
import { AuthApiService } from '../../../services/auth-api.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, InputComponent, ThemeToggleComponent],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword implements OnInit {
  forgotForm: FormGroup;
  submitted = false;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private apiService: AuthApiService,
    private toastService: ToastService
  ) {
    this.forgotForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
  }

  get f() {
    return this.forgotForm.controls;
  }



  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.forgotForm.invalid) {
      return;
    }

    this.isLoading = true;
    const { email } = this.forgotForm.value;
    this.apiService.forgotPassword(email)
      .subscribe({
        next: (response) => {
          setTimeout(() => {
            this.isLoading = false;
            this.successMessage = `If an account exists for ${email}, you will receive password reset instructions.`;
            this.toastService.success(`If an account exists for ${email}, you will receive password reset instructions.`);
            this.submitted = false;
            this.forgotForm.reset();
            this.router.navigate(['/otp'], { queryParams: { email: email } });
          }, 1500);
        },
        error: (error: any) => {
          this.isLoading = false;
          this.errorMessage = error?.error?.message || error?.message || 'An error occurred. Please try again.';
          this.toastService.error(this.errorMessage);
        }
      });
  }
}
