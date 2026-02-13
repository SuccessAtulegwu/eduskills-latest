

export interface User {
    id: string;
    firstname: string;
    lastname: string;
    name?: string;
    accountType: string;
    creatorconsent: boolean;
    phone?: string;
    avatar?: string;
    username: string;
    email: string;
    role: string;
    rememberMe: boolean;
}

export interface signUpDto {
    FirstName: string;
    LastName: string;
    Password: string;
    SelectedRole: string;
    IsCreator: boolean;
    PhoneNumber: string;
    Email: string;
}


export interface ForgotPasswordDto {
    Email: string;
}

export interface ResetPasswordDto {
    Email: string;
    Token: string;
    NewPassword: string;
    ConfirmPassword: string;
}

/**
 * Generic API Response interface
 */
export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
    errors?: { [key: string]: string[] };
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}


/**
 * Login credentials
 */
export interface LoginCredentials {
    Email: string;
    Password: string;
}

/**
 * Auth response
 */
export interface AuthResponse {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    token: string;
    isCreator: boolean;
    roles?: string;
    refreshToken?: string;
}

export interface VideoResponse {
    id: number;
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    creatorName: string;
    categoryName: string;
    views: number;
    likes: number;
    isLiked: boolean;
    uploadedAt: string;
    durationSeconds: number;
    lastWatchPosition: number;
}

// Re-export course models and api models for convenience
export * from './course.model';
export * from './skill.model';
export * from './job-application.model';
export * from './job-posting.model';
export * from './api.models';
