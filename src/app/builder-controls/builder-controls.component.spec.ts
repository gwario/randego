import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuilderControlsComponent } from './builder-controls.component';
import {ReactiveFormsModule} from '@angular/forms';

describe('BuilderControlsComponent', () => {
  let component: BuilderControlsComponent;
  let fixture: ComponentFixture<BuilderControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuilderControlsComponent ],
      imports: [ ReactiveFormsModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuilderControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
