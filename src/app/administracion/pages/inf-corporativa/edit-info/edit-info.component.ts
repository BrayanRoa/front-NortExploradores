import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpresaService } from '../../../../services/empresa.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-edit-info',
  templateUrl: './edit-info.component.html',
  styleUrls: ['./edit-info.component.css']
})
export class EditInfoComponent implements OnInit {

  id: any;
  form: FormGroup;
  data: any;
  estado: any;

  constructor(private aRoute: ActivatedRoute, private empresa: EmpresaService, private fb: FormBuilder,
    private toastr: ToastrService,
    private tokenS: TokenService,
    private router: Router) {

    this.form = this.fb.group({
      idEmpresa: ["", Validators.required],
      nombre: ['', Validators.compose([
        Validators.required,
      ])],
      mision: ['',
        Validators.compose([
          Validators.required,
          Validators.maxLength(500)
        ])],
      vision: ['',
        Validators.compose([
          Validators.required,
          Validators.maxLength(500)
        ])],
      descripcion: ['',
        Validators.compose([
          Validators.maxLength(100)
        ])],
      direccion: ['',
        Validators.compose([
          Validators.minLength(10),
          Validators.maxLength(50)
        ])],
      urlImagen: ['',
        Validators.compose([
          Validators.maxLength(500)
        ])],
      correo: ['',
        Validators.compose([
          Validators.maxLength(50),
          Validators.email,
        ])],
      estado: ['',
        Validators.compose([
          Validators.required
        ])],
      telefono: ['',
      Validators.compose([
        Validators.required,
        Validators.maxLength(12),
        Validators.minLength(7),

      ])],
      fecha: ["", Validators.required],
      categoria: []
    })
  }

  ngOnInit(): void {
    this.cargarToken();
    this.id = this.aRoute.snapshot.paramMap.get("idEmp");


    this.empresa.obtenerEmpresa(this.id).subscribe(data => {
      console.log(data)
      this.data = data;

      if (data.estado) {
        this.estado = "activo";
      } else {
        this.estado = "inactivo"
      }

      this.form.setValue({
        idEmpresa: data.idEmpresa,
        nombre: data.nombre,
        mision: data.mision,
        vision: data.vision,
        descripcion: data.descripcion,
        direccion: data.direccion,
        urlImagen: data.urlImagen,
        correo: data.correo,
        estado: data.estado,
        telefono: data.telefono,
        fecha: data.fecha,
        categoria: data.categoria.idCategoria
      })
    })

  }

  enviarData() {

    if(!this.form.valid){
      this.toastr.error('¡Datos incorrectos!', 'ERROR', {
        timeOut: 3000, positionClass: 'toast-top-center'
      });
      return;
    }

    this.empresa.editarEmpresa(this.id, this.form.value).subscribe(data => {
      console.log(this.form.value);
      this.toastr.success('¡Información actualizada correctamente!', 'OK', {
        timeOut: 3000, positionClass: 'toast-top-center'
      });
      this.router.navigateByUrl("/administracion/infoCorporativa");
    })
    console.log(this.form.value)
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
