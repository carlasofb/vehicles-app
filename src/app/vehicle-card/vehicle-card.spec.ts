import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Vehicle } from '../vehicle.model';
import { VehicleCard } from './vehicle-card';

const clio: Vehicle = {
  id: 1,
  plate: 'AA-12-BB',
  brand: 'Renault',
  model: 'Clio',
  year: 2021,
  status: 'available',
  mileageKm: 48200,
};

describe('VehicleCard', () => {
  let fixture: ComponentFixture<VehicleCard>;
  const text = () => (fixture.nativeElement as HTMLElement).textContent ?? '';

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [VehicleCard] }).compileComponents();
    fixture = TestBed.createComponent(VehicleCard);
    fixture.componentRef.setInput('vehicle', clio); // input obrigatório: tem de ser definido
    await fixture.whenStable();
  });

  it('mostra a marca, o modelo, a matrícula e o estado em texto', () => {
    expect(text()).toContain('Renault Clio');
    expect(text()).toContain('AA-12-BB');
    expect(text()).toContain('Disponível');
  });

  it('emite o id ao clicar em "Ver detalhe"', () => {
    const emitted: number[] = [];
    fixture.componentInstance.selected.subscribe((id) => emitted.push(id));

    const button = (fixture.nativeElement as HTMLElement).querySelector('button')!;
    button.click();

    expect(emitted).toEqual([1]);
  });

  it('só se atualiza quando o input recebe um objeto novo (OnPush + estado imutável)', async () => {
    clio.brand = 'Mutado'; // mutar o mesmo objeto não conta como mudança
    await fixture.whenStable();
    expect(text()).toContain('Renault Clio');

    fixture.componentRef.setInput('vehicle', { ...clio, brand: 'Peugeot', model: '208' }); // objeto novo
    await fixture.whenStable();
    expect(text()).toContain('Peugeot 208');
    clio.brand = 'Renault'; // repõe, para não afetar outros testes
  });
});
