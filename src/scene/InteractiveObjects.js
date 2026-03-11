// src/scene/InteractiveObjects.js
import { Door } from './Door.js';
import { Lever } from './Lever.js';
import { Toy } from './Toy.js';

export class InteractiveObjects {
  /**
   * @param {THREE.Scene} scene
   * @param {CANNON.World} world
   */
  constructor(scene, world) {
    this.scene = scene;
    this.world = world;
    /** @type {Array} */
    this.objects = []; // door / lever / toy instances
  }

  /** Busca meshes con nombres que contengan "door", "lever" o "toy" */
  addTo(root) {
    const walk = obj => {
      if (!obj.userData.interactive) return;
      const name = obj.name.toLowerCase();
      if (/door/.test(name)) {
        const d = new Door(this.scene, this.world, obj);
        this.objects.push(d);
      } else if (/lever/.test(name)) {
        const l = new Lever(this.scene, this.world, obj);
        this.objects.push(l);
      } else if (/toy/.test(name)) {
        const t = new Toy(this.scene, this.world, obj);
        this.objects.push(t);
      } else {
        obj.children.forEach(walk);
      }
    };
    root.traverse(walk);
  }

  /** Called each frame by SceneManager */
  update() {
    this.objects.forEach(o => o.update());
  }
}
