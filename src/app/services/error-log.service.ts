import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class ErrorLogService {
    private readonly endpoint = '/ErrorLog';

    constructor(private api: ApiService) { }

    getErrorLogs(query?: {
        page?: number;
        pageSize?: number;
        severity?: string;
        startDate?: string;
        endDate?: string;
    }): Observable<any> {
        return this.api.get(`${this.endpoint}/GetErrorLogs`, query);
    }

    getErrorLog(id: string): Observable<any> {
        return this.api.get(`${this.endpoint}/GetErrorLog/${id}`);
    }

    deleteErrorLog(id: string): Observable<any> {
        return this.api.delete(`${this.endpoint}/DeleteErrorLog/${id}`);
    }

    deleteOldErrorLogs(daysToKeep?: number): Observable<any> {
        return this.api.delete(`${this.endpoint}/DeleteOldErrorLogs/old?daysToKeep=${daysToKeep || ''}`);
    }
}
