import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarServicoComponent } from './listar-servico.component';

describe('ListarServicoComponent', () => {
  let component: ListarServicoComponent;
  let fixture: ComponentFixture<ListarServicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarServicoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarServicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
