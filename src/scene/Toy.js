// src/scene/Toy.js
export class Toy {
  /**
   * @param {THREE.Scene} scene
   * @param {CANNON.World} world
   * @param {THREE.Mesh} mesh
   */
  constructor(scene, world, mesh) {
    this.group = new THREE.Group();
    this.group.add(mesh);

    // cuerpo dinámico que permitirá que el duende lo "empuje"
    const shape = new CANNON.Sphere(0.25);
    const body = new CANNON.Body({ mass: 1, shape });
    body.position.copy(mesh.position);
    world.addBody(body);
    mesh.userData.physicsBody = body;
  }

  /** Cuando el duende "juega" con el juguete */
  interactWithDuende() {
    const imp = new CANNON.Vec3(
      (Math.random() - 0.5) * 4,
      0,
      (Math.random() - 0.5) * 4
    );
    this.body.applyImpulse(imp, this.body.position);
  }

  update() {}
}
