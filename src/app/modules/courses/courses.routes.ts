import { Routes } from '@angular/router';

export const coursesRoutes: Routes = [
  {
    path: 'all',
    loadComponent: () => import('./pages/all-courses/all-courses').then(m => m.AllCourses)
  },
  {
    path: 'my-courses',
    loadComponent: () => import('./pages/my-courses/my-courses').then(m => m.MyCourses)
  },
  {
    path: 'create',
    loadComponent: () => import('./pages/create-course/create-course').then(m => m.CreateCourse)
  },
  {
    path: '',
    redirectTo: 'all',
    pathMatch: 'full'
  }
];
