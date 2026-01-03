import { Routes } from '@angular/router';
import { Marketplace } from './marketplace';
import { Details } from './details/details';

export const marketRoutes: Routes = [
  {
   path: '',
    component: Marketplace,
    data: { title: 'Marketplace' },
  },
 {
    path: ':id',
    component: Details,
    data: { title: 'Artisan Details' },
  },
];
