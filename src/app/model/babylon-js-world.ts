import {World} from './world';
import * as BABYLON from 'babylonjs';
import {BabylonJsBrick} from './babylon-js-brick';
import {Brick} from './brick';
import Engine = BABYLON.Engine;
import Scene = BABYLON.Scene;
import Vector3 = BABYLON.Vector3;
import HemisphericLight = BABYLON.HemisphericLight;
import Mesh = BABYLON.Mesh;
import Color3 = BABYLON.Color3;
import StandardMaterial = BABYLON.StandardMaterial;
import MeshBuilder = BABYLON.MeshBuilder;
import AbstractMesh = BABYLON.AbstractMesh;
import UniversalCamera = BABYLON.UniversalCamera;

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
    this.scene = new Scene(this.engine, {
      useMaterialMeshMap: true,
      useGeometryUniqueIdsMap: true,
      useClonedMeshMap: true
    });
    // Create a basic light, aiming 0, 1, 0 - meaning, to the sky TODO play around for world
    const light1 = new HemisphericLight('mainLight', new Vector3(0, 20, 0), this.scene);
    // const light2 = new PointLight('secondLight', new Vector3(0, 6, 0), this.scene);

    // this.drawAxis(10);
    if (drawBoundaries) {
        BabylonJsWorld.drawBoundaries(this.dimensions, '#c2c2c2', this.scene);
    }

    const groundMesh = this.drawNavigationGroundMesh(new Vector3(0, 0, -1));

    this.setupXrExperience([groundMesh, ]);

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
    window.addEventListener('resize', () => {
      this.engine.resize();
    });
  }

  private readonly navMeshColor = '#dd004f';
  private readonly navMeshSize = 1;
  private readonly initialCameraPosition = new Vector3(this.dimensions[0] * 0.5, this.dimensions[1] * 0.5, -this.dimensions[2] * 1.5);

  private readonly canvas: HTMLCanvasElement;
  private readonly scene: Scene;
  private readonly engine: Engine;

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

  private setupXrExperience(floorMeshes: Array<AbstractMesh>) {

    const camera = new UniversalCamera('WebVRCamera', this.initialCameraPosition, this.scene);
    camera.attachControl(this.canvas);

    this.scene.createDefaultXRExperienceAsync({
      floorMeshes,
      outputCanvasOptions: {
        canvasOptions: {
          multiview: true
        }
      }
    }).then((xrHelper) => {
      window.console.info('XR functional!');
      window.console.info('Enabled features: ', xrHelper.baseExperience.featuresManager.getEnabledFeatures());

      xrHelper.pointerSelection.raySelectionPredicate = (mesh) => {
        return mesh.name.indexOf('navPosition') !== -1;
      };

      // Will be triggered every time a new reference space was applied to the current scene. This is a good way of finding out
      // if the user transported to a new location.
      xrHelper.baseExperience.sessionManager.onXRReferenceSpaceChanged.add((evData, evSpace) => {
        window.console.debug('onXRReferenceSpaceChanged(evData, evSpace):', evData, evSpace);
      });

      xrHelper.input.onControllerAddedObservable.add((inputSource) => {
        window.console.debug('onControllerAddedObservable(inputSource):');
        window.console.debug(inputSource);

        inputSource.onMotionControllerInitObservable.add((motionController) => {
          motionController.onModelLoadedObservable.add((model) => {
            window.console.debug('onModelLoadedObservable(model):');
            window.console.debug(model);
          });
        });

        // seems this does not exist anymore
        // xrHelper.baseExperience.sessionManager.session.onselect = (inputSource) => {
        //   window.console.debug('session.onselect(inputSource): ', inputSource);
        //   // Note that this gets triggered by any selection, including those
        //   // made with motion-controller buttons. If those buttons are
        //   // dealt with elsewhere, you'll need top check for gaze here. Otherwise,
        //   // the actOnButton function will get called twice.
        //
        //   if (inputSource.inputSource.targetRayMode.indexOf('gaze') !== -1) {
        //     // Note that really inputSource.inputSource.targetRayMode === "gaze". I'm
        //     // being a bit paranoid here, just in case something changes in the future.
        //     // I figure regardless of future changes, it should still have the substring
        //     // "gaze" in it.
        //     window.console.info('Gaze selection recognized');
        //   }
        // };
      });
    }, (error) => {
      // no xr support
      window.console.error('No XR support!', error);
    });
  }

  private drawNavigationPositions() {
    const groundMesh = this.drawNavigationGroundMesh(Vector3.Zero());

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

    navPositions.push(this.drawNavigationPointMesh([this.dimensions[0] / 2, this.dimensions[1] / 2, -margin * 2]));
    navPositions.push(this.drawNavigationPointMesh([this.dimensions[0] / 2, this.dimensions[1] / 2,
      this.dimensions[2] + margin * 2]));
    navPositions.push(this.drawNavigationPointMesh([-margin * 2, this.dimensions[1] / 2, this.dimensions[2] / 2]));
    navPositions.push(this.drawNavigationPointMesh([this.dimensions[0] + margin * 2, this.dimensions[1] / 2,
      this.dimensions[2] / 2]));
    navPositions.push(this.drawNavigationPointMesh([this.dimensions[0] / 2, -margin * 2, this.dimensions[2] / 2]));
    navPositions.push(this.drawNavigationPointMesh([this.dimensions[0] / 2, this.dimensions[1] + margin * 2,
      this.dimensions[2] / 2]));
    return navPositions;
  }

  /**
   * Draws a ground panel mesh.
   */
  private drawNavigationGroundMesh(position: Vector3): Mesh {
    const groundMargin = [10, 10];
    const groundSize = [this.dimensions[0] + groundMargin[0] * 2, this.dimensions[1] + groundMargin[1] * 2];
    const ground = MeshBuilder.CreateGround(
      'navPosition',
      {width: groundSize[0], height: groundSize[1]},
      this.scene);
    ground.material = new StandardMaterial('ground_material', this.scene);
    (ground.material as StandardMaterial).diffuseColor = Color3.FromHexString(this.navMeshColor);
    ground.position.x = position.x + groundSize[0] / 2 - groundMargin[0];
    ground.position.z = position.y + groundSize[0] / 2 - groundMargin[1];
    ground.position.y = position.z;
    return ground;
  }

  /**
   * Draws boxes to which a vr user can teleport.
   * @param position the scene
   */
  private drawNavigationPointMesh(position: [number, number, number]): Mesh {
    const mesh = MeshBuilder.CreateBox(
      'navPosition',
      {width: this.navMeshSize, depth: this.navMeshSize, height: this.navMeshSize}, this.scene);
    mesh.material =  new StandardMaterial('brick_material', this.scene);
    (mesh.material as StandardMaterial).diffuseColor = Color3.FromHexString(this.navMeshColor);
    mesh.position.x = position[0];
    mesh.position.y = position[1];
    mesh.position.z = position[2];
    return mesh;
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
