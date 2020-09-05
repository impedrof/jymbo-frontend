import { UserAuthenticated } from './../../auth/UserAuthenticated.guard';
import { PrincipalComponent } from './../../views/area-logada/principal/principal.component';
import { AreaLogadaComponent } from './../../views/area-logada/area-logada.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'principal',
        component: AreaLogadaComponent,
        canActivate: [UserAuthenticated],
        children: [{ path: '', component: PrincipalComponent }],
      },
    ]),
  ],
  exports: [RouterModule],
})
export class AreaLogadaRoutingModule {}
