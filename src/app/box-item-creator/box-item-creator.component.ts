import {AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {BabylonJsBrick} from '../model/babylon-js-brick';
import {Brick} from '../model/brick';
import * as BABYLON from 'babylonjs';
import Mesh = BABYLON.Mesh;
import Vector3 = BABYLON.Vector3;
import StandardMaterial = BABYLON.StandardMaterial;
import Color3 = BABYLON.Color3;
import Animation = BABYLON.Animation;
import Scene = BABYLON.Scene;
import MeshBuilder = BABYLON.MeshBuilder;
import HemisphericLight = BABYLON.HemisphericLight;
import Engine = BABYLON.Engine;
import ArcRotateCamera = BABYLON.ArcRotateCamera;
import Quaternion = BABYLON.Quaternion;
import Axis = BABYLON.Axis;

@Component({
  selector: 'app-box-item-creator',
  templateUrl: './box-item-creator.component.html',
  styleUrls: ['./box-item-creator.component.scss']
})
export class BoxItemCreatorComponent implements OnInit, AfterViewInit {

  @Output() created = new EventEmitter<[Brick, number]>();

  @ViewChild('canvas', {read: ElementRef}) canvas: ElementRef<HTMLCanvasElement>;

  predefinedColors: Array<string> = [
    '#a8e6cf',
    '#dcedc1',
    '#ffd3b6',
    '#ffaaa5',
    '#ff8b94'
  ];

  readonly bricksFormDefaults = {
    length: 2,
    width: 2,
    height: 2,
    color: '#a8e6cf',
    amount: 10,
  };

  bricksForm = this.fb.group({
    length: [this.bricksFormDefaults.length, Validators.required],
    width: [this.bricksFormDefaults.width, Validators.required],
    height: [this.bricksFormDefaults.height, Validators.required],
    color: [this.bricksFormDefaults.color, Validators.required],
    amount: [this.bricksFormDefaults.amount, Validators.required]
  });

  private brickMesh: Mesh;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.bricksForm.valueChanges.subscribe(value => {
      this.brickMesh.scaling.x = (value.length - 1);
      this.brickMesh.scaling.y = (value.height - 1);
      this.brickMesh.scaling.z = (value.width - 1);
      (this.brickMesh.material as StandardMaterial).diffuseColor = BABYLON.Color3.FromHexString(value.color);
    });

    const canvas = this.canvas.nativeElement;
    const engine = new Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true});
    const scene = new Scene(engine);
    const camera = new ArcRotateCamera('camera1', - Math.PI / 4, Math.PI / 3, 15,  Vector3.Zero(), scene);
    camera.attachControl(canvas, false);
    const light = new HemisphericLight('light1', new Vector3(0, 0, 10), scene);

    this.brickMesh = MeshBuilder.CreateBox('block', {width: 1, depth: 1, height: 1}, scene);
    this.brickMesh.material = new StandardMaterial('blo12ck_mat', scene);
    (this.brickMesh.material as StandardMaterial).diffuseColor = Color3.FromHexString('#a8e6cf');
    const animation = Animation.CreateAndStartAnimation('animation',  this.brickMesh, 'rotation.y',
      30, 100, this.brickMesh.rotation.y, this.brickMesh.rotation.y + Math.PI * 2,
      Animation.ANIMATIONLOOPMODE_CYCLE);
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

  createBoxItem() {
    const amount = this.bricksForm.get('amount').value;
    this.created.emit([this.fromFields(), amount]);
    // TODO does not work for color
    this.bricksForm.reset(this.bricksFormDefaults);
  }

  private fromFields(): BabylonJsBrick {
    return new BabylonJsBrick([
      this.bricksForm.get('length').value,
      this.bricksForm.get('width').value,
      this.bricksForm.get('height').value
    ], this.bricksForm.get('color').value);
  }
}
