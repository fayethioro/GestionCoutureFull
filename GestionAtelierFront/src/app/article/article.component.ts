import { Component, OnInit, ViewChild } from '@angular/core';

import { ArticleuServiceService } from '../shared/service/articleu-service.service';
import { AjouterArticleComponent } from './ajouter-article/ajouter-article.component';
import { AfficherArticleComponent } from './afficher-article/afficher-article.component';
import {
  Approvisionnement,
  Article,
  Fournisseur,
} from '../shared/interface/rest-data';
import { Links } from '../shared/interface/rest-response';
import { Categories } from '../categories.model';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css'],
  providers: [ArticleuServiceService],
})
export class ArticleComponent implements OnInit {
  // ==================================== Utilise une donné de l' enfant =========================================

  @ViewChild(AjouterArticleComponent)
  ajouterArticleEnfant!: AjouterArticleComponent;

  // @Input() editedArticle!: Article;

  editedArticle!: Article;

  @ViewChild(AfficherArticleComponent)
  afficherArtcicleEnfant!: AfficherArticleComponent;
  // ==================================== Variable =========================================

  newCategorie!: Categories[];
  newArticle!: Article[];
  newFournisseur!: Fournisseur[];
  newApprovisionnement!: Approvisionnement[];
  listeArticles!: Article[];

  dataLoaded: boolean = false;
  links!: Links[];
           
  mode!: boolean  ;

  // =================================== Constructeur==========================================

  constructor(private artServ: ArticleuServiceService) {}

  ngOnInit(): void {
    this.loadArticle({ page: '1', limit: '3' });
    this.chargementArticle();
  }

  //================================== les donne venant de afficher pour editer==========================
  onEditArticle(article: Article) {
    console.log('article parent', article);
    this.mode = this.afficherArtcicleEnfant.modeAjout 
     console.log("mon" , this.mode);
     
    this.editedArticle = article;
    console.log('dfghjkl', this.editedArticle);
  }
  // ================================================= A afficher================================================

  chargementArticle() {
    this.artServ.allArticle().subscribe({
      next: (response) => {
        this.listeArticles = response.data;
        console.log(this.listeArticles);

        this.dataLoaded = true;
      },
      error: (err) => {
        console.log('erreur', err);
      },
    });
  }
  // =================================== charger données formulaire ==========================================
  loadArticle(infos: { page?: string; limit?: string }) {
    this.artServ.allArticle(infos.page, infos.limit).subscribe({
      next: (response) => {
        this.newArticle = response.data;
        this.newFournisseur = response.fournisseurs;
        this.newCategorie = response.categories;
        this.newApprovisionnement = response.approvisionnement;
        this.links = response.links;
        this.dataLoaded = true;
      },
      error: (err) => {
        console.log('erreur', err);
      },
    });
  }
  

  // ================================== Recevoir les donne du formulaire et envoie au serveur ===========================================

  handleFormSubmit(article: FormData) {
    if (this.ajouterArticleEnfant) {
      if (!this.editedArticle) {
        this.artServ.addArticle(article).subscribe({
          next: (response) => {
            console.log(response);
            alert('ajout reussi');
            this.loadArticle({ page: '1', limit: '3' });
            this.resetForm();
            this.ajouterArticleEnfant.mode= false;
          },
          error: (err) => {
            console.log('erreur', err);
          },
        });
      } else {
        if (this.editedArticle.id) {
          this.artServ
            .updateArticleForm(this.editedArticle.id, article)
            .subscribe({
              next: (response) => {
                console.log(response);
                alert('mis a jour reussi');
                this.loadArticle({ page: '1', limit: '3' });
                 this.resetForm()
                this.ajouterArticleEnfant.mode= false;
              },
              error: (err) => {
                console.log('erreur', err);
              },
            });
        }
      }
    }
  }

  // =====================reset form ================================================

  resetForm(){
    this.ajouterArticleEnfant.ArticleForm.reset();
    this.ajouterArticleEnfant.fournisseursSelectionnesText = [];
    this.ajouterArticleEnfant.fournisseursSelectionnes = [];
    this.ajouterArticleEnfant.profilePicSrc = 'assets/images/noprofil.jpg';
    this.ajouterArticleEnfant.showFournisseurs = false;
  }
  // ============================================== supprimmer ===============================================
  handleDelete(id: number) {
    if (this.ajouterArticleEnfant) {
      this.artServ.deleteArticle(id).subscribe({
        next: (response) => {
          console.log(response);
          alert('suppression reussi ');
          this.loadArticle({ page: '1', limit: '3' });
        },
        error: (err) => {
          console.log('erreur', err);
        },
      });
    }
  }
}
