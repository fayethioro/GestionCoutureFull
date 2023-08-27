import { AbstractInterface } from "./abstract-interface";

export interface CommunInterfaceArticle extends AbstractInterface {
    reference: string;
    categories_id: number;
    photo: string | null;
}
