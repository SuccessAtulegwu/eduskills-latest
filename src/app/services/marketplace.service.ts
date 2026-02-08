import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
    MarketplaceListingCreateDto,
    MarketplaceSubscriptionCreateDto,
    MarketplaceReviewCreateDto
} from '../models/api.models';

@Injectable({
    providedIn: 'root'
})
export class MarketplaceService {
    private readonly endpoint = '/Marketplace';

    constructor(private api: ApiService) { }

    getListings(): Observable<any> {
        return this.api.get(`${this.endpoint}/GetListings`);
    }

    getListing(id: string): Observable<any> {
        return this.api.get(`${this.endpoint}/GetListing/${id}`);
    }

    createListing(body: MarketplaceListingCreateDto): Observable<any> {
        return this.api.post(`${this.endpoint}/CreateListing`, body);
    }

    deleteListing(id: string): Observable<any> {
        return this.api.delete(`${this.endpoint}/DeleteListing/${id}`);
    }

    subscribe(listingId: string, body: MarketplaceSubscriptionCreateDto): Observable<any> {
        return this.api.post(`${this.endpoint}/Subscribe/${listingId}/subscribe`, body);
    }

    getSubscription(id: string): Observable<any> {
        return this.api.get(`${this.endpoint}/GetSubscription/subscriptions/${id}`);
    }

    getMySubscriptions(): Observable<any> {
        return this.api.get(`${this.endpoint}/GetMySubscriptions/my-subscriptions`);
    }

    getSubscribers(listingId: string): Observable<any> {
        return this.api.get(`${this.endpoint}/GetSubscribers/${listingId}/subscribers`);
    }

    submitReview(listingId: string, body: MarketplaceReviewCreateDto): Observable<any> {
        return this.api.post(`${this.endpoint}/SubmitReview/${listingId}/review`, body);
    }

    getReview(id: string): Observable<any> {
        return this.api.get(`${this.endpoint}/GetReview/reviews/${id}`);
    }

    getReviews(listingId: string): Observable<any> {
        return this.api.get(`${this.endpoint}/GetReviews/${listingId}/reviews`);
    }

    deleteReview(id: string): Observable<any> {
        return this.api.delete(`${this.endpoint}/DeleteReview/reviews/${id}`);
    }
}
