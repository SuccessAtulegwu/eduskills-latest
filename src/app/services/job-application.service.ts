import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
    CreateJobApplicationDto,
    UpdateApplicationStatusDto
} from '../models/api.models';

@Injectable({
    providedIn: 'root'
})
export class JobApplicationService {
    private readonly endpoint = '/JobApplication';

    constructor(private api: ApiService) { }

    applyForJob(body: CreateJobApplicationDto): Observable<any> {
        return this.api.post(`${this.endpoint}/ApplyForJob`, body);
    }

    getApplication(id: string): Observable<any> {
        return this.api.get(`${this.endpoint}/GetApplication/${id}`);
    }

    getMyApplications(): Observable<any> {
        return this.api.get(`${this.endpoint}/GetMyApplications/my-applications`);
    }

    getApplicationsByJob(jobPostingId: string): Observable<any> {
        return this.api.get(`${this.endpoint}/GetApplicationsByJob/job/${jobPostingId}`);
    }

    updateApplicationStatus(id: string, body: UpdateApplicationStatusDto): Observable<any> {
        return this.api.put(`${this.endpoint}/UpdateApplicationStatus/${id}/status`, body);
    }
}
