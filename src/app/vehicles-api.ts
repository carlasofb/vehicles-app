import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Vehicle, VehicleInput } from './vehicle.model';

@Service()
export class VehiclesApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/vehicles';

  getAll(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.baseUrl);
  }

  // o JSON Server pesquisa em todos os campos de texto com ?q=
  search(term: string): Observable<Vehicle[]> {
    const q = term.trim();
    return q ? this.http.get<Vehicle[]>(this.baseUrl, { params: { q } }) : this.getAll();
  }

  getById(id: number): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.baseUrl}/${id}`);
  }

  create(vehicle: VehicleInput): Observable<Vehicle> {
    return this.http.post<Vehicle>(this.baseUrl, vehicle);
  }

  update(id: number, vehicle: VehicleInput): Observable<Vehicle> {
    return this.http.put<Vehicle>(`${this.baseUrl}/${id}`, vehicle);
  }
}
