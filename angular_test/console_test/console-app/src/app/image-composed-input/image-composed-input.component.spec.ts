import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageComposedInputComponent } from './image-composed-input.component';

describe('ImageComposedInputComponent', () => {
  let component: ImageComposedInputComponent;
  let fixture: ComponentFixture<ImageComposedInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageComposedInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageComposedInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
