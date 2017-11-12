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

    scene.add(policeCar);
    scene.add(casino);
    scene.add(dirLight);

    camera.position.set(100, 100, 200);
    camera.lookAt(policeCar.position);

    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }

    let forward = 0;
    let rotation = 0;
    document.addEventListener("keydown", e => {
      let forward = 0;
      if (e.keyCode === 37) {
        const q = new Quaternion();
        const axis = new Vector3(0, 1, 0);
        q.setFromAxisAngle(axis, 0.1);
        policeCar.quaternion.multiply(q);
      } else if (e.keyCode === 38) {
        forward = 1;
      } else if (e.keyCode === 39) {
        const q = new Quaternion();
        const axis = new Vector3(0, 1, 0);
        q.setFromAxisAngle(axis, -0.1);
        policeCar.quaternion.multiply(q);
      } else if (e.keyCode === 40) {
        forward = -1;
      }
      const f = policeForward.clone().applyMatrix4(policeCar.matrix);
      const v = new Vector3(f.x, f.y, f.z).normalize();
      policeCar.position.add(new Vector3(v.x * forward, v.y * forward, v.z * forward));

      // camera.lookAt(policeCar.position);
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
