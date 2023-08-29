import { Categories } from './../categories.model';
import { Component, OnInit } from '@angular/core';
import { ArticleVenteServiceService } from '../shared/service/article-vente-service.service';
import { Article, ArticleVente } from '../shared/interface/rest-data';
import { Links } from '../shared/interface/rest-response';

@Component({
  selector: 'app-article-vente',
  templateUrl: './article-vente.component.html',
  styleUrls: ['./article-vente.component.css']
})

export class ArticleVenteComponent  implements OnInit {

  dataLoaded: boolean = false;

  newArticleVente! : ArticleVente[]
  categoriesVente! :Categories[]
  newArticleConfection! : Article[]
  links! : Links[]
  

  //  ========================constructeur===========================

  constructor(private artVenteService : ArticleVenteServiceService){}

  ngOnInit(): void {
    this.loadArticle({ page: '1', limit: '3' });
  }
   
  loadArticle(infos: { page?: string; limit?: string }) {
    this.artVenteService.allArticle(infos.page, infos.limit).subscribe({
      next: (response) => {
        console.log(response);
        
        this.newArticleVente = response.data;
        this.newArticleConfection = response.articleConfection;
        this.categoriesVente= response.categoriesVente;
        this.links = response.links;
        // console.log(this.links);
        
        this.dataLoaded = true;
      },
      error: (err) => {
        console.log('erreur', err);
      },
    });
  }
  // ============================================== supprimmer ===============================================
  // handleDelete(id: number) {
  //   if (this.ajouterArticleEnfant) {
  //     this.artServ.deleteArticle(id).subscribe({
  //       next: (response) => {
  //         console.log(response);
  //         alert('suppression reussi ');
  //         this.loadArticle({ page: '1', limit: '3' });
  //       },
  //       error: (err) => {
  //         console.log('erreur', err);
  //       },
  //     });
  //   }
  // }

}
