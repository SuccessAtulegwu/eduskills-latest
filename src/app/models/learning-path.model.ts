/**
 * Learning Path API Models and Interfaces
 * Based on API endpoints: /api/v1/LearningPath
 */

/**
 * Class Level Enum
 */
export enum ClassLevel {
  JSS1 = 0,
  JSS2 = 1,
  JSS3 = 2,
  SS1 = 3,
  SS2 = 4,
  SS3 = 5
}

/**
 * Exam Type Enum
 */
export enum ExamType {
  WAEC = 0,
  NECO = 1,
  JAMB = 2,
  NABTEB = 3,
  GCE = 4
}

/**
 * Learning Path Step Interface
 */
export interface LearningPathStep {
  id: number;
  title: string;
  description: string;
  videoId?: number;
  quizId?: number;
  estimatedMinutes: number;
  isRequired: boolean;
  order?: number;
  isCompleted?: boolean;
  completedAt?: string;
}

/**
 * API Request Interface for Creating Learning Path Step
 */
export interface CreateLearningPathStepRequest {
  title: string;
  description: string;
  videoId?: number;
  quizId?: number;
  estimatedMinutes: number;
  isRequired: boolean;
}

/**
 * API Request Interface for Creating Learning Path
 * POST /api/v1/LearningPath/CreateLearningPath
 */
export interface CreateLearningPathRequest {
  title: string;
  description: string;
  classLevel: ClassLevel;
  examType: ExamType;
  subject: string;
  estimatedHours: number;
  steps: CreateLearningPathStepRequest[];
}

/**
 * API Request Interface for Updating Learning Path
 * PUT /api/v1/LearningPath/UpdateLearningPath/{id}
 */
export interface UpdateLearningPathRequest {
  title?: string;
  description?: string;
  classLevel?: ClassLevel;
  examType?: ExamType;
  subject?: string;
  estimatedHours?: number;
  steps?: CreateLearningPathStepRequest[];
}

/**
 * API Response Interface for Learning Path
 * GET /api/v1/LearningPath/GetLearningPaths
 * GET /api/v1/LearningPath/GetLearningPath/{id}
 */
export interface LearningPathResponse {
  id: number;
  title: string;
  description: string;
  classLevel: ClassLevel;
  examType: ExamType;
  subject: string;
  estimatedHours: number;
  steps: LearningPathStep[];
  totalSteps: number;
  completedSteps?: number;
  progressPercentage?: number;
  isStarted?: boolean;
  startedAt?: string;
  lastAccessedAt?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt?: string;
}

/**
 * API Response Interface for User Progress
 * GET /api/v1/LearningPath/GetMyProgress/my-progress
 */
export interface LearningPathProgressResponse {
  id: number;
  learningPathId: number;
  learningPathTitle: string;
  userId: string;
  startedAt: string;
  lastAccessedAt: string;
  completedSteps: number;
  totalSteps: number;
  progressPercentage: number;
  isCompleted: boolean;
  completedAt?: string;
  estimatedHoursRemaining: number;
  stepsProgress: StepProgressResponse[];
}

/**
 * Step Progress Response Interface
 */
export interface StepProgressResponse {
  stepId: number;
  stepTitle: string;
  isCompleted: boolean;
  completedAt?: string;
  videoId?: number;
  quizId?: number;
}

/**
 * Display Model for Learning Path (UI compatibility)
 */
export interface LearningPathModel {
  id: number;
  title: string;
  description: string;
  classLevel: string;
  classLevelEnum: ClassLevel;
  examType: string;
  examTypeEnum: ExamType;
  subject: string;
  estimatedHours: number;
  estimatedHoursFormatted: string;
  steps: LearningPathStep[];
  totalSteps: number;
  completedSteps: number;
  progressPercentage: number;
  isStarted: boolean;
  isCompleted: boolean;
  startedAt?: Date;
  lastAccessedAt?: Date;
  createdBy?: string;
  createdAt: Date;
  updatedAt?: Date;
  difficultyLevel: string;
  difficultyClass: string;
}

/**
 * Display Model for Learning Path Progress (UI compatibility)
 */
export interface LearningPathProgressModel {
  id: number;
  learningPathId: number;
  learningPathTitle: string;
  userId: string;
  startedAt: Date;
  lastAccessedAt: Date;
  completedSteps: number;
  totalSteps: number;
  progressPercentage: number;
  isCompleted: boolean;
  completedAt?: Date;
  estimatedHoursRemaining: number;
  stepsProgress: StepProgressResponse[];
  progressClass: string;
}

/**
 * Helper function to convert ClassLevel enum to string
 */
export function classLevelToString(level: ClassLevel): string {
  switch (level) {
    case ClassLevel.JSS1: return 'JSS 1';
    case ClassLevel.JSS2: return 'JSS 2';
    case ClassLevel.JSS3: return 'JSS 3';
    case ClassLevel.SS1: return 'SS 1';
    case ClassLevel.SS2: return 'SS 2';
    case ClassLevel.SS3: return 'SS 3';
    default: return 'Unknown';
  }
}

