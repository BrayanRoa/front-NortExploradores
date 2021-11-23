import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpleadosService } from 'src/app/administracion/services/empleados.service';
import { CargoService } from 'src/app/services/cargo.service';
import { PersonaService } from 'src/app/administracion/services/persona.service';
import { TipoidService } from 'src/app/services/tipoid.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-empleado',
  templateUrl: './add-empleado.component.html',
  styleUrls: ['./add-empleado.component.css']
})
export class AddEmpleadoComponent implements OnInit {

  titulo = 'Agregar Empleado';
  boton = 'Agregar Empleado';
  id: string | null;
  idPer: string | null;
  public cargos: any = [];
  public personas: any = [];
  public empleados: any = [];
  public tipos: any = [];
  public form!: FormGroup;
  public formPer!: FormGroup;

  constructor(
    private cargoService: CargoService,
    private empleadoService: EmpleadosService,
    private personaService: PersonaService,
    private formBuilder: FormBuilder,
    private tipoIdService: TipoidService,
    private aRouter: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.id = aRouter.snapshot.paramMap.get('idEmpleado');
    this.idPer = aRouter.snapshot.paramMap.get('idPersona');
  }

  ngOnInit(): void {
    this.agregarCargos();
    this.agregarTipo();
    //this.agregarPersonas();
    this.esEditarEmpleado();
    this.formPer = this.formBuilder.group({
      idPersona: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      sexo: ['', Validators.required],
      fechaNac: ['', Validators.required],
      cel: ['', Validators.required],
      correo: ['', Validators.required],
      idTipo: ['', Validators.required]
    });
    this.form = this.formBuilder.group({
      idEmpleado: ['', Validators.required],
      estado: ['', Validators.required],
      fechaContratacion: ['', Validators.required],
      urlImagen: ['', Validators.required],
      cargo: ['', Validators.required],
      persona: ['', Validators.required]
    });
  }
  public agregarCargos() {
    this.cargoService.listarCargo().subscribe(cargos => {
      this.cargos = cargos;
    })
  }
  public agregarTipo() {
    this.tipoIdService.listarTipo().subscribe(tipos => {
      this.tipos = tipos;
    })
  }
  public enviarData() {
    if (this.id !== null) {
      this.personaService.editarPersona(this.formPer.value).subscribe(persona => {
        this.form.controls.persona.setValue(this.formPer.value);
        this.empleadoService.editarEmpleado(this.form.value).subscribe(data => {
          this.toastr.success("Empleado Editado Con Exito!", "Empleado Editado", {
            positionClass: 'toast-bottom-right'
          })
        })
        this.router.navigate(["/administracion/empleados"]);
      });
    } else {
      this.form.controls.persona.setValue(this.formPer.value);
      this.personaService.post(this.formPer.value).subscribe(persona => {
        this.empleadoService.post(this.form.value).subscribe(data => {
          this.toastr.success("Empleado Agregado Con Exito!", "Empleado Registrado", {
            positionClass: 'toast-bottom-right'
          })
          this.router.navigate(["/administracion/empleados"]);
        })
      });
    }
  }
  public esEditarEmpleado() {
    if (this.id !== null) {
      this.titulo = 'Editar Empleado';
      this.boton = 'Editar Empleado';
      this.empleadoService.obtenerEmpleado(this.id).subscribe((data) => {
        this.form.setValue({
          idEmpleado: data.idEmpleado,
          estado: data.estado,
          fechaContratacion: data.fechaContratacion,
          urlImagen: data.urlImagen,
          cargo: data.cargo.idCargo,
          persona: data.persona.idPersona
        });
        const output = document.getElementById('tipoCC');
          if (output){
            output.setAttribute("value",data.persona.idTipo.tipo)
          }
        this.formPer.setValue({
          idPersona: data.persona.idPersona,
          nombre: data.persona.nombre,
          apellido: data.persona.apellido,
          sexo: data.persona.sexo,
          fechaNac: data.persona.fechaNac,
          cel: data.persona.cel,
          correo: data.persona.correo,
          idTipo: data.persona.idTipo.idTipo
        });
      });

    }
  }
}