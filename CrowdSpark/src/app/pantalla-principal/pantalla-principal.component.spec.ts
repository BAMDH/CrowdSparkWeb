import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PantallaPrincipalComponent } from './pantalla-principal.component';

describe('PantallaPrincipalComponent', () => {
  let component: PantallaPrincipalComponent;
  let fixture: ComponentFixture<PantallaPrincipalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PantallaPrincipalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PantallaPrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
