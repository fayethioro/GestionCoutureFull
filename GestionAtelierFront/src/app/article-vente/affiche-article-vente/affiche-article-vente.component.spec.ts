import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfficheArticleVenteComponent } from './affiche-article-vente.component';

describe('AfficheArticleVenteComponent', () => {
  let component: AfficheArticleVenteComponent;
  let fixture: ComponentFixture<AfficheArticleVenteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AfficheArticleVenteComponent]
    });
    fixture = TestBed.createComponent(AfficheArticleVenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
