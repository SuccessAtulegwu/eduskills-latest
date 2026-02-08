import { Routes } from '@angular/router';

export const reportsRoutes: Routes = [
  {
    path: 'create',
    loadComponent: () => import('./create/create').then(m => m.Create)
  },
  {
    path: '',
    redirectTo: 'artisan',
    pathMatch: 'full'
  }
];
    