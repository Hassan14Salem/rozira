import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSliderComponent } from './update-slider.component';

describe('UpdateSliderComponent', () => {
  let component: UpdateSliderComponent;
  let fixture: ComponentFixture<UpdateSliderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateSliderComponent]
    });
    fixture = TestBed.createComponent(UpdateSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
