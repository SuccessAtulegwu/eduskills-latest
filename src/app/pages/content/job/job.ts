import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PageHeader } from '../../../components/page-header/page-header';
import { AccountTypeSelectorComponent, AccountTypeOption } from '../../../components/account-type-selector/account-type-selector.component';
import { InputComponent } from '../../../components/ui/input/input';
import { ButtonComponent } from '../../../components/ui/button/button';
import { JobPostingService } from '../../../services/job-posting.service';
import { JobPostingModel, JobType, stringToJobType } from '../../../models/job-posting.model';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-job',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PageHeader,
    AccountTypeSelectorComponent,
    InputComponent,
    ButtonComponent
  ],
  templateUrl: './job.html',
  styleUrl: './job.scss',
})
export class Job implements OnInit, OnDestroy {
  selectedJobType: string = 'all';
  selectedCategory: string = 'all';
  selectedSort: string = 'recent';
  location: string = '';
  searchQuery: string = '';
  isAuthenticated: boolean = false;
  isLoading: boolean = false;
  private authSubscription?: Subscription;

  jobs: JobPostingModel[] = [];
  filteredJobs: JobPostingModel[] = [];

  jobTypes: AccountTypeOption[] = [
    { title: 'All Types', value: 'all', description: 'Show all job types', icon: 'bi-briefcase' },
    { title: 'Full Time', value: '0', description: 'Full-time positions', icon: 'bi-person-fill' },
    { title: 'Part Time', value: '1', description: 'Part-time positions', icon: 'bi-clock' },
    { title: 'Contract', value: '2', description: 'Contract-based jobs', icon: 'bi-file-text' },
    { title: 'Internship', value: '3', description: 'Internship opportunities', icon: 'bi-book' },
  ];

  categories: AccountTypeOption[] = [
    { title: 'All Categories', value: 'all', description: 'Show all categories', icon: 'bi-grid' },
    { title: 'Development', value: 'development', description: 'Software Development', icon: 'bi-code-slash' },
    { title: 'Design', value: 'design', description: 'UI/UX Design', icon: 'bi-palette' },
    { title: 'Marketing', value: 'marketing', description: 'Digital Marketing', icon: 'bi-megaphone' },
  ];

  sortOptions: AccountTypeOption[] = [
    { title: 'Most Recent', value: 'recent', description: 'Newest jobs first', icon: 'bi-sort-down' },
    { title: 'Oldest', value: 'oldest', description: 'Oldest jobs first', icon: 'bi-sort-up' },
    { title: 'Salary', value: 'salary', description: 'Sort by salary', icon: 'bi-cash' },
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private jobPostingService: JobPostingService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loadJobs();
    this.authSubscription = this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
    });
  }

  loadJobs() {
    this.isLoading = true;
    const params: any = {};

    if (this.selectedJobType !== 'all') {
      params.jobType = parseInt(this.selectedJobType);
    }

    if (this.location) {
      params.location = this.location;
    }

    if (this.searchQuery) {
      params.searchTerm = this.searchQuery;
    }

    params.isExpired = false;

    this.jobPostingService.getJobPostingsAsModels(params).subscribe({
      next: (jobs) => {
        this.jobs = jobs;
        this.filteredJobs = jobs;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading jobs:', error);
        this.isLoading = false;
      }
    });
  }

  onFilter() {
    this.loadJobs();
  }

  onClear() {
    this.selectedJobType = 'all';
    this.selectedCategory = 'all';
    this.selectedSort = 'recent';
    this.location = '';
    this.searchQuery = '';
    this.loadJobs();
  }

  viewDetails(id: number) {
    this.router.navigate([id], { relativeTo: this.route });
  }


  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }
}
