
type KeyName = "left" | "up" | "right" | "down";
export class KeyProcessor {
  keyMap: { [keyCode: number]: Array<() => void> } = {};
  keyPressed: { [keyCode: number]: boolean } = {};
  processing: boolean = false;
  keyTable: { [key in KeyName]: number } = {
    left: 37,
    up: 38,
    right: 39,
    down: 40
  };
  constructor() {
    document.addEventListener("keydown", this.onKeyDown.bind(this));
    document.addEventListener("keyup", this.onKeyDown.bind(this));
  }
  start() {
    this.processing = true;
  }
  stop() {
    this.processing = false;
  }
  on(key: KeyName, callback: () => void) {
    const keyCode = this.keyTable[key];
    this.keyMap[this.keyTable[key]] = this.keyMap[this.keyTable[key]] || [];
    this.keyMap[keyCode].push(callback);
  }
  tick() {
    if (!this.processing) {
      return;
    }
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