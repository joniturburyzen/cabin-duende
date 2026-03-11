// src/scene/DuendeController.js
export class DuendeController {
  /**
   * @param {THREE.Group} mesh   – visual representation
   * @param {CANNON.World} world – physics world
   */
  constructor(mesh, world) {
    this.mesh = mesh;
    this.body = mesh.userData.physicsBody;
    this.world = world;

    // ----- captura de teclas -----
    this.keys = { w: false, a: false, s: false, d: false, Space: false };
    window.addEventListener('keydown', e => {
      const k = e.key.toLowerCase();
      if (k in this.keys) this.keys[k] = true;
    });
    window.addEventListener('keyup', e => {
      const k = e.key.toLowerCase();
      if (k in this.keys) this.keys[k] = false;
    });

    // ----- este método será llamado por SceneManager cada frame -----
    this._step = () => this._stepPhysics();
  }

  _stepPhysics() {
    const cam = window._sceneMgr?.renderer?.camera;
    if (!cam) return;

    // Dirección basada en la cámara (para que “frente” sea lo que ves)
    const forward = new THREE.Vector3();
    cam.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(cam.up, forward);
    right.normalize();

    // WASD movimiento
    let move = new CANNON.Vec3(0, 0, 0);
    if (this.keys.w) move = move.add(forward);
    if (this.keys.s) move = move.sub(forward);
    if (this.keys.a) move = move.sub(right);
    if (this.keys.d) move = move.add(right);
    move.normalize();

    const accel = 25, maxSpeed = 6;
    const impulse = move.scale(accel * 0.016);
    this.body.velocity.vadd(impulse);
    if (this.body.velocity.length() > maxSpeed)
      this.body.velocity.scale(maxSpeed / this.body.velocity.length());

    // Salto (Space)
    if (this.keys.Space && this._grounded()) {
      this.body.velocity.y += 12;
    }

    // Fricción
    this.body.velocity.scale(Math.pow(1 - 30 * 0.016, 1));

    // Sincronizar visual con el cuerpo
    this.mesh.position.copy(this.body.position);
    this.mesh.quaternion.copy(this.body.quaternion);
  }

  /** Ray‑cast down to know if we stand on something */
  _grounded() {
    const from = new THREE.Vector3(this.body.position.x, this.body.position.y + 0.1, this.body.position.z);
    const to   = new THREE.Vector3(this.body.position.x, -0.5, this.body.position.z);
    const ray  = new CANNON.Ray(from, to.sub(from));
    const hit  = this.world.rayTest(ray);
    return hit && hit.fraction <= 1;
  }
}
