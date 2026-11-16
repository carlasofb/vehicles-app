import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { Vehicle } from '../vehicle.model';
import { VehicleCard } from '../vehicle-card/vehicle-card';
import { VehiclesApi } from '../vehicles-api';

@Component({
  imports: [VehicleCard, ReactiveFormsModule],
  selector: 'app-vehicle-list',
  styleUrl: './vehicle-list.css',
  templateUrl: './vehicle-list.html',
})
export class VehicleList {
  private readonly api = inject(VehiclesApi);
  private readonly router = inject(Router);

  searchControl = new FormControl('', { nonNullable: true });
  loading = signal(false);
  error = signal<string | null>(null);

  vehicles = toSignal(
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      startWith(''),
      tap(() => {
        this.loading.set(true);
        this.error.set(null);
      }),
      switchMap((term) =>
        this.api.search(term).pipe(
          catchError(() => {
            this.error.set('Não foi possível carregar os veículos.');
            return of([] as Vehicle[]);
          }),
        ),
      ),
      tap(() => this.loading.set(false)),
    ),
    { initialValue: [] as Vehicle[] },
  );

  onSelected(id: number) {
    this.router.navigate(['/vehicles', id]);
  }
}
