export interface RestResponse <T> {
    success : boolean;
    data : T[];
    links: Links[],
    message: string;
}

export interface Links {
    url?: string,
    label: string,
    active: boolean
}

export interface Article {
    id?: number;
    libelle: string;
    reference: string;
    stock_total: number;
    prix_total: number;
    caterigorie: number; 
    fournisseur? : number
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
  