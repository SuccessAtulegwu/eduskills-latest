/**
 * Job Posting Models and Interfaces
 * Based on API endpoints: /api/v1/JobPosting
 */

/**
 * Job Type Enum
 * 0 = FullTime, 1 = PartTime, 2 = Contract, 3 = Internship
 */
export enum JobType {
    FullTime = 0,
    PartTime = 1,
    Contract = 2,
    Internship = 3
}

/**
 * API Request Interface for Creating Job Posting
 * POST /api/v1/JobPosting/CreateJobPosting
 */
export interface CreateJobPostingRequest {
    title: string;
    description: string;
    requirements: string;
    responsibilities: string;
    companyName: string;
    companyDescription: string;
    location: string;
    jobType: JobType;
    salaryRange: string;
    experienceLevel: string;
    applicationDeadline: string; // ISO date string (YYYY-MM-DD)
    categoryId: number;
}

/**
 * API Request Interface for Updating Job Posting
 * PUT /api/v1/JobPosting/UpdateJobPosting/{id}
 */
export interface UpdateJobPostingRequest {
    title?: string;
    description?: string;
    requirements?: string;
    responsibilities?: string;
    companyName?: string;
    companyDescription?: string;
    location?: string;
    jobType?: JobType;
    salaryRange?: string;
    experienceLevel?: string;
    applicationDeadline?: string; // ISO date string (YYYY-MM-DD)
    categoryId?: number;
}

/**
 * API Response Interface for Job Posting
 * GET /api/v1/JobPosting/GetJobPosting/{id}
 * GET /api/v1/JobPosting/GetJobPostings
 */
export interface JobPostingResponse {
    id: number;
    title: string;
    description: string;
    requirements: string;
    responsibilities: string;
    companyName: string;
    companyDescription: string;
    location: string;
    jobType: JobType;
    salaryRange: string;
    experienceLevel: string;
    applicationDeadline: string;
    categoryId: number;
    createdAt?: string;
    updatedAt?: string;
    creatorId?: string;
    views?: number;
    applications?: number;
    isExpired?: boolean;
}

/**
 * Job Posting Model for UI
 */
export interface JobPostingModel {
    id: number;
    title: string;
    description: string;
    requirements: string;
    responsibilities: string;
    companyName: string;
    companyDescription: string;
    location: string;
    jobType: string;
    jobTypeEnum: JobType;
    salaryRange: string;
    experienceLevel: string;
    applicationDeadline: string;
    categoryId: number;
    createdDate: string;
    updatedDate?: string;
    views: number;
    applications: number;
    isExpired: boolean;
    jobTypeClass: string;
    jobTypeBadge: string;
    companyLogoColor: string;
}

/**
 * Query Parameters for Filtering Job Postings
 */
export interface GetJobPostingsQueryParams {
    categoryId?: number;
    jobType?: JobType;
    location?: string;
    experienceLevel?: string;
    searchTerm?: string;
    minSalary?: number;
    maxSalary?: number;
    isExpired?: boolean;
    sortBy?: string;
}

/**
 * Helper function to convert JobType enum to display string
 */
export function jobTypeToString(jobType: JobType): string {
    switch (jobType) {
        case JobType.FullTime:
            return 'Full Time';
        case JobType.PartTime:
            return 'Part Time';
        case JobType.Contract:
            return 'Contract';
        case JobType.Internship:
            return 'Internship';
        default:
            return 'Full Time';
    }
}

/**
 * Helper function to convert string to JobType enum
 */
export function stringToJobType(type: string): JobType {
    switch (type.toLowerCase()) {
        case 'fulltime':
        case 'full_time':
        case 'full time':
            return JobType.FullTime;
        case 'parttime':
        case 'part_time':
        case 'part time':
            return JobType.PartTime;
        case 'contract':
            return JobType.Contract;
        case 'internship':
            return JobType.Internship;
        default:
            return JobType.FullTime;
    }
}

/**
 * Get CSS class for JobType
 */
export function getJobTypeClass(jobType: JobType): string {
    switch (jobType) {
        case JobType.FullTime:
            return 'bg-primary text-white';
        case JobType.PartTime:
            return 'bg-info text-white';
        case JobType.Contract:
            return 'bg-warning text-dark';
        case JobType.Internship:
            return 'bg-success text-white';
        default:
            return 'bg-secondary text-white';
    }
}

/**
 * Get badge text for JobType
 */
export function getJobTypeBadge(jobType: JobType): string {
    return jobTypeToString(jobType);
}

/**
 * Generate company logo color based on company name
 */
export function generateCompanyLogoColor(companyName: string): string {
    const colors = [
        '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', 
        '#ef4444', '#06b6d4', '#ec4899', '#6366f1'
    ];
    const index = companyName.charCodeAt(0) % colors.length;
    return colors[index];
}

/**
 * Helper function to convert JobPostingResponse to JobPostingModel
 */
export function jobPostingResponseToModel(response: JobPostingResponse): JobPostingModel {
    const createdDate = new Date(response.createdAt || new Date());
    const formattedCreatedDate = createdDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    let formattedUpdatedDate: string | undefined;
    if (response.updatedAt) {
        const updatedDate = new Date(response.updatedAt);
        formattedUpdatedDate = updatedDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    return {
        id: response.id,
        title: response.title,
        description: response.description,
        requirements: response.requirements,
        responsibilities: response.responsibilities,
        companyName: response.companyName,
        companyDescription: response.companyDescription,
        location: response.location,
        jobType: jobTypeToString(response.jobType),
        jobTypeEnum: response.jobType,
        salaryRange: response.salaryRange,
        experienceLevel: response.experienceLevel,
        applicationDeadline: response.applicationDeadline,
        categoryId: response.categoryId,
        createdDate: formattedCreatedDate,
        updatedDate: formattedUpdatedDate,
        views: response.views || 0,
        applications: response.applications || 0,
        isExpired: response.isExpired || false,
        jobTypeClass: getJobTypeClass(response.jobType),
        jobTypeBadge: getJobTypeBadge(response.jobType),
        companyLogoColor: generateCompanyLogoColor(response.companyName)
    };
}
