import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as global from 'global'
import { NuevoUsuario } from '../security/models/nuevo-usuario';
import { LoginUsuario } from '../security/models/login-usuario';
import { JwtDto } from '../security/models/jwt-dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  

  authURL = `${global.url}/auth/`;

  constructor(private httpClient: HttpClient) { }

  public nuevo(nuevoUsuario: NuevoUsuario): Observable<any> {
    return this.httpClient.post<any>(this.authURL + 'nuevo', nuevoUsuario);
  }

  public solicitudCambioPassword(email:string): Observable<any>{
    return this.httpClient.get<any>(this.authURL+"solicitudPassword/"+email)
  }

  public login(loginUsuario: LoginUsuario): Observable<JwtDto> {
    return this.httpClient.post<JwtDto>(this.authURL + 'login', loginUsuario);
  }
  
}
