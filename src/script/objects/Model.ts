import { Vector4, MTLLoader, MaterialCreator, OBJLoader, Group } from "three";
import { GameObject } from "./GameObject";

export abstract class Model extends GameObject {
  direction: Vector4;

  abstract async init(): Promise<void>;

  async loadModel(modelPath: string) {
    const material = await this.loadMtl(modelPath);
    const object = await this.loadObj(modelPath, material);
    return object;
  }

  async loadMtl(modelPath: string) {
    const loader = new MTLLoader();
    loader.setPath(modelPath);
    return new Promise<MaterialCreator>(resolve => {
      loader.load("metadata.mtl", (material: MaterialCreator) => {
        material.preload();
        resolve(material);
      });
    });
  }

  async loadObj(modelPath: string, material: MaterialCreator) {
    const loader = new OBJLoader();
    loader.setMaterials(material);
    loader.setPath(modelPath);
    return new Promise<Group>(resolve => {
      loader.load("object.obj", object => {
        resolve(object);
      });
    });
  }
}