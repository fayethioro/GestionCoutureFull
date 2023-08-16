export interface Categories {
  "id" :number;
  "libelle" :string;
  "data"? :  object;
}



export interface CatResponse <T> {
  success : boolean;
  data : Pagination;
  message: string;
}

export interface Pagination {
  data : Categories[];
  current_page : number
}