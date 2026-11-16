import { Component, signal } from '@angular/core';
import { Vehicle } from '../vehicle.model';
import { VehicleCard } from '../vehicle-card/vehicle-card';

@Component({
  imports: [VehicleCard],
  selector: 'app-vehicle-list',
  styleUrl: './vehicle-list.css',
  templateUrl: './vehicle-list.html',
})
export class VehicleList {
  vehicles = signal<Vehicle[]>([
    {
      id: 1,
      plate: 'AA-12-BB',
      brand: 'Renault',
      model: 'Clio',
      year: 2021,
      status: 'available',
      mileageKm: 48200,
    },
    {
      id: 2,
      plate: 'CC-34-DD',
      brand: 'Peugeot',
      model: '208',
      year: 2022,
      status: 'in_service',
      mileageKm: 31500,
    },
    {
      id: 3,
      plate: 'EE-56-FF',
      brand: 'Volkswagen',
      model: 'Golf',
      year: 2019,
      status: 'maintenance',
      mileageKm: 96300,
    },
  ]);
  selectedId = signal<number | null>(null);

  onSelected(id: number) {
    this.selectedId.set(id);
  }
}
