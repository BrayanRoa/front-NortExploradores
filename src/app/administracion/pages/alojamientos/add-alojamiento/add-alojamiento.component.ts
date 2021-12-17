import { Component, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ActivatedRoute, Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AlojamientosService } from 'src/app/administracion/services/alojamientos.service';
import { MunicipioService } from 'src/app/administracion/services/municipio.service';
import { TokenService } from 'src/app/services/token.service';



@Component({
  selector: 'app-add-alojamiento',
  templateUrl: './add-alojamiento.component.html',
  styleUrls: ['./add-alojamiento.component.css']
})
export class AddAlojamientoComponent implements OnInit {
  public form !: FormGroup;
  public alojamientos: any = [];
  public municipios: any  = [];
  titulo = 'Agregar Alojamiento';
  boton = 'Agregar Alojamiento';
  id: string | null;
  
  constructor(
    private alojamientosservice: AlojamientosService,
    private municipioService: MunicipioService,
    private formBuilder: FormBuilder,
    private aRouter: ActivatedRoute,
    private router : Router,
    private toastr: ToastrService,
    private tokenS:TokenService,
  ) {
    this.id = aRouter.snapshot.paramMap.get('idAlojamiento');
  }

  ngOnInit(): void {
    this.cargarToken();
    this.agregarMunicipio();
    this.esEditarAloja();
      this.form = this.formBuilder.group({
      idAlojamiento:['', ],
      municipio:['', Validators.required],
      nombre:['', 
        Validators.compose([
          Validators.required, 
          Validators.maxLength(50)])],
      estado:['', 
        Validators.required],
      dir:['', 
        Validators.compose([
          Validators.required, 
          Validators.minLength(5),
          Validators.maxLength(100)])],
      descripcion:['', Validators.compose([
          Validators.required,
          Validators.minLength(20),
          Validators.maxLength(1000)
      ])],
      precio:['', 
        Validators.compose([
          Validators.required,
          Validators.min(1000),
          Validators.max(1000000)
        ])]
    });
    
  }
  public agregarMunicipio() {
    this.municipioService.listarMunicipio().subscribe((municipios :any)=> {
      for (const municipio of municipios) {
        if(municipio.estado==true){
          this.municipios.push(municipio);
        }
      }
    })
  }
  public enviarData() {
         
    if (!this.form.valid) {
      this.toastr.error('¡Datos incorrectos!', 'ERROR', {
        timeOut: 3000, positionClass: 'toast-top-center'
      });
      return;
    }

    

    if (this.id !== null) {

      this.alojamientosservice.editarAlojamiento(this.id, this.form.value)
        .subscribe((data) => {
          this.toastr.success("Alojamiento Editado Con Exito!", "Alojamiento Editado", {
          positionClass: 'toast-bottom-right'
        })
          this.router.navigate(["/administracion/alojamientos"]);
        });
    } else {
      this.alojamientosservice.post(this.form.value).subscribe((data)=>{
        this.toastr.success("Alojamiento Agregado Con Exito!", "Alojamiento Registrado", {
          positionClass: 'toast-bottom-right'
        })
        this.router.navigate(["/administracion/alojamientos"]);
      });
    }
  }

  esEditarAloja() {
    if (this.id !== null) {
      this.titulo = 'Editar Alojamiento';
      this.boton = 'Editar Alojamiento';
      this.alojamientosservice.obtenerAlojamiento(this.id).subscribe((data) => {
        this.form.setValue({
          idAlojamiento: data.idAlojamiento,
          municipio: data.municipio,
          nombre: data.nombre,
          estado: data.estado,
          dir: data.dir,
          descripcion: data.descripcion,
          precio: data.precio,
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
