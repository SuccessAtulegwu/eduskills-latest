import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
    CreateCourseRequest,
    UpdateCourseRequest,
    CourseResponse,
    GetCoursesQueryParams,
    CourseModel
} from '../../../models/course.model';

// API Base URL - Update this with your actual API base URL
const API_BASE_URL = '/api/v1';

@Injectable({
    providedIn: 'root'
})
export class CourseService {
    private apiUrl = API_BASE_URL;

    // Fallback courses for backward compatibility
    private courses: CourseModel[] = [
        {
            id: 1,
            title: 'Learn how to style hair for different nationals',
            image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            price: 4000,
            level: 'Beginner',
            views: 8,
            enrolled: 1,
            category: 'Design',
            creator: 'Amatullah Musa',
            description: 'Learn how to style hair for different nationals. This comprehensive course covers everything from basic braiding to advanced styling techniques suitable for professional salons.',
            duration: '3 hours',
            createdDate: 'Dec 02, 2025'
        },
        {
            id: 2,
            title: 'Tutorial on Research',
            image: 'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            price: 5000,
            level: 'Beginner',
            views: 18,
            enrolled: 1,
            category: 'Education',
            creator: 'John Doe',
            description: 'In-depth tutorial on research methodologies.',
            duration: '4 hours',
            createdDate: 'Jan 15, 2025'
        },
        {
            id: 3,
            title: 'Learning to program a computer system for beginners',
            image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            price: 4000,
            level: 'Beginner',
            views: 22,
            enrolled: 3,
            category: 'Development',
            creator: 'Jane Smith',
            description: 'Start your programming journey here.',
            duration: '10 hours',
            createdDate: 'Feb 20, 2025'
        },
        {
            id: 4,
            title: 'Advanced UI/UX Design Principles',
            image: 'https://images.unsplash.com/photo-1586717791821-3f44a5638d48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            price: 15000,
            level: 'Advanced',
            views: 120,
            enrolled: 45,
            category: 'Design',
            creator: 'Design Master',
            description: 'Master advanced design concepts.',
            duration: '8 hours',
            createdDate: 'Mar 10, 2025'
        },
        {
            id: 5,
            title: 'Financial Accounting Basics',
            image: 'https://images.unsplash.com/photo-1554224155-984067941747?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            price: 3500,
            level: 'Beginner',
            views: 56,
            enrolled: 12,
            category: 'Business',
            creator: 'Finance Guru',
            description: 'Basics of financial accounting.',
            duration: '5 hours',
            createdDate: 'Apr 05, 2025'
        },
        {
            id: 6,
            title: 'Full Stack Web Development with Angular',
            image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            price: 25000,
            level: 'Intermediate',
            views: 340,
            enrolled: 89,
            category: 'Development',
            creator: 'Angular Pro',
            description: 'Become a full stack developer.',
            duration: '20 hours',
            createdDate: 'May 12, 2025'
        }
    ];

    constructor(private http: HttpClient) { }

