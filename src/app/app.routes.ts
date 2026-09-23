import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { AddApplication } from './features/add-application/add-application';
import { Applications } from './features/applications/applications';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'applications',
    component: Applications,
    canActivate: [authGuard],
  },
  {
    path: 'applications/new',
    component: AddApplication,
    canActivate: [authGuard],
  },
];

