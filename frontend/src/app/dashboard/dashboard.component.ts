import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { ChartData, Chart } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  data: any;

  lineChartOptions = {
    animation: {
      duration: 1
    },
    responsive: true,
    plugins: {
      legend: { display: true }
    }
  };
  lineChartData: ChartData<'line', number[], string> = {
    labels: [],
    datasets: [
      { data: [], label: 'Sucesso', borderColor: 'green', backgroundColor: 'rgba(0,255,0,0.3)', fill: true, pointBackgroundColor: 'green', pointBorderColor: 'darkgreen' },
      { data: [], label: 'Erro', borderColor: 'red', backgroundColor: 'rgba(255,0,0,0.3)', fill: true, pointBackgroundColor: 'red', pointBorderColor: 'darkred' }
    ]
  };

  pieChartOptions = {
    animation: { duration: 1 },
    responsive: true,
    plugins: { legend: { display: true } }
  };
  pieChartData: ChartData<'pie', number[], string> = {
    labels: ['Sucesso', 'Erro'],
    datasets: [
      { data: [0, 0], backgroundColor: ['green', 'red'] }
    ]
  };

  barChartLabels: string[] = [];
  barChartOptions = {
    animation: { duration: 1 },
    responsive: true,
    plugins: { legend: { display: true } }
  };
  barChartData: ChartData<'bar', number[], string> = {
    labels: [],
    datasets: [
      { data: [], label: 'Sucesso', borderColor: 'green', backgroundColor: 'rgba(0,255,0,0.3)' },
      { data: [], label: 'Erro', borderColor: 'red', backgroundColor: 'rgba(255,0,0,0.3)' }
    ]
  };

  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    this.dashboardService.getDashboardData().subscribe((res: any) => {
      this.data = res;

      if (res.status === 'success') {
        this.lineChartData.datasets[0].data.push(res.value);
      } else {
        this.lineChartData.datasets[1].data.push(res.value);
      }
      this.lineChartData.labels?.push(new Date(res.time).toLocaleTimeString());

      // Atualiza pie chart - criar novo array
      const successCount = this.lineChartData.datasets[0].data.filter(v => v !== null).length;
      const errorCount = this.lineChartData.datasets[1].data.filter(v => v !== null).length;

      this.pieChartData = {
        ...this.pieChartData,
        datasets: [{
          ...this.pieChartData.datasets[0],
          data: [successCount, errorCount]
        }]
      };

      // Atualiza bar chart - criar novos arrays
      this.barChartData = {
        ...this.barChartData,
        datasets: [
          {
            ...this.barChartData.datasets[0],
            data: [...this.barChartData.datasets[0].data, this.lineChartData.datasets[0].data.slice(-1)[0]]
          },
          {
            ...this.barChartData.datasets[1],
            data: [...this.barChartData.datasets[1].data, this.lineChartData.datasets[1].data.slice(-1)[0]]
          }
        ],
        labels: [...(this.barChartData.labels || []), new Date(res.time).toLocaleTimeString()]
      };

      // Força atualização
      this.chart?.update('active');
    });
  }
}