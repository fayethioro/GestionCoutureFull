import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { RestServiceService } from './rest-service.service';
import { Article } from '../interface/rest-data';
import { RestResponse } from '../interface/rest-response';

@Injectable({
  providedIn: 'root'
})
export class ArticleuServiceService extends RestServiceService {
  [x: string]: any;

  urlApi:string = environment.apiUrl
  // constructor(private override _http:HttpClient) { }
 protected uri:string = 'articles'


//  =============================== all ===============================================

allArticle(page?: string, limit?: string): Observable<RestResponse<Article>> {
  return this.all<Article>(this.uri, page, limit);
}
// ===============================Ajout ======================================

addArticle(tabArticle :FormData ):Observable<RestResponse<Article>>
{
     return this.add<Article>(this.uri, tabArticle) 
}
// ===============================Update======================================

  updateArticleForm(id:number , newArticle : FormData):Observable<RestResponse<Article>> {
      return this.update<Article>(this.uri, id , newArticle )
  }
// ===============================Delete ======================================

  deleteArticle(id: number): Observable<RestResponse<Article>> {
    return this.delete<Article>( this.uri, id);
  }
}
