import { TestBed, inject } from '@angular/core/testing';

import { EditStatusService } from './edit-status.service';

describe('EditStatusService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EditStatusService]
    });
  });

  it('should be created', inject([EditStatusService], (service: EditStatusService) => {
    expect(service).toBeTruthy();
  }));
});
