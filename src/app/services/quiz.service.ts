import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { CreateQuizDto, SubmitQuizDto } from '../models/api.models';

@Injectable({
    providedIn: 'root'
})
export class QuizService {
    private readonly endpoint = '/Quiz';

    constructor(private api: ApiService) { }

    getQuizzes(videoId?: string): Observable<any> {
        return this.api.get(`${this.endpoint}/GetQuizzes`, { videoId });
    }

    getQuiz(id: string): Observable<any> {
        return this.api.get(`${this.endpoint}/GetQuiz/${id}`);
    }

    submitQuiz(id: string, body: SubmitQuizDto): Observable<any> {
        return this.api.post(`${this.endpoint}/SubmitQuiz/${id}/submit`, body);
    }

    getQuizResult(id: string, attemptId: string): Observable<any> {
        return this.api.get(`${this.endpoint}/GetQuizResult/${id}/result/${attemptId}`);
    }

    createQuiz(body: CreateQuizDto): Observable<any> {
        return this.api.post(`${this.endpoint}/CreateQuiz`, body);
    }
}
