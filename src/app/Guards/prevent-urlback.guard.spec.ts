import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { preventURLBackGuard } from './prevent-urlback.guard';

describe('preventURLBackGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => preventURLBackGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
