import { DecimalPipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
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

  id = input.required<string>();

  // undefined = a carregar · null = erro / não encontrado
  vehicle = toSignal(
    toObservable(this.id).pipe(
      switchMap((id) => this.api.getById(Number(id)).pipe(catchError(() => of(null)))),
    ),
  );
}
