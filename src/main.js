// src/main.js
import { Engine } from './engine/Engine.js';
import { SceneManager } from './scene/SceneManager.js';
import { AssetLoader } from './utils/AssetLoader.js';   // <-- ONLY IMPORT NEEDED

(async () => {
  // --------------------------------------------------------------
  // 0️⃣  Create the canvas + the Engine (renderer + physics)
  // --------------------------------------------------------------
  const canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  const engine = new Engine(canvas);

  // --------------------------------------------------------------
  // 1️⃣  Asset loader (only used if you later want to load external GLTF/textures)
  // --------------------------------------------------------------
  const assetLoader = new AssetLoader(); // <-- instantiate once

  // --------------------------------------------------------------
  // 2️⃣  Build the scene (room, duende, interactive objects)
  // --------------------------------------------------------------
  const manager = new SceneManager(
    engine.scene,
    engine.getPhysicsWorld(),
    engine.renderer
  );
  await manager.init();                     // builds cabin, duende, lights...

  // If you have external models you want to load later, do:
  // const cabin = await assetLoader.load('/assets/models/cabin.glb');
  // engine.scene.add(cabin);

  // --------------------------------------------------------------
  // 3️⃣  Render loop (fixed‑step physics + render)
  // --------------------------------------------------------------
  let last = performance.now();
  function animate(now) {
    const dt = (now - last) / 1000;
    last = now;
    // ---- fixed‑step physics at 60 Hz ----
    const fixedStep = 1 / 60;
    let accumulator = dt;
    while (accumulator >= fixedStep) {
      engine.getPhysicsWorld().step(fixedStep);
      accumulator -= fixedStep;
    }
    // ---- update animations / interactive objects ----
    if (window._sceneMgr) window._sceneMgr.update();
    // ---- render the frame ----
    engine.renderer.render();
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  // --------------------------------------------------------------
  // 4️⃣  Simple keyboard shortcuts (optional)
  // --------------------------------------------------------------
  window.addEventListener('keydown', e => {
    const k = e.key.toLowerCase();
    if (k === 'o') {
      const door = window._sceneMgr?.interactive?.objects?.find(o => o instanceof Door);
      if (door) door.toggle?.();
    }
    if (k === 'p') {
      const toy = window._sceneMgr?.interactive?.objects?.find(o => o instanceof Toy);
      if (toy?.interactor) toy.interactor.play?.();
    }
  });
})();
