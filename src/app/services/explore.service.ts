import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class ExploreService {
    private readonly endpoint = '/Explore';

    constructor(private api: ApiService) { }

    getVideos(query?: { category?: string; sortBy?: string }): Observable<any> {
        return this.api.get(`${this.endpoint}/GetVideos`, query);
    }

    getFollowingVideos(): Observable<any> {
        return this.api.get(`${this.endpoint}/GetFollowingVideos/following`);
    }
}
