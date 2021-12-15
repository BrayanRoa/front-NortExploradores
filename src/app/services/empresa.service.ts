import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as global from 'global'

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  uri=`${global.url}/empresa/`;
  constructor(private http: HttpClient) { }

  public listarEmpresa():Observable<any>{
    return this.http.get<any>(this.uri);
  }

  public listarEmpresaT():Observable<any>{
    return this.http.get<any>(this.uri+'transporteE');
  }

  public listarEmpresaS():Observable<any>{
    return this.http.get<any>(this.uri+'seguroE');
  }

  public post(empresa:any):Observable<any>{
    return this.http.post<any>(this.uri, empresa)
  }

  obtenerEmpresa(id:string): Observable<any>{
    return this.http.get(this.uri+id)
  }
  
  editarEmpresa(id:string,empresa:any):Observable<any>{
      return this.http.put(`${global.url}/empresa`,empresa)
  }

  public listarTransportes():Observable<any>{
    const trans = "transportes"
    return this.http.get<any>(`${this.uri}${trans}`);
  }

  public listarSeguros():Observable<any>{
    const seguro = "seguros";
    return this.http.get<any>(`${this.uri}${seguro}`);
  }

  deshabilitar(empresa:any):Observable<any>{
    return this.http.get(this.uri+empresa+'/deshabilitar')
  }
}
