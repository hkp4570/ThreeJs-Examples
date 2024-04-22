<template>
  <canvas id="mainCanvas"></canvas>
</template>

<script>
import * as THREE from 'three';
import {OrbitControls} from "three/addons/controls/OrbitControls.js";

let scene, camera, renderer, controls;
export default {
  mounted() {
    this.init();
    this.animate();
  },
  methods: {
    init() {
      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 100);

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: document.getElementById('mainCanvas')
      })
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);

      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.enableDamping = true;
      controls.rotateSpeed = -0.25;

      const textures = this.getTexturesFromAtlasFile('/texture/sun_temple_stripe.jpg', 6);
      console.log(textures, 'textures')
      const materials = [];
      for (let i = 0; i < 6; i++) {
        materials.push(new THREE.MeshBasicMaterial({map: textures[i]}));
      }
      const skybox = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), materials);
      skybox.geometry.scale(1, 1, -1);
      scene.add(skybox);

      window.addEventListener('resize', this.onResize);

    },
    getTexturesFromAtlasFile(atlasImgUrl, tilesNum) {
      const textures = [];
      for (let i = 0; i < tilesNum; i++) {
        textures[i] = new THREE.Texture();
      }
      new THREE.ImageLoader().load(atlasImgUrl,  (image) => {
        let canvas, context;
        const tileWidth = image.height;
        for (let i = 0; i < textures.length; i++) {
          canvas = document.createElement('canvas');
          context = canvas.getContext('2d');
          canvas.width = tileWidth;
          canvas.height = tileWidth;
          context.drawImage(image, tileWidth * i, 0, tileWidth, tileWidth, 0, 0, tileWidth, tileWidth);
          textures[i].colorSpace = THREE.SRGBColorSpace;
          textures[i].image = canvas;
          textures[i].needsUpdate = true;
        }
      })
      return textures;
    },
    onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    },
    animate() {
      requestAnimationFrame(this.animate);
      controls.update();
      renderer.render(scene, camera);
    }
  }
}
</script>

<style scoped>

</style>