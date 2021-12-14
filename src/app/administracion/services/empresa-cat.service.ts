import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as global from 'global'

@Injectable({
  providedIn: 'root'
})
export class EmpresaCatService {

  uri=`${global.url}/empresa/categoria/`;
  constructor(private http: HttpClient) { }

  public CatEmpresa():Observable<any>{
    return this.http.get<any>(this.uri);
  }
  
}
