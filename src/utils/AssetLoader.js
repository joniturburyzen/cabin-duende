// src/utils/AssetLoader.js
export class AssetLoader extends THREE.LoadingManager {
  constructor() {
    super();
    this.cache = new Map(); // url → THREE.Group (or Texture)
  }

  /**
   * Load a GLTF (or any other URL) and cache the resulting scene.
   * @param {string} url
   * @returns {Promise<THREE.Group>}
   */
  async load(url) {
    if (this.cache.has(url)) return this.cache.get(url);
    const loader = new THREE.GLTFLoader();
    const scene = await new Promise((resolve, reject) =>
      loader.load(
        url,
        g => resolve(g.scene),
        undefined,
        err => reject(err)
      )
    );
    this.cache.set(url, scene);
    return scene;
  }

  /**
   * Load a texture and force sRGB encoding.
   * @param {string} url
   * @returns {THREE.Texture}
   */
  loadTexture(url) {
    const tex = new THREE.TextureLoader().load(url);
    tex.encoding = THREE.sRGBEncoding;
    return tex;
  }
}
