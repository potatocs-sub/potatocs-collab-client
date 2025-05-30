import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficialLeaveCheckComponent } from './official-leave-check.component';

describe('OfficialLeaveCheckComponent', () => {
  let component: OfficialLeaveCheckComponent;
  let fixture: ComponentFixture<OfficialLeaveCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfficialLeaveCheckComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OfficialLeaveCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
