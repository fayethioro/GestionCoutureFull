import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesComponent } from './categories/categories.component';
import { ArticleComponent } from './article/article.component';
import { ArticleVenteComponent } from './article-vente/article-vente.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {"path" : "categories", component : CategoriesComponent},
  {"path" : "articles", component : ArticleComponent},
  {"path" : "article_vente", component : ArticleVenteComponent},
  {"path" : "home", component : HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
