import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DescuentosService } from 'src/app/administracion/services/descuentos.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-edit-descuentos',
  templateUrl: './edit-descuentos.component.html',
  styleUrls: ['./edit-descuentos.component.css']
})
export class EditDescuentosComponent implements OnInit {

  public descuentos:any = [];
  public form!: FormGroup;
  id: string | null;

  constructor(
    private descuentoService: DescuentosService,
    private formBuilder: FormBuilder,
    private aRouter: ActivatedRoute ,
    private router : Router,
    private toastr: ToastrService,
    private tokenS:TokenService
  ){
    this.id = aRouter.snapshot.paramMap.get('idDescuento');
  }

  ngOnInit(): void {
    this.cargarToken();
    this.esEditarDesc();
    this.form=this.formBuilder.group({
      descripcion: ['',
        Validators.compose([
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200)
        ])],
      porcentaje: ['', Validators.compose([
        Validators.required,
        Validators.min(0),
        Validators.max(100),
      ])],
      idDescuento: ['', ],
    });
  }
 
  public enviarData(){
    if(!this.form.valid){
      this.toastr.error('¡Datos incorrectos!', 'ERROR', {
        timeOut: 3000, positionClass: 'toast-top-center'
      });
      return;
    }

    this.descuentos.editarDescuentos(this.id, this.form.value).subscribe((data: any) => {
      console.log(data.value);
      this.toastr.success('¡Descuento actualizado correctamente!', 'OK', {
        timeOut: 3000, positionClass: 'toast-top-center'
      });
      this.router.navigateByUrl("/administracion/descuentos");
    })
    console.log(this.form.value)
  }

  esEditarDesc() {
    if (this.id !== null) {;
      this.descuentoService.obtenerDescuentos(this.id).subscribe((data) => {
        this.form.setValue({
          idDescuento: data.idDescuento,
          descripcion: data.descripcion,
          porcentaje: data.porcentaje
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



