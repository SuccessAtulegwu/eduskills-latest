import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
    CreateSkillDto,
    UpdateSkillDto,
    SetLearningStyleDto
} from '../models/api.models';

@Injectable({
    providedIn: 'root'
})
export class SkillService {
    private readonly endpoint = '/Skill';

    constructor(private api: ApiService) { }

    getMySkills(): Observable<any> {
        return this.api.get(`${this.endpoint}/GetMySkills`);
    }

    createSkill(body: CreateSkillDto): Observable<any> {
        return this.api.post(`${this.endpoint}/CreateSkill`, body);
    }

    updateSkill(id: string, body: UpdateSkillDto): Observable<any> {
        return this.api.put(`${this.endpoint}/UpdateSkill/${id}`, body);
    }

    deleteSkill(id: string): Observable<any> {
        return this.api.delete(`${this.endpoint}/DeleteSkill/${id}`);
    }

    detectLearningStyle(): Observable<any> {
        return this.api.post(`${this.endpoint}/DetectLearningStyle/detect-learning-style`, {});
    }

    setLearningStyle(body: SetLearningStyleDto): Observable<any> {
        return this.api.post(`${this.endpoint}/SetLearningStyle/set-learning-style`, body);
    }

    getRecommendations(topK?: number): Observable<any> {
        return this.api.get(`${this.endpoint}/GetRecommendations/recommendations`, { topK });
    }
}
