import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { AuthApiService } from '../../services/auth-api.service';
import { ThemeService } from '../../services/theme';
import { ThemeToggleComponent } from '../../components/ui/theme-toggle/theme-toggle.component';
import { ToastService } from '../../services/toast.service';
import { RoleNavigationService } from '../../services/role-navigation.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, ThemeToggleComponent],
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
    private authApiService: AuthApiService,
    private themeService: ThemeService,
    private router: Router,
    private builder: FormBuilder,
    private toastService: ToastService,
    private roleNavigation: RoleNavigationService
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
      // Navigate based on role
      this.roleNavigation.navigateByRole();
      return;
    }

    // Subscribe to theme changes
    this.themeService.theme$.subscribe(theme => {
      this.isDarkMode = theme === 'dark';
    });

    var email = localStorage.getItem('email');
    if (email) {
      this.loginForm.patchValue({ email: email });
      this.loginForm.patchValue({ rememberMe: true });
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
    if (rememberMe) {
      localStorage.setItem('email', email);
    }

    const credentials = {
      Email: email,
      Password: password
    };

    this.authApiService.login(credentials)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.toastService.success('Login successful!');
          this.onReset();

          // Navigate based on user role
          this.roleNavigation.navigateByRole();
        },
        error: (error: any) => {
          this.isLoading = false;
          this.errorMessage = error?.error?.message || error?.message || 'An error occurred. Please try again.';
          this.toastService.error(this.errorMessage);
          //console.log('Login error:', error,);
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
