import { Categories } from './../../categories.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Article, Fournisseur } from '../../shared/interface/rest-response';

@Component({
  selector: 'app-ajouter-article',
  templateUrl: './ajouter-article.component.html',
  styleUrls: ['./ajouter-article.component.css'],
})

export class AjouterArticleComponent implements OnInit {

  // ===================================== Communication enfant Parent ========================================
  
  @Input() newCategorie!: Categories[];

  @Input() newArticle!: Article[];

  @Input() newFournisseur!: Fournisseur[];

  @Output() buttonAjouter = new EventEmitter<FormData>();

  // ==================================== Variables =========================================

  ArticleForm!: FormGroup;

  resultats!: Fournisseur[];

  fournisseursSelectionnes: number[] = [];

  fournisseursSelectionnesText: string = '';

  showFournisseurs: boolean = true;
  showInput: boolean = true;
  showSpan: boolean = false;
  inputValue: string = '';

  selectedCaterigoriesLibelle = ''
  caterigoriesLibelle: string = ''; 


  profilePicSrc: string = 'assets/images/noprofil.jpg';
  

  file!:File;
  // ================================= Constructure ============================================

  constructor(private fb: FormBuilder) {
    this.ArticleForm = this.fb.group({
      libelle: ['', [Validators.required, Validators.minLength(3)]],
      prix: ['', [Validators.required, Validators.pattern(/^\d*$/)]],
      reference: [''],
      stock: ['',[Validators.required, Validators.min(1), Validators.pattern(/^\d*$/)]],
      categories_id: ['', Validators.required],
      photo: [null, [ Validators.pattern('^.+\.(jpg|jpeg|png)$')]],
      fournisseur_id: [[], Validators.required],
    });
  }
  // ======================================= OnInit() ======================================

  ngOnInit(): void {

    console.log("liste article" , this.newArticle);
    this.ArticleForm.get('libelle')?.valueChanges.subscribe((libelle) => {
      this.updateReference(libelle, '' , -1 );
    });

    const selectElement = document.querySelector('select') as HTMLSelectElement;
    selectElement.addEventListener('change', (event) => {
      const caterigoriesLibelle = this.onSelectChange(event);
      const occ= this.compterOccurrences(this.newArticle , +caterigoriesLibelle[1])
      
      this.updateReference(this.ArticleForm.get('libelle')?.value, caterigoriesLibelle[0] , occ);
    });
  }
  // ==================================== Recu^perer le libelle du categorie selectionner ======================================
  onSelectChange(event: Event) {
    // console.log("dfgh",this.ArticleForm.get('categories_id')?.value,);
    const selectElement = event.target as HTMLSelectElement;
    const selectedOption = selectElement.selectedOptions[0];
    const valeur = selectElement.value;
    this.selectedCaterigoriesLibelle = selectedOption.innerHTML;
    return [this.selectedCaterigoriesLibelle , valeur];
    
  }
  // =========================== Le nombre occurence d'un element dans un tableau =====================

  
  compterOccurrences(tableau: Article[], elementCible: number): number {
    return tableau.reduce((compteur, article) => {
      if (article.categories_id === elementCible) {
        compteur ++;
      }
      return compteur;
    },0);
  }
  // =========================================================== Charger photo ==================
  onFileChange(event: Event) {
    const filesTarget = event.target as HTMLInputElement;

    if (filesTarget.files) {
      this.file = filesTarget.files[0];
      if (this.file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.profilePicSrc = e.target.result;
        };
        reader.readAsDataURL(this.file);
      }
    }
  }
  // ================================= mettre a jour la reference  =============================================

  updateReference(libelle: string, caterigoriesLibelle?: string , varib?:number): void {
    console.log("liste article" , this.newArticle);

    const libellePrefixe = libelle.substring(0, 3);
    const categorieTexte = caterigoriesLibelle;
    const X = varib! + 1
    const reference = `REF-${libellePrefixe}-${categorieTexte}-${X}`;

    this.ArticleForm.patchValue({ reference: reference });
  }
  // =================================== Rechercher les fournisseur ==========================================

  rechercheFournisseur() {
    const nomFournisseurValue =
      this.ArticleForm.value.fournisseur_id.toLowerCase();
    console.log(this.newCategorie);

    console.log(nomFournisseurValue);

    if (nomFournisseurValue.length >= 3) {
      const resultatsFiltres = this.newFournisseur.filter((objet) =>
        objet.nom_fournisseur.toLowerCase().startsWith(nomFournisseurValue)
      );
      console.log(resultatsFiltres);

      if (resultatsFiltres.length != null) {
        this.resultats = resultatsFiltres;
        this.showFournisseurs = true;
      }
    }
  }

// =========================================  Gerer les check pour fournisseur ====================================

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
  // ================================  Est fournisseur selectionne =============================================

  estFournisseurSelectionne(fournisseur: number): boolean {
    return this.fournisseursSelectionnes.includes(fournisseur);
  }

  get libelleForm() {
    return this.ArticleForm.get('libelle');
  }
  // ========================================  Envoye le formulaire au parent =====================================

  submitForm() {

    console.log('ok');
    
    if (this.ArticleForm.invalid) {
      return;
    }
  
    
    const formData = new FormData();
    formData.append('libelle', this.ArticleForm.value.libelle);
    formData.append('prix', this.ArticleForm.value.prix);
    formData.append('stock', this.ArticleForm.value.stock);
    formData.append('categories_id', this.ArticleForm.value.categories_id);
    formData.append('photo', this.file, this.file.name); 
    formData.append('fournisseur_id',  this.fournisseursSelectionnes.join());
  
    console.log(formData);
  
    
    this.buttonAjouter.emit(formData); 

      this.ArticleForm.reset();
      this.fournisseursSelectionnes = [];
      this.profilePicSrc = 'assets/images/noprofil.jpg';
      this.showFournisseurs = false;
  }
  
  
  
  
  
  
  
  
  
}
