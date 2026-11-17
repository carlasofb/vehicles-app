import { Routes } from '@angular/router';
import { authGuard } from './auth-guard';
import { VehicleList } from './vehicle-list/vehicle-list';

export const routes: Routes = [
  { path: '', redirectTo: 'vehicles', pathMatch: 'full' },
  { path: 'vehicles', component: VehicleList },
  {
    // tem de vir ANTES de 'vehicles/:id', senão "new" seria lido como um id
    path: 'vehicles/new',
    canActivate: [authGuard],
    loadComponent: () => import('./vehicle-form/vehicle-form').then((m) => m.VehicleForm),
  },
  {
    path: 'vehicles/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./vehicle-detail/vehicle-detail').then((m) => m.VehicleDetail),
  },
  {
    path: 'vehicles/:id/edit',
    canActivate: [authGuard],
    loadComponent: () => import('./vehicle-form/vehicle-form').then((m) => m.VehicleForm),
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login').then((m) => m.Login),
  },
  { path: '**', redirectTo: 'vehicles' },
];
