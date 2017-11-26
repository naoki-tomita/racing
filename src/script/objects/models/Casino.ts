import { Model } from "../Model";

export class Casino extends Model {
  async init() {
    this.object = await this.loadModel("./objects/casino/");
  }
}