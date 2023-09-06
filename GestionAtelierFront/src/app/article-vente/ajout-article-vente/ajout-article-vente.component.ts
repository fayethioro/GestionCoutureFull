import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { Categories } from "src/app/categories.model";
import { Article, ArticleVente } from "src/app/shared/interface/rest-data";

@Component({
  selector: "app-ajout-article-vente",
  templateUrl: "./ajout-article-vente.component.html",
  styleUrls: ["./ajout-article-vente.component.css"],
})
export class AjoutArticleVenteComponent implements OnInit, OnChanges {
  // ===================================== communication parent => enfant===========================================
  @Input() categoriesVente!: Categories[];
  @Input() newArticleConfection!: Article[];
  @Input() listeArticles!: ArticleVente[];
  @Input() editedArticle!: ArticleVente;
  @Input() mode!: boolean;

  // ===================================== communication enfant => parent===========================================
  @Output() buttonAjouter = new EventEmitter<FormData>();

  // ======================================== Variable ===============================================================
  ArticleVenteFormGroup!: FormGroup;

  checkPromo: boolean = false;
  showArticles: boolean = true;

  resultats!: Article[];
  resul!: Article;

  file!: File;

  profilePicSrc: string = "assets/images/noprofil.jpg";
  selectedRowIndex: number | null = null;
  errorMessage: string = "";
  errorMessageFormArray: string = "";

  selectedCaterigoriesLibelle = "";
  caterigoriesLibelle: string = "";
  coutFabrication: number = 0;

  deseabledQuantite: boolean = false;

  articleCategorie: string[] = [];

  allElementsInSelectedCategories!: boolean;
  ArticleForm: any;

  prixVente: number = 0;

