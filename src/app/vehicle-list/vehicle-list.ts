import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Vehicle } from '../vehicle.model';
import { VehicleCard } from '../vehicle-card/vehicle-card';
import { VehiclesApi } from '../vehicles-api';

@Component({
  imports: [VehicleCard],
  selector: 'app-vehicle-list',
  styleUrl: './vehicle-list.css',
  templateUrl: './vehicle-list.html',
})
export class VehicleList {
  private readonly api = inject(VehiclesApi);

  vehicles = signal<Vehicle[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  selectedId = signal<number | null>(null);

  constructor() {
    this.api
      .getAll()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (vehicles) => {
          this.vehicles.set(vehicles);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Não foi possível carregar os veículos.');
          this.loading.set(false);
        },
      });
  }

  onSelected(id: number) {
    this.selectedId.set(id);
  }
}
