import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { InputComponent } from '../../../components/ui/input/input';
import { ThemeToggleComponent } from '../../../components/ui/theme-toggle/theme-toggle.component';
import { ToastService } from '../../../services/toast.service';
import { AuthApiService } from '../../../services/auth-api.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, InputComponent, ThemeToggleComponent],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss'
})
export class ResetPassword implements OnInit {
  resetForm: FormGroup;
  submitted = false;
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  email: string | null = null;
  token: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastService: ToastService,
    private apiService: AuthApiService,
    private route: ActivatedRoute
  ) {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });


  }

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParamMap.get('email');
    this.token = this.route.snapshot.queryParamMap.get('token');
    console.log('Reset Password for email:', this.email, 'with token:', this.token);
  }

  // Custom validator for password matching
  passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    return password && confirmPassword && password.value !== confirmPassword.value
      ? { passwordMismatch: true }
      : null;
  };

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.resetForm.invalid) {
      return;
    }

    if (!this.email || !this.token) {
      this.errorMessage = 'Invalid password reset link. Please try again.';
      this.toastService.error(this.errorMessage);
      return;
    }

    const { password, confirmPassword } = this.resetForm.value;
    const data = {
      email: this.email,
      token: this.token,
      newPassword: password,
      confirmPassword: confirmPassword
    }

    this.apiService.resetPassword(data)
      .subscribe({
        next: (response) => {
          setTimeout(() => {
            this.isLoading = false;
            this.successMessage = 'Password has been successfully reset.';
            this.toastService.success('Password has been successfully reset.');
            this.resetForm.reset();
            this.router.navigate(['/login']);
          }, 1500);
        },
        error: (error: any) => {
          this.isLoading = false;
          this.errorMessage = error?.error?.message || error?.message || 'An error occurred. Please try again.';
          this.toastService.error(this.errorMessage);
          setTimeout(() => {
             this.errorMessage = '';
             this.resetForm.reset();
           }, 3000);
        }
      });
  }
}
