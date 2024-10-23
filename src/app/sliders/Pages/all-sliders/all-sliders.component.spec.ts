import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllSlidersComponent } from './all-sliders.component';

describe('AllSlidersComponent', () => {
  let component: AllSlidersComponent;
  let fixture: ComponentFixture<AllSlidersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllSlidersComponent]
    });
    fixture = TestBed.createComponent(AllSlidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
