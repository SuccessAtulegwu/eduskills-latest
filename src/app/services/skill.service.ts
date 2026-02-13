import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import {
    CreateSkillRequest,
    UpdateSkillRequest,
    SkillModel,
    RecommendationModel,
    skillResponseToModel,
    recommendationResponseToModel,
    ProficiencyLevel
} from '../models/model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SkillService {
    private apiUrl = environment.apiUrl;

    // State management for skills
    private skillsSubject = new BehaviorSubject<SkillModel[]>([]);
    public skills$ = this.skillsSubject.asObservable();

    constructor(private http: HttpClient) {
        // Load skills on service initialization
        this.loadMySkills();
    }

    // ==================== SKILL ENDPOINTS ====================

    /**
     * Get all skills for the current user
     * GET /api/v1/Skill/GetMySkills
     */
    getMySkills(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/Skill/GetMySkills`);
    }

    /**
     * Get all skills as models (UI-friendly)
     */
    getMySkillsAsModels(): Observable<SkillModel[]> {
        return this.getMySkills().pipe(
            map((responses: any) => {
                // Determine if response is wrapped
                let data = responses;
                if (responses && !Array.isArray(responses)) {
                    // Check common wrapper properties (including 'skills')
                    if (Array.isArray(responses.skills)) data = responses.skills;
                    else if (Array.isArray(responses.Skills)) data = responses.Skills;
                    else if (Array.isArray(responses.data)) data = responses.data;
                    else if (Array.isArray(responses.Data)) data = responses.Data;
                    else if (Array.isArray(responses.result)) data = responses.result;
                    else if (Array.isArray(responses.Result)) data = responses.Result;
                    else if (Array.isArray(responses.items)) data = responses.items;
                    else if (Array.isArray(responses.Items)) data = responses.Items;
                    else if (Array.isArray(responses.value)) data = responses.value;
                    else if (Array.isArray(responses.Value)) data = responses.Value;
                }

                if (!Array.isArray(data)) {
                    console.error('Expected array of skills but got:', responses);
                    console.error('Available keys:', responses ? Object.keys(responses) : 'null');
                    return [];
                }
                
                console.log(`✓ Loaded ${data.length} skills`);
                return data.map(response => skillResponseToModel(response));
            }),
            catchError(error => {
                console.error('Error fetching skills:', error);
                return of([]);
            })
        );
    }

    /**
     * Load skills and update state
     */
    loadMySkills(): void {
        this.getMySkillsAsModels().subscribe({
            next: (skills) => {
                this.skillsSubject.next(skills);
            },
            error: (error) => {
                console.error('Error loading skills:', error);
                this.skillsSubject.next([]);
            }
        });
    }

    /**
     * Create a new skill
     * POST /api/v1/Skill/CreateSkill
     */
    createSkill(skillData: CreateSkillRequest): Observable<void> {
        const payload = {
            skillName: skillData.skillName,
            category: skillData.category,
            proficiencyLevel: skillData.proficiencyLevel,
            level: skillData.level,
            notes: skillData.notes || ''
        };
        
        return this.http.post<void>(
            `${this.apiUrl}/Skill/CreateSkill`,
            payload
        ).pipe(
            tap(() => this.loadMySkills())
        );
    }

    /**
     * Update an existing skill
     * PUT /api/v1/Skill/UpdateSkill/{id}
     */
    updateSkill(id: number, skillData: UpdateSkillRequest): Observable<void> {
        const payload: any = {};
        if (skillData.skillName !== undefined) payload.skillName = skillData.skillName;
        if (skillData.category !== undefined) payload.category = skillData.category;
        if (skillData.proficiencyLevel !== undefined) payload.proficiencyLevel = skillData.proficiencyLevel;
        if (skillData.level !== undefined) payload.level = skillData.level;
        if (skillData.notes !== undefined) payload.notes = skillData.notes || '';
        
        return this.http.put<void>(
            `${this.apiUrl}/Skill/UpdateSkill/${id}`,
            payload
        ).pipe(
            tap(() => this.loadMySkills())
        );
    }

    /**
     * Delete a skill
     * DELETE /api/v1/Skill/DeleteSkill/{id}
     */
    deleteSkill(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/Skill/DeleteSkill/${id}`).pipe(
            tap(() => {
                // Reload skills after deletion
                this.loadMySkills();
            })
        );
    }

    // ==================== RECOMMENDATION ENDPOINTS ====================

    /**
     * Get personalized recommendations
     * GET /api/v1/Skill/GetRecommendations/recommendations
     */
    getRecommendations(topK: number = 20): Observable<RecommendationModel[]> {
        const params = new HttpParams().set('topK', topK.toString());
        return this.http.get<any>(
            `${this.apiUrl}/Skill/GetRecommendations/recommendations`,
            { params }
        ).pipe(
            map((responses: any) => {
                // Handle different response formats
                let data = responses;
                if (responses && !Array.isArray(responses)) {
                    // Check common wrapper properties (including 'recommendations')
                    if (Array.isArray(responses.recommendations)) data = responses.recommendations;
                    else if (Array.isArray(responses.Recommendations)) data = responses.Recommendations;
                    else if (Array.isArray(responses.data)) data = responses.data;
                    else if (Array.isArray(responses.Data)) data = responses.Data;
                    else if (Array.isArray(responses.result)) data = responses.result;
                    else if (Array.isArray(responses.Result)) data = responses.Result;
                    else if (Array.isArray(responses.items)) data = responses.items;
                    else if (Array.isArray(responses.Items)) data = responses.Items;
                    else if (Array.isArray(responses.value)) data = responses.value;
                    else if (Array.isArray(responses.Value)) data = responses.Value;
                }

                if (!Array.isArray(data)) {
                    console.error('Expected array of recommendations but got:', responses);
                    console.error('Available keys:', responses ? Object.keys(responses) : 'null');
                    return [];
                }

                return data.map(response => recommendationResponseToModel(response));
            }),
            catchError(error => {
                console.error('Error fetching recommendations:', error);
                return of([]);
            })
        );
    }

}
