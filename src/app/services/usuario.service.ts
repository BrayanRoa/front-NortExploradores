import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as global from 'global'

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  url = `${global.url}/usuario`;
  constructor(private http: HttpClient) { }

  public usuarioPorId(idUsuario:number):Observable<any>{
    return this.http.get<any>(`${this.url}/${idUsuario}`);
  }

  public usuarioPorUsername(username:string):Observable<any>{
    return this.http.get<any>(`${this.url}/${username}/username`);
  }

  public paquetesPorUsuario(idUsuario:number):Observable<any>{
    return this.http.get<any>(`${this.url}/${idUsuario}/paquetesComprados`)
  }

  public reservasPorUsuario(idUsuario:number):Observable<any>{
    return this.http.get<any>(`${this.url}/${idUsuario}/reservas`)
  }

  public pasajerosPorCliente(idUsuario:number):Observable<any>{
    return this.http.get<any>(`${this.url}/${idUsuario}/pasajeros`);
  }
  public viajesRealizados(username:any):Observable<any>{
    return this.http.get<any>(`${this.url}/${username}/cantidadViajes`);
  }
  public comprasReservadasUsuario(idUsuario:number):Observable<any>{
    return this.http.get<any>(`${this.url}/${idUsuario}/comprasReservadas`)
  }

  /* public paquetesCompradosUsuario(idUsuario:number):Observable<any>{
    return this.http.get<any>(`${this.url}/${idUsuario}/paquetesComprados`)
  } */

  
  public usuariosMensuales():Observable<any>{
    return this.http.get<any>(this.url+"/usuariosMensuales")
  }

  public pasajeroPersonaPorCliente(idUsuario:number):Observable<any>{
    return this.http.get<any>(`${this.url}/${idUsuario}/pasajerospersonas`);
  }

  public guardarPasajerosDeUsuario(idUsuario:number, pasajeros:any[]):Observable<any>{
    return this.http.post<any>(`${this.url}/${idUsuario}/pasajeros`,pasajeros);
  }
  public post(pasajeros:any):Observable<any>{
    return this.http.put<any>(`${this.url}`,pasajeros);
  }

}
