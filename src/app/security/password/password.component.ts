import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent implements OnInit {
  fpassword!: FormGroup;
  idConfirmation!:any;
  constructor(
    public formulario:FormBuilder,
    private authService:AuthService,
    private aRouter: ActivatedRoute, 
    private route: Router,
    private tokenS:TokenService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.idConfirmation = this.aRouter.snapshot.paramMap.get('idConfirmation');
    this.fpassword = this.formulario.group({
      password: [
        '',
        Validators.compose([Validators.required, Validators.minLength(3)]),
      ],
      confpassword: [
        '',
        Validators.compose([Validators.required, Validators.minLength(3)]),
      ]
    })
  }

  public enviarPassword(){

    let pass= (this.fpassword.value.password);
    let passConfirm=(this.fpassword.value.confpassword);

    if(pass!=passConfirm){
      this.toastr.warning("Las contraseñas no coinciden", "WARN", {
        positionClass: 'toast-top-center',
        timeOut: 3000
       })
       return;
    }

    let infoLogin = {
      nombreUsuario:" ",
      password: String(this.fpassword.value.password)
    }

    this.authService.cambiarPassword(infoLogin,this.idConfirmation).subscribe(res=>{
      this.toastr.success("Contraseña cambiada", "OK", {
        positionClass: 'toast-top-center',
        timeOut: 3000
       })
       this.route.navigateByUrl("")
    },error=>{
        console.log(error);
        this.toastr.error(error.mensaje, "ERROR", {
          positionClass: 'toast-top-center',
          timeOut: 3000
         }) 
    })
  }


}
