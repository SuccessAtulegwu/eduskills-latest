import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { SetLanguageDto } from '../models/api.models';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    private readonly endpoint = '/Language';

    constructor(private api: ApiService) { }

    setLanguage(body: SetLanguageDto): Observable<any> {
        return this.api.post(`${this.endpoint}/SetLanguage/set`, body);
    }

    getLanguages(): Observable<any> {
        return this.api.get(`${this.endpoint}/GetLanguages`);
    }

    getCurrentLanguage(): Observable<any> {
        return this.api.get(`${this.endpoint}/GetCurrentLanguage/current`);
    }
}
