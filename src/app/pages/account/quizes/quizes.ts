/**
 * Quiz Component
 * Handles quiz taking and creation functionality
 */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageHeader } from '../../../components/page-header/page-header';
import { ButtonComponent } from '../../../components/ui/button/button';
import { InputComponent } from '../../../components/ui/input/input';
import { AccountTypeSelectorComponent } from '../../../components/account-type-selector/account-type-selector.component';
import { AuthService } from '../../../services/auth';
import { QuizService } from '../../../services/quiz.service';
import { ToastService } from '../../../services/toast.service';
import { ConfirmationService } from '../../../services/confirmation.service';
import { Subscription } from 'rxjs';
import { 
  User, 
  QuizModel, 
  QuizResultModel, 
  QuizQuestion 
} from '../../../models/model';

@Component({
  selector: 'app-quizes',
  imports: [CommonModule, FormsModule, PageHeader, ButtonComponent, InputComponent, AccountTypeSelectorComponent],
  templateUrl: './quizes.html',
  styleUrl: './quizes.scss',
})
export class Quizes implements OnInit, OnDestroy {
  currentUser: User | null = null;
  isAdmin: boolean = false;
  activeTab: 'answer' | 'create' | 'results' = 'answer';

  // Quiz data from API
  quizzes: QuizModel[] = [];
  selectedQuiz: QuizModel | null = null;
  currentQuestion: QuizQuestion | null = null;
  currentQuestionIndex: number = 0;

  // Quiz taking state
  userAnswers: { [questionId: string]: string } = {}; // questionId: selectedAnswer (A/B/C/D)
  quizStartTime: number = 0;
  isLoading: boolean = true;
  isTakingQuiz: boolean = false;

  // Quiz result
  quizResult: QuizResultModel | null = null;
  showResult: boolean = false;

  private subscriptions: Subscription[] = [];

  // Create Quiz Form (for admin)
  createQuizForm = {
    title: '',
    description: '',
    videoId: null as number | null,
    durationMinutes: 30,
    passingScore: 70,
    isActive: true,
    questions: [] as Array<{
      questionText: string;
      optionA: string;
      optionB: string;
      optionC: string;
      optionD: string;
      correctAnswer: string;
      points: number;
    }>
  };

  // Current question being added
  currentQuestionForm = {
    questionText: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 'A',
    points: 10
  };

  createdQuizzes: QuizModel[] = [];
  isCreatingQuiz: boolean = false;

  correctAnswerOptions = [
    { title: 'Option A', description: 'First option', value: 'A', icon: 'bi-circle-fill' },
    { title: 'Option B', description: 'Second option', value: 'B', icon: 'bi-circle-fill' },
    { title: 'Option C', description: 'Third option', value: 'C', icon: 'bi-circle-fill' },
    { title: 'Option D', description: 'Fourth option', value: 'D', icon: 'bi-circle-fill' }
  ];

