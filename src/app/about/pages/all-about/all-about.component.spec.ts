import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllAboutComponent } from './all-about.component';

describe('AllAboutComponent', () => {
  let component: AllAboutComponent;
  let fixture: ComponentFixture<AllAboutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllAboutComponent]
    });
    fixture = TestBed.createComponent(AllAboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
