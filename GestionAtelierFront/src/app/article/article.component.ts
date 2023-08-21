import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  Categories,
  Links,
  Article,
  Fournisseur,
} from '../shared/interface/rest-response';
import { ArticleuServiceService } from '../shared/service/articleu-service.service';
import { AjouterArticleComponent } from './ajouter-article/ajouter-article.component';
import { AfficherArticleComponent } from './afficher-article/afficher-article.component';

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

  dataLoaded: boolean = false;
  links!: Links[];

  // valFormData : FormData = this.ajouterArticleEnfant.formData

  // =================================== Constructeur==========================================

  constructor(private artServ: ArticleuServiceService) {}

  ngOnInit(): void {
    this.loadArticle();
  }

  //================================== les donne venant de afficher pour editer==========================
  onEditArticle(article: Article) {
    console.log('article parent', article);
    this.editedArticle = article;
    console.log('dfghjkl', this.editedArticle);
  }

  // =================================== charger données formulaire ==========================================

  loadArticle(limit?: string): void {
    this.artServ.allArticle(limit).subscribe({
      next: (response) => {
        console.log(response);

        this.newArticle = response.data;
        console.log(this.newArticle);

        console.log(response.fournisseurs);
        console.log(response.categories);
        this.newFournisseur = response.fournisseurs;
        this.newCategorie = response.categories;
        this.links = response.links;
        console.log(this.links);

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
      console.log(article);
      this.artServ.addArticle(article).subscribe({
        next: (response) => {
          console.log(response);
          alert('ajout reussi');
          this.loadArticle();
        },
        error: (err) => {
          console.log('erreur', err);
        }
      });
    }
  }

  handleDelete(id :number){
    if (this.ajouterArticleEnfant) {
      this.artServ.deleteArticle(id).subscribe({
        next :(response) =>{
          console.log(response);
          alert('suppression reussi ');
          this.loadArticle();
        },
        error: (err) => {
          console.log('erreur', err);
        }
      });
      
    }
  }
  // handleFormSubmit(article: FormData) {
  //   if (this.ajouterArticleEnfant) {
  //     console.log(article);

  //     if (this.editedArticle) {
  //       const updatedData = {
  //         id: this.editedArticle.id,
  //         ...article
  //       };
  //       console.log(updatedData);
        
  //       // this.artServ. updateArticleForm(updatedData.id , updatedData).subscribe({
  //       //   next: (response) => {
  //       //     console.log(response);
  //       //     alert('ajout reussi');
  //       //     this.loadArticle();
  //       //   },
  //       //   error: (err) => {
  //       //     console.log('erreur', err);
  //       //   },
  //       // });
  //     }
  //   }
  // }
}
