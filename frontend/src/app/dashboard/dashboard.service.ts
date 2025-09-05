import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private baseUrl = environment.websocket;
  private socket: Socket;


  constructor() {
    this.socket = io(this.baseUrl);
  }

  getDashboardData(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('dashboardData', (data) => {
        observer.next(data);
      });
    });
  }
}