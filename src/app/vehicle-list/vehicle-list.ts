import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs';
import { VehicleCard } from '../vehicle-card/vehicle-card';
import { StatusFilter, VehiclesStore } from '../vehicles-store';

@Component({
  imports: [VehicleCard, ReactiveFormsModule],
  selector: 'app-vehicle-list',
  styleUrl: './vehicle-list.css',
  templateUrl: './vehicle-list.html',
})
export class VehicleList {
  protected readonly store = inject(VehiclesStore);
  private readonly router = inject(Router);

  // o termo vem da store: ao voltar do detalhe, a pesquisa mantém-se
  searchControl = new FormControl(this.store.term(), { nonNullable: true });

  constructor() {
    this.store.search(
      this.searchControl.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        startWith(this.searchControl.value),
      ),
    );
  }

  onStatus(event: Event) {
    this.store.setStatus((event.target as HTMLSelectElement).value as StatusFilter);
  }

  onSelected(id: number) {
    this.router.navigate(['/vehicles', id]);
  }
}
