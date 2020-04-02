import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {Brick} from '../model/brick';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

@Component({
  selector: 'app-builder-controls',
  templateUrl: './builder-controls.component.html',
  styleUrls: ['./builder-controls.component.scss']
})
export class BuilderControlsComponent implements OnInit {

  /**
   * [count, interval]
   */
  @Output() autoBuildStarted = new EventEmitter<[number, number]>();

  @Output() autoBuildCancelled = new EventEmitter<void>();

  @Output() singleStepBuildStarted = new EventEmitter<void>();

  @Input() autoBuildProgress: number;
  @Input() box: Array<[Brick, number]>;

  readonly autoBuilderControlsDefaults = {
    autoBuilderControlsCount: 5,
    autoBuilderControlsInterval: 1000
  };

  autoBuilderControlsForm = this.fb.group({
    autoBuilderControlsCount: [this.autoBuilderControlsDefaults.autoBuilderControlsCount, [Validators.min(2)]],
    autoBuilderControlsInterval: [this.autoBuilderControlsDefaults.autoBuilderControlsInterval, [Validators.min(100)]]
  });

  showBrickDiscardedWarning: boolean;
  private _showBrickDiscardedInfoSubject = new Subject<void>();

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this._showBrickDiscardedInfoSubject.subscribe(_ => this.showBrickDiscardedWarning = true);
    this._showBrickDiscardedInfoSubject.pipe(
      debounceTime(5000)
    ).subscribe(_ => this.showBrickDiscardedWarning = false);
  }

  brickCount(box: Array<[Brick, number]> = []): number {
    return box.reduce((previousValue, currentValue) => previousValue[1] + currentValue[1], 0);
  }

  autoBuild() {
    const count = this.autoBuilderControlsForm.get('autoBuilderControlsCount').value;
    const interval = this.autoBuilderControlsForm.get('autoBuilderControlsInterval').value;
    this.autoBuildStarted.emit([count, interval]);
    this.autoBuilderControlsForm.reset(this.autoBuilderControlsDefaults);
  }

  singleStepBuild() {
    this.singleStepBuildStarted.emit();
  }

  cancelAutoBuild() {
    this.autoBuildCancelled.emit();
  }
}
