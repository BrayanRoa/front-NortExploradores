import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SegurosService } from 'src/app/administracion/services/seguros.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-add-seguros',
  templateUrl: './add-seguros.component.html',
  styleUrls: ['./add-seguros.component.css']
})
export class AddSegurosComponent implements OnInit {

  public empresas:any = [];
  public form!: FormGroup;
  titulo = 'Agregar Seguro';
  boton = 'Agregar Seguro';
  id: string | null;

  constructor(
    private empresaService:EmpresaService,
    private seguroService:SegurosService,
    private formBuilder: FormBuilder,
    private aRouter: ActivatedRoute ,
    private router : Router,
    private toastr: ToastrService,
    private tokenS:TokenService
  ){
    this.id = aRouter.snapshot.paramMap.get('idSeguro');
  }

  ngOnInit(): void {
    this.cargarToken();
    this.agregarEmpresa();
    this.esEditar();
    this.form=this.formBuilder.group({
      nombre: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(25)
      ])],
      descripcion: ['',
        Validators.compose([
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200)
        ])],
      precio: ['', Validators.compose([
        Validators.required,
        Validators.min(10000),
        Validators.max(9999999),
      ])],
      estado: ['', Validators.compose([
        Validators.required,
      ])],
      idSeguro: ['', ],
      empresa: ['', Validators.compose([
        Validators.required
      ])],
      
    });
  }
  public agregarEmpresa(){
    this.empresaService.listarEmpresaS().subscribe(empresas=>{
      this.empresas = empresas; 
      console.log('empresas', this.empresas);
      
    })
  }
 
  public enviarData(){
    if (!this.form.valid) {
      this.toastr.error('¡Datos incorrectos!', 'ERROR', {
        timeOut: 3000, positionClass: 'toast-top-center'
      });
      return;
    }
    if (this.id !== null) {
      this.seguroService
        .editarSeguro(this.id, this.form.value).subscribe((data) => {
          this.toastr.success('Seguro Editado Con Exito!', 'Seguro Editado', {
            positionClass: 'toast-bottom-right' 
          })
          this.router.navigate(["/administracion/seguros"]);
        });
    } else {
      this.seguroService.post(this.form.value).subscribe((data) => {
        this.toastr.success('Seguro Agregado Con Exito!', 'Seguro Registrado', {
          positionClass: 'toast-bottom-right' 
        })
        this.router.navigate(["/administracion/seguros"]);
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
  esEditar() {
    if (this.id !== null) {
      this.titulo = 'Editar Seguro';
      this.boton = 'Editar Seguro';
      this.seguroService.obtenerSeguro(this.id).subscribe((data) => {
        this.form.setValue({
          nombre: data.nombre,
          descripcion: data.descripcion,
          precio: data.precio,
          estado: data.estado,
          idSeguro: data.idSeguro,
          empresa: data.empresa.idEmpresa,
        });
      });
    }
  }

}
