// src/scene/Room.js
import { CANNON } from '../../cannon-es';   // <-- import from the global variable

export class Room {
  /**
   * @param {THREE.Scene} scene
   * @param {CANNON.World} world
   */
  constructor(scene, world) {
    /** @type {THREE.Group} */
    this.root = new THREE.Group();
    scene.add(this.root);
    this.scene = scene;
    this.world = world;

    // ---- floor --------------------------------------------------
    const floorGeom = new THREE.PlaneGeometry(20, 20);
    const floorMat  = new THREE.MeshStandardMaterial({ color: 0x5d4037 });
    const floor = new THREE.Mesh(floorGeom, floorMat);
    floor.rotation.set(-Math.PI / 2, 0, 0);
    floor.receiveShadow = true;
    this.root.add(floor);
    this._staticCollider(floor);

    // ---- simple decorative objects (door, lever, toy) ----------
    this._addDecoration();          // crea la puerta, la palanca y el juguete
    // ---- magical lighting ---------------------------------------
    this._addLighting();
  }

  /** Crea un cuerpo estático de Cannon a partir del mesh */
  _staticCollider(mesh) {
    const bbox = new THREE.Box3().setFromObject(mesh);
    const size = new THREE.Vector3(); bbox.getSize(size);
    const half = size.clone().multiplyScalar(0.5);
    const shape = new CANNON.Box(new CANNON.Vec3(half.x, half.y, half.z));
    const body = new CANNON.Body({ mass: 0, shape });
    body.position.copy(mesh.position);
    body.quaternion.copy(mesh.quaternion);
    this.world.addBody(body);
    mesh.userData.physicsBody = body;
  }

  /** Añade puerta, palanca y juguete con nombres que later reconocerá el scanner */
  _addDecoration() {
    // ---- Door (named "door") ------------------------------------
    const doorGeom = new THREE.BoxGeometry(0.8, 2.2, 0.1);
    const doorMat  = new THREE.MeshStandardMaterial({ color: 0x8b5e3c });
    const door = new THREE.Mesh(doorGeom, doorMat);
    door.position.set(-3, 1, 2);
    door.name = 'door';
    this.root.add(door);
    this._staticCollider(door);

    // ---- Lever (named "lever") ---------------------------------
    const leverGeom = new THREE.BoxGeometry(0.2, 1, 0.5);
    const leverMat  = new THREE.MeshStandardMaterial({ color: 0x795548 });
    const lever = new THREE.Mesh(leverGeom, leverMat);
    lever.position.set(0, 1.2, -2);
    lever.name = 'lever';
    this.root.add(lever);
    this._staticCollider(lever);

    // ---- Toy (named "toy") -------------------------------------
    const toyGeom = new THREE.SphereGeometry(0.5, 12, 12);
    const toyMat  = new THREE.MeshStandardMaterial({ color: 0xffeb3b });
    const toy = new THREE.Mesh(toyGeom, toyMat);
    toy.position.set(2, 0.5, 0);
    toy.name = 'toy';
    this.root.add(toy);
  }

  /** Luz cálida + spot‑light que simula un leve “glow” */
  _addLighting() {
    const amb = new THREE.AmbientLight(0xffb86c, 1.5);
    this.root.add(amb);

    const point = new THREE.PointLight(0xffd8a6, 1.2, 12);
    point.position.set(0, 3, 0);
    this.root.add(point);

    const spot = new THREE.SpotLight(0xffb86c, 2, 15, 30, 0.4, 2);
    spot.position.set(0, 2.5, 2);
    spot.angle = Math.PI / 6;
    spot.penumbra = 0.6;
    spot.castShadow = true;
    spot.shadow.mapSize.set(1024, 1024);
    this.root.add(spot);

    // Que todos los meshes puedan lanzar y recibir sombras
    this.root.traverse(o => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
  }
}
