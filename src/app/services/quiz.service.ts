/**
 * Quiz Service
 * Handles quiz and quiz result API operations
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import {
    QuizResponse,
    QuizResultResponse,
    SubmitQuizRequest,
    CreateQuizRequest,
    QuizModel,
    QuizResultModel,
    quizResponseToModel,
    quizResultResponseToModel
} from '../models/model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class QuizService {
    private apiUrl = environment.apiUrl;

    // State management for quizzes
    private quizzesSubject = new BehaviorSubject<QuizModel[]>([]);
    public quizzes$ = this.quizzesSubject.asObservable();

    // State management for current quiz
    private currentQuizSubject = new BehaviorSubject<QuizModel | null>(null);
    public currentQuiz$ = this.currentQuizSubject.asObservable();

    // State management for quiz results
    private currentResultSubject = new BehaviorSubject<QuizResultModel | null>(null);
    public currentResult$ = this.currentResultSubject.asObservable();

    constructor(private http: HttpClient) {
        // Load quizzes on service initialization
        this.loadQuizzes();
    }

    // ==================== QUIZ ENDPOINTS ====================

    /**
     * Get all quizzes
     * GET /api/v1/Quiz/GetQuizzes
     */
    getQuizzes(): Observable<QuizResponse[]> {
        return this.http.get<QuizResponse[]>(`${this.apiUrl}/Quiz/GetQuizzes`);
    }

    /**
     * Get all quizzes as models (UI-friendly)
     */
    getQuizzesAsModels(): Observable<QuizModel[]> {
        return this.getQuizzes().pipe(
            map(responses => {
                // Handle both array and single object responses
                const responseArray = Array.isArray(responses) ? responses : [responses];
                return responseArray.map(response => quizResponseToModel(response));
            }),
            catchError(error => {
                console.error('Error fetching quizzes:', error);
                return of([]);
            })
        );
    }

    /**
     * Load quizzes and update state
     */
    loadQuizzes(): void {
        this.getQuizzesAsModels().subscribe({
            next: (quizzes) => {
                this.quizzesSubject.next(quizzes);
            },
            error: (error) => {
                console.error('Error loading quizzes:', error);
                this.quizzesSubject.next([]);
            }
        });
    }

    /**
     * Get a single quiz by ID
     * GET /api/v1/Quiz/GetQuiz/{id}
     */
    getQuizById(id: number): Observable<QuizResponse> {
        return this.http.get<QuizResponse>(`${this.apiUrl}/Quiz/GetQuiz/${id}`);
    }

    /**
     * Get quiz by ID as model
     */
    getQuizByIdAsModel(id: number): Observable<QuizModel> {
        return this.getQuizById(id).pipe(
            map(response => quizResponseToModel(response)),
            tap(quiz => {
                // Update current quiz state
                this.currentQuizSubject.next(quiz);
            })
        );
    }

    /**
     * Create a new quiz
     * POST /api/v1/Quiz/CreateQuiz
     */
    createQuiz(quizData: CreateQuizRequest): Observable<QuizResponse> {
        return this.http.post<QuizResponse>(
            `${this.apiUrl}/Quiz/CreateQuiz`,
            quizData
        );
    }

    /**
     * Create quiz as model
     */
    createQuizAsModel(quizData: CreateQuizRequest): Observable<QuizModel> {
        return this.createQuiz(quizData).pipe(
            tap(response => {
                console.log('Raw API response from CreateQuiz:', response);
                console.log('Response type:', typeof response);
                console.log('Response has id?', response && 'id' in response);
            }),
            map(response => {
                // Check if response is valid and has required fields
                if (!response || typeof response !== 'object' || !('id' in response) || response.id === undefined || response.id === null) {
                    console.warn('API response missing expected fields, using request data as fallback');
                    console.log('Creating mock response from request data');
                    
                    // Create a mock response from the request data
                    const mockResponse: QuizResponse = {
                        id: Date.now(), // Temporary ID
                        title: quizData.title,
                        description: quizData.description,
                        videoId: quizData.videoId,
                        videoTitle: undefined,
                        durationMinutes: quizData.durationMinutes,
                        passingScore: quizData.passingScore,
                        totalQuestions: quizData.questions.length,
                        totalPoints: quizData.questions.reduce((sum, q) => sum + q.points, 0),
                        isActive: quizData.isActive,
                        questions: quizData.questions.map((q, index) => ({
                            id: index + 1,
                            questionText: q.questionText,
                            optionA: q.optionA,
                            optionB: q.optionB,
                            optionC: q.optionC,
                            optionD: q.optionD,
                            correctAnswer: q.correctAnswer,
                            points: q.points,
                            order: index + 1
                        })),
                        createdBy: 'current-user',
                        createdAt: new Date().toISOString(),
                        updatedAt: undefined,
                        averageScore: 0,
                        attemptCount: 0
                    };
                    
                    console.log('Mock response created:', mockResponse);
                    const model = quizResponseToModel(mockResponse);
                    console.log('Model from mock response:', model);
                    return model;
                }
                
                console.log('Using actual API response');
                const model = quizResponseToModel(response);
                console.log('Model from API response:', model);
                return model;
            })
        );
    }

    // ==================== QUIZ SUBMISSION ENDPOINTS ====================

    /**
     * Submit a quiz
     * POST /api/v1/Quiz/SubmitQuiz/{id}/submit
     */
    submitQuiz(quizId: number, submission: SubmitQuizRequest): Observable<QuizResultResponse> {
        return this.http.post<QuizResultResponse>(
            `${this.apiUrl}/Quiz/SubmitQuiz/${quizId}/submit`,
            submission
        ).pipe(
            tap(result => {
                // Update current result state
                const resultModel = quizResultResponseToModel(result);
                this.currentResultSubject.next(resultModel);
            })
        );
    }

    /**
     * Submit quiz and return model
     */
    submitQuizAsModel(quizId: number, submission: SubmitQuizRequest): Observable<QuizResultModel> {
        return this.submitQuiz(quizId, submission).pipe(
            map(response => quizResultResponseToModel(response))
        );
    }

    /**
     * Get quiz result
     * GET /api/v1/Quiz/GetQuizResult/{id}/result/{attemptId}
     */
    getQuizResult(quizId: number, attemptId: number): Observable<QuizResultResponse> {
        return this.http.get<QuizResultResponse>(
            `${this.apiUrl}/Quiz/GetQuizResult/${quizId}/result/${attemptId}`
        );
    }

    /**
     * Get quiz result as model
     */
    getQuizResultAsModel(quizId: number, attemptId: number): Observable<QuizResultModel> {
        return this.getQuizResult(quizId, attemptId).pipe(
            map(response => quizResultResponseToModel(response)),
            tap(result => {
                // Update current result state
                this.currentResultSubject.next(result);
            })
        );
    }

    // ==================== HELPER METHODS ====================

    /**
     * Get quizzes by video ID
     */
    getQuizzesByVideo(videoId: number): QuizModel[] {
        const quizzes = this.quizzesSubject.value;
        return quizzes.filter(quiz => quiz.videoId === videoId);
    }

    /**
     * Get active quizzes
     */
    getActiveQuizzes(): QuizModel[] {
        const quizzes = this.quizzesSubject.value;
        return quizzes.filter(quiz => quiz.isActive);
    }

    /**
     * Get quizzes by difficulty
     */
    getQuizzesByDifficulty(difficulty: string): QuizModel[] {
        const quizzes = this.quizzesSubject.value;
        return quizzes.filter(quiz => 
            quiz.difficultyLevel.toLowerCase() === difficulty.toLowerCase()
        );
    }

    /**
     * Search quizzes by keyword
     */
    searchQuizzes(keyword: string): QuizModel[] {
        const quizzes = this.quizzesSubject.value;
        const query = keyword.toLowerCase();
        return quizzes.filter(quiz =>
            quiz.title.toLowerCase().includes(query) ||
            quiz.description.toLowerCase().includes(query) ||
            (quiz.videoTitle && quiz.videoTitle.toLowerCase().includes(query))
        );
    }

    /**
     * Get quiz statistics
     */
    getQuizStatistics(): {
        total: number;
        active: number;
        inactive: number;
        totalQuestions: number;
        averageQuestions: number;
        totalAttempts: number;
    } {
        const quizzes = this.quizzesSubject.value;
        const totalQuestions = quizzes.reduce((sum, q) => sum + q.totalQuestions, 0);
        const totalAttempts = quizzes.reduce((sum, q) => sum + q.attemptCount, 0);
        
        return {
            total: quizzes.length,
            active: quizzes.filter(q => q.isActive).length,
            inactive: quizzes.filter(q => !q.isActive).length,
            totalQuestions: totalQuestions,
            averageQuestions: quizzes.length > 0 ? Math.round(totalQuestions / quizzes.length) : 0,
            totalAttempts: totalAttempts
        };
    }

    /**
     * Validate quiz answers before submission
     */
    validateAnswers(quiz: QuizModel, answers: { [key: string]: string }): {
        isValid: boolean;
        missingQuestions: number[];
    } {
        const missingQuestions: number[] = [];
        
        quiz.questions.forEach(question => {
            if (!answers[question.id.toString()]) {
                missingQuestions.push(question.id);
            }
        });
        
        return {
            isValid: missingQuestions.length === 0,
            missingQuestions: missingQuestions
        };
    }

    /**
     * Calculate estimated score (for practice mode)
     */
    calculateEstimatedScore(quiz: QuizModel, answers: { [key: string]: string }): {
        score: number;
        percentage: number;
        correctCount: number;
    } {
        let score = 0;
        let correctCount = 0;
        
        quiz.questions.forEach(question => {
            const userAnswer = answers[question.id.toString()];
            if (userAnswer === question.correctAnswer) {
                score += question.points;
                correctCount++;
            }
        });
        
        const percentage = quiz.totalPoints > 0 
            ? Math.round((score / quiz.totalPoints) * 100) 
            : 0;
        
        return {
            score: score,
            percentage: percentage,
            correctCount: correctCount
        };
    }

    /**
     * Get current quizzes value
     */
    getCurrentQuizzes(): QuizModel[] {
        return this.quizzesSubject.value;
    }

    /**
     * Get current quiz value
     */
    getCurrentQuiz(): QuizModel | null {
        return this.currentQuizSubject.value;
    }

    /**
     * Get current result value
     */
    getCurrentResult(): QuizResultModel | null {
        return this.currentResultSubject.value;
    }

    /**
     * Clear current quiz
     */
    clearCurrentQuiz(): void {
        this.currentQuizSubject.next(null);
    }

    /**
     * Clear current result
     */
    clearCurrentResult(): void {
        this.currentResultSubject.next(null);
    }
}
