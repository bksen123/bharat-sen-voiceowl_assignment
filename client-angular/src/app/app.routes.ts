import { Routes } from '@angular/router';

export const routes: Routes = [
  // { path: 'login', component: LoginComponent },
  // { path: 'signup', component: SignupComponent },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: '',
    loadChildren: () => import('./layouts/admin-layout/admin-layout.routes'),
  },
];
