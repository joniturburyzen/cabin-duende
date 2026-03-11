// src/scene/Lever.js
export class Lever {
  /**
   * @param {THREE.Scene} scene
   * @param {CANNON.World} world
   * @param {THREE.Mesh} mesh
   */
  constructor(scene, world, mesh) {
    this.group = new THREE.Group();
    this.group.add(mesh);

    const toggle = () => {
      const cur = this.group.rotation.x;
      const target = cur === 0 ? Math.PI / 4 : 0;
      const anim = new AnimatedBox(this.group.children[0], { duration: 400, axis: 'x' });
      anim.play();
    };

    const canvas = scene.canvas || document.querySelector('canvas');
    canvas.addEventListener('click', ev => {
      const mx = (ev.clientX / canvas.clientWidth) * 2 - 1;
      const my = -(ev.clientY / canvas.clientHeight) * 2 + 1;
      const ray = new THREE.Raycaster();
      ray.setFromCamera(new THREE.Vector2(mx, my), scene.camera);
      if (ray.intersectObject(this.group).length) toggle();
    });
  }

  update() {}
}
