import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    private readonly endpoint = '/Chat';

    constructor(private api: ApiService) { }

    getMessages(bookingId: string): Observable<any> {
        return this.api.get(`${this.endpoint}/GetMessages/booking/${bookingId}/messages`);
    }

    markAsRead(bookingId: string): Observable<any> {
        return this.api.post(`${this.endpoint}/MarkAsRead/booking/${bookingId}/mark-read`, {});
    }

    getBookingDetails(bookingId: string): Observable<any> {
        return this.api.get(`${this.endpoint}/GetBookingDetails/booking/${bookingId}/details`);
    }
}
