import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PageHeader } from '../../../components/page-header/page-header';
import { AccountTypeSelectorComponent, AccountTypeOption } from '../../../components/account-type-selector/account-type-selector.component';
import { InputComponent } from '../../../components/ui/input/input';
import { ButtonComponent } from '../../../components/ui/button/button'; 
import { CourseModel, CourseResponse, GetCoursesQueryParams } from '../../../models/course.model';
import { ToastService } from '../../../services/toast.service';
import { AuthService } from '../../../services/auth';
import { User } from '../../../models/model';
import { CourseService } from '../../../services/course.service';


@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PageHeader,
    AccountTypeSelectorComponent,
    InputComponent,
    ButtonComponent,
  ],
  templateUrl: './courses.html',
  styleUrl: './courses.scss',
})
export class Courses implements OnInit {
  currentUser: User | null = null;

  // Filter States
  selectedCategory: string = 'all';
  selectedLevel: string = 'all';
  selectedExamType: string = 'all';
  maxPrice: string = '';
  searchQuery: string = '';
  selectedSort: string = 'recent';

  // Options
  categories: AccountTypeOption[] = [
    { title: 'All Categories', value: 'all', description: 'Show all', icon: 'bi-grid' },
    { title: 'Development', value: 'development', description: 'Tech & Code', icon: 'bi-code-slash' },
    { title: 'Design', value: 'design', description: 'UI/UX & Art', icon: 'bi-palette' },
    { title: 'Business', value: 'business', description: 'Finance & Management', icon: 'bi-briefcase' },
    { title: 'Marketing', value: 'marketing', description: 'Digital & Content', icon: 'bi-megaphone' },
  ];

  levels: AccountTypeOption[] = [
    { title: 'All Levels', value: 'all', description: 'Any difficulty', icon: 'bi-bar-chart' },
    { title: 'Beginner', value: 'beginner', description: 'For starters', icon: 'bi-1-circle' },
    { title: 'Intermediate', value: 'intermediate', description: 'Mid-level', icon: 'bi-2-circle' },
    { title: 'Advanced', value: 'advanced', description: 'Experts only', icon: 'bi-3-circle' },
  ];

  examTypes: AccountTypeOption[] = [
    { title: 'All Exam Types', value: 'all', description: 'Show all', icon: 'bi-card-checklist' },
    { title: 'WAEC', value: 'waec', description: 'West African Exam', icon: 'bi-book' },
    { title: 'JAMB', value: 'jamb', description: 'Joint Admissions', icon: 'bi-journal-check' },
    { title: 'NECO', value: 'neco', description: 'National Exam', icon: 'bi-file-text' },
  ];

  sortOptions: AccountTypeOption[] = [
    { title: 'Most Recent', value: 'recent', description: 'Newest first', icon: 'bi-sort-down' },
    { title: 'Price: Low to High', value: 'price_low', description: 'Cheapest first', icon: 'bi-sort-numeric-down' },
    { title: 'Price: High to Low', value: 'price_high', description: 'Most expensive first', icon: 'bi-sort-numeric-up-alt' },
  ];

  courses: CourseModel[] = [];
  filteredCourses: CourseModel[] = [];
  apiCourses: CourseResponse[] = [];
  isLoading: boolean = false;
  useApi: boolean = true; // Toggle between API and mock data

  constructor(
    private router: Router,
    private courseService: CourseService,
    private toastService: ToastService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    this.loadCourses();
  }

  loadCourses() {
    if (this.useApi) {
      this.isLoading = true;
      this.courseService.getAllCourses().subscribe({
        next: (courses) => {
          this.apiCourses = courses;
          // Convert API courses to CourseModel format for display
          this.courses = this.convertToCourseModel(courses);
          this.filteredCourses = [...this.courses];
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading courses:', error);
          this.toastService.show('Failed to load courses. Using fallback data.', 'warning');
          // Fallback to mock data
          this.useApi = false; // Switch to mock data mode
          this.filteredCourses = [...this.courses];
          this.isLoading = false;
        }
      });
    } else {
      
      this.filteredCourses = [...this.courses];
    }
  }

  // Convert API CourseResponse to CourseModel for display compatibility
  private convertToCourseModel(courses: CourseResponse[]): CourseModel[] {
    return courses.map((course, index) => ({
      id: course.id,
      title: course.title,
      image: course.thumbnailUrl || '/assets/images/placeholder.jpg',
      price: course.price || 0,
      level: course.level || 'Beginner',
      views: course.views || 0,
      enrolled: course.enrollmentCount || 0,
      category: course.category?.name || this.getCategoryName(course.categoryId),
      description: course.description,
      creator: course.creatorName,
      creatorId: course.creatorId,
      duration: course.durationHours ? `${course.durationHours} hours` : undefined,
      createdDate: course.createdAt ? new Date(course.createdAt).toLocaleDateString() : undefined
    }));
  }

