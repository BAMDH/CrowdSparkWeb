import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectosPendientesComponent } from './proyectos-pendientes.component';

describe('ProyectosPendientesComponent', () => {
  let component: ProyectosPendientesComponent;
  let fixture: ComponentFixture<ProyectosPendientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProyectosPendientesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProyectosPendientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
