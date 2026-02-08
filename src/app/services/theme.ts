import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';
import { SetThemeDto } from '../models/api.models';

export type Theme = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private currentTheme = new BehaviorSubject<Theme>('light');
  public theme$ = this.currentTheme.asObservable();
  private readonly endpoint = '/Theme';

  constructor(private api: ApiService) {
    // Load theme from localStorage or default to light
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system')) {
      this.setThemeLocal(savedTheme);
    } else {
      this.setThemeLocal('light');
    }
  }

  // Local state management
  setThemeLocal(theme: Theme): void {
    this.currentTheme.next(theme);
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  toggleTheme(): void {
    const newTheme = this.currentTheme.value === 'light' ? 'dark' : 'light'; // Simple toggle, ignores system for now
    this.setThemeLocal(newTheme);
    this.setTheme({ theme: newTheme }).subscribe(); // Sync with backend
  }

  getCurrentTheme(): Theme {
    return this.currentTheme.value;
  }

  isDarkMode(): boolean {
    return this.currentTheme.value === 'dark';
  }

  // API Methods
  setTheme(body: SetThemeDto): Observable<any> {
    return this.api.post(`${this.endpoint}/SetTheme`, body);
  }

  getTheme(): Observable<any> {
    return this.api.get(`${this.endpoint}/GetTheme`);
  }

  getEffectiveTheme(systemPreference?: string): Observable<any> {
    return this.api.get(`${this.endpoint}/GetEffectiveTheme/effective`, { systemPreference });
  }
}
