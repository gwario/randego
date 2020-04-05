import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuilderControlsComponent } from './builder-controls.component';
import {ReactiveFormsModule} from '@angular/forms';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {Subject} from 'rxjs';

describe('BuilderControlsComponent', () => {
  let component: BuilderControlsComponent;
  let fixture: ComponentFixture<BuilderControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuilderControlsComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [ Subject ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuilderControlsComponent);
    component = fixture.componentInstance;
    component.showBrickDiscardedInfoSubject = TestBed.inject(Subject);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
