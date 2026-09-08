import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { AddApplication } from './features/add-application/add-application';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'applications/new',
    component: AddApplication,
  },
];
