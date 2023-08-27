import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Article, ArticleVente } from '../interface/rest-data';
import { RestResponse } from '../interface/rest-response';
import { RestServiceService } from './rest-service.service';

@Injectable({
  providedIn: 'root'
})
export class ArticleVenteServiceService extends RestServiceService {



  urlApi:string = environment.apiUrl
 protected uri:string = 'article_ventes'


//  =============================== all ===============================================

allArticle(page?: string, limit?: string): Observable<RestResponse<ArticleVente>> {
  return this.all<ArticleVente>(this.uri, page, limit);
}
// ===============================Ajout ======================================

addArticle(tabArticle :FormData ):Observable<RestResponse<ArticleVente>>
{
     return this.add<ArticleVente>(this.uri, tabArticle) 
}
// ===============================Update======================================

  updateArticleForm(id:number , newArticle : FormData):Observable<RestResponse<ArticleVente>> {
      return this.update<ArticleVente>(this.uri, id , newArticle )
  }
// ===============================Delete ======================================

  deleteArticle(id: number): Observable<RestResponse<ArticleVente>> {
    return this.delete<ArticleVente>( this.uri, id);
  }
}
