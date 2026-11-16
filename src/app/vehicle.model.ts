export type VehicleStatus = 'available' | 'in_service' | 'maintenance';

export interface Vehicle {
  id: number;
  plate: string;
  brand: string;
  model: string;
  year: number;
  status: VehicleStatus;
  mileageKm: number;
}