  constructor(
    private authService: AuthService,
    private quizService: QuizService,
    private toastService: ToastService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    const authSub = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAdmin = user?.role === 'admin' || user?.accountType === 'admin';
    });
    this.subscriptions.push(authSub);

    this.loadQuizzes();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Load quizzes from API
   */
  loadQuizzes(): void {
    this.isLoading = true;
    const sub = this.quizService.quizzes$.subscribe({
      next: (quizzes) => {
        this.quizzes = quizzes.filter(q => q.isActive);
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading quizzes:', error);
        this.isLoading = false;
      }
    });
    this.subscriptions.push(sub);
  }

  /**
   * Load sample quizzes (backup)
   */
  loadSampleQuizzes(): void {
    // Sample quiz questions set by admin
    const sampleQuizzes = [
      // Sample data removed - using API
    ];
  }

  /**
   * Start taking a quiz
   */
  startQuiz(quiz: QuizModel): void {
    this.selectedQuiz = quiz;
    this.isTakingQuiz = true;
    this.currentQuestionIndex = 0;
    this.currentQuestion = quiz.questions[0] || null;
    this.userAnswers = {};
    this.quizStartTime = Date.now();
    this.showResult = false;
    this.quizResult = null;
  }

  /**
   * Select an answer for current question
   */
  selectAnswer(questionId: number, answer: string): void {
    this.userAnswers[questionId.toString()] = answer;
  }

  /**
   * Go to next question
   */
  nextQuestion(): void {
    if (!this.selectedQuiz) return;

    if (this.currentQuestionIndex < this.selectedQuiz.questions.length - 1) {
      this.currentQuestionIndex++;
      this.currentQuestion = this.selectedQuiz.questions[this.currentQuestionIndex];
    }
  }

  /**
   * Go to previous question
   */
  previousQuestion(): void {
    if (!this.selectedQuiz) return;

    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.currentQuestion = this.selectedQuiz.questions[this.currentQuestionIndex];
    }
  }

  /**
   * Submit quiz
   */
  submitQuiz(): void {
    if (!this.selectedQuiz) return;

    // Validate all questions answered
    const validation = this.quizService.validateAnswers(this.selectedQuiz, this.userAnswers);
    if (!validation.isValid) {
      this.toastService.warning(`Please answer all questions. Missing: ${validation.missingQuestions.length} question(s)`);
      return;
    }

    // Calculate time taken
    const timeTakenSeconds = Math.floor((Date.now() - this.quizStartTime) / 1000);

    // Submit to API
    this.quizService.submitQuizAsModel(this.selectedQuiz.id, {
      answers: this.userAnswers,
      timeTakenSeconds: timeTakenSeconds
    }).subscribe({
      next: (result) => {
        console.log('Quiz submitted successfully:', result);
        this.quizResult = result;
        this.showResult = true;
        this.isTakingQuiz = false;
      },
      error: (error: any) => {
        console.error('Error submitting quiz:', error);

        // Handle specific error types
        if (error.status === 401) {
          this.toastService.error('Unauthorized: Please log in to submit quizzes.');
        } else if (error.status === 404) {
          this.toastService.error('Quiz not found. It may have been deleted.');
        } else {
          this.toastService.error('Failed to submit quiz. Please try again.');
        }
      }
    });
  }

  /**
   * Reset quiz
   */
  resetQuiz(): void {
    this.selectedQuiz = null;
    this.currentQuestion = null;
    this.currentQuestionIndex = 0;
    this.userAnswers = {};
    this.isTakingQuiz = false;
    this.showResult = false;
    this.quizResult = null;
  }

  /**
   * Add question to quiz
   */
  addQuestionToQuiz(): void {
    // Validate question form
    if (!this.currentQuestionForm.questionText.trim()) {
      this.toastService.warning('Please enter a question');
      return;
    }

    if (!this.currentQuestionForm.optionA.trim() || !this.currentQuestionForm.optionB.trim() ||
      !this.currentQuestionForm.optionC.trim() || !this.currentQuestionForm.optionD.trim()) {
      this.toastService.warning('Please fill in all 4 options');
      return;
    }

    // Add question to the quiz with proper type conversion
    this.createQuizForm.questions.push({
      ...this.currentQuestionForm,
      points: Number(this.currentQuestionForm.points) // Ensure points is a number
    });

    // Reset question form
    this.resetQuestionForm();

    this.toastService.success(`Question ${this.createQuizForm.questions.length} added!`);
  }

  /**
   * Remove question from quiz
   */
  removeQuestion(index: number): void {
    this.confirmationService.confirm({
      title: 'Remove Question',
      message: 'Are you sure you want to remove this question?',
      confirmText: 'Yes, Remove',
      type: 'danger'
    }).then((confirmed) => {
      if (confirmed) {
        this.createQuizForm.questions.splice(index, 1);
        this.toastService.info('Question removed');
      }
    });
  }

  /**
   * Create quiz via API
   */
  createQuiz(): void {
    // Validate quiz form
    if (!this.createQuizForm.title.trim()) {
      this.toastService.warning('Please enter quiz title');
      return;
    }

    if (!this.createQuizForm.description.trim()) {
      this.toastService.warning('Please enter quiz description');
      return;
    }

    if (this.createQuizForm.questions.length === 0) {
      this.toastService.warning('Please add at least one question');
      return;
    }

    this.isCreatingQuiz = true;

    // Prepare quiz data with proper types
    const quizData = {
      ...this.createQuizForm,
      // Convert videoId to number or undefined
      videoId: this.createQuizForm.videoId ? Number(this.createQuizForm.videoId) : undefined,
      // Ensure numeric types are numbers
      durationMinutes: Number(this.createQuizForm.durationMinutes),
      passingScore: Number(this.createQuizForm.passingScore)
    };

    console.log('Submitting quiz data:', quizData);

    // Submit to API
    this.quizService.createQuizAsModel(quizData).subscribe({
      next: (quiz) => {
        console.log('Quiz created:', quiz);
        this.toastService.success(`Quiz "${quiz.title}" created successfully with ${quiz.totalQuestions} questions!`);
        this.resetCreateForm();
        this.isCreatingQuiz = false;

        // Reload quizzes after a short delay to ensure server has processed the creation
        setTimeout(() => {
          console.log('Reloading quizzes after creation...');
          this.quizService.loadQuizzes();
        }, 1000);

        // Switch to answer tab to see the new quiz
        this.activeTab = 'answer';
      },
      error: (error: any) => {
        console.error('Error creating quiz:', error);

        // Handle specific error types
        if (error.status === 401) {
          this.toastService.error('Unauthorized: Please log in to create quizzes.');
        } else if (error.status === 403) {
          this.toastService.error('Forbidden: You do not have permission to create quizzes.');
        } else if (error.status === 400) {
          this.toastService.error('Invalid quiz data. Please check all fields and try again.');
        } else {
          this.toastService.error('Failed to create quiz. Please try again.');
        }

        this.isCreatingQuiz = false;
      }
    });
  }

  /**
   * Reset question form
   */
  resetQuestionForm(): void {
    this.currentQuestionForm = {
      questionText: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: 'A',
      points: 10
    };
  }

  /**
   * Reset create quiz form
   */
  resetCreateForm(): void {
    this.createQuizForm = {
      title: '',
      description: '',
      videoId: null,
      durationMinutes: 30,
      passingScore: 70,
      isActive: true,
      questions: []
    };
    this.resetQuestionForm();
  }

  /**
   * Get progress percentage
   */
  getProgress(): number {
    if (!this.selectedQuiz) return 0;
    const answered = Object.keys(this.userAnswers).length;
    return Math.round((answered / this.selectedQuiz.totalQuestions) * 100);
  }

  /**
   * Check if current question is answered
   */
  isCurrentQuestionAnswered(): boolean {
    if (!this.currentQuestion) return false;
    return !!this.userAnswers[this.currentQuestion.id.toString()];
  }

  /**
   * Get option letter (A, B, C, D)
   */
  getOptionLetter(option: string): string {
    return option;
  }

  /**
   * Check if answer is selected
   */
  isAnswerSelected(questionId: number, answer: string): boolean {
    return this.userAnswers[questionId.toString()] === answer;
  }

  /**
   * Group quizzes by video title or category
   */
  getQuizGroups(): { lectureTitle: string; quizzes: QuizModel[] }[] {
    const groups: { [key: string]: QuizModel[] } = {};

    this.quizzes.forEach(quiz => {
      const groupKey = quiz.videoTitle || quiz.title || 'General';
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(quiz);
    });

    return Object.keys(groups).map(lectureTitle => ({
      lectureTitle,
      quizzes: groups[lectureTitle]
    }));
  }

  /**
   * Get option letter from index (0=A, 1=B, 2=C, 3=D)
   */
  getOptionLetterFromIndex(index: number): string {
    return String.fromCharCode(65 + index);
  }

  /**
   * Delete quiz (placeholder - would use API)
   */
  deleteQuiz(quizId: number): void {
    this.confirmationService.confirm({
      title: 'Delete Quiz',
      message: 'Are you sure you want to delete this quiz?',
      confirmText: 'Yes, Delete',
      type: 'danger'
    }).then((confirmed) => {
      if (confirmed) {
        this.toastService.info('Delete functionality coming soon via API');
        // TODO: Implement with API
        // this.quizService.deleteQuiz(quizId).subscribe(...);
      }
    });
  }

  /**
   * Select quiz for answering (backward compatibility)
   */
  selectQuiz(quiz: QuizModel): void {
    this.startQuiz(quiz);
  }
}
