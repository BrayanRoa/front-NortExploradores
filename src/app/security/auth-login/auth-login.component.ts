import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';
import { LoginUsuario } from '../models/login-usuario';

@Component({
  selector: 'app-auth-login',
  templateUrl: './auth-login.component.html',
  
})
export class AuthLoginComponent implements OnInit {
  isLogged = false;
  isLoginFail = false;
  isAdmin = false;
  roles: string[] = [];
  errMsj!: string;
  loginInfo!:FormGroup;

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private router: Router,
    private toastr:ToastrService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.loginInfo = this.fb.group({
      email:['',Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(50),
        Validators.email
      ])],
      password:['',Validators.compose([
        Validators.required, 
        Validators.minLength(3),
      ])]
    })

    if (this.tokenService.getToken()) {
      this.isLogged = true;
      this.router.navigate(['/']);
      this.isLoginFail = false;
      this.roles = this.tokenService.getAuthorities();

    }}

  isAdministrador(){
    if(this.roles.length == 2){
      this.isAdmin=true;
    }
  }

  guardarData(){

    if(!this.loginInfo.valid){
      this.toastr.error('Datos incorrectos', 'ERROR', {
        timeOut: 3000, positionClass: 'toast-top-center'
      });
      return;
    }
    
    this.authService.login(this.loginInfo.value).subscribe(
      data => {
        this.isLogged = true;

        this.tokenService.setToken(data.token);
        this.tokenService.setUserName(data.nombreUsuario);
        this.tokenService.setAuthorities(data.authorities);
        this.roles = data.authorities;

        this.toastr.success('Bienvenido ' + data.nombreUsuario, 'OK', {
          timeOut: 3000, positionClass: 'toast-bottom-center'
        });
        
        this.isAdministrador();

        if(this.isAdmin){
          this.router.navigate(['/administracion']);
        }else{
          window.location.reload()
          this.router.navigate(['/']);
        }
      },
      err => {
        this.isLogged = false;
        this.errMsj = err.error;
        if( typeof err.error == 'object'){
          this.toastr.error("Contraseña incorrecta", '', {
            timeOut: 3000,  positionClass: 'toast-bottom-center',
          });
          return;
        }
        this.toastr.error(this.errMsj, '', {
          timeOut: 3000,  positionClass: 'toast-bottom-center',
        });
      }
    );
  }

}
