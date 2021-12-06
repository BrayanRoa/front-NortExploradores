import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { PasajeroService } from 'src/app/services/pasajero.service';
import { PersonaService } from 'src/app/services/persona.service';
import { TokenService } from 'src/app/services/token.service';
import { NuevoUsuario } from '../models/nuevo-usuario';

@Component({
  selector: 'app-auth-register',
  templateUrl: './auth-register.component.html',
})
export class AuthRegisterComponent implements OnInit {

  nuevoUsuario?: NuevoUsuario;
  nombreUsuario="";
  idTipo = 0;
  nombre="";
  email=""
  password=""
  errMsj?: string;
  isLogged = false;
  fechaNac !:Date
  public generos:any = ['FEMENINO',"MASCULINO"];
  registroInfo!:FormGroup;

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder,
    private pser: PersonaService,
    private paser: PasajeroService
    ) { }

  ngOnInit(): void {
    this.registroInfo = this.fb.group({
      
        nombreUsuario:['',Validators.compose(
          [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(25),
        ]
        )],
        email:['',Validators.compose([
          Validators.required, 
          Validators.email
        ])],
        password:['',Validators.compose([
          Validators.required, 
          Validators.minLength(5),
        ])]
      ,
        idPersona: ['', Validators.compose([
          Validators.required,
          Validators.min(100000000),
          Validators.max(999999999)]
        )],
        nombre: ['', Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20)]
        )],
        apellido: ['', Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20)
        ])],
        sexo: ['', Validators.compose([Validators.required])],
        fechaNac: ['', Validators.compose([Validators.required])],
        cel: ['', Validators.compose([
          Validators.required,
          Validators.min(3000000000),
          Validators.max(3999999999)]
        )],
        estado: [1, [Validators.required]]
    })
    if (this.tokenService.getToken()) {
      this.isLogged = true;
    }
  }

  validarFecha(){
    let anios = this.calcularFecha()
    if(anios >= 18){
      return true
    }
    return false
  }

  calcularFecha(){
    let fechaNaci = new Date(this.fechaNac);
    let otherDate = new Date();

    var years = (otherDate.getFullYear() - fechaNaci.getFullYear());

    if (otherDate.getMonth() < fechaNaci.getMonth() ||
      otherDate.getMonth() == fechaNaci.getMonth() && otherDate.getDate() < fechaNaci.getDate()) {
      years--;
    }
    return years;
  }

  enviarData(){
    let informacion =(this.registroInfo.value);
    if(this.registroInfo.status=="INVALID"){
      this.toastr.error('¡Datos incorrectos!', 'ERROR', {
        timeOut: 3000, positionClass: 'toast-top-center'
      });
      return;
    }
    var usuarioNuevo = {
      "nombreUsuario":informacion.nombreUsuario,
      "email":informacion.email,
      "password": informacion.password,
    }

    var persona ={
      "idPersona":informacion.idPersona,
      "nombre":informacion.nombre,
      "apellido":informacion.apellido,
      "sexo": informacion.sexo,
      "fechaNac": informacion.fechaNac,
      "cel": informacion.cel,
      "correo":informacion.email,
      "estado":1,
      "idTipo":1
    }

    var pasajero = {
      "esCotizante":1,
      "persona":persona
    }
    

    this.authService.nuevo(usuarioNuevo).subscribe( data => {
      this.toastr.warning('Cargando...', '', {
        timeOut: 3000, positionClass: 'toast-top-center'
      });
      this.pser.post(persona).subscribe(persona=>{
      this.paser.post(pasajero,data.id_Usuario).subscribe(pasajero=>{
        this.toastr.success("Cuentra creada", 'OK', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        this.router.navigate(["/login"]);

      })
      })
    },msg=>{
        this.toastr.error(msg.error, 'ERROR', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
    }
  );

  }
  
  onRegister(): void {
    this.nuevoUsuario = new NuevoUsuario(this.nombreUsuario, this.email, this.password);
    
  }

}
