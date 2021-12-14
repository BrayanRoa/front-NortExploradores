import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SugerenciasService } from 'src/app/services/sugerencias.service';

@Component({
  selector: 'app-resp-sugerencia',
  templateUrl: './resp-sugerencia.component.html',
  styleUrls: ['./resp-sugerencia.component.css']
})
export class RespSugerenciaComponent implements OnInit {
  public form!: FormGroup;
  public idSolicitud:any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private sugerenciaService: SugerenciasService

  ) { }
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      idSugerencia: ['', Validators.required],
      respsugerencia: ['',
        Validators.compose([
          Validators.required,
          Validators.minLength(5)
        ])],
      correo: ['',
        Validators.compose([
          Validators.required,
          Validators.email,
        ])],
    })
    this.idSolicitud = this.route.snapshot.paramMap.get("idSoli");
    this.sugerenciaService.encontrarSug(this.idSolicitud).subscribe(soli=>{
      const out = document.getElementById("inputDescripcions");
      if(out) out.innerHTML=soli.descripcion
      this.form.setValue({
        idSugerencia:soli.idSug,
        respsugerencia:'',
        correo:soli.usuario.email
      })
    })
  }
  enviarData() {
    if(this.form.valid){
    console.log(this.form.value);
    this.sugerenciaService.responderSoli(this.form.value).subscribe(resp=>{
      this.toastr.success("Respuesta enviada", "OK", {
        positionClass: 'toast-bottom-right'
      })
    })
    }else{
      this.toastr.error("Error en el registro", "ERROR", {
        positionClass: 'toast-bottom-right'
      })
    }
  }
}
