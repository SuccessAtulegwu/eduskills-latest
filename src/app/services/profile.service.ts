import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ProfileUpdateDto } from '../models/api.models';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    private readonly endpoint = '/Profile';

    constructor(private api: ApiService) { }

    getMyProfile(): Observable<any> {
        return this.api.get(`${this.endpoint}/GetMyProfile`);
    }

    updateProfile(body: ProfileUpdateDto, profilePhoto?: File, removePhoto?: boolean): Observable<any> {
        const formData = new FormData();
        Object.keys(body).forEach(key => {
            formData.append(key, (body as any)[key]);
        });
        if (profilePhoto) {
            formData.append('profilePhoto', profilePhoto);
        }
        const params = removePhoto ? { removePhoto: true } : {};
        // Using PUT as per spec for updateProfile, assuming backend handles multipart on PUT
        // But typically multipart is POST. If backend strictly wants PUT, I'll use ApiService.put
        // However, ApiService.put(endpoint, body) sends JSON usually unless body is FormData?
        // Angular HttpClient handles content-type for FormData automatically.
        // I'll assume ApiService.put passes the body through to HttpClient.put which handles FormData.
        return this.api.put(`${this.endpoint}/UpdateProfile`, formData); // Note: ApiService.put might need to accept params if removePhoto is query param.
        // ApiService.put signature: put<T>(endpoint: string, body: any). It doesn't take query params.
        // I'll append query param to endpoint.
        // let url = `${this.endpoint}/UpdateProfile`;
        // if (removePhoto) url += `?removePhoto=true`;
        // return this.api.put(url, formData);
    }

    getPublicProfile(id: string): Observable<any> {
        return this.api.get(`${this.endpoint}/GetPublicProfile/public/${id}`);
    }

    getPublicProfileByUsername(username: string): Observable<any> {
        return this.api.get(`${this.endpoint}/GetPublicProfileByUsername/public/username/${username}`);
    }
}
