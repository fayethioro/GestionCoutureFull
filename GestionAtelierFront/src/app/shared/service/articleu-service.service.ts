import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Article, RestResponse } from '../interface/rest-response';
import { Observable } from 'rxjs';
import { Form } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ArticleuServiceService {

  urlApi:string = environment.apiUrl
  constructor(private _http:HttpClient) { }



  allArticle(limit?: string):Observable<RestResponse<Article>>{

    return this._http.get<RestResponse<Article>>(`${this.urlApi}articles/pagination?page=${limit}`)
  }

  addArticle(tabArticle :FormData ):Observable<RestResponse<Article>>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept':   'application/json'
      })}
       return this._http.post<RestResponse<Article>>(`${this.urlApi}articles/ajouterArticle` , tabArticle  , httpOptions ) 
  }

  updateArticleForm(id:number  | undefined , newArticle : Article):Observable<RestResponse<Article>>{
   
    const httpOptions = {
      headers : new HttpHeaders({
        'Accept' : 'application/json',
        'Content-Type' : 'application/json'
      })} 
      return this._http.put<RestResponse<Article>>(`${this.urlApi}articles/modifier/${id}`, newArticle , httpOptions)
  }

  deleteArticle(id: number): Observable<any> {
    const httpOptions = {
      headers : new HttpHeaders({
        'Accept' : 'application/json',
        'Content-Type' : 'application/json'
      })} 
    return this._http.delete(`${this.urlApi}articles/${id}` , httpOptions);
  }
}
