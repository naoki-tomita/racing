import { Group } from "three";

export class GameObject {
  object: Group;
  setObject(objct: Group) {
    this.object = objct;
  }
}