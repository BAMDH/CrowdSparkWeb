import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealizarDonacionComponent } from './realizar-donacion.component';

describe('RealizarDonacionComponent', () => {
  let component: RealizarDonacionComponent;
  let fixture: ComponentFixture<RealizarDonacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RealizarDonacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RealizarDonacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
