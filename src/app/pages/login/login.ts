import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { ThemeService } from '../../services/theme';
import { ThemeToggleComponent } from '../../components/ui/theme-toggle/theme-toggle.component';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule,ThemeToggleComponent],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  showPassword = false;
  rememberMe = false;
  isLoading = false;
  errorMessage = '';
  isDarkMode = false;

  constructor(
    private authService: AuthService,
    private themeService: ThemeService,
    private router: Router,
    private builder: FormBuilder,
    private toastService:ToastService
  ) {
    this.loginForm = builder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    })
  }

  ngOnInit(): void {

    // Check if user is already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }

    // Subscribe to theme changes
    this.themeService.theme$.subscribe(theme => {
      this.isDarkMode = theme === 'dark';
    });

    var email = localStorage.getItem('email');
    if (email) {
      this.loginForm.patchValue({ email: email });
      this.loginForm.patchValue({rememberMe: true});
    }

  }

  get f() {
    return this.loginForm.controls;
  }

  onReset(): void {
    this.submitted = false;
    this.errorMessage = '';
    this.loginForm.reset();
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;
    const { email, password, rememberMe } = this.loginForm.value;

    this.authService.login(email, password, rememberMe)
      .subscribe({
        next: (success) => {
          this.isLoading = false;
          if (success) {
            this.toastService.success('Login successful!')
            this.onReset();
            this.router.navigate(['/home']);
          } else {
            this.toastService.error('Invalid username or password')
            this.errorMessage = 'Invalid username or password';
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'An error occurred. Please try again.';
          console.error('Login error:', error);
        }
      });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  clearErrorMessage() {
    this.errorMessage = ''
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  forgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
}
