import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DevolucionesService } from 'src/app/administracion/services/devoluciones.service';

import { TokenService } from 'src/app/services/token.service';
import { DevolucionesComponent } from '../devoluciones.component';

@Component({
  selector: 'app-edit-devoluciones',
  templateUrl: './edit-devoluciones.component.html',
  styleUrls: ['./edit-devoluciones.component.css']
})
export class EditDevolucionesComponent implements OnInit {

  public devoluciones:any = [];
  public form!: FormGroup;
  id: string | null;

  constructor(
    private devolucionService: DevolucionesService,
    private formBuilder: FormBuilder,
    private aRouter: ActivatedRoute ,
    private router : Router,
    private toastr: ToastrService,
    private tokenS:TokenService
  ){
    this.id = aRouter.snapshot.paramMap.get('idDevolucion');
  }

  ngOnInit(): void {
    this.cargarToken();
    this.esEditarDesc();
    this.form=this.formBuilder.group({
    
      idDevolucion: ['', ],  
      
      compra: ['', Validators.compose([
        Validators.required
      ])],

      fecha: ['', Validators.compose([
        Validators.required
      ])],

      email: ['', Validators.compose([
        Validators.required
      ])],

      cantidad: ['',
        Validators.compose([
          Validators.required,
        ])],

    });
  }
  
  public enviarData(){
    if(!this.form.valid){
      this.toastr.error('¡Datos incorrectos!', 'ERROR', {
        timeOut: 3000, positionClass: 'toast-top-center'
      });
      return;
    }
    console.log(this.form.value);
    if (this.id !== null) {
    this.devolucionService.editarDevoluciones(this.id, this.form.value).subscribe((data: any) => {
      console.log(data.value);
      this.toastr.success('¡Devolucion actualizado correctamente!', 'OK', {
        timeOut: 3000, positionClass: 'toast-bottom-right'
      });
      this.router.navigateByUrl("/administracion/devoluciones");
    })
    console.log(this.form.value)
  }
  }
  
  esEditarDesc() {
    if (this.id !== null) {
      this.devolucionService.obtenerDevoluciones(this.id).subscribe((data) => {
      
        this.form.setValue({
          idDevolucion: data.idDevolucion,   
          compra: data.compra.idCompra,
          cantidad: data.cantidad,
          fecha: data.fecha,
          email:data.compra.usuario.email
        });
      });
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
