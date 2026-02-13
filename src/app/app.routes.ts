import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { MainLayout } from './components/layout/main-layout/main-layout';
import { AdminLayout } from './components/layout/admin-layout/admin-layout';
import { VideoViewer } from './components/ui/video-viewer/video-viewer';
import { AllVideos } from './pages/all-videos/all-videos';
import { Register } from './pages/register/register';
import { ForgotPassword } from './pages/auth/forgot-password/forgot-password';
import { OtpComponent } from './pages/auth/otp/otp';
import { ResetPassword } from './pages/auth/reset-password/reset-password';
import { ChangePassword } from './pages/auth/change-password/change-password';

export const routes: Routes = [
  // Public routes (outside MainLayout)
  {
    path: 'login',
    component: Login
  },
  {
    path: 'register',
    component: Register
  },
  {
    path: 'video-viewer',
    component: VideoViewer
  },
  {
    path: 'forgot-password',
    component: ForgotPassword
  },
  {
    path: 'otp',
    component: OtpComponent
  },
  {
    path: 'reset-password',
    component: ResetPassword
  },
  {
    path: 'change-password',
    canActivate: [authGuard],
    component: ChangePassword
  },
  {
    path:'artisan',
     loadChildren: () =>
              import('./pages/artisan/artisan.routes').then(
                (m) => m.reportsRoutes,
              ),
  },
  {
    path: 'admin',
    component: AdminLayout,
    //canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/admin/dashboard/dashboard').then(m => m.AdminDashboard)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  // Main layout routes
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: 'home',
        component: Dashboard
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
      },
      {
        path: 'all-videos',
        component: AllVideos
      },
      {
        path: 'account',
        canActivate: [authGuard],
        children: [
          {
            path: 'profile',
            loadComponent: () => import('./pages/account/profile/profile').then(m => m.Profile)
          },
          {
            path: 'subscriptions',
            loadComponent: () => import('./pages/account/subscriptions/subscriptions').then(m => m.Subscriptions)
          },
          {
            path: 'payments',
            loadComponent: () => import('./pages/account/payments/payments').then(m => m.Payments)
          },
          {
            path: 'bookings',
            loadComponent: () => import('./pages/account/bookings/bookings').then(m => m.Bookings)
          },
          {
            path: 'upload',
            loadComponent: () => import('./pages/account/uploads/uploads').then(m => m.Uploads)
          },
          {
            path: 'creator',
            loadComponent: () => import('./pages/account/tools/tools').then(m => m.Tools)
          },
          {
            path: 'quizes',
            loadComponent: () => import('./pages/account/quizes/quizes').then(m => m.Quizes)
          },
         
          {
            path: 'applications',
            loadComponent: () => import('./pages/account/applications/applications').then(m => m.Applications)
          },
          {
            path: 'courses',
            loadComponent: () => import('./pages/account/courses/courses').then(m => m.Courses)
          },
          {
            path: 'enrollments',
            loadComponent: () => import('./pages/account/enrollments/enrollments').then(m => m.Enrollments)
          },
          {
            path: 'support',
            loadComponent: () => import('./pages/account/support/support').then(m => m.Support)
          },
          {
            path: 'notifications',
            loadComponent: () => import('./pages/account/notifications/notifications').then(m => m.Notifications)
          },
        ]
      },
      {
        path: 'content',
        children: [
          {
            path: 'academics',
            loadComponent: () => import('./pages/content/academics/academics').then(m => m.Academics)
          },
          {
            path: 'skills',
            loadComponent: () => import('./pages/content/skills/skills').then(m => m.Skills)
          },
          {
            path: 'career',
            loadComponent: () => import('./pages/content/career/career').then(m => m.Career)
          },
          {
            path: 'learning-path',
            loadComponent: () => import('./pages/content/learning/learning').then(m => m.Learning)
          },
          {
            path: 'find-professionals',
            loadComponent: () => import('./pages/content/find/find').then(m => m.Find)
          },
          {
            path: 'market-place',
            loadChildren: () =>
              import('./pages/content/marketplace/market.routes').then(
                (m) => m.marketRoutes,
              ),
          },
          {
            path: 'intenship',
            loadChildren: () =>
              import('./pages/content/job/job.routes').then(
                (m) => m.jobRoutes,
              ),
          },
          {
            path: 'courses',
            loadChildren: () =>
              import('./pages/content/courses/courses.routes').then(
                (m) => m.corsesRoutes,
              ),
          }
        ]
      },

      {
        path: 'discover',
        children: [
          {
            path: 'feed',
            loadComponent: () => import('./pages/discover/feed/feed').then(m => m.Feed)
          },
          {
            path: 'explore',
            loadComponent: () => import('./pages/discover/explore/explore').then(m => m.Explore)
          },
          {
            path: 'following',
            canActivate: [authGuard],
            loadComponent: () => import('./pages/discover/following/following').then(m => m.Following)
          },
          {
            path: 'user-profile/:id',
            loadComponent: () => import('./pages/discover/user-profile/user-profile').then(m => m.UserProfile)
          }
        ]
      },
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
