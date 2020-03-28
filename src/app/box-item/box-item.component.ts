import {Component, EventEmitter, Input, OnInit, AfterViewInit, Output, ViewChild, Renderer2, ElementRef} from '@angular/core';
import {Brick} from '../model/brick';
import * as BABYLON from 'babylonjs';
import Vector3 = BABYLON.Vector3;
import Engine = BABYLON.Engine;
import Scene = BABYLON.Scene;
import TargetCamera = BABYLON.TargetCamera;
import StandardMaterial = BABYLON.StandardMaterial;
import Color3 = BABYLON.Color3;
import MeshBuilder = BABYLON.MeshBuilder;
import HemisphericLight = BABYLON.HemisphericLight;
import Mesh = BABYLON.Mesh;

@Component({
  selector: 'app-box-item',
  templateUrl: './box-item.component.html',
  styleUrls: ['./box-item.component.scss']
})
export class BoxItemComponent implements OnInit, AfterViewInit {

  @Input() index: number;
  @Input() brick: Brick;
  @Input() amount: number;

  @Output() removed = new EventEmitter<[number, Brick, number]>();

  @ViewChild('canvas', {read: ElementRef}) canvas: ElementRef<HTMLCanvasElement>;

  private brickMash: Mesh;

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    const canvas = this.canvas.nativeElement;
    const engine = new Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true});
    const scene = new Scene(engine);
    const camera = new TargetCamera('camera121', new Vector3(0, 5, -10), scene);
    camera.setTarget(Vector3.Zero());
    camera.attachControl(canvas, false);
    const light = new HemisphericLight('l121ight1', new Vector3(0, 1, 0), scene);
    this.brickMash = MeshBuilder.CreateBox('block12',
      {width: this.brick.dimensions[0], depth: this.brick.dimensions[1], height: this.brick.dimensions[2]},
      scene);
    const material = new StandardMaterial('blo12ck_mat', scene);
    material.diffuseColor = Color3.FromHexString(this.brick.color);
    this.brickMash.material = material;
    // scene.removeMesh(box);
    // this.blockPreview.position.y = 1;
    // Create a built-in "ground" shape; its constructor takes 6 params : name, width, height, subdivision, scene, updatable
    // const ground = BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, scene, false);
    // run the render loop
    engine.runRenderLoop(() => {
      scene.render();
    });
    // the canvas/window resize event handler
    window.addEventListener('resize', () => {
      engine.resize();
    });
  }

  removeBoxItem(index: number, brick: Brick, amount: number) {
    this.removed.emit([index, brick, amount]);
  }
}
