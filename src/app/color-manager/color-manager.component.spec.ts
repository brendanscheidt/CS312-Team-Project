import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorManagerComponent } from './color-manager.component';

describe('ColorManagerComponent', () => {
  let component: ColorManagerComponent;
  let fixture: ComponentFixture<ColorManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColorManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
