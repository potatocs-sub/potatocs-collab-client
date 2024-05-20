import { ProfilesService } from './../../../../services/profiles/profiles.service';
import { CommonModule } from '@angular/common';
import { Component, WritableSignal, effect, inject, signal } from '@angular/core';
import { MaterialsModule } from '../../../../materials/materials.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeavesService } from '../../../../services/leaves/leaves.service';
import { CommonService } from '../../../../services/common/common.service';
import { DialogService } from '../../../../stores/dialog/dialog.service';
import moment from 'moment';

@Component({
  selector: 'app-leaves-requests-add',
  standalone: true,
  imports: [CommonModule, MaterialsModule],
  templateUrl: './leaves-requests-add.component.html',
  styleUrl: './leaves-requests-add.component.scss'
})
export class LeavesRequestsAddComponent {

  fb = inject(FormBuilder)
  profilesService = inject(ProfilesService)
  leavesService = inject(LeavesService)
  commonService = inject(CommonService)
  dialogsService = inject(DialogService)
  userProfileInfo: WritableSignal<any> = this.profilesService.userProfileInfo
  userCompanyInfo: WritableSignal<any> = this.profilesService.userCompanyInfo

  myLeaves: WritableSignal<any | null> = signal(null)

  employeeLeaveForm: FormGroup = this.fb.group({
    leaveType1: ['', [Validators.required]],
    leaveType2: ['', [Validators.required]],
    leave_start_date: ['', [Validators.required]],
    leave_end_date: ['', [Validators.required]],
    leave_reason: ['', [Validators.required]],
  });
  holidayList: Array<any> = [];

  days: any;
  start_date_sec: any;
  end_date_sec: any;
  millisecondsPerDay: any;
  diff: any;
  weeks: any;
  leaveDays: any;

  rolloverMinDate: any;
  rolloverMaxDate: any;
  minDate: Date | null = null; // rollover 제한
  maxDate: Date | null = null; // rollover 제한
  isRollover = false; // rollover 제한
  myInfo: any;
  // 원하는 총 휴가 기간
  leaveDuration: any;
  isHalf: boolean = false;
  leaveRequestData: any;
  leaveInfo: any;
  company: any;
  user: any;
  holidayDateFilter = (d: Date | null): boolean => {
    // Check if the date is null or undefined
    if (d === null) {
      return false;
    }

    const day = d.getDay();

    // Check if the date is a weekend day
    if (day === 0 || day === 6) {
      return false;
    }

    // Check if the date is a holiday
    const formattedDate = moment(d);
    const isHoliday = this.holidayList.some((holiday: string) => moment(holiday).isSame(formattedDate, 'day'));

    // Return false if it's a holiday, otherwise true
    return !isHoliday;
  };


  constructor() {
    effect(() => {
      if (this.userProfileInfo()?.location) {
        this.leavesService.getNationHolidays(this.userProfileInfo().location).subscribe({
          next: (res: any) => {
            this.holidayList = [...this.holidayList, ...res.nation[0]?.countryHoliday.map((h: any) => {
              const localDate = moment.utc(h.holidayDate).local().format('YYYY-MM-DD');
              return localDate;
            })]
            console.log(this.holidayList)
          },
          error: () => { }
        })
      }

      if (this.userCompanyInfo()) {
        this.holidayList = [...this.holidayList, ...this.userCompanyInfo()?.company_holiday.map((h: any) => {
          const localDate = moment.utc(h.ch_date).local().format('YYYY-MM-DD');
          return localDate;
        })];
        console.log(this.holidayList)
        this.leavesService.getMyLeavesStatus().subscribe({
          next: (res: any) => {
            console.log(res)
            this.myLeaves.set(res);
          },
          error: (err: any) => {

          }
        })
      }

    })



  }

  ngAfterViewInit() {

  }

  classificationChange(value: any) {


    if (value == 'rollover') {
      this.minDate = this.rolloverMinDate;
      this.maxDate = this.rolloverMaxDate;
    }
    // this.employeeLeaveForm.get('leaveType2').setValue('');
    this.datePickDisabled();
    this.datePickReset();
  }

  // 연차, 반차 변화시 기간 설정 달력 disable/enable
  typeSecondChange(value: any) {
    if (value == 'half') {
      this.employeeLeaveForm.controls['leave_start_date'].enable();
      this.employeeLeaveForm.controls['leave_end_date'].disable();

      this.datePickReset();
      this.isHalf = true;
    } else {
      this.employeeLeaveForm.controls['leave_start_date'].enable();
      this.employeeLeaveForm.controls['leave_end_date'].enable();

      this.datePickReset();
      this.isHalf = false;
    }
  }

  // 날짜 입력 시 소모되는 일 체크
  checkDateChange(value: any) {
    // console.log(value);

    const formValue = this.employeeLeaveForm.value;
    const start_date = formValue.leave_start_date;
    const end_date = formValue.leave_end_date;
    const currentClassification = formValue.leaveType1;
    const matchedLeaveDay = this.availableLeaveCount(currentClassification);

    if (this.checkEmpYear(start_date, end_date)) {
      if (this.isHalf) {
        this.leaveDuration = 0.5;
        // this.employeeLeaveForm.get('leave_end_date').setValue('');
        if (this.company.isMinusAnnualLeave === undefined) {
          if (this.leaveDuration > matchedLeaveDay || this.leaveDuration < 0) {
            console.log(this.leaveDuration);
            console.log(matchedLeaveDay);
            this.dialogsService.openDialogNegative('Wrong period, Try again.');
            // alert('Wrong period, Try again.');
            this.allReset();
            return;
          }
        }
      } else {
        this.leaveDuration = this.calculateDiff(start_date, end_date);
        console.log(this.company.isMinusAnnualLeave);
        if (this.company.isMinusAnnualLeave === undefined) {
          if (this.leaveDuration > matchedLeaveDay || this.leaveDuration < 0) {
            console.log(this.leaveDuration);
            console.log(matchedLeaveDay);
            this.dialogsService.openDialogNegative('Wrong period, Try again.');
            // alert('Wrong period, Try again.');
            this.allReset();
            return;
          }
        }
      }

      console.log(this.leaveDuration);
    }
  }

