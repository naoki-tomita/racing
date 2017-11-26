import { Scene, Camera, Renderer, PerspectiveCamera, Vector3, WebGLRenderer } from "three";
import { GameObject } from "../objects/GameObject";

export class Game {
  scene: Scene;
  camera: Camera;
  renderer: Renderer;
  objects: GameObject[] = [];
  procs: Array<() => void> = [];
  constructor() {
    this.scene = new Scene();
    this.camera = new PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 5000);
    this.camera.position.set(100, 100, 100);
    this.camera.lookAt(new Vector3(0, 0, 0));
    this.renderer = this.initRenderer();
    this.addProc(() => {
      this.render();
    });
  }

  initRenderer(): Renderer {
    const renderer = new WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    return renderer;
  }

  addGameObject(obj: GameObject) {
    this.objects.push(obj);
    this.scene.add(obj.object);
  }

  addProc(proc: () => void) {
    this.procs.push(proc);
  }

  start() {
    this.loop();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  loop() {
    requestAnimationFrame(this.loop.bind(this));
    this.procs.forEach(p => p());
  }
}