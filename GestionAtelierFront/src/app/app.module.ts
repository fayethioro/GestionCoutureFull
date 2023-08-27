import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule} from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CategoriesComponent } from './categories/categories.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ArticleComponent } from './article/article.component';
import { AjouterArticleComponent } from './article/ajouter-article/ajouter-article.component';
import { AfficherArticleComponent } from './article/afficher-article/afficher-article.component';
import { ArticleVenteComponent } from './article-vente/article-vente.component';
import { HomeComponent } from './home/home.component';
import { AjoutArticleVenteComponent } from './article-vente/ajout-article-vente/ajout-article-vente.component';
import { AfficheArticleVenteComponent } from './article-vente/affiche-article-vente/affiche-article-vente.component';



@NgModule({
  declarations: [
    AppComponent,
    CategoriesComponent,
    ArticleComponent,
    AjouterArticleComponent,
    AfficherArticleComponent,
    ArticleVenteComponent,
    HomeComponent,
    AjoutArticleVenteComponent,
    AfficheArticleVenteComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
