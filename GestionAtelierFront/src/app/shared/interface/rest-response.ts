import { Categories } from "src/app/categories.model";
import { Fournisseur, Approvisionnement, Article } from "./rest-data";


export interface RestResponse <T> {
    success : boolean;
    data : T[];
    links: Links[],
    message: string;
    fournisseurs : Fournisseur[],
    categories : Categories[],
    approvisionnement: Approvisionnement[],
    categoriesVente : Categories[],
    articleConfection:Article[]
}

export interface Links {
    url?: string,
    label: string,
    active: boolean
}

  