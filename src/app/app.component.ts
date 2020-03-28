import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Brick} from './model/brick';
import {BuilderComponent} from './builder/builder.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  worldDimensions: [number, number, number] = [20, 20, 20];

  library: Array<[Brick, number]> = [];


  @ViewChild(BuilderComponent) private builder: BuilderComponent;

  constructor() { }

  ngOnInit() {  }

  ngAfterViewInit(): void {
    this.builder.initializeWorld(this.worldDimensions);
  }

  onBoxItemCreated(item: [Brick, number]) {
    const amount = item[1];
    const brick = item[0];

    this.library.push([brick, amount]);

    // window.console.debug(`Creating ${amount} blocks...`);
    // for (let i = 0; i < amount; i++) {
    //   this.blocks.push(brick);
    // }
  }

  onBoxItemRemoved(item: [number, Brick, number]) {
    const index = item[0];
    window.console.debug(`Removing item ${index} from the box...`);
    this.library.splice(index, 1);
  }
}
