import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToursService } from 'src/app/administracion/services/tours.service';
import { PaqueteService } from 'src/app/services/paquete.service';
import { ViajesGrupalesService } from 'src/app/services/viajes-grupales.service';
import { MunicipioService } from 'src/app/administracion/services/municipio.service';
import { PaquetesService } from 'src/app/administracion/services/paquetes.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-viajes-grupales',
  templateUrl: './viajes-grupales.component.html',
  styleUrls: ['./viajes-grupales.component.css']
})
export class ViajesGrupalesComponent implements OnInit {
  public formTour !: FormGroup;
  public formSol !: FormGroup;
  public municipios: any = [];
  public nombreUser!: string;
  public usuario: any;
  public fechaL!: Date;
  public fechaS!: Date;

  constructor(
    private tokenS: TokenService,
    private router: Router,
    private tourService: ToursService,
    private paqueteService: PaquetesService,
    private viajesGrupales: ViajesGrupalesService,
    private municipioService: MunicipioService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private usuarioSer: UsuarioService,
  ) { }

  ngOnInit(): void {
    this.nombreUser = this.tokenS.getUserName();
    
    this.cargarToken();
    this.agregarMunicipio();
    this.cargarUsuario();
    
    this.formSol = this.formBuilder.group({
      fecha: ['', Validators.required],
      descripcion: ['', Validators.required],
      tour: ['', Validators.required],
      usuario: ['', Validators.required],
      municipio: ['', Validators.required],
    })
    this.formTour = this.formBuilder.group({
      minCupos: ['', Validators.required],
      maxCupos: ['', Validators.required],
      cantCupos:[0, Validators.compose([
        Validators.required,
        Validators.min(1),
        Validators.max(50),
      ])],
      fechaLlegada: ['', Validators.compose([
        Validators.required,
      ])],
      fechaSalida: ['', Validators.compose([
        Validators.required,
      ])],
      empleado: [1, Validators.required],
      seguro: [1, Validators.required]
    })

  }
  cargarUsuario() {
    this.usuarioSer.usuarioPorUsername(this.nombreUser).subscribe(usuario => {
      this.usuario = usuario;
      this.usuarioCotizante(usuario)
    })
  }
  public agregarMunicipio() {
    this.municipioService.listarMunicipio().subscribe(municipios => {
      this.municipios = municipios;
    })
  }
  public cargarToken() {
    if (this.tokenS.getToken()) {
    } else {
      this.toastr.warning("Por favor, inicia sesión para realizar solicitudes de paquetes", "", {
        positionClass: 'toast-top-center',
        timeOut: 3000
       })
      this.router.navigateByUrl("/login");
    }
  }
  public enviarData() {

    this.formTour.controls.minCupos.setValue(0);
    this.formTour.controls.maxCupos.setValue(0);
    let date: Date = new Date();
    let solicitudTour = {
      "fecha": date,
      "usuario": this.usuario,  
      "tour": this.formTour.value,
      "municipio":this.formSol.controls.municipio.value,
      "descripcion": this.formSol.controls.descripcion.value
    }
    console.log(solicitudTour);
        this.viajesGrupales.post(solicitudTour).subscribe((data) => {
          this.toastr.success("Solicitud Enviada Con Exito!", "Enviado", {
            positionClass: 'toast-bottom-right'
          })          
        })
  }

  public usuarioCotizante(usuario:any){
    const username = document.getElementById("username")
    if(username) username.innerHTML=usuario.username

    const email = document.getElementById("email")
    if(email) email.innerHTML=usuario.email
  }

  validarFecha(){
    let fechaLlegada = new Date(this.fechaL);
    let fechaSalida = new Date(this.fechaS);
    let validar = false;
    if(this.fechaL != undefined && this.fechaS != undefined && fechaLlegada >= fechaSalida)
      validar = true
    return validar;
  }

}