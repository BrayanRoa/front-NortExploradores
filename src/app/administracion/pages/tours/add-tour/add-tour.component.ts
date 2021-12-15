import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpleadosService } from 'src/app/administracion/services/empleados.service';
//import { MunicipioService } from 'src/app/administracion/services/municipio.service';
//import { RutasService } from 'src/app/administracion/services/rutas.service';
import { SegurosService } from 'src/app/administracion/services/seguros.service';
import { ToursService } from 'src/app/administracion/services/tours.service';
import { TransportesService } from 'src/app/administracion/services/transportes.service';
import { PaqueteService } from 'src/app/services/paquete.service';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from 'src/app/services/usuario.service';
import { TokenService } from 'src/app/services/token.service';
@Component({
  selector: 'app-add-tour',
  templateUrl: './add-tour.component.html',
  styleUrls: ['./add-tour.component.css'],
})
export class AddTourComponent implements OnInit {
  titulo = 'Agregar Tour';
  boton = 'Agregar Tour';
  id: string | null;
  idTrans: string | null;
  public paquetes: any = [];
  public seguros: any = [];
  public empleados: any = [];
  public transportes: any = [];
  public form!: FormGroup;

  public fechaL!: Date;
  public fechaS!: Date;
  public minC !: number;
  public maxC !: number;

  //public formTrans !: FormGroup;

  constructor(
    private paqueteService: PaqueteService,
    private seguroService: SegurosService,
    private empleadoService: EmpleadosService,
    private tourService: ToursService,
    private transporteService: TransportesService,
    private formBuilder: FormBuilder,
    private aRouter: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private user:UsuarioService,
    private token: TokenService,
  ) {
    this.id = aRouter.snapshot.paramMap.get('idTour');

    this.idTrans = aRouter.snapshot.paramMap.get('idTour/idTransporte');
  }

  ngOnInit(): void {
    this.cargarToken();
    this.esEditartour();
    this.agregarPaquetes();
    this.agregarSeguros();
    this.agregarTransporte();
    this.agregarEmpleados();
      this.form = this.formBuilder.group({
        idTour: ['', Validators.compose([
         
        ])],
        minCupos:['', Validators.compose([
          Validators.required,
          Validators.min(1)
        ])],
        maxCupos: ['', Validators.compose([
          Validators.required,
          Validators.min(1)
        ])],
        fechaLlegada: ['', Validators.compose([
          Validators.required,
        ])],
        fechaSalida: ['', Validators.compose([
          Validators.required,
        ])],
        estado: ['', Validators.compose([
          Validators.required,
        ])],
        empleado:['', Validators.compose([
          Validators.required,
        ])],
        paquete: ['', Validators.compose([
          Validators.required,
        ])],
        idTransporte:['', Validators.compose([
          Validators.required,
        ])],
        seguro: ['', Validators.compose([
          Validators.required,
        ])],
      });
  }


  validarFecha(){
    let fechaLlegada = new Date(this.fechaL);
    let fechaSalida = new Date(this.fechaS);
    let validar = false;
    if(this.fechaL != undefined && this.fechaS != undefined && fechaLlegada >= fechaSalida)
      validar = true
    return validar;
  }

  validarCupos(){
    let validar = false;
    if(this.maxC != undefined && this.minC != undefined && this.maxC >= this.minC)
      validar =  true;
    return validar;
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

  public enviarData() {
    if(!this.form.valid){
      this.toastr.error('Datos incorrectos!', 'Error',{
        positionClass: 'toast-bottom-right'
      });
      return 
    }
    if (this.id !== null) {
      this.tourService.editarTour(this.form.value).subscribe((data) => {
        this.tourService
          .guardarTransporteTour(
            data.idTour,
            this.form.controls.idTransporte.value
          )
          .subscribe((data) => { this.toastr.success('Tour Editado Con Exito!', 'Tour Editado',{
            positionClass: 'toast-bottom-right'
          });
            console.log(data);
            this.router.navigate(['/administracion/tours']);
          });
      });
    } else {
      this.tourService.post(this.form.value).subscribe((data) => { 
        this.tourService
          .guardarTransporteTour(
            data.idTour,
            this.form.controls.idTransporte.value
          )
          .subscribe((data) => {this.toastr.success('Tour Agregado Con Exito!', 'Tour Agregado',{
            positionClass: 'toast-bottom-right'
          });
            this.router.navigate(['/administracion/tours']);
          });
      });
    }
  }

  public esEditartour() {
    if (this.id !== null) {
      this.titulo = 'Editar Tour';
      this.boton = 'Editar Tour';
let tour:any

      this.tourService.obtenerTour(this.id).subscribe((data) => {
        tour=data
        console.log(data)
        this.tourService.obtenerTrans(this.id).subscribe((data) => {
          this.form.setValue({
            idTour: tour.idTour,
            minCupos: tour.minCupos,
            maxCupos: tour.maxCupos,
            fechaLlegada: tour.fechaLlegada,
            fechaSalida: tour.fechaSalida,
            empleado: tour.empleado.idEmpleado,
            paquete: tour.paquete.idPaq,
            idTransporte: data.idTransporte,
            estado: tour.estado,
            seguro: tour.seguro.idSeguro,
          });
        });
      });
    }
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
