import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../../services/token.service';
import { Router } from '@angular/router';
import { CompraService } from '../../../services/compra.service';
import { UsuarioService } from '../../../services/usuario.service';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-mis-viajes',
  templateUrl: './mis-viajes.component.html',
  styleUrls: ['./mis-viajes.component.css']
})
export class MisViajesComponent implements OnInit {

  public idUsuario!:number;
  public usuario:any;
  public nombreUser!:string;
  public compras: any;
  public comprasUsuario: any[]=[];

  size: NzButtonSize = 'large';
  dtOptions: DataTables.Settings = {};
  
  dtTrigger = new Subject<any>();

  constructor(    
    private usuarioSer: UsuarioService,
    private comprasSer: CompraService,
    private tokenS: TokenService,
    private router: Router
    ){}

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

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
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
      this.cargarPaquetesComprados(this.idUsuario);
    })
  }

  public cargarPaquetesComprados(id: number) {
    this.comprasSer.comprasPagadas(this.idUsuario).subscribe((compras: any) => {
      this.compras = compras;
      console.log(this.compras)
      for(const iterator of compras){               
        if(id===iterator.usuario.id_Usuario){          
          this.comprasUsuario.push(iterator)
        }  
      }
      this.dtTrigger.next();

    })     

  }


}
