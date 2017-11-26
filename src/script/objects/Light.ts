import { HemisphereLight } from "three";
import { GameObject } from "./GameObject";

export class Light extends GameObject {
  constructor() {
    super();
    this.object = new HemisphereLight();
  }
} 