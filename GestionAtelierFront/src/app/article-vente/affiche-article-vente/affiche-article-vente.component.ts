import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ArticleVente } from 'src/app/shared/interface/rest-data';
import { Links } from 'src/app/shared/interface/rest-response';

@Component({
  selector: 'app-affiche-article-vente',
  templateUrl: './affiche-article-vente.component.html',
  styleUrls: ['./affiche-article-vente.component.css'],
})
export class AfficheArticleVenteComponent implements OnInit {
  @Input() newArticleVente!: ArticleVente[];
  @Input() links!: Links[];

  @Output() loadArticlesEvent = new EventEmitter<Object>();
  @Output() deleteArticleEvent = new EventEmitter<number>();


  deleteButtonVisible: boolean = true;

  okButtonVisible = false;
  countdown = 6;
  compteRebours!: any;

  modeAjout: boolean = true;

  imageDirectoryPath: string = 'http://127.0.0.1:8000/storage/';

  // ==================================================================

  ngOnInit(): void {
    this.reinitialiseTimer();
  }
  // ============================ Pagination ===============================
  loadArticles(infos: { page?: string; limit?: string }): void {
    this.loadArticlesEvent.emit({ page: infos.page, limit: infos.limit });
  }

  // =========================================== Changer button delete / OK =========================================
  toggleButtons(index: number) {
    console.log(index);

    this.newArticleVente[index].deleteButtonVisible =
      !this.newArticleVente[index].deleteButtonVisible;
      this.okButtonVisible = true;
    this.countdown = 6;
    this.startCountdown();

    console.log(this.newArticleVente[index].deleteButtonVisible);
  }
// =========================================== reinitialiser button a delete =========================================

  private reinitialiseTimer() {
    setInterval(() => {
      for (let article of this.newArticleVente) {
        if (article.deleteButtonVisible) {
          article.deleteButtonVisible = false;
        }
      }
    }, 6000);
  }
// =========================================== compte a rebours =========================================

startCountdown() {
  this.compteRebours = setInterval(() => {
    this.countdown--;
    if (this.countdown === 0) {
      clearInterval(this.compteRebours);
      this.okButtonVisible = false;
      this.countdown = 6;
    }
  }, 1000);
}
// =========================================== Supprimer =========================================

onClickOk(article : ArticleVente) {
  clearInterval(this.compteRebours); 
  this.okButtonVisible = false;
  this.countdown = 6; 
  console.log(article.id);
  
  this.deleteArticleEvent.emit(article.id)
 
}
}
