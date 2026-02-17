/**
 * Quiz API Models and Interfaces
 * Based on API endpoints: /api/v1/Quiz
 */

/**
 * Quiz Question Interface
 */
export interface QuizQuestion {
    id: number;
    questionText: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctAnswer: string;
    points: number;
    order?: number;
}

/**
 * Quiz Response Interface
 * GET /api/v1/Quiz/GetQuizzes
 * GET /api/v1/Quiz/GetQuiz/{id}
 */
export interface QuizResponse {
    id: number;
    title: string;
    description: string;
    videoId?: number;
    videoTitle?: string;
    durationMinutes: number;
    passingScore: number;
    isActive: boolean;
    questions: QuizQuestion[];
    totalQuestions: number;
    totalPoints: number;
    createdBy: string;
    createdAt: string;
    updatedAt?: string;
    attemptCount?: number;
    averageScore?: number;
}

/**
 * Quiz Attempt/Result Response Interface
 * GET /api/v1/Quiz/GetQuizResult/{id}/result/{attemptId}
 */
export interface QuizResultResponse {
    id: number;
    quizId: number;
    quizTitle: string;
    userId: string;
    userName: string;
    answers: { [key: string]: string }; // questionId: selectedAnswer
    score: number;
    totalPoints: number;
    percentageScore: number;
    passed: boolean;
    timeTakenSeconds: number;
    submittedAt: string;
    correctAnswers: number;
    wrongAnswers: number;
    questionResults: QuestionResult[];
}

/**
 * Question Result Interface
 */
export interface QuestionResult {
    questionId: number;
    questionText: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    points: number;
    earnedPoints: number;
}

/**
 * API Request Interface for Submitting a Quiz
 * POST /api/v1/Quiz/SubmitQuiz/{id}/submit
 */
export interface SubmitQuizRequest {
    answers: { [key: string]: string }; // questionId: selectedAnswer
    timeTakenSeconds: number;
}

/**
 * API Request Interface for Creating a Quiz
 * POST /api/v1/Quiz/CreateQuiz
 */
export interface CreateQuizRequest {
    title: string;
    description: string;
    videoId?: number;
    durationMinutes: number;
    passingScore: number;
    isActive: boolean;
    questions: CreateQuizQuestionRequest[];
}

/**
 * Quiz Question Request Interface
 */
export interface CreateQuizQuestionRequest {
    questionText: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctAnswer: string;
    points: number;
}

/**
 * Display Model for Quiz (UI compatibility)
 */
export interface QuizModel {
    id: number;
    title: string;
    description: string;
    videoId?: number;
    videoTitle?: string;
    durationMinutes: number;
    durationFormatted: string;
    passingScore: number;
    isActive: boolean;
    questions: QuizQuestion[];
    totalQuestions: number;
    totalPoints: number;
    createdBy: string;
    createdAt: Date;
    updatedAt?: Date;
    attemptCount: number;
    averageScore: number;
    difficultyLevel: string;
    difficultyClass: string;
}

/**
 * Display Model for Quiz Result (UI compatibility)
 */
export interface QuizResultModel {
    id: number;
    quizId: number;
    quizTitle: string;
    userName: string;
    answers: { [key: string]: string };
    score: number;
    totalPoints: number;
    percentageScore: number;
    passed: boolean;
    passedClass: string;
    timeTakenSeconds: number;
    timeTakenFormatted: string;
    submittedAt: Date;
    correctAnswers: number;
    wrongAnswers: number;
    questionResults: QuestionResult[];
    grade: string;
    gradeClass: string;
}

/**
 * Helper function to format duration
 */
export function formatQuizDuration(minutes: number): string {
    if (minutes < 60) {
        return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
        return `${hours}h`;
    }
    return `${hours}h ${remainingMinutes}min`;
}

/**
 * Helper function to format time taken
 */
export function formatTimeTaken(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes === 0) {
        return `${remainingSeconds}s`;
    }
    if (remainingSeconds === 0) {
        return `${minutes}m`;
    }
    return `${minutes}m ${remainingSeconds}s`;
}

