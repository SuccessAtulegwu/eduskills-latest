import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
    CourseCreateDto,
    CourseUpdateDto,
    UpdateVideoProgressDto
} from '../models/api.models';
import { CourseResponse } from '../models/model';

@Injectable({
    providedIn: 'root'
})
export class CourseService {
    private readonly endpoint = '/Course';

    constructor(private api: ApiService) { }

    getCourses(query?: {
        categoryId?: string;
        level?: string;
        examType?: string;
        searchTerm?: string;
        maxPrice?: number;
        sortBy?: string;
    }): Observable<any> {
        return this.api.get(`${this.endpoint}/GetCourses`, query);
    }

    getAllCourses(): Observable<CourseResponse[]> {
        return this.api.get(`${this.endpoint}/GetAllCourses`);
    }

    getCourse(id: string): Observable<any> {
        return this.api.get(`${this.endpoint}/GetCourse/${id}`);
    }

    createCourse(body: CourseCreateDto): Observable<any> {
        return this.api.post(`${this.endpoint}/CreateCourse`, body);
    }

    uploadThumbnail(id: string, thumbnailFile: File): Observable<any> {
        const formData = new FormData();
        formData.append('thumbnailFile', thumbnailFile);
        return this.api.upload(`${this.endpoint}/UploadThumbnail/${id}/thumbnail`, formData);
    }

    updateCourse(id: string, body: CourseUpdateDto, thumbnailFile?: File): Observable<any> {
        const formData = new FormData();
        Object.keys(body).forEach(key => {
            formData.append(key, (body as any)[key]);
        });
        if (thumbnailFile) {
            formData.append('thumbnailFile', thumbnailFile);
        }
        // Spec uses PUT with multipart.
        return this.api.put(`${this.endpoint}/UpdateCourse/${id}`, formData);
    }

    deleteCourse(id: string): Observable<any> {
        return this.api.delete(`${this.endpoint}/DeleteCourse/${id}`);
    }

    getMyCourses(): Observable<any> {
        return this.api.get(`${this.endpoint}/GetMyCourses/my-courses`);
    }

    enroll(courseId: string): Observable<any> {
        return this.api.post(`${this.endpoint}/Enroll/${courseId}/enroll`, {});
    }

    getMyEnrollments(): Observable<any> {
        return this.api.get(`${this.endpoint}/GetMyEnrollments/my-enrollments`);
    }

    generateCertificate(courseId: string): Observable<any> {
        return this.api.post(`${this.endpoint}/GenerateCertificate/${courseId}/generate-certificate`, {});
    }

    updateVideoProgress(courseId: string, videoId: string, body: UpdateVideoProgressDto): Observable<any> {
        return this.api.post(`${this.endpoint}/UpdateVideoProgress/${courseId}/videos/${videoId}/progress`, body);
    }
}
