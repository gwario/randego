import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Brick} from '../model/brick';
import {interval, Subscription} from 'rxjs';
import {BabylonJsWorld} from '../model/babylon-js-world';
import {BabylonJsBrick} from '../model/babylon-js-brick';

@Component({
  selector: 'app-builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.scss']
})
export class BuilderComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() box: Array<[Brick, number]>;
  @ViewChild('canvas', {read: ElementRef}) canvas: ElementRef<HTMLCanvasElement>;

  private world: BabylonJsWorld;

  autoBuildProgress = 0;
  private autoBuildIntervalSubscription: Subscription;

  constructor() {  }

  ngOnInit(): void {  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    if (this.autoBuildIntervalSubscription) {
      this.autoBuildIntervalSubscription.unsubscribe();
    }
  }

  private pickRandomBrickFromBox(): Brick {
    if (this.box.length <= 0) {
      throw new Error(`Box is empty! Create new bricks.`);
    }
    const randomIndex = Math.floor(Math.random() * this.box.length);
    const boxItem = this.box[randomIndex];
    const brick = boxItem[0];
    boxItem[1]--;
    if (boxItem[1] <= 0) {
      // last of this bricks... remove
      this.box.splice(randomIndex, 1);
    }
    window.console.debug(`Picked brick:`, brick);
    return brick;
  }

  private nextRandomWorldPosition(): [number, number, number] {
    const dimensions = this.world.dimensions;
    const randomPosition: [number, number, number] = [
      Math.floor(Math.random() * dimensions[0]),
      Math.floor(Math.random() * dimensions[1]),
      Math.floor(Math.random() * dimensions[2])
      ];
    window.console.debug(`randomPosition: ${randomPosition}`);
    return randomPosition;
  }

  /**
   * Places a single brick at a random position within the world.
   * @param $event the event
   */
  onSingleStepBuildStarted($event: void) {
    const nextBrick = this.pickRandomBrickFromBox();
    const possiblePositions: Array<[number, number, number]> = this.world.possiblePositionsFor(nextBrick);
    window.console.debug(`Possible positions:`, possiblePositions);
    if (possiblePositions.length > 0) {
      const randomPositionIndex = Math.floor(Math.random() * possiblePositions.length);
      // const nextPosition = this.nextRandomWorldPosition();
      const nextPosition = possiblePositions[randomPositionIndex];
      window.console.debug(`Trying to place brick at positions:`, nextPosition);
      this.world.putBrick(BabylonJsBrick.fromBrick(nextBrick), nextPosition);
      window.console.debug(`Put brick at ${nextPosition}`);
    } else {
      window.console.debug(`Unable to put brick anywhere in this world!`);
    }
  }

  /**
   * Places a given number of bricks at random positions within the world.
   * Executes multiple single step builds.
   * @param $event [0]: the number of bricks [1]: the interval in which the bricks should be placed
   */
  onAutoBuildStarted($event: [number, number]) {
    const count = $event[0];
    const intervalMs = $event[1];

    this.autoBuildProgress = count;
    this.autoBuildIntervalSubscription = interval(intervalMs).subscribe(val => {
      if (this.autoBuildProgress > 0) {
        this.onSingleStepBuildStarted();
        this.autoBuildProgress--;
      }
      if (this.autoBuildProgress <= 0) {
        if (this.autoBuildIntervalSubscription) {
          this.autoBuildIntervalSubscription.unsubscribe();
        }
      }
    });
  }

  /**
   * Cancels the autobuild.
   * @param $event the event
   */
  onAutoBuildCancelled($event: void) {
    this.autoBuildProgress = 0;
  }

  /**
   * Initializes the world object.
   * @param dimensions the dimensions
   */
  initializeWorld(dimensions: [number, number, number]) {
    this.world = new BabylonJsWorld(dimensions, this.canvas.nativeElement);
  }
}
