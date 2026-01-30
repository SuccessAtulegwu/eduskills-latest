import { Component, OnInit } from '@angular/core';
import { AccountTypeOption, AccountTypeSelectorComponent } from '../../components/account-type-selector/account-type-selector.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { AuthApiService } from '../../services/auth-api.service';
import { signUpDto } from '../../models/model';
import { ThemeService } from '../../services/theme';
import { ThemeToggleComponent } from '../../components/ui/theme-toggle/theme-toggle.component';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, AccountTypeSelectorComponent, ThemeToggleComponent],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  errorMessage = '';
  isDarkMode = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private authApiService: AuthApiService,
    private themeService: ThemeService,
    private toastService: ToastService
  ) {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      accountType: ['', Validators.required],
      isContentCreator: [false]
    }, { validators: this.passwordMatchValidator });
  }

  accountTypes: AccountTypeOption[] = [
    { title: 'Student', description: "I'm here to learn", value: 'student', icon: 'bi-mortarboard' },
    { title: 'Artisan', description: "I provide service", value: 'artisan', icon: 'bi-tools' },
    { title: 'Employer', description: "I'm hiring", value: 'employer', icon: 'bi-briefcase' },
    { title: 'General User', description: "Just simpler account", value: 'general', icon: 'bi-person' }
  ];


  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }

    // Subscribe to theme changes
    this.themeService.theme$.subscribe(theme => {
      this.isDarkMode = theme === 'dark';
    });
  }

  // Custom validator for password matching
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  get f() { return this.registerForm.controls; }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onReset(): void {
    this.submitted = false;
    this.errorMessage = '';
    this.registerForm.reset();
  }
  onSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;
    console.log('Form Submitted', this.registerForm.value);
    const { firstName, lastName, email, phoneNumber, password, accountType, isContentCreator } = this.registerForm.value;
    var createdto: signUpDto = {
      SelectedRole: accountType,
      IsCreator: isContentCreator,
      Email: email,
      FirstName: firstName,
      LastName: lastName,
      Password: password,
      PhoneNumber: phoneNumber,
    }
    this.authApiService.register(createdto)
      .subscribe({
        next: (response) => {
          setTimeout(() => {
            this.isLoading = false;
            this.toastService.success('Registration successful! Please login.');
            this.onReset();
            this.router.navigate(['/login']);
          }, 1500);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error?.error?.message || error?.message || 'An error occurred. Please try again.';
          //console.error('SignUp error:', error);
        }
      });
    // Simulate API call

  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  clearErrorMessage() {
    this.errorMessage = ''
  }
}
