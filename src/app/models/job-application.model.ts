/**
 * Job Application Models and Interfaces
 * Based on API endpoints: /api/v1/JobApplication
 */

/**
 * Application Status Enum
 */
export enum ApplicationStatus {
    Pending = 0,
    Reviewed = 1,
    Shortlisted = 2,
    Rejected = 3,
    Accepted = 4
}

/**
 * API Request Interface for Applying to a Job
 * POST /api/v1/JobApplication/ApplyForJob
 */
export interface ApplyForJobRequest {
    jobPostingId: number;
    coverLetter: string;
    resumeUrl?: string;
    portfolioUrl?: string;
    expectedSalary?: string;
    availableStartDate?: string; // ISO date string
}

/**
 * API Request Interface for Updating Application Status
 * PUT /api/v1/JobApplication/UpdateApplicationStatus/{id}/status
 */
export interface UpdateApplicationStatusRequest {
    status: ApplicationStatus;
    notes?: string;
}

/**
 * API Response Interface for Job Application
 * GET /api/v1/JobApplication/GetApplication/{id}
 * GET /api/v1/JobApplication/GetMyApplications/my-applications
 * GET /api/v1/JobApplication/GetApplicationsByJob/job/{jobPostingId}
 */
export interface JobApplicationResponse {
    id: number;
    jobPostingId: number;
    jobTitle?: string;
    jobPostingTitle?: string; // Added to match API
    companyName?: string;
    applicantId: string;
    applicantName?: string;
    applicantEmail?: string;
    coverLetter: string;
    resumeUrl?: string;
    portfolioUrl?: string;
    expectedSalary?: string;
    availableStartDate?: string;
    status: ApplicationStatus;
    statusNotes?: string;
    appliedAt: string;
    updatedAt?: string;
}

/**
 * Job Application Model for UI
 */
export interface JobApplicationModel {
    id: number;
    jobPostingId: number;
    jobTitle: string;
    companyName: string;
    applicantName: string;
    applicantEmail: string;
    coverLetter: string;
    resumeUrl?: string;
    portfolioUrl?: string;
    expectedSalary?: string;
    availableStartDate?: string;
    status: string;
    statusNotes?: string;
    appliedDate: string;
    updatedDate?: string;
    statusClass: string;
    statusIcon: string;
    // Job Details
    jobDescription?: string;
    jobLocation?: string;
    jobType?: string;
    jobApplicationsCount?: number;
    jobViewsCount?: number;
    jobCompanyLogoColor?: string;
    jobCompanyDescription?: string;
    jobRequirements?: string;
    jobResponsibilities?: string;
}

/**
 * Convert ApplicationStatus enum to string
 */
export function applicationStatusToString(status: ApplicationStatus): string {
    switch (status) {
        case ApplicationStatus.Pending:
            return 'Pending';
        case ApplicationStatus.Reviewed:
            return 'Reviewed';
        case ApplicationStatus.Shortlisted:
            return 'Shortlisted';
        case ApplicationStatus.Rejected:
            return 'Rejected';
        case ApplicationStatus.Accepted:
            return 'Accepted';
        default:
            return 'Unknown';
    }
}

/**
 * Get CSS class for ApplicationStatus
 */
export function getApplicationStatusClass(status: ApplicationStatus): string {
    switch (status) {
        case ApplicationStatus.Pending:
            return 'bg-warning text-dark';
        case ApplicationStatus.Reviewed:
            return 'bg-info text-dark';
        case ApplicationStatus.Shortlisted:
            return 'bg-primary text-white';
        case ApplicationStatus.Rejected:
            return 'bg-danger text-white';
        case ApplicationStatus.Accepted:
            return 'bg-success text-white';
        default:
            return 'bg-secondary text-white';
    }
}

/**
 * Get Icon for ApplicationStatus
 */
export function getApplicationStatusIcon(status: ApplicationStatus): string {
    switch (status) {
        case ApplicationStatus.Pending:
            return 'bi-clock';
        case ApplicationStatus.Reviewed:
            return 'bi-eye';
        case ApplicationStatus.Shortlisted:
            return 'bi-star';
        case ApplicationStatus.Rejected:
            return 'bi-x-circle';
        case ApplicationStatus.Accepted:
            return 'bi-check-circle';
        default:
            return 'bi-question-circle';
    }
}

/**
 * Helper function to convert JobApplicationResponse to JobApplicationModel
 */
export function jobApplicationResponseToModel(response: JobApplicationResponse): JobApplicationModel {
    const appliedDate = new Date(response.appliedAt);
    const formattedAppliedDate = appliedDate.toLocaleDateString('en-US', {
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
        jobPostingId: response.jobPostingId,
        jobTitle: response.jobPostingTitle || response.jobTitle || 'Unknown Position',
        companyName: response.companyName || 'Unknown Company',
        applicantName: response.applicantName || 'Unknown Applicant',
        applicantEmail: response.applicantEmail || '',
        coverLetter: response.coverLetter || '',
        resumeUrl: response.resumeUrl,
        portfolioUrl: response.portfolioUrl,
        expectedSalary: response.expectedSalary,
        availableStartDate: response.availableStartDate,
        status: applicationStatusToString(response.status),
        statusNotes: response.statusNotes,
        appliedDate: formattedAppliedDate,
        updatedDate: formattedUpdatedDate,
        statusClass: getApplicationStatusClass(response.status),
        statusIcon: getApplicationStatusIcon(response.status)
    };
}
