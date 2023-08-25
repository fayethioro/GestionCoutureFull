import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfficherArticleComponent } from './afficher-article.component';

describe('AfficherArticleComponent', () => {
  let component: AfficherArticleComponent;
  let fixture: ComponentFixture<AfficherArticleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AfficherArticleComponent]
    });
    fixture = TestBed.createComponent(AfficherArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
