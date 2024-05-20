import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';
import { CommonService } from '../common/common.service';

@Injectable({
  providedIn: 'root'
})
export class LeavesService {
  private baseUrl = environment.apiUrl;
  private http = inject(HttpClient)
  commonService = inject(CommonService)


  constructor() { }

  getMyLeavesStatus() {
    return this.http.get(this.baseUrl + '/leaves/my-status');
  }

  // dashboard 에서 매니저 지울때 pending 중인 leave 있는지 체크
  checkPendingLeave() {
    return this.http.get(this.baseUrl + '/leaves/checkPendingLeave');
  }

  getMyLeavesSearch(data: any, active: string, direction: string, pageIndex: number, pageSize: number) {
    return this.http.get(this.baseUrl + '/leaves/my-request-search', { params: { ...data, active, direction, pageIndex, pageSize } }).pipe(
      tap(
        (res: any) => {
          console.log(res);

          res.myEmployeeList = res.myEmployeeList?.map((item: any) => ({
            ...item,
            leave_start_date: this.commonService.dateFormatting(item.leave_start_date, 'timeZone'),
            leave_end_date: this.commonService.dateFormatting(item.leave_end_date, 'timeZone')
          }));
        }),
      catchError(error => {
        console.error('Error fetching data:', error);
        return of({ total_count: 0, myEmployeeList: [] });
      })
    );
  }

  getNationHolidays(nationId: any) {
    return this.http.get(this.baseUrl + '/leaves/getNationList', { params: { id: nationId } })

  }
}
