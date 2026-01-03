import { Routes } from '@angular/router';
import { CourseDetails } from './details/details';
import { Courses } from './courses';
import { Create } from './create/create';
import { authGuard } from '../../../guards/auth-guard';

export const corsesRoutes: Routes = [
    {
        path: '',
        component: Courses,
        data: { title: 'Courses' },
    },
    {
        path: 'create',
        component: Create,
        canActivate:[authGuard],
        data: { title: 'Create Course' }
    },
    {
        path: ':id',
        component: CourseDetails,
        data: { title: 'Course Details' },
    },
];
