import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as crypto from "crypto-js";
import { CompraService } from 'src/app/services/compra.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-form-reserva',
  templateUrl: './form-reserva.component.html',
  styleUrls: ['./form-reserva.component.css']
})
export class FormReservaComponent implements OnInit {
  totalPasajeros:any;
  referenciaUnic = this.generarReferencia();
  iva = 0.19;
  moneda = "COP";
  apikey = "jR9INc85abuxxkcn1Xn1hqZe5P";
  totalCompra:any;
  idCuenta = "957106";
  idMercado = "949518";
  isPagadoTotal:any;
  public isLogged!: boolean;

  email = ""
  nombrePersona = "";

  idUsuario = "";
  descripcion = "";

  url = `https://nortexploradores.herokuapp.com/pagos/confirmacion`;

  firmaElectronica!: string
  firmaElectronicaMD5!: string

  // test =================================================================
  idCuentaTest = "512321";
  apikeyTest = "4Vj8eK4rloUd272L48hsrarnUA";

  firmaElectronicaTest = `${this.apikeyTest}~508029~${this.referenciaUnic}~${this.moneda}`;
  firmaElectronicaMD5Test = crypto.MD5(this.firmaElectronicaTest).toString();

  public id:any;

  constructor(
    private activeRoute: ActivatedRoute,
    private compraService: CompraService,
    private tokenS: TokenService,
    private router: Router

    ) { }

  ngOnInit(): void {
    this.cargarToken();
    this.id = this.activeRoute.snapshot.paramMap.get("idCompra");
    this.compraService.encontrar(this.id).subscribe(compra=>{
      if(compra.estado == "PAGADO"){
        this.isPagadoTotal=true;
        return;
      }else{
        this.isPagadoTotal=false;
      }
      this.totalCompra = compra.totalCompra/2;
      this.totalPasajeros= compra.cantidadPasajeros;

      this.firmaElectronica = `${this.apikey}~${this.idMercado}~${this.referenciaUnic}~${this.totalCompra/2}~${this.moneda}`;
      this.firmaElectronicaMD5 = crypto.MD5(this.firmaElectronica).toString();
      // Pruebas
      this.firmaElectronicaTest = `${this.apikeyTest}~508029~${this.referenciaUnic}~${this.totalCompra/2}~${this.moneda}`;

      this.descripcion="Pago de (" + this.totalPasajeros + ") paquete(s) turistico(s) destino: " + compra.tour.paquete.municipio.nombre;

      this.firmaElectronicaMD5Test = crypto.MD5(this.firmaElectronicaTest).toString();

      const btnprod = document.getElementById("pagoprod");

      if(btnprod){
        btnprod.removeAttribute("disabled")
      }

      const btnpru = document.getElementById("pagopru");

      if(btnpru){
        btnpru.removeAttribute("disabled")
      }

    })
  }

  generarReferencia(): string {
    const fecha = new Date();
    return Math.round((Math.random() * 45644)) + "" + Math.round(fecha.getMilliseconds());
  }
  public cargarToken() {
    if (this.tokenS.getToken()) {
      this.isLogged = true;
    } else {
      this.isLogged = false;
      this.router.navigateByUrl("/inicio");

    }
  }
}
