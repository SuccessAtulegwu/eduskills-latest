import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PageHeader } from '../../../components/page-header/page-header';
import { InputComponent } from '../../../components/ui/input/input';
import { ButtonComponent } from '../../../components/ui/button/button';
import { AccountTypeSelectorComponent, AccountTypeOption } from '../../../components/account-type-selector/account-type-selector.component';
import { JobApplicationService } from '../../../services/job-application.service';
import { JobApplicationModel } from '../../../models/job-application.model';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PageHeader,
    InputComponent,
    ButtonComponent,
    AccountTypeSelectorComponent
  ],
  templateUrl: './applications.html',
  styleUrl: './applications.scss',
})
export class Applications implements OnInit {
  applications: JobApplicationModel[] = [];
  filteredApplications: JobApplicationModel[] = [];
  selectedStatus: string = 'all';
  searchQuery: string = '';
  isLoading: boolean = true;

  // Statistics
  totalApplications: number = 0;
  pendingApplications: number = 0;
  reviewedApplications: number = 0;
  shortlistedApplications: number = 0;
  rejectedApplications: number = 0;
  acceptedApplications: number = 0;

  // Filter options
  statusOptions: AccountTypeOption[] = [
    { title: 'All Applications', value: 'all', description: 'Show all', icon: 'bi-list-ul' },
    { title: 'Pending', value: 'Pending', description: 'Under review', icon: 'bi-clock-fill' },
    { title: 'Reviewed', value: 'Reviewed', description: 'Been reviewed', icon: 'bi-eye-fill' },
    { title: 'Shortlisted', value: 'Shortlisted', description: 'Shortlisted', icon: 'bi-star-fill' },
    { title: 'Accepted', value: 'Accepted', description: 'Accepted', icon: 'bi-check-circle-fill' },
    { title: 'Rejected', value: 'Rejected', description: 'Rejected', icon: 'bi-x-circle-fill' },
  ];

  constructor(
    private jobApplicationService: JobApplicationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadApplications();
    this.loadStatistics();
  }

  /**
   * Load user's applications from API
   */
  loadApplications() {
    this.isLoading = true;
    this.jobApplicationService.getMyApplicationsAsModels().subscribe({
      next: (applications) => {
        this.applications = applications;
        this.filteredApplications = applications;
        this.isLoading = false;
        this.filterApplications();
      },
      error: (error) => {
        console.error('Error loading applications:', error);
        this.isLoading = false;
      }
    });
  }

  /**
   * Load application statistics
   */
  loadStatistics() {
    this.jobApplicationService.getApplicationStatistics().subscribe({
      next: (stats) => {
        this.totalApplications = stats.total;
        this.pendingApplications = stats.pending;
        this.reviewedApplications = stats.reviewed;
        this.shortlistedApplications = stats.shortlisted;
        this.rejectedApplications = stats.rejected;
        this.acceptedApplications = stats.accepted;
      },
      error: (error) => {
        console.error('Error loading statistics:', error);
      }
    });
  }

  /**
   * Filter applications based on status and search query
   */
  filterApplications() {
    let filtered = [...this.applications];

    // Filter by status
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(app => app.status === this.selectedStatus);
    }

    // Filter by search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(app =>
        app.jobTitle.toLowerCase().includes(query) ||
        app.companyName.toLowerCase().includes(query) ||
        app.status.toLowerCase().includes(query)
      );
    }

    this.filteredApplications = filtered;
  }

  /**
   * Handle status filter change
   */
  onStatusChange() {
    this.filterApplications();
  }

  /**
   * Handle search query change
   */
  onSearchChange() {
    this.filterApplications();
  }

  /**
   * Clear all filters
   */
  onClear() {
    this.searchQuery = '';
    this.selectedStatus = 'all';
    this.filteredApplications = [...this.applications];
  }

  /**
   * View application details
   */
  selectedApplication: JobApplicationModel | null = null;
  showDetailsModal: boolean = false;

  /**
   * View application details
   */
  viewApplication(application: JobApplicationModel) {
    this.isLoading = true;
    this.jobApplicationService.getApplicationByIdAsModel(application.id).subscribe({
      next: (appDetails) => {
        this.selectedApplication = appDetails;
        this.showDetailsModal = true;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching application details:', error);
        this.isLoading = false;
      }
    });
  }

  /**
   * Close application details modal
   */
  closeApplicationDetails() {
    this.selectedApplication = null;
    this.showDetailsModal = false;
  }

  /**
   * View job posting details
   */
  viewJobPosting(application: JobApplicationModel) {
    this.router.navigate(['/content/intenship', application.jobPostingId]);
  }

  /**
   * Withdraw application
   */
  withdrawApplication(application: JobApplicationModel) {
    if (confirm('Are you sure you want to withdraw this application?')) {
      // TODO: Implement withdraw functionality
      console.log('Withdrawing application:', application.id);
    }
  }

  /**
   * Navigate to job listings
   */
  browseJobs() {
    this.router.navigate(['/content/intenship']);
  }
}
