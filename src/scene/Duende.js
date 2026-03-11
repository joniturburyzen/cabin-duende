// src/scene/Duende.js
import * as THREE from 'three';
import { AnimationMixer } from 'three/examples/jsm/animation/AnimationMixer.js';

export class Duende {
  /**
   * @param {THREE.Scene} scene
   * @param {CANNON.World} world
   * @param {THREE.Group} root   ← mesh que contiene el cuerpo que moveremos
   */
  constructor(scene, world, root) {
    /** @type {THREE.Group} */
    this.mesh = root.clone();

    // ----- Capsule collider (física) -----
    const caps = new CANNON.Capsule(0.2, 0.5);
    const body = new CANNON.Body({ mass: 30, shape: caps });
    body.position.copy(this.mesh.position);
    body.quaternion.copy(this.mesh.quaternion);
    world.addBody(body);
    this.mesh.userData.physicsBody = body;

    // ----- Simple animation mixer (scale pulse) -----
    this.mixer = new AnimationMixer(this.mesh);
    const scaleTrack = new THREE.VectorKeyframeTrack(
      'scale',
      THREE.Vector3.zero(),
      [0, 0.08, 0.16, 0.24, 0.32, 0.4, 0.48, 0.56, 0.64, 0.72, 0.8, 0.88, 1]
    );
    const clip = new THREE.AnimationClip('', 1, [scaleTrack]);
    this.mixer.clipAction(clip).play();

    // ----- Movement controller (WASD + Space) -----
    this.controller = new DuendeController(this.mesh, world);
  }

  /** Called by SceneManager each frame */
  update() {
    if (this.mixer) this.mixer.update(0.016);
    this.controller?.update();
  }

  /** Public API – placeholder, can be used to play external clips */
  async play(name) { /* nada por ahora */ }
}
