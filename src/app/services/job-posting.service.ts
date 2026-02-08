import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
    CreateJobPostingDto,
    UpdateJobPostingDto
} from '../models/api.models';

@Injectable({
    providedIn: 'root'
})
export class JobPostingService {
    private readonly endpoint = '/JobPosting';

    constructor(private api: ApiService) { }

    getJobPostings(query?: {
        jobType?: string;
        location?: string;
        searchTerm?: string;
        categoryId?: string;
        sortBy?: string;
    }): Observable<any> {
        return this.api.get(`${this.endpoint}/GetJobPostings`, query);
    }

    getJobPosting(id: string): Observable<any> {
        return this.api.get(`${this.endpoint}/GetJobPosting/${id}`);
    }

    createJobPosting(body: CreateJobPostingDto): Observable<any> {
        return this.api.post(`${this.endpoint}/CreateJobPosting`, body);
    }

    updateJobPosting(id: string, body: UpdateJobPostingDto): Observable<any> {
        return this.api.put(`${this.endpoint}/UpdateJobPosting/${id}`, body);
    }

    deleteJobPosting(id: string): Observable<any> {
        return this.api.delete(`${this.endpoint}/DeleteJobPosting/${id}`);
    }

    getMyJobPostings(): Observable<any> {
        return this.api.get(`${this.endpoint}/GetMyJobPostings/my-jobs`);
    }
}
