import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input, SimpleChanges, WritableSignal, inject } from '@angular/core';
import { MaterialsModule } from '../../../materials/materials.module';
import { IsActiveMatchOptions, NavigationEnd, Router, RouterModule } from '@angular/router';
import { NavigationService } from '../../../stores/navigation/navigation.service';
import { NavigationDropdown, NavigationLink } from '../../../interfaces/navigation-item.interface';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-side-nav-item',
  standalone: true,
  imports: [
    CommonModule,
    MaterialsModule,
    RouterModule,
    SideNavItemComponent,
  ],
  templateUrl: './side-nav-item.component.html',
  styleUrl: './side-nav-item.component.scss'
})
export class SideNavItemComponent {
  @HostBinding('class')
  get levelClass() {
    return `item-level-${this.level}`;
  }


  @Input() item!: any;

  //레벨, 얼마나 깊이 들어왔는지 파악하기 위함
  @Input() level!: number;
  @Input() user: boolean = false;

  //열려있는지 파악하기 위함
  isOpen: boolean = false;
  isActive: boolean = false;

  // 의존성 주입
  router = inject(Router)
  navigationService = inject(NavigationService)
  // authService = inject(AuthService)

  isLink = this.navigationService.isLink;
  isDropdown = this.navigationService.isDropdown;
  isSubheading = this.navigationService.isSubheading;
  isCreateSpace = this.navigationService.isCreateSpace;
  //상위 컴포넌트에서 넘어오는 아이템
  //any 사용 이유, 아래쪽에서 isLink, isDropdown, isSubheading을 사용해 타입을 분리하고 있음

  selectedDropDownItem: WritableSignal<NavigationDropdown | null> = inject(NavigationService).selectedDropDownItem;
  subscriptions!: Subscription;
  userLeaveData: any;

  ngOnInit(): void {
    this.subscriptions = new Subscription();
    if (this.isDropdown(this.item)) {
      const sub1 = this.router.events.pipe(
        filter(event => event instanceof NavigationEnd),
      ).subscribe(() => this.onRouteChange());

      this.subscriptions.add(sub1)
    }

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.hasOwnProperty('item') && this.isDropdown(this.item)) {
      // this.item -> changes.item.currentValue로 해도 됨
      this.onRouteChange();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions!.unsubscribe();
  }

  /**
 * @description toggle 함수
 */
  toggleOpen() {
    this.isOpen = !this.isOpen;
    this.navigationService.openItems.set(this.item as NavigationDropdown)
  }



  /**
   * @description 드롭다운 되었을 경우 다른 드롭다운 메뉴들은 닫혀야 한다.
   * @param item 
   */
  onOpenChange(item: NavigationDropdown) {
    // 1. 클릭한 메뉴가 내 자식일 경우
    if (this.isChildrenOf(this.item as NavigationDropdown, item as NavigationLink | NavigationDropdown)) {
      return;
    }

    // 2. 클릭한 메뉴가 active한 child (Link)를 가지고 있는 경우
    if (this.hasActiveChilds(this.item as NavigationDropdown)) {
      return;
    }

    // 3. 현재내 dropdown에 대한 변경일 경우
    if (this.item === item) {
      return;
    }

    this.isOpen = false;
  }

  /**
   * @작성자 임호균
   * @작성일 2023-08-21
   * @description Route change가 발생한 경우 
   * - dropdown menu의 item일 경우에만 실행
   * - route 변경이 발생한 경우 
   * - 1. 하위 자식 중 active가 존재 (현재 routing에 해당): dropdown 열기, active 설정]
   * - 2. 하위 자식 중 active가 없음: dropdown 닫기
   */
  onRouteChange() {
    // 내 하위 Menu에 active child가 있는 경우
    if (this.hasActiveChilds(this.item as NavigationDropdown)) {
      this.isActive = true;
      this.isOpen = true;
      this.navigationService.openItems.set(this.item as NavigationDropdown)
    }
    // 내 하위 Menu에 active child가 없는 경우
    else {
      this.isActive = false;
      this.isOpen = false;
      this.navigationService.openItems.set(this.item as NavigationDropdown)
    }
  }

  /**
   * @description 클릭한 메뉴가 내 자식일 경우
   * @param parent 
   * @param item 
   */
  isChildrenOf(parent: NavigationDropdown, item: NavigationLink | NavigationDropdown): any {
    if (parent.children?.indexOf(item) !== -1) {
      return true;
    }
    return parent?.children
      .filter((child: NavigationLink | NavigationDropdown) => this.isDropdown(child as NavigationDropdown))
      .filter((child: NavigationLink | NavigationDropdown) => this.isChildrenOf(child as NavigationDropdown, item)).length
  }

  /**
   * this.router.isActive를 사용하려는데 에러 발생해서 chat-gpt에 물어봐서 나온 답변
   */
  isActiveOptions: IsActiveMatchOptions = {
    paths: 'subset',
    queryParams: 'subset',
    fragment: 'ignored',
    matrixParams: 'ignored'
  };

  /**
   * @description 클릭한 메뉴가 active한 child (Link)를 가지고 있는 경우
   * @param parent 
   * @returns 
   */
  hasActiveChilds(parent: NavigationDropdown): any {
    return parent.children.some((child: any) => {
      if (this.isDropdown(child)) {
        return this.hasActiveChilds(child);
      }

      if (this.isLink(child)) {
        return this.router.isActive(child.route as string, this.isActiveOptions);
      }
    })
  }


  isReplacement(item: NavigationLink) {
    if (item.isReplacementDay == false || item.isReplacementDay == undefined) {
      return true;
    }

    return item.isReplacementDay == true && this.userLeaveData?.isReplacementDay == true
  }

  signOut() {
    // this.authService.signOut();
    // this.router.navigate(['/sign-in']);
  }
  closeEvent() {
    console.log('close')
    // this.isSideNavOpen.set(false);
  }
}
