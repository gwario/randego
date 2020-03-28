import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxItemComponent } from './box-item.component';
import {Brick} from '../model/brick';

describe('BoxItemComponent', () => {
  let component: BoxItemComponent;
  let fixture: ComponentFixture<BoxItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoxItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxItemComponent);
    component = fixture.componentInstance;

    component.brick = new Brick([2, 2, 2], '#aabbcc');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
