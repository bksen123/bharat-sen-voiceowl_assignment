import { Routes } from '@angular/router';
import { AuthGuard } from '../../shared-ui';

const adminlayoutRoutes: Routes = [
  {
    path: '',
    // canActivate: [AuthGuard],
    loadComponent: () =>
      import('./admin-layout.component').then((m) => m.AdminLayoutComponent), // Use the correct component reference here
    children: [
      {
        path: '',
        loadComponent: () =>
          import('../../views/admin-pages/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ), // Same here for DashboardComponent
      },
      {
        path: 'subscription',
        loadComponent: () =>
          import(
            '../../views/admin-pages/transcription/subscription.component'
          ).then((m) => m.SubscriptionComponent),
      },
    ],
  },
];

export default adminlayoutRoutes;
