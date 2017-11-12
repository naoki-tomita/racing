import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  Mesh,
  Vector3,
  AmbientLight,
  MeshPhysicalMaterial,
  HemisphereLight,
  DirectionalLight,
  MTLLoader,
  OBJLoader,
  MaterialCreator,
  Group,
  Euler,
  PlaneGeometry,
  DirectionalLightHelper,
  Object3D,
  Color,
  Fog,
  Quaternion,
  ArrowHelper,
  Vector4,
  SpotLight
} from "three";

export class App {
  async start() {
    const scene = new Scene();
    scene.background = new Color().setHSL(0.6, 0, 1);
    scene.fog = new Fog(scene.background, 1, 5000);

    const camera = new PerspectiveCamera(
      30,
      window.innerWidth / window.innerHeight,
      1,
      5000
    );
    const renderer = new WebGLRenderer();
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.renderReverseSided = false;

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const policeCar = await loadModel("./objects/police_car/");
    policeCar.castShadow = true;
    policeCar.position.y = 7;
    policeCar.rotation.y = Math.PI / 2;
    policeCar.scale.set(7, 7, 7);
    const policeForward = new Vector4(1, 0, 0, 0);

    const casino = await loadModel("./objects/casino/");
    casino.receiveShadow = true;

    const dirLight = new DirectionalLight();
    dirLight.position.set(20, 20, 20);
    dirLight.target.position.set(policeCar.position.x, policeCar.position.y, policeCar.position.z);

    scene.add(policeCar);
    scene.add(casino);
    scene.add(dirLight);
    scene.add(dirLight.target);

    camera.position.set(100, 100, 200);
    camera.lookAt(policeCar.position);

    const pressed: { [index: number]: boolean } = {};
    function animate() {
      requestAnimationFrame(animate);

      let forward = 0;
      if (pressed[37]) {
        const q = new Quaternion();
        const axis = new Vector3(0, 1, 0);
        q.setFromAxisAngle(axis, 0.1);
        policeCar.quaternion.multiply(q);
      }
      if (pressed[38]) {
        forward = 1;
      }
      if (pressed[39]) {
        const q = new Quaternion();
        const axis = new Vector3(0, 1, 0);
        q.setFromAxisAngle(axis, -0.1);
        policeCar.quaternion.multiply(q);
      }
      if (pressed[40]) {
        forward = -1;
      }
      const f = policeForward.clone().applyMatrix4(policeCar.matrix);
      const v = new Vector3(f.x, f.y, f.z).normalize();
      policeCar.position.add(
        new Vector3(v.x * forward, v.y * forward, v.z * forward)
      );
      dirLight.target.position.set(policeCar.position.x, policeCar.position.y, policeCar.position.z);
      

      renderer.render(scene, camera);
    }
    document.addEventListener("keyup", e => {
      pressed[e.keyCode] = false;
    });

    document.addEventListener("keydown", e => {
      pressed[e.keyCode] = true;
    });

    animate();
  }
}

async function loadModel(modelPath: string) {
  const material = await loadMtl(modelPath);
  const object = await loadObj(modelPath, material);
  return object;
}

async function loadMtl(modelPath: string) {
  const loader = new MTLLoader();
  loader.setPath(modelPath);
  return new Promise<MaterialCreator>(resolve => {
    loader.load("metadata.mtl", (material: MaterialCreator) => {
      material.preload();
      resolve(material);
    });
  });
}

async function loadObj(modelPath: string, material: MaterialCreator) {
  const loader = new OBJLoader();
  loader.setMaterials(material);
  loader.setPath(modelPath);
  return new Promise<Group>(resolve => {
    loader.load("object.obj", object => {
      resolve(object);
    });
  });
}

class KeyProcessor {
  keyMap: { [keyCode: number]: Array<() => void> } = {};
  keyPressed: { [keyCode: number]: boolean } = {};
  processing: boolean = false;
  start() {
    document.addEventListener("keydown", this.onKeyDown.bind(this));
    document.addEventListener("keyup", this.onKeyDown.bind(this));
    this.processing = true;
  }
  stop() {
    this.processing = false;
  }
  addKeyListener(keyCode: number, callback: () => void) {
    this.keyMap[keyCode] = this.keyMap[keyCode] || [];
    this.keyMap[keyCode].push(callback);
  }
  tick() {
    if (!this.processing) { return; }
    for (const k in this.keyPressed) {
      k && this.keyMap[k] && this.keyMap[k].forEach(cb => cb());
    }
  }
  private onKeyDown(e: KeyboardEvent) {
    this.keyPressed[e.keyCode] = true;
  }
  private onKeyUp(e: KeyboardEvent) {
    this.keyPressed[e.keyCode] = false;
  }
}