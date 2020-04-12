import {World} from './world';
import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';
import {BabylonJsBrick} from './babylon-js-brick';
import {Brick} from './brick';
import Engine = BABYLON.Engine;
import Scene = BABYLON.Scene;
import Vector3 = BABYLON.Vector3;
import HemisphericLight = BABYLON.HemisphericLight;
import Mesh = BABYLON.Mesh;
import Color3 = BABYLON.Color3;
import StandardMaterial = BABYLON.StandardMaterial;
import VRExperienceHelper = BABYLON.VRExperienceHelper;
import FreeCameraDeviceOrientationInput = BABYLON.FreeCameraDeviceOrientationInput;
import MeshBuilder = BABYLON.MeshBuilder;
import EasingFunction = BABYLON.EasingFunction;
import SineEase = BABYLON.SineEase;
import Animation = BABYLON.Animation;
import Xbox360Button = BABYLON.Xbox360Button;
import WebVRFreeCamera = BABYLON.WebVRFreeCamera;
import PointLight = BABYLON.PointLight;
import UniversalCamera = BABYLON.UniversalCamera;
import VRDeviceOrientationFreeCamera = BABYLON.VRDeviceOrientationFreeCamera;
import FreeCamera = BABYLON.FreeCamera;
import ArcRotateCamera = BABYLON.ArcRotateCamera;

export class BabylonJsWorld extends World {

  /**
   * @param dimensions the dimensions i.e. x,y,z
   * @param canvas the canvas
   * @param drawBoundaries whether to draw the world's boundaries
   */
  constructor(dimensions: [number, number, number], canvas: HTMLCanvasElement, drawBoundaries: boolean = true) {
    super(dimensions);
    this.canvas = canvas;
    this.engine = new Engine(this.canvas, true, {preserveDrawingBuffer: true, stencil: true});
    this.scene = new Scene(this.engine);
    // Create a basic light, aiming 0, 1, 0 - meaning, to the sky TODO play around for world
    const light1 = new HemisphericLight('mainLight', new Vector3(0, 1, 0), this.scene);
    const light2 = new PointLight('secondLight', new Vector3(0, 6, 0), this.scene);

    const camPos = new Vector3(this.dimensions[0] * 0.5, this.dimensions[1] * 0.5, -this.dimensions[2] * 1.5);

    this.vrHelper = this.scene.createDefaultVRExperience({
      useMultiview: true
    });
    this.scene.activeCamera.position = camPos;
    this.setupVrExperience();
    // Touch or click the rendering canvas to enter VR Mode
    this.scene.onPointerDown = () => {
      this.scene.onPointerDown = undefined;
      this.scene.activeCamera.attachControl(this.canvas, false);
      this.scene.registerBeforeRender(() => {
        // castRayAndSelectObject();
      });
    };

    // this.drawAxis(10);
    if (drawBoundaries) {
        BabylonJsWorld.drawBoundaries(this.dimensions, '#c2c2c2', this.scene);
    }

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
    window.addEventListener('resize', () => {
      this.engine.resize();
    });
  }

  private readonly navMeshColor = '#dd004f';
  private readonly navMeshSize = 1;

  private readonly canvas: HTMLCanvasElement;
  private readonly scene: Scene;
  private readonly engine: Engine;
  private vrHelper: VRExperienceHelper;
  // private camera: Camera;
  // private readonly light: HemisphericLight;
  private teleportationAllowed: any;
  private teleportationRequestInitiated: boolean;
  private teleportationCircle: Mesh;
  private haloCenter = new Vector3(0, 0, 0);
  private target: any;

  public static drawLine(scene, from: Vector3, to: Vector3, col, dashed: boolean = true) {
    const length = Vector3.Distance(from, to);
    const line = dashed
      ? Mesh.CreateDashedLines('worldBoundaries', [from, to], 1,     1,     length, scene)
      : Mesh.CreateLines('worldBoundaries', [from, to], scene);
    line.color = Color3.FromHexString(col);
  }

