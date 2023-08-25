import { Categories } from "src/app/categories.model";
import { Fournisseur, Approvisionnement } from "./rest-data";


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

  