// src/engine/Renderer.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class Renderer {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {Engine} engine
   */
  constructor(canvas, engine) {
    /** @type {THREE.WebGLRenderer} */
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESCWorkerToneMapping;

    /** @type {THREE.PerspectiveCamera} */
    this.camera = new THREE.PerspectiveCamera(
      90,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 1.6, 3);
    this.camera.near = 0.1;
    this.camera.far = 100;
    this.camera.updateProjectionMatrix();

    /** @type {OrbitControls} – first‑person navigation */
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enablePan = false;
    this.controls.minDistance = 1.2;
    this.controls.maxDistance = 15;
    this.controls.update();

    window.addEventListener('resize', () => this._onResize());
  }

  _onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  /** Called each frame from the Engine loop */
  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
