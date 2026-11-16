import { Routes } from '@angular/router';
import { authGuard } from './auth-guard';
import { VehicleList } from './vehicle-list/vehicle-list';

export const routes: Routes = [
  { path: '', redirectTo: 'vehicles', pathMatch: 'full' },
  { path: 'vehicles', component: VehicleList },
  {
    path: 'vehicles/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./vehicle-detail/vehicle-detail').then((m) => m.VehicleDetail),
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login').then((m) => m.Login),
  },
  { path: '**', redirectTo: 'vehicles' },
];
