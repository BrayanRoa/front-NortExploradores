import { Injectable } from '@angular/core';
import * as global from 'global'
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class DescuentosService {
  url = `${global.url}/descuento/`;

  constructor(private http: HttpClient) { }

  public listarDescuentos():Observable<any>{    
    return this.http.get<any>(this.url);
  }

  public post(descuentos:any):Observable<any>{
    return this.http.post<any>(this.url,descuentos)
  }

  obtenerDescuentos(id:string): Observable<any>{
    return this.http.get<any>(this.url+id)
  }

  editarDescuentos(id:string,descuentos:any):Observable<any>{
    return this.http.put<any>(this.url,descuentos)
  }

}
