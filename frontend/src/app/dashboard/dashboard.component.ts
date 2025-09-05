import { Component, OnInit } from '@angular/core';
import { ChartData } from 'chart.js';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  data: any;
  chartData: ChartData<'line', number[], string> = {
    labels: [],
    datasets: [
      { data: [], label: 'Valores' }
    ]
  };
  chartLabels: string[] = [];

  constructor(private dashboardService: DashboardService) { }


  ngOnInit() {
    this.dashboardService.getDashboardData().subscribe((res: any) => {
      this.data = res;

      const lastSuccess = [...this.chartData.datasets[0].data];
      const lastError = this.chartData.datasets[1]?.data || [];

      if (res.status === 'success') {
        lastSuccess.push(res.value);
      } else {
        lastError.push(res.value);
      }

      const newLabels = [...(this.chartData.labels || []), new Date(res.time).toLocaleTimeString()];

      this.chartData = {
        labels: newLabels,
        datasets: [
          {
            data: lastSuccess,
            label: 'Sucesso',
            borderColor: 'green',
            backgroundColor: 'rgba(0,255,0,0.3)',
            fill: true,
            pointBackgroundColor: 'green',
            pointBorderColor: 'darkgreen',
            pointRadius: 5
          },
          {
            data: lastError,
            label: 'Erro',
            borderColor: 'red',
            backgroundColor: 'rgba(255,0,0,0.3)',
            fill: true,
            pointBackgroundColor: 'red',
            pointBorderColor: 'darkred',
            pointRadius: 5
          }
        ]
      };
    });
  }
}