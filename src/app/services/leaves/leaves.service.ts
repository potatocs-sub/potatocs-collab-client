import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeavesService {
  private baseUrl = environment.apiUrl;
  private http = inject(HttpClient)



  constructor() { }

  getMyLeaveStatus() {
    return this.http.get(this.baseUrl + '/leave/my-status');
  }
}
