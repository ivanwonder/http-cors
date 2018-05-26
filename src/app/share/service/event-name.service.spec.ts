import { TestBed, inject } from '@angular/core/testing';

import { EventNameService } from './event-name.service';

describe('EventNameService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventNameService]
    });
  });

  it('should be created', inject([EventNameService], (service: EventNameService) => {
    expect(service).toBeTruthy();
  }));
});
