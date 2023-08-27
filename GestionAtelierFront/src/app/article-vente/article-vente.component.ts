import { Component, OnInit } from '@angular/core';
import { ArticleVenteServiceService } from '../shared/service/article-vente-service.service';
import { ArticleVente } from '../shared/interface/rest-data';
import { Links } from '../shared/interface/rest-response';

@Component({
  selector: 'app-article-vente',
  templateUrl: './article-vente.component.html',
  styleUrls: ['./article-vente.component.css']
})

export class ArticleVenteComponent  implements OnInit {

  dataLoaded: boolean = false;

  newArticleVente! : ArticleVente[]
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
        console.log(this.newArticleVente);
        
        // this.newFournisseur = response.fournisseurs;
        // this.newCategorie = response.categories;
        // this.newApprovisionnement = response.approvisionnement;
        this.links = response.links;
        console.log(this.links);
        
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
