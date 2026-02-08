import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

/**
 * Artisan API Service
 * Handles all API interactions for artisan-related operations
 */
@Injectable({
    providedIn: 'root'
})
export class ArtisanService {
    private readonly endpoint = '/ArtisanProfile';

    constructor(private apiService: ApiService) { }

    /**
     * Create artisan profile
     * @param formData - FormData containing profile information and certificate files
     */
    createProfile(formData: FormData): Observable<ArtisanProfileResponse> {
        return this.apiService.upload<ArtisanProfileResponse>(`${this.endpoint}/CreateProfile`, formData);
    }

    /**
     * Get artisan profile by ID
     * @param id - Artisan profile ID
     */
    getProfile(id: string): Observable<ArtisanProfile> {
        return this.apiService.get<ArtisanProfile>(`${this.endpoint}/${id}`);
    }

    /**
     * Get current user's artisan profile
     */
    getMyProfile(): Observable<ArtisanProfile> {
        return this.apiService.get<ArtisanProfile>(`${this.endpoint}/me`);
    }

    /**
     * Update artisan profile
     * @param id - Artisan profile ID
     * @param formData - FormData containing updated profile information
     */
    updateProfile(id: string, formData: FormData): Observable<ArtisanProfileResponse> {
        return this.apiService.upload<ArtisanProfileResponse>(`${this.endpoint}/${id}`, formData);
    }

    /**
     * Delete artisan profile
     * @param id - Artisan profile ID
     */
    deleteProfile(id: string): Observable<any> {
        return this.apiService.delete(`${this.endpoint}/${id}`);
    }

    /**
     * Get all artisan profiles (with optional filters)
     * @param params - Query parameters for filtering
     */
    getAllProfiles(params?: ArtisanSearchParams): Observable<ArtisanProfile[]> {
        return this.apiService.get<ArtisanProfile[]>(this.endpoint, params);
    }

    /**
     * Search artisans by specialization
     * @param specialization - Specialization to search for
     */
    searchBySpecialization(specialization: string): Observable<ArtisanProfile[]> {
        return this.apiService.get<ArtisanProfile[]>(`${this.endpoint}/search`, { specialization });
    }

    /**
     * Search artisans by location
     * @param latitude - Latitude coordinate
     * @param longitude - Longitude coordinate
     * @param radius - Search radius in kilometers (optional)
     */
    searchByLocation(latitude: number, longitude: number, radius?: number): Observable<ArtisanProfile[]> {
        const params = { latitude, longitude, ...(radius && { radius }) };
        return this.apiService.get<ArtisanProfile[]>(`${this.endpoint}/nearby`, params);
    }

    /**
     * Update availability status
     * @param id - Artisan profile ID
     * @param isAvailable - Availability status
     */
    updateAvailability(id: string, isAvailable: boolean): Observable<any> {
        return this.apiService.patch(`${this.endpoint}/${id}/availability`, { isAvailable });
    }

    /**
     * Check if current user has an artisan profile
     */
    hasProfile(): Observable<boolean> {
        return this.apiService.get<boolean>(`${this.endpoint}/check-profile`);
    }
}

/**
 * Artisan Profile Interface
 */
export interface ArtisanProfile {
    id: string;
    userId: string;
    specialization: string;
    bio?: string;
    skills: string;
    portfolioUrl?: string;
    certifications?: string;
    serviceAreas: string;
    yearsOfExperience: number;
    hourlyRate: number;
    isAvailable: boolean;
    latitude: number;
    longitude: number;
    locationAddress: string;
    certificateFiles?: string[];
    rating?: number;
    totalReviews?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * Artisan Profile Response Interface
 */
export interface ArtisanProfileResponse {
    success: boolean;
    message: string;
    data: ArtisanProfile;
}

/**
 * Artisan Search Parameters Interface
 */
export interface ArtisanSearchParams {
    specialization?: string;
    serviceArea?: string;
    minRate?: number;
    maxRate?: number;
    minExperience?: number;
    isAvailable?: boolean;
    latitude?: number;
    longitude?: number;
    radius?: number;
    page?: number;
    limit?: number;
}
