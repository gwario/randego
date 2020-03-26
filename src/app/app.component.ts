import {Component, OnInit} from '@angular/core';
import {Block} from './model/block';
import {World} from './model/world';
import {BabylonJsWorld} from './model/babylon-js-world';
import {BabylonJsBlock} from './model/babylon-js-block';
import * as BABYLON from 'babylonjs';
import {Validators} from '@angular/forms';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  worldDimensions: [number, number, number] = [20, 20, 20];
  world: World;

  blocks: Block[];

  predefinedColors: string[] = [
    '#a8e6cf',
    '#dcedc1',
    '#ffd3b6',
    '#ffaaa5',
    '#ff8b94'
  ];

  blocksForm = this.fb.group({
    length: [2, Validators.required],
    width: [2, Validators.required],
    height: [2, Validators.required],
    color: ['#a8e6cf', Validators.required],
    amount: [10, Validators.required]
  });

  blockPreview = null;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {

    this.blocksForm.valueChanges.subscribe(value => {
      this.blockPreview.scaling.x = (value.length-1);
      this.blockPreview.scaling.y = (value.height-1);
      this.blockPreview.scaling.z = (value.width-1);
      this.blockPreview.material.diffuseColor = BABYLON.Color3.FromHexString(value.color);
    });

    // Get the canvas DOM element
    const canvas = document.getElementById('preview') as HTMLCanvasElement;
    // Load the 3D engine
    const engine = new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true});
    // CreateScene function that creates and return the scene
    // Create a basic BJS Scene object
    const scene = new BABYLON.Scene(engine);
    // Create a FreeCamera, and set its position to {x: 0, y: 5, z: -10}
    const camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene);
    // Target the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());
    // Attach the camera to the canvas
    camera.attachControl(canvas, false);
    // Create a basic light, aiming 0, 1, 0 - meaning, to the sky
    const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
    this.blockPreview = BABYLON.MeshBuilder.CreateBox('block', {width: 1, depth: 1, height: 1}, scene);
    this.blockPreview.material = new BABYLON.StandardMaterial('block_mat', scene);
    this.blockPreview.material.diffuseColor = BABYLON.Color3.FromHexString('#a8e6cf')
    // scene.removeMesh(box);
    // Move the sphere upward 1/2 of its height
    this.blockPreview.position.y = 1;
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

    // init the world
    this.world = new BabylonJsWorld(this.worldDimensions);

    // at the moment all connections are possible, but there mit be like with lego, that not all connections are available.
    this.blocks = [];
  }

  createBlocks() {
    const amount = this.blocksForm.get('amount').value
    window.console.debug(`Creating ${amount} blocks...`);
    for (let i = 0; i < amount; i++) {
      this.blocks.push(this.fromFields());
    }
  }

  private fromFields(): BabylonJsBlock {
    return new BabylonJsBlock([
      this.blocksForm.get('length').value,
      this.blocksForm.get('width').value,
      this.blocksForm.get('height').value
    ], this.blocksForm.get('color').value);
  }
}
