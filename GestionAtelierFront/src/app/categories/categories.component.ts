import { CategoriesServiceService } from './../categories-service.service';
import { Categories } from './../categories.model';
import { Component } from "@angular/core";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-categories",
  templateUrl: "./categories.component.html",
  styleUrls: ["./categories.component.css"],
})
export class CategoriesComponent {
  // newCategorie!: Categories[];
  tabSelect: number[] = [];

  ok :boolean = false
  currentPage: number = 1;
  totalPage!: number;

  newCategorie! : Categories[];
  categorieForm!: FormGroup;

  ajout: boolean = false;
  buttonDelete: boolean = false;
  selectAll: boolean = false;
  
  errorMessage:string =  '';
  
  selectedCategorie: Categories | null = null;
  categorieIdUpdate: number | null = null;


  rechercheEffectuee!: boolean ;

  checkAll = false

  constructor(private _categoriesservice: CategoriesServiceService,private fb: FormBuilder) {
    this.categorieForm = this.fb.group({
      libelle: this.fb.control("", [
        Validators.required,
        Validators.minLength(3),
      ]),
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }



  loadCategories(): void {
    this._categoriesservice.getPagination(this.currentPage).subscribe((response) => {
        console.log(response.data.data);
        
      this.newCategorie = response.data.data;
      //   // this.totalPage = response.data.data.total / 3;
        this.currentPage = response.data.current_page;
      });
     
  }
  
  goToNextPage(): void {
    if (this.currentPage >= 10) {
      return;
    }
    this.currentPage++;
    this.loadCategories();
  }

  goToPrevPage(): void {
    if (this.currentPage <= 1) {
      return;
    }
    this.currentPage--;
    this.loadCategories();
  }



  goToPage(page: number): void {
    this.currentPage = page;
    this.loadCategories();
  }

  addCategorie() {
    const libelleValue = this.categorieForm.value.libelle;
    this._categoriesservice.addCategorieForm(this.categorieForm.value).subscribe(Response => {
          alert("Categorie ajouter avec succes")
          this.categorieForm.get('libelle')!.setValue("");
          this.loadCategories()
    },
      error => {
        this.errorMessage = error.error.message
      }
    );
  }

  effacerMessageErreur() {
    this.errorMessage = '';
  }

  changeButton() {
    this.ajout = !this.ajout;
  }

  changeSelectedDelete(event: Event, id: number) {
    if (event.target && "checked" in event.target) {
      if (event.target.checked) {
        this.tabSelect.push(id); 
        console.log(this.tabSelect);
      } else {
        this.selectAll = false
        const index = this.tabSelect.indexOf(id);
        if (index !== -1) {
          this.tabSelect.splice(index, 1);
          console.log(this.tabSelect);
        }
      }
    }
    if (this.tabSelect.length === this.newCategorie.length) {
      this.selectAll = true
    }
    
    this.buttonDelete = this.tabSelect.length !== 0; 
  }
  
  editCategorie(libelle: string, id: number) {
    this.selectedCategorie = { id: id, libelle: libelle };
    this.categorieForm.patchValue({ libelle: libelle }); 
    this.ajout= false
  }
 
  rechercheCategorie() {
    const libelleValue = this.categorieForm.value.libelle;
    this._categoriesservice.rechercheCategorieForm(libelleValue).subscribe(Response => {
        console.log(Response.data);
        if (Response.data === null) {
          this.rechercheEffectuee =  true
        }
        else{
          this.rechercheEffectuee =  false
        }
    }
  );
  }
  addOrUpdateCategorie() {
    if (this.selectedCategorie !== null) {
      const libelleUpdated = this.categorieForm?.value.libelle
      const categoriesUpdated = { id: this.selectedCategorie.id, libelle: libelleUpdated }

      console.log(libelleUpdated);
      
      this._categoriesservice.updateCategorieForm(this.selectedCategorie.id, { id: this.selectedCategorie.id, libelle: libelleUpdated } ).subscribe(
        response => {
          console.log(response);
          
          alert('Catégorie mise à jour avec succès');
          this.selectedCategorie = null; 
          this.categorieForm.patchValue({ libelle: '' }); 
          this.loadCategories();

        },
      error => {
        this.errorMessage = error.error.message
        console.log(error.error);
        console.log(this.errorMessage)
      }
      );
    }
    else{
      this.addCategorie()
    }
  }

  toggleSelectAll() {
      this.selectAll = !this.selectAll
    console.log(this.selectAll);
    this.tabSelect =[]
    if (this.selectAll) {
      this.tabSelect = this.newCategorie.map(categorie => categorie.id);
      console.log(this.tabSelect);
      this.buttonDelete = this.tabSelect.length !== 0;
    }  
    else{
      this.buttonDelete = false
    }
  }

  deleteCategorie() {
    const libelleValue = this.categorieForm.value.libelle;
    console.log(libelleValue);
    console.log(this.categorieForm.value);
    this._categoriesservice.deleteCategorieSelect(this.tabSelect).subscribe(Response => {
          alert("suppression reussi")
          this.loadCategories();
    },
      error => {
        this.errorMessage = error.error.message
      }
    );
  }
  
  
  get libelleForm() {
    return this.categorieForm.get("libelle");
  }
}