  datePickChange(dateValue: any) {
    // this.checkEmpYear(dateValue);
    // this.employeeLeaveForm.get('leave_end_date').setValue('');
  }

  calculateDiff(start_date: any, end_date: any) {
    const holidayCount = this.holidayList.filter((x: any) => {
      return new Date(x) <= end_date && new Date(x) >= start_date;
    }).length;

    this.millisecondsPerDay = 86400 * 1000; // Day in milliseconds
    this.start_date_sec = start_date.setHours(0, 0, 0, 1); // Start just after midnight
    this.end_date_sec = end_date.setHours(23, 59, 59, 999); // End just before midnight
    this.diff = this.end_date_sec - this.start_date_sec; // Milliseconds between datetime objects
    this.days = Math.ceil(this.diff / this.millisecondsPerDay);

    if (this.start_date_sec >= this.end_date_sec) {
      this.dialogsService.openDialogNegative('Wrong period, Try again.');
      this.datePickReset();
    }

    // Subtract two weekend days for every week in between
    this.weeks = Math.floor(this.days / 7);
    this.days = this.days - this.weeks * 2;

    // Handle special cases
    this.start_date_sec = start_date.getDay();
    this.end_date_sec = end_date.getDay();

    // Remove weekend not previously removed.
    if (this.start_date_sec - this.end_date_sec > 1) this.days = this.days - 2;

    // Remove start day if span starts on Sunday but ends before Saturday
    if (this.start_date_sec == 0 && this.end_date_sec != 6) this.days = this.days - 1;

    // Remove end day if span ends on Saturday but starts after Sunday
    if (this.end_date_sec == 6 && this.start_date_sec != 0) {
      this.days = this.days - 1;
    }

    this.leaveDays = this.days;

    if (this.leaveDays == 'NaN' || this.leaveDays == '' || this.leaveDays <= '0' || this.leaveDays == 'undefined') {
      this.leaveDays = '';
    } else {
      this.leaveDays = this.days;
    }
    return this.leaveDays - holidayCount;
  }

  availableLeaveCount(stringValue: any) {
    if (stringValue == 'annual_leave') {
      return this.leaveInfo['annual_leave'] - this.leaveInfo['used_annual_leave'];
    } else if (stringValue == 'rollover') {
      return this.leaveInfo['rollover'] - this.leaveInfo['used_rollover'];
    } else if (stringValue == 'sick_leave') {
      return this.leaveInfo['sick_leave'] - this.leaveInfo['used_sick_leave'];
    } else {
      return this.leaveInfo['replacement_leave'] - this.leaveInfo['used_replacement_leave'];
    }
  }

  datePickReset() {
    // this.employeeLeaveForm.get('leave_start_date').setValue('');
    // this.employeeLeaveForm.get('leave_end_date').setValue('');
  }

  datePickDisabled() {
    this.employeeLeaveForm.controls['leave_start_date'].disable();
    this.employeeLeaveForm.controls['leave_end_date'].disable();
  }

  allReset() {
    // this.employeeLeaveForm.get('leaveType1').setValue('');
    // this.employeeLeaveForm.get('leaveType2').setValue('');
    this.datePickReset();
    this.datePickDisabled();
  }

  // 휴가 쓰는 기간이 N년차 범위에 속하는지, 안속하면 안돼
  checkEmpYear(start_date: any, end_date: any) {
    //이건 내가 선택한 휴가 날짜
    const cal_start_date = this.commonService.dateFormatting(start_date, 'timeZone');
    const cal_end_date = this.commonService.dateFormatting(end_date, 'timeZone');
    //입사 년월일,
    const startYear = this.commonService.dateFormatting(this.leaveInfo.startYear, 'timeZone');
    const endYear = this.commonService.dateFormatting(this.leaveInfo.endYear, 'timeZone');
    console.log(cal_start_date, cal_end_date, startYear, endYear);
    // 반차일떄
    if (this.isHalf) {
      return true;
    }

    // 휴가 시작. 종료일이 같은 년차에 들어가는지
    if (
      cal_start_date >= startYear &&
      cal_start_date <= endYear &&
      cal_end_date >= startYear &&
      cal_end_date <= endYear
    ) {
      return true;
    }

    // 휴가 시작 종료일이 다음해의 같은 년차에 들어가는지
    else if (cal_start_date > endYear && cal_end_date > endYear) {
      const flag = this.dialogsService
        .openDialogConfirm(
          `Your current contract period: ${startYear} ~ ${endYear}.\nThis annual leave request will be counted on next year's annual leave. Do you want to proceed?`,
        )
        .subscribe((result: any) => {
          if (result) {
            return true;
          } else {
            this.datePickReset();
            return false;
          }
        });
      return true;
    } else {
      this.dialogsService.openDialogNegative(
        `Your current contract period: ${startYear} ~ ${endYear}.\nPlease, choose leave dates within the current contract period or after the end of your current period in order to use next year's annual leave.`,
      );
      // alert('Please, choose a leave date within the contract period.');
      this.datePickReset();
      return false;
    }
  }

  requestLeave() { }

  toBack() { }
}
