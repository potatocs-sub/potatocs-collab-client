import { DialogService } from './../../../stores/dialog/dialog.service';
import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { MaterialsModule } from '../../../materials/materials.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompaniesService } from '../../../services/companies/companies.service';

@Component({
  selector: 'app-connect-company-dialog',
  standalone: true,
  imports: [CommonModule, MaterialsModule],
  templateUrl: './connect-company-dialog.component.html',
  styleUrl: './connect-company-dialog.component.scss',
})
export class ConnectCompanyDialogComponent {
  public dialogRef = inject(MatDialogRef<ConnectCompanyDialogComponent>);
  dialogsService = inject(DialogService);
  companiesService = inject(CompaniesService);
  public data: any = Inject(MAT_DIALOG_DATA);
  fb = inject(FormBuilder);

  connectCompanyForm: FormGroup = this.fb.group({
    companyCode: ['', [Validators.required]],
  });

  requestCompanyConnection() {
    const company_code = {
      company_code: this.connectCompanyForm.value.companyCode,
    };

    this.dialogsService
      .openDialogConfirm('Do you want to register a company?')
      .subscribe((result) => {
        if (result) {
          this.companiesService
            .requestCompanyConnection(company_code)
            .subscribe({
              next: (value: any) => {
                this.dialogRef.close();
                this.dialogsService.openDialogPositive(
                  'Successfully, the process has done!'
                );
              },
              error: (err: any) => {
                if (err.error.message == '4') {
                  this.dialogsService.openDialogNegative(
                    'Already has a pending request.'
                  );
                } else if (err.error.message == '5') {
                  this.dialogsService.openDialogNegative(
                    'Wrong code. Try again.'
                  );
                }
                this.connectCompanyForm.value.companyCode.setValue('');
              },
            });
        }
      });
  }
}