  public static drawBoundaries(dimensions: [number, number, number], color, scene) {
    BabylonJsWorld.drawLine(scene, new Vector3(0, 0, 0), new Vector3(dimensions[0], 0, 0), color);
    BabylonJsWorld.drawLine(scene, new Vector3(0, 0, 0), new Vector3(0, dimensions[1], 0), color);
    BabylonJsWorld.drawLine(scene, new Vector3(0, 0, 0), new Vector3(0, 0, dimensions[2]), color);
    BabylonJsWorld.drawLine(scene, new Vector3(dimensions[0], dimensions[1], dimensions[2]), new Vector3(0, dimensions[1], dimensions[2]),
      color);
    BabylonJsWorld.drawLine(scene, new Vector3(dimensions[0], dimensions[1], dimensions[2]), new Vector3(dimensions[0], 0, dimensions[2]),
      color);
    BabylonJsWorld.drawLine(scene, new Vector3(dimensions[0], dimensions[1], dimensions[2]), new Vector3(dimensions[0], dimensions[1], 0),
      color);
    BabylonJsWorld.drawLine(scene, new Vector3(0, 0, dimensions[2]), new Vector3(0, dimensions[1], dimensions[2]), color);
    BabylonJsWorld.drawLine(scene, new Vector3(0, 0, dimensions[2]), new Vector3(dimensions[0], 0, dimensions[2]), color);
    BabylonJsWorld.drawLine(scene, new Vector3(0, dimensions[1], dimensions[2]), new Vector3(0, dimensions[1], 0), color);
    BabylonJsWorld.drawLine(scene, new Vector3(0, dimensions[1], 0), new Vector3(dimensions[0], dimensions[1], 0), color);
    BabylonJsWorld.drawLine(scene, new Vector3(dimensions[0], dimensions[1], 0), new Vector3(dimensions[0], 0, 0), color);
    BabylonJsWorld.drawLine(scene, new Vector3(dimensions[0], 0, dimensions[2]), new Vector3(dimensions[0], 0, 0), color);
  }

  private setupVrExperience() {

    const groundMesh = this.drawNavigationGroundMesh();

    const margin = 5;
    const navPositions = [groundMesh];
    // const ground = this.drawNavigationalMesh([-1, - 1, -1]);
    navPositions.push(this.drawNavigationPointMesh([-margin, -margin, -margin]));
    navPositions.push(this.drawNavigationPointMesh([this.dimensions[0] + margin, -margin, -margin]));
    navPositions.push(this.drawNavigationPointMesh([-margin, this.dimensions[1] + margin, -margin]));
    navPositions.push(this.drawNavigationPointMesh([-margin, -margin, this.dimensions[2] + margin]));
    navPositions.push(this.drawNavigationPointMesh([-margin, this.dimensions[1] + margin, this.dimensions[2] + margin]));
    navPositions.push(this.drawNavigationPointMesh([this.dimensions[0] + margin, this.dimensions[1] + margin,
      this.dimensions[2] + margin]));
    navPositions.push(this.drawNavigationPointMesh([this.dimensions[0] + margin, -margin, this.dimensions[2] + margin]));
    navPositions.push(this.drawNavigationPointMesh([this.dimensions[0] + margin, this.dimensions[0] + margin, -margin]));

    navPositions.push(this.drawNavigationPointMesh([this.dimensions[0] / 2, this.dimensions[1] / 2, - margin * 2]));
    navPositions.push(this.drawNavigationPointMesh([this.dimensions[0] / 2, this.dimensions[1] / 2,
      this.dimensions[2] + margin * 2]));
    navPositions.push(this.drawNavigationPointMesh([-margin * 2, this.dimensions[1] / 2, this.dimensions[2] / 2]));
    navPositions.push(this.drawNavigationPointMesh([this.dimensions[0] + margin * 2, this.dimensions[1] / 2,
      this.dimensions[2] / 2]));
    navPositions.push(this.drawNavigationPointMesh([this.dimensions[0] / 2, -margin * 2, this.dimensions[2] / 2]));
    navPositions.push(this.drawNavigationPointMesh([this.dimensions[0] / 2, this.dimensions[1] + margin * 2,
      this.dimensions[2] / 2]));

    this.createTargetMesh();
    this.createTeleportationCircles();

    // out of the box, teleportation doesnt work completely without controllers
    this.vrHelper.enableTeleportation({ floorMeshes: navPositions });


    // this.vrHelper.gazeTrackerMesh = MeshBuilder.CreateSphere('gazeTrackerSot', { segments: 4, diameter: 0.1 } , this.scene);
    this.vrHelper.updateGazeTrackerColor = true;
    this.vrHelper.updateGazeTrackerScale = true;
    // Only show gaze dot on those meshes 'mauern'
    this.vrHelper.enableInteractions();
    this.vrHelper.raySelectionPredicate = (mesh) => {
      return mesh.name.indexOf('navPosition') !== -1;
    };
    // Only fire onNewMeshSelected event if the selected mesh's one of those 'anwaehlbare teile'
    this.vrHelper.meshSelectionPredicate = (mesh) => {
      window.console.debug('meshSelectionPredicate mesh: ' + mesh.name);
      return mesh.name.indexOf('navPosition') !== -1;
    };
    // when the selected mash changes
    this.vrHelper.onNewMeshSelected.add((mesh) => {
      window.console.debug('Selected mesh: ' + mesh.name);
      // window.alert('Selected mesh: ' + mesh.name);
    });
    // when the mesh is picked!?
    this.vrHelper.onNewMeshPicked.add(pickingInfo => {
      window.console.debug('pickingInfo: ' + pickingInfo);
      // Callback receiving ray cast picking info
    });
    // this.vrHelper.vrDeviceOrientationCamera.position.x = camPos.x;
    // this.vrHelper.vrDeviceOrientationCamera.position.y = camPos.y;
    // this.vrHelper.vrDeviceOrientationCamera.position.z = camPos.z;
    this.vrHelper.onAfterEnteringVRObservable.add(() => {
      if (this.scene.activeCamera === this.vrHelper.vrDeviceOrientationCamera) {
        FreeCameraDeviceOrientationInput.WaitForOrientationChangeAsync(1000)
          .then(() => {
            // Successfully received sensor input
          })
          .catch(() => {
            alert('Device orientation camera is being used but no sensor is found, prompt user to enable in safari settings');
          });
      }
    });

  }

