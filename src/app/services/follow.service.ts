import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class FollowService {
    private readonly endpoint = '/Follow';

    constructor(private api: ApiService) { }

    follow(userId: string): Observable<any> {
        return this.api.post(`${this.endpoint}/Follow/${userId}`, {});
    }

    unfollow(userId: string): Observable<any> {
        return this.api.delete(`${this.endpoint}/Unfollow/${userId}`);
    }

    isFollowing(userId: string): Observable<any> {
        return this.api.get(`${this.endpoint}/IsFollowing/${userId}/status`);
    }

    getFollowStats(userId: string): Observable<any> {
        return this.api.get(`${this.endpoint}/GetFollowStats/${userId}/stats`);
    }
}
