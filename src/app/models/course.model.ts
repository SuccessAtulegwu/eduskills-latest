/**
 * Course-related models and interfaces
 */

// API Request Interfaces
export interface CreateCourseRequest {
    title: string;
    description: string;
    price?: number;
    durationHours?: number;
    categoryId?: number;
    level?: string;
    examType?: number; // 0, 1, 2, 3, 4, 5
    certificationEnabled?: boolean;
    certificateTemplateId?: number;
    passingScore?: number;
    thumbnailFile?: File | string; // File object or base64 string
}

export interface UpdateCourseRequest {
    title?: string;
    description?: string;
    price?: number;
    durationHours?: number;
    categoryId?: number;
    level?: string;
    examType?: number; // 0, 1, 2, 3, 4, 5
    certificationEnabled?: boolean;
    certificateTemplateId?: number;
    passingScore?: number;
    thumbnailFile?: File | string; // File object or base64 string
}

export enum ExamType {
  None = 0,
  WAEC = 1,
  NECO = 2,
  JAMB = 3,
  NABTEB = 4,
  GCE = 5
}

// models/category.model.ts
export interface Category {
  id: number;
  name: string;
  description?: string;
}

// API Response Interfaces
export interface CourseResponse {
   id: number;
  title: string;
  description: string;
  price: number;
  thumbnailUrl: string;
  createdAt: string; // or Date if you parse it
  durationHours: number;
  categoryId: number;
  category: Category;
  level: string;
  examType: ExamType;
  isPublished: boolean;
  certificationEnabled: boolean;
  certificateTemplateId?: number;
  passingScore?: number;
  views: number;
  enrollmentCount: number;
  rating?: number;
  ratingCount: number;
  creatorId: string;
  creatorName: string;
}

// Query Parameters Interface
export interface GetCoursesQueryParams {
    categoryId?: number;
    level?: string;
    examType?: number; // 0, 1, 2, 3, 4, 5
    searchTerm?: string;
    maxPrice?: number;
    sortBy?: string; // Default sort field
}

// Display Model (for UI compatibility)
export interface CourseModel {
    id: number;
    title: string;
    image: string;
    price: number;
    level: string; // 'Beginner', 'Intermediate', 'Advanced'
    views: number;
    enrolled: number;
    category: string;
    description?: string;
    creator?: string;
    duration?: string;
    createdDate?: string;
}