  /**
   * Draws a ground panel mesh.
   */
  private drawNavigationGroundMesh(): Mesh {
    const groundMargin = [10, 10];
    const groundPosition = [0, 0, -10];
    const groundSize = [this.dimensions[0] + groundMargin[0] * 2, this.dimensions[1] + groundMargin[1] * 2];
    const ground = MeshBuilder.CreateGround(
      'navPosition_ground',
      {width: groundSize[0], height: groundSize[1]},
      this.scene);
    ground.material = new StandardMaterial('ground_material', this.scene);
    (ground.material as StandardMaterial).diffuseColor = Color3.FromHexString(this.navMeshColor);
    ground.position.x = groundPosition[0] + groundSize[0] / 2 - groundMargin[0];
    ground.position.z = groundPosition[1] + groundSize[0] / 2 - groundMargin[1];
    ground.position.y = groundPosition[2];
    return ground;
  }

  /**
   * Draws boxes to which a vr user can teleport.
   * @param position the scene
   */
  private drawNavigationPointMesh(position: [number, number, number]): Mesh {
    const mesh = MeshBuilder.CreateBox(
      'navPosition_' + position[0] + '_' + position[1] + '_' + position[2],
      {width: this.navMeshSize, depth: this.navMeshSize, height: this.navMeshSize}, this.scene);
    mesh.material =  new StandardMaterial('brick_material', this.scene);
    (mesh.material as StandardMaterial).diffuseColor = Color3.FromHexString(this.navMeshColor);
    mesh.position.x = position[0];
    mesh.position.y = position[1];
    mesh.position.z = position[2];
    return mesh;
  }

  private onNewGamepadConnected(gamepad) {
    window.console.log('New gamepad connected: ' + gamepad.id);
    const xboxpad = gamepad;
    if (xboxpad.onbuttondown) {
      xboxpad.onbuttondown((buttonValue) => {
        if (buttonValue === Xbox360Button.Y) {
          this.teleportationRequestInitiated = true;
        }
      });
    }
    if (xboxpad.onbuttonup) {
      xboxpad.onbuttonup((buttonValue) => {
        if (buttonValue === Xbox360Button.Y) {
          if (this.teleportationAllowed) {
            // Teleportation is just about moving the camera position
            this.vrHelper.currentVRCamera.position.x = this.haloCenter.x;
            this.vrHelper.currentVRCamera.position.z = this.haloCenter.z;
          }
          this.teleportationRequestInitiated = false;
        }
      });
    }
  }

