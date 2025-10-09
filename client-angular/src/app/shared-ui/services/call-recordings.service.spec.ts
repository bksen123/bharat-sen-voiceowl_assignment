import { TestBed } from '@angular/core/testing';

import { CallRecordingsService } from './call-recordings.service';

describe('CallRecordingsService', () => {
  let service: CallRecordingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CallRecordingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
