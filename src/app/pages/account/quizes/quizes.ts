import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageHeader } from '../../../components/page-header/page-header';
import { ButtonComponent } from '../../../components/ui/button/button';
import { InputComponent } from '../../../components/ui/input/input';
import { AccountTypeSelectorComponent } from '../../../components/account-type-selector/account-type-selector.component';
import { AuthService } from '../../../services/auth';
import { User } from '../../../models/model';

export interface QuizQuestion {
  id: string;
  lectureId: string;
  lectureTitle: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct answer
  points: number;
  createdAt: Date;
  createdBy: string;
}

export interface QuizAnswer {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
}

export interface UserQuizSubmission {
  id: string;
  quizId: string;
  userId: string;
  answers: QuizAnswer[];
  score: number;
  totalPoints: number;
  submittedAt: Date;
}

@Component({
  selector: 'app-quizes',
  imports: [CommonModule, FormsModule, PageHeader, ButtonComponent, InputComponent, AccountTypeSelectorComponent],
  templateUrl: './quizes.html',
  styleUrl: './quizes.scss',
})
export class Quizes implements OnInit {
  currentUser: User | null = null;
  isAdmin: boolean = false;
  activeTab: 'answer' | 'create' = 'answer';

  // Quiz Questions (for users to answer)
  availableQuizzes: QuizQuestion[] = [];
  selectedQuiz: QuizQuestion | null = null;
  userAnswers: { [questionId: string]: number } = {};
  quizSubmitted: boolean = false;
  quizResult: { score: number; totalPoints: number; percentage: number } | null = null;

  // Create Quiz Form (for admin)
  createQuizForm = {
    lectureTitle: '',
    question: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    correctAnswer: '1' as any, // 1-4 as string
    points: 10
  };

  createdQuizzes: QuizQuestion[] = [];

