import { AUTO_STYLE } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Img, ITable, PdfMakeWrapper, Table, Txt } from 'pdfmake-wrapper';
import { Subject } from 'rxjs';
import { TokenService } from 'src/app/services/token.service';
import { ToursService } from '../../services/tours.service';
import * as global from 'global'

type TableRow = [number, string, string, string, string]
export interface PersonasTour {
  identificacion: number;
  nombre:         string;
  correo:         string;
  username:       string;
  fechaNac:       string;
}


@Component({
  selector: 'app-tours',
  templateUrl: './tours.component.html',
  styleUrls: ['./tours.component.css']
})
export class ToursComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  
  dtTrigger = new Subject<any>();
  public data: any[]=[];

  estado =''; 
  form! : FormGroup;

  url = `${global.url}/tour/`;

  constructor(
    private tourService: ToursService,
    private router: Router,
    private token: TokenService,
    private fb  : FormBuilder
    ){

  }

  ngOnInit(): void {
    this.form=this.fb.group({
      seleccion : ['', Validators.required]
    });
    
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 6,
      language:{
        url:"//cdn.datatables.net/plug-ins/1.11.3/i18n/es_es.json"
      }
    };
    this.tourService.listarTour().subscribe((data:any)=>{
      // this.data = data;
      for (const iterator of data) {
        if(iterator.estado=="ACTIVO"){
          this.data.push(iterator);
        }
      }
      this.dtTrigger.next();
    })
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    // this.dtTrigger.unsubscribe();
  }
  deshabilitar(id:any){
    this.tourService.deshabilitar(id).subscribe((data) => {  
      console.log(id);
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

  cambiar(){
    const selec = this.form.value.seleccion;
    if(selec==='activos'){
      this.estado='Activos';
      this.router.navigateByUrl('/administracion/tours');
    }else if(selec==='inactivos'){
      this.estado='Inactivos';
      this.router.navigateByUrl('/administracion/toursInactivos');
    }
    console.log(selec);
  }

  async generar(id: any, nombre:string) {
    
    
    const pdf = new PdfMakeWrapper();
    const data = await this.datos(id);

    pdf.pageSize("A4"); // TAMAÑO DE LA PÁGINA
    pdf.pageMargins([20, 20]); // MARGENES DE LA PÁGINA
    pdf.pageOrientation('landscape'); // 'portrait' --> POSICIÓN DE LA 

    pdf.add(
      new Table([
        [await new Img("https://raw.githubusercontent.com/SantiagoAndresSerrano/img-soka/master/LOGO-01.png").width(80).height(80).noWrap().alignment('center').margin(0).build(),
        new Txt("NORTEXPLORADORES").alignment("center").fontSize(20).margin([0, 25]).bold().end,
        new Txt("NorteXploradores@gmail.com\n NIT: 1090463941 - 0\n TEL: 3209177920\n RNT: 84950").alignment("center").margin([0, 10]).bold().end],

      ]).widths([140, AUTO_STYLE, 165]).alignment("center").end
    )



    pdf.add(new Txt(`PASAJEROS DEL TOUR ${nombre.toUpperCase()}`).alignment("center").color("blue").bold().margin([0, 30, 0, 0]).end);

    pdf.add(this.createTable(data));


    // pdf.add(
    //   new Table([
    //     [new Txt("Total").bold().end, new Txt(`$${this.total.toString()}`).bold().end],
    //   ]).widths(['*', 151]).end
    // )

    // pdf.add(
    //   new Txt(`En el mes de ${mes} se realizaron ${totalTours} viajes con un total de ventas de $${totalVentas} donde el ${masVendido} fue el de mayor venta, con un ${porcentaje.toPrecision(4)}% de las ventas del mes y el paquete con menor venta fue el ${menosVendido}. `).margin([0,10]).bold().end
    // )
    

    pdf.create().open();
  }



  createTable(data: PersonasTour[]): ITable {
    return new Table([
      ["DOCUMENTO", "NOMBRE", "CORREO", "USERNAME", "FECHA DE NACIMIENTO"],
      ...this.extraer(data)
    ])
      .widths([100, AUTO_STYLE, AUTO_STYLE, 100, AUTO_STYLE])
      .layout({
        fillColor: (rowIndex: number | undefined, node: any | undefined, columnIndex: number | undefined) => {
          return rowIndex === 0 ? '#D3E4CD' : '#FAEDF0'
        }
      }).bold().margin([2, 12]).alignment('center').decorationColor("blue")
      .end
  }

  extraer(data: PersonasTour[]): TableRow[] {
    const dat: TableRow[] = data.map(row => [row.identificacion, row.nombre, row.correo, row.username, row.fechaNac])

    if (dat.length == 0) {
      let aux: TableRow[] = [];
      aux[0] = [0, "---", "---", "---", "---"]
      return aux
    } else {
      return dat
    }
  }


  async datos(id:any): Promise<PersonasTour[]> {
    return fetch(`${this.url}${id}/pasajerosTour`)
      .then(resp => resp.json());
  }
}
