import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaceUploadComponent } from './face-upload.component';

describe('FaceUploadComponent', () => {
  let component: FaceUploadComponent;
  let fixture: ComponentFixture<FaceUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaceUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaceUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
