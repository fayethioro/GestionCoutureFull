import { AbstractInterface } from "./abstract-interface";
 
export interface Article extends AbstractInterface {
    reference?: string;
    prix:number;
    stock:number;
    stock_total?: number;
    photo? :any;
    prix_total?: number;
    categories_id: number ;
    categories_libelle?:string 
    fournisseur_id? : number;
    deleteButtonVisible? :boolean
  }

  export interface Fournisseur{
    id: number;
    nom_fournisseur:string;
    data?:object,
    selectionne?: boolean;
  }

  export  interface Approvisionnement 
    {
        prix?: number
        stock?: number
        article_id: number,
        fournisseur_id: number
    }

