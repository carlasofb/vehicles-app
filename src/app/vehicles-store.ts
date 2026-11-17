import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, catchError, pipe, switchMap, tap } from 'rxjs';
import { Vehicle, VehicleStatus } from './vehicle.model';
import { VehiclesApi } from './vehicles-api';

export type StatusFilter = VehicleStatus | 'all';

interface VehiclesState {
  vehicles: Vehicle[];
  loading: boolean;
  error: string | null;
  term: string;
  status: StatusFilter;
}

const initialState: VehiclesState = {
  vehicles: [],
  loading: false,
  error: null,
  term: '',
  status: 'all',
};

export const VehiclesStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ vehicles, status }) => ({
    visibleVehicles: computed(() =>
      status() === 'all' ? vehicles() : vehicles().filter((v) => v.status === status()),
    ),
    total: computed(() => vehicles().length),
  })),
  withMethods((store, api = inject(VehiclesApi)) => ({
    setStatus(status: StatusFilter) {
      patchState(store, { status });
    },
    // depois de criar/editar: atualiza a lista sem voltar a pedir tudo ao servidor
    upsert(vehicle: Vehicle) {
      patchState(store, (state) => ({
        vehicles: state.vehicles.some((v) => v.id === vehicle.id)
          ? state.vehicles.map((v) => (v.id === vehicle.id ? vehicle : v))
          : [...state.vehicles, vehicle],
      }));
    },
    // recebe um valor, um signal ou um Observable; o switchMap cancela o pedido anterior
    search: rxMethod<string>(
      pipe(
        tap((term) => patchState(store, { term, loading: true, error: null })),
        switchMap((term) =>
          api.search(term).pipe(
            tap((vehicles) => patchState(store, { vehicles, loading: false })),
            catchError(() => {
              patchState(store, {
                error: 'Não foi possível carregar os veículos.',
                loading: false,
              });
              return EMPTY;
            }),
          ),
        ),
      ),
    ),
  })),
);
