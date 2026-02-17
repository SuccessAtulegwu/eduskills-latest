/**
 * Learning Path Component
 * Displays and manages learning paths for students
 */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PageHeader } from '../../../components/page-header/page-header';
import { AccountTypeOption, AccountTypeSelectorComponent } from '../../../components/account-type-selector/account-type-selector.component';
import { InputComponent } from '../../../components/ui/input/input';
import { LearningPathService } from '../../../services/learning-path.service';
import { ToastService } from '../../../services/toast.service';
import { 
  LearningPathModel, 
  ClassLevel, 
  ExamType 
} from '../../../models/model';

@Component({
  selector: 'app-learning',
  imports: [CommonModule, FormsModule, AccountTypeSelectorComponent, PageHeader, InputComponent],
  templateUrl: './learning.html',
  styleUrl: './learning.scss',
})
export class Learning implements OnInit, OnDestroy {
  // Filter properties
  selectedLevel: string = 'all';
  selectedExamType: string = 'all';
  selectedSubject: string = '';
  searchQuery: string = '';

  // Learning path data
  learningPaths: LearningPathModel[] = [];
  filteredPaths: LearningPathModel[] = [];
  isLoading: boolean = true;

  // Subscriptions
  private subscriptions: Subscription[] = [];

  // Filter options
  levelOptions: AccountTypeOption[] = [
    { title: 'All Levels', value: 'all', description: 'All class levels', icon: 'bi-mortarboard' },
    { title: 'JSS 1', value: ClassLevel.JSS1.toString(), description: 'Junior Secondary 1', icon: 'bi-book' },
    { title: 'JSS 2', value: ClassLevel.JSS2.toString(), description: 'Junior Secondary 2', icon: 'bi-book' },
    { title: 'JSS 3', value: ClassLevel.JSS3.toString(), description: 'Junior Secondary 3', icon: 'bi-book' },
    { title: 'SS 1', value: ClassLevel.SS1.toString(), description: 'Senior Secondary 1', icon: 'bi-journal-bookmark' },
    { title: 'SS 2', value: ClassLevel.SS2.toString(), description: 'Senior Secondary 2', icon: 'bi-journal-bookmark' },
    { title: 'SS 3', value: ClassLevel.SS3.toString(), description: 'Senior Secondary 3', icon: 'bi-journal-bookmark' },
  ];

  examTypeOptions: AccountTypeOption[] = [
    { title: 'All Exams', value: 'all', description: 'All exam types', icon: 'bi-file-earmark-text' },
    { title: 'WAEC', value: ExamType.WAEC.toString(), description: 'West African Exams', icon: 'bi-award' },
    { title: 'NECO', value: ExamType.NECO.toString(), description: 'National Exams', icon: 'bi-award-fill' },
    { title: 'JAMB', value: ExamType.JAMB.toString(), description: 'Tertiary Entrance', icon: 'bi-pencil-square' },
    { title: 'NABTEB', value: ExamType.NABTEB.toString(), description: 'Technical Education', icon: 'bi-tools' },
    { title: 'GCE', value: ExamType.GCE.toString(), description: 'General Certificate', icon: 'bi-patch-check' },
  ];

  constructor(
    private router: Router,
    private learningPathService: LearningPathService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadLearningPaths();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Load learning paths from API
   */
  loadLearningPaths(): void {
    this.isLoading = true;
    const sub = this.learningPathService.learningPaths$.subscribe({
      next: (paths) => {
        this.learningPaths = paths;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading learning paths:', error);
        this.toastService.error('Failed to load learning paths');
        this.isLoading = false;
      }
    });
    this.subscriptions.push(sub);
  }

  /**
   * Apply filters to learning paths
   */
  applyFilters(): void {
    let filtered = [...this.learningPaths];

    // Filter by class level
    if (this.selectedLevel !== 'all') {
      const level = parseInt(this.selectedLevel);
      filtered = filtered.filter(path => path.classLevelEnum === level);
    }

    // Filter by exam type
    if (this.selectedExamType !== 'all') {
      const examType = parseInt(this.selectedExamType);
      filtered = filtered.filter(path => path.examTypeEnum === examType);
    }

    // Filter by subject
    if (this.selectedSubject.trim()) {
      const subject = this.selectedSubject.toLowerCase();
      filtered = filtered.filter(path => 
        path.subject.toLowerCase().includes(subject)
      );
    }

    // Filter by search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(path =>
        path.title.toLowerCase().includes(query) ||
        path.description.toLowerCase().includes(query) ||
        path.subject.toLowerCase().includes(query)
      );
    }

    this.filteredPaths = filtered;
  }

  /**
   * Handle search input change
   */
  onSearch(): void {
    this.applyFilters();
  }

  /**
   * Handle level filter change
   */
  onLevelChange(): void {
    this.applyFilters();
  }

  /**
   * Handle exam type filter change
   */
  onExamTypeChange(): void {
    this.applyFilters();
  }

  /**
   * Handle subject filter change
   */
  onSubjectChange(): void {
    this.applyFilters();
  }

  /**
   * Clear all filters
   */
  clearFilters(): void {
    this.selectedLevel = 'all';
    this.selectedExamType = 'all';
    this.selectedSubject = '';
    this.searchQuery = '';
    this.applyFilters();
  }

  /**
   * Start a learning path
   */
  startLearningPath(path: LearningPathModel): void {
    if (path.isStarted) {
      // Navigate to continue
      this.viewLearningPath(path);
      return;
    }

    this.learningPathService.startLearningPath(path.id).subscribe({
      next: () => {
        this.toastService.success(`Started learning path: ${path.title}`);
        // Navigate to the learning path details
        this.viewLearningPath(path);
      },
      error: (error) => {
        console.error('Error starting learning path:', error);
        this.toastService.error('Failed to start learning path');
      }
    });
  }

  /**
   * View learning path details
   */
  viewLearningPath(path: LearningPathModel): void {
    // Navigate to learning path details (you can create this route)
    this.router.navigate(['/learning-path', path.id]);
  }
}
