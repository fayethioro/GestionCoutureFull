import { TestBed } from '@angular/core/testing';

import { ArticleuServiceService } from './articleu-service.service';

describe('ArticleuServiceService', () => {
  let service: ArticleuServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArticleuServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
