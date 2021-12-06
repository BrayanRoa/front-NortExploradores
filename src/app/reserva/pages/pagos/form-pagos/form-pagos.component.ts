import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompraService } from 'src/app/services/compra.service';
import { DetcompraService } from 'src/app/services/detcompra.service';
import { PaqueteService } from 'src/app/services/paquete.service';
import { PersonaService } from 'src/app/services/persona.service';
import { TipoidService } from 'src/app/services/tipoid.service';
import { TokenService } from 'src/app/services/token.service';
import { TourService } from 'src/app/services/tour.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import * as crypto from "crypto-js";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-form-pagos',
  templateUrl: './form-pagos.component.html',
  styleUrls: ['./form-pagos.component.css']

})
export class FormPagosComponent implements OnInit {
  pagosInfo!: FormGroup;
  public tours: any = [];
  public cedulas: number[] = [];
  public persona: any
  public tourSeleccionado: any;
  public cuposDisponibles: any;

  public total = 0;
  public totalCompra = 0

  public pasajerosFrec: any = [];
  public generos: any = ['FEMENINO', "MASCULINO"];
  public tipoId: any = [];
  public pasajerosFrecElegidos: any = [];
  public pasajerosTotal: any = [];
  public pasajeros: any = [];

  public idPaquete: any;

  public usuario: any;
  public isLogged!: boolean;
  public pagosForm!: FormGroup;

  public nombreUser!: string;

  // Info page pago 2
  public infoPagina = 1;
  public idCompra = this.generarReferencia();

  public costoUnit!: number;

  //payu variables

  referenciaUnic = this.generarReferencia();
  iva = 0.19;
  moneda = "COP";
  apikey = "jR9INc85abuxxkcn1Xn1hqZe5P";

  idCuenta = "957106";
  idMercado = "949518";

  email = ""
  nombrePersona = "";

  idUsuario = "";
  descripcion = "";

  url = `https://nortexploradores.herokuapp.com/pagos/confirmacion`;

  firmaElectronica!: string
  firmaElectronicaMD5!: string

  // test =================================================================
  idCuentaTest = "512321";
  apikeyTest = "4Vj8eK4rloUd272L48hsrarnUA";

  firmaElectronicaTest = `${this.apikeyTest}~508029~${this.referenciaUnic}~${this.total}~${this.moneda}`;
  firmaElectronicaMD5Test = crypto.MD5(this.firmaElectronicaTest).toString();


  constructor(
    private paqueteService: PaqueteService,
    private usuarioService: UsuarioService,
    private tipoIdService: TipoidService,
    private personaService: PersonaService,
    private route: ActivatedRoute,
    private tokenS: TokenService,
    private formBuilder: FormBuilder,
    private tourService: TourService,
    private compraService: CompraService,
    private detalleCompra: DetcompraService,
    private toastr: ToastrService,
    private router: Router,
    private aRoutes: ActivatedRoute

  ) {

    this.idPaquete = this.aRoutes.snapshot.paramMap.get("idPaq");
    if(this.idPaquete){
      this.tourSeleccionado = this.tourService.encontrarTour(this.idPaquete).subscribe(tour => {
        this.tourSeleccionado = tour;
        this.cuposDisponibles = tour.cantCupos;
        const output = document.getElementById('cantidadCupos');
        if (output) output.innerHTML = tour.cantCupos;
        const output2 = document.getElementById('imagenTour');
        if (output2) output2.setAttribute("src", tour.paquete.urlImagen);
      })
    }
   }

  ngOnInit():void {
    this.nombreUser = this.tokenS.getUserName();
    this.cargarUsuario();
    this.cargarToken();
    this.listarTour();
    this.generarReferencia();
    this.referenciaUnic = this.generarReferencia()
    
    this.pagosInfo = this.formBuilder.group({
      paquete: this.idPaquete,
      total: [],
      pasajeros: this.formBuilder.array([])
    });
    this.tipoIdService.getTipoId().subscribe(ids => {
      this.tipoId = ids
    });
  }

  get pasajerosDeGrupos() {
    return this.pagosInfo.get('pasajeros') as FormArray
  }


