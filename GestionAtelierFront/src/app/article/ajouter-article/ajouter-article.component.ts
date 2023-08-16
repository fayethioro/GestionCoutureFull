import { Component } from '@angular/core';
import { CategoriesServiceService } from '../../categories-service.service';
import { Categories } from '../../categories.model';
import { ArticleuServiceService } from '../../shared/service/articleu-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Article, Fournisseur } from '../../shared/interface/rest-response';
import { FournisseurServiceService } from '../../shared/service/fournisseur-service.service';

@Component({
  selector: 'app-ajouter-article',
  templateUrl: './ajouter-article.component.html',
  styleUrls: ['./ajouter-article.component.css'],
})
export class AjouterArticleComponent {
  newCategorie!: Categories[];

  newArticle!: Article[];

  newFournisseur!: Fournisseur[];

  ArticleForm!: FormGroup;

  resultats!: Fournisseur[];

  fournisseursSelectionnes: number[] = [];

  fournisseursSelectionnesText: string = '';

  constructor(
    private artServ: ArticleuServiceService,
    private fourServ: FournisseurServiceService,
    private fb: FormBuilder
  ) {
    this.ArticleForm = this.fb.group({
      libelle: ['', [Validators.required, Validators.minLength(3)]],
      prix: ['', [Validators.required, Validators.pattern(/^\d*$/)]],
      stock: [
        '',
        [Validators.required, Validators.min(1), Validators.pattern(/^\d*$/)],
      ],
      categorieId: ['', Validators.required],
      fournisseurId: [[], Validators.required],
    });
  }
  ngOnInit(): void {
    this.loadArticle();
  }

  loadArticle(): void {
    this.artServ.allArticle(1).subscribe((response) => {
      this.newArticle = response.data;
      console.log(response.fournisseurs);
      console.log(response.categories);
      this.newFournisseur = response.fournisseurs;
      this.newCategorie = response.categories;
    });
  }

  rechercheFournisseur() {
    const nomFournisseurValue = this.ArticleForm.value.fournisseurId.toLowerCase();
  
    if (nomFournisseurValue.length >= 3) {
      const resultatsFiltres = this.newFournisseur.filter((objet) =>
        objet.nom_fournisseur.toLowerCase().startsWith(nomFournisseurValue)
      );
      if (resultatsFiltres.length != null  ) {
        this.resultats = resultatsFiltres;
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
}
