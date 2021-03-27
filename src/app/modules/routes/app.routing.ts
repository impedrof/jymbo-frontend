import { UserAuthenticated } from 'src/app/auth/UserAuthenticated.guard';
import { NgModule } from '@angular/core';
import { LoginComponent } from './../../views/login/login.component';
import { RouterModule, Routes } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: '', redirectTo: '/principal', pathMatch: 'full' },
      {
        path: 'login',
        component: LoginComponent,
      },
    ]),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
