import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormPagoTotalComponent } from './reserva/pages/pagos/form-pago-total/form-pago-total.component';
import { FormPagosComponent } from './reserva/pages/pagos/form-pagos/form-pagos.component';
import { PasswordResetComponent } from './security/password-reset/password-reset.component';
import { ErrorPagesComponent } from './shared/error-pages/error-pages.component';

const routes: Routes = [
  {
    path:"pago",component:FormPagosComponent
  },
  {
    path:"pago/:idPaq",component:FormPagosComponent

  },
  {
    path:"pagoTotal/:idPaq",component:FormPagoTotalComponent

  },
  {
    path:"administracion",
    loadChildren: ()=> import("./administracion/administracion.module").then( m => m.AdministracionModule)
  },
  {
    path:"",
    loadChildren: ()=> import("./reserva/clientes.module").then(m => m.ClientesModule)
  },
  {path:"404", component:ErrorPagesComponent},
  {path:"**", redirectTo:""},
  // {path:"reset-password", loadChildren: ()=> import("./security/password-reset/password-reset.component").then(m => m.PasswordResetComponent)},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
