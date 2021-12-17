import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlojamientosService } from 'src/app/administracion/services/alojamientos.service';
import { PaquetesService } from 'src/app/administracion/services/paquetes.service';
import { ActividadesService } from 'src/app/administracion/services/actividades.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MunicipioService } from 'src/app/administracion/services/municipio.service';
import { ToastrService } from 'ngx-toastr';
import { TokenService } from 'src/app/services/token.service';
@Component({
  selector: 'app-add-paquete',
  templateUrl: './add-paquete.component.html',
  styleUrls: ['./add-paquete.component.css']
})

export class AddPaqueteComponent implements OnInit {

  public alojamientos: any = [];
  public municipios: any  = [];
  public actividades: any=[];
  public form!: FormGroup;
  titulo = 'Agregar Paquete';
  boton = 'Agregar Paquete';
  id: string | null;


  constructor(
    private alojamientoservice: AlojamientosService,
    private municipioService: MunicipioService,
    private actividadService: ActividadesService,
    private paqueteService: PaquetesService,
    private formBuilder: FormBuilder,
    private aRouter: ActivatedRoute,
    private toastr: ToastrService,
    private tokenS: TokenService,
    private router: Router
  ) { 
    this.id = aRouter.snapshot.paramMap.get('idPaq');
  }

  ngOnInit(): void {
    this.cargarToken();
    this.agregarMunicipio();
    this.form=this.formBuilder.group({
      idPaq:['', Validators.required],
      precio:['', 
        Validators.compose([
          Validators.required, 
          Validators.min(1000), 
          Validators.max(1000000)])],
      estado:['', Validators.required],
      urlImagen:['', Validators.compose([
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(250)
      ])],
      descripcion:['', 
        Validators.compose([
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(1000)
      ])],
      recomendacion:['', 
        Validators.compose([
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(1000)])],
      nombre:['', 
        Validators.compose([
          Validators.required, 
          Validators.minLength(3),
          Validators.maxLength(25)])],
      alojamiento:['', Validators.required],
      municipio:['', Validators.required],
      acts: this.formBuilder.array([])
    });
    
}

  public agregarAlojamiento() {
    this.alojamientoservice.listarAlojamiento().subscribe(alojamientos => {
      let idMuni: number
      idMuni = this.form.controls.municipio.value
      let alojamientoss: any  = [];
      for (const alojamiento of alojamientos) {
        if(alojamiento.municipio.idMuni==idMuni){
          alojamientoss.push(alojamiento);
        }
      }
      this.alojamientos = alojamientoss
    })
  }

  public agregarMunicipio() {
    this.municipioService.listarMunicipio().subscribe((municipios :any)=> {
      // this.municipios = municipios;
      for (const municipio of municipios) {
        if(municipio.estado==true){
          // console.log("true", iterator);
          this.municipios.push(municipio);
        }
      }
      // console.log(this.municipios);
      // console.log(municipios);
    })
  }

  public cargarActividades(evento: any){
    
    let totalAct = evento.target.value;
    let actividadess = this.form.get('acts') as FormArray;
    actividadess.clear();

    for (let i = 0; i < totalAct; i++) {
      actividadess.push(
        this.formBuilder.group({
          nombre: ['', Validators.required],
          descripcion: ['', Validators.required], 
          urlImg: ['', Validators.required],
          paquete: [null, Validators.required]
        })
      )
    }
  }
  
  get getActividades(){
    return this.form.get('acts') as FormArray;
  }
  
  public enviarData() {
    this.paqueteService.post(this.form.value).subscribe(paquete=>{
      this.paqueteService.postAct(this.getActividades.value, paquete.idPaq).subscribe(data=>{    
        this.toastr.success("Paquete Agregado Con Exito!", "Paquete Registrado", {
        positionClass: 'toast-bottom-right'
      })
      console.log("id mun:", this.form.value.municipio);
        this.municipioService.deshabilitar(this.form.value.municipio).subscribe(data=>{});
        this.router.navigate(["/administracion/paquetes"]);})
      }, error=>{
        this.toastr.error(error.error, "Error", {
          positionClass: 'toast-bottom-right'
        })
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