    /**
     * Create a new course
     * POST /api/v1/Course
     */
    createCourse(courseData: CreateCourseRequest): Observable<CourseResponse> {
        const formData = new FormData();
        
        // Add required fields
        formData.append('title', courseData.title);
        formData.append('description', courseData.description);
        
        // Add optional fields if provided
        if (courseData.price !== undefined) {
            formData.append('price', courseData.price.toString());
        }
        if (courseData.durationHours !== undefined) {
            formData.append('durationHours', courseData.durationHours.toString());
        }
        if (courseData.categoryId !== undefined) {
            formData.append('categoryId', courseData.categoryId.toString());
        }
        if (courseData.level) {
            formData.append('level', courseData.level);
        }
        if (courseData.examType !== undefined) {
            formData.append('examType', courseData.examType.toString());
        }
        if (courseData.certificationEnabled !== undefined) {
            formData.append('certificationEnabled', courseData.certificationEnabled.toString());
        }
        if (courseData.certificateTemplateId !== undefined) {
            formData.append('certificateTemplateId', courseData.certificateTemplateId.toString());
        }
        if (courseData.passingScore !== undefined) {
            formData.append('passingScore', courseData.passingScore.toString());
        }
        
        // Handle thumbnail file
        if (courseData.thumbnailFile) {
            if (courseData.thumbnailFile instanceof File) {
                formData.append('thumbnailFile', courseData.thumbnailFile);
            } else {
                // If it's a base64 string, convert it to a blob
                const byteString = atob(courseData.thumbnailFile.split(',')[1] || courseData.thumbnailFile);
                const mimeString = courseData.thumbnailFile.split(',')[0].match(/:(.*?);/)?.[1] || 'image/png';
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                for (let i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                const blob = new Blob([ab], { type: mimeString });
                formData.append('thumbnailFile', blob, 'thumbnail.png');
            }
        }

        return this.http.post<CourseResponse>(`${this.apiUrl}/Course`, formData);
    }

    /**
     * Get all courses with optional query parameters
     * GET /api/v1/Course
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

        return this.http.get<CourseResponse[]>(`${this.apiUrl}/Course`, { params: httpParams });
    }

    /**
     * Get course by ID
     * GET /api/v1/Course/{id}
     */
    getCourseById(id: number): Observable<CourseResponse> {
        return this.http.get<CourseResponse>(`${this.apiUrl}/Course/${id}`);
    }

    /**
     * Update course by ID
     * PUT /api/v1/Course/{id}
     */
    updateCourse(id: number, courseData: UpdateCourseRequest): Observable<CourseResponse> {
        const formData = new FormData();
        
        // Add fields if provided
        if (courseData.title !== undefined) {
            formData.append('title', courseData.title);
        }
        if (courseData.description !== undefined) {
            formData.append('description', courseData.description);
        }
        if (courseData.price !== undefined) {
            formData.append('price', courseData.price.toString());
        }
        if (courseData.durationHours !== undefined) {
            formData.append('durationHours', courseData.durationHours.toString());
        }
        if (courseData.categoryId !== undefined) {
            formData.append('categoryId', courseData.categoryId.toString());
        }
        if (courseData.level !== undefined) {
            formData.append('level', courseData.level);
        }
        if (courseData.examType !== undefined) {
            formData.append('examType', courseData.examType.toString());
        }
        if (courseData.certificationEnabled !== undefined) {
            formData.append('certificationEnabled', courseData.certificationEnabled.toString());
        }
        if (courseData.certificateTemplateId !== undefined) {
            formData.append('certificateTemplateId', courseData.certificateTemplateId.toString());
        }
        if (courseData.passingScore !== undefined) {
            formData.append('passingScore', courseData.passingScore.toString());
        }
        
        // Handle thumbnail file
        if (courseData.thumbnailFile) {
            if (courseData.thumbnailFile instanceof File) {
                formData.append('thumbnailFile', courseData.thumbnailFile);
            } else {
                // If it's a base64 string, convert it to a blob
                const byteString = atob(courseData.thumbnailFile.split(',')[1] || courseData.thumbnailFile);
                const mimeString = courseData.thumbnailFile.split(',')[0].match(/:(.*?);/)?.[1] || 'image/png';
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                for (let i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                const blob = new Blob([ab], { type: mimeString });
                formData.append('thumbnailFile', blob, 'thumbnail.png');
            }
        }

        return this.http.put<CourseResponse>(`${this.apiUrl}/Course/${id}`, formData);
    }

    /**
     * Delete course by ID
     * DELETE /api/v1/Course/{id}
     */
    deleteCourse(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/Course/${id}`);
    }

    // Legacy methods for backward compatibility
    getCourses(): CourseModel[] {
        return this.courses;
    }

    getCourseByIdLegacy(id: number): CourseModel | undefined {
        return this.courses.find(course => course.id === id);
    }
}
