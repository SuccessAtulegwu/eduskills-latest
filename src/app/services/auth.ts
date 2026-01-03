import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { signUpDto, User } from '../models/model';



@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private router: Router) {
    // Check if user is already logged in on service initialization
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      } catch (error) {
        this.logout();
      }
    }
  }

  login(email: string, password: string, rememberMe: boolean): Observable<boolean> {
    return new Observable(observer => {
      setTimeout(() => {
        const user = this.parseUser(localStorage.getItem('user_data'));
        if (user) {
          if (user.email === email && user.password === password) {
            user.rememberMe = rememberMe;

            if (rememberMe) {
              localStorage.setItem('email', email);
            } else {
              localStorage.removeItem('email');
            }

            const token = 'mock_jwt_token_' + Date.now();

            localStorage.setItem('auth_token', token);
            localStorage.setItem('user_data', JSON.stringify(user));

            this.currentUserSubject.next(user);
            this.isAuthenticatedSubject.next(true);

            observer.next(true);
          } else {
            observer.next(false);
          }
        } else {
          observer.next(false);
        }
        observer.complete();
      }, 1000);
    });
  }

  createUser(dto: signUpDto): Observable<boolean> {
    return new Observable(observer => {
      setTimeout(() => {
        var user: User = {
          accountType: dto.accountType,
          creatorconsent: dto.creatorconsent,
          email: dto.email,
          firstname: dto.firstname,
          lastname: dto.lastname,
          password: dto.password,
          phone: dto.password,
          role: 'administrator',
          username: dto.firstname,
          id: '1',
          rememberMe: false,
        }
        localStorage.setItem('user_data', JSON.stringify(user));
        observer.next(true);
        observer.complete();
      }, 1000);
    });
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    //localStorage.removeItem('user_data');
    //this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  parseUser(data: string | null): User | null {
    if (!data) return null;

    try {
      const parsed = JSON.parse(data);
      return parsed as User;
    } catch (error) {
      console.error('Failed to parse user data:', error);
      return null;
    }
  };

}
