import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {
    CreateJobPostingRequest,
    UpdateJobPostingRequest,
    JobPostingResponse,
    JobPostingModel,
    GetJobPostingsQueryParams,
    jobTypeToString,
    jobPostingResponseToModel
} from '../models/job-posting.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class JobPostingService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    /**
     * Create a new job posting
     * POST /api/v1/JobPosting/CreateJobPosting
     */
    createJobPosting(jobData: CreateJobPostingRequest): Observable<JobPostingResponse> {
        return this.http.post<JobPostingResponse>(
            `${this.apiUrl}/JobPosting/CreateJobPosting`,
            jobData
        );
    }

    /**
     * Get all job postings with optional filters
     * GET /api/v1/JobPosting/GetJobPostings
     */
    getJobPostings(params?: GetJobPostingsQueryParams): Observable<JobPostingResponse[]> {
        let httpParams = new HttpParams();

        if (params) {
            if (params.categoryId !== undefined) {
                httpParams = httpParams.set('categoryId', params.categoryId.toString());
            }
            if (params.jobType !== undefined) {
                httpParams = httpParams.set('jobType', params.jobType.toString());
            }
            if (params.location) {
                httpParams = httpParams.set('location', params.location);
            }
            if (params.experienceLevel) {
                httpParams = httpParams.set('experienceLevel', params.experienceLevel);
            }
            if (params.searchTerm) {
                httpParams = httpParams.set('searchTerm', params.searchTerm);
            }
            if (params.minSalary !== undefined) {
                httpParams = httpParams.set('minSalary', params.minSalary.toString());
            }
            if (params.maxSalary !== undefined) {
                httpParams = httpParams.set('maxSalary', params.maxSalary.toString());
            }
            if (params.isExpired !== undefined) {
                httpParams = httpParams.set('isExpired', params.isExpired.toString());
            }
            if (params.sortBy) {
                httpParams = httpParams.set('sortBy', params.sortBy);
            }
        }

        return this.http.get<JobPostingResponse[]>(
            `${this.apiUrl}/JobPosting/GetJobPostings`,
            { params: httpParams }
        );
    }

    /**
     * Get all job postings as JobPostingModel array (for UI display)
     */
    getJobPostingsAsModels(params?: GetJobPostingsQueryParams): Observable<JobPostingModel[]> {
        return this.getJobPostings(params).pipe(
            map(responses => responses.map(response => jobPostingResponseToModel(response))),
            catchError(error => {
                console.error('Error fetching job postings:', error);
                return of([]);
            })
        );
    }

    /**
     * Get job posting by ID
     * GET /api/v1/JobPosting/GetJobPosting/{id}
     */
    getJobPostingById(id: number): Observable<JobPostingResponse> {
        return this.http.get<JobPostingResponse>(
            `${this.apiUrl}/JobPosting/GetJobPosting/${id}`
        );
    }

    /**
     * Get job posting by ID as JobPostingModel (for UI display)
     */
    getJobPostingByIdAsModel(id: number): Observable<JobPostingModel> {
        return this.getJobPostingById(id).pipe(
            map(response => jobPostingResponseToModel(response)),
            catchError(error => {
                console.error(`Error fetching job posting ${id}:`, error);
                throw error;
            })
        );
    }

    /**
     * Update job posting by ID
     * PUT /api/v1/JobPosting/UpdateJobPosting/{id}
     */
    updateJobPosting(id: number, jobData: UpdateJobPostingRequest): Observable<JobPostingResponse> {
        return this.http.put<JobPostingResponse>(
            `${this.apiUrl}/JobPosting/UpdateJobPosting/${id}`,
            jobData
        );
    }

    /**
     * Delete job posting by ID
     * DELETE /api/v1/JobPosting/DeleteJobPosting/{id}
     */
    deleteJobPosting(id: number): Observable<void> {
        return this.http.delete<void>(
            `${this.apiUrl}/JobPosting/DeleteJobPosting/${id}`
        );
    }

}

