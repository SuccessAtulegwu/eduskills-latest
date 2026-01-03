import { Routes } from '@angular/router';
import { Job } from './job';
import { Details } from './details/details';

export const jobRoutes: Routes = [
  {
   path: '',
    component: Job,
    data: { title: 'Job & Internship' },
  },
 {
    path: ':id',
    component: Details,
    data: { title: 'Job Details' },
  },
];
