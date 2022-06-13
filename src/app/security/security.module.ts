import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { AuthRegisterComponent } from './auth-register/auth-register.component';
import { AuthLoginComponent } from './auth-login/auth-login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasswordResetComponent } from './password-reset/password-reset.component';



@NgModule({
  declarations: [
  
    PasswordResetComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SecurityModule { }
