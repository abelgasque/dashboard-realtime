import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { ChartData } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  data: any;

  lineChartData: ChartData<'line', number[], string> = {
    labels: [],
    datasets: [
      { data: [], label: 'Sucesso', borderColor: 'green', backgroundColor: 'rgba(0,255,0,0.3)', fill: true, pointBackgroundColor: 'green', pointBorderColor: 'darkgreen' },
      { data: [], label: 'Erro', borderColor: 'red', backgroundColor: 'rgba(255,0,0,0.3)', fill: true, pointBackgroundColor: 'red', pointBorderColor: 'darkred' }
    ]
  };

  pieChartData: ChartData<'pie', number[], string> = {
    labels: ['Sucesso', 'Erro'],
    datasets: [
      { data: [0, 0], backgroundColor: ['green', 'red'] }
    ]
  };

  barChartLabels: string[] = [];
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

      const lastSuccess = [...this.lineChartData.datasets[0].data];
      const lastError = [...this.lineChartData.datasets[1].data];

      if (res.status === 'success') {
        lastSuccess.push(res.value);
      } else {
        lastError.push(res.value);
      }

      const newLabels = [...(this.lineChartData.labels || []), new Date(res.time).toLocaleTimeString()];

      this.lineChartData = {
        labels: newLabels,
        datasets: [
          { ...this.lineChartData.datasets[0], data: lastSuccess },
          { ...this.lineChartData.datasets[1], data: lastError }
        ]
      };

      const successCount = lastSuccess.filter(v => v !== null).length;
      const errorCount = lastError.filter(v => v !== null).length;

      this.pieChartData = {
        labels: ['Sucesso', 'Erro'],
        datasets: [
          { data: [successCount, errorCount], backgroundColor: ['rgba(0,255,0,0.3)', 'rgba(255,0,0,0.3)'] }
        ]
      };

      const barValues = [...(this.barChartData.datasets[0].data || []), res.value];
      const barLabels = [...(this.barChartLabels || []), new Date(res.time).toLocaleTimeString()];

      this.barChartData = {
        labels: barLabels,
        datasets: [
          { ...this.barChartData.datasets[0], data: lastSuccess },
          { ...this.barChartData.datasets[1], data: lastError }
        ]
      };
    });
  }
}