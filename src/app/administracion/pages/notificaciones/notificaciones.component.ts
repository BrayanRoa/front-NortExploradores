import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { Subject } from 'rxjs';
import { NotificacionService } from 'src/app/services/notificacion.service';
import { TokenService } from 'src/app/services/token.service';
import { Component, ElementRef, HostListener, Input } from '@angular/core';
@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css']
})
export class NotificacionesComponent implements OnInit {
  size: NzButtonSize = 'large';
  dtOptions: DataTables.Settings = {};
  notificaciones:any[] = [];
  dtTrigger = new Subject<any>();
  constructor(
    private notificacionService:NotificacionService,
    private tokenS: TokenService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarToken();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 6,
      language:{
        url:"//cdn.datatables.net/plug-ins/1.11.3/i18n/es_es.json"
      }
    };
    this.notificacionService.get().subscribe(notificaciones=>{
      this.notificaciones =notificaciones;
      this.dtTrigger.next();
    })
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
