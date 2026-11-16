import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Vehicle } from './vehicle.model';

@Service()
export class VehiclesApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/vehicles';

  getAll(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.baseUrl);
  }
}
