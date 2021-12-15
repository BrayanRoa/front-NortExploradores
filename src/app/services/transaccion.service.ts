import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as global from 'global'
const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
@Injectable({
  providedIn: 'root'
})

export class TransaccionService {
  uri=`${global.url}/transaccion/`;
  uripagos=`${global.url}/pagos/confirmacion`;



  constructor(private http: HttpClient) { }

  public listarTransacciones():Observable<any>{
    return this.http.get<any>(this.uri);
  }
  public encontrar(id:any):Observable<any>{
    return this.http.get<any>(this.uri+id);
  }
  public encontrarTransacciones(id:any):Observable<any>{
    return this.http.get<any>(`${global.url}/compra/`+id+"/transaccionesApp");
  }
  public guardarTransaccion(body:URLSearchParams):Observable<any>{
    return this.http.post<any>(this.uripagos,body);
  }
}
