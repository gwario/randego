import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxItemCreatorComponent } from './box-item-creator.component';

describe('BrickCreatorComponent', () => {
  let component: BoxItemCreatorComponent;
  let fixture: ComponentFixture<BoxItemCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoxItemCreatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxItemCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
