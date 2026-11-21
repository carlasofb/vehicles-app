import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router, provideRouter } from '@angular/router';
import { VehicleDetail } from './vehicle-detail';

const URL = 'http://localhost:8080/api/v1/vehicles';

describe('VehicleDetail', () => {
  let http: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleDetail],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  it('carrega o veículo pelo id e mostra os dados', async () => {
    const fixture = TestBed.createComponent(VehicleDetail);
    fixture.componentRef.setInput('id', '3'); // é assim que o :id da rota chega ao componente
    await fixture.whenStable();

    http.expectOne(`${URL}/3`).flush({
      id: 3,
      plate: 'EE-56-FF',
      brand: 'Volkswagen',
      model: 'Golf',
      year: 2019,
      status: 'maintenance',
      mileageKm: 96300,
    });
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Volkswagen Golf');
  });

  it('mostra "não encontrado" quando a API devolve 404', async () => {
    const fixture = TestBed.createComponent(VehicleDetail);
    fixture.componentRef.setInput('id', '999');
    await fixture.whenStable();

    http.expectOne(`${URL}/999`).flush('x', { status: 404, statusText: 'Not Found' });
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Veículo não encontrado');
  });

  it('elimina o veículo e navega para a lista', async () => {
    const fixture = TestBed.createComponent(VehicleDetail);
    fixture.componentRef.setInput('id', '3');
    await fixture.whenStable();

    http.expectOne(`${URL}/3`).flush({
      id: 3,
      plate: 'EE-56-FF',
      brand: 'Volkswagen',
      model: 'Golf',
      year: 2019,
      status: 'maintenance',
      mileageKm: 96300,
    });
    await fixture.whenStable();

    (fixture.nativeElement as HTMLElement).querySelector('button')?.click();
    const request = http.expectOne(`${URL}/3`);
    expect(request.request.method).toBe('DELETE');
    request.flush(null);
    await fixture.whenStable();

    expect(router.navigate).toHaveBeenCalledWith(['/vehicles']);
  });
});
