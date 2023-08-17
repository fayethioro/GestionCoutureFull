import { Component, OnInit, ViewChild } from '@angular/core';
import { Categories } from '../shared/interface/rest-response';
import { Article, Fournisseur } from '../shared/interface/rest-response';
import { ArticleuServiceService } from '../shared/service/articleu-service.service';
import { AjouterArticleComponent } from './ajouter-article/ajouter-article.component';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css'],
  providers: [ArticleuServiceService],
})
export class ArticleComponent implements OnInit {
  @ViewChild(AjouterArticleComponent)
  ajouterArticleEnfant!: AjouterArticleComponent;

  newCategorie!: Categories[];
  newArticle!: Article[];
  newFournisseur!: Fournisseur[];

  dataLoaded: boolean = false;

  constructor(private artServ: ArticleuServiceService) {}

  ngOnInit(): void {
    this.loadArticle();

    console.log();
  }

  loadArticle(): void {
    this.artServ.allArticle(1).subscribe(
      (response) => {
        this.newArticle = response.data;
        console.log(response.fournisseurs);
        console.log(response.categories);
        this.newFournisseur = response.fournisseurs;
        this.newCategorie = response.categories;
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

  handleFormSubmit(article: Article) {
    if (this.ajouterArticleEnfant) {
      const libelleValue = this.ajouterArticleEnfant.ArticleForm.value.libelle;

      console.log(libelleValue);
      console.log(article);
      this.artServ
        .addArticle(article)
        .subscribe(
          (response) => {
            console.log(response);
            alert("ajout reussi");
          
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
