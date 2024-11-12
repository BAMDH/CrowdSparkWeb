import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagarSesionComponent } from './pagar-sesion.component';

describe('PagarSesionComponent', () => {
  let component: PagarSesionComponent;
  let fixture: ComponentFixture<PagarSesionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagarSesionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagarSesionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
