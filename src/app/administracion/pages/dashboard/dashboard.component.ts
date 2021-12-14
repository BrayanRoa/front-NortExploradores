
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart } from 'chart.js';
import { CompraService } from 'src/app/services/compra.service';
import { TokenService } from 'src/app/services/token.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Columns, Img, ITable, PdfMakeWrapper, Table, Txt } from 'pdfmake-wrapper';


// total meses (ventas)
type TableRow = [string, number];
// paquetes (ventas)
type TableRow2 = [string, number];
// usuarios (registros)
// type TableRow3 = [number, string];

// type TableRow4 = [];

export interface totalMeses {
  cantidad: number;
  mes:      string;
}

export interface totalPaquete {
  nombre: string;
  total:  number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public canvas: any;
  public ctx: any;
  public datasets: any;
  public data: any;
  public myChartData: any;
  public clicked: boolean = true;
  public clicked1: boolean = false;
  public clicked2: boolean = false;

  date = new Date().getMonth();
  agno = new Date().getFullYear();


  constructor(
    private tokenS: TokenService,
    private router: Router,
    private compraService: CompraService,
    private usuarioService: UsuarioService,
  ) { }

  ngOnInit(): void {
    this.cargarToken();
    var gradientChartOptionsConfigurationWithTooltipRed: any = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },

