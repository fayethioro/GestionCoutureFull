import { Component } from '@angular/core';
import { CategoriesServiceService } from '../categories-service.service';
import { Categories } from '../categories.model';
import { ArticleuServiceService } from '../shared/service/articleu-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Article, Fournisseur } from '../shared/interface/rest-response';
import { FournisseurServiceService } from '../shared/service/fournisseur-service.service';

@Component({
  selector: 'app-ajouter-article',
  templateUrl: './ajouter-article.component.html',
  styleUrls: ['./ajouter-article.component.css']
})
export class AjouterArticleComponent {

  categories!: Categories[] ;

  newCategorie! : Categories[];

  newArticle! : Article[];

  newFournisseur!: Fournisseur[];

  ArticleForm!: FormGroup;
  
  resultats!: Fournisseur[] ;

  fournisseursSelectionnes: number[] = [];

  fournisseursSelectionnesText: string = '';

  constructor(private categoriesService: CategoriesServiceService, 
    private artServ :ArticleuServiceService, private fourServ : FournisseurServiceService,
     private fb: FormBuilder)
      {
    this.ArticleForm = this.fb.group({
      libelle: ['', [Validators.required, Validators.minLength(3)]],
      prix: ['', [Validators.required, Validators.pattern(/^\d*$/)]],
      stock: ['', [Validators.required, Validators.min(1), Validators.pattern(/^\d*$/)]],
      categorieId: ['', Validators.required],
      fournisseurId: [[] , Validators.required],
    });
  }
  ngOnInit(): void {
    this.loadCategories();
    this.loadArticle()
    this.loadFournisseur()
    

  }
  loadCategories(): void {
    this.categoriesService.getPagination(1).subscribe((response) => {
        console.log(response.data.data);
        
      this.newCategorie = response.data.data;
      console.log(this.newCategorie);
  
      });
     
  }

  loadArticle():void{
    this.artServ.allArticle(1).subscribe((response) => {
       this.newArticle = response.data
       console.log(response.data);
       
    });
  }

  loadFournisseur(): void {
    this.fourServ.allFournisseur().subscribe((response) => {
      this.newFournisseur = response.data;
      console.log("four",this.newFournisseur);
      
    });
  }

  rechercheFournisseur() {
    const nomFournisseurValue = this.ArticleForm.value.fournisseurId;  
    this.fourServ.searchFournisseur(nomFournisseurValue).subscribe(response => {
        // console.log(Response.data);

        if (response.data !== null) {
          this.resultats = response.data;
        } 
    }
  );
  }

  gererClicCheckbox(fournisseur: number) {
    if (this.estFournisseurSelectionne(fournisseur)) {
        const index = this.fournisseursSelectionnes.indexOf(fournisseur);
        if (index !== -1) {
            this.fournisseursSelectionnes.splice(index, 1);
            console.log(this.fournisseursSelectionnes);
            
        }
    } else {
        this.fournisseursSelectionnes.push(fournisseur);

        console.log(this.fournisseursSelectionnes);  
    }
    // this.mettreAJourChampSaisie();
}

estFournisseurSelectionne(fournisseur: number): boolean {
  return this.fournisseursSelectionnes.includes(fournisseur);
}

// mettreAJourChampSaisie() {
//   this.fournisseursSelectionnesText = this.fournisseursSelectionnes.map(f => f.nom_fournisseur).join(', ');
//   console.log(this.fournisseursSelectionnesText);
  
// }

  // recupFournisseur(id:number){
  //   console.log(id);
    
  // }

  get libelleForm() {
    return this.ArticleForm.get("libelle");
  }
}
