// src/engine/Engine.js
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { Renderer } from './Renderer.js';

export class Engine {
  constructor(canvas, opts = {}) {
    this.canvas = canvas;
    this.renderer = new Renderer(canvas);
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(opts.backgroundColor ?? 0x111111);
    this.renderer.scene = this.scene;

    this.physicsWorld = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.81, 0),
    });
    this.physicsWorld.broadphase = new CANNON.NaiveBroadphase();
    this.physicsWorld.solver.iterations = 12;

    this.camera = this.renderer.camera;
  }

  getRenderer() { return this.renderer; }
  getPhysicsWorld() { return this.physicsWorld; }
}
