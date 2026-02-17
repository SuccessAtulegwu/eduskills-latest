/**
 * Learning Path Service
 * Handles learning path and progress API operations
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import {
  LearningPathResponse,
  LearningPathProgressResponse,
  CreateLearningPathRequest,
  UpdateLearningPathRequest,
  LearningPathModel,
  LearningPathProgressModel,
  learningPathResponseToModel,
  learningPathProgressResponseToModel,
  ClassLevel,
  ExamType
} from '../models/model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LearningPathService {
  private apiUrl = environment.apiUrl;

  // State management for learning paths
  private learningPathsSubject = new BehaviorSubject<LearningPathModel[]>([]);
  public learningPaths$ = this.learningPathsSubject.asObservable();

  // State management for user progress
  private myProgressSubject = new BehaviorSubject<LearningPathProgressModel[]>([]);
  public myProgress$ = this.myProgressSubject.asObservable();

  // State management for current learning path
  private currentPathSubject = new BehaviorSubject<LearningPathModel | null>(null);
  public currentPath$ = this.currentPathSubject.asObservable();

  constructor(private http: HttpClient) {
    // Load learning paths on service initialization
    this.loadLearningPaths();
  }

  // ==================== LEARNING PATH ENDPOINTS ====================

  /**
   * Get all learning paths
   * GET /api/v1/LearningPath/GetLearningPaths
   */
  getLearningPaths(): Observable<LearningPathResponse[]> {
    return this.http.get<LearningPathResponse[]>(`${this.apiUrl}/LearningPath/GetLearningPaths`);
  }

  /**
   * Get all learning paths as models (UI-friendly)
   */
  getLearningPathsAsModels(): Observable<LearningPathModel[]> {
    return this.getLearningPaths().pipe(
      map((response: any) => {
        // Handle different response formats
        let items: any[] = [];
        if (Array.isArray(response)) {
          items = response;
        } else if (response?.data && Array.isArray(response.data)) {
          items = response.data;
        } else if (response?.learningPaths && Array.isArray(response.learningPaths)) {
          items = response.learningPaths;
        } else if (response?.items && Array.isArray(response.items)) {
          items = response.items;
        }
        return items.map(item => learningPathResponseToModel(item));
      }),
      tap(paths => {
        // Update state
        this.learningPathsSubject.next(paths);
      }),
      catchError(error => {
        console.error('Error fetching learning paths:', error);
        return of([]);
      })
    );
  }

  /**
   * Load learning paths and update state
   */
  loadLearningPaths(): void {
    this.getLearningPathsAsModels().subscribe({
      next: (paths) => {
        this.learningPathsSubject.next(paths);
      },
      error: (error) => {
        console.error('Error loading learning paths:', error);
        this.learningPathsSubject.next([]);
      }
    });
  }

  /**
   * Get single learning path by ID
   * GET /api/v1/LearningPath/GetLearningPath/{id}
   */
  getLearningPath(id: number): Observable<LearningPathResponse> {
    return this.http.get<LearningPathResponse>(`${this.apiUrl}/LearningPath/GetLearningPath/${id}`);
  }

  /**
   * Get single learning path as model
   */
  getLearningPathAsModel(id: number): Observable<LearningPathModel> {
    return this.getLearningPath(id).pipe(
      map(response => learningPathResponseToModel(response)),
      tap(path => {
        // Update current path state
        this.currentPathSubject.next(path);
      }),
      catchError(error => {
        console.error('Error fetching learning path:', error);
        throw error;
      })
    );
  }

  /**
   * Create a new learning path (Admin only)
   * POST /api/v1/LearningPath/CreateLearningPath
   */
  createLearningPath(data: CreateLearningPathRequest): Observable<LearningPathResponse> {
    return this.http.post<LearningPathResponse>(
      `${this.apiUrl}/LearningPath/CreateLearningPath`,
      data
    );
  }

  /**
   * Create learning path as model
   */
  createLearningPathAsModel(data: CreateLearningPathRequest): Observable<LearningPathModel> {
    return this.createLearningPath(data).pipe(
      map(response => learningPathResponseToModel(response)),
      tap(() => {
        // Reload learning paths after creation
        this.loadLearningPaths();
      }),
      catchError(error => {
        console.error('Error creating learning path:', error);
        throw error;
      })
    );
  }

  /**
   * Update a learning path (Admin only)
   * PUT /api/v1/LearningPath/UpdateLearningPath/{id}
   */
  updateLearningPath(id: number, data: UpdateLearningPathRequest): Observable<LearningPathResponse> {
    return this.http.put<LearningPathResponse>(
      `${this.apiUrl}/LearningPath/UpdateLearningPath/${id}`,
      data
    );
  }

  /**
   * Update learning path as model
   */
  updateLearningPathAsModel(id: number, data: UpdateLearningPathRequest): Observable<LearningPathModel> {
    return this.updateLearningPath(id, data).pipe(
      map(response => learningPathResponseToModel(response)),
      tap(() => {
        // Reload learning paths after update
        this.loadLearningPaths();
      }),
      catchError(error => {
        console.error('Error updating learning path:', error);
        throw error;
      })
    );
  }

  /**
   * Delete a learning path (Admin only)
   * DELETE /api/v1/LearningPath/DeleteLearningPath/{id}
   */
  deleteLearningPath(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/LearningPath/DeleteLearningPath/${id}`).pipe(
      tap(() => {
        // Reload learning paths after deletion
        this.loadLearningPaths();
      }),
      catchError(error => {
        console.error('Error deleting learning path:', error);
        throw error;
      })
    );
  }

  // ==================== PROGRESS & ENROLLMENT ENDPOINTS ====================

  /**
   * Start a learning path
   * POST /api/v1/LearningPath/StartLearningPath/{id}/start
   */
  startLearningPath(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/LearningPath/StartLearningPath/${id}/start`, {}).pipe(
      tap(() => {
        // Reload learning paths and progress after starting
        this.loadLearningPaths();
        this.loadMyProgress();
      }),
      catchError(error => {
        console.error('Error starting learning path:', error);
        throw error;
      })
    );
  }

  /**
   * Complete a step in a learning path
   * POST /api/v1/LearningPath/CompleteStep/{id}/steps/{stepId}/complete
   */
  completeStep(learningPathId: number, stepId: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/LearningPath/CompleteStep/${learningPathId}/steps/${stepId}/complete`,
      {}
    ).pipe(
      tap(() => {
        // Reload learning paths and progress after completing step
        this.loadLearningPaths();
        this.loadMyProgress();
        
        // Update current path if it's the one being modified
        const currentPath = this.currentPathSubject.value;
        if (currentPath && currentPath.id === learningPathId) {
          this.getLearningPathAsModel(learningPathId).subscribe();
        }
      }),
      catchError(error => {
        console.error('Error completing step:', error);
        throw error;
      })
    );
  }

  /**
   * Get user's progress on all learning paths
   * GET /api/v1/LearningPath/GetMyProgress/my-progress
   */
  getMyProgress(): Observable<LearningPathProgressResponse[]> {
    return this.http.get<LearningPathProgressResponse[]>(
      `${this.apiUrl}/LearningPath/GetMyProgress/my-progress`
    );
  }

  /**
   * Get user's progress as models
   */
  getMyProgressAsModels(): Observable<LearningPathProgressModel[]> {
    return this.getMyProgress().pipe(
      map((response: any) => {
        // Handle different response formats
        let items: any[] = [];
        if (Array.isArray(response)) {
          items = response;
        } else if (response?.data && Array.isArray(response.data)) {
          items = response.data;
        } else if (response?.progress && Array.isArray(response.progress)) {
          items = response.progress;
        } else if (response?.items && Array.isArray(response.items)) {
          items = response.items;
        }
        return items.map(item => learningPathProgressResponseToModel(item));
      }),
      tap(progress => {
        // Update state
        this.myProgressSubject.next(progress);
      }),
      catchError(error => {
        console.error('Error fetching user progress:', error);
        return of([]);
      })
    );
  }

  /**
   * Load user progress and update state
   */
  loadMyProgress(): void {
    this.getMyProgressAsModels().subscribe({
      next: (progress) => {
        this.myProgressSubject.next(progress);
      },
      error: (error) => {
        console.error('Error loading user progress:', error);
        this.myProgressSubject.next([]);
      }
    });
  }

  // ==================== HELPER METHODS ====================

  /**
   * Get learning paths by class level
   */
  getLearningPathsByClassLevel(classLevel: ClassLevel): LearningPathModel[] {
    const paths = this.learningPathsSubject.value;
    return paths.filter(path => path.classLevelEnum === classLevel);
  }

  /**
   * Get learning paths by exam type
   */
  getLearningPathsByExamType(examType: ExamType): LearningPathModel[] {
    const paths = this.learningPathsSubject.value;
    return paths.filter(path => path.examTypeEnum === examType);
  }

  /**
   * Get learning paths by subject
   */
  getLearningPathsBySubject(subject: string): LearningPathModel[] {
    const paths = this.learningPathsSubject.value;
    return paths.filter(path => 
      path.subject.toLowerCase() === subject.toLowerCase()
    );
  }

  /**
   * Search learning paths by keyword
   */
  searchLearningPaths(keyword: string): LearningPathModel[] {
    const paths = this.learningPathsSubject.value;
    const query = keyword.toLowerCase();
    return paths.filter(path =>
      path.title.toLowerCase().includes(query) ||
      path.description.toLowerCase().includes(query) ||
      path.subject.toLowerCase().includes(query)
    );
  }

  /**
   * Get in-progress learning paths
   */
  getInProgressPaths(): LearningPathModel[] {
    const paths = this.learningPathsSubject.value;
    return paths.filter(path => 
      path.isStarted && !path.isCompleted
    );
  }

  /**
   * Get completed learning paths
   */
  getCompletedPaths(): LearningPathModel[] {
    const paths = this.learningPathsSubject.value;
    return paths.filter(path => path.isCompleted);
  }

  /**
   * Get not started learning paths
   */
  getNotStartedPaths(): LearningPathModel[] {
    const paths = this.learningPathsSubject.value;
    return paths.filter(path => !path.isStarted);
  }

 

  /**
   * Check if user has started a learning path
   */
  hasStartedPath(pathId: number): boolean {
    const paths = this.learningPathsSubject.value;
    const path = paths.find(p => p.id === pathId);
    return path?.isStarted ?? false;
  }

  /**
   * Get progress for specific learning path
   */
  getProgressForPath(pathId: number): LearningPathProgressModel | undefined {
    const progress = this.myProgressSubject.value;
    return progress.find(p => p.learningPathId === pathId);
  }

  /**
   * Clear current path
   */
  clearCurrentPath(): void {
    this.currentPathSubject.next(null);
  }
}
