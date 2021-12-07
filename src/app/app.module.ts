import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { es_ES } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './shared/header/header.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//COMPONENTES DE ANGULAR
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AdministracionModule } from './administracion/administracion.module';
import { RouterModule } from '@angular/router';
import { ErrorPagesComponent } from './shared/error-pages/error-pages.component';
import { ClientesModule } from './reserva/clientes.module';

//DATA-TABLES
import { DataTablesModule } from "angular-datatables";
import { AuthLoginComponent } from './security/auth-login/auth-login.component';
import { AuthRegisterComponent } from './security/auth-register/auth-register.component';

import { PaqueteService } from './services/paquete.service';
import { UsuarioService } from './services/usuario.service';
import { PersonaService } from './services/persona.service';
import { TransaccionService } from './services/transaccion.service';
import { interceptorProvider } from './security/interceptors/paq-interceptor.service';
import { FooterComponent } from './shared/footer/footer.component';

// import { InformacionPagoComponent } from './home/informacion-pago/informacion-pago/informacion-pago.component';

registerLocaleData(es);

@NgModule({
  declarations: [
    AppComponent,
    ErrorPagesComponent,
    AuthLoginComponent,
    AuthRegisterComponent
    

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    BrowserAnimationsModule,
    NzButtonModule,
    AdministracionModule,
    ClientesModule,
    DataTablesModule,
    ReactiveFormsModule
    // SecurityModule
  ],
  providers: [{ provide: NZ_I18N, useValue: es_ES },
    PaqueteService,
    UsuarioService,
    PersonaService,
    TransaccionService,
    interceptorProvider],
  bootstrap: [AppComponent]
})
export class AppModule { }
