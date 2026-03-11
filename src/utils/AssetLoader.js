// src/utils/AssetLoader.js
export class AssetLoader extends THREE.LoadingManager {
  constructor() {
    super();
    this.cache = new Map(); // url → THREE.Group (or Texture)
  }

  /** Carga un GLTF y lo cachea */
  async load(url) {
    if (this.cache.has(url)) return this.cache.get(url);
    const loader = new THREE.GLTFLoader();
    const scene = await new Promise((res, rej) =>
      loader.load(url, g => res(g.scene), undefined, e => rej(e))
    );
    this.cache.set(url, scene);
    return scene;
  }

  /** Carga una textura y la marca como sRGB */
  loadTexture(url) {
    const tex = new THREE.TextureLoader().load(url);
    tex.encoding = THREE.sRGBEncoding;
    return tex;
  }
}
