import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { JobPostingService } from '../../../../services/job-posting.service';
import { JobApplicationService } from '../../../../services/job-application.service';
import { JobPostingModel } from '../../../../models/job-posting.model';
import { ButtonComponent } from '../../../../components/ui/button/button';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './details.html',
  styleUrl: './details.scss',
})
export class Details implements OnInit, OnDestroy {
  job: JobPostingModel | undefined;
  isLoading: boolean = false;
  errorMessage: string = '';
  hasApplied: boolean = false;
  checkingApplication: boolean = false;
  private routeSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobPostingService: JobPostingService,
    private jobApplicationService: JobApplicationService,
    private location: Location
  ) { }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadJobDetails(id);
      this.checkIfApplied(id);
    }
  }

  loadJobDetails(id: number) {
    if (this.isLoading) return; // Prevent double loading
    
    this.isLoading = true;
    this.jobPostingService.getJobPostingByIdAsModel(id).subscribe({
      next: (job) => {
        this.job = job;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading job details:', error);
        this.errorMessage = 'Failed to load job details. Please try again.';
        this.isLoading = false;
      }
    });
  }

  checkIfApplied(jobPostingId: number) {
    this.checkingApplication = true;
    this.jobApplicationService.hasAppliedToJob(jobPostingId).subscribe({
      next: (applied) => {
        this.hasApplied = applied;
        this.checkingApplication = false;
      },
      error: (error) => {
        console.error('Error checking application status:', error);
        this.checkingApplication = false;
      }
    });
  }

  goBack() {
    this.location.back();
  }

  ngOnDestroy() {
    this.routeSubscription?.unsubscribe();
  }
}
