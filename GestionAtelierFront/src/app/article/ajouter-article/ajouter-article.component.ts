import { Categories } from './../../categories.model';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {
  Approvisionnement,
  Article,
  Fournisseur,
} from '../../shared/interface/rest-response';

@Component({
  selector: 'app-ajouter-article',
  templateUrl: './ajouter-article.component.html',
  styleUrls: ['./ajouter-article.component.css'],
})
export class AjouterArticleComponent implements OnInit, OnChanges {
  // ===================================== Communication enfant Parent ========================================

  @Input() newCategorie!: Categories[];

  @Input() newArticle!: Article[];

  @Input() editedArticle!: Article;

  @Input() newFournisseur!: Fournisseur[];

  @Input() listeArticles!: Article[];

  @Input() newApprovisionnement!: Approvisionnement[];

  @Output() buttonAjouter = new EventEmitter<FormData>();

  imageDirectoryPath: string = 'http://127.0.0.1:8000/storage';

  // ==================================== Variables =========================================

  ArticleForm!: FormGroup;

  resultats!: Fournisseur[];

  fournisseursSelectionnes: number[] = [];

  fournisseursSelectionnesText: string[] = [];

  fournisseur!: Fournisseur[];

  showFournisseurs: boolean = true;
  showInput: boolean = true;
  showSpan: boolean = false;
  inputValue: string = '';

  selectedCaterigoriesLibelle = '';
  caterigoriesLibelle: string = '';

  profilePicSrc: string = 'assets/images/noprofil.jpg';

  ajoutUpdate!: boolean;

  libExiste: boolean = false;

  file!: File;

  modeAjout! : boolean 
  // ================================= Constructure ============================================

  constructor(private fb: FormBuilder) {
    this.ArticleForm = this.fb.group({
      libelle: ['', [Validators.required, Validators.minLength(3)]],
      prix: ['', [Validators.required, Validators.pattern(/^\d*$/)]],
      reference: [''],
      stock: [
        '',
        [Validators.required, Validators.min(1), Validators.pattern(/^\d*$/)],
      ],
      categories_id: ['', Validators.required],
      photo: [null, [Validators.pattern('^.+.(jpg|jpeg|png)$')]],
      fournisseur_id: [[]],
    });
  }
  // ==============================Ng change ====================================================
  ngOnChanges(change: SimpleChanges): void {
    this.fournisseursSelectionnesText = [];
    this.fournisseursSelectionnes = [];

    if ('editedArticle' in change && !change['editedArticle'].firstChange) {
      this.ArticleForm.patchValue({
        libelle: this.editedArticle.libelle,
        reference: this.editedArticle.reference,
        prix: this.editedArticle.prix_total,
        stock: this.editedArticle.stock_total,
        categories_id: this.editedArticle.categories_id,
      });
      this.profilePicSrc =
        'http://127.0.0.1:8000/storage' + '/' + this.editedArticle.photo;
      const filtreAppro = this.newApprovisionnement.filter(
        (appro) => appro.article_id === this.editedArticle.id
      );
      filtreAppro.forEach((element) => {
        this.fournisseursSelectionnes.push(element.fournisseur_id);
      });
      this.fournisseursSelectionnes.forEach((element) => {
        let text = this.newFournisseur.filter((fou) => fou.id === element);
        this.fournisseursSelectionnesText.push(text[0].nom_fournisseur);
      });
    }
  }

  // ======================================= OnInit() ======================================

