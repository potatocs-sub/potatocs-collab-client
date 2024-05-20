import { ProfilesService } from './../../../../services/profiles/profiles.service';
import { CommonModule } from '@angular/common';
import { Component, WritableSignal, effect, inject } from '@angular/core';
import { MaterialsModule } from '../../../../materials/materials.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeavesService } from '../../../../services/leaves/leaves.service';

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
  userProfileInfo: WritableSignal<any> = this.profilesService.userProfileInfo

  employeeLeaveForm: FormGroup = this.fb.group({
    leaveType1: ['', [Validators.required]],
    leaveType2: ['', [Validators.required]],
    leave_start_date: ['', [Validators.required]],
    leave_end_date: ['', [Validators.required]],
    leave_reason: ['', [Validators.required]],
  });

  constructor() {
    effect(() => {
      if (this.userProfileInfo()?.location) {
        this.leavesService.getNationHolidays(this.userProfileInfo().location)
      }
    })
  }

  ngAfterViewInit() {

  }

}
