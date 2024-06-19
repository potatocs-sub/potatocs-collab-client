import { Route } from '@angular/router';
import { LeavesRequestsAddComponent } from './requests/leaves-requests-add/leaves-requests-add.component';
import { LeavesComponent } from './leaves.component';




export const LEAVES_ROUTES: Route[] = [
  {
    path: 'my-status',
    loadComponent: () => LeavesComponent
  },
  {
    path: 'requests', // 회사 공휴일 or 기념일
    loadChildren: () => import('./requests/routes').then((m) => m.REQUESTS_ROUTES),
  },
  {
    path: 'requests/add', // 회사 공휴일 or 기념일
    loadComponent: () => LeavesRequestsAddComponent,
  },

];
