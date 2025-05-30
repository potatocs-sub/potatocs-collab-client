import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';
import { CommonService } from '../common/common.service';

@Injectable({
  providedIn: 'root',
})
export class LeavesService {
  private baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  commonService = inject(CommonService);

  constructor() { }
  // getMyLeaveList() {
  //   return this.http.get(this.baseUrl + '/leaves/my-request');
  // }
  getMyLeavesStatus() {
    return this.http.get(this.baseUrl + '/leave/my-status');
  }

  // dashboard 에서 매니저 지울때 pending 중인 leave 있는지 체크
  checkPendingLeave() {
    return this.http.get(this.baseUrl + '/leave/checkPendingLeave');
  }

  getMyLeavesSearch(
    data: any,
    active: string,
    direction: string,
    pageIndex: number,
    pageSize: number
  ) {
    return this.http
      .get(this.baseUrl + '/leave/my-request-search', {
        params: { ...data, active, direction, pageIndex, pageSize },
      })
      .pipe(
        tap((res: any) => {
          console.log(res);

          res.myEmployeeList = res.myEmployeeList?.map((item: any) => ({
            ...item,
            leave_start_date: this.commonService.dateFormatting(
              item.leave_start_date,
              'timeZone'
            ),
            leave_end_date: this.commonService.dateFormatting(
              item.leave_end_date,
              'timeZone'
            ),
          }));
        }),
        catchError((error) => {
          console.error('Error fetching data:', error);
          return of({ total_count: 0, myEmployeeList: [] });
        })
      );
  }

  getMyLeaveList(
    active: string,
    direction: string,
    pageIndex: number,
    pageSize: number
  ) {
    return this.http.get(this.baseUrl + '/leave/my-request', {
      params: { active, direction, pageIndex, pageSize },
    });
  }

  getNationHolidays(nationId: any) {
    return this.http.get(this.baseUrl + '/leave/getNationList', {
      params: { id: nationId },
    });
  }

  requestLeave(leaveData: any, fileData?: any) {
    const formData = new FormData();

    formData.append('leaveType', leaveData.leaveType);
    formData.append('leaveDay', leaveData.leaveDay);
    formData.append('leaveDuration', leaveData.leaveDuration);
    formData.append('leave_start_date', leaveData.leave_start_date);
    formData.append('leave_end_date', leaveData.leave_end_date);
    formData.append('leave_reason', leaveData.leave_reason);
    formData.append('status', leaveData.status);
    formData.append('official_leave', fileData);
    // formData.append('file-name', fileName);

    return this.http.post(this.baseUrl + '/leave/request-leave', formData);
  }

  cancelMyRequestLeave(data: any) {
    return this.http.put(this.baseUrl + '/leave/cancel-my-request-leave', data);
  }

  /* -----------------------------------------------
    rd-request-list Component
  ----------------------------------------------- */
  getRdList(
    active: string,
    direction: string,
    pageIndex: number,
    pageSize: number
  ) {
    return this.http.get(this.baseUrl + '/leave/getRdList', {
      params: { active, direction, pageIndex, pageSize },
    });
  }

  requestRdLeave(data: any) {
    return this.http.post(this.baseUrl + '/leave/requestRdLeave', data);
  }

  /* -----------------------------------------------
  replacement-day-request Component
----------------------------------------------- */
  requestConfirmRd(requestConfirmRdData: any) {
    return this.http.post(
      this.baseUrl + '/leave/requestConfirmRd',
      requestConfirmRdData
    );
  }

  requestCancelRd(rdObjId: any) {
    return this.http.delete(this.baseUrl + '/leave/requestCancelRd', {
      params: rdObjId,
    });
  }

  cancelEmployeeApproveLeave(leaveData) {
    return this.http.put(
      this.baseUrl + '/leave/cancel-Employee-Approve-Leave',
      leaveData
    );
  }







  // 업로드된 파일 다운로드
  fileDownload(fileId: any) {
    // params를 쓸땐 객체로 보내야한다.
    return this.http.get(this.baseUrl + "/leave/download_request_leaves_doc", {
      params: { fileId: fileId },
      responseType: "blob",
    });
    // return this.http.get('/api/v1/collab/space/doc/getUploadFileList',{ params: docId });
  }

  confirmFileDownload(fileId: any) {
    return this.http.get(this.baseUrl + "/leave/download_confirm_leaves_doc", {
      params: { fileId: fileId },
      responseType: "blob",
    });
  }

  submitOfficialDoc(_id: any, fileData: any) {
    const formData = new FormData();

    formData.append('official_leave', fileData);
    formData.append('_id', _id);
    return this.http.post(this.baseUrl + '/leave/confirm-official-leave', formData)
  }


  checkOfficialLeave(_id: string, check: boolean) {
    return this.http.post(this.baseUrl + '/leave/official-leave-check', { _id, check })
  }
}
