import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaceRecognitonDialogComponent } from './face-recogniton-dialog.component';

describe('FaceRecognitonDialogComponent', () => {
  let component: FaceRecognitonDialogComponent;
  let fixture: ComponentFixture<FaceRecognitonDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaceRecognitonDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FaceRecognitonDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
