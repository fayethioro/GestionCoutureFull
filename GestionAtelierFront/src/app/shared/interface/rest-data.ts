// import { AbstractInterface } from "./abstract-interface";
import { Categories } from "src/app/categories.model";
import { CommunInterfaceArticle } from "./commun-interface-article";
 
export interface Article extends CommunInterfaceArticle {
   
    prix:number;
    stock:number;
    stock_total?: number;
    prix_total?: number;
    categories_libelle?:string 
    fournisseur_id? : number;
    deleteButtonVisible? :boolean
    categorie:Categories
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
export interface ArticleVente extends CommunInterfaceArticle {
  promo: boolean;
  valeur_promo: number | null;
  cout_fabrication: number;
  marge_article: number;
  prix_vente: number;
  quantite_total: number;
  deleteButtonVisible? :boolean;
  articles: any[]

}

