import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSlidersComponent } from './create-sliders.component';

describe('CreateSlidersComponent', () => {
  let component: CreateSlidersComponent;
  let fixture: ComponentFixture<CreateSlidersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateSlidersComponent]
    });
    fixture = TestBed.createComponent(CreateSlidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
