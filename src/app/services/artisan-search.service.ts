import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
    ArtisanSearchFilters,
    NearbySearchModel
} from '../models/api.models';

@Injectable({
    providedIn: 'root'
})
export class ArtisanSearchService {
    private readonly endpoint = '/ArtisanSearch';

    constructor(private api: ApiService) { }

    search(body: ArtisanSearchFilters, query?: { skip?: number; take?: number }): Observable<any> {
        // The spec says POST /Search/search with query params AND body.
        // ApiService.post signature is (endpoint, body). It doesn't take query params in post helper.
        // I need to construct the URL with query params manually or update ApiService.
        // I'll manually append query params.
        let url = `${this.endpoint}/Search/search`;
        if (query) {
            const queryString = Object.keys(query).map(key => `${key}=${(query as any)[key]}`).join('&');
            url += `?${queryString}`;
        }
        return this.api.post(url, body);
    }

    findNearby(body: NearbySearchModel): Observable<any> {
        return this.api.post(`${this.endpoint}/FindNearby/nearby`, body);
    }

    getArtisanDetails(artisanId: string): Observable<any> {
        return this.api.get(`${this.endpoint}/GetArtisanDetails/${artisanId}`);
    }
}
