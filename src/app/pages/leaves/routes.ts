import { Route } from '@angular/router';
import { LeavesRequestsAddComponent } from './requests/leaves-requests-add/leaves-requests-add.component';
import { StatusComponent } from './status/status.component';




export const LEAVES_ROUTES: Route[] = [
  {
    path: 'status', // 휴가 사용 현황
    loadComponent: () => StatusComponent
  },
  {
    path: 'requests', // 휴가 요청 목록
    loadChildren: () => import('./requests/routes').then((m) => m.REQUESTS_ROUTES),
  },

  {
    path: 'replacement-requests', // 대체 휴일 요청 목록(공휴일날 근무 시 대체 휴일 요청 목록)
    loadChildren: () => import('./replacement-requests/routes').then((m) => m.REPLACEMENT_REQUESTS_ROUTES)
  }
];
