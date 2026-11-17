import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { VehiclesApi } from './vehicles-api';

const URL = 'http://localhost:3000/vehicles';

describe('VehiclesApi', () => {
  let api: VehiclesApi;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(VehiclesApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify()); // falha se ficar algum pedido por tratar

  it('search com texto envia ?q=', () => {
    let result: unknown;
    api.search('  golf ').subscribe((r) => (result = r));

    const req = http.expectOne((r) => r.url === URL && r.params.get('q') === 'golf'); // o texto vai sem espaços
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 3 }]);

    expect(result).toEqual([{ id: 3 }]);
  });

  it('search com texto vazio pede a lista completa, sem ?q=', () => {
    api.search('   ').subscribe();

    const req = http.expectOne(URL);
    expect(req.request.params.has('q')).toBe(false);
    req.flush([]);
  });

  it('create faz POST com o corpo e update faz PUT no id', () => {
    const input = {
      plate: 'AA-12-BB',
      brand: 'Renault',
      model: 'Clio',
      year: 2021,
      status: 'available' as const,
      mileageKm: 1,
    };

    api.create(input).subscribe();
    const post = http.expectOne(URL);
    expect(post.request.method).toBe('POST');
    expect(post.request.body).toEqual(input);
    post.flush({ id: 9, ...input });

    api.update(9, input).subscribe();
    const put = http.expectOne(`${URL}/9`);
    expect(put.request.method).toBe('PUT');
    put.flush({ id: 9, ...input });
  });
});
