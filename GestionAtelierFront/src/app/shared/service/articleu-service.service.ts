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



  allArticle(page? :string , limit?: string):Observable<RestResponse<Article>>{
    if (limit && page) {
      return this._http.get<RestResponse<Article>>(`${this.urlApi}articles/pagination?limit=${limit}&page=${page}`)
    }
      return this._http.get<RestResponse<Article>>(`${this.urlApi}articles/pagination`)
      
  }
// ===============================Ajout ======================================

  addArticle(tabArticle :FormData ):Observable<RestResponse<Article>>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept':   'application/json'
      })}
       return this._http.post<RestResponse<Article>>(`${this.urlApi}articles` , tabArticle  , httpOptions ) 
  }

// ===============================Update======================================

  updateArticleForm(id:number , newArticle : FormData):Observable<RestResponse<Article>> {
    const httpOptions = {
      headers : new HttpHeaders({
        'Accept' : 'application/json',
        // 'Content-Type' : 'application/json'
      })} 
      newArticle.append('_method', 'PUT')
      console.log("dfghj",newArticle);
      console.log("str",JSON. stringify(newArticle));

      // console.log('boundary:', formData._boundary);

      return this._http.post<RestResponse<Article>>(`${this.urlApi}articles/${id}`, newArticle , httpOptions)
  }
// ===============================Delete ======================================
  deleteArticle(id: number): Observable<RestResponse<Article>> {
    const httpOptions = {
      headers : new HttpHeaders({
        'Accept' : 'application/json',
        'Content-Type' : 'application/json'
      })} 
    return this._http.delete<RestResponse<Article>>(`${this.urlApi}articles/${id}` , httpOptions);
  }
}
