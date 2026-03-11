// src/main.js
import { Engine } from './engine/Engine.js';
import { AssetLoader } from './utils/AssetLoader.js';
import { SceneManager } from './scene/SceneManager.js';

(async () => {
  // 1️⃣  canvas + engine
  const canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  const engine = new Engine(canvas);

  // 2️⃣  gestor de assets (aunque en este demo no usamos assets externos)
  const assetLoader = new AssetLoader();

  // 3️⃣  Se crean los objetos que necesitamos (cabin, duende, …)
  //    En este ejemplo los generamos proceduralmente, así que no
  //    cargamos nada. Si más adelante quieres cargar .glb, usar:
  //    const cabin = await assetLoader.load('/assets/models/cabin.glb');
  const manager = new SceneManager(engine.scene, engine.getPhysicsWorld(), engine.renderer);
  await manager.init();                     // crea la habitación, el duende, etc.
  engine.scene.add(manager.room.root);      // añadimos la habitación (ya está en el manager)

  // --------------------------------------------------------------
  // 4️⃣ BUCLE DE REPRENDER (el mismo que en la demo completa)
  // --------------------------------------------------------------
  let last = performance.now();
  function animate(now) {
    const dt = (now - last) / 1000;
    last = now;
    // paso físico fijo a 1/60
    const fixed = 1 / 60;
    let accumulator = dt;
    while (accumulator >= fixed) {
      engine.getPhysicsWorld().step(fixed);
      accumulator -= fixed;
    }
    // actualizar animaciones y lógica
    if (window._sceneMgr) window._sceneMgr.update();
    // render
    engine.renderer.render();
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  // --------------------------------------------------------------
  // 5️⃣ Atajos de teclado para probar interacción desde el
  //    navegador (O = abrir puerta, P = jugar con el juguete)
  // --------------------------------------------------------------
  window.addEventListener('keydown', e => {
    const k = e.key.toLowerCase();
    if (k === 'o') {
      const firstDoor = window._sceneMgr?.interactive?.objects?.find(o => o instanceof Door);
      if (firstDoor) firstDoor.toggle?.();
    }
    if (k === 'p') {
      const toy = window._sceneMgr?.interactive?.objects?.find(o => o instanceof Toy);
      if (toy?.interactor) toy.interactor.play?.();
    }
  });
})();
