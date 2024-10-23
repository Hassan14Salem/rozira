import { TestBed } from '@angular/core/testing';

import { ContatusServiceService } from './contatus-service.service';

describe('ContatusServiceService', () => {
  let service: ContatusServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContatusServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
