import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RestResponse } from '../interface/rest-response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RestServiceService {

  urlApiRest:string = environment.apiUrl

httpOptions = {
    headers: new HttpHeaders({
      'Accept':   'application/json'
    })}

  constructor(protected _http:HttpClient) { }


 all<T>(uri: string, page?: string, limit?: string): Observable<RestResponse<T>> {
    let apiUrl = `${this.urlApiRest}${uri}/pagination`;
  
    if (limit && page) {
      apiUrl = `${this.urlApiRest}${uri}/pagination?limit=${limit}&page=${page}`;
    }
    return this._http.get<RestResponse<T>>(apiUrl);
  }
// ===================================================
  add<T>(uri: string,tab :FormData ):Observable<RestResponse<T>>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept':   'application/json'
      })}
       return this._http.post<RestResponse<T>>(`${this.urlApiRest}${uri}` , tab  , httpOptions ) 
  }

// ============================================================================================
  update<T>(uri: string,id:number , newArticle : FormData):Observable<RestResponse<T>> {
      newArticle.append('_method', 'PUT')
      return this._http.post<RestResponse<T>>(`${this.urlApiRest}${uri}/${id}`, newArticle , this.httpOptions)
  }
// ================================================================

delete<T>(uri: string,id: number): Observable<RestResponse<T>> {
  return this._http.delete<RestResponse<T>>(`${this.urlApiRest}${uri}/${id}` , this.httpOptions);
}
}
