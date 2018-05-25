import { TestBed, inject } from '@angular/core/testing';

import { EditObserveService } from './edit-observe.service';

describe('EditObserveService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EditObserveService]
    });
  });

  it('should be created', inject([EditObserveService], (service: EditObserveService) => {
    expect(service).toBeTruthy();
  }));
});
