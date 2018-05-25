import { TestBed, inject } from '@angular/core/testing';

import { ServeInstanceService } from './serve-instance.service';

describe('ServeInstanceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServeInstanceService]
    });
  });

  it('should be created', inject([ServeInstanceService], (service: ServeInstanceService) => {
    expect(service).toBeTruthy();
  }));
});
