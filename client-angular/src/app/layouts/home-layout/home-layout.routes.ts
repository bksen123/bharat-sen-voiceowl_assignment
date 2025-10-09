import { Routes } from '@angular/router';

export const homeRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./home-layout.component').then((m) => m.HomeLayoutComponent),
    children: [
      // {
      //     path:'',
      //     pathMatch:'full',
      //     redirectTo:'login'
      // },
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('../../views/home-pages/home/home.component').then(
            (m) => m.HomeComponent
          ),
      },
      // {
      //     path:'login',
      //     loadComponent:()=>import('../../views/home-pages/login/login.component').then(m=>m.LoginComponent)
      // },
      // {
      //     path:'signup',
      //     loadComponent:()=>import('../../views/home-pages/signup/signup.component').then(m=>m.SignupComponent)
      // },
      {
        path: 'about-us',
        loadComponent: () =>
          import('../../views/home-pages/about-us/about-us.component').then(
            (m) => m.AboutUsComponent
          ),
      },
      {
        path: 'create-profile',
        loadComponent: () =>
          import('../../views/home-pages/profile/profile.component').then(
            (m) => m.ProfileComponent
          ),
      },
      {
        path: 'view-profile',
        loadComponent: () =>
          import(
            '../../views/home-pages/view-profile/view-profile.component'
          ).then((m) => m.ViewProfileComponent),
      },
      {
        path: 'view-profile/:user_id',
        loadComponent: () =>
          import(
            '../../views/home-pages/view-profile/view-profile.component'
          ).then((m) => m.ViewProfileComponent),
      },
      {
        path: 'events',
        loadComponent: () =>
          import('../../views/home-pages/events/events.component').then(
            (m) => m.EventsComponent
          ),
      },
      {
        path: 'members',
        loadComponent: () =>
          import('../../views/home-pages/members/members.component').then(
            (m) => m.MembersComponent
          ),
      },
      {
        path: 'news',
        loadComponent: () =>
          import('../../views/home-pages/news/news.component').then(
            (m) => m.NewsComponent
          ),
      },
      {
        path: 'terms-and-conditions',
        loadComponent: () =>
          import(
            '../../views/home-pages/terms-and-conditions/terms-and-conditions.component'
          ).then((m) => m.TermsAndConditionsComponent),
      },
      {
        path: 'subscription',
        loadComponent: () =>
          import(
            '../../views/home-pages/subscription/subscription.component'
          ).then((m) => m.SubscriptionComponent),
      },
      {
        path: 'subscription-plan-history',
        loadComponent: () =>
          import(
            '../../views/home-pages/plan-payment-details/plan-payment-details.component'
          ).then((m) => m.PlanPaymentDetailsComponent),
      },
      {
        path: 'contactus',
        loadComponent: () =>
          import('../../views/home-pages/contact-us/contact-us.component').then(
            (m) => m.ContactUsComponent
          ),
      },
      {
        path: 'view-event/:event_id',
        loadComponent: () =>
          import('../../views/home-pages/view-event/view-event.component').then(
            (m) => m.ViewEventComponent
          ),
      },
      {
        path: 'view-news/:news_id',
        loadComponent: () =>
          import('../../views/home-pages/view-news/view-news.component').then(
            (m) => m.ViewNewsComponent
          ),
      },
      {
        path: 'recoverpassword/:userId/:token',
        loadComponent: () =>
          import(
            '../../views/home-pages/recovery-password/recovery-password.component'
          ).then((mod) => mod.RecoveryPasswordComponent),
      },
    ],
  },
];
export default homeRoutes;
