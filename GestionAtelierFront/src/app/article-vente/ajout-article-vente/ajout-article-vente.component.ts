import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Categories } from 'src/app/categories.model';
import { Article, ArticleVente } from 'src/app/shared/interface/rest-data';

@Component({
  selector: 'app-ajout-article-vente',
  templateUrl: './ajout-article-vente.component.html',
  styleUrls: ['./ajout-article-vente.component.css'],
})
export class AjoutArticleVenteComponent implements OnInit,  OnChanges {
  // ===================================== communication parent => enfant===========================================
  @Input() categoriesVente!: Categories[];
  @Input() newArticleConfection!: Article[];
  @Input() listeArticles!: ArticleVente[];
  @Input() editedArticle!: ArticleVente;
  @Input() mode!: boolean ;



  // ===================================== communication enfant => parent===========================================
  @Output() buttonAjouter = new EventEmitter<FormData>();

// ======================================== Variable ===============================================================
  ArticleVenteFormGroup!: FormGroup;

  checkPromo: boolean = false;
  showArticles: boolean = true;
  
  resultats!: Article[];
  resul! : Article
  
  file!: File;
  
  profilePicSrc: string = 'assets/images/noprofil.jpg';
  selectedRowIndex: number | null = null; 
  errorMessage:string = '' ;
  errorMessageFormArray:string = '' ;

  selectedCaterigoriesLibelle = '';
  caterigoriesLibelle: string = '';
  coutFabrication :number = 0;

  deseabledQuantite :boolean = false

  articleCategorie : string[] = []

  allElementsInSelectedCategories! :boolean 
  ArticleForm: any;

  // ================================= Constructure =================================================================
  constructor(private fb: FormBuilder) {
    this.ArticleVenteFormGroup = this.fb.group({
      libelle: ['', [Validators.required, Validators.minLength(3)]],
      reference: [''],
      categories_id: ['', Validators.required],
      promo:[''],
      valeur_promo:[''],
      photo: [null, [Validators.pattern('^.+.(jpg|jpeg|png)$')]],
      articleConf: this.fb.array([]),
      // articleConf: this.fb.array([], [this.validateCategories()]), 
      cout_fabrication: [''],
      marge_article: ['', [Validators.required, this.margeArticleValidator.bind(this)]],
      prix_vente:['']
    });
   
  }
  ngOnChanges(changes: SimpleChanges): void {
    const articlesArray = this.ArticleVenteFormGroup.get('articleConf') as FormArray;
    while (articlesArray.length) {
      articlesArray.removeAt(0);
    }
    if ('editedArticle' in changes && !changes['editedArticle'].firstChange) {
      this.ArticleVenteFormGroup.patchValue({
        libelle: this.editedArticle.libelle,
        reference: this.editedArticle.reference,
        categories_id: this.editedArticle.categories_id,
        promo: this.editedArticle.promo,
        valeur_promo: this.editedArticle.valeur_promo,
        cout_fabrication: this.editedArticle.cout_fabrication,
        marge_article: this.editedArticle.marge_article,
        prix_vente: this.editedArticle.prix_vente,
      });
      this.profilePicSrc ='http://127.0.0.1:8000/storage' + '/' + this.editedArticle.photo;
      const articlesArray = this.articleConf;

      this.editedArticle.articles.forEach((article) => {
      articlesArray.push(this.createArticleFormGroup());
      const articleFormGroup = articlesArray.at(articlesArray.length - 1); 
      articleFormGroup.patchValue({
        id: article.id,
        libelles: article.libelle,
        quantites: article.quantite,
      });
    });

      
    }
  }
   // ======================================= OnInit() ==========================================================

   ngOnInit(): void {
    this.ArticleVenteFormGroup.get('libelle')?.valueChanges.subscribe((libelle) => {
      this.updateReference(libelle, '', -1);
    });
    const selectElement = document.querySelector('select') as HTMLSelectElement;
    selectElement.addEventListener('change', (event) => {
      const caterigoriesLibelle = this.onSelectChange(event);
      const occ = this.compterOccurrences(this.listeArticles,+caterigoriesLibelle[1]);
      this.updateReference(this.ArticleVenteFormGroup.get('libelle')?.value,caterigoriesLibelle[0],occ);
    });

  }
  // ============================== create formarray =======================================================
  createArticleFormGroup(): FormGroup {
    return this.fb.group({
      id: [''],
      libelles: ['', Validators.required],
      quantites: [
        '',
        [Validators.required, Validators.min(1), Validators.pattern(/^\d*$/)],
      ],
    });
  }
  // ================= ajout et delete dns le formarray==============================================================
  addArticleV() {
    const newArticleFormGroup = this.createArticleFormGroup();
    this.articleConf.push(newArticleFormGroup);
    this.resultats = [];
    this.errorMessage = '';
  }
  
  removeItem(index: number) {
  const quan = this.articleConf.at(index).get('quantites')?.value;

    this.articleConf.removeAt(index);

    if (this.resul.prix_total) {
      let prix = this.resul.prix_total * quan
      this.coutFabrication -= prix
    this.ArticleVenteFormGroup.patchValue({cout_fabrication : this.coutFabrication});
    if (this.articleConf.length === 0) {
    this.ArticleVenteFormGroup.patchValue({cout_fabrication : ""});
    }
    }
    
  }

// ======================================marge_article===========================================================
margeArticleValidator(control: AbstractControl): ValidationErrors | null {
  const marge = control.value;
  if (marge < 5000 || marge > (this.coutFabrication * 3)) {
    return { 'margeInvalid': true }; 
  }
  return null; 
}
// ====================================== Validation categorie article confection ===============================

validationCategories(){
  let requiredCategories: string[] = ['tissu', 'bouton', 'fil'];
  this.articleCategorie.push(this.resul.categorie.libelle) 

  const allElementsInSelected = requiredCategories.every(item =>
    this.articleCategorie.includes(item)
  );
  if (allElementsInSelected) {
     this.allElementsInSelectedCategories = true 
  }
  else{
    this.allElementsInSelectedCategories = false
  }
}
// ====================================valid
validateCategories(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const requiredCategories: string[] = ['tissu', 'bouton', 'fil'];
    const articleCategorie = control.value;
    // console.log(control);
    const allElementsInSelected = requiredCategories.every(item =>
      articleCategorie.includes(item)
    );

    return allElementsInSelected ? null : { 'invalidCategories': true };
  };
}

