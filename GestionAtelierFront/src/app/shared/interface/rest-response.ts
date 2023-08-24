export interface RestResponse <T> {
    success : boolean;
    data : T[];
    links: Links[],
    message: string;
    fournisseurs : Fournisseur[],
    categories : Categories[],
    approvisionnement: Approvisionnement[]
}

export interface Links {
    url?: string,
    label: string,
    active: boolean
}

export interface Article {
    id?: number;
    libelle: string;
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


  export interface Categories {
    "id" :number;
    "libelle" :string;
    "data"? :  object;
  }

  export  interface Approvisionnement 
    {
        prix?: number
        stock?: number
        article_id: number,
        fournisseur_id: number
    }
  