/**
 * Helper function to get quiz difficulty level based on questions and time
 */
export function getQuizDifficultyLevel(totalQuestions: number, durationMinutes: number): string {
    const timePerQuestion = durationMinutes / totalQuestions;
    
    if (totalQuestions <= 5 && timePerQuestion >= 2) {
        return 'Easy';
    } else if (totalQuestions <= 15 && timePerQuestion >= 1) {
        return 'Medium';
    } else {
        return 'Hard';
    }
}

/**
 * Helper function to get quiz difficulty CSS class
 */
export function getQuizDifficultyClass(difficulty: string): string {
    switch (difficulty.toLowerCase()) {
        case 'easy':
            return 'text-success bg-success-subtle border-success-subtle';
        case 'medium':
            return 'text-warning bg-warning-subtle border-warning-subtle';
        case 'hard':
            return 'text-danger bg-danger-subtle border-danger-subtle';
        default:
            return 'text-secondary bg-secondary-subtle border-secondary-subtle';
    }
}

/**
 * Helper function to get grade from percentage
 */
export function getGrade(percentage: number): string {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
}

/**
 * Helper function to get grade CSS class
 */
export function getGradeClass(grade: string): string {
    if (grade.startsWith('A')) {
        return 'text-success bg-success-subtle border-success-subtle';
    } else if (grade === 'B') {
        return 'text-primary bg-primary-subtle border-primary-subtle';
    } else if (grade === 'C') {
        return 'text-info bg-info-subtle border-info-subtle';
    } else if (grade === 'D') {
        return 'text-warning bg-warning-subtle border-warning-subtle';
    } else {
        return 'text-danger bg-danger-subtle border-danger-subtle';
    }
}

/**
 * Helper function to get passed CSS class
 */
export function getPassedClass(passed: boolean): string {
    return passed 
        ? 'text-success bg-success-subtle border-success-subtle'
        : 'text-danger bg-danger-subtle border-danger-subtle';
}

/**
 * Helper function to convert QuizResponse to QuizModel
 */
export function quizResponseToModel(response: QuizResponse): QuizModel {
    const difficulty = getQuizDifficultyLevel(response.totalQuestions, response.durationMinutes);
    
    return {
        id: response.id,
        title: response.title,
        description: response.description,
        videoId: response.videoId,
        videoTitle: response.videoTitle,
        durationMinutes: response.durationMinutes,
        durationFormatted: formatQuizDuration(response.durationMinutes),
        passingScore: response.passingScore,
        isActive: response.isActive,
        questions: response.questions,
        totalQuestions: response.totalQuestions,
        totalPoints: response.totalPoints,
        createdBy: response.createdBy,
        createdAt: new Date(response.createdAt),
        updatedAt: response.updatedAt ? new Date(response.updatedAt) : undefined,
        attemptCount: response.attemptCount || 0,
        averageScore: response.averageScore || 0,
        difficultyLevel: difficulty,
        difficultyClass: getQuizDifficultyClass(difficulty)
    };
}

/**
 * Helper function to convert QuizResultResponse to QuizResultModel
 */
export function quizResultResponseToModel(response: QuizResultResponse): QuizResultModel {
    const grade = getGrade(response.percentageScore);
    
    return {
        id: response.id,
        quizId: response.quizId,
        quizTitle: response.quizTitle,
        userName: response.userName,
        answers: response.answers,
        score: response.score,
        totalPoints: response.totalPoints,
        percentageScore: response.percentageScore,
        passed: response.passed,
        passedClass: getPassedClass(response.passed),
        timeTakenSeconds: response.timeTakenSeconds,
        timeTakenFormatted: formatTimeTaken(response.timeTakenSeconds),
        submittedAt: new Date(response.submittedAt),
        correctAnswers: response.correctAnswers,
        wrongAnswers: response.wrongAnswers,
        questionResults: response.questionResults,
        grade: grade,
        gradeClass: getGradeClass(grade)
    };
}
