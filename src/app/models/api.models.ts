
// Admin DTOs
export interface RejectVideoDto {
    reason: string;
    [key: string]: any;
}

export interface AssignRoleDto {
    role: string;
    [key: string]: any;
}

// Artisan Profile DTOs
export interface ArtisanProfileCreateDto {
    specialization: string;
    bio?: string;
    skills: string[]; // or string
    hourlyRate: number;
    locationAddress: string;
    latitude?: number;
    longitude?: number;
    [key: string]: any;
}

export interface ArtisanProfileUpdateDto {
    specialization?: string;
    bio?: string;
    hourlyRate?: number;
    [key: string]: any;
}

export interface LocationUpdateModel {
    latitude: number;
    longitude: number;
    address?: string;
    [key: string]: any;
}

// Artisan Review DTOs
export interface CreateReviewDto {
    rating: number;
    comment: string;
    [key: string]: any;
}

export interface UpdateReviewDto {
    rating?: number;
    comment?: string;
    [key: string]: any;
}

// Artisan Search DTOs
export interface ArtisanSearchFilters {
    specialization?: string;
    minRate?: number;
    maxRate?: number;
    location?: string;
    [key: string]: any;
}

export interface NearbySearchModel {
    latitude: number;
    longitude: number;
    radius: number; // in km/meters
    [key: string]: any;
}

// Booking DTOs
export interface BookingCreateRequestDto {
    artisanId: string;
    serviceId?: string;
    date: string;
    duration?: number;
    notes?: string;
    [key: string]: any;
}

export interface RejectBookingDto {
    reason: string;
    [key: string]: any;
}

export interface CompleteBookingDto {
    rating?: number;
    comment?: string;
    [key: string]: any;
}

export interface CancelBookingDto {
    reason: string;
    [key: string]: any;
}

export interface SendMessageDto {
    message: string;
    [key: string]: any;
}

// Comments DTOs
export interface CommentCreateDto {
    content: string;
    [key: string]: any;
}

// Course DTOs
export interface CourseCreateDto {
    title: string;
    description: string;
    price: number;
    categoryId?: string;
    [key: string]: any;
}

export interface CourseUpdateDto {
    title?: string;
    description?: string;
    price?: number;
    [key: string]: any;
}

export interface UpdateVideoProgressDto {
    position: number;
    completed: boolean;
    [key: string]: any;
}

// Certificate DTOs
export interface GenerateCertificateDto {
    courseId: string;
    [key: string]: any;
}

// CV Template DTOs
export interface CreateCVDto {
    fullName: string;
    email: string;
    phone: string;
    summary: string;
    experience: any[];
    education: any[];
    [key: string]: any;
}

export interface UpdateCVDto {
    fullName?: string;
    email?: string;
    [key: string]: any;
}

// Escrow DTOs
export interface ReleaseEscrowDto {
    [key: string]: any;
}

export interface RefundEscrowDto {
    reason: string;
    [key: string]: any;
}

export interface DisputeEscrowDto {
    reason: string;
    evidence?: string;
    [key: string]: any;
}

// Job Alert DTOs
export interface CreateJobAlertDto {
    keywords: string;
    location?: string;
    categoryId?: string;
    [key: string]: any;
}

export interface UpdateJobAlertDto {
    keywords?: string;
    [key: string]: any;
}

// Job Application DTOs
export interface CreateJobApplicationDto {
    jobId: string;
    coverLetter?: string;
    cvId?: string;
    [key: string]: any;
}

export interface UpdateApplicationStatusDto {
    status: string;
    [key: string]: any;
}

// Job Posting DTOs
export interface CreateJobPostingDto {
    title: string;
    description: string;
    requirements: string;
    location: string;
    salaryRange?: string;
    [key: string]: any;
}

export interface UpdateJobPostingDto {
    title?: string;
    description?: string;
    [key: string]: any;
}

// Language DTOs
export interface SetLanguageDto {
    languageCode: string; // e.g., 'en', 'fr'
    [key: string]: any;
}

// Learning Path DTOs
export interface CreateLearningPathDto {
    title: string;
    description: string;
    courses: string[]; // List of course IDs
    [key: string]: any;
}

export interface UpdateLearningPathDto {
    title?: string;
    description?: string;
    [key: string]: any;
}

// Marketplace DTOs
export interface MarketplaceListingCreateDto {
    title: string;
    description: string;
    price: number;
    categoryId: string;
    [key: string]: any;
}

export interface MarketplaceSubscriptionCreateDto {
    planId: string;
    [key: string]: any;
}

export interface MarketplaceReviewCreateDto {
    listingId: string;
    rating: number;
    comment: string;
    [key: string]: any;
}

// Mentorship DTOs
export interface RequestMentorshipDto {
    message: string;
    goals: string;
    [key: string]: any;
}

export interface AcceptMentorshipDto {
    [key: string]: any;
}

export interface RejectMentorshipDto {
    reason: string;
    [key: string]: any;
}

export interface CreateSessionDto {
    startTime: string;
    endTime: string;
    topic: string;
    [key: string]: any;
}

export interface UpdateSessionDto {
    startTime?: string;
    endTime?: string;
    topic?: string;
    [key: string]: any;
}

export interface CompleteSessionDto {
    notes?: string;
    [key: string]: any;
}

// Payment DTOs
export interface CreatePaymentRequest {
    amount: number;
    currency: string;
    purpose: string; // e.g., 'course_purchase', 'booking'
    referenceId?: string;
    [key: string]: any;
}

export interface RefundPaymentDto {
    reason: string;
    amount?: number;
    [key: string]: any;
}

// Profile DTOs
export interface ProfileUpdateDto {
    firstName?: string;
    lastName?: string;
    bio?: string;
    [key: string]: any;
}

// Quiz DTOs
export interface CreateQuizDto {
    videoId?: string;
    courseId?: string;
    title: string;
    questions: any[];
    [key: string]: any;
}

export interface SubmitQuizDto {
    answers: { questionId: string; selectedOption: number }[];
    [key: string]: any;
}

// Skill DTOs
export interface CreateSkillDto {
    name: string;
    description?: string;
    [key: string]: any;
}

export interface UpdateSkillDto {
    name?: string;
    description?: string;
    [key: string]: any;
}

export interface SetLearningStyleDto {
    style: string; // e.g., 'visual', 'auditory'
    [key: string]: any;
}

// Theme DTOs
export interface SetThemeDto {
    theme: 'light' | 'dark' | 'system';
    [key: string]: any;
}

// Unified Search DTOs
export interface ServiceSearchFilters {
    searchTerm?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    [key: string]: any;
}

export interface GetOrCreateConversationRequest {
    participantId: string;
    [key: string]: any;
}

// Video DTOs
export interface VideoUploadDto {
    title: string;
    description?: string;
    tags?: string[];
    [key: string]: any;
}

export interface UpdateWatchPositionDto {
    position: number; // in seconds
    [key: string]: any;
}
