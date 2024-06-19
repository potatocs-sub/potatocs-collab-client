import { CommonModule } from '@angular/common';
import { Component, ViewChild, effect } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';

// Interface

import { MaterialsModule } from '../../materials/materials.module';
import { ProfilesService } from '../../services/profiles/profiles.service';
import { LeavesService } from '../../services/leaves/leaves.service';
import { LeaveRequestDetailDialogComponent } from '../../components/dialogs/leave-request-detail-dialog/leave-request-detail-dialog.component';
// view table
export interface PeriodicElement {
  createAt: Date;
  leave_start_date: Date;
  leave_end_date: Date;
  leaveDuration: number;
  leaveType: string;
  approver: string;
  status: string;
  leave_reason: string;
  requestorName: string;
}




@Component({
  selector: 'app-leaves',
  standalone: true,
  imports: [CommonModule, MaterialsModule],
  templateUrl: './leaves.component.html',
  styleUrl: './leaves.component.scss'
})
export class LeavesComponent {
  viewType: any = {
    'annual_leave': 'Annual Leave',
    'rollover': 'Rollover',
    'sick_leave': 'Sick Leave',
    'replacement_leave': 'Replacement Day'
  }
  currentDate: any;

  // view table
  displayedColumns: string[] = ['createAt', 'leaveStartDate', 'duration', 'leaveType', 'approver', 'status'];

  // 휴가 변수들
  leaveInfo: any;
  company: any;

  // 3개월 전부터 지금까지 신청한 휴가 변수
  threeMonthBeforeLeaveList: any;

  isRollover = false
  // viewType: ViewType = {
  //   'annual_leave': 'Annual Leave',
  //   'rollover': 'Rollover',
  //   'sick_leave': 'Sick Leave',
  //   'replacement_leave': 'Replacement Day'
  // }
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  private unsubscribe$ = new Subject<void>();


  constructor(
    // private leaveMngmtService: LeaveMngmtService,
    public dialog: MatDialog,
    // private dataService: DataService
    private profileService: ProfilesService,
    private leavesService: LeavesService
  ) {
    /**
     *  휴가 타입마다 사용일, 남은휴가, 총 휴가 계산
     */
    effect(() => {

      this.company = this.profileService.userCompanyInfo();

      if (!this.company) return;

      if (this.company.rollover_max_day != undefined) {
        this.isRollover = true;
      }

      this.leavesService.getMyLeavesStatus().subscribe(
        (data: any) => {
          this.leaveInfo = data;
          this.leaveInfo.rollover = Math.min(this.leaveInfo.rollover, this.company.rollover_max_day);
        }
      )
    })
  }


  ngOnInit(): void {
    // 나의 휴가 리스트 가져오기
    this.leavesService.getMyLeaveList().subscribe(
      (data: any) => {
        console.log(data)
        // console.log('getMyLeaveList')
        console.log(...data.leaveRequestList);
        this.threeMonthBeforeLeaveList = new MatTableDataSource<PeriodicElement>(data.leaveRequestList);
        this.threeMonthBeforeLeaveList.paginator = this.paginator;
      }
    );
    this.currentDate = new Date();
    // console.log(this.currentDate);
  }

  openDialogPendingLeaveDetail(data: any) {

    const dialogRef = this.dialog.open(LeaveRequestDetailDialogComponent, {
      // width: '600px',
      // height: '614px',

      data: {
        requestor: data.requestor,
        requestorName: data.requestorName,
        leaveType: data.leaveType,
        leaveDuration: data.leaveDuration,
        leave_end_date: data.leave_end_date,
        leave_start_date: data.leave_start_date,
        leave_reason: data.leave_reason,
        status: data.status,
        createdAt: data.createdAt,
        approver: data.approver
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('dialog close');
    })
  }
}
