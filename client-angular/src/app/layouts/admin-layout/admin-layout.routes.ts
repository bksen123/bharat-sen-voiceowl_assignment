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
        path: 'dashboard',
        loadComponent: () =>
          import('../../views/admin-pages/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ), // Same here for DashboardComponent
      },
      {
        path: 'transcriptions',
        loadComponent: () =>
          import(
            '../../views/admin-pages/transcription/transcription.component'
          ).then((m) => m.transcriptionComponent),
      },
    ],
  },
];

export default adminlayoutRoutes;
