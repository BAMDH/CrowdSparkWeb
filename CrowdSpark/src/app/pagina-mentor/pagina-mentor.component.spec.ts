import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaMentorComponent } from './pagina-mentor.component';

describe('PaginaMentorComponent', () => {
  let component: PaginaMentorComponent;
  let fixture: ComponentFixture<PaginaMentorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginaMentorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginaMentorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
