import { Component, OnInit } from '@angular/core';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { Subject } from 'rxjs';
import { Columns, Img, ITable, PdfMakeWrapper, Table, Txt } from 'pdfmake-wrapper';
import * as global from 'global'


type TableRow = [string, number];
export interface totalPaquete {
  nombre: string;
  total:  number;
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

  id:any;
  url = `${global.url}/compra/`;

  meses = [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
                       "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  constructor() { }

  ngOnInit(): void {
    
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 6,
      language:{
        url:"//cdn.datatables.net/plug-ins/1.11.3/i18n/es_es.json"
      }
    };
    
    this.dtTrigger.next();
  }

  reporteMes(mes:any){
    console.log(mes);
    console.log(this.meses.indexOf(mes)+1);

  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  async generar(mes:string) {
    this.id = this.meses.indexOf(mes)+1
    const pdf = new PdfMakeWrapper();
    const data = await this.datos();

    pdf.pageSize("A4"); // TAMAÑO DE LA PÁGINA
    pdf.pageMargins([40, 60]); // MARGENES DE LA PÁGINA
    pdf.pageOrientation('portrait'); // 'portrait' --> POSICIÓN DE LA 

    pdf.header(new Txt(`REPORTE DEL MES DE ${mes.toUpperCase()} - NORTXPLORADORES`).alignment("center").margin(10).color("green").end) // ENCABEZADO DE LA PÁGINA


   
    pdf.add(
      new Columns([await (await new Img("https://raw.githubusercontent.com/SantiagoAndresSerrano/img-soka/master/LOGO-01.png").width(80).height(80).noWrap().alignment('left').margin(14).build()),

      new Txt('NorteXploradores brinda una asistencia profesional a todos aquellos que necesitan un servicio de viaje. Centrándose en brindar respuestas rápidas, precisas y eficientes con el fin de ofrecer un servicio personalizado de calidad y confiabilidad.').margin([22, 15, 2, 2]).alignment("justify").end]).end)


      pdf.add(new Txt(`TOTAL VENTAS POR PAQUETES`).alignment("center").color("blue").bold().margin([0,30,0,0]).end);
    pdf.add(this.createTable(data));
    
    pdf.create().open();
  }

  createTable(data: totalPaquete[]): ITable {
    return new Table([
      ["NOMBRE","TOTAL"],
      ...this.extraer(data)
    ])
    .widths('*')
    .layout({
      fillColor : (rowIndex: number|undefined, node: any|undefined, columnIndex:number|undefined)=>{
        return rowIndex===0? '#D3E4CD' : '#FAEDF0'
      }
    }).bold().margin([2,12]).alignment('center').decorationColor("blue")
    .end
  }

  extraer(data: totalPaquete[]): TableRow[] {
    return data.map(row => [row.nombre, row.total])
  }

  async datos(): Promise<totalPaquete[]> {
    return fetch(`${this.url}${this.id}/totalPaquetesMesTabla`)
      .then(resp => resp.json());
  }

}
