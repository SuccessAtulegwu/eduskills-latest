/**
 * Skill API Models and Interfaces
 * Based on API endpoints: /api/v1/Skill
 */

/**
 * Proficiency Level Enum
 */
export enum ProficiencyLevel {
    Beginner = 0,
    Intermediate = 1,
    Advanced = 2,
    Expert = 3
}

/**
 * API Request Interface for Creating a Skill
 * POST /api/v1/Skill/CreateSkill
 */
export interface CreateSkillRequest {
    skillName: string;
    category: string;
    proficiencyLevel: ProficiencyLevel;
    level: string;
    notes?: string;
}

/**
 * API Request Interface for Updating a Skill
 * PUT /api/v1/Skill/UpdateSkill/{id}
 */
export interface UpdateSkillRequest {
    skillName?: string;
    category?: string;
    proficiencyLevel?: ProficiencyLevel;
    level?: string;
    notes?: string;
}

/**
 * API Request Interface for Setting Learning Style
 * POST /api/v1/Skill/SetLearningStyle/set-learning-style
 */
export interface SetLearningStyleRequest {
    learningStyle: string;
}

/**
 * Skill Response Interface
 * GET /api/v1/Skill/GetMySkills
 */
export interface SkillResponse {
    id: number;
    userId: string;
    skillName: string;
    category: string;
    proficiencyLevel: ProficiencyLevel;
    level: string;
    notes?: string;
    createdAt: string;
    updatedAt?: string;
}

/**
 * Learning Style Response Interface
 * POST /api/v1/Skill/DetectLearningStyle/detect-learning-style
 */
export interface LearningStyleResponse {
    learningStyle: string;
    confidence?: number;
    description?: string;
}

/**
 * Recommendation Response Interface
 * GET /api/v1/Skill/GetRecommendations/recommendations
 */
export interface RecommendationResponse {
    id: number;
    title: string;
    description: string;
    category: string;
    type: string; // 'course', 'video', 'article', etc.
    relevanceScore: number;
    url?: string;
    thumbnailUrl?: string;
}

/**
 * Display Model for Skill (UI compatibility)
 */
export interface SkillModel {
    id: number;
    skillName: string;
    category: string;
    proficiencyLevel: string;
    proficiencyLevelEnum: ProficiencyLevel;
    level: string;
    notes?: string;
    thumbnailUrl?: string;
    createdAt: Date;
    updatedAt?: Date;
    proficiencyClass: string;
    proficiencyIcon: string;
}

/**
 * Display Model for Recommendation (UI compatibility)
 */
export interface RecommendationModel {
    id: number;
    title: string;
    description: string;
    category: string;
    type: string;
    relevanceScore: number;
    url?: string;
    thumbnailUrl: string;
    relevancePercentage: number;
}

/**
 * Helper function to convert ProficiencyLevel enum to display string
 */
export function proficiencyLevelToString(level: ProficiencyLevel): string {
    switch (level) {
        case ProficiencyLevel.Beginner:
            return 'Beginner';
        case ProficiencyLevel.Intermediate:
            return 'Intermediate';
        case ProficiencyLevel.Advanced:
            return 'Advanced';
        case ProficiencyLevel.Expert:
            return 'Expert';
        default:
            return 'Beginner';
    }
}

/**
 * Helper function to get proficiency CSS class
 */
export function getProficiencyClass(level: ProficiencyLevel): string {
    switch (level) {
        case ProficiencyLevel.Beginner:
            return 'proficiency-beginner';
        case ProficiencyLevel.Intermediate:
            return 'proficiency-intermediate';
        case ProficiencyLevel.Advanced:
            return 'proficiency-advanced';
        case ProficiencyLevel.Expert:
            return 'proficiency-expert';
        default:
            return 'proficiency-beginner';
    }
}

/**
 * Helper function to get proficiency icon
 */
export function getProficiencyIcon(level: ProficiencyLevel): string {
    switch (level) {
        case ProficiencyLevel.Beginner:
            return 'bi-star';
        case ProficiencyLevel.Intermediate:
            return 'bi-star-half';
        case ProficiencyLevel.Advanced:
            return 'bi-star-fill';
        case ProficiencyLevel.Expert:
            return 'bi-trophy-fill';
        default:
            return 'bi-star';
    }
}

/**
 * Helper function to convert SkillResponse to SkillModel
 */
export function skillResponseToModel(response: any): SkillModel {
    if (!response) {
        console.error('skillResponseToModel received null/undefined response');
        throw new Error('Invalid response: response is null or undefined');
    }

    // Handle potential PascalCase from API - check all variations
    const id = response.id ?? response.Id ?? response.ID ?? 0;
    const skillName = response.skillName ?? response.SkillName ?? response.name ?? response.Name ?? 'Unknown';
    const category = response.category ?? response.Category ?? 'Uncategorized';
    const proficiencyLevel = response.proficiencyLevel ?? response.ProficiencyLevel ?? 0;
    const level = response.level ?? response.Level ?? 'Beginner';
    const notes = response.notes ?? response.Notes ?? '';
    const thumbnailUrl = response.thumbnailUrl ?? response.ThumbnailUrl ?? response.thumbnail ?? response.Thumbnail;
    const createdAt = response.createdAt ?? response.CreatedAt ?? response.dateCreated ?? response.DateCreated ?? new Date().toISOString();
    const updatedAt = response.updatedAt ?? response.UpdatedAt ?? response.dateUpdated ?? response.DateUpdated;

    return {
        id: id,
        skillName: skillName,
        category: category,
        proficiencyLevel: proficiencyLevelToString(proficiencyLevel),
        proficiencyLevelEnum: proficiencyLevel,
        level: level,
        notes: notes,
        thumbnailUrl: thumbnailUrl,
        createdAt: new Date(createdAt),
        updatedAt: updatedAt ? new Date(updatedAt) : undefined,
        proficiencyClass: getProficiencyClass(proficiencyLevel),
        proficiencyIcon: getProficiencyIcon(proficiencyLevel)
    };
}

/**
 * Helper function to convert RecommendationResponse to RecommendationModel
 */
export function recommendationResponseToModel(response: any): RecommendationModel {
    // Handle potential PascalCase from API
    const id = response.id || response.Id;
    const title = response.title || response.Title;
    const description = response.description || response.Description;
    const category = response.category || response.Category;
    const type = response.type || response.Type;
    const relevanceScore = response.relevanceScore !== undefined ? response.relevanceScore : response.RelevanceScore;
    const url = response.url || response.Url;
    const thumbnailUrl = response.thumbnailUrl || response.ThumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=400';

    return {
        id: id,
        title: title,
        description: description,
        category: category,
        type: type,
        relevanceScore: relevanceScore,
        url: url,
        thumbnailUrl: thumbnailUrl,
        relevancePercentage: Math.round((relevanceScore || 0) * 100)
    };
}
