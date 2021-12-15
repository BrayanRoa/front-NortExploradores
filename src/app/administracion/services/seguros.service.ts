import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as global from 'global'

@Injectable({
  providedIn: 'root'
})
export class SegurosService {

  uri =`${global.url}/seguro/`;
  constructor(private http: HttpClient) { }

  public listarSeguro():Observable<any>{
    return this.http.get<any>(this.uri)
  }

  public post(empresa:any):Observable<any>{
    return this.http.post<any>(this.uri, empresa)
  }

  obtenerSeguro(id:string): Observable<any>{
    return this.http.get(this.uri+id)
  }
  
  editarSeguro(id:string,seguro:any):Observable<any>{
      return this.http.put(this.uri,seguro)
  }

  deshabilitar(seguro:any):Observable<any>{
    return this.http.get(this.uri+seguro+'/deshabilitar')
  }
}
