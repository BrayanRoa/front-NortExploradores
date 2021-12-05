import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as global from 'global'

@Injectable({
  providedIn: 'root'
})
export class ReservaService {

  uri = `${global.url}/reserva/`;
  
  constructor(private http:HttpClient) { }

  public paqueteDeReserva(idReserva:number):Observable<any>{
    return this.http.get<any>(`${this.uri}/${idReserva}/paquetes`);
  }

  public cancelarReserva(idReserva:number):Observable<any>{
    return this.http.get<any>(`${global.url}/compra/${idReserva}/cancelarReserva`);
  }
}
