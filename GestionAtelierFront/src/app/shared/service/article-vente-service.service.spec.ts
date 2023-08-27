import { TestBed } from '@angular/core/testing';

import { ArticleVenteServiceService } from './article-vente-service.service';

describe('ArticleVenteServiceService', () => {
  let service: ArticleVenteServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArticleVenteServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
