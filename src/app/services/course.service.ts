import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CourseModel, CourseResponse, CreateCourseRequest, GetAllCoursesResponse, GetCoursesQueryParams, UpdateCourseRequest, } from '../models/model';


@Injectable({
    providedIn: 'root'
})
export class CourseService {
    private apiUrl = environment.apiUrl;

    // Fallback courses for backward compatibility - EMPTY now as requested
    private courses: CourseModel[] = [];

    constructor(private http: HttpClient) { }

    /**
     * Create a new course
     */
    createCourse(courseData: CreateCourseRequest): Observable<CourseResponse> {
        // Prepare JSON payload (no FormData, no file)
        const payload = {
            title: courseData.title,
            description: courseData.description,
            price: courseData.price,
            durationHours: courseData.durationHours,
            categoryId: courseData.categoryId,
            level: courseData.level,
            examType: courseData.examType,
            certificationEnabled: courseData.certificationEnabled,
            certificateTemplateId: courseData.certificateTemplateId,
            passingScore: courseData.passingScore
        };

        return this.http.post<CourseResponse>(`${this.apiUrl}/Course/CreateCourse`, payload);
    }

    /**
     * Upload or replace thumbnail for a course
     */
    uploadThumbnail(courseId: number, thumbnailFile: File | string): Observable<any> {
        const formData = new FormData();

        if (thumbnailFile instanceof File) {
            formData.append('thumbnailFile', thumbnailFile);
        } else {
            // If it's a base64 string, convert it to a blob
            const byteString = atob(thumbnailFile.split(',')[1] || thumbnailFile);
            const mimeString = thumbnailFile.split(',')[0].match(/:(.*?);/)?.[1] || 'image/png';
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            const blob = new Blob([ab], { type: mimeString });
            formData.append('thumbnailFile', blob, 'thumbnail.png');
        }

        return this.http.post(`${this.apiUrl}/Course/UploadThumbnail/${courseId}`, formData);
    }

    /**
     * Get all courses with optional query parameters
     */
    getAllCourses(params?: GetCoursesQueryParams): Observable<CourseResponse[]> {
        let httpParams = new HttpParams();

        if (params) {
            if (params.categoryId !== undefined) {
                httpParams = httpParams.set('categoryId', params.categoryId.toString());
            }
            if (params.level) {
                httpParams = httpParams.set('level', params.level);
            }
            if (params.examType !== undefined) {
                httpParams = httpParams.set('examType', params.examType.toString());
            }
            if (params.searchTerm) {
                httpParams = httpParams.set('searchTerm', params.searchTerm);
            }
            if (params.maxPrice !== undefined) {
                httpParams = httpParams.set('maxPrice', params.maxPrice.toString());
            }
            if (params.sortBy) {
                httpParams = httpParams.set('sortBy', params.sortBy);
            }
        }

        // Use GetAllCourses endpoint to get all courses including unpublished
        return this.http.get<GetAllCoursesResponse>(`${this.apiUrl}/Course/GetAllCourses`, { params: httpParams })
            .pipe(
                map(response => response.courses || [])
            );
    }

    /**
     * Get courses created by the current user
     * GET /api/v1/Course/GetMyCourses/my-courses
     */
    getMyCourses(): Observable<CourseResponse[]> {
        return this.http.get<GetAllCoursesResponse>(`${this.apiUrl}/Course/GetMyCourses/my-courses`)
            .pipe(
                map(response => response.courses || [])
            );
    }

    /**
     * Get course by ID
     * GET /api/v1/Course/GetCourse/{id}
     */
    getCourseById(id: number): Observable<CourseResponse> {
        return this.http.get<any>(`${this.apiUrl}/Course/GetCourse/${id}`).pipe(
            map(response => response.course)
        );
    }

    /**
     * Update course by ID
     */
    updateCourse(id: number, courseData: UpdateCourseRequest, thumbnailFile?: File | string): Observable<CourseResponse> {
        const formData = new FormData();

        // Add fields if provided
        if (courseData.title !== undefined) formData.append('Title', courseData.title);
        if (courseData.description !== undefined) formData.append('Description', courseData.description);
        if (courseData.price !== undefined) formData.append('Price', courseData.price.toString());
        if (courseData.durationHours !== undefined) formData.append('DurationHours', courseData.durationHours.toString());
        if (courseData.categoryId !== undefined) formData.append('CategoryId', courseData.categoryId.toString());
        if (courseData.level !== undefined) formData.append('Level', courseData.level);
        if (courseData.examType !== undefined) formData.append('ExamType', courseData.examType.toString());
        if (courseData.certificationEnabled !== undefined) formData.append('CertificationEnabled', courseData.certificationEnabled.toString());
        if (courseData.certificateTemplateId !== undefined) formData.append('CertificateTemplateId', courseData.certificateTemplateId.toString());
        if (courseData.passingScore !== undefined) formData.append('PassingScore', courseData.passingScore.toString());

        // Handle thumbnail
        if (thumbnailFile) {
            if (thumbnailFile instanceof File) {
                formData.append('thumbnailFile', thumbnailFile);
            } else {
                // For base64 string
                const byteString = atob(thumbnailFile.split(',')[1] || thumbnailFile);
                const mimeString = thumbnailFile.split(',')[0].match(/:(.*?);/)?.[1] || 'image/png';
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                for (let i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                const blob = new Blob([ab], { type: mimeString });
                formData.append('thumbnailFile', blob, 'thumbnail.png');
            }
        }

        return this.http.put<CourseResponse>(`${this.apiUrl}/Course/UpdateCourse/${id}`, formData);
    }

    /**
     * Delete course by ID
     */
    deleteCourse(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/Course/DeleteCourse/${id}`);
    }


}




