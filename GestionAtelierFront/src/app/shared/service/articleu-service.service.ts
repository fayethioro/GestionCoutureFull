import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Article, RestResponse } from '../interface/rest-response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArticleuServiceService {

  urlApi:string = environment.apiUrl
  constructor(private _http:HttpClient) { }



  allArticle(limit: number):Observable<RestResponse<Article>>{

    return this._http.get<RestResponse<Article>>(`${this.urlApi}articles/pagination?page=${limit}`)
  }

  addArticle(tabArticle :Article ):Observable<RestResponse<Article>>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Accept':   'application/json'
      })}
       return this._http.post<RestResponse<Article>>(`${this.urlApi}articles/ajouterArticle` , tabArticle  , httpOptions ) 
  }
}
