import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';
import { filter, switchMap } from 'rxjs';
import { VehicleInput, VehicleStatus } from '../vehicle.model';
import { VehiclesApi } from '../vehicles-api';
import { VehiclesStore } from '../vehicles-store';

@Component({
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButton,
    MatFormField,
    MatLabel,
    MatError,
    MatInput,
    MatSelect,
    MatOption,
  ],
  selector: 'app-vehicle-form',
  styleUrl: './vehicle-form.css',
  templateUrl: './vehicle-form.html',
})
export class VehicleForm {
  private readonly api = inject(VehiclesApi);
  private readonly store = inject(VehiclesStore);
  private readonly router = inject(Router);

  // /vehicles/new → sem id (criar) · /vehicles/:id/edit → com id (editar)
  id = input<string>();

  readonly statuses: { value: VehicleStatus; label: string }[] = [
    { value: 'available', label: 'Disponível' },
    { value: 'in_service', label: 'Em serviço' },
    { value: 'maintenance', label: 'Em manutenção' },
  ];
  readonly maxYear = new Date().getFullYear() + 1;

  form = new FormGroup({
    plate: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.pattern(/^[A-Z0-9]{2}-[A-Z0-9]{2}-[A-Z0-9]{2}$/),
      ],
    }),
    brand: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    model: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    year: new FormControl(new Date().getFullYear(), {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1990), Validators.max(this.maxYear)],
    }),
    status: new FormControl<VehicleStatus>('available', { nonNullable: true }),
    mileageKm: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),
  });

  saving = signal(false);
  error = signal<string | null>(null);

  constructor() {
    // modo edição: carrega o veículo e preenche o formulário
    toObservable(this.id)
      .pipe(
        filter((id): id is string => !!id),
        switchMap((id) => this.api.getById(Number(id))),
        takeUntilDestroyed(),
      )
      .subscribe({
        next: (vehicle) => this.form.patchValue(vehicle),
        error: () => this.error.set('Veículo não encontrado.'),
      });
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // mostra os erros de todos os campos
      return;
    }
    const value: VehicleInput = this.form.getRawValue();
    const id = this.id();
    const request$ = id ? this.api.update(Number(id), value) : this.api.create(value);

    this.saving.set(true);
    this.error.set(null);
    request$.subscribe({
      next: (vehicle) => {
        this.store.upsert(vehicle);
        this.router.navigate(['/vehicles', vehicle.id]);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(
          err.status === 409
            ? 'Já existe um veículo com essa matrícula.'
            : 'Não foi possível guardar o veículo.',
        );
        this.saving.set(false);
      },
    });
  }
}
