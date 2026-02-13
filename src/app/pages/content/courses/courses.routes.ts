import { Routes } from '@angular/router';
import { CourseDetails } from './details/details';
import { Courses } from './courses';
import { Create } from './create/create';
import { Edit } from './edit/edit';
import { MyCoursesComponent } from './my-courses/my-courses';
import { authGuard } from '../../../guards/auth-guard';

export const corsesRoutes: Routes = [
    {
        path: '',
        component: Courses,
        data: { title: 'Courses' },
    },
    {
        path: 'my-courses',
        component: MyCoursesComponent,
        canActivate: [authGuard],
        data: { title: 'My Courses' }
    },
    {
        path: 'create',
        component: Create,
        canActivate: [authGuard],
        data: { title: 'Create Course' }
    },
    {
        path: 'edit/:id',
        component: Edit,
        canActivate: [authGuard],
        data: { title: 'Edit Course' }
    },
    {
        path: ':id',
        component: CourseDetails,
        data: { title: 'Course Details' },
    },
];
