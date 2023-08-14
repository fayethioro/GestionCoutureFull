import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categories } from './categories.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriesServiceService {

  private host:string = "http://127.0.0.1:8000/api/categories"
  
  constructor(private _http:HttpClient) {}

  getData() :Observable<Categories> {
      return this._http.get<Categories>(this.host)
  }

  getCategoriesPagination(limit: number): Observable<any> {
    const url = `${this.host}/pagination?page=${limit}`;
    return this._http.get(url);
  }

  addCategorieForm(newCategorie :Categories):Observable<Categories>{

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Accept':   'application/json'
      })}
       return this._http.post<Categories>(this.host , newCategorie  , httpOptions )   
  }

  deleteCategorieSelect(tabSelect : number[]): Observable<Categories>{
    const data = { category_ids: tabSelect };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Accept':   'application/json'
      })}
      
      const url = `${this.host}/destoyMultiple`;
    //  return  this._http.delete<Categories>(url ,  httpOptions)

    return this._http.post<Categories>(url , data  , httpOptions )   
  }

  updateCategorieForm(id:number , newCategorie : Categories):Observable<Categories>{
    const httpOptions = {
      headers : new HttpHeaders({
        'Accept' : 'application/json',
        'Content-Type' : 'application/json'
      })}

      const url = `${this.host}/${id}`;
      
      return this._http.put<Categories>(url , newCategorie , httpOptions)
  }


  rechercheCategorieForm(newCategorie :string):Observable<Categories>{

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Accept':   'application/json'
      })}

      const data = { recherche: newCategorie};
      const url = `${this.host}/recherche`;
       return this._http.post<Categories>(url , data  , httpOptions )   
  }
  
}
