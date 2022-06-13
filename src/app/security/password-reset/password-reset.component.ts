import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {
  reset: FormGroup;
  
  constructor(
    public formulario:FormBuilder,
    private authS: AuthService,
    private toastr: ToastrService
  ) { 
    this.reset = this.formulario.group({
      email:[''],
    })
  }

  ngOnInit(): void {
    this.reset = this.formulario.group({
      email:['',Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(50),
        Validators.email
      ])],
    })

  }

  enviarSolicitud(){

    this.authS.solicitudCambioPassword(this.reset.value.email).subscribe(res=>{
      this.toastr.success("Correo enviado, porfavor revisa tu bandeja de entrada", "OK", {
        positionClass: 'toast-top-center',
        timeOut: 3000
       }) 
    },error=>{
        this.toastr.error(error.error.mensaje, "ERROR", {
          positionClass: 'toast-top-center',
          timeOut: 3000
         }) 

    })
  }
}
