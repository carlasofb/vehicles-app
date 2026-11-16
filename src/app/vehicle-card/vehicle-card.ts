import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Vehicle, VehicleStatus } from '../vehicle.model';

const STATUS_LABELS: Record<VehicleStatus, string> = {
  available: 'Disponível',
  in_service: 'Em serviço',
  maintenance: 'Em manutenção',
};

@Component({
  imports: [DecimalPipe],
  selector: 'app-vehicle-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './vehicle-card.css',
  templateUrl: './vehicle-card.html',
})
export class VehicleCard {
  vehicle = input.required<Vehicle>();
  selected = output<number>();

  title = computed(() => `${this.vehicle().brand} ${this.vehicle().model}`);
  statusLabel = computed(() => STATUS_LABELS[this.vehicle().status]);
}
