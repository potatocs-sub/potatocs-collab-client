import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-connect-manager-dialog-component',
  standalone: true,
  imports: [],
  templateUrl: './connect-manager-dialog-component.component.html',
  styleUrl: './connect-manager-dialog-component.component.scss'
})
export class ConnectManagerDialogComponentComponent {
  public dialogRef!: MatDialogRef<ConnectManagerDialogComponentComponent>;
  public data: any = Inject(MAT_DIALOG_DATA)
  searchStr = ''; // 검색어.
  manager: any;

  hasManager: boolean = false;
  managerInfo: any;
  searchBtn: boolean = false;
  // displayedColumns: string[] = ['name', 'email', 'acceptButton', 'cancelButton'];
  displayedColumns: string[] = ['name', 'email', 'acceptButton']
}