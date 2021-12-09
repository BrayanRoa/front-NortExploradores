import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as global from 'global'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CompraService {
  url =`${global.url}/compra/`;
  
  constructor(private http: HttpClient) { }

  public post(compra:any, idTour:any):Observable<any>{
    return this.http.post<any>(this.url+"compraReservada/"+idTour, compra)
  }

  public encontrar(idCompra:any):Observable<any>{
    return this.http.get<any>(this.url+idCompra)
  }

  public compras():Observable<any>{
    return this.http.get<any>(this.url)
  }
  public comprasPagadas(idUsuario:any):Observable<any>{
    return this.http.get<any>(this.url+idUsuario+"/comprasPagadas")
  }
 public comprasMes():Observable<any>{
    return this.http.get<any>(this.url+"mensuales")
  }
  public comprasPorMes():Observable<any>{
    return this.http.get<any>(this.url+"totalMeses")
  }
  public totalPaquetes():Observable<any>{
    return this.http.get<any>(this.url+"totalPaquetes")
  }
  
  public comprasCantidadPaq():Observable<any>{
    return this.http.get<any>(this.url+"cantidadpaq")
  }

  public comprasPorMesTabla(id:any):Observable<any>{
    return this.http.get<any>(`${this.url}/${id}/totalPaquetesMesTabla`)
  }

}
