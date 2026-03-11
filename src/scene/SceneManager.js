// src/scene/SceneManager.js
import { Room } from './Room.js';
import { Duende } from './Duende.js';
import { InteractiveObjects } from './InteractiveObjects.js';

export class SceneManager {
  /**
   * @param {THREE.Scene} scene
   * @param {CANNON.World} physicsWorld
   * @param {THREE.WebGLRenderer} renderer
   */
  constructor(scene, physicsWorld, renderer) {
    this.scene   = scene;
    this.world   = physicsWorld;
    this.renderer = renderer;
    /** @type {Room|null} */
    this.room   = null;
    /** @type {Duende|null} */
    this.duende = null;
    /** @type {InteractiveObjects|null} */
    this.interactive = null;
  }

  /** Build the whole cabin, lights, duende and interactive objects */
  async init() {
    // ---- room (geometry + colliders + lighting) -----------------
    this.room = new Room(this.scene, this.world);
    this.scene.add(this.room.root);                // whole cabin is a child

    // ---- interactive stuff (doors, levers, toys) ----------------
    this.interactive = new InteractiveObjects(this.scene, this.world);
    this.interactive.addTo(this.room.root);

    // ---- duende (procedural mesh + controller) -----------------
    const duendeMesh = await this._createProceduralDuende();
    this.duende = new Duende(this.scene, this.world, duendeMesh);
    this.scene.add(this.duende.mesh);

    // ---- camera follows duende (soft damping) -----------------
    this._followCamera();

    // expose for debugging shortcuts in index.html
    window._sceneMgr = this;
  }

  /** Camera that smoothly追踪 el duende */
  _followCamera() {
    const cm = this.renderer.controls;
    const duende = this.duende;
    const offset = new THREE.Vector3(0, 1.6, 3);
    const original = cm.update;
    cm.update = () => {
      const target = duende.mesh.position.clone().add(offset);
      const cur = cm.camera.position.clone();
      cur.lerp(target, 0.1);
      cm.camera.position.copy(cur);
      original.call(cm);
    };
  }

  /** Called each frame after the physics step */
  update() {
    if (this.interactive) this.interactive.update();
    if (this.duende)   this.duende.update();
  }
}
