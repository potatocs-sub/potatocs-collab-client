import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrumboardAddComponent } from './scrumboard-add.component';

describe('ScrumboardAddComponent', () => {
  let component: ScrumboardAddComponent;
  let fixture: ComponentFixture<ScrumboardAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrumboardAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScrumboardAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
