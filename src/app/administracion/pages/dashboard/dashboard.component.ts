
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart } from 'chart.js';
import { CompraService } from 'src/app/services/compra.service';
import { TokenService } from 'src/app/services/token.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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


  constructor(
    private tokenS: TokenService,
    private router: Router,
    private compraService: CompraService,
    private usuarioService: UsuarioService
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

      gradientStroke.addColorStop(1, 'rgba(233,32,16,0.2)');
      gradientStroke.addColorStop(0.4, 'rgba(233,32,16,0.0)');
      gradientStroke.addColorStop(0, 'rgba(233,32,16,0)'); //red colors

      var data = {
        labels: [chart_labels[mes[0]-1], chart_labels[mes[1]-1]],
        datasets: [{
          label: "Data",
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

      gradientStroke.addColorStop(1, 'rgba(255,255,255,0)');
      gradientStroke.addColorStop(0.4, 'rgba(255,255,255,0)'); //green colors
      gradientStroke.addColorStop(0, 'rgba(255,255,255,0)'); //green colors

      var data = {
        labels: paquetes,
        datasets: [{
          label: "Total en ventas:",
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

      gradientStroke.addColorStop(1, 'rgba(255,255,255,0)');
      gradientStroke.addColorStop(0.4, 'rgba(255,255,255,0)'); //green colors
      gradientStroke.addColorStop(0, 'rgba(255,255,255,0)'); //green colors

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
    // Extraemos el
    const date = new Date().getMonth();
    // console.log({date});
    const mes = this.obtenerMes(date.toString());
    // console.log(mes);
    const DATA : any = document.getElementById('htmlData'); // apartado donde tomara los datos
    const doc = new jsPDF('p', 'pt', 'a4'); // configuracion del PDF
    doc.text(`NorteXploradores Reporte Del Mes De ${mes}`, 120,30) // texto agregado manualmente
    
    const options = { // UN POCO DE ESTILOS DEL PDF
      background: 'black',
      scale: 5,
    };
    
    html2canvas(DATA, options).then((canvas) => {

      const img = canvas.toDataURL('image/PNG'); // CREAMOS LA IMG EN PNG
      console.log({img})
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
      docResult.save(`${new Date().getMonth()+1}_tutorial.pdf`);
    });
  }

 
  
  obtenerMes(mes:any){
    const monthNames = [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
                       "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    return monthNames[mes]
  }

  reportesVentas(){

  }

  reportesRegistros(){
    
  }
}