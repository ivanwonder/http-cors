import { TestBed, inject } from '@angular/core/testing';

import { SaveConfigService } from './save-config.service';

describe('SaveConfigService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SaveConfigService]
    });
  });

  it('should be created', inject([SaveConfigService], (service: SaveConfigService) => {
    expect(service).toBeTruthy();
  }));
});