  agregarPasajero(tipoid = "", documento = "", nombre = "", apellido = "", sexo = "", fechaNac = "", celular = "", correo = "") {
    if (this.total == 0) return;

    this.total++;
    let persona = this.pagosInfo.get('pasajeros') as FormArray;
    persona.push(this.formBuilder.group({
      idTipo: [tipoid, [Validators.required]],
      idPersona: [documento, Validators.compose([
        Validators.required,
        Validators.min(10000000),
        Validators.max(999999999)]
      )],
      nombre: [nombre, Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20)]
      )],
      apellido: [apellido, Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20)
      ])],
      sexo: [sexo, Validators.compose([Validators.required])],
      fechaNac: [fechaNac, Validators.compose([Validators.required])],
      cel: [celular, Validators.compose([
        Validators.required,
        Validators.min(3000000000),
        Validators.max(3999999999)]
      )],
      correo: [correo, Validators.compose([
        Validators.required,
        Validators.email]
      )],
      estado: [1, [Validators.required]]
    }));

    this.toastr.success('Pasajero agregado', 'OK', {
      timeOut: 3000, positionClass: 'toast-top-center'
    });
  }

  verificarFecha(event: any, element: HTMLElement) {
    let edadPasajero = this.calcularfecha(event.target.value);
    if (edadPasajero >= 0 && edadPasajero <= 200) {
      element.classList.add("is-valid");
      element.classList.remove("is-invalid");

    } else {
      element.classList.remove("is-valid");
      element.classList.add("is-invalid");

    }
  }

  eliminarPasajero(i: number, pasajero: any) {
    let pasajeros = this.pagosInfo.get('pasajeros') as FormArray;
    if (this.total > 0)
      this.total--;
    pasajeros.removeAt(i);
  }

  esRepetido(arreglo: number[]): boolean {
    const tempArray = [...arreglo].sort();
    for (let i = 0; i < tempArray.length; i++) {
      if (tempArray[i + 1] === tempArray[i]) {
        this.toastr.error("Cédula " + tempArray[i + 1] + " repetida", 'ERROR', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        return true;
      }
    }
    return false;

  }
  public pasajeroI(i: any): any {
    let nuevoFormato: any;
    nuevoFormato = this.pagosInfo.controls.pasajeros;
    return (nuevoFormato.controls[i]);
  }
  createpagosInfo() {
    const compra = document.getElementById("comprastep");
    let datosIncorrectos: Boolean = false;
    let msg = "";
    let personas = this.pagosInfo.value.pasajeros;
    let pasajeros = [];

    if (this.tourSeleccionado == undefined) {
      datosIncorrectos = true
      if (compra) compra?.classList.add("fail")
      this.cedulas = [];
      this.toastr.error("¡Debes seleccionar un tour!", 'ERROR', {
        timeOut: 3000, positionClass: 'toast-top-center'
      });
      return;
    } else {
      if (this.tourSeleccionado.cantCupos == 0) {
        datosIncorrectos = true
        if (compra) compra?.classList.add("fail")
        this.toastr.error("¡Debes seleccionar un tour!", 'ERROR', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        this.cedulas = [];
        return;
      } else {
        if (compra) compra?.classList.remove("fail")
      }
    }

    if (this.pagosInfo.valid == false) {
      this.cedulas = [];
      this.toastr.error("¡Campos incorrectos!", 'ERROR', {
        timeOut: 3000, positionClass: 'toast-top-center'
      });
      return;
    }

    for (let i = 0; i < personas.length && datosIncorrectos == false; i++) {
      let pasajero = personas[i];
      let idPerson = pasajero.idPersona;
      this.cedulas.push(idPerson); //agrego las cedulas de los pasajeros para buscar si hay alguna repetida

      let fechaNacPasajero = pasajero.fechaNac;
      let edadPasajero = this.calcularfecha(fechaNacPasajero);
      let valorPaquete = parseInt(this.tourSeleccionado.paquete.precio + "");

      this.personaService.getPersona(pasajero.idPersona).subscribe(persona => {
        var pasajeroPost;
        let pasajero = persona;
        if (pasajero == null) {
          pasajeroPost = {
            "idPasajero": null,
            "esCotizante": false,
            "persona": pasajero,
            "usuario": this.usuario.id_Usuario
          }
        } else {
          pasajeroPost = {
            "idPasajero": pasajero.idPasajero,
            "esCotizante": false,
            "persona": pasajero,
            "usuario": this.usuario.id_Usuario
          }
        }

        this.pasajerosTotal.push(pasajeroPost);
        pasajeros.push(pasajeroPost)
      },
        error => {
          console.log(error);
        }
      );

      var pasajeroPost = {
        "idPasajero": null,
        "esCotizante": false,
        "persona": pasajero,
        "usuario": this.usuario.id_Usuario
      }
      this.pasajerosTotal.push(pasajeroPost);
      pasajeros.push(pasajeroPost)
    }

    if (this.esRepetido(this.cedulas)) {
      this.cedulas = [];
      return;
    }

    const output = document.getElementById("errorPresentado");
    if (output) output.innerHTML = "";

    if (datosIncorrectos == true) {
      if (compra) output?.classList.add("fail")
      this.toastr.error(msg, 'ERROR', {
        timeOut: 3000, positionClass: 'toast-top-center'
      });
      return;

    } else {
      if (compra) output?.classList.remove("fail")
      if (output) output.innerHTML = "";
    }

    let pasajeross = this.pagosInfo.get('pasajeros') as FormArray;

    for (let i = 0; i < pasajeros.length; i++) {
      pasajeros[i].idPasajero = pasajeross.at(i).value.idPasajero;
    }

    this.pasajeros = pasajeros;
    if (compra) {
      compra?.classList.add("complete")
      compra?.classList.remove("pendiente")
    }
    this.totalCompra = this.pasajeros.length*this.tourSeleccionado.paquete.precio
    this.infoPagina = 2;

    window.scroll(0, 0);

    let pasajerosX = this.pagosInfo.get('pasajeros') as FormArray;
    this.descripcion = "Pago de (" + pasajerosX.length + ") paquete(s) turistico(s) destino: " + this.tourSeleccionado.paquete.municipio.nombre
    this.pagosInfo.markAllAsTouched();
    this.cargarPayu();
  }

  cargarUsuario() {
    this.usuarioService.usuarioPorUsername(this.nombreUser).subscribe(usuario => {
      this.usuario = usuario;
      this.agregarPasajerosFrec();
    })
  }

  public cargarToken() {
    if (this.tokenS.getToken()) {
      this.isLogged = true;
    } else {
      this.isLogged = false;
      this.toastr.warning("Debes iniciar sesión para comprar tours ","",{
        timeOut: 3000, positionClass: 'toast-top-center'
      });
      this.router.navigateByUrl("/login");
    }
  }


  public listarTour() {
    this.tourService.listarTourActivo().subscribe(tour => {
      this.tours = tour
      this.pagosInfo.setValue({
        paquete: this.idPaquete
      })
    })
  }

  public agregarPasajerosFrec() {
    this.usuarioService.pasajerosPorCliente(this.usuario.id_Usuario).subscribe(pasajeros => {
      this.cargarPasajeros(pasajeros);
    })
  }

  public cargarPasajeros(pasajeros: any) {

    for (let i = 0; i < pasajeros.length; i++) {
      let pasajero = pasajeros[i];
      if (pasajero.esCotizante == false) {
        this.pasajerosFrec.push(pasajero);
      } else {
        this.persona = pasajeros[i].persona;
        this.total++;
        let pasajeroX = this.pagosInfo.get('pasajeros') as FormArray;
        pasajeroX.push(
          this.formBuilder.group({
            idTipo: [this.persona.idTipo.idTipo, [Validators.required]],
            idPersona: [this.persona.idPersona, [Validators.required]],
            nombre: [this.persona.nombre, [Validators.required]],
            apellido: [this.persona.apellido, [Validators.required]],
            sexo: [this.persona.sexo, [Validators.required]],
            fechaNac: [this.persona.fechaNac, [Validators.required]],
            cel: [this.persona.cel, [Validators.required]],
            correo: [this.persona.correo, [Validators.required]],
            idPasajero: [pasajeros[i].idPasajero],
            esCotizante: true
          }));

        const output = document.getElementById('btnagregar');
        if (output) {
          output.removeAttribute("disabled");
          output.classList.add("green")
          output.classList.remove("gray")

        }

      }
    }
  }
  public actualizarPasajeros(event: any) { //metodo para agregar un pasajero o eliminarlo si se vuelve a seleccionar
    let pasajeros = this.pagosInfo.get('pasajeros') as FormArray;


    let idPasajero = event.target.value;
    let yaResgistrado = false;
    let posEliminar = -1 //posicion del pasajero que se encontro y se va a eliminar.
    for (let i = 0; i < pasajeros.length; i++) {
      if (pasajeros.at(i).value.documento == idPasajero) {
        yaResgistrado = true;
        posEliminar = i; // la posicion que eliminare del form builder
        break;
      }
    }

    if (yaResgistrado) {
      pasajeros.removeAt(posEliminar);
      if (this.total > 0)
        this.total--;
    } else {
      //busco a la persona y cargo sus datos en el form.
      this.total++;
      this.personaService.getPasajero(idPasajero).subscribe(pasajero => {
        this.toastr.success("Pasajero frecuente agregado: " + pasajero.persona.nombre, 'OK', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        let persona = pasajero.persona;
        pasajeros = this.pagosInfo.get('pasajeros') as FormArray;
        pasajeros.push(this.formBuilder.group({
          idTipo: [persona.idTipo.idTipo, [Validators.required]],
          idPersona: [persona.idPersona, [Validators.required]],
          nombre: [persona.nombre, [Validators.required]],
          apellido: [persona.apellido, [Validators.required]],
          sexo: [persona.sexo, [Validators.required]],
          fechaNac: [persona.fechaNac, [Validators.required]],
          cel: [persona.cel, [Validators.required]],
          correo: [persona.correo, [Validators.required]],
          idPasajero: [pasajero.idPasajero]
        }));
      })


    }
  }

  // Segunda vista ----->

  cargarTour(event: any) {
    let idTourSeleccionado = event.target.value;
    this.tourSeleccionado = this.tourService.encontrarTour(idTourSeleccionado).subscribe(tour => {
      this.tourSeleccionado = tour;
      this.cuposDisponibles = tour.cantCupos;
      const output = document.getElementById('cantidadCupos');
      if (output) output.innerHTML = tour.cantCupos;
      const output2 = document.getElementById('imagenTour');
      if (output2) output2.setAttribute("src", tour.paquete.urlImagen);
    })
  }

  generarReferencia(): string {
    const fecha = new Date();
    return Math.round((Math.random() * 45644)) + "" + Math.round(fecha.getMilliseconds());
  }


  calcularfecha(birthDate: any) {
    birthDate = new Date(birthDate);
    let otherDate = new Date();

    var years = (otherDate.getFullYear() - birthDate.getFullYear());

    if (otherDate.getMonth() < birthDate.getMonth() ||
      otherDate.getMonth() == birthDate.getMonth() && otherDate.getDate() < birthDate.getDate()) {
      years--;
    }

    return years;
  }

  volverPag() {
    this.infoPagina = 1
    this.cedulas = [];
    window.scroll(0, 0);
    this.totalCompra = 0
  }


  cargarPayu() {

    this.infoPagina = 2
    window.scroll(0, 0);
    const factura = document.getElementById("facturastep");
    if (factura) {
      factura?.classList.remove("pendiente")
      factura?.classList.add("complete")
    }

    const pago = document.getElementById("pagostep");
    if (pago) {
      pago?.classList.add("pendiente")
      pago?.classList.remove("complete")
    }
    this.totalCompra= this.totalCompra/2
    this.idUsuario = this.usuario.id_Usuario
    this.email = this.persona.correo
    this.nombrePersona = this.persona.nombre + " " + this.persona.apellido

    let pasajeros = this.pagosInfo.get('pasajeros') as FormArray;
    this.descripcion = "Pago de (" + pasajeros.length + ") paquete(s) turistico(s) destino: " + this.tourSeleccionado.paquete.municipio.nombre

    this.firmaElectronica = `${this.apikey}~${this.idMercado}~${this.idCompra}~${this.totalCompra}~${this.moneda}`;
    this.firmaElectronicaMD5 = crypto.MD5(this.firmaElectronica).toString();

    // Pruebas

    this.firmaElectronicaTest = `${this.apikeyTest}~508029~${this.idCompra}~${this.totalCompra}~${this.moneda}`;
    this.firmaElectronicaMD5Test = crypto.MD5(this.firmaElectronicaTest).toString();

  }

  guardarCompra(form:any) {

    var compra = {
      idCompra: this.idCompra,
      cantidadPasajeros: this.total,
      totalCompra: this.totalCompra*2,
      estado: "PENDIENTE",
      usuario: this.usuario.id_Usuario,
      tour: this.tourSeleccionado.idTour
    }

    this.toastr.warning("Cargando compra...", 'Espere', {
      timeOut: 3000, positionClass: 'toast-top-center'
    });

    this.usuarioService.guardarPasajerosDeUsuario(this.usuario.id_Usuario, this.pasajeros).subscribe(pasajeros => {
      this.pasajerosTotal = pasajeros;
      this.toastr.success("Pasajeros ingresados", 'Ok', {
        timeOut: 3000, positionClass: 'toast-top-center'
      });

      this.compraService.post(compra, this.tourSeleccionado.idTour).subscribe(compra => {
        let pasajeros = this.pasajerosTotal;
        let detalleCompras = [];

        for (let i = 0; i < pasajeros.length; i++) {

          let detalleCompra = {
            compra: compra.idCompra,
            valorUnit: this.tourSeleccionado.paquete.totalCompra,
            pasajero: pasajeros[i].idPasajero,
            paquete: this.tourSeleccionado.paquete
          }
          detalleCompras.push(detalleCompra);
        }
        this.detalleCompra.post(detalleCompras).subscribe(det => {
          form.submit();
        });
      },error=>{
        this.toastr.error(error.error, 'ERROR', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
      })
    });
  }
}






