// src/scene/AnimatedBox.js
export class AnimatedBox {
  /**
   * @param {THREE.Mesh} mesh
   * @param {Object} opts {duration:number, axis:'x'|'y'|'z'}
   */
  constructor(mesh, opts = {}) {
    this.mesh = mesh;
    this.opts = opts;
    this.axis = opts.axis || 'x';
    this._animate();
  }

  _animate() {
    const start = this.mesh.rotation[this.axis] ?? 0;
    const end   = start + Math.PI / 2;
    const dur   = this.opts.duration ?? 400;
    const ease  = t => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
    let elapsed = 0;

    const step = now => {
      elapsed += now;
      const prog = Math.min(elapsed / dur, 1);
      const eased = ease(prog);
      this.mesh.rotation.set(0, 0, 0);
      this.mesh.rotation[this.axis] = start + (end - start) * eased;
      if (prog < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
}