// =========================================  rechercher libelle exite ====================================
libelleExiste() {

  if (this.listeArticles) {
    const articleExists = this.listeArticles.some(
      (article) => article.libelle === this.ArticleVenteFormGroup.value.libelle
    );
    if (articleExists) {
     return true;
   }
   return false;
  }
    return;
 }
   // ==================================== Recu^perer le libelle du categorie selectionner ======================================
   onSelectChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedOption = selectElement.selectedOptions[0];
    const valeur = selectElement.value;
    this.selectedCaterigoriesLibelle = selectedOption.innerHTML;
    return [this.selectedCaterigoriesLibelle, valeur];
  }
  // =========================== Le nombre occurence d'un element dans un tableau ==========================================
  compterOccurrences(tableau: ArticleVente[], elementCible: number): number {
    return tableau.reduce((compteur, article) => {
      if (article.categories_id === elementCible) {
        compteur++;
      }
      return compteur;
    }, 0);
  }
  // =========================================================== Charger photo =================================================
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
  // =================================== Rechercher les article de vente ==========================================

rechercherArticleConfection(index: number, event: Event) {
  const arTarget = event.target as HTMLInputElement;
  if (arTarget.value) {
    const query = arTarget.value;
  const libelleArticle = query.toLowerCase();

    if (libelleArticle.length >= 3) {
      const resultatsFiltres = this.newArticleConfection
        .filter((objet) => objet.libelle.toLowerCase().startsWith(libelleArticle))
      if (resultatsFiltres.length > 0) {
        this.resultats = resultatsFiltres;
        this.showArticles = true;
        //  l'index de la ligne en cours de recherche
        this.selectedRowIndex = index; 
      }
      else{
        this.errorMessage = "Ce article n'existe pas"
      }
    } 
    
  }
}
// ============================ ajout article dans le patchValue=======================
selectResult(result: Article, index: number) {
  const libellesControl = this.articleConf.at(index).get('libelles');
  const idControl = this.articleConf.at(index).get('id');
  this.resul = result
  libellesControl!.setValue(result.libelle);
  idControl!.setValue(result.id);
  this.validationCategories()
  this.deseabledQuantite = false

  this.resultats = [];
  this.showArticles = false;
  this.selectedRowIndex = null;
}
// ============================================== Reference ========================================================
updateReference(libelle: string,caterigoriesLibelle?: string,varib?: number): void {
  const libellePrefixe = libelle.substring(0, 3);
  const categorieTexte = caterigoriesLibelle;
  const X = varib! + 1;
  const reference = `REF-${libellePrefixe}-${categorieTexte}-${X}`
  this.ArticleVenteFormGroup.patchValue({ reference: reference });
}
//============================================= cout fabrication====================================================
chargementPrix(index:number,event:Event){
  const quan = this.articleConf.at(index).get('quantites')?.value;

  if (this.resul.prix_total) {
    let prix = this.resul.prix_total * quan
    this.coutFabrication += prix
  this.ArticleVenteFormGroup.patchValue({cout_fabrication : this.coutFabrication});
  }
}
// ===================================================== charger prix de vente=========================================
chargementPrixVente(){
 if (this.marge_article!.valid) {
   const quan = this.marge_article!.value;
   let prixVente = this.coutFabrication + quan
   this.ArticleVenteFormGroup.patchValue({prix_vente : prixVente});
 }
}
  // ========================================= Les getters ================================================================

  get libelle() {
    return this.ArticleVenteFormGroup.get('libelle');
  }
  get photo() {
    return this.ArticleVenteFormGroup.get('photo');
  }

  get articleConf(): FormArray {
    return this.ArticleVenteFormGroup.get('articleConf') as FormArray;
  }
  get marge_article() {
    return this.ArticleVenteFormGroup.get('marge_article') ;
  }
  get prix_vente() {
    return this.ArticleVenteFormGroup.get('prix_vente') ;
  }
  // ================================ Methode add article vente =======================================================

  addArticleVente(){
    const formData = new FormData();

formData.append('libelle', this.ArticleVenteFormGroup.value.libelle);
formData.append('categories_id', this.ArticleVenteFormGroup.value.categories_id);
if (!this.checkPromo) {formData.append('promo', '0');}
else{
  formData.append('promo', '1');
  formData.append('valeur_promo', this.ArticleVenteFormGroup.value.valeur_promo);
}
formData.append('photo', this.file, this.file.name);
formData.append('articleConf', JSON.stringify(this.ArticleVenteFormGroup.value.articleConf));
formData.append('marge_article', this.ArticleVenteFormGroup.value.marge_article);
this.buttonAjouter.emit(formData);
this.mode = false;

 }
  // ==============================submit=============================================================================
  onSubmit() {
    if (!this.allElementsInSelectedCategories) {
        this.errorMessageFormArray = "L'ArticleVente doit contenir au moins trois articles des catégories Tissu, bouton et fil."
    }
    else{
      this.addArticleVente()
    }
  }
  
}
