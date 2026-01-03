import { Routes } from '@angular/router';

export const reportsRoutes: Routes = [
  {
    path: 'performance',
    loadComponent: () => import('./pages/performance/performance').then(m => m.Performance)
  },
  {
    path: 'attendance',
    loadComponent: () => import('./pages/attendance/attendance').then(m => m.Attendance)
  },
  {
    path: 'progress',
    loadComponent: () => import('./pages/progress/progress').then(m => m.Progress)
  },
  {
    path: '',
    redirectTo: 'performance',
    pathMatch: 'full'
  }
];
