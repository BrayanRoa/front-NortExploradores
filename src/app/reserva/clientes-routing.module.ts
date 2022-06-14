import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { HomeComponent } from './pages/home/home.component';
import { VerRutasComponent } from './pages/ver-rutas/ver-rutas.component';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { PasadiaComponent } from './pages/tours/pasadia/pasadia.component';
import { EstadiaComponent } from './pages/tours/estadia/estadia.component';
import { RecomendacionesComponent } from './pages/recomendaciones/recomendaciones.component';
import { ViajesGrupalesComponent } from './pages/viajes-grupales/viajes-grupales.component';
import { FestividadesComponent } from './pages/festividades/festividades.component';
import { NuestrosAliadosComponent } from './pages/inicio/nuestros-aliados/nuestros-aliados.component';
import { ToursDelMesComponent } from './pages/inicio/tours-del-mes/tours-del-mes.component';
import { DesRutasComponent } from './pages/des-rutas/des-rutas.component';
import { DetalleTourComponent } from './pages/tours/detalle-tour/detalle-tour.component';
import { AddExperienciaComponent } from './pages/inicio/experiencias/add-experiencia/add-experiencia.component';
import { FormPagosComponent } from './pages/pagos/form-pagos/form-pagos.component';
import { AuthLoginComponent } from '../security/auth-login/auth-login.component';
import { AuthRegisterComponent } from '../security/auth-register/auth-register.component';
import { MisReservasComponent } from './pages/mis-reservas/mis-reservas.component';
import { InformacionTransaccionComponent } from './pages/pagos/informacion-transaccion/informacion-transaccion.component';
import { MaletaComponent } from './pages/maleta/maleta.component';
import { MisViajesComponent } from './pages/mis-viajes/mis-viajes.component';
import { EditarPerfilComponent } from './pages/editar-perfil/editar-perfil.component';
import { AddCalificacionComponent } from './pages/mis-viajes/add-calificacion/add-calificacion.component';
import { FormReservaComponent } from './pages/pagos/form-reserva/form-reserva.component';
import { InformacionPagoComponent } from './pages/pagos/informacion-pago/informacion-pago.component';
import { MisComprasComponent } from './pages/mis-compras/mis-compras.component';
import { PasswordResetComponent } from '../security/password-reset/password-reset.component';
import { PasswordComponent } from '../security/password/password.component';
import { ConfirmationComponent } from '../security/confirmation/confirmation.component';


const routes : Routes = [
  {path:"",
    component:HomeComponent, 
    children:[
    {path:"inicio", component:InicioComponent},
      {path:"nuestrosAliados", component:NuestrosAliadosComponent},
      {path:"toursDelMes", component:ToursDelMesComponent},
      {path:"addExperiencia", component:AddExperienciaComponent},
    {path:"destinos", component:VerRutasComponent},
    {path:"verRuta/:idRuta", component:DesRutasComponent},
    {path:"contacto", component:ContactoComponent},
    {path:"pasadia", component:PasadiaComponent},  
    {path:"pasadia/detalletour/:idTour", component:DetalleTourComponent},

    {path:"estadia", component:EstadiaComponent},
    {path:"estadia/detalletour/:idTour", component:DetalleTourComponent},
    {path:"recomendaciones", component:RecomendacionesComponent},
    {path:"viajesGrupales", component:ViajesGrupalesComponent},
    {path:"festividades", component:FestividadesComponent},
    {path:"login", component:AuthLoginComponent},
    {path:"registro", component:AuthRegisterComponent},
    {path:"editarPerfil", component:EditarPerfilComponent},
    {path:"misReservas", component:MisReservasComponent},
    {path:"misCompras", component:MisComprasComponent},

    {path:"pagoreserva/:idCompra", component:FormReservaComponent},
    {path:"infopago/:idTransaccion", component:InformacionPagoComponent},
    {path:"infopago", component:InformacionPagoComponent},

  {path:"misViajes", component:MisViajesComponent},
  {path:"calificar", component:AddCalificacionComponent},
  {path:"calificar/:idCompra", component:AddCalificacionComponent},
  {path: 'reset-password', component:PasswordResetComponent},
  {path: 'login/confirmation/:idConfirmation', component:ConfirmationComponent},
  {path: 'password-reset/confirmation/:idConfirmation', component:PasswordComponent},
  {path:"**", redirectTo:"inicio"},
  ]}
]

@NgModule({
  
  imports: [
    RouterModule.forChild( routes )
  ],
  exports:[
    RouterModule
  ]
})
export class ClientesRoutingModule { }
