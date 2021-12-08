import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ToursService } from 'src/app/administracion/services/tours.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-tours-inactivos',
  templateUrl: './tours-inactivos.component.html',
  styleUrls: ['./tours-inactivos.component.css']
})
export class ToursInactivosComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  
  dtTrigger = new Subject<any>();
  public data: any[]=[];

  estado =''; 
  form! : FormGroup;
  
  constructor(
    private tourService: ToursService,
    private router: Router,
    private token: TokenService,
    private fb : FormBuilder
    ){

  }

  ngOnInit(): void {
    this.form=this.fb.group({
      seleccion : ['', Validators.required]
    });
    
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 6,
      language:{
        url:"//cdn.datatables.net/plug-ins/1.11.3/i18n/es_es.json"
      }
    };
    this.tourService.listarTour().subscribe((data:any)=>{
      // this.data = data;
      for (const iterator of data) {
        if(iterator.estado=="INACTIVO"){
          this.data.push(iterator);
        }
      }
      this.dtTrigger.next();
    })
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
  deshabilitar(id:any){
    this.tourService.deshabilitar(id).subscribe((data) => {  
      console.log(id);
    });
  }
  
  public cargarToken() {
    if (this.token.getToken()) {
      if(this.token.getAuthorities().length < 2){
      this.router.navigateByUrl("/inicio");
      }
    } else {
      this.router.navigateByUrl("/inicio");
    }
  }

  cambiar(){
    const selec = this.form.value.seleccion;
    if(selec==='activos'){
      this.estado='Activos';
      this.router.navigateByUrl('/administracion/tours');
    }else if(selec==='inactivos'){
      this.estado='Inactivos';
      this.router.navigateByUrl('/administracion/toursInactivos');
    }
    console.log(selec);
  }
}