  correctAnswerOptions = [
    { title: 'Option A', description: 'First option', value: '1', icon: 'bi-circle-fill' },
    { title: 'Option B', description: 'Second option', value: '2', icon: 'bi-circle-fill' },
    { title: 'Option C', description: 'Third option', value: '3', icon: 'bi-circle-fill' },
    { title: 'Option D', description: 'Fourth option', value: '4', icon: 'bi-circle-fill' }
  ];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAdmin = user?.role === 'admin' || user?.accountType === 'admin';
    });

    this.loadQuizzes();
    this.loadCreatedQuizzes();
  }

  loadQuizzes(): void {
    // Sample quiz questions set by admin
    this.availableQuizzes = [
      {
        id: 'q1',
        lectureId: 'lec1',
        lectureTitle: 'Introduction to Angular',
        question: 'What is Angular?',
        options: [
          'A JavaScript library',
          'A frontend framework',
          'A backend framework',
          'A database'
        ],
        correctAnswer: 1,
        points: 10,
        createdAt: new Date('2024-01-15'),
        createdBy: 'admin'
      },
      {
        id: 'q2',
        lectureId: 'lec1',
        lectureTitle: 'Introduction to Angular',
        question: 'Which directive is used for two-way data binding in Angular?',
        options: [
          'ng-bind',
          'ng-model',
          '[(ngModel)]',
          'ng-data'
        ],
        correctAnswer: 2,
        points: 10,
        createdAt: new Date('2024-01-15'),
        createdBy: 'admin'
      },
      {
        id: 'q3',
        lectureId: 'lec2',
        lectureTitle: 'React Fundamentals',
        question: 'What is JSX?',
        options: [
          'A JavaScript extension',
          'A syntax extension for JavaScript',
          'A CSS framework',
          'A testing library'
        ],
        correctAnswer: 1,
        points: 10,
        createdAt: new Date('2024-01-16'),
        createdBy: 'admin'
      }
    ];
  }

  loadCreatedQuizzes(): void {
    // Load quizzes created by admin
    this.createdQuizzes = [...this.availableQuizzes];
  }

  selectQuiz(quiz: QuizQuestion): void {
    this.selectedQuiz = quiz;
    this.userAnswers[quiz.id] = this.userAnswers[quiz.id] || -1;
    this.quizSubmitted = false;
    this.quizResult = null;
  }

  selectAnswer(questionId: string, answerIndex: number): void {
    this.userAnswers[questionId] = answerIndex;
  }

  submitQuiz(): void {
    if (!this.selectedQuiz) return;

    const selectedAnswer = this.userAnswers[this.selectedQuiz.id];
    if (selectedAnswer === undefined || selectedAnswer === -1) {
      alert('Please select an answer before submitting');
      return;
    }

    const isCorrect = selectedAnswer === this.selectedQuiz.correctAnswer;
    const score = isCorrect ? this.selectedQuiz.points : 0;
    const totalPoints = this.selectedQuiz.points;

    this.quizResult = {
      score,
      totalPoints,
      percentage: (score / totalPoints) * 100
    };

    this.quizSubmitted = true;
  }

  resetQuiz(): void {
    if (this.selectedQuiz) {
      this.userAnswers[this.selectedQuiz.id] = -1;
    }
    this.quizSubmitted = false;
    this.quizResult = null;
  }

  createQuiz(): void {
    // Validate form
    if (!this.createQuizForm.lectureTitle.trim()) {
      alert('Please enter lecture title');
      return;
    }

    if (!this.createQuizForm.question.trim()) {
      alert('Please enter question');
      return;
    }

    if (!this.createQuizForm.option1.trim() || !this.createQuizForm.option2.trim() || 
        !this.createQuizForm.option3.trim() || !this.createQuizForm.option4.trim()) {
      alert('Please fill in all 4 options');
      return;
    }

    // Create new quiz question
    const newQuiz: QuizQuestion = {
      id: 'q' + Date.now(),
      lectureId: 'lec' + Date.now(),
      lectureTitle: this.createQuizForm.lectureTitle,
      question: this.createQuizForm.question,
      options: [
        this.createQuizForm.option1,
        this.createQuizForm.option2,
        this.createQuizForm.option3,
        this.createQuizForm.option4
      ],
      correctAnswer: parseInt(this.createQuizForm.correctAnswer.toString()) - 1, // Convert to 0-based index
      points: this.createQuizForm.points,
      createdAt: new Date(),
      createdBy: this.currentUser?.id || 'admin'
    };

    this.createdQuizzes.push(newQuiz);
    this.availableQuizzes.push(newQuiz);

    // Reset form
    this.resetCreateForm();

    alert('Quiz question created successfully!');
  }

  resetCreateForm(): void {
    this.createQuizForm = {
      lectureTitle: '',
      question: '',
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      correctAnswer: '1' as any,
      points: 10
    };
  }

  deleteQuiz(quizId: string): void {
    if (confirm('Are you sure you want to delete this quiz question?')) {
      this.createdQuizzes = this.createdQuizzes.filter(q => q.id !== quizId);
      this.availableQuizzes = this.availableQuizzes.filter(q => q.id !== quizId);
      
      if (this.selectedQuiz?.id === quizId) {
        this.selectedQuiz = null;
        this.quizSubmitted = false;
        this.quizResult = null;
      }
    }
  }

  getQuizGroups(): { lectureTitle: string; quizzes: QuizQuestion[] }[] {
    const groups: { [key: string]: QuizQuestion[] } = {};
    
    this.availableQuizzes.forEach(quiz => {
      if (!groups[quiz.lectureTitle]) {
        groups[quiz.lectureTitle] = [];
      }
      groups[quiz.lectureTitle].push(quiz);
    });

    return Object.keys(groups).map(lectureTitle => ({
      lectureTitle,
      quizzes: groups[lectureTitle]
    }));
  }

  getOptionLetter(index: number): string {
    return String.fromCharCode(65 + index);
  }
}
