import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Vehicle } from '../vehicle.model';
import { VehicleList } from './vehicle-list';

const URL = 'http://localhost:8080/api/v1/vehicles';
const vehicle = (id: number, status: Vehicle['status']): Vehicle => ({
  id,
  plate: `AA-0${id}-BB`,
  brand: 'Marca',
  model: `Modelo${id}`,
  year: 2020,
  status,
  mileageKm: 1000 * id,
});

describe('VehicleList', () => {
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleList],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
  });

  it('carrega a lista ao ser criada', async () => {
    const fixture = TestBed.createComponent(VehicleList);
    await fixture.whenStable();

    http.expectOne(URL).flush([vehicle(1, 'available'), vehicle(2, 'in_service')]);
    await fixture.whenStable();

    const text = (fixture.nativeElement as HTMLElement).textContent;
    expect(text).toContain('Modelo1');
    expect(text).toContain('2 de 2 veículos');
  });

  it('filtra por estado sem voltar a pedir à API', async () => {
    const fixture = TestBed.createComponent(VehicleList);
    await fixture.whenStable();
    http.expectOne(URL).flush([vehicle(1, 'available'), vehicle(2, 'in_service')]);
    await fixture.whenStable();

    const select = (fixture.nativeElement as HTMLElement).querySelector('select')!;
    select.value = 'available';
    select.dispatchEvent(new Event('change'));
    await fixture.whenStable();

    const text = (fixture.nativeElement as HTMLElement).textContent;
    expect(text).toContain('1 de 2 veículos');
    expect(text).not.toContain('Modelo2');
    http.expectNone(URL);
  });
});
