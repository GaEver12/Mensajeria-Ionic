import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { LoginRedirectGuard } from './login-redirect.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then((m) => m.LoginPage),
    canActivate: [LoginRedirectGuard]
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
    canActivate: [AuthGuard],
  },
  {
    path: 'message/:id',
    loadComponent: () =>
      import('./view-message/view-message.page').then((m) => m.ViewMessagePage),
    canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'create-message',
    loadComponent: () => import('./create-message/create-message.component').then((m) => m.CreateMessageComponent),
    canActivate: [AuthGuard],
  },
];

