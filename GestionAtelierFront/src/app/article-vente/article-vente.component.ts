import { Categories } from "./../categories.model";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ArticleVenteServiceService } from "../shared/service/article-vente-service.service";
import { Article, ArticleVente } from "../shared/interface/rest-data";
import { Links } from "../shared/interface/rest-response";
import { AjoutArticleVenteComponent } from "./ajout-article-vente/ajout-article-vente.component";
import { AfficheArticleVenteComponent } from "./affiche-article-vente/affiche-article-vente.component";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-article-vente",
  templateUrl: "./article-vente.component.html",
  styleUrls: ["./article-vente.component.css"],
})
export class ArticleVenteComponent implements OnInit {
  // ==================================== Utilise une donné de l' enfant =========================================

  @ViewChild(AjoutArticleVenteComponent)
  ajouterArticleVenteEnfant!: AjoutArticleVenteComponent;

  @ViewChild(AfficheArticleVenteComponent)
  afficherArtcicleVenteEnfant!: AfficheArticleVenteComponent;
  editedArticle!: ArticleVente;

  nombreItemPage! :string

  // ==================================== variable ===================================================================

  dataLoaded: boolean = false;

  newArticleVente!: ArticleVente[];
  categoriesVente!: Categories[];
  newArticleConfection!: Article[];
  links!: Links[];

  listeArticles!: ArticleVente[];
  mode!: boolean;

  selectedValue: string = '5';

    onSelectedValueChange(value: string) {
        this.selectedValue = value;
    this.loadArticles({ page: "1", limit: this.selectedValue });
        
        // Vous pouvez faire ce que vous voulez avec la valeur sélectionnée ici
    }

  //  ========================constructeur===========================================================================

  constructor(private artVenteService: ArticleVenteServiceService ,private toastr: ToastrService ) {}

  ngOnInit(): void {
    this.loadArticles({ page: "1", limit: this.selectedValue });
    this.chargementArticle();
  }

  // ================================================= A afficher================================================

  chargementArticle() {
    this.artVenteService.allArticle().subscribe({
      next: (response) => {
        this.listeArticles = response.data;
        this.dataLoaded = true;
      },
      error: (err) => {
        console.log("erreur", err);
      },
    });
  }

  loadArticles(infos: { page?: string; limit?: string }) {
    this.artVenteService.allArticle(infos.page, infos.limit).subscribe({
      next: (response) => {
        this.newArticleVente = response.data;
        this.newArticleConfection = response.articleConfection;
        this.categoriesVente = response.categoriesVente;
        this.links = response.links;
        this.dataLoaded = true;
      },
      error: (err) => {
        console.log("erreur", err);
      },
    });
  }

  //================================== les donne venant de afficher pour editer==========================
  onEditArticle(article: ArticleVente) {
    this.mode = this.afficherArtcicleVenteEnfant.modeAjout;
    this.editedArticle = article;
  }
  // ================================== Recevoir les donne du formulaire et envoie au serveur ===========================================

  handleFormSubmit(article: FormData) {
    if (!this.ajouterArticleVenteEnfant) {
      return;
    }

    const submitFunction = this.editedArticle
      ? this.updateArticle.bind(this)
      : this.addArticle.bind(this);

    submitFunction(article);
  }
// ============================ Ajoute===================================
  addArticle(article: FormData) {
    this.artVenteService.addArticle(article).subscribe({
      next: (response) => {
        console.log(response);
      this.toastr.success("Articles ajoutée avec succès", "Succès");
        this.loadArticlesAndResetForm();
      },
      error: (err) => {
        console.log("erreur", err);
      this.toastr.error(err.error.message, "erreur");

      },
    });
  }
// =========================== Modifie===================================================
  updateArticle(article: FormData) {
    if (!this.editedArticle.id) {
      return;
    }

    this.artVenteService
      .updateArticleForm(this.editedArticle.id, article)
      .subscribe({
        next: () => {
          alert("mis à jour réussi");
          this.loadArticlesAndResetForm();
        },
        error: (err) => {
          alert(err.error.message);
        },
      });
  }
// ==================== reinialise et affiche pade 1============================================
  loadArticlesAndResetForm() {
    this.loadArticles({ page: "1", limit: this.selectedValue });
    this.ajouterArticleVenteEnfant.mode = false;
    this.resetForm();
  }

  // ====================================== Reset form=============================================================
  resetForm() {
    this.ajouterArticleVenteEnfant.ArticleVenteFormGroup.reset({
      libelle: "",
      reference: "",
      categories_id: "",
      promo: "",
      valeur_promo: "",
      photo: null,
      articleConf: [],
      cout_fabrication: "",
      marge_article: "",
      prix_vente: "",
    });
    this.ajouterArticleVenteEnfant.profilePicSrc = "assets/images/noprofil.jpg";
    this.ajouterArticleVenteEnfant.showArticles = false;
    const articlesArray = this.ajouterArticleVenteEnfant.articleConf;
    while (articlesArray.length) {
      articlesArray.removeAt(0);
    }
  }
  // ============================================== supprimmer ===============================================
  handleDelete(id: number) {
    if (this.ajouterArticleVenteEnfant) {
      this.artVenteService.deleteArticle(id).subscribe({
        next: (response) => {
          console.log(response);
          alert("suppression reussi ");
          this.loadArticles({ page: "1", limit: this.selectedValue });
        },
        error: (err) => {
          console.log("erreur", err);
        },
      });
    }
  }
}
