import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
    ServiceSearchFilters,
    GetOrCreateConversationRequest,
    ArtisanSearchFilters
} from '../models/api.models';

@Injectable({
    providedIn: 'root'
})
export class UnifiedSearchService {
    private readonly endpoint = '/UnifiedSearch';

    constructor(private api: ApiService) { }

    searchArtisans(body: ArtisanSearchFilters, skip?: number, take?: number): Observable<any> {
        let url = `${this.endpoint}/SearchArtisans/artisans`;
        const params = [];
        if (skip !== undefined) params.push(`skip=${skip}`);
        if (take !== undefined) params.push(`take=${take}`);
        if (params.length) url += `?${params.join('&')}`;
        return this.api.post(url, body);
    }

    searchServices(body: ServiceSearchFilters, skip?: number, take?: number): Observable<any> {
        let url = `${this.endpoint}/SearchServices/services`;
        const params = [];
        if (skip !== undefined) params.push(`skip=${skip}`);
        if (take !== undefined) params.push(`take=${take}`);
        if (params.length) url += `?${params.join('&')}`;
        return this.api.post(url, body);
    }

    getOrCreateConversation(body: GetOrCreateConversationRequest): Observable<any> {
        return this.api.post(`${this.endpoint}/GetOrCreateConversation/conversation`, body);
    }

    getMapConfig(): Observable<any> {
        return this.api.get(`${this.endpoint}/GetMapConfig/map-config`);
    }
}
