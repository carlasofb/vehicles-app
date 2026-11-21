import { DecimalPipe } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { catchError, of, switchMap } from 'rxjs';
import { VehiclesApi } from '../vehicles-api';

@Component({
  imports: [RouterLink, DecimalPipe],
  selector: 'app-vehicle-detail',
  styleUrl: './vehicle-detail.css',
  templateUrl: './vehicle-detail.html',
})
export class VehicleDetail {
  private readonly api = inject(VehiclesApi);
  private readonly router = inject(Router);

  id = input.required<string>();
  deleting = signal(false);
  deleteError = signal<string | null>(null);

  // undefined = a carregar · null = erro / não encontrado
  vehicle = toSignal(
    toObservable(this.id).pipe(
      switchMap((id) => this.api.getById(Number(id)).pipe(catchError(() => of(null)))),
    ),
  );

  delete(id: number) {
    this.deleting.set(true);
    this.deleteError.set(null);

    this.api.delete(id).subscribe({
      next: () => this.router.navigate(['/vehicles']),
      error: () => {
        this.deleting.set(false);
        this.deleteError.set('Não foi possível eliminar o veículo.');
      },
    });
  }
}
