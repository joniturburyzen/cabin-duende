// src/scene/ToyInteraction.js
export class ToyInteraction {
  /**
   * @param {Toy} toyInstance
   * @param {CANNON.World} world
   */
  constructor(toy, world) {
    this.toy = toy;
    this.world = world;
  }

  /** Llamado por fuera (por ejemplo, al pulsar "P") */
  play() {
    this.toy.interactWithDuende();
  }
}
