import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { Categories } from "src/app/categories.model";
import { Article, ArticleVente } from "src/app/shared/interface/rest-data";
import { Links } from "src/app/shared/interface/rest-response";

@Component({
  selector: "app-affiche-article-vente",
  templateUrl: "./affiche-article-vente.component.html",
  styleUrls: ["./affiche-article-vente.component.css"],
})
export class AfficheArticleVenteComponent implements OnInit {
  @Input() newArticleVente!: ArticleVente[];
  @Input() links!: Links[];
  @Input() listeArticles!: ArticleVente[];
  @Input() categoriesVente!: Categories[];
  @Input() newArticleConfection!: Article[];

  @Output() loadArticlesEvent = new EventEmitter<Object>();
  @Output() editArticleEvent = new EventEmitter<ArticleVente>();
  @Output() deleteArticleEvent = new EventEmitter<number>();
  @Output() selectedValueChange = new EventEmitter<string>();

  deleteButtonVisible: boolean = true;
  // ================== filter et trie=======================
  searchTerm: string = "";
  orderHeader: string = "";
  selectedCategory: number | null = null;
  filteredArticles: ArticleVente[] = [];
  isDescOrder: boolean = true;
  sortingOrder: string[] = ["libelle"];

  isSearching: boolean = true;
  okButtonVisible = false;
  countdown = 6;
  compteRebours!: any;

  modeAjout: boolean = true;

  imageDirectoryPath: string = "http://127.0.0.1:8000/storage/";

  nombreItemPage!: string;

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

    this.newArticleVente[index].deleteButtonVisible = !this.newArticleVente[
      index
    ].deleteButtonVisible;
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

  onClickOk(article: ArticleVente) {
    clearInterval(this.compteRebours);
    this.okButtonVisible = false;
    this.countdown = 6;
    console.log(article.id);

    this.deleteArticleEvent.emit(article.id);
  }

  // ========================== Edit =======================================================================
  onEditArticle(article: ArticleVente) {
    this.modeAjout = true;
    this.editArticleEvent.emit(article);
  }

  // ============================= limit page =======================================================

  limitItemPage(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    if (selectedValue) {
      this.selectedValueChange.emit(selectedValue);
    }
  }
  // =============================== filtrer par categories============================================
  updateFilteredArticles() {
    this.filteredArticles = [];
    this.newArticleVente.forEach((art) => {
      let artis = art.articles.filter(
        (elt) => elt.article_id == this.selectedCategory
      );
      if (artis.length !== 0) {
        this.filteredArticles.push(art);
      }
    });
    this.newArticleVente = this.filteredArticles;
  }

  // ================================== trier ======================================================

  sort() {
    this.sortingOrder =
      this.sortingOrder[0] === "libelle" ? ["-libelle"] : ["libelle"];
  }
}