/**
 * Helper function to convert ExamType enum to string
 */
export function examTypeToString(type: ExamType): string {
  switch (type) {
    case ExamType.WAEC: return 'WAEC';
    case ExamType.NECO: return 'NECO';
    case ExamType.JAMB: return 'JAMB';
    case ExamType.NABTEB: return 'NABTEB';
    case ExamType.GCE: return 'GCE';
    default: return 'Unknown';
  }
}

/**
 * Helper function to format estimated hours
 */
export function formatEstimatedHours(hours: number): string {
  if (hours < 1) {
    return `${Math.round(hours * 60)} minutes`;
  } else if (hours === 1) {
    return '1 hour';
  } else if (hours < 24) {
    return `${hours} hours`;
  } else {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    if (remainingHours === 0) {
      return `${days} day${days > 1 ? 's' : ''}`;
    }
    return `${days} day${days > 1 ? 's' : ''} ${remainingHours}h`;
  }
}

/**
 * Helper function to get learning path difficulty level based on estimated hours
 */
export function getLearningPathDifficultyLevel(estimatedHours: number, totalSteps: number): string {
  if (estimatedHours < 5 && totalSteps <= 5) {
    return 'Beginner';
  } else if (estimatedHours < 20 && totalSteps <= 15) {
    return 'Intermediate';
  } else {
    return 'Advanced';
  }
}

/**
 * Helper function to get learning path difficulty CSS class
 */
export function getLearningPathDifficultyClass(difficulty: string): string {
  switch (difficulty.toLowerCase()) {
    case 'beginner':
      return 'text-success bg-success-subtle border-success-subtle';
    case 'intermediate':
      return 'text-warning bg-warning-subtle border-warning-subtle';
    case 'advanced':
      return 'text-danger bg-danger-subtle border-danger-subtle';
    default:
      return 'text-secondary bg-secondary-subtle border-secondary-subtle';
  }
}

/**
 * Helper function to get progress CSS class
 */
export function getProgressClass(percentage: number): string {
  if (percentage === 0) {
    return 'text-secondary bg-secondary-subtle';
  } else if (percentage < 30) {
    return 'text-danger bg-danger-subtle';
  } else if (percentage < 70) {
    return 'text-warning bg-warning-subtle';
  } else if (percentage < 100) {
    return 'text-info bg-info-subtle';
  } else {
    return 'text-success bg-success-subtle';
  }
}

/**
 * Helper function to convert LearningPathResponse to LearningPathModel
 */
export function learningPathResponseToModel(response: LearningPathResponse): LearningPathModel {
  const difficulty = getLearningPathDifficultyLevel(response.estimatedHours, response.totalSteps);
  const completedSteps = response.completedSteps ?? 0;
  const progressPercentage = response.progressPercentage ?? 0;
  
  return {
    id: response.id,
    title: response.title,
    description: response.description,
    classLevel: classLevelToString(response.classLevel),
    classLevelEnum: response.classLevel,
    examType: examTypeToString(response.examType),
    examTypeEnum: response.examType,
    subject: response.subject,
    estimatedHours: response.estimatedHours,
    estimatedHoursFormatted: formatEstimatedHours(response.estimatedHours),
    steps: response.steps || [],
    totalSteps: response.totalSteps,
    completedSteps: completedSteps,
    progressPercentage: progressPercentage,
    isStarted: response.isStarted ?? false,
    isCompleted: progressPercentage >= 100,
    startedAt: response.startedAt ? new Date(response.startedAt) : undefined,
    lastAccessedAt: response.lastAccessedAt ? new Date(response.lastAccessedAt) : undefined,
    createdBy: response.createdBy,
    createdAt: new Date(response.createdAt),
    updatedAt: response.updatedAt ? new Date(response.updatedAt) : undefined,
    difficultyLevel: difficulty,
    difficultyClass: getLearningPathDifficultyClass(difficulty)
  };
}

/**
 * Helper function to convert LearningPathProgressResponse to LearningPathProgressModel
 */
export function learningPathProgressResponseToModel(response: LearningPathProgressResponse): LearningPathProgressModel {
  return {
    id: response.id,
    learningPathId: response.learningPathId,
    learningPathTitle: response.learningPathTitle,
    userId: response.userId,
    startedAt: new Date(response.startedAt),
    lastAccessedAt: new Date(response.lastAccessedAt),
    completedSteps: response.completedSteps,
    totalSteps: response.totalSteps,
    progressPercentage: response.progressPercentage,
    isCompleted: response.isCompleted,
    completedAt: response.completedAt ? new Date(response.completedAt) : undefined,
    estimatedHoursRemaining: response.estimatedHoursRemaining,
    stepsProgress: response.stepsProgress || [],
    progressClass: getProgressClass(response.progressPercentage)
  };
}