  private onControllersAttached() {
    window.console.log('Both VR controllers detected.');

    if (this.vrHelper.webVRCamera) {
      // Removing the gaze circle when using VR controllers
      if (this.target) {
        this.target.isVible = false;
      }

      // A button on Oculus Touch, Grip button on Vive
      this.vrHelper.webVRCamera.leftController.onMainButtonStateChangedObservable.add((stateObject) => {
        // on pressed
        if (stateObject.value === 1) {
          this.teleportationRequestInitiated = true;
        } else {
          if (this.teleportationAllowed) {
            this.vrHelper.currentVRCamera.position.x = this.haloCenter.x;
            this.vrHelper.currentVRCamera.position.z = this.haloCenter.z;
          }
          this.teleportationRequestInitiated = false;
        }
      });
    }
  }

  // Little white circle attached to the camera
// That will act as the target to look on the floor where to teleport
  private createTargetMesh() {
    this.target = MeshBuilder.CreatePlane('targetViewVR', {});
    const advancedTexture = GUI.AdvancedDynamicTexture.CreateForMesh(this.target);
    const circle = new GUI.Ellipse();
    circle.width = '50px';
    circle.color = 'white';
    circle.thickness = 15;
    circle.height = '50px';
    advancedTexture.addControl(circle);
    this.target.parent = this.vrHelper.currentVRCamera;
    this.target.position.z = 1.1;
  }

  private createTeleportationCircles() {
    this.teleportationCircle = MeshBuilder.CreateGround('teleportationCircle', { width: 2, height: 2, subdivisions: 2 },
      this.scene);
    const advancedTexture = GUI.AdvancedDynamicTexture.CreateForMesh(this.teleportationCircle, 1024, 512);

    const circle = new GUI.Ellipse();
    circle.width = '500px';
    circle.color = 'white';
    circle.thickness = 20;
    circle.height = '500px';
    advancedTexture.addControl(circle);

    const innerTeleportationCircle = Mesh.CreateGround('innerTeleportationCircle', 2, 2, 2, this.scene);
    innerTeleportationCircle.parent = this.teleportationCircle;
    const advancedTexture2 = GUI.AdvancedDynamicTexture.CreateForMesh(innerTeleportationCircle, 1024, 512);

    const circle2 = new GUI.Ellipse();
    circle2.width = '400px';
    circle2.color = 'grey';
    circle2.thickness = 25;
    circle2.height = '400px';
    advancedTexture2.addControl(circle2);

    const animationInnerCircle = new Animation('animationInnerCircle', 'position.y', 30,
      Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);

    const keys = [];
    keys.push({
      frame: 0,
      value: 0.01
    });
    keys.push({
      frame: 30,
      value: 0.2
    });
    keys.push({
      frame: 60,
      value: 0.01
    });

    animationInnerCircle.setKeys(keys);

    const easingFunction = new SineEase();
    easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
    animationInnerCircle.setEasingFunction(easingFunction);

    innerTeleportationCircle.animations = [];
    innerTeleportationCircle.animations.push(animationInnerCircle);

    this.scene.beginAnimation(innerTeleportationCircle, 0, 60, true);
    this.teleportationCircle.isVisible = false;
    // this.teleportationCircle.getChildren()[0].isVisible = false;
  }

  /**
   * Returns a list of possible positions for this brick.
   * @param brick the brick
   */
  public possiblePositionsFor(brick: Brick): Array<[number, number, number]> {
    return super.possiblePositionsFor(brick);
  }

  /**
   * Put a brick on the bottom of the world.
   * A brick can be connected to every position (within the world boundaries) at the bottom of the world.
   * @param brick the brick
   * @param position the position for the brick, i.e. [x,y,z]
   */
  public putBrick(brick: Brick, position: [number, number, number]): boolean {
    if (super.putBrick(brick, position)) {
      // window.console.debug(`Brick:`, brick);
      const babylonBrick: BabylonJsBrick = BabylonJsBrick.fromBrick(brick);
      // window.console.debug(`BabylonBrick:`, babylonBrick);
      babylonBrick.draw(this.scene);
      return true;
    }
  }

  /**
   * Removes a brick from this world.
   * @param brick the brick to be removed.
   */
  public remove(brick: BabylonJsBrick) {
    super.remove(brick);
    brick.undraw(this.scene);
  }
}
