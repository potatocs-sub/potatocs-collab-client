
import { MaterialsModule } from '../../../../materials/materials.module';
import { FlatpickrModule } from 'angularx-flatpickr';
import { fromEvent, Observable, Subject, Subscription } from 'rxjs';

import { DocumentsService } from '../../../../services/spaces/documents.service';
import { DialogService } from '../../../../stores/dialog/dialog.service';
import { SpacesService } from '../../../../services/spaces/spaces.service';
import { ProfilesService } from '../../../../services/profiles/profiles.service';


import moment from 'moment';
import * as _ from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';

import {
  Component,
  effect,
  HostListener,
  Inject,
  OnInit,
  ViewEncapsulation,
  WritableSignal,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-scrumboard-add',
  standalone: true,
  imports: [MaterialsModule, FlatpickrModule],
  templateUrl: './scrumboard-add.component.html',
  styleUrl: './scrumboard-add.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ScrumboardAddComponent {
  // 브라우저 크기 변화 체크 ///
  resizeObservable$: Observable<Event>;
  resizeSubscription$: Subscription;
  mobileWidth: any;
  ///////////////////////

  basicProfile = '/assets/image/person.png';

  editorTitle: String;
  selectedStatus: any;
  spaceInfoObj: any;
  spaceTitle: any;
  spaceTime: any;
  startDate = new Date();
  endDate = new Date();

  subscription: Subscription;
  refresh = new Subject<void>();

  faceOption = false;
  faceOptionColor = 'accent'
  docStatus;
  member_list: any;
  // selectedMember: any;
  selectedMember: any;
  memberId: any;

  userProfileInfo: WritableSignal<any> = this.profilesService.userProfileInfo;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private docService: DocumentsService,
    private dialogService: DialogService,
    private spacesService: SpacesService,
    private profilesService: ProfilesService,


    public dialogRef: MatDialogRef<ScrumboardAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    effect(() => {
      if (this.userProfileInfo()) {
        this.selectedMember = [this.userProfileInfo()._id];
        this.memberId = this.userProfileInfo()._id;
      }
    });
  }

  ////////////////////////////////////
  // 브라우저 크기
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.mobileWidth = event.target.innerWidth;
  }
  ////////////////////////////////////

  ngOnInit(): void {

    // this.selectedStatus = 'submitted';
    this.route.queryParamMap.subscribe((params: any) => {
      this.spaceInfoObj = this.data;
      console.log(this.spaceInfoObj);
      this.spaceTitle = this.spaceInfoObj.spaceTitle;
      this.spaceTime = this.spaceInfoObj.spaceTime;
      this.selectedStatus = this.spaceInfoObj.status;
    });



    this.spacesService.getSpaceMembers(this.spaceTime).subscribe({
      next: (data: any) => {
        console.log(data);
        // console.log(data.spaceMembers[0].docStatus);
        this.docStatus = data.spaceMembers[0].docStatus;
        this.member_list = data.spaceMembers[0].memberObjects;

        console.log('스페이스멤버:', this.member_list);
        // this.selectedStatus = this.docStatus[0];
      },
      error: (err: any) => { },
    });

    //현재 로그인 되있는 유저 정보 불러오기
    console.log('에디터 컴포넌트', this.profilesService.userProfileInfo());



    ////////////////////////////////////
    // 브라우저 크기 변화 체크
    this.mobileWidth = window.screen.width;
    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe((evt) => {
      // console.log('event: ', evt)
    });
    ////////////////////////////////////
  }

  onSave() {
    this.dialogService
      .openDialogConfirm('Do you want to save this document?')
      .subscribe((result) => {
        if (result) {
          if (this.editorTitle == '' || this.editorTitle == null) {
            return this.dialogService.openDialogNegative(
              'Please write the title down'
            );
            // return alert('please write the title down');
          }

          const startDate = moment(new Date(this.startDate)).format(
            'YYYY-MM-DD HH:mm'
          );
          const endDate = moment(new Date(this.endDate)).format(
            'YYYY-MM-DD HH:mm'
          );

          // 종료시간이 시작시간보다 빠르면 리턴
          if (startDate > endDate) {
            console.log('시작 날짜', startDate);
            console.log('종료 날짜', endDate);
            return this.dialogService.openDialogNegative('Please check date');
          }


          const docData = {
            spaceTime: this.spaceTime,
            editorTitle: this.editorTitle,
            status: this.selectedStatus,

            startDate: this.startDate,
            endDate: this.endDate,
            // memberId: this.selectedMember._id
            memberId: this.selectedMember,
            // faceOption: this.faceOption  // space 만들때로 옮겨짐
          };
          //console.log('Article Data: ', docData);
          this.docCreate(docData);
          this.dialogService.openDialogPositive(
            'Successfully, the document has been saved.'
          )
          this.dialogRef.close();
        }
      });
  }

  toBack(): void {
    // this.router.navigate(['/space/' + this.spaceTime]);
    this.dialogRef.close()
  }

  //멤버 고르기
  memberSelect() {
    if (this.selectedMember.length === 0) {
      this.selectedMember = [this.memberId];
      console.log('셀렉티드 멤버', this.selectedMember);
      this.dialogService.openDialogNegative('Please one people');
      return;
    }
    this.memberId = this.selectedMember[0];
    console.log(this.memberId);
  }

  //document 생성
  docCreate(docData) {
    console.log(docData);
    this.docService.createDoc(docData).subscribe(
      (data: any) => {
        if (data.message == 'created') {
          this.router.navigate(['/space/' + this.spaceTime]);
        }
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  // 얼굴인식 옵션
  faceAuthentication() {

  }
  ngDestroy(): void { }
}
