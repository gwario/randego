import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';

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

  readonly autoBuilderControlsDefaults = {
    autoBuilderControlsCount: 5,
    autoBuilderControlsInterval: 1000
  };

  autoBuilderControlsForm = this.fb.group({
    autoBuilderControlsCount: [this.autoBuilderControlsDefaults.autoBuilderControlsCount, Validators.min(2)],
    autoBuilderControlsInterval: [this.autoBuilderControlsDefaults.autoBuilderControlsInterval, Validators.min(100)]
  });

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  autoBuild() {
    const count = this.autoBuilderControlsForm.get('autoBuilderControlsCount').value;
    const interval = this.autoBuilderControlsForm.get('autoBuilderControlsInterval').value;
    this.autoBuildStarted.emit([count, interval]);
  }

  singleStepBuild() {
    this.singleStepBuildStarted.emit();
  }

  cancelAutoBuild() {
    this.autoBuildCancelled.emit();
  }
}
