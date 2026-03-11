// src/engine/Engine.js
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { Renderer } from './Renderer.js';
import { SceneManager } from '../scene/SceneManager.js';

// ---------------------------------------------------------------
// Engine – crea el renderer, el mundo de física y el bucle principal
// ---------------------------------------------------------------
export class Engine {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {Object} [opts] {antialias:true, backgroundColor:0x111111}
   */
  constructor(canvas, opts = {}) {
    /** @type {HTMLCanvasElement} */
    this.canvas = canvas;

    /** @type {THREE.WebGLRenderer} */
    this.renderer = new Renderer(canvas, opts);
    /** @type {THREE.Scene} */
    this.scene = new THREE.Scene();
    this.scene.background = opts.backgroundColor ?? 0x111111;

    /** @type {CANNON.World} */
    this.physicsWorld = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.81, 0),
    });
    this.physicsWorld.broadphase = new CANNON.NaiveBroadphase();
    this.physicsWorld.solver.iterations = 12;

    /** @type {SceneManager} */
    this.sceneMgr = new SceneManager(this.scene, this.physicsWorld, this.renderer);

    /** @type {THREE.PerspectiveCamera} */
    this.camera = this.renderer.camera;
    this.camera.fov = 90;
    this.camera.aspect = this.renderer.width / this.renderer.height;
    this.camera.updateProjectionMatrix();

    this._loop();
  }

  /** Expose helpers */
  getRenderer() { return this.renderer; }
  getPhysicsWorld() { return this.physicsWorld; }

  /** Fixed‑step animation loop (≈ 60 FPS) */
  _loop() {
    const dt = 1 / 60;
    const step = () => {
      this.physicsWorld.step(dt);
      this.sceneMgr.update();
      this.renderer.render();
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
}
