import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { GenerateCertificateDto } from '../models/api.models';

@Injectable({
    providedIn: 'root'
})
export class CertificateService {
    private readonly endpoint = '/Certificate';

    constructor(private api: ApiService) { }

    getMyCertificates(): Observable<any> {
        return this.api.get(`${this.endpoint}/GetMyCertificates/my-certificates`);
    }

    getCertificate(id: string): Observable<any> {
        return this.api.get(`${this.endpoint}/GetCertificate/${id}`);
    }

    verifyCertificate(code: string): Observable<any> {
        return this.api.get(`${this.endpoint}/VerifyCertificate/verify/${code}`);
    }

    generateCertificate(body: GenerateCertificateDto): Observable<any> {
        return this.api.post(`${this.endpoint}/GenerateCertificate/generate`, body);
    }

    downloadCertificate(id: string, format?: string): Observable<any> {
        return this.api.get(`${this.endpoint}/DownloadCertificate/${id}/download`, { format });
    }

    previewCertificate(id: string): Observable<any> {
        return this.api.get(`${this.endpoint}/PreviewCertificate/${id}/preview`);
    }
}
