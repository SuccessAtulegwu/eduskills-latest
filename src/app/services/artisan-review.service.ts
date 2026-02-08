import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
    CreateReviewDto,
    UpdateReviewDto
} from '../models/api.models';

@Injectable({
    providedIn: 'root'
})
export class ArtisanReviewService {
    private readonly endpoint = '/ArtisanReview';

    constructor(private api: ApiService) { }

    getReviews(artisanId: string, query?: { skip?: number; take?: number }): Observable<any> {
        return this.api.get(`${this.endpoint}/GetReviews/artisan/${artisanId}`, query);
    }

    createReview(bookingId: string, body: CreateReviewDto): Observable<any> {
        return this.api.post(`${this.endpoint}/CreateReview/booking/${bookingId}`, body);
    }

    updateReview(reviewId: string, body: UpdateReviewDto): Observable<any> {
        return this.api.put(`${this.endpoint}/UpdateReview/${reviewId}`, body);
    }

    getReviewStats(artisanId: string): Observable<any> {
        return this.api.get(`${this.endpoint}/GetReviewStats/stats/${artisanId}`);
    }
}
