import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ReservaService } from 'src/app/services/reserva.service';
import { TokenService } from 'src/app/services/token.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-mis-reservas',
  templateUrl: './mis-reservas.component.html',
  styleUrls: ['./mis-reservas.component.css']
})
export class MisReservasComponent implements OnInit {
  public idUsuario!:number;
  public usuario:any;
  public nombreUser!:string;
  public reservas: any[] = [] ;
  
  size: NzButtonSize = 'large';
  dtOptions: DataTables.Settings = {};
  
  dtTrigger = new Subject<any>();

  constructor(
    private usuarioSer: UsuarioService,
    private tokenS: TokenService,
    private router: Router,
    private toastr: ToastrService,
    public compra: ReservaService
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
      this.cargarReservas();
    })
  }

  public cargarReservas(){
    this.usuarioSer.comprasReservadasUsuario(this.idUsuario).subscribe((reservas: any)=>{
      this.reservas = reservas;
      this.dtTrigger.next();
    })
  }

  public cancelar(id:any){
      this.compra.cancelarReserva(id).subscribe((reserva: any)=> {
        this.toastr.success("Reserva cancelada con exito!", "", {
          positionClass: 'toast-top-center',
          timeOut: 3000
         })
      })
  }
  public eliminarReserva(id:any){
    for (let i = 0; i < this.reservas.length; i++) {
      if(this.reservas[i].reserva.idReserva == id){
        this.reservas.splice(i, 1);
      }
    }
  }

}
