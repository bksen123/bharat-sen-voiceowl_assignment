import { Routes } from '@angular/router';
import { LoginComponent } from './views/home-pages/login/login.component';
import { SignupComponent } from './views/home-pages/signup/signup.component';

export const routes: Routes = [
  // { path: 'login', component: LoginComponent },
  // { path: 'signup', component: SignupComponent },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'admin',
    loadChildren: () => import('./layouts/admin-layout/admin-layout.routes'),
  },
  {
    path: '',
    loadChildren: () => import('./layouts/home-layout/home-layout.routes'),
  },
];
