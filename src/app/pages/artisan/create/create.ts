import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InputComponent } from '../../../components/ui/input/input';
import { TextareaComponent } from '../../../components/ui/textarea/textarea';
import { ButtonComponent } from '../../../components/ui/button/button';
import { ArtisanService } from '../../../services/artisan.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-create',
  imports: [CommonModule, ReactiveFormsModule, InputComponent, TextareaComponent, ButtonComponent],
  templateUrl: './create.html',
  styleUrl: './create.scss',
})
export class Create implements OnInit {
  artisanForm!: FormGroup;
  selectedCertificates: File[] = [];
  certificatePreviewUrls: string[] = [];
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private artisanService: ArtisanService,
    private toastService: ToastService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.artisanForm = this.fb.group({
      specialization: ['Plumbing', [Validators.required, Validators.minLength(2)]],
      bio: ['', [Validators.maxLength(1000)]],
      skills: ['', [Validators.required]],
      portfolioUrl: ['', [Validators.pattern(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/)]],
      certifications: [''],
      serviceAreas: ['', [Validators.required]],
      yearsOfExperience: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      hourlyRate: ['', [Validators.required, Validators.min(0)]],
      isAvailable: [true, [Validators.required]],
      latitude: ['', [Validators.required, Validators.min(-90), Validators.max(90)]],
      longitude: ['', [Validators.required, Validators.min(-180), Validators.max(180)]],
      locationAddress: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  onCertificateFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files);

      // Validate file types (only images and PDFs)
      const validFiles = files.filter(file => {
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
        return validTypes.includes(file.type);
      });

      if (validFiles.length !== files.length) {
        this.toastService.error('Only JPEG, PNG, and PDF files are allowed');
      }

      // Add to existing files
      this.selectedCertificates = [...this.selectedCertificates, ...validFiles];

      // Generate preview URLs for images
      validFiles.forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.certificatePreviewUrls.push(e.target.result);
          };
          reader.readAsDataURL(file);
        } else {
          this.certificatePreviewUrls.push(''); // No preview for PDFs
        }
      });
    }
  }

  removeCertificate(index: number): void {
    this.selectedCertificates.splice(index, 1);
    this.certificatePreviewUrls.splice(index, 1);
  }

  getCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.artisanForm.patchValue({
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6)
          });
          this.toastService.success('Location retrieved successfully!');
        },
        (error) => {
          console.error('Error getting location:', error);
          this.toastService.error('Unable to get your location. Please enter manually.');
        }
      );
    } else {
      this.toastService.error('Geolocation is not supported by your browser.');
    }
  }

  onSubmit(): void {
    if (this.artisanForm.valid) {
      this.isSubmitting = true;

      // Prepare form data
      const formData = new FormData();

      // Append all form fields
      Object.keys(this.artisanForm.value).forEach(key => {
        const value = this.artisanForm.value[key];
        // Convert boolean to string for FormData
        formData.append(key, value !== null && value !== undefined ? value.toString() : '');
      });

      // Append certificate files
      this.selectedCertificates.forEach((file) => {
        formData.append('certificateFiles', file, file.name);
      });

      // Submit to API
      this.artisanService.createProfile(formData).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.toastService.success('Artisan profile created successfully!');

          // Navigate to dashboard after successful creation
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        },
        error: (error) => {
          this.isSubmitting = false;
          const errorMessage = error?.error?.message || error?.message || 'Failed to create profile. Please try again.';
          this.toastService.error(errorMessage);
          console.error('Profile creation error:', error);
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.artisanForm.controls).forEach(key => {
        this.artisanForm.get(key)?.markAsTouched();
      });
      this.toastService.error('Please fill in all required fields correctly.');
    }
  }

  onCancel(): void {
    this.router.navigate(['/login']);
  }
}
