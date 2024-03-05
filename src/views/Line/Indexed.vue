<template>
  <canvas id="mainCanvas"></canvas>
</template>

<script>
import * as THREE from 'three';
//  TODO:待完成
let renderer, scene, camera;
export default {
  mounted() {
    this.init();
    this.animate();
  },
  methods: {
    init() {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(27, window.innerWidth / window.innerHeight, 1, 10000);
      camera.position.z = 9000;
      renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('mainCanvas')
      })
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);

      window.addEventListener('resize', this.onWindowResize)
    },
    onWindowResize() {
      camera.aspect = (window.innerWidth / window.innerHeight);
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    },
    animate() {
      renderer.render(scene, camera);
    }
  }
}

</script>