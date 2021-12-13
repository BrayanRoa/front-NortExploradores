import { Component, OnInit } from '@angular/core';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { Subject, Observable } from 'rxjs';
import { Columns, Img, ITable, PdfMakeWrapper, Table, Txt } from 'pdfmake-wrapper';
import * as global from 'global'
import { AUTO_STYLE } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { CompraService } from '../../../../services/compra.service';


type TableRow1 = [number];

type TableRow = [string, string, number, number, number]

export interface total {
  total:  number;
}

export interface TotalPaquete {
  nombreTour: string;
  totalPasajeros: number;
  total: number;
  porcentajeVentas: number;
  tipoTour: string;
}

@Component({
  selector: 'app-reportes-meses',
  templateUrl: './reportes-meses.component.html',
  styleUrls: ['./reportes-meses.component.css']
})
export class ReportesMesesComponent implements OnInit {

  size: NzButtonSize = 'large';
  dtOptions: DataTables.Settings = {};

  dtTrigger = new Subject<any>();

  id: any;
  url = `${global.url}/compra/`;

  total: string="";

  date = new Date().getMonth();
  agno = new Date().getFullYear();

  meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];



  constructor(private http: HttpClient, private compra: CompraService) { }

  ngOnInit(): void {

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 6,
      language: {
        url: "//cdn.datatables.net/plug-ins/1.11.3/i18n/es_es.json"
      }
    };



    this.dtTrigger.next();
  }

  reporteMes(mes: any) {
    console.log(mes);
    console.log(this.meses.indexOf(mes) + 1);

  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }



  async generar(mes: string) {
    this.id = this.meses.indexOf(mes) + 1

    const pdf = new PdfMakeWrapper();
    const data = await this.datos();

    pdf.pageSize("A4"); // TAMAÑO DE LA PÁGINA
    pdf.pageMargins([20, 20]); // MARGENES DE LA PÁGINA
    pdf.pageOrientation('landscape'); // 'portrait' --> POSICIÓN DE LA 

    // pdf.header(new Txt(`REPORTE DEL MES DE ${mes.toUpperCase()} - NORTEXPLORADORES`).alignment("center").margin(10).color("green").end) // ENCABEZADO DE LA PÁGINA



    pdf.add(
      new Table([
        [await new Img("https://raw.githubusercontent.com/SantiagoAndresSerrano/img-soka/master/LOGO-01.png").width(80).height(80).noWrap().alignment('center').margin(0).build(),
        new Txt("NORTEXPLORADORES").alignment("center").fontSize(20).margin([0, 25]).bold().end,
        new Txt("NorteXploradores@gmail.com\n NIT: 1090463941 - 0\n TEL: 3209177920\n RNT: 84950").alignment("center").margin([0, 10]).bold().end],

      ]).widths([140, AUTO_STYLE, 165]).alignment("center").end
    )

   


    pdf.add(new Txt(`TOTAL VENTAS POR PAQUETES MES DE ${mes.toUpperCase()} DEL AÑO ${this.agno}`).alignment("center").color("blue").bold().margin([0, 30, 0, 0]).end);

    pdf.add(this.createTable(data));

    this.obtenerTotal(this.id).subscribe(data=>{

      this.total=data.ventaMes
      console.log(this.total)
      
    })
    
    pdf.add(
      new Table([
        [ 'Total', new Txt(this.total.toString()).end],
    ]).widths([ '*', 100 ]).end
    )


    pdf.create().open();
  }



  createTable(data: TotalPaquete[]): ITable {
    return new Table([
      ["Nombre/Tour", "Tipo/Tour", "N° Pasajeros", "Total/Venta", "% DeVenta"],
      ...this.extraer(data)
    ])
      .widths('*')
      .layout({
        fillColor: (rowIndex: number | undefined, node: any | undefined, columnIndex: number | undefined) => {
          return rowIndex === 0 ? '#D3E4CD' : '#FAEDF0'
        }
      }).bold().margin([2, 12]).alignment('center').decorationColor("blue")
      .end
  }

  extraer(data: TotalPaquete[]): TableRow[] {
    return data.map(row => [row.nombreTour, row.tipoTour, row.totalPasajeros, row.total, row.porcentajeVentas])
  }

  async datos(): Promise<TotalPaquete[]> {
    return fetch(`${this.url}${this.id}/totalPaquetesMesTabla`)
      .then(resp => resp.json());
  }



  

  obtenerTotal(mes:any):Observable<any>{
    return this.http.get<any>(`${this.url}${mes}/totalVendidoMes`)
  }
}
