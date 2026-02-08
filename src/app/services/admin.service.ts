import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
    RejectVideoDto,
    AssignRoleDto
} from '../models/api.models';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private readonly endpoint = '/Admin';

    constructor(private api: ApiService) { }

    getDashboard(): Observable<any> {
        return this.api.get(`${this.endpoint}/dashboard`);
    }

    getVideos(query?: { status?: string; page?: number; pageSize?: number }): Observable<any> {
        return this.api.get(`${this.endpoint}/videos`, query);
    }

    approveVideo(id: string): Observable<any> {
        return this.api.post(`${this.endpoint}/videos/${id}/approve`, {});
    }

    rejectVideo(id: string, body: RejectVideoDto): Observable<any> {
        return this.api.post(`${this.endpoint}/videos/${id}/reject`, body);
    }

    deleteVideo(id: string): Observable<any> {
        return this.api.delete(`${this.endpoint}/videos/${id}`);
    }

    getUsers(query?: { page?: number; pageSize?: number }): Observable<any> {
        return this.api.get(`${this.endpoint}/users`, query);
    }

    toggleUserStatus(userId: string): Observable<any> {
        return this.api.post(`${this.endpoint}/users/${userId}/toggle-status`, {});
    }

    assignRole(userId: string, body: AssignRoleDto): Observable<any> {
        return this.api.post(`${this.endpoint}/users/${userId}/assign-role`, body);
    }

    getComments(query?: { page?: number; pageSize?: number }): Observable<any> {
        return this.api.get(`${this.endpoint}/comments`, query);
    }

    deleteComment(id: string): Observable<any> {
        return this.api.delete(`${this.endpoint}/comments/${id}`);
    }

    getAuditLogs(query?: { page?: number; pageSize?: number }): Observable<any> {
        return this.api.get(`${this.endpoint}/audit-logs`, query);
    }
}
