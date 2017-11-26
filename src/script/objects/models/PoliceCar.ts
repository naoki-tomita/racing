import { Model } from "../Model";
import { Vector4 } from "three";

export class PoliceCar extends Model {
  async init() {
    this.object = await this.loadModel("./objects/police_car/");
    this.direction = new Vector4(1, 0, 0, 0);
    this.object.scale.set(7, 7, 7);
    this.object.position.set(0, 10, 0);
  }
}