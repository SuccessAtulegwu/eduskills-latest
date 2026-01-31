import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InputComponent } from '../../../../components/ui/input/input';
import { TextareaComponent } from '../../../../components/ui/textarea/textarea';
import { ButtonComponent } from '../../../../components/ui/button/button';
import { AccountTypeSelectorComponent, AccountTypeOption } from '../../../../components/account-type-selector/account-type-selector.component';
import { PageHeader } from '../../../../components/page-header/page-header';
import { CourseService } from '../course.service';
import { CreateCourseRequest } from '../../../../models/course.model';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputComponent,
    TextareaComponent,
    ButtonComponent,
    AccountTypeSelectorComponent,
    PageHeader
  ],
  templateUrl: './create.html',
  styleUrl: './create.scss',
})
export class Create {
  // Form Data
  courseTitle: string = '';
  courseDescription: string = '';
  price: string = '';
  duration: string = '';

  selectedCategory: string = '';
  selectedLevel: string = '';
  selectedExamType: string = 'none';

  // File Upload
  selectedFileName: string = 'No file chosen';
  selectedFile: File | null = null;

  // Certification Settings
  enableCertification: boolean = false;
  selectedTemplate: string = 'default';
  passingScore: string = '';

  // Loading state
  isSubmitting: boolean = false;

  // Options
  categories: AccountTypeOption[] = [
    { title: 'Development', value: 'development', description: 'Tech & Code', icon: 'bi-code-slash' },
    { title: 'Design', value: 'design', description: 'UI/UX & Art', icon: 'bi-palette' },
    { title: 'Business', value: 'business', description: 'Finance', icon: 'bi-briefcase' },
  ];

  levels: AccountTypeOption[] = [
    { title: 'Beginner', value: 'beginner', description: 'For starters', icon: 'bi-1-circle' },
    { title: 'Intermediate', value: 'intermediate', description: 'Mid-level', icon: 'bi-2-circle' },
    { title: 'Advanced', value: 'advanced', description: 'Experts', icon: 'bi-3-circle' },
  ];

  examTypes: AccountTypeOption[] = [
    { title: 'None', value: 'none', description: 'No specific exam', icon: 'bi-x-circle' },
    { title: 'WAEC', value: 'waec', description: 'West African Exam', icon: 'bi-book' },
    { title: 'JAMB', value: 'jamb', description: 'Joint Admissions', icon: 'bi-journal-check' },
    { title: 'NECO', value: 'neco', description: 'National Exam', icon: 'bi-file-text' },
  ];

  certificateTemplates: AccountTypeOption[] = [
    { title: 'Use Default Template', value: 'default', description: 'Standard layout', icon: 'bi-file-earmark-text' },
    { title: 'Modern Dark', value: 'modern_dark', description: 'Dark theme', icon: 'bi-moon' },
    { title: 'Classic Gold', value: 'classic_gold', description: 'Elegant style', icon: 'bi-award' },
  ];

  constructor(
    private location: Location,
    private router: Router,
    private courseService: CourseService,
    private toastService: ToastService
  ) { }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name;
      this.selectedFile = file;
    }
  }

  onCancel() {
    this.location.back();
  }

  onSubmit() {
    // Validate required fields
    if (!this.courseTitle.trim() || !this.courseDescription.trim()) {
      this.toastService.show('Please fill in all required fields', 'error');
      return;
    }

    this.isSubmitting = true;

    // Map exam type string to number (0-5)
    const examTypeMap: { [key: string]: number } = {
      'none': 0,
      'waec': 1,
      'jamb': 2,
      'neco': 3
    };

    // Prepare course data
    const courseData: CreateCourseRequest = {
      title: this.courseTitle.trim(),
      description: this.courseDescription.trim(),
      price: this.price ? parseFloat(this.price) : undefined,
      durationHours: this.duration ? parseInt(this.duration) : undefined,
      categoryId: this.selectedCategory ? this.getCategoryId(this.selectedCategory) : undefined,
      level: this.selectedLevel || undefined,
      examType: this.selectedExamType !== 'none' ? examTypeMap[this.selectedExamType] : undefined,
      certificationEnabled: this.enableCertification,
      certificateTemplateId: this.enableCertification && this.selectedTemplate !== 'default' 
        ? this.getTemplateId(this.selectedTemplate) 
        : undefined,
      passingScore: this.enableCertification && this.passingScore 
        ? parseFloat(this.passingScore) 
        : undefined,
      thumbnailFile: this.selectedFile || undefined
    };

    // Call API to create course
    this.courseService.createCourse(courseData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.toastService.show('Course created successfully!', 'success');
        // Navigate to course details or courses list
        this.router.navigate(['/content/courses']);
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error creating course:', error);
        const errorMessage = error?.error?.message || 'Failed to create course. Please try again.';
        this.toastService.show(errorMessage, 'error');
      }
    });
  }

  // Helper method to map category string to categoryId
  private getCategoryId(category: string): number {
    const categoryMap: { [key: string]: number } = {
      'development': 1,
      'design': 2,
      'business': 3
    };
    return categoryMap[category] || 1;
  }

  // Helper method to map template string to templateId
  private getTemplateId(template: string): number {
    const templateMap: { [key: string]: number } = {
      'default': 1,
      'modern_dark': 2,
      'classic_gold': 3
    };
    return templateMap[template] || 1;
  }
}
