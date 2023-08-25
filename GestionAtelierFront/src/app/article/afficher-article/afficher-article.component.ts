import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Article } from 'src/app/shared/interface/rest-data';
import { Links } from 'src/app/shared/interface/rest-response';
// import { Article, Links } from 'src/app/shared/interface/rest-response';

@Component({
  selector: 'app-afficher-article',
  templateUrl: './afficher-article.component.html',
  styleUrls: ['./afficher-article.component.css'],
})


export class AfficherArticleComponent {
  @Input() newArticle!: Article[];
  @Input() links!: Links[];

  @Output() loadArticlesEvent = new EventEmitter<Object>();
  @Output() editArticleEvent = new EventEmitter<Article>();
  @Output() deleteArticleEvent = new EventEmitter<number>();

  deleteButtonVisible: boolean = true;

  okButtonVisible = false;
  countdown = 6
  compteRebours!: any;

  modeAjout : boolean  = true;

  loadArticles(infos:{page? :string ,limit?: string}): void {
    this.loadArticlesEvent.emit({page :infos.page , limit :infos.limit});
  }

  imageDirectoryPath: string = 'http://127.0.0.1:8000/storage/';

  ngOnInit(): void {
    this.reinitialiseTimer();
  }
// =========================================== Changer button delete / OK =========================================
  toggleButtons(index: number) {
    console.log(index);

    this.newArticle[index].deleteButtonVisible =
      !this.newArticle[index].deleteButtonVisible;
      this.okButtonVisible = true;
    this.countdown = 6;
    this.startCountdown();

    console.log(this.newArticle[index].deleteButtonVisible);
  }
// =========================================== reinitialiser button a delete =========================================

  private reinitialiseTimer() {
    setInterval(() => {
      for (let article of this.newArticle) {
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

onClickOk(article : Article) {
  clearInterval(this.compteRebours); 
  this.okButtonVisible = false;
  this.countdown = 6; 
  console.log(article.id);
  
  this.deleteArticleEvent.emit(article.id)
 
}
// ========================== Edit =================================================================


onEditArticle(article: Article) {
  console.log('article ajout',article);
  this.modeAjout = true
  console.log(this.modeAjout);
  
  this.editArticleEvent.emit(article);

  // console.log("envoy",this.editArticleEvent.emit(article));
  
}

}