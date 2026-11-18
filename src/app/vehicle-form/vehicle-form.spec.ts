import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router, provideRouter } from '@angular/router';
import { VehicleForm } from './vehicle-form';

const URL = 'http://localhost:8080/api/v1/vehicles';
const valid = {
  plate: 'AA-12-BB',
  brand: 'Renault',
  model: 'Clio',
  year: 2021,
  status: 'available' as const,
  mileageKm: 1000,
};

describe('VehicleForm', () => {
  let http: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleForm],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true); // não navega a sério
  });

  it('valida a matrícula: obrigatória e no formato AA-12-BB', () => {
    const plate = TestBed.createComponent(VehicleForm).componentInstance.form.controls.plate;

    expect(plate.errors?.['required']).toBeTruthy();
    plate.setValue('aa-12-bb');
    expect(plate.errors?.['pattern']).toBeTruthy();
    plate.setValue('AA-12-BB');
    expect(plate.valid).toBe(true);
  });

  it('submeter um formulário inválido não chama a API e mostra os erros', async () => {
    const fixture = TestBed.createComponent(VehicleForm);
    await fixture.whenStable();

    fixture.componentInstance.save();
    await fixture.whenStable();

    http.expectNone(URL);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Indica a matrícula');
  });

  it('criar: faz POST e navega para o detalhe do novo veículo', async () => {
    const fixture = TestBed.createComponent(VehicleForm);
    await fixture.whenStable();
    fixture.componentInstance.form.setValue(valid);

    fixture.componentInstance.save();

    const req = http.expectOne(URL);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(valid);
    req.flush({ id: 9, ...valid });
    expect(router.navigate).toHaveBeenCalledWith(['/vehicles', 9]);
  });
});
