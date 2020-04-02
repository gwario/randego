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
  // @ViewChild('canvasExp', {read: ElementRef}) canvasExp: ElementRef<HTMLCanvasElement>;

  private world: BabylonJsWorld;

  autoBuildProgress = 0;
  private autoBuildIntervalSubscription: Subscription;

  constructor() {  }

  ngOnInit(): void {  }

  ngAfterViewInit(): void {  }

  ngOnDestroy(): void {
    if (this.autoBuildIntervalSubscription) {
      this.autoBuildIntervalSubscription.unsubscribe();
    }
  }

  /**
   * Returns a random brick from the box.
   * The brick is removed from the box.
   */
  private pickRandomBrickFromBox(): Brick {
    if (this.box.length <= 0) {
      throw new Error(`Box is empty! Create new bricks.`);
    }
    const randomIndex = Math.floor(Math.random() * this.box.length);
    const boxItem = this.box[randomIndex];
    const brick = boxItem[0].cloneAsTemplate();
    boxItem[1]--;
    if (boxItem[1] <= 0) {
      // last of this bricks... remove
      this.box.splice(randomIndex, 1);
    }
    window.console.debug(`Picked brick:`, brick);
    return brick;
  }

  /**
   * Returns a random position from the world, where the brick would fit.
   * @param brick a brick
   */
  private pickRandomPositionFromWorldFor(brick: Brick): [number, number, number] {
    const possiblePositions: Array<[number, number, number]> = this.world.possiblePositionsFor(brick);
    window.console.debug(`Possible positions:`, possiblePositions.length);
    if (possiblePositions.length > 0) {
      const randomPositionIndex = Math.floor(Math.random() * possiblePositions.length);
      return possiblePositions[randomPositionIndex];
    } else {
      return null;
    }
  }

  /**
   * Places a single brick at a random position within the world.
   * @param $event the event
   */
  onSingleStepBuildStarted($event: void) {
    const nextBrick = this.pickRandomBrickFromBox();
    const nextPosition = this.pickRandomPositionFromWorldFor(nextBrick);
    if (nextPosition) {
      window.console.debug(`Random position for brick:`, nextPosition, nextBrick);
      this.world.putBrick(BabylonJsBrick.fromBrick(nextBrick), nextPosition);
    } else {
      window.console.debug(`There is no position left where this brick would fit!`);
      window.console.debug(`Discarding it!`, nextBrick);
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
      if (this.autoBuildProgress <= 0 || this.box.length <= 0) {
        if (this.autoBuildIntervalSubscription) {
          this.autoBuildProgress = 0;
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
