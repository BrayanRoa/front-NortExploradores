import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {
 
  idConfirmation!:any;

  loginInfo!: FormGroup;
  isAdmin:boolean = false;
  isLogged:boolean = false;
  isLoginFail:boolean = false;
  email!:string;
  password!:string;
  roles:string[] = [];
  errMsj!:string;
  mensaje!:string;

  constructor(
    private aRouter: ActivatedRoute, 
    private authS: AuthService,
    private toastr: ToastrService,
    private route: Router,
  ) { }

  ngOnInit(): void {
    this.idConfirmation = this.aRouter.snapshot.paramMap.get('idConfirmation');
    this.confirmarCuenta()
  }

  public confirmarCuenta(){
    this.authS.confirmacionCuenta(this.idConfirmation).subscribe(res=>{
      this.mensaje = "Cuenta confirmada"
      this.toastr.success("Cuenta confirmada", "OK", {
        positionClass: 'toast-top-center',
        timeOut: 3000
       })
        
       window.location.replace("https://front-nort-exploradores-2.vercel.app/login")
    },error=>{
        this.toastr.error("Token expirado o erroneo", "ERROR", {
          positionClass: 'toast-top-center',
          timeOut: 3000
         })
         window.location.replace("https://front-nort-exploradores-2.vercel.app/login")
    })
  }
}
