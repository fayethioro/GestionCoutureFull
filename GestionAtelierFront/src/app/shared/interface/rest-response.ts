export interface RestResponse <T> {
    success : boolean;
    data : T[];
    links: Links[],
    message: string;
    fournisseurs : Fournisseur[],
    categories : Categories[]
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
    prix_total?: number;
    categories_id: number; 
    fournisseur_id? : number[]
    data?:object
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
  