import { Component, OnInit, ViewChild } from '@angular/core';
import {
  Categories,
  Links,
  Article,
  Fournisseur,
} from '../shared/interface/rest-response';
import { ArticleuServiceService } from '../shared/service/articleu-service.service';
import { AjouterArticleComponent } from './ajouter-article/ajouter-article.component';

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

    console.log();
  }

  // =================================== charger données formulaire ==========================================

  loadArticle(limit?: string): void {
    this.artServ.allArticle(limit).subscribe(
      (response) => {
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
      (error) => {
        console.error(
          "Une erreur s'est produite lors du chargement des données :",
          error
        );
      }
    );
  }

  // ================================== Recevoir les donne du formulaire et envoie au serveur ===========================================

  handleFormSubmit(article: FormData) {
    if (this.ajouterArticleEnfant) {
      console.log(article);
      this.artServ.addArticle(article).subscribe(
        (response) => {
          console.log(response);
          alert('ajout reussi');
          this.loadArticle();
        },
        (error) => {
          console.error(
            "Une erreur s'est produite lors du chargement des données :",
            error
          );
        }
      );
    }
  }
}
// =============================================================================
