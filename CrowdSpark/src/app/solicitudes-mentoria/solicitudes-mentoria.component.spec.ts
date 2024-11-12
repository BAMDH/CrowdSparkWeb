import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesMentoriaComponent } from './solicitudes-mentoria.component';

describe('SolicitudesMentoriaComponent', () => {
  let component: SolicitudesMentoriaComponent;
  let fixture: ComponentFixture<SolicitudesMentoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudesMentoriaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudesMentoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