      tooltips: {
        backgroundColor: '#f5f5f5',
        titleFontColor: '#333',
        bodyFontColor: '#666',
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest"
      },
      responsive: true,
      scales: {
        yAxes: [{
          barPercentage: 1,
          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.0)',
            zeroLineColor: "transparent",
          },
          
          ticks: {
            suggestedMin: 5,
            suggestedMax: 125,
            padding: 20,
            fontColor: "#9a9a9a"
          }
        }],

        xAxes: [{
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(233,32,16,0.1)',
            zeroLineColor: "transparent",
          },
          ticks: {
            padding: 20,
            fontColor: "#9a9a9a"
          }
        }]
      }
    };
    var gradientChartOptionsConfigurationWithTooltipGreen: any = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },

      tooltips: {
        backgroundColor: '#f5f5f5',
        titleFontColor: '#333',
        bodyFontColor: '#666',
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest"
      },
      responsive: true,
      scales: {
        yAxes: [{
          barPercentage: 1,
          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.0)',
            zeroLineColor: "transparent",
          },
          ticks: {
            suggestedMin: 5,
            suggestedMax: 10,
            padding: 20,
            fontColor: "#9e9e9e"
          }
        }],

        xAxes: [{
          barPercentage: 1,
          gridLines: {
            drawBorder: false,
            color: 'rgba(0,242,195,0.1)',
            zeroLineColor: "transparent",
          },
          ticks: {
            padding: 5,
            fontColor: "#9e9e9e"
          }
        }]
      }
      
    };

    // GRAFICA VENTAS POR MESES -------------------------------------------------------------------------


    var chart_labels = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO',
      'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];


    this.compraService.comprasPorMes().subscribe(compras => {
      this.canvas = document.getElementById("chartBig1");
      this.ctx = this.canvas.getContext("2d");

      var gradientStroke = this.ctx.createLinearGradient(0, 230, 0, 50);

      gradientStroke.addColorStop(1, 'rgba(233,32,16,0.2)');
      gradientStroke.addColorStop(0.4, 'rgba(233,32,16,0.0)');
      gradientStroke.addColorStop(0, 'rgba(233,32,16,0)'); //red colors
      let comprasPorMes: any[] = [];

      for (let i = 0; i < compras.length; i++) {
        comprasPorMes.push(compras[i]);
      }
      var gradientStroke = this.ctx.createLinearGradient(0, 230, 0, 50);

      gradientStroke.addColorStop(1, 'rgba(233,32,16,0.2)');
      gradientStroke.addColorStop(0.4, 'rgba(233,32,16,0.0)');
      gradientStroke.addColorStop(0, 'rgba(233,32,16,0)'); //red colors

      var config = {
        type: 'line',
        data: {
          labels: chart_labels,
          datasets: [{
            label: "Ventas en el mes:",
            fill: true,
            backgroundColor: gradientStroke,
            borderColor: '#ec250d',
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: '#ec250d',
            pointBorderColor: 'rgba(255,255,255,0)',
            pointHoverBackgroundColor: '#ec250d',
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: comprasPorMes,
          }
          ]
          
        },

        options: gradientChartOptionsConfigurationWithTooltipRed
      };
      this.myChartData = new Chart(this.ctx, config);
    })

    // GRAFICA PIE -------------------------------------------------------------------------


    this.usuarioService.usuariosMensuales().subscribe(usuarios => {
      this.canvas = document.getElementById("chartLineRed");
      this.ctx = this.canvas.getContext("2d");

      let mes: any[] = [];
      let cant: any[] = [];
      for (let i = 0; i < usuarios.length; i++) {
        console.log(usuarios.length);
        mes.push(usuarios[i][0]);
        cant.push(usuarios[i][1]);
      }

      var gradientStroke = this.ctx.createLinearGradient(0, 230, 0, 50);
      var gradientStroke1 = this.ctx.createLinearGradient(0, 230, 0, 50);

 
      gradientStroke.addColorStop(0, 'rgba(28, 133, 160, 0.67)'); //red colors
      gradientStroke1.addColorStop(1, 'rgba(28, 160, 41, 0.67)'); //red colors
      
      var data = {
        labels: [chart_labels[mes[0] - 1], chart_labels[mes[1] - 1]],
        datasets: [{
          label: "Data",
          fill: true,
          backgroundColor: [gradientStroke, gradientStroke1],
          borderColor: '#FFFFFF',
         
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          pointBackgroundColor: '#FFFFFF',
          pointBorderColor: 'rgba(255,255,255,0)',
          pointHoverBackgroundColor: '#FFFFFF',
          pointBorderWidth: 20,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 15,
          pointRadius: 4,
          data: cant,
        }]
        
      };

      var myChart = new Chart(this.ctx, {
        type: 'pie',
        data: data,
        options: gradientChartOptionsConfigurationWithTooltipGreen

      });
    })

    // GRAFICA BARRAS VENTAS POR PAQUETE


    this.compraService.totalPaquetes().subscribe(compras => {
      this.canvas = document.getElementById("chartLineGreen");
      this.ctx = this.canvas.getContext("2d");
      let paquetes: any[] = [];
      let ventasPaquete: any[] = [];

      for (let i = 0; i < compras.length; i++) {
        console.log(compras.length);

        ventasPaquete.push(compras[i][1]);
        paquetes.push(compras[i][0]);
      }

      var gradientStroke = this.ctx.createLinearGradient(0, 230, 0, 50);
      var gradientStroke1 = this.ctx.createLinearGradient(0, 230, 0, 50);
      var gradientStroke2 = this.ctx.createLinearGradient(0, 230, 0, 50);
      var gradientStroke3 = this.ctx.createLinearGradient(0, 230, 0, 50);
      var gradientStroke4 = this.ctx.createLinearGradient(0, 230, 0, 50);
      var gradientStroke5 = this.ctx.createLinearGradient(0, 230, 0, 50);

      gradientStroke.addColorStop(1,  'rgba(25, 163, 34, 0.54)');
      gradientStroke1.addColorStop(1, 'rgba(25, 154, 163, 0.54)'); //green colors
      gradientStroke2.addColorStop(1, 'rgba(241, 236, 79, 0.52)');
      gradientStroke3.addColorStop(1, 'rgba(194, 147, 126, 0.52)'); //green colors
      gradientStroke4.addColorStop(1, 'rgba(181, 126, 194, 0.52)');
      gradientStroke5.addColorStop(1, 'rgba(126, 194, 194, 0.52)'); //green colors

      var data = {
        labels: paquetes,
        datasets: [{
          label: "Total en ventas:",
          fill: true,
          backgroundColor: [gradientStroke, gradientStroke1,gradientStroke2, gradientStroke3,gradientStroke4, gradientStroke5 ],
          borderColor: 'rgba(98, 97, 85, 0.33)',
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          pointBackgroundColor: 'rgba(98, 97, 85, 0.33)',
          pointBorderColor: 'rgba(255,255,255,0)',
          pointHoverBackgroundColor: 'rgba(98, 97, 85, 0.33)',
          pointBorderWidth: 20,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 15,
          pointRadius: 4,
          data: ventasPaquete,
        }]
      };

      var myChart = new Chart(this.ctx, {
        type: 'bar',
        data: data,
        options: gradientChartOptionsConfigurationWithTooltipGreen
      });
    })



    // GRAFICA BARRAS  CANT VENTAS POR PAQUETE


    this.compraService.comprasCantidadPaq().subscribe(compras => {
      this.canvas = document.getElementById("CountryChart");
      this.ctx = this.canvas.getContext("2d");
      let cantidadPaq: any[] = [];

      for (let i = 0; i < compras.length; i++) {
        cantidadPaq.push(compras[i]);
      }

      var gradientStroke = this.ctx.createLinearGradient(0, 230, 0, 50);

      gradientStroke.addColorStop(1, 'rgba(25, 163, 34, 0.54)'); 
       gradientStroke.addColorStop(0.4, '#FFFFFF'); //green colors
      gradientStroke.addColorStop(0.4, 'blue'); //green colors
    

      var data = {
        labels: chart_labels,
        datasets: [{
          label: "Ventas:",
          fill: true,
          backgroundColor: gradientStroke,
          borderColor: '#00d6b4',
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          pointBackgroundColor: '#00d6b4',
          pointBorderColor: 'rgba(255,255,255,0)',
          pointHoverBackgroundColor: '#00d6b4',
          pointBorderWidth: 20,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 15,
          pointRadius: 4,
          data: cantidadPaq,
        }]
      };

      var myChart = new Chart(this.ctx, {
        type: 'bar',
        data: data,
        options: gradientChartOptionsConfigurationWithTooltipGreen
      });
    })

  }

  public cargarToken() {
    if (this.tokenS.getToken()) {
      if (this.tokenS.getAuthorities().length < 2) {
        this.router.navigateByUrl("/inicio");
      }
    } else {
      this.router.navigateByUrl("/inicio");
    }
  }





  public downloadPDF() {
    // Extraemos el mes
    const date = new Date().getMonth();
    // console.log({date});
    const mes = this.obtenerMes(date.toString());
    // console.log(mes);
    const DATA: any = document.getElementById('htmlData'); // apartado donde tomara los datos
    const doc = new jsPDF('p', 'pt', 'a4'); // configuracion del PDF
    doc.text(`NorteXploradores Reporte Del Mes De ${mes}`, 120, 30) // texto agregado manualmente

    const options = { // UN POCO DE ESTILOS DEL PDF
      background: 'black',
      scale: 5,
    };

    html2canvas(DATA, options).then((canvas) => {

      const img = canvas.toDataURL('image/PNG'); // CREAMOS LA IMG EN PNG
      console.log({ img })
      // Add image Canvas to PDF
      const bufferX = 15;
      const bufferY = 40;
      const imgProps = (doc as any).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
      return doc;
    }).then((docResult) => {
      doc.output();
      docResult.save(`NorteXploradores-Mes-${new Date().getMonth() + 1}.pdf`);
    });
  }



  obtenerMes(mes: any) {
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    return monthNames[mes]
  }


  async reportesVentas() {

    const pdf = new PdfMakeWrapper();
    const data = await this.datosHistorial();
    const data2 = await this.datosPaquete();
    const data3 = await this.datosCantidadPaquetesTabla();

    // const date = new Date().getMonth();
    // const agno = new Date().getFullYear();
    const mes = this.obtenerMes(this.date.toString());

    pdf.pageSize("A4"); // TAMAÑO DE LA PÁGINA
    pdf.pageMargins([20, 20]); // MARGENES DE LA PÁGINA
    pdf.pageOrientation('portrait'); // 'portrait' --> POSICIÓN DE LA 

    // pdf.header(new Txt(`Reporte De Ventas Del Mes De ${mes} - NORTXPLORADORES`).alignment("center").margin(10).color("green").bold().end) // ENCABEZADO DE LA PÁGINA

    // pdf.add(
    //   new Columns([await (await new Img("https://raw.githubusercontent.com/SantiagoAndresSerrano/img-soka/master/LOGO-01.png").width(80).height(80).noWrap().alignment('left').margin(14).build()),

    //   new Txt('NorteXploradores brinda una asistencia profesional a todos aquellos que necesitan un servicio de viaje. Centrándose en brindar respuestas rápidas, precisas y eficientes con el fin de ofrecer un servicio personalizado de calidad y confiabilidad.').margin([22, 15, 2, 2]).alignment("justify").end]).end)
    
    pdf.add(
      
      new Table([
        [ await new Img("https://raw.githubusercontent.com/SantiagoAndresSerrano/img-soka/master/LOGO-01.png").width(80).height(80).noWrap().alignment('center').margin(0).build(), 
        new Txt("NORTEXPLORADORES").alignment("center").fontSize(20).margin([0,25]).bold().end, 
        new Txt("NorteXploradores@gmail.com\n NIT: 1090463941 - 0\n TEL: 3209177920\n RNT: 84950").alignment("center").margin([0,10]).bold().end],
        
    ]).widths([140,220,165 ]).alignment("center").end
      )

    // TABLA HISTORIAL DE VENTAS
    pdf.add(new Txt(`TOTAL PAQUETES VENDIDOS EN EL AÑO ${this.agno}`).alignment("center").color("blue").bold().margin([0,30,0,0]).end);
    pdf.add(this.createTableHistorial(data));

    // TABLA DE VENTAS DEL MES
    pdf.add(new Txt(`PAQUETES VENDIDOS EN EL MES DE ${mes.toUpperCase()} DEL AÑO ${this.agno}`).alignment("center").color("blue").bold().margin([0,30,0,0]).end);
    pdf.add(this.createTablePaquete(data2));

    // TABLA DE PAQUETE POR MES
    pdf.add(new Txt(`PAQUETES VENDIDOS POR CADA MES DEL AÑO ${this.agno}`).alignment("center").color("blue").bold().pageBreak('before').end);
    pdf.add(this.createTableCantidadPaquetesTabla(data3));

    pdf.create().open();
  }


  // TABLA HISTORIAL
  createTableHistorial(data: totalMeses[]): ITable {
    return new Table([
      ["MES", "INGRESO"],
      ...this.extraerDataHistorial(data)
    ])
      .widths('*')
      .layout({
        fillColor: (rowIndex: number | undefined, node: any | undefined, columnIndex: number | undefined) => {
          return rowIndex === 0 ? '#D3E4CD' : '#FAEDF0'
        }
      }).bold().margin([2, 12]).alignment('center').decorationColor("blue")
      .end
  }

  extraerDataHistorial(data: totalMeses[]): TableRow[] {
    return data.map(row => [row.mes, row.cantidad])
  }

  async datosHistorial(): Promise<totalMeses[]> {
    return fetch('https://nortexploradores.herokuapp.com/compra/totalMesTabla')
      .then(resp => resp.json());
  }


  // TABLA PAQUETE
  createTablePaquete(data: totalPaquete[]): ITable {
    return new Table([
      ["PAQUETE", "INGRESO"],
      ...this.extraerDataPaquete(data)
    ])
      .widths('*')
      .layout({
        fillColor: (rowIndex: number | undefined, node: any | undefined, columnIndex: number | undefined) => {
          return rowIndex === 0 ? '#D3E4CD' : '#FAEDF0'
        }
      }).bold().margin([2, 12]).alignment('center').decorationColor("blue")
      .end
  }

  extraerDataPaquete(data: totalPaquete[]): TableRow[] {
    return data.map(row => [row.nombre, row.total])
  }


  async datosPaquete(): Promise<totalPaquete[]> {
    return fetch('https://nortexploradores.herokuapp.com/compra/totalPaquetesTabla')
      .then(resp => resp.json());
  }


  // TABLA cantidadPaquetesTabla
  createTableCantidadPaquetesTabla(data: totalMeses[]): ITable {
    return new Table([
      ["MES", "CANTIDAD"],
      ...this.extraerDataHistorial(data)
    ])
      .widths('*')
      .layout({
        fillColor: (rowIndex: number | undefined, node: any | undefined, columnIndex: number | undefined) => {
          return rowIndex === 0 ? '#D3E4CD' : '#FAEDF0'
        }
      }).bold().margin([2, 12]).alignment('center').decorationColor("blue")
      .end
  }

  extraerCantidadPaquetesTabla(data: totalMeses[]): TableRow[] {
    return data.map(row => [row.mes, row.cantidad])
  }

  async datosCantidadPaquetesTabla(): Promise<totalMeses[]> {
    return fetch('https://nortexploradores.herokuapp.com/compra/cantidadPaquetesTabla')
      .then(resp => resp.json());
  }






  // TODO: REPORTES REGISTROS

  async reportesRegistros() {
    
    const pdf = new PdfMakeWrapper();
    const data = await this.datos();

    pdf.pageSize("A4"); // TAMAÑO DE LA PÁGINA
    pdf.pageMargins([20, 20]); // MARGENES DE LA PÁGINA
    pdf.pageOrientation('portrait'); // 'portrait' --> POSICIÓN DE LA 

    // pdf.header(new Txt(`REPORTE DE CLIENTES - NORTXPLORADORES`).alignment("center").margin(10).color("green").end) // ENCABEZADO DE LA PÁGINA

       
    pdf.add(
      
      new Table([
        [ await new Img("https://raw.githubusercontent.com/SantiagoAndresSerrano/img-soka/master/LOGO-01.png").width(80).height(80).noWrap().alignment('center').margin(0).build(), 
        new Txt("NORTEXPLORADORES").alignment("center").fontSize(20).margin([0,25]).bold().end, 
        new Txt("NorteXploradores@gmail.com\n NIT: 1090463941 - 0\n TEL: 3209177920\n RNT: 84950").alignment("center").margin([0,10]).bold().end],
        
    ]).widths([140,220,165 ]).alignment("center").end
      )

    //TODO: ESTO FUNCIONA BIEN
    // pdf.add(
    //   new Columns([await (await new Img("https://raw.githubusercontent.com/SantiagoAndresSerrano/img-soka/master/LOGO-01.png").width(80).height(80).noWrap().alignment('left').margin(14).build()),

    //   new Txt('NorteXploradores brinda una asistencia profesional a todos aquellos que necesitan un servicio de viaje. Centrándose en brindar respuestas rápidas, precisas y eficientes con el fin de ofrecer un servicio personalizado de calidad y confiabilidad.').margin([22, 15, 2, 2]).alignment("justify").end]).end)


      pdf.add(new Txt(`REPORTE DEL FLUJO DE CLIENTES AÑO ${this.agno}`).alignment("center").color("blue").bold().margin([0,30,0,0]).end);
    pdf.add(this.createTable(data));
    
    pdf.create().open();
  }

  createTable(data: totalMeses[]): ITable {
    return new Table([
      ["MES","CANTIDAD"],
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

  extraer(data: totalMeses[]): TableRow2[] {
    return data.map(row => [row.mes, row.cantidad])
  }

  async datos(): Promise<totalMeses[]> {
    return fetch(`https://nortexploradores.herokuapp.com/usuario/usuariosMensualesTabla`)
      .then(resp => resp.json());
  }
}