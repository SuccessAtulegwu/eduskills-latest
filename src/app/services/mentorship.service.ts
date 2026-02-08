import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
    RequestMentorshipDto,
    AcceptMentorshipDto,
    RejectMentorshipDto,
    CreateSessionDto,
    UpdateSessionDto,
    CompleteSessionDto
} from '../models/api.models';

@Injectable({
    providedIn: 'root'
})
export class MentorshipService {
    private readonly endpoint = '/Mentorship';

    constructor(private api: ApiService) { }

    getMyMentorships(): Observable<any> {
        return this.api.get(`${this.endpoint}/GetMyMentorships`);
    }

    findMentors(query?: { areaOfFocus?: string }): Observable<any> {
        return this.api.get(`${this.endpoint}/FindMentors/find-mentors`, query);
    }

    requestMentorship(mentorId: string, body: RequestMentorshipDto): Observable<any> {
        return this.api.post(`${this.endpoint}/RequestMentorship/request/${mentorId}`, body);
    }

    acceptRequest(id: string, body: AcceptMentorshipDto): Observable<any> {
        return this.api.post(`${this.endpoint}/AcceptRequest/${id}/accept`, body);
    }

    rejectRequest(id: string, body: RejectMentorshipDto): Observable<any> {
        return this.api.post(`${this.endpoint}/RejectRequest/${id}/reject`, body);
    }

    getMentorship(id: string): Observable<any> {
        return this.api.get(`${this.endpoint}/GetMentorship/${id}`);
    }

    completeMentorship(id: string): Observable<any> {
        return this.api.post(`${this.endpoint}/CompleteMentorship/${id}/complete`, {});
    }

    cancelMentorship(id: string): Observable<any> {
        return this.api.post(`${this.endpoint}/CancelMentorship/${id}/cancel`, {});
    }

    createSession(mentorshipId: string, body: CreateSessionDto): Observable<any> {
        return this.api.post(`${this.endpoint}/CreateSession/${mentorshipId}/sessions`, body);
    }

    getSession(id: string): Observable<any> {
        return this.api.get(`${this.endpoint}/GetSession/sessions/${id}`);
    }

    updateSession(id: string, body: UpdateSessionDto): Observable<any> {
        return this.api.put(`${this.endpoint}/UpdateSession/sessions/${id}`, body);
    }

    startSession(id: string): Observable<any> {
        return this.api.post(`${this.endpoint}/StartSession/sessions/${id}/start`, {});
    }

    completeSession(id: string, body: CompleteSessionDto): Observable<any> {
        return this.api.post(`${this.endpoint}/CompleteSession/sessions/${id}/complete`, body);
    }

    cancelSession(id: string): Observable<any> {
        return this.api.post(`${this.endpoint}/CancelSession/sessions/${id}/cancel`, {});
    }
}
