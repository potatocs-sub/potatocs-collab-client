import { Route } from '@angular/router';
import { LeavesRequestsAddComponent } from './requests/leaves-requests-add/leaves-requests-add.component';




export const LEAVES_ROUTES: Route[] = [
  {
    path: 'requests', // 회사 공휴일 or 기념일
    loadChildren: () => import('./requests/routes').then((m) => m.REQUESTS_ROUTES),
  },
  {
    path: 'requests/add', // 회사 공휴일 or 기념일
    loadComponent: () => LeavesRequestsAddComponent,
  },

];
