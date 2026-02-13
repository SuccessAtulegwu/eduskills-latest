import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { InputComponent } from '../../../../components/ui/input/input';
import { TextareaComponent } from '../../../../components/ui/textarea/textarea';
import { ButtonComponent } from '../../../../components/ui/button/button';
import { AccountTypeSelectorComponent, AccountTypeOption } from '../../../../components/account-type-selector/account-type-selector.component';
import { PageHeader } from '../../../../components/page-header/page-header';
import { UpdateCourseRequest, CourseResponse } from '../../../../models/course.model';
import { ToastService } from '../../../../services/toast.service';
import { CategoriesService } from '../../../../services/categories.service';
import { Category } from '../../../../models/category.model';
import { CourseService } from '../../../../services/course.service';

@Component({
  selector: 'app-edit',
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
  templateUrl: './edit.html',
  styleUrl: './edit.scss',
})
export class Edit implements OnInit {
  // Course ID
  courseId: number = 0;

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
  currentThumbnailUrl: string = '';

  // Certification Settings
  enableCertification: boolean = false;
  selectedTemplate: string = 'default';
  passingScore: string = '';

  // Loading state
  isSubmitting: boolean = false;
  isLoadingCategories: boolean = false;
  isLoadingCourse: boolean = false;

  // API Categories
  apiCategories: Category[] = [];

  // Options
  categories: AccountTypeOption[] = [];

  levels: AccountTypeOption[] = [
    { title: 'Beginner', value: 'Beginner', description: 'For starters', icon: 'bi-1-circle' },
    { title: 'Intermediate', value: 'Intermediate', description: 'Mid-level', icon: 'bi-2-circle' },
    { title: 'Advanced', value: 'Advanced', description: 'Experts', icon: 'bi-3-circle' },
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
    private route: ActivatedRoute,
    private courseService: CourseService,
    private toastService: ToastService,
    private categoryService: CategoriesService
  ) { }

  ngOnInit() {
    // Get course ID from route
    this.route.params.subscribe(params => {
      this.courseId = +params['id'];
      if (this.courseId) {
        this.loadCourse();
      }
    });

    this.loadCategories();
  }

  /**
   * Load course data
   */
  loadCourse() {
    this.isLoadingCourse = true;
    this.courseService.getCourseById(this.courseId).subscribe({
      next: (course) => {
        console.log('Edit Component - Course loaded:', course);
        if (course) {
          this.populateForm(course);
        } else {
          console.error('Edit Component - No course data returned');
        }
        this.isLoadingCourse = false;
      },
      error: (error) => {
        console.error('Error loading course:', error);
        this.toastService.show('Failed to load course', 'error');
        this.isLoadingCourse = false;
        this.router.navigate(['/content/courses']);
      }
    });
  }

  /**
   * Populate form with course data
   */
  populateForm(data: any) {
    // Handle potential wrapper
    const course = data.course || data.result || data.data || data;
    console.log('Populating form with:', course);

    // Handle PascalCase or camelCase
    this.courseTitle = course.title || course.Title || '';
    this.courseDescription = course.description || course.Description || '';
    this.price = (course.price !== undefined ? course.price : course.Price)?.toString() || '';
    this.duration = (course.durationHours !== undefined ? course.durationHours : course.DurationHours)?.toString() || '';

    // Category ID
    const catId = course.categoryId !== undefined ? course.categoryId : course.CategoryId;
    this.selectedCategory = catId?.toString() || '';

    // Level
    this.selectedLevel = course.level || course.Level || 'Beginner';

    // Exam Type
    const eType = course.examType !== undefined ? course.examType : course.ExamType;
    this.selectedExamType = this.getExamTypeString(eType || 0);

    this.currentThumbnailUrl = course.thumbnailUrl || course.ThumbnailUrl || '';

    this.enableCertification = course.certificationEnabled !== undefined ? course.certificationEnabled : (course.CertificationEnabled || false);

    const certTempId = course.certificateTemplateId !== undefined ? course.certificateTemplateId : course.CertificateTemplateId;
    this.selectedTemplate = this.getTemplateString(certTempId || 0);

    const pScore = course.passingScore !== undefined ? course.passingScore : course.PassingScore;
    this.passingScore = pScore?.toString() || '';
  }

