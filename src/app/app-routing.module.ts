import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { authGuard } from './guard/auth.guard';
import { FileListComponent } from './components/file-list/file-list.component';

const routes: Routes = [
  {
      path:'',
      redirectTo:'login',
      pathMatch: 'full'
  },
  {
      path:'login',
      component:LoginComponent
  },
  {
      path:'',
      component:LayoutComponent,
      children: [
          {
              path:'file-list',
              component:FileListComponent,
              canActivate: [authGuard]
          }
      ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