  ngOnInit(): void {
    this.ArticleForm.get('libelle')?.valueChanges.subscribe((libelle) => {
      this.updateReference(libelle, '', -1);
    });
    const selectElement = document.querySelector('select') as HTMLSelectElement;
    selectElement.addEventListener('change', (event) => {
      const caterigoriesLibelle = this.onSelectChange(event);
      const occ = this.compterOccurrences(
        this.newArticle,
        +caterigoriesLibelle[1]
      );

      this.updateReference(
        this.ArticleForm.get('libelle')?.value,
        caterigoriesLibelle[0],
        occ
      );
    });
  }
  // ==================================== Recu^perer le libelle du categorie selectionner ======================================
  onSelectChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedOption = selectElement.selectedOptions[0];
    const valeur = selectElement.value;
    this.selectedCaterigoriesLibelle = selectedOption.innerHTML;
    return [this.selectedCaterigoriesLibelle, valeur];
  }
  // =========================== Le nombre occurence d'un element dans un tableau =====================
  compterOccurrences(tableau: Article[], elementCible: number): number {
    return tableau.reduce((compteur, article) => {
      if (article.categories_id === elementCible) {
        compteur++;
      }
      return compteur;
    }, 0);
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

  updateReference(
    libelle: string,
    caterigoriesLibelle?: string,
    varib?: number
  ): void {
    const libellePrefixe = libelle.substring(0, 3);
    const categorieTexte = caterigoriesLibelle;
    const X = varib! + 1;
    const reference = `REF-${libellePrefixe}-${categorieTexte}-${X}`;

    this.ArticleForm.patchValue({ reference: reference });
  }
  // =========================================  rechercher libelle exite ====================================
  libelleExiste() {
    const articleExists = this.listeArticles.some(
      (article) => article.libelle === this.ArticleForm.value.libelle
    );
    if (articleExists) {
      return true;
    }
    return false;
  }

  // =================================== Rechercher les fournisseur ==========================================

  rechercheFournisseur() {
    const nomFournisseurValue =
      this.ArticleForm.value.fournisseur_id.toLowerCase();
    if (nomFournisseurValue.length >= 3) {
      const resultatsFiltres = this.newFournisseur.filter((objet) =>
        objet.nom_fournisseur.toLowerCase().startsWith(nomFournisseurValue)
      );
      if (resultatsFiltres.length != null) {
        this.resultats = resultatsFiltres;
        this.showFournisseurs = true;
      }
    }
  }

  // =========================================  Gerer les check pour fournisseur ====================================

  gererClicCheckbox(fournisseur: number): void {
    let fournisseursNom;
    let text;
    if (this.estFournisseurSelectionne(fournisseur)) {
      const index = this.fournisseursSelectionnes.indexOf(fournisseur);
      if (index !== -1) {
        this.fournisseursSelectionnes.splice(index, 1);

        text = this.newFournisseur.filter((fou) => fou.id === fournisseur);
        fournisseursNom = text.map((element) => element.nom_fournisseur);
        this.fournisseursSelectionnesText.splice(index, 1);
      }
    } else {
      this.fournisseursSelectionnes.push(fournisseur);

      text = this.newFournisseur.filter((fou) => fou.id === fournisseur);
      fournisseursNom = text.map((element) => element.nom_fournisseur);
      this.fournisseursSelectionnesText.push(fournisseursNom[0]);
    }
  }
  // ==================================== supprimer selection===================================================
  deleteCheck(fournisseur: string) {
    let fourReche = this.newFournisseur.find(
      (fou) => fou.nom_fournisseur === fournisseur
    );
    if (fourReche) {
      const index = this.fournisseursSelectionnes.indexOf(fourReche.id);
      this.fournisseursSelectionnesText.splice(index, 1);

      this.fournisseursSelectionnes.splice(index, 1);
    }
  }
  // ================================  Est fournisseur selectionne =============================================

  estFournisseurSelectionne(fournisseur: number): boolean {
    return this.fournisseursSelectionnes.includes(fournisseur);
  }
  // ====================================================================================================================
  get libelleForm() {
    return this.ArticleForm.get('libelle');
  }
  // ========================================  Envoye le formulaire au parent =====================================

  submitForm(): void {
    if (this.ArticleForm.invalid) {
      return;
    }
    if (!this.editedArticle) {
      console.log("edi",this.editedArticle);
      
      const formData = new FormData();
      formData.append('libelle', this.ArticleForm.value.libelle);
      formData.append('prix', this.ArticleForm.value.prix);
      formData.append('stock', this.ArticleForm.value.stock);
      formData.append('categories_id', this.ArticleForm.value.categories_id);
      formData.append('photo', this.file, this.file.name);
      formData.append('fournisseur_id', this.fournisseursSelectionnes.join());
      this.buttonAjouter.emit(formData);
      this.ArticleForm.reset();
      this.fournisseursSelectionnes = [];
      this.profilePicSrc = 'assets/images/noprofil.jpg';
      this.showFournisseurs = false;
      this.modeAjout = true;

    } else {
      console.log(this.editedArticle);
      
      const formData = new FormData();

      if (this.editedArticle.libelle !== this.ArticleForm.value.libelle) {
        formData.append('libelle', this.ArticleForm.value.libelle);
      }
      if (
        this.editedArticle.categories_id !==
        this.ArticleForm.value.categories_id
      ) {
        formData.append('categories_id', this.ArticleForm.value.categories_id);
      }
      if (this.editedArticle.prix !== this.ArticleForm.value.prix) {
        formData.append('prix', this.ArticleForm.value.prix);
      }
      if (this.editedArticle.stock !== this.ArticleForm.value.stock) {
        formData.append('stock', this.ArticleForm.value.stock);
      }

      if (this.ArticleForm.value.photo != null) {
        const originalPath = this.ArticleForm.value.photo;
        const newPath = originalPath.replace('C:\\fakepath\\', 'articles/');
        if (this.editedArticle.photo !== newPath) {
          formData.append('photo', this.file, this.file.name);
        }
      }
      const filtreAppro = this.newApprovisionnement.filter(
        (appro) => appro.article_id === this.editedArticle.id
      );
      const fourA: number[] = filtreAppro.map(
        (element) => element.fournisseur_id
      );
      console.log("appov",fourA);
      console.log(this.fournisseursSelectionnes);
      
      const estEgal =
        fourA.length === this.fournisseursSelectionnes.length &&
        fourA.every(
          (value, index) => value === this.fournisseursSelectionnes[index]
        );
        console.log(estEgal);
        
      if (!estEgal) {
        formData.append('fournisseur_id', this.fournisseursSelectionnes.join());
      }
      else{
        formData.append('fournisseur_id', fourA.join());

      }
      
      this.buttonAjouter.emit(formData);
      this.ArticleForm.reset();
      this.fournisseursSelectionnesText = [];
      this.fournisseursSelectionnes = [];
      this.profilePicSrc = 'assets/images/noprofil.jpg';
      this.showFournisseurs = false;
      
     
    }
  }
}
