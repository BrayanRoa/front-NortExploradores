import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompraService } from 'src/app/services/compra.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { PersonaService } from 'src/app/services/persona.service';
import { TokenService } from 'src/app/services/token.service';
import { TransaccionService } from 'src/app/services/transaccion.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-informacion-pago',
  templateUrl: './informacion-pago.component.html',
  styleUrls: ['./informacion-pago.component.css']


})
export class InformacionPagoComponent implements OnInit {

  infoTransaccion:string[]= [];
  public usuario:any;
  public nombreUser!:string;
  public persona:any;
  public empresa:any;
  public compra:any;
  public transaccion:any
  public respuesta!:string;
  public imgRespuesta!:string;

  constructor(
    private route:ActivatedRoute,
    private pagoService: TransaccionService,
    private usuarioService:UsuarioService,
    private tokenS: TokenService,
    private personaService: PersonaService,
    private empresaService: EmpresaService,
    private compraService: CompraService,
    private aRouter: ActivatedRoute,
    private router: Router,
    private transaccionService: TransaccionService

    
    ) { }

  ngOnInit(): void {

    this.nombreUser = this.tokenS.getUserName();
    this.cargarUsuario();
    this.cargarEmpresa();
    this.route.queryParams.subscribe(params=>{
      let body = new URLSearchParams();
        body.set("transaction_id",params.transactionId);
        body.set("reference_sale",params.referenceCode);     
        body.set("date",params.processingDate);     
        body.set("payment_method_type",params.polPaymentMethodType);     
        body.set("payment_method",params.polPaymentMethod);
        body.set("attempts","1");     
        body.set("tax",params.TX_TAX);     
        body.set("shipping_country",params.currency);     
        body.set("description",params.description); 
        body.set("currency",params.currency);     
        body.set("value",params.TX_VALUE);     
        body.set("payment_method_name",params.lapPaymentMethodType);     
        body.set("email_buyer",params.buyerEmail);     
        body.set("payment_method_id",params.polPaymentMethod);  
        body.set("response_message_pol",params.lapTransactionState);

        if(params.extra1!=null){
          this.transaccionService.encontrar(params.transactionId).subscribe(compra=>{
            console.log(compra);
            this.compra=compra;

            if(compra.responseMessagePol!="APPROVED"){
              this.respuesta="¡Transacción cancelada!"
              this.imgRespuesta="https://cdn-icons-png.flaticon.com/512/148/148766.png"
              return;
            }

            if(compra.responseMessagePol=="APPROVED" && compra.referenceSale.estado=="PAGADO"){
              this.respuesta="¡Transacción aprobada, disfruta tu viaje!"
              this.imgRespuesta="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Check_green_icon.svg/2048px-Check_green_icon.svg.png"
              return;
            }
            if(compra.responseMessagePol=="APPROVED" && compra.referenceSale.estado=="PAGO_PARCIAL"){
              this.respuesta="¡Transacción aprobada, recuerda pagar el 50% restante!"
              this.imgRespuesta="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Check_green_icon.svg/2048px-Check_green_icon.svg.png"
              return;
            }


          })
        }else{
          let id = this.aRouter.snapshot.paramMap.get('idCompra');
          if(id!=null){
            this.transaccionService.encontrar(id).subscribe(compra=>{
              this.compra=compra;
              if(compra.responseMessagePol=="APPROVED" && compra.referenceSale.estado=="PAGADO"){
                this.respuesta="¡Transacción aprobada, disfruta tu viaje!"
                this.imgRespuesta="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Check_green_icon.svg/2048px-Check_green_icon.svg.png"
                return;
              }
            },error=>{
              // this.router.navigateByUrl("/inicio");
            })
          }else{
            // this.router.navigateByUrl("/inicio");

          }
        }

    })
  }

  cargarEmpresa(){
    this.empresaService.listarEmpresa().subscribe(empresa=>{
      this.empresa = empresa[0];
    })
  }

  cargarPersona(){
    this.usuarioService.pasajerosPorCliente(this.usuario.id_Usuario).subscribe(pasajeros=>{
      for (let i = 0; i < pasajeros.length; i++) {
        let pasajeroI = pasajeros[i];
        if(pasajeroI.esCotizante ==true){
          this.persona = pasajeroI.persona;
          console.log(this.persona);
        }
      }
    })

  }

  cargarUsuario(){
    this.usuarioService.usuarioPorUsername(this.nombreUser).subscribe(usuario=>{
      this.usuario=usuario;
      console.log(usuario);
      this.cargarPersona();
    })
  }

}