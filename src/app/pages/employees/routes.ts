import { Route } from '@angular/router';
import { EmployeesListComponent } from './employees-list/employees-list.component';
import { LeavesRequestsComponent } from './leaves-requests/leaves-requests.component';
import { LeavesStatusComponent } from './leaves-status/leaves-status.component';




export const EMPLOYEES_ROUTES: Route[] = [
  {
    path: 'list', // 직원 리스트
    loadComponent: () => EmployeesListComponent,
  },
  {
    path: 'leaves/status', // 직원들 사용 내역
    loadComponent: () => LeavesStatusComponent,
  },
  {
    path: 'leaves/requests', // 직원들 휴가 요청
    loadComponent: () => LeavesRequestsComponent,
  },
  {
    path: 'replacement-days/requests', // 직원들 대체 휴가 요청
    loadComponent: () => LeavesRequestsComponent,
  },
  {
    path: 'registration/requests', // 직원들 대체 휴가 요청
    loadComponent: () => LeavesRequestsComponent,
  },
  {
    path: '',
    redirectTo: 'employees/list',
    pathMatch: 'full',
  }
];
