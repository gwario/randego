import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Brick} from '../model/brick';

@Component({
  selector: 'app-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.scss']
})
export class BoxComponent implements OnInit {

  @Input() brickNumbers: Array<[Brick, number]>;

  @Output() removed = new EventEmitter<[number, Brick, number]>();

  constructor() { }

  ngOnInit(): void {
  }

  onBocItemRemoved(item: [number, Brick, number]) {
    this.removed.emit(item);
  }
}
