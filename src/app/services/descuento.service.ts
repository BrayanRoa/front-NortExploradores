import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as global from 'global'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DescuentoService {
  url =`${global.url}/descuento/`;

  constructor(private http: HttpClient) { }

  public descuentos():Observable<any>{
    return this.http.get<any>(this.url)
  }
}
