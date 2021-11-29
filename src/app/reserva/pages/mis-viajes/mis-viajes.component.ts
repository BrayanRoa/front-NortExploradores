import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../../services/token.service';
import { Router } from '@angular/router';
import { CompraService } from '../../../services/compra.service';
import { UsuarioService } from '../../../services/usuario.service';

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
    this.comprasSer.compras().subscribe((compras: any) => {
      this.compras = compras;
      
      for(const iterator of compras){     
          
        if(id===iterator.usuario.id_Usuario){          
          this.comprasUsuario.push(iterator)
        }
  
      }

    })   
   

  }

 

}