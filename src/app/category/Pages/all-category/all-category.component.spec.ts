import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCategoryComponent } from './all-category.component';

describe('AllCategoryComponent', () => {
  let component: AllCategoryComponent;
  let fixture: ComponentFixture<AllCategoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllCategoryComponent]
    });
    fixture = TestBed.createComponent(AllCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
