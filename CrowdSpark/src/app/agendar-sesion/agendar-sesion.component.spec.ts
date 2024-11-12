import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendarSesionComponent } from './agendar-sesion.component';

describe('AgendarSesionComponent', () => {
  let component: AgendarSesionComponent;
  let fixture: ComponentFixture<AgendarSesionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgendarSesionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgendarSesionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
