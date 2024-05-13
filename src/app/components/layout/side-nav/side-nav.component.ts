import { Component } from '@angular/core';
import { MaterialsModule } from '../../../materials/materials.module';
import { CommonModule } from '@angular/common';
import { SideNavItemComponent } from '../side-nav-item/side-nav-item.component';
import { sidenavRouteInfo } from '../../../config/sidenav-route-info';
import { NavigationItem } from '../../../interfaces/navigation-item.interface';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [MaterialsModule, CommonModule, SideNavItemComponent, RouterModule],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss'
})
export class SideNavComponent {
  navItems: NavigationItem[] = sidenavRouteInfo;
}