  /**
   * Load categories from API
   */
  loadCategories() {
    this.isLoadingCategories = true;
    this.categoryService.getCategories().subscribe({
      next: (categories: Category[]) => {
        this.apiCategories = categories;
        // Convert to AccountTypeOption format for the selector
        this.categories = categories.map(cat => ({
          title: cat.name,
          value: cat.id.toString(),
          description: cat.description || '',
          icon: this.getCategoryIcon(cat.name)
        }));
        this.isLoadingCategories = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.isLoadingCategories = false;
      }
    });
  }

  /**
   * Get icon for category based on name
   */
  private getCategoryIcon(name: string): string {
    const iconMap: { [key: string]: string } = {
      'Development': 'bi-code-slash',
      'Design': 'bi-palette',
      'Business': 'bi-briefcase',
      'Marketing': 'bi-megaphone',
      'Education': 'bi-book',
      'Photography': 'bi-camera',
      'Music': 'bi-music-note',
      'Health': 'bi-heart-pulse'
    };
    return iconMap[name] || 'bi-folder';
  }

  /**
   * Convert exam type number to string
   */
  private getExamTypeString(examType: number): string {
    const examTypeMap: { [key: number]: string } = {
      0: 'none',
      1: 'waec',
      2: 'jamb',
      3: 'neco'
    };
    return examTypeMap[examType] || 'none';
  }

  /**
   * Convert template ID to string
   */
  private getTemplateString(templateId: number): string {
    const templateMap: { [key: number]: string } = {
      0: 'default',
      1: 'default',
      2: 'modern_dark',
      3: 'classic_gold'
    };
    return templateMap[templateId] || 'default';
  }

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
    if (!this.courseTitle?.trim() || !this.courseDescription?.trim()) {
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

    // Prepare course data (will be converted to FormData in service)
    const courseData: UpdateCourseRequest = {
      title: this.courseTitle.trim(),
      description: this.courseDescription.trim(),
      price: this.price ? parseFloat(this.price) : undefined,
      durationHours: this.duration ? parseInt(this.duration) : undefined,
      categoryId: this.selectedCategory ? parseInt(this.selectedCategory) : undefined,
      level: this.selectedLevel || undefined,
      examType: examTypeMap[this.selectedExamType] || 0,
      certificationEnabled: this.enableCertification,
      certificateTemplateId: this.enableCertification && this.selectedTemplate !== 'default'
        ? this.getTemplateId(this.selectedTemplate)
        : undefined,
      passingScore: this.enableCertification && this.passingScore
        ? parseFloat(this.passingScore)
        : undefined
    };

    // 1. Update Course Details (without file)
    this.courseService.updateCourse(this.courseId, courseData).subscribe({
      next: (response) => {
        // 2. Upload Thumbnail if selected
        if (this.selectedFile) {
          this.courseService.uploadThumbnail(this.courseId, this.selectedFile).subscribe({
            next: () => {
              this.isSubmitting = false;
              this.toastService.show('Course and thumbnail updated successfully!', 'success');
              this.router.navigate(['/content/courses']);
            },
            error: (error) => {
              this.isSubmitting = false;
              console.error('Error uploading thumbnail:', error);
              const thumbnailError = error?.error?.errors ?
                Object.values(error.error.errors).flat().join(', ') :
                'Thumbnail upload failed';
              this.toastService.show(`Course updated but ${thumbnailError}. Please try uploading the thumbnail again.`, 'warning');
              this.router.navigate(['/content/courses']);
            }
          });
        } else {
          this.isSubmitting = false;
          this.toastService.show('Course updated successfully!', 'success');
          this.router.navigate(['/content/courses']);
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error updating course:', error);
        const errorMessage = error?.error?.message || 'Failed to update course. Please try again.';
        this.toastService.show(errorMessage, 'error');
      }
    });
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
