import { Model } from "../objects/Model";
import { PoliceCar } from "../objects/models/PoliceCar";
import { Casino } from "../objects/models/Casino";
import { Light } from "../objects/Light";
import { Game } from "./Game";

export class App {
  async start() {
    const policeCar = new PoliceCar();
    const casino = new Casino();
    await pararellModelLoader(policeCar, casino);
    const light = new Light();
    const game = new Game();
    game.addGameObject(policeCar);
    game.addGameObject(casino);
    game.addGameObject(light);

    game.addProc(() => {
      const rc = new Raycaster(policeCar.object.position, new Vector3(0, -1, 0));
      const c = rc.intersectObject(casino.object, true);
      console.log(c.length);
      if (c.length === 0) {
        policeCar.object.position.y += 0.1;
      } else {
        if (!c.some(o => o.distance === 0)) {
          policeCar.object.position.y -= 0.1;
        }
      }
    });

    game.start();
  }
}

async function pararellModelLoader(...obj: Model[]): Promise<void> {
  await Promise.all(obj.map(o => o.init()));
}
