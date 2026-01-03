import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PageHeader } from '../../../components/page-header/page-header';
import { AccountTypeSelectorComponent, AccountTypeOption } from '../../../components/account-type-selector/account-type-selector.component';
import { InputComponent } from '../../../components/ui/input/input';
import { ButtonComponent } from '../../../components/ui/button/button';
import { CourseService, CourseModel } from './course.service';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PageHeader,
    AccountTypeSelectorComponent,
    InputComponent,
    ButtonComponent
  ],
  templateUrl: './courses.html',
  styleUrl: './courses.scss',
})
export class Courses implements OnInit {

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

  constructor(
    private router: Router,
    private courseService: CourseService
  ) { }

  ngOnInit() {
    this.courses = this.courseService.getCourses();
    this.filteredCourses = [...this.courses];
  }

  createCourse() {
    this.router.navigate(['/content/courses/create']);
  }

  onFilter() {
    console.log('Filtering courses', {
      category: this.selectedCategory,
      level: this.selectedLevel,
      exam: this.selectedExamType,
      price: this.maxPrice,
      search: this.searchQuery,
      sort: this.selectedSort
    });
    // Implement actual filter logic here if needed, or just mock it
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
}
