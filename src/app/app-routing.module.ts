import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard } from './guard/auth.guard';

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
              path:'dashboard',
              component:DashboardComponent,
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
