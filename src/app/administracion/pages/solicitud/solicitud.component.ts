import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlojamientosService } from 'src/app/administracion/services/alojamientos.service';
import { PaquetesService } from 'src/app/administracion/services/paquetes.service';
import { ActividadesService } from 'src/app/administracion/services/actividades.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MunicipioService } from 'src/app/administracion/services/municipio.service';
import { SegurosService } from '../../services/seguros.service';
import { EmpleadosService } from '../../services/empleados.service';
import { TourService } from 'src/app/services/tour.service';
import { TransportesService } from '../../services/transportes.service';
import { ToastrService } from 'ngx-toastr';
import { SolicitudpaqueteService } from '../../services/solicitudpaquete.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-add-tour',
  templateUrl: './solicitud.component.html',
})
export class SolicitudComponent implements OnInit {
  public paquetes: any = [];
  public solicitudTour:any;
  public usuario:any;
  public seguros: any = [];
  public empleados: any = [];
  public transportes: any = [];
  public alojamientos: any = [];
  public municipios: any = [];
  public actividades: any = [];
  public form!: FormGroup;
  titulo = 'Agregar Paquete';
  boton = 'Agregar Paquete';
  public isAceptado = false;
  public isRechazado=false;
  public flag:any;
  id: string | null;

  constructor(
    private alojamientoservice: AlojamientosService,
    private municipioService: MunicipioService,
    private actividadService: ActividadesService,
    private paqueteService: PaquetesService,
    private formBuilder: FormBuilder,
    private router: Router,
    private aRouter: ActivatedRoute,
    private seguroService: SegurosService,
    private empleadoService: EmpleadosService,
    private tourService: TourService,
    private transporteService: TransportesService,
    private toastr: ToastrService,
    private solicitudPaqueteService: SolicitudpaqueteService,
    private user:UsuarioService,
    private token: TokenService,
  ) {
    this.id = aRouter.snapshot.paramMap.get('idSolicitud');
  }

  ngOnInit(): void {
    this.cargarToken()
    this.agregarPaquetes();
    this.agregarSeguros();
    this.agregarEmpleados();
    this.agregarTransporte();
    this.agregarAlojamiento();
    this.agregarMunicipio();
    this.user.usuarioPorUsername(this.token.getUserName()).subscribe(user=>{
      this.usuario = user;
    });

    this.form = this.formBuilder.group({
      idSolicitud:[''],
      usuario:[''],
      precio: ['', Validators.required],
      estado: ['', Validators.required],
      alojamiento: ['', Validators.required],
      municipio: ['', Validators.required],
      descripcion:['', Validators.required],

      tour: this.formBuilder.group({
        idTour: ['', Validators.required],
        minCupos: ['', Validators.required],
        maxCupos: ['', Validators.required],
        fechaLlegada: ['', Validators.required],
        cantCupos: ['', Validators.required],
        fechaSalida: ['', Validators.required],
        empleado: ['', Validators.required],
        paquete: ['', Validators.required],
        idTransporte: ['', Validators.required],
        seguro: ['', Validators.required],
      })
    });
    this.solicitudPaqueteService.obtenerSolicitud(this.id).subscribe(solicitud => {
      this.solicitudTour = solicitud;
      const out = document.getElementById("cliente");
      if (out) out.innerHTML = solicitud.usuario.username

      if(solicitud.estado =="ACEPTADO"){
        this.isAceptado=true;
        return;
      }
      else if(solicitud.estado =="RECHAZADO"){
        this.isRechazado=true;
        return;
      }
      this.flag=2;
      this.form.setValue({
        idSolicitud:this.id,
        usuario:solicitud.usuario,
        estado: "ACEPTADO",
        alojamiento:"",
        precio:0,
        descripcion:solicitud.descripcion,
        municipio: solicitud.municipio.idMuni,
        tour: {
          idTour: solicitud.tour.idTour,
          minCupos: solicitud.tour.minCupos,
          maxCupos: solicitud.tour.maxCupos,
          cantCupos: solicitud.tour.cantCupos,
          fechaLlegada: solicitud.tour.fechaLlegada,
          fechaSalida: solicitud.tour.fechaSalida,
          empleado: solicitud.tour.empleado,
          idTransporte: "",
          seguro: "",
          paquete:null,
        }
      })
    })
    console.log(this.form.value);

  }

  public agregarAlojamiento() {
    this.alojamientoservice.listarAlojamiento().subscribe(alojamientos => {
      this.alojamientos = alojamientos;
    })
  }

  public agregarMunicipio() {
    this.municipioService.listarMunicipio().subscribe(municipios => {
      this.municipios = municipios;
    })
  }


  get getTour() {
    return this.form.get('tour') as FormGroup;
  }

  public enviarData() {
    console.log(this.form.value);
            this.solicitudPaqueteService.aceptarSolicitud(this.form.value).subscribe(respuesta=>{
              this.toastr.success("La solicitud ha sido aceptada", 'OK', {
                timeOut: 3000, positionClass: 'toast-top-center'
              });
            })
}

  public agregarPaquetes() {
    this.paqueteService.listar().subscribe((paquetes) => {
      this.paquetes = paquetes;
    });
  }

  public agregarTransporte() {
    this.transporteService.listarTransporte().subscribe((transportes) => {
      this.transportes = transportes;
    });
  }

  public agregarSeguros() {
    this.seguroService.listarSeguro().subscribe((seguros) => {
      this.seguros = seguros;
    });
  }

  public agregarEmpleados() {
    this.empleadoService.listarEmpleado().subscribe((empleados) => {
      this.empleados = empleados;
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

}
