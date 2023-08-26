import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {  RestResponse } from '../interface/rest-response';
import { Observable } from 'rxjs';
import { Fournisseur } from '../interface/rest-data';

@Injectable({
  providedIn: 'root'
})
export class FournisseurServiceService {

  urlApi:string = environment.apiUrl

  constructor(private _http : HttpClient) { }

  allFournisseur():Observable<RestResponse<Fournisseur>>{

    return this._http.get<RestResponse<Fournisseur>>(`${this.urlApi}fournisseurs`)
  }

  searchFournisseur(newFournisseur : string):Observable<RestResponse<Fournisseur>>{

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Accept':   'application/json'
      })}

      const data = { recherche: newFournisseur};
      return this._http.post<RestResponse<Fournisseur>>(`${this.urlApi}fournisseurs/recherche` , data , httpOptions)
      
  }
}
