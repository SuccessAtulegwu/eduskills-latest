/**
 * Job Application Service
 * Handles job application API operations
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import {
    ApplyForJobRequest,
    UpdateApplicationStatusRequest,
    JobApplicationResponse,
    JobApplicationModel,
    ApplicationStatus,
    jobApplicationResponseToModel
} from '../models/job-application.model'; 
import { JobPostingService } from './job-posting.service';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class JobApplicationService {
    private apiUrl = environment.apiUrl;

    constructor(
        private http: HttpClient,
        private jobPostingService: JobPostingService
    ) { }

    /**
     * Apply for a job
     * POST /api/v1/JobApplication/ApplyForJob
     */
    applyForJob(applicationData: ApplyForJobRequest): Observable<JobApplicationResponse> {
        return this.http.post<JobApplicationResponse>(
            `${this.apiUrl}/JobApplication/ApplyForJob`,
            applicationData
        );
    }

    /**
     * Get a single application by ID
     * GET /api/v1/JobApplication/GetApplication/{id}
     */
    getApplicationById(id: number): Observable<JobApplicationResponse> {
        return this.http.get<JobApplicationResponse>(
            `${this.apiUrl}/JobApplication/GetApplication/${id}`
        );
    }

    /**
     * Get a single application by ID as display model
     * fetches additional job details
     */
    getApplicationByIdAsModel(id: number): Observable<JobApplicationModel> {
        return this.getApplicationById(id).pipe(
            switchMap(response => {
                const model = jobApplicationResponseToModel(response);
                // Fetch job details to get description
                return this.jobPostingService.getJobPostingByIdAsModel(model.jobPostingId).pipe(
                    map(job => ({
                        ...model,
                        companyName: job.companyName,
                        jobDescription: job.description,
                        jobLocation: job.location,
                        jobType: job.jobType,
                        jobApplicationsCount: job.applications,
                        jobViewsCount: job.views,
                        jobCompanyLogoColor: job.companyLogoColor,
                        jobCompanyDescription: job.companyDescription,
                        jobRequirements: job.requirements,
                        jobResponsibilities: job.responsibilities
                    })),
                    catchError(err => {
                        console.warn(`Could not fetch details for job ${model.jobPostingId}`, err);
                        return of(model);
                    })
                );
            })
        );
    }

    /**
     * Get all applications for the current user
     * GET /api/v1/JobApplication/GetMyApplications/my-applications
     */
    getMyApplications(): Observable<JobApplicationResponse[]> {
        return this.http.get<JobApplicationResponse[]>(
            `${this.apiUrl}/JobApplication/GetMyApplications/my-applications`
        );
    }

    /**
     * Get all applications for the current user as display models
     */
    getMyApplicationsAsModels(): Observable<JobApplicationModel[]> {
        return this.getMyApplications().pipe(
            switchMap(responses => {
                if (!responses || responses.length === 0) {
                    return of([]);
                }

                const requests = responses.map(response => {
                    const model = jobApplicationResponseToModel(response);
                    return this.jobPostingService.getJobPostingByIdAsModel(model.jobPostingId).pipe(
                        map(job => ({
                            ...model,
                            companyName: job.companyName || model.companyName,
                            jobDescription: job.description,
                            jobLocation: job.location,
                            jobType: job.jobType,
                            jobApplicationsCount: job.applications,
                            jobViewsCount: job.views,
                            jobCompanyLogoColor: job.companyLogoColor,
                            jobCompanyDescription: job.companyDescription,
                            jobRequirements: job.requirements,
                            jobResponsibilities: job.responsibilities
                        })),
                        catchError(err => {
                            console.warn(`Could not fetch details for job ${model.jobPostingId}`, err);
                            return of(model);
                        })
                    );
                });

                return forkJoin(requests);
            }),
            catchError(error => {
                console.error('Error fetching my applications:', error);
                return of([]);
            })
        );
    }

    /**
     * Get all applications for a specific job posting
     * GET /api/v1/JobApplication/GetApplicationsByJob/job/{jobPostingId}
     */
    getApplicationsByJob(jobPostingId: number): Observable<JobApplicationResponse[]> {
        return this.http.get<JobApplicationResponse[]>(
            `${this.apiUrl}/JobApplication/GetApplicationsByJob/job/${jobPostingId}`
        );
    }

    /**
     * Get all applications for a specific job posting as display models
     */
    getApplicationsByJobAsModels(jobPostingId: number): Observable<JobApplicationModel[]> {
        return this.getApplicationsByJob(jobPostingId).pipe(
            map(responses => responses.map(response => jobApplicationResponseToModel(response))),
            catchError(error => {
                console.error(`Error fetching applications for job ${jobPostingId}:`, error);
                return of([]);
            })
        );
    }

    /**
     * Update application status
     * PUT /api/v1/JobApplication/UpdateApplicationStatus/{id}/status
     */
    updateApplicationStatus(id: number, statusData: UpdateApplicationStatusRequest): Observable<JobApplicationResponse> {
        return this.http.put<JobApplicationResponse>(
            `${this.apiUrl}/JobApplication/UpdateApplicationStatus/${id}/status`,
            statusData
        );
    }

    /**
     * Helper method to check if user has already applied to a job
     */
    hasAppliedToJob(jobPostingId: number): Observable<boolean> {
        return this.getMyApplications().pipe(
            map(applications => applications.some(app => app.jobPostingId === jobPostingId)),
            catchError(() => of(false))
        );
    }

    /**
     * Get application statistics for current user
     */
    getApplicationStatistics(): Observable<{
        total: number;
        pending: number;
        reviewed: number;
        shortlisted: number;
        rejected: number;
        accepted: number;
    }> {
        return this.getMyApplications().pipe(
            map(applications => ({
                total: applications.length,
                pending: applications.filter(app => app.status === ApplicationStatus.Pending).length,
                reviewed: applications.filter(app => app.status === ApplicationStatus.Reviewed).length,
                shortlisted: applications.filter(app => app.status === ApplicationStatus.Shortlisted).length,
                rejected: applications.filter(app => app.status === ApplicationStatus.Rejected).length,
                accepted: applications.filter(app => app.status === ApplicationStatus.Accepted).length
            })),
            catchError(() => of({
                total: 0,
                pending: 0,
                reviewed: 0,
                shortlisted: 0,
                rejected: 0,
                accepted: 0
            }))
        );
    }
}
