import { Routes } from '@angular/router';
import { AuthGuard } from '../../shared-ui';

const adminlayoutRoutes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./admin-layout.component').then((m) => m.AdminLayoutComponent), // Use the correct component reference here
    children: [
      // {
      //     path:'',
      //     pathMatch:'full',
      //     redirectTo:'dashboard'
      // },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('../../views/admin-pages/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ), // Same here for DashboardComponent
      },
      {
        path: 'members',
        loadComponent: () =>
          import('../../views/admin-pages/members/members.component').then(
            (m) => m.MembersComponent
          ),
      },
      {
        path: 'events',
        loadComponent: () =>
          import('../../views/admin-pages/events/events.component').then(
            (m) => m.EventsComponent
          ), // Same here for DashboardComponent
      },
      {
        path: 'news',
        loadComponent: () =>
          import('../../views/admin-pages/news/news.component').then(
            (m) => m.NewsComponent
          ),
      },
      {
        path: 'subscription',
        loadComponent: () =>
          import(
            '../../views/admin-pages/subscription/subscription.component'
          ).then((m) => m.SubscriptionComponent),
      },
      {
        path: 'contactus',
        loadComponent: () =>
          import(
            '../../views/admin-pages/contact-us/contact-us.component'
          ).then((m) => m.ContactUsComponent),
      },
      {
        path: 'call-recording',
        loadComponent: () =>
          import(
            '../../views/admin-pages/call-recording/call-recording.component'
          ).then((m) => m.CallRecordingComponent),
      },
    ],
  },
];

export default adminlayoutRoutes;
