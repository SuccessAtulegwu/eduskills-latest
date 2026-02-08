import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
    ArtisanProfileCreateDto,
    ArtisanProfileUpdateDto,
    LocationUpdateModel
} from '../models/api.models';

@Injectable({
    providedIn: 'root'
})
export class ArtisanProfileService {
    private readonly endpoint = '/ArtisanProfile';

    constructor(private api: ApiService) { }

    getMyProfile(): Observable<any> {
        return this.api.get(`${this.endpoint}/GetMyProfile`);
    }

    getProfile(userId: string): Observable<any> {
        return this.api.get(`${this.endpoint}/GetProfile/${userId}`);
    }

    createProfile(body: ArtisanProfileCreateDto, certificateFiles: File[]): Observable<any> {
        const formData = new FormData();
        Object.keys(body).forEach(key => {
            formData.append(key, (body as any)[key]);
        });
        certificateFiles.forEach(file => {
            formData.append('certificateFiles', file);
        });
        return this.api.upload(`${this.endpoint}/CreateProfile`, formData);
    }

    updateProfile(body: ArtisanProfileUpdateDto, certificateFiles?: File[]): Observable<any> {
        const formData = new FormData();
        Object.keys(body).forEach(key => {
            formData.append(key, (body as any)[key]);
        });
        if (certificateFiles) {
            certificateFiles.forEach(file => {
                formData.append('certificateFiles', file);
            });
        }
        // Using put as per spec, but ApiService.upload uses POST.
        // If backend expects PUT with multipart, we might need a specific putUpload method in ApiService
        // For now assuming existing uploading mechanism implies POST or ApiService can handle it.
        // Actually ApiService.upload is strictly POST. The spec says PUT for UpdateProfile.
        // I will use api.put if I can send FormData, but usually HttpClient.put supports body.
        // api.put takes 'any' body.
        return this.api.put(`${this.endpoint}/UpdateProfile`, formData);
    }

    updateLocation(body: LocationUpdateModel): Observable<any> {
        return this.api.post(`${this.endpoint}/UpdateLocation/location`, body);
    }
}
