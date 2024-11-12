import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SesionesPendientesComponent } from './sesiones-pendientes.component';

describe('SesionesPendientesComponent', () => {
  let component: SesionesPendientesComponent;
  let fixture: ComponentFixture<SesionesPendientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SesionesPendientesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SesionesPendientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