  private getCategoryName(categoryId?: number): string {
    const categoryMap: { [key: number]: string } = {
      1: 'Development',
      2: 'Design',
      3: 'Business'
    };
    return categoryMap[categoryId || 1] || 'Other';
  }

  createCourse() {
    this.router.navigate(['/content/courses/create']);
  }

  onFilter() {
    if (this.useApi) {
      // Use API filtering
      this.isLoading = true;

      const queryParams: GetCoursesQueryParams = {};

      if (this.selectedCategory !== 'all') {
        queryParams.categoryId = this.getCategoryId(this.selectedCategory);
      }
      if (this.selectedLevel !== 'all') {
        queryParams.level = this.selectedLevel;
      }
      if (this.selectedExamType !== 'all') {
        queryParams.examType = this.getExamTypeNumber(this.selectedExamType);
      }
      if (this.searchQuery.trim()) {
        queryParams.searchTerm = this.searchQuery.trim();
      }
      if (this.maxPrice) {
        queryParams.maxPrice = parseFloat(this.maxPrice);
      }
      if (this.selectedSort !== 'recent') {
        queryParams.sortBy = this.getSortByField(this.selectedSort);
      }

      this.courseService.getAllCourses(queryParams).subscribe({
        next: (courses) => {
          this.apiCourses = courses;
          this.courses = this.convertToCourseModel(courses);
          this.filteredCourses = [...this.courses];
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error filtering courses:', error);
          this.toastService.show('Failed to filter courses', 'error');
          this.isLoading = false;
        }
      });
    } else {
      // Client-side filtering for mock data
      let filtered = [...this.courses];

      if (this.selectedCategory !== 'all') {
        filtered = filtered.filter(c => c.category.toLowerCase() === this.selectedCategory);
      }
      if (this.selectedLevel !== 'all') {
        filtered = filtered.filter(c => c.level.toLowerCase() === this.selectedLevel);
      }
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(c =>
          c.title.toLowerCase().includes(query) ||
          c.description?.toLowerCase().includes(query)
        );
      }
      if (this.maxPrice) {
        const max = parseFloat(this.maxPrice);
        filtered = filtered.filter(c => c.price <= max);
      }

      // Sort
      if (this.selectedSort === 'price_low') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (this.selectedSort === 'price_high') {
        filtered.sort((a, b) => b.price - a.price);
      }

      this.filteredCourses = filtered;
    }
  }

  viewMyCourses() {
    this.router.navigate(['/content/courses/my-courses']);
  }

  private getCategoryId(category: string): number {
    const categoryMap: { [key: string]: number } = {
      'development': 1,
      'design': 2,
      'business': 3,
      'marketing': 4
    };
    return categoryMap[category] || 1;
  }

  private getExamTypeNumber(examType: string): number {
    const examTypeMap: { [key: string]: number } = {
      'waec': 1,
      'jamb': 2,
      'neco': 3
    };
    return examTypeMap[examType] || 0;
  }

  private getSortByField(sort: string): string {
    const sortMap: { [key: string]: string } = {
      'price_low': 'price',
      'price_high': 'price',
      'recent': 'createdAt'
    };
    return sortMap[sort] || 'createdAt';
  }

  onClear() {
    this.selectedCategory = 'all';
    this.selectedLevel = 'all';
    this.selectedExamType = 'all';
    this.maxPrice = '';
    this.searchQuery = '';
    this.selectedSort = 'recent';
    this.filteredCourses = [...this.courses];
  }

  handleImageError(event: any) {
    event.target.src = '/assets/images/placeholder.jpg';
    event.target.onerror = null; // Prevent infinite loop
    event.target.alt = ''; // Clear alt text to hide it if it persists
  }

  viewCourse(id: number) {
    this.router.navigate(['/content/courses', id]);
  }

  editCourse(id: number) {
    this.router.navigate(['/content/courses/edit', id]);
  }

  deleteCourse(id: number) {
    if (confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      this.courseService.deleteCourse(id).subscribe({
        next: () => {
          this.toastService.show('Course deleted successfully', 'success');
          // Reload courses
          this.loadCourses();
        },
        error: (error) => {
          console.error('Error deleting course:', error);
          this.toastService.show('Failed to delete course', 'error');
        }
      });
    }
  }

  isCreator(course: CourseModel): boolean {
    if (!this.currentUser || !course.creatorId) return false;
    return this.currentUser.id === course.creatorId;
  }
}