  // ================================= Constructure =================================================================
  constructor(private fb: FormBuilder) {
    this.ArticleVenteFormGroup = this.fb.group({
      libelle: ['', [Validators.required, Validators.minLength(3)]],
      reference: [''],
      categories_id: ['', Validators.required],
      promo: [''],
      valeur_promo: ['', Validators.max(100)],
      photo: [null, [Validators.pattern("^.+.(jpg|jpeg|png)$")]],
      articleConf: this.fb.array([]),
      cout_fabrication: [''],
      marge_article: ['', [Validators.required, this.margeArticleValidator()]],
      prix_vente: [''],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ("editedArticle" in changes && !changes["editedArticle"].firstChange) {
      this.updateArticleForm(this.editedArticle);
    }
  }
  private updateArticleForm(editedArticle: any) {
    const articlesArray = this.ArticleVenteFormGroup.get(
      "articleConf"
    ) as FormArray;
    const formValues = {
      libelle: editedArticle.libelle,
      reference: editedArticle.reference,
      categories_id: editedArticle.categories_id,
      promo: editedArticle.promo,
      valeur_promo: editedArticle.valeur_promo,
      cout_fabrication: editedArticle.cout_fabrication,
      marge_article: editedArticle.marge_article,
      prix_vente: editedArticle.prix_vente,
    };

    if (!editedArticle.promo) {
      this.checkPromo = false;
    }

    while (articlesArray.length) {
      articlesArray.removeAt(0);
    }

    this.ArticleVenteFormGroup.patchValue(formValues);
    this.profilePicSrc =
      "http://127.0.0.1:8000/storage" + "/" + editedArticle.photo;

    this.editedArticle.articles.forEach((article) => {
      articlesArray.push(this.createArticleFormGroup());
      const articleFormGroup = articlesArray.at(articlesArray.length - 1);
      articleFormGroup.patchValue({
        id: article.article_id,
        libelles: article.libelle,
        quantites: article.quantite,
      });
    });

    this.allElementsInSelectedCategories = true;
    this.coutFabrication = editedArticle.cout_fabrication;
  }
  // ======================================= OnInit() ==========================================================

  ngOnInit(): void {
    this.ArticleVenteFormGroup.get("libelle")?.valueChanges.subscribe(
      (libelle) => {
        this.updateReference(libelle, "", -1);
      }
    );
    const selectElement = document.querySelector("select") as HTMLSelectElement;
    selectElement.addEventListener("change", (event) => {
      const caterigoriesLibelle = this.onSelectChange(event);
      const occ = this.compterOccurrences(
        this.listeArticles,
        +caterigoriesLibelle[1]
      );
      this.updateReference(
        this.ArticleVenteFormGroup.get("libelle")?.value,
        caterigoriesLibelle[0],
        occ
      );
    });
  }
  // ============================== create formarray =======================================================
  createArticleFormGroup(): FormGroup {
    return this.fb.group({
      id: [""],
      libelles: ["", Validators.required],
      quantites: [
        "",
        [Validators.required, Validators.min(1), Validators.pattern(/^\d*$/)],
      ],
    });
  }
  // ================= ajout et delete dns le formarray==============================================================
  addArticleV() {
    const newArticleFormGroup = this.createArticleFormGroup();
    this.articleConf.push(newArticleFormGroup);
    this.resultats = [];
    this.errorMessage = "";

    const newArticleForm = this.articleConf.at(this.articleConf.length - 1);

    if (newArticleForm.get("libelles")!.invalid) {
      newArticleForm.get("quantites")!.disable();
    }

    newArticleForm.get("libelles")!.valueChanges.subscribe(() => {
      if (newArticleForm.get("libelles")!.invalid) {
        newArticleForm.get("quantites")!.disable();
        newArticleForm.patchValue({ quantites: "" });
      }
      if (newArticleForm.get("libelles")!.valid) {
        newArticleForm.get("quantites")!.enable();
      }
    });
  }

  removeItem(index: number) {
    const quan = this.articleConf.at(index).get("quantites")?.value;

    this.articleConf.removeAt(index);

    if (this.resul.prix_total) {
      let prix = this.resul.prix_total * quan;
      this.coutFabrication -= prix;
      this.ArticleVenteFormGroup.patchValue({
        cout_fabrication: this.coutFabrication,
      });
      if (this.articleConf.length === 0) {
        this.ArticleVenteFormGroup.patchValue({ cout_fabrication: "" });
      }
    }
  }

  // ======================================marge_article===========================================================
  margeArticleValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const marge = control.value;
      if (marge < 5000 || marge > this.cout_fabrication!.value) {
        return { margeInvalid: true };
      }
      return null;
    };
  }
  // =========================================  rechercher libelle exite ====================================
  libelleExiste() {
    if (this.listeArticles) {
      const libelleSaisi = this.ArticleVenteFormGroup.value.libelle.toLowerCase();
      const articleExists = this.listeArticles.some(
        (article) => article.libelle.toLowerCase() === libelleSaisi
      );
      return articleExists;
    }

    return false;
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
    this.resultats = [];
    const arTarget = event.target as HTMLInputElement;
    if (arTarget.value) {
      const query = arTarget.value;
      const libelleArticle = query.toLowerCase();
      if (libelleArticle.length >= 3) {
        const resultatsFiltres = this.filtrerArticles(libelleArticle);
        if (resultatsFiltres.length > 0) {
          this.gererResultatRechercheValide(index, resultatsFiltres);
        } else {
          this.gererResultatRechercheInvalide(index);
        }
      } else {
        this.gererSaisieRechercheInvalide(index);
      }
    }
  }

  filtrerArticles(libelleArticle: string): Article[] {
    return this.newArticleConfection.filter((objet) =>
      objet.libelle.toLowerCase().startsWith(libelleArticle)
    );
  }

  gererResultatRechercheValide(
    index: number,
    resultatsFiltres: Article[]
  ): void {
    this.resultats = resultatsFiltres;
    this.showArticles = true;
    this.selectedRowIndex = index;

    const articleFormGroup = this.articleConf.at(index);
    if (articleFormGroup.get("quantites")!.invalid) {
      articleFormGroup.get("quantites")!.setValue("");
    }
    articleFormGroup.get("libelles")!.setErrors(null); // Réinitialise les erreurs
  }

  gererResultatRechercheInvalide(index: number): void {
    const articleFormGroup = this.articleConf.at(index);
    articleFormGroup.get("quantites")!.setValue("");
    articleFormGroup.get("quantites")!.disable();
    articleFormGroup.get("libelles")!.setErrors({ articleInexistant: true });
  }

  gererSaisieRechercheInvalide(index: number): void {
    const articleFormGroup = this.articleConf.at(index);
    articleFormGroup.get("quantites")!.setValue("");
    articleFormGroup.get("quantites")!.disable();
    this.errorMessage = "";
    articleFormGroup.get("libelles")!.setErrors({ saisieInvalide: true });
  }

