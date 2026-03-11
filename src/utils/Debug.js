// src/utils/Debug.js
export class Debug {
  enable() {
    const script = document.createElement('script');
    script.src = 'https://mrdoob.github.io/stats.js/build/stats.min.js';
    document.body.appendChild(script);
    // después se crea <div id="stats.js"> automáticamente
  }

  /** Si quieres ver el FPS en la consola */
  log(...args) {
    if (window.location.search.includes('?debug')) console.log(...args);
  }
}
