import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  data: any;
  listData: any[] = [];

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

      this.listData.push(this.data);
      this.listData.sort(
        (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
      );

      const grouped: Record<string, { success: number; error: number }> = {};

      this.listData.forEach(item => {
        const d = new Date(item.time);
        d.setMinutes(0, 0, 0);
        const hourKey = `${d.getHours().toString().padStart(2, '0')}:00`;

        if (!grouped[hourKey]) {
          grouped[hourKey] = { success: 0, error: 0 };
        }

        if (item.status === 'success') {
          grouped[hourKey].success += item.value;
        } else {
          grouped[hourKey].error += item.value;
        }
      });

      const labels = Object.keys(grouped).sort(
        (a, b) => parseInt(a) - parseInt(b)
      );

      this.barChartData = {
        ...this.barChartData,
        labels,
        datasets: [
          {
            ...this.barChartData.datasets[0],
            data: labels.map(l => grouped[l].success)
          },
          {
            ...this.barChartData.datasets[1],
            data: labels.map(l => grouped[l].error)
          }
        ]
      };

      this.lineChartData = {
        ...this.lineChartData,
        labels,
        datasets: [
          {
            ...this.lineChartData.datasets[0],
            data: labels.map(l => grouped[l].success)
          },
          {
            ...this.lineChartData.datasets[1],
            data: labels.map(l => grouped[l].error)
          }
        ]
      };

      const successCount = this.listData.filter(i => i.status === 'success').length;
      const errorCount = this.listData.filter(i => i.status === 'error').length;

      this.pieChartData = {
        ...this.pieChartData,
        datasets: [
          {
            ...this.pieChartData.datasets[0],
            data: [successCount, errorCount]
          }
        ]
      };

      this.chart?.update('active');
    });
  }
}