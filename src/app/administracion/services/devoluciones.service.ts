import { Injectable } from '@angular/core';
import * as global from 'global'
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class DevolucionesService {
  url = `${global.url}/devolucion`;
 
  constructor(private http: HttpClient) { }

  public listarDevoluciones():Observable<any>{    
    return this.http.get<any>(this.url);
  }

  public post(devoluciones:any):Observable<any>{
    return this.http.post<any>(this.url,devoluciones)
  }

  obtenerDevoluciones(id:string): Observable<any>{
    return this.http.get<any>(this.url+`/`+id)
  }

  editarDevoluciones(id:string,devoluciones:any):Observable<any>{
    return this.http.put<any>(this.url,devoluciones)
  }



}