  // ============================ ajout article dans le patchValue=======================
  selectResult(result: Article, index: number) {
    const libellesControl = this.articleConf.at(index).get("libelles");
    const idControl = this.articleConf.at(index).get("id");
    this.resul = result;
    libellesControl!.setValue(result.libelle);
    idControl!.setValue(result.id);
    this.deseabledQuantite = false;
    this.resultats = [];
    this.showArticles = false;
    this.selectedRowIndex = null;
  }
  // ============================================== Reference ========================================================
  updateReference(
    libelle: string,
    caterigoriesLibelle?: string,
    varib?: number
  ): void {
    const libellePrefixe = libelle.substring(0, 3);
    const categorieTexte = caterigoriesLibelle;
    const X = varib! + 1;
    const reference = `REF-${libellePrefixe}-${categorieTexte}-${X}`;
    this.ArticleVenteFormGroup.patchValue({ reference: reference });
  }
  //============================================= cout fabrication====================================================
  chargementPrix(index: number, event: Event) {
    const quan = this.articleConf.at(index).get("quantites")?.value;

    if (this.resul.prix_total) {
      let prix = this.resul.prix_total * quan;
      this.coutFabrication += prix;
      this.ArticleVenteFormGroup.patchValue({
        cout_fabrication: this.coutFabrication,
      });
    }
  }
  // ===================================================== charger prix de vente=========================================
  chargementPrixVente() {
    if (this.marge_article!.valid) {
      const quan = this.marge_article!.value;
      this.prixVente = this.coutFabrication + quan;
      this.ArticleVenteFormGroup.patchValue({ prix_vente: this.prixVente });
    }
  }
  // ========================================= Les getters ================================================================

  get libelle() {
    return this.ArticleVenteFormGroup.get("libelle");
  }
  get photo() {
    return this.ArticleVenteFormGroup.get("photo");
  }

  get articleConf(): FormArray {
    return this.ArticleVenteFormGroup.get("articleConf") as FormArray;
  }
  get marge_article() {
    return this.ArticleVenteFormGroup.get("marge_article");
  }
  get prix_vente() {
    return this.ArticleVenteFormGroup.get("prix_vente");
  }
  get valeur_promo() {
    return this.ArticleVenteFormGroup.get("valeur_promo");
  }
  get cout_fabrication() {
    return this.ArticleVenteFormGroup.get("cout_fabrication");
  }
  // ================================ Methode add article vente =======================================================

  addArticleVente() {
    const formData = new FormData();

    formData.append("libelle", this.ArticleVenteFormGroup.value.libelle);
    formData.append(
      "categories_id",
      this.ArticleVenteFormGroup.value.categories_id
    );
    if (!this.checkPromo) {
      formData.append("promo", "0");
    } else {
      formData.append("promo", "1");
      formData.append(
        "valeur_promo",
        this.ArticleVenteFormGroup.value.valeur_promo
      );
    }
    formData.append("photo", this.file, this.file.name);
    formData.append(
      "articleConf",
      JSON.stringify(this.ArticleVenteFormGroup.value.articleConf)
    );
    formData.append(
      "marge_article",
      this.ArticleVenteFormGroup.value.marge_article
    );

    this.buttonAjouter.emit(formData);

    this.libelleExiste();
    this.mode = false;
  }

  //  ================== ===== Update ==============================================================
  updateArticleVente() {
    const formData = new FormData();

    if (
      this.editedArticle.libelle !== this.ArticleVenteFormGroup.value.libelle
    ) {
      formData.append("libelle", this.ArticleVenteFormGroup.value.libelle);
    }
    formData.append(
      "categories_id",
      this.ArticleVenteFormGroup.value.categories_id
    );
    if (!this.checkPromo) {
      formData.append("promo", "0");
    } else {
      formData.append("promo", "1");
      formData.append(
        "valeur_promo",
        this.ArticleVenteFormGroup.value.valeur_promo
      );
    }
    if (this.ArticleVenteFormGroup.value.photo != null) {
      const originalPath = this.ArticleVenteFormGroup.value.photo;
      const newPath = originalPath.replace("C:\\fakepath\\", "articles/");
      if (this.editedArticle.photo !== newPath) {
        formData.append("photo", this.file, this.file.name);
      }
    }
    formData.append(
      "articleConf",
      JSON.stringify(this.ArticleVenteFormGroup.value.articleConf)
    );
    formData.append(
      "marge_article",
      this.ArticleVenteFormGroup.value.marge_article
    );

    this.buttonAjouter.emit(formData);
  }
  // ==============================submit=============================================================================
  onSubmit() {
    if (!this.editedArticle) {
      this.addArticleVente();
     
      this.mode = false;
    } else {
      this.updateArticleVente();
    

      
    }
  }

  
}
