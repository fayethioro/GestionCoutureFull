import { Categories } from './../categories.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ArticleVenteServiceService } from '../shared/service/article-vente-service.service';
import { Article, ArticleVente } from '../shared/interface/rest-data';
import { Links } from '../shared/interface/rest-response';
import { AjoutArticleVenteComponent } from './ajout-article-vente/ajout-article-vente.component';
import { AfficheArticleVenteComponent } from './affiche-article-vente/affiche-article-vente.component';

@Component({
  selector: 'app-article-vente',
  templateUrl: './article-vente.component.html',
  styleUrls: ['./article-vente.component.css']
})

export class ArticleVenteComponent  implements OnInit {

  // ==================================== Utilise une donné de l' enfant =========================================

  @ViewChild(AjoutArticleVenteComponent)
  ajouterArticleVenteEnfant! : AjoutArticleVenteComponent;

  @ViewChild(AfficheArticleVenteComponent)
  afficherArtcicleVenteEnfant!: AfficheArticleVenteComponent;
  editedArticle!: ArticleVente;

  // ==================================== variable ===================================================================

  dataLoaded: boolean = false;

  newArticleVente! : ArticleVente[]
  categoriesVente! :Categories[]
  newArticleConfection! : Article[]
  links! : Links[]

  listeArticles!: ArticleVente[];
  mode!: boolean  ;


  //  ========================constructeur===========================================================================

  constructor(private artVenteService : ArticleVenteServiceService){}

  ngOnInit(): void {
    this.loadArticles({ page: '1', limit: '3' });
    this.chargementArticle()
  }

  // ================================================= A afficher================================================

  chargementArticle() {
    this.artVenteService.allArticle().subscribe({
      next: (response) => {
        this.listeArticles = response.data;
        this.dataLoaded = true;
      },
      error: (err) => {
        console.log('erreur', err);
      },
    });
  }
   
  loadArticles(infos: { page?: string; limit?: string }) {
    this.artVenteService.allArticle(infos.page, infos.limit).subscribe({
      next: (response) => {
        console.log(response);
        
        this.newArticleVente = response.data;
        this.newArticleConfection = response.articleConfection;
        this.categoriesVente= response.categoriesVente;
        this.links = response.links;
        this.dataLoaded = true;
      },
      error: (err) => {
        console.log('erreur', err);
      },
    });
  }
  //================================== les donne venant de afficher pour editer==========================
  onEditArticle(article: ArticleVente) {
    this.mode = this.afficherArtcicleVenteEnfant.modeAjout 
    this.editedArticle = article;
  }
  // ================================== Recevoir les donne du formulaire et envoie au serveur ===========================================

  handleFormSubmit(article: FormData){
    if (this.ajouterArticleVenteEnfant) {
      if (!this.editedArticle) {
        this.artVenteService.addArticle(article).subscribe({
          next: (response) => {
            console.log(response);
            alert('ajout reussi');
            this.loadArticles({ page: '1', limit: '3' });
            this.resetForm();
            this.ajouterArticleVenteEnfant.mode= false;
          },
          error: (err) => {
            console.log('erreur', err);
          },
        });
      } 
      else {
        if (this.editedArticle.id) {
          this.artVenteService.updateArticleForm(this.editedArticle.id, article).subscribe({
              next: (response) => {
                console.log(response);
                alert('mis a jour reussi');
          console.log(this.loadArticles({ page: '1', limit: '3' }));

                this.loadArticles({ page: '1', limit: '3' });
                 this.resetForm()
                this.ajouterArticleVenteEnfant.mode= false;
              },
              error: (err) => {
                console.log('erreur', err);
              },
            });
        }
      }
      
    }
  }
  // ====================================== Reset form=============================================================
  resetForm(){
    this.loadArticles({ page: '1', limit: '3' });

    this.ajouterArticleVenteEnfant.ArticleVenteFormGroup.reset();
    this.ajouterArticleVenteEnfant.articleConf.reset()
    this.ajouterArticleVenteEnfant.profilePicSrc = 'assets/images/noprofil.jpg';
    this.ajouterArticleVenteEnfant.showArticles = false;
    const articlesArray = this.ajouterArticleVenteEnfant.articleConf
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
          alert('suppression reussi ');
          this.loadArticles({ page: '1', limit: '3' });
          console.log(this.loadArticles({ page: '1', limit: '3' }));
          
        },
        error: (err) => {
          console.log('erreur', err);
        },
      });
    }
  }

}
