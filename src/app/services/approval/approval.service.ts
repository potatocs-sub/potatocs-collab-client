import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApprovalService {
  private baseUrl = environment.apiUrl;
  private http = inject(HttpClient)
  constructor() { }

  getLeaveRequest(active: string, direction: string, pageIndex: number, pageSize: number) {
    return this.http.get(this.baseUrl + '/employees/leaves/requests', { params: { active, direction, pageIndex, pageSize } });
  }

  approvedLeaveRequest(data: any) {
    return this.http.put(this.baseUrl + '/employees/leaves/requests', data)
  }

  deleteLeaveRequest(data: any) {
    return this.http.put(this.baseUrl + '/employees/leaves/delete-request', data)
  }


  /* -----------------------------------------------
  The manager cancels the employee's approved leave
----------------------------------------------- */
  cancelEmployeeApproveLeave(leaveData: any) {
    return this.http.put(this.baseUrl + '/leaves/cancel-Employee-Approve-Leave', leaveData)
  }

  // Get a list of Members who has submitted a RD request to be confirmed.
  getConfirmRdRequest() {
    return this.http.get(this.baseUrl + '/leaves/getConfirmRdRequest');
  }

  // RD 요청 거절
  rejectReplacementRequest(data: any) {
    return this.http.put(this.baseUrl + '/leaves/rejectReplacementRequest', data)
  }

  // RD 요청 수락
  approveReplacementRequest(data: any) {
    return this.http.put(this.baseUrl + '/leaves/approveReplacementRequest', data)
  }
}
