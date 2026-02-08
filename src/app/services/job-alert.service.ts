import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { CreateJobAlertDto, UpdateJobAlertDto } from '../models/api.models';

@Injectable({
    providedIn: 'root'
})
export class JobAlertService {
    private readonly endpoint = '/JobAlert';

    constructor(private api: ApiService) { }

    getMyJobAlerts(activeOnly?: boolean): Observable<any> {
        return this.api.get(`${this.endpoint}/GetMyJobAlerts`, { activeOnly });
    }

    createJobAlert(body: CreateJobAlertDto): Observable<any> {
        return this.api.post(`${this.endpoint}/CreateJobAlert`, body);
    }

    updateJobAlert(id: string, body: UpdateJobAlertDto): Observable<any> {
        return this.api.put(`${this.endpoint}/UpdateJobAlert/${id}`, body);
    }

    deleteJobAlert(id: string): Observable<any> {
        return this.api.delete(`${this.endpoint}/DeleteJobAlert/${id}`);
    }

    toggleActive(id: string): Observable<any> {
        return this.api.post(`${this.endpoint}/ToggleActive/${id}/toggle-active`, {});
    }
}
