import { Route } from '@angular/router';
import { ManagersConnectionComponent } from './managers-connection/managers-connection.component';
import { EmployeesListComponent } from './employees-list/employees-list.component';




export const EMPLOYEES_ROUTES: Route[] = [
  {
    path: '', // 회사 공휴일 or 기념일
    loadComponent: () => EmployeesListComponent,
  },
  {
    path: 'manager-connection-requests', // 회사 공휴일 or 기념일
    loadComponent: () => ManagersConnectionComponent,
  },
];
