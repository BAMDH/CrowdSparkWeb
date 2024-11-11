import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonacionesAdminComponent } from './donaciones-admin.component';

describe('DonacionesAdminComponent', () => {
  let component: DonacionesAdminComponent;
  let fixture: ComponentFixture<DonacionesAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonacionesAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonacionesAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
