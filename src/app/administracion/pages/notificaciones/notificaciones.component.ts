import { Component, OnInit } from '@angular/core';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { Subject } from 'rxjs';
import { NotificacionService } from 'src/app/services/notificacion.service';

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
    private notificacionService:NotificacionService
  ) { }

  ngOnInit(): void {
    this.notificacionService.get().subscribe(notificaciones=>{
      this.notificaciones =notificaciones;
    })
  }

}