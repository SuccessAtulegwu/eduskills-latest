import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { CommentCreateDto } from '../models/api.models';

@Injectable({
    providedIn: 'root'
})
export class CommentsService {
    private readonly endpoint = '/Comments';

    constructor(private api: ApiService) { }

    getComments(videoId: string): Observable<any> {
        return this.api.get(`${this.endpoint}/GetComments/video/${videoId}`);
    }

    addComment(videoId: string, body: CommentCreateDto): Observable<any> {
        return this.api.post(`${this.endpoint}/AddComment/video/${videoId}`, body);
    }

    deleteComment(id: string): Observable<any> {
        return this.api.delete(`${this.endpoint}/DeleteComment/${id}`);
    }
}
