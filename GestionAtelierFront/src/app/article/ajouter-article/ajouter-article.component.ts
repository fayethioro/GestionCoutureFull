import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Categories } from '../../categories.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Article, Fournisseur } from '../../shared/interface/rest-response';


@Component({
  selector: 'app-ajouter-article',
  templateUrl: './ajouter-article.component.html',
  styleUrls: ['./ajouter-article.component.css'],
})
export class AjouterArticleComponent  {
  
  @Input() newCategorie!: Categories[];

  @Input() newArticle!: Article[];

  @Input() newFournisseur!: Fournisseur[];

  @Output() buttonAjouter = new EventEmitter<Article>()

  ArticleForm!: FormGroup;

  resultats!: Fournisseur[];

  fournisseursSelectionnes: number[] = [];

  fournisseursSelectionnesText: string = '';

  showFournisseurs: boolean = true ;
  showInput: boolean = true;
  showSpan: boolean = true;
  inputValue: string = '';

  constructor(private fb: FormBuilder) {
    this.ArticleForm = this.fb.group({
      libelle: ['', [Validators.required, Validators.minLength(3)]],
      prix: ['', [Validators.required, Validators.pattern(/^\d*$/)]],
      reference : [''],
      stock: [
        '',
        [Validators.required, Validators.min(1), Validators.pattern(/^\d*$/)],
      ],
      categorieId: ['', Validators.required],
      fournisseurId: [[], Validators.required],
    });
   
  this.ArticleForm.get('libelle')?.valueChanges.subscribe((libelle) => {
    this.updateReference(libelle);
  });

  this.ArticleForm.get('categorieId')?.valueChanges.subscribe((categorieId) => {
    const libelle = this.ArticleForm.get('libelle')?.value;
    this.updateReference(libelle, categorieId);
  });

  }

  updateReference(libelle: string, categorieId?: number): void {
  
    const libellePrefixe = libelle.substring(0, 3);
    const categorieTexte = categorieId; 
    const reference = `REF-${libellePrefixe}-${categorieTexte}-X`; 

    this.ArticleForm.patchValue({ reference: reference });
  }
  

  rechercheFournisseur() {
    const nomFournisseurValue = this.ArticleForm.value.fournisseurId.toLowerCase();
  console.log(this.newCategorie);
  
    console.log(nomFournisseurValue);
    
    if (nomFournisseurValue.length >= 3) {
      const resultatsFiltres = this.newFournisseur.filter((objet) =>
        objet.nom_fournisseur.toLowerCase().startsWith(nomFournisseurValue)
      );
      console.log(resultatsFiltres);
      
      if (resultatsFiltres.length != null  ) {
        this.resultats = resultatsFiltres;
        this.showFournisseurs = true
      } 
    } 
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
  }

  estFournisseurSelectionne(fournisseur: number): boolean {
    return this.fournisseursSelectionnes.includes(fournisseur);
  }

  get libelleForm() {
    return this.ArticleForm.get('libelle');
  }

  submitForm(): void {

    
    if (this.ArticleForm.valid) {
      const formData = this.ArticleForm.value;

      
      const article: Article = {
        libelle: formData.libelle,
        prix: +formData.prix,
        stock: +formData.stock,
        categories_id: +formData.categorieId,
        fournisseur_id: this.fournisseursSelectionnes.length > 0 ? this.fournisseursSelectionnes : [],
      };
      
      this.buttonAjouter.emit(article);

      this.ArticleForm.reset();
      this.fournisseursSelectionnes = [];
      this.showFournisseurs = false;
    }
  }

  basculerAffichage(): void {
    this.showFournisseurs = !this.showFournisseurs;
    this.showInput = true
  }
}
