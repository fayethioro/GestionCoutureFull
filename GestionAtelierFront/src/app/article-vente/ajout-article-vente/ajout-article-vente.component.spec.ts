import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutArticleVenteComponent } from './ajout-article-vente.component';

describe('AjoutArticleVenteComponent', () => {
  let component: AjoutArticleVenteComponent;
  let fixture: ComponentFixture<AjoutArticleVenteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AjoutArticleVenteComponent]
    });
    fixture = TestBed.createComponent(AjoutArticleVenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
