import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { CreateCVDto, UpdateCVDto } from '../models/api.models';

@Injectable({
    providedIn: 'root'
})
export class CVTemplateService {
    private readonly endpoint = '/CVTemplate';

    constructor(private api: ApiService) { }

    getTemplates(query?: {
        templateType?: string;
        industry?: string;
        searchTerm?: string;
        isPremium?: boolean;
        sortBy?: string;
    }): Observable<any> {
        return this.api.get(`${this.endpoint}/GetTemplates`, query);
    }

    getTemplate(id: string): Observable<any> {
        return this.api.get(`${this.endpoint}/GetTemplate/${id}`);
    }

    createCV(templateId: string, body: CreateCVDto): Observable<any> {
        return this.api.post(`${this.endpoint}/CreateCV/${templateId}/create-cv`, body);
    }

    getMyCVs(): Observable<any> {
        return this.api.get(`${this.endpoint}/GetMyCVs/my-cvs`);
    }

    updateCV(id: string, body: UpdateCVDto): Observable<any> {
        return this.api.put(`${this.endpoint}/UpdateCV/${id}`, body);
    }

    previewCV(id: string): Observable<any> {
        return this.api.get(`${this.endpoint}/PreviewCV/${id}/preview`);
    }

    downloadCV(id: string, format?: string): Observable<any> {
        return this.api.get(`${this.endpoint}/DownloadCV/${id}/download`, { format });
    }

    setDefaultCV(id: string): Observable<any> {
        return this.api.post(`${this.endpoint}/SetDefaultCV/${id}/set-default`, {});
    }

    deleteCV(id: string): Observable<any> {
        return this.api.delete(`${this.endpoint}/DeleteCV/${id}`);
    }
}
