import { PrincipalService } from './../services/principal.service';
import { AuthInterceptor } from './../auth/auth.interceptor';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from './../services/auth.service';
import { UserAuthenticated } from './../auth/UserAuthenticated.guard';
import { AreaLogadaRoutingModule } from './routes/area-logada-routing';
import { PrincipalComponent } from './../views/area-logada/principal/principal.component';
import { AreaLogadaComponent } from './../views/area-logada/area-logada.component';
import { AppRoutingModule } from './routes/app.routing';
import { LoginComponent } from './../views/login/login.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxMaskModule } from 'ngx-mask';

import { AppComponent } from '../views/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AreaLogadaComponent,
    PrincipalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AreaLogadaRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxMaskModule.forRoot()
  ],
  providers: [
    UserAuthenticated,
    AuthService,
    PrincipalService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
