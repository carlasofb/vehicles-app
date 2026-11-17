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

// o que o formulário envia: um veículo sem id (o servidor atribui-o)
export type VehicleInput = Omit<Vehicle, 'id'>;
