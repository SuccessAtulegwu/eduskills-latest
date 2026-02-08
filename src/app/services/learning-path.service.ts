import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
    CreateLearningPathDto,
    UpdateLearningPathDto
} from '../models/api.models';

@Injectable({
    providedIn: 'root'
})
export class LearningPathService {
    private readonly endpoint = '/LearningPath';

    constructor(private api: ApiService) { }

    getLearningPaths(query?: {
        classLevel?: string;
        examType?: string;
        subject?: string;
    }): Observable<any> {
        return this.api.get(`${this.endpoint}/GetLearningPaths`, query);
    }

    getLearningPath(id: string): Observable<any> {
        return this.api.get(`${this.endpoint}/GetLearningPath/${id}`);
    }

    startLearningPath(id: string): Observable<any> {
        return this.api.post(`${this.endpoint}/StartLearningPath/${id}/start`, {});
    }

    completeStep(id: string, stepId: string): Observable<any> {
        return this.api.post(`${this.endpoint}/CompleteStep/${id}/steps/${stepId}/complete`, {});
    }

    getMyProgress(): Observable<any> {
        return this.api.get(`${this.endpoint}/GetMyProgress/my-progress`);
    }

    createLearningPath(body: CreateLearningPathDto): Observable<any> {
        return this.api.post(`${this.endpoint}/CreateLearningPath`, body);
    }

    updateLearningPath(id: string, body: UpdateLearningPathDto): Observable<any> {
        return this.api.put(`${this.endpoint}/UpdateLearningPath/${id}`, body);
    }

    deleteLearningPath(id: string): Observable<any> {
        return this.api.delete(`${this.endpoint}/DeleteLearningPath/${id}`);
    }
}
