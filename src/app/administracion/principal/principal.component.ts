import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { NotificacionService } from 'src/app/services/notificacion.service';
import { TokenService } from 'src/app/services/token.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { SolicitudpaqueteService } from '../services/solicitudpaquete.service';
@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {

  isCollapsed = false;
  size: NzButtonSize = 'large';
  public idUsuario!:number;
  public notificaciones:any[] = [];
  public usuario:any;
  public isLogged!:boolean;
  public isAdmin = false;
  public roles: string[] = [];
  public nombreUser="";
  public totalSolicitudes = 0;

  text:any;
  wasInside:any;
  clickNoti=true;

  log(): void {
    console.log('click dropdown button');
  }
  constructor(
    private usuarioSer: UsuarioService,
    private tokenS: TokenService,
    private router: Router,
    private soli: SolicitudpaqueteService,
    private notificacionService: NotificacionService,
  ) { }

  ngOnInit(): void {
    this.nombreUser=this.tokenS.getUserName();
    this.cargarSolicitudes();
    this.cargarNotificaciones();

  }

  cargarNotificaciones(){
    this.notificacionService.getNotificaciones().subscribe(noti=>{
      for (let i = 0; i < noti.length || i==4; i++) {
        this.notificaciones.push(noti[i])
        if(i==2){
          break;
        }
      }
      
    })
  }

  cargarSolicitudes(){
    this.soli.cantidadSolicitudes().subscribe(total=>{
      this.totalSolicitudes = total;
      console.log(this.totalSolicitudes);
      const out = document.getElementById("numeroTotal");
      console.log(out);
      if(out) out.innerHTML = this.totalSolicitudes+"";
    })
  }

  onLogOut(): void {
    this.tokenS.logOut();
  }

  onBack(): void {
    console.log('onBack');
  }
  dropd = false;
  drop(){
    this.clickNoti=true;
    const out = document.getElementById('box');
    if(out){
      if(this.dropd){
        out.setAttribute("style","width: 250px;height: 0px;display:none;opacity: 0;position: absolute;top: 53px;right: 242px;border-radius: 5px 0px 5px 5px;background-color: #27293dfa!important;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)");
        this.dropd=false;
      }else{
        out.setAttribute("style","width: 250px;height: auto;display:block;opacity: 1;position: absolute;top: 53px;right: 242px;border-radius: 5px 0px 5px 5px;background-color: #27293dfa!important;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)");
        this.dropd=true;
      
      }

    }
  }
  desactivarSoli(id:number,element:HTMLElement){
    element.remove();
    
    this.drop();
    this.notificacionService.desactivar(id).subscribe(notificacion=>{
    })
    this.router.navigate(['/administracion/notificaciones']);

  }
  volverInicio(){
    this.router.navigate(['/administracion']);
    
  }

  @HostListener('click',['$event.target'])
  clickInside(target:any) {
    console.log();
    this.text = "clicked inside";
    this.wasInside = true;
    
    if(this.dropd && target.id!="notificacion"){
      const out = document.getElementById('box');
      if(out){
        out.setAttribute("style","width: 250px;height: 0px;display:none;opacity: 0;position: absolute;top: 53px;right: 242px;border-radius: 5px 0px 5px 5px;background-color: #27293dfa!important;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)");
        this.dropd=false;
      }
    }
    console.log(this.text);
  }
  
  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
      this.text = "clicked outside";
    console.log(this.text);

    }
  }

  public cargarToken() {
    if (this.tokenS.getToken()) {
      if(this.tokenS.getAuthorities().length < 2){
      this.router.navigateByUrl("/inicio");
      }
    } else {
      this.router.navigateByUrl("/inicio");
    }
  }

}
