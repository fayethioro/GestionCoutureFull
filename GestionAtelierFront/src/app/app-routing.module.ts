import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesComponent } from './categories/categories.component';
import { ArticleComponent } from './article/article.component';

const routes: Routes = [
  {"path" : "categories", component : CategoriesComponent},
  {"path" : "articles", component : ArticleComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
