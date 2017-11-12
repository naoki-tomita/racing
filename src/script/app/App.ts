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
  DirectionalLightHelper
} from "three";

export class App {
  async start() {
    const scene = new Scene();
    const camera = new PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 5000);
    const renderer = new WebGLRenderer();
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.renderReverseSided = false;

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const policeCar = await loadModel("./objects/police_car/");
    policeCar.castShadow = true;
    policeCar.position.y = 1;
    policeCar.scale.set(20, 20, 20);

    const plane = new Mesh(
      new PlaneGeometry(50, 50, 1, 1),
      new MeshPhysicalMaterial({ color: 0xffffff }),
    );
    plane.position.set(0, 0, 0);
    plane.rotation.x = -90 * Math.PI / 180;
    plane.receiveShadow = true;

    const dirLight = new DirectionalLight();
    dirLight.position.set(-1, 1.75, 1);
    dirLight.position.multiplyScalar(30);
    const dirLightHelper = new DirectionalLightHelper(dirLight, 10); 
    
    
    scene.add(policeCar);
    scene.add(plane);
    scene.add(dirLight);
    scene.add(dirLightHelper);
    
    camera.position.set(0, 0, 250);
    camera.lookAt(policeCar.position);

    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }

    document.addEventListener("keydown", (e) => {
      var rotate = new Euler();
      if (e.keyCode === 37) {
        policeCar.rotation.y += 0.1;
      } else if (e.keyCode === 38) {
        
      } else if (e.keyCode === 39) {
        policeCar.rotation.y -= 0.1;
      } else if (e.keyCode === 40) {
      }
      camera.lookAt(policeCar.position);
    })
    
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
    loader.load("object.obj", (object) => {
      resolve(object);
    });
  });
}