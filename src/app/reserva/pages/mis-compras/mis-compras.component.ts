import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ReservaService } from 'src/app/services/reserva.service';
import { TokenService } from 'src/app/services/token.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { Subject } from 'rxjs';
import { CompraService } from 'src/app/services/compra.service';

@Component({
  selector: 'app-mis-compras',
  templateUrl: './mis-compras.component.html',
  styleUrls: ['./mis-compras.component.css']
})
export class MisComprasComponent implements OnInit {
  size: NzButtonSize = 'large';
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject<any>();

  public idUsuario!:number;
  public usuario:any;
  public nombreUser!:string;
  public compras: any[] = [] ;

  constructor(

    private usuarioSer: UsuarioService,
    private tokenS: TokenService,
    private router: Router,
    private toastr: ToastrService,
    public compra: CompraService

  ) { }

  ngOnInit(): void {

    this.nombreUser=this.tokenS.getUserName(); 
    this.cargarUsuario();
    this.cargarToken();

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 6,
      language:{
        url:"//cdn.datatables.net/plug-ins/1.11.3/i18n/es_es.json"
      }
    };
  }

  public cargarToken() {
    if (this.tokenS.getToken()) {
    } else {
      this.router.navigateByUrl("/inicio");

    }
  }

  cargarUsuario(){
    this.usuarioSer.usuarioPorUsername(this.nombreUser).subscribe(usuario=>{
      this.usuario=usuario;
      this.idUsuario = usuario.id_Usuario;
      this.cargarCompras();
    })
  }

  public cargarCompras(){
    this.usuarioSer.comprasTotalesUsuario(this.idUsuario).subscribe((compra: any)=>{
      this.compras = compra;
      this.dtTrigger.next();
    })
  }
  cancelar(idCompra:any){
    this.compra.cancelarCompra(idCompra).subscribe(compra=>{
      this.compras = compra
      this.toastr.success("Compra cancelada con exito!", "", {
        positionClass: 'toast-top-center',
        timeOut: 3000
       })
      window.location.reload();

    })
  }

}
