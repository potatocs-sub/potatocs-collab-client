import { LeavesService } from './../../../services/leaves/leaves.service';
import { CommonModule } from '@angular/common';
import { Component, ViewChild, WritableSignal, effect, inject, signal } from '@angular/core';
import { MaterialsModule } from '../../../materials/materials.module';
import { MatPaginator } from '@angular/material/paginator';
import { ProfilesService } from '../../../services/profiles/profiles.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../services/common/common.service';
import moment from 'moment';
import { MatSort } from '@angular/material/sort';
import { catchError, map, merge, of, startWith, switchMap } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [CommonModule, MaterialsModule],
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.scss'
})
export class RequestsComponent {
  profilesService = inject(ProfilesService)
  commonService = inject(CommonService)
  leavesService = inject(LeavesService)
  fb = inject(FormBuilder)
  router = inject(Router)
  userCompanyInfo: WritableSignal<any | null> = this.profilesService.userCompanyInfo;
  userManagerInfo: WritableSignal<any | null> = this.profilesService.userManagerInfo;

  startOfMonth = moment().startOf('month').format();
  endOfMonth = moment().endOf('month').format();


  // FormGroup
  employeeForm: FormGroup = this.fb.group({
    type1: ['all', [
      Validators.required,
    ]],
    type2: ['all', [
      Validators.required,
    ]],
    leave_start_date: [this.startOfMonth, [
      Validators.required,
    ]],
    leave_end_date: [this.endOfMonth, [
      Validators.required,
    ]],
    status: ['all', [
      Validators.required,
    ]],
  });;

  // 자신의 휴가 리스트 받는 변수
  myRequestList: any;

  // 이번 달 1일, 말일 만드는 변수
  // date = new Date();
  // monthFirst = new Date(this.date.setDate(1));
  // tmp = new Date(this.date.setMonth(this.date.getMonth() + 1));
  // monthLast = new Date(this.tmp.setDate(0));

  date = new Date();
  timezone = this.commonService.dateFormatting(this.date, 'timeZone');

  viewType: any = {
    'annual_leave': 'Annual Leave',
    'rollover': 'Rollover',
    'sick_leave': 'Sick Leave',
    'replacement_leave': 'Replacement Day'
  }


  isRollover = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  pageSize = signal<number>(10);
  resultsLength = signal<number>(0);
  isLoadingResults = signal<boolean>(true);
  isRateLimitReached = signal<boolean>(false);

  displayedColumns: string[] = ['createAt', 'leaveStartDate', 'duration', 'leaveType', 'approver', 'status'];


  constructor() { }
  ngAfterViewInit() {
    const formValue = this.employeeForm.value;
    const employeeInfo: any = {
      type1: formValue.type1,
      type2: formValue.type2,
      leave_start_date: this.commonService.dateFormatting(formValue.leave_start_date),
      leave_end_date: this.commonService.dateFormatting(formValue.leave_end_date),
      status: formValue.status,
    };

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults.set(true);
          return this.leavesService.getMyLeavesSearch(
            employeeInfo,
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex,
            this.paginator.pageSize,
          ).pipe(catchError(() => of(null)));
        }),
        map((res: any) => {
          this.isLoadingResults.set(false);
          if (res === null) {
            this.isRateLimitReached.set(true);
            return [];
          }
          this.isRateLimitReached.set(false);
          this.resultsLength.set(res.total_count);
          // this.calculateTenure(res.myEmployeeList);
          return res.myEmployeeList;
        }),
      )
      .subscribe((data: any) => { if (data) this.myRequestList.set(new MatTableDataSource(data)) });
  }

  // select
  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  }
  searchBtn() {

  }
  requestLeave() {
    this.router.navigate(['/leaves/requests/add'])
  }
  openDialogPendingLeaveDetail(data: any) {

  }
}
