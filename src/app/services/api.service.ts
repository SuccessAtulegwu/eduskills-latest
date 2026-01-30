import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { SecureStorageService } from './secure-storage.service';
import { ApiResponse } from '../models/model';


/**
 * Base API Service
 * Provides common HTTP methods for all API interactions
 */
@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private readonly baseUrl = environment.apiUrl;

    constructor(
        private http: HttpClient,
        private secureStorage: SecureStorageService
    ) { }

    /**
     * GET request
     */
    get<T>(endpoint: string, params?: any): Observable<T> {
        const url = `${this.baseUrl}${endpoint}`;
        const httpParams = this.buildParams(params);

        return this.http.get<ApiResponse<T>>(url, { params: httpParams }).pipe(
            map(response => this.handleResponse<T>(response)),
            catchError(error => throwError(() => error))
        );
    }

    /**
     * POST request
     */
    post<T>(endpoint: string, body: any): Observable<T> {
        const url = `${this.baseUrl}${endpoint}`;

        return this.http.post<ApiResponse<T>>(url, body).pipe(
            map(response => this.handleResponse<T>(response)),
            catchError(error => throwError(() => error))
        );
    }

    /**
     * PUT request
     */
    put<T>(endpoint: string, body: any): Observable<T> {
        const url = `${this.baseUrl}${endpoint}`;

        return this.http.put<ApiResponse<T>>(url, body).pipe(
            map(response => this.handleResponse<T>(response)),
            catchError(error => throwError(() => error))
        );
    }

    /**
     * PATCH request
     */
    patch<T>(endpoint: string, body: any): Observable<T> {
        const url = `${this.baseUrl}${endpoint}`;

        return this.http.patch<ApiResponse<T>>(url, body).pipe(
            map(response => this.handleResponse<T>(response)),
            catchError(error => throwError(() => error))
        );
    }

    /**
     * DELETE request
     */
    delete<T>(endpoint: string): Observable<T> {
        const url = `${this.baseUrl}${endpoint}`;

        return this.http.delete<ApiResponse<T>>(url).pipe(
            map(response => this.handleResponse<T>(response)),
            catchError(error => throwError(() => error))
        );
    }

    /**
     * Upload file with multipart/form-data
     */
    upload<T>(endpoint: string, formData: FormData): Observable<T> {
        const url = `${this.baseUrl}${endpoint}`;

        // Don't set Content-Type header, let browser set it with boundary
        return this.http.post<ApiResponse<T>>(url, formData).pipe(
            map(response => this.handleResponse<T>(response)),
            catchError(error => throwError(() => error))
        );
    }

    /**
     * Download file
     */
    download(endpoint: string, filename?: string): Observable<Blob> {
        const url = `${this.baseUrl}${endpoint}`;

        return this.http.get(url, {
            responseType: 'blob',
            observe: 'response'
        }).pipe(
            map(response => {
                // Get filename from Content-Disposition header if available
                const contentDisposition = response.headers.get('Content-Disposition');
                if (contentDisposition && !filename) {
                    const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
                    if (matches != null && matches[1]) {
                        filename = matches[1].replace(/['"]/g, '');
                    }
                }

                // Trigger download
                if (response.body) {
                    const blob = new Blob([response.body]);
                    const link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = filename || 'download';
                    link.click();
                    window.URL.revokeObjectURL(link.href);
                }

                return response.body!;
            }),
            catchError(error => throwError(() => error))
        );
    }

    /**
     * Build HTTP params from object
     */
    private buildParams(params?: any): HttpParams {
        let httpParams = new HttpParams();

        if (params) {
            Object.keys(params).forEach(key => {
                if (params[key] !== null && params[key] !== undefined) {
                    if (Array.isArray(params[key])) {
                        params[key].forEach((value: any) => {
                            httpParams = httpParams.append(`${key}[]`, value.toString());
                        });
                    } else {
                        httpParams = httpParams.append(key, params[key].toString());
                    }
                }
            });
        }

        return httpParams;
    }

    /**
     * Handle API response
     */
    private handleResponse<T>(response: ApiResponse<T>): T {
        if (response.success && response.data !== undefined) {
            return response.data;
        }

        // If response doesn't follow the standard format, return as is
        return response as any;
    }

    /**
     * Get full URL for an endpoint
     */
    getFullUrl(endpoint: string): string {
        return `${this.baseUrl}${endpoint}`;
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return this.secureStorage.hasItem('authToken');
    }

    /**
     * Set authentication token (stored securely)
     */
    setAuthToken(token: string): void {
        this.secureStorage.setItem('authToken', token);
    }

    /**
     * Get authentication token
     */
    getAuthToken(): string | null {
        return this.secureStorage.getItem('authToken');
    }

    /**
     * Clear authentication token
     */
    clearAuthToken(): void {
        this.secureStorage.removeItem('authToken');
    }

    /**
     * Set refresh token (if using refresh token pattern)
     */
    setRefreshToken(token: string): void {
        this.secureStorage.setItem('refreshToken', token);
    }

    /**
     * Get refresh token
     */
    getRefreshToken(): string | null {
        return this.secureStorage.getItem('refreshToken');
    }

    /**
     * Clear all auth data
     */
    clearAuthData(): void {
        this.secureStorage.removeItem('authToken');
        this.secureStorage.removeItem('refreshToken');
        this.secureStorage.removeItem('user_data');
    }
}

