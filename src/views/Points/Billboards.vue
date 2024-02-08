<template>
  <canvas id="mainCanvas"></canvas>
</template>
<script>
import * as THREE from 'three';
import GUI from 'lil-gui';

let camera, scene, renderer, material;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
export default {
  mounted() {
    this.init();
    this.animate();
  },
  methods: {
    init() {
      scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x000000, 0.001);

      camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 2, 2000);
      camera.position.z = 1000;

      renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('mainCanvas')
      });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);

      const geometry = new THREE.BufferGeometry();
      const vertices = [];
      const sprite = new THREE.TextureLoader().load('texture/disc.png');
      sprite.colorSpace = THREE.SRGBColorSpace;

      for (let i = 0; i < 10000; i++) {
        const x = 2000 * Math.random() - 1000;
        const y = 2000 * Math.random() - 1000;
        const z = 2000 * Math.random() - 1000;
        vertices.push(x, y, z);
      }
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

      material = new THREE.PointsMaterial({
        size: 35,
        sizeAttenuation: true,
        map: sprite,
        alphaTest: 0.5,
        transparent: true,
      });
      material.color.setHSL(1.0, 0.3, 0.7, THREE.SRGBColorSpace);

      const particles = new THREE.Points(geometry, material);
      scene.add(particles);

      const gui = new GUI();
      gui.add(material, 'sizeAttenuation').onChange(function () {
        material.needsUpdate = true;
      })
      gui.open();

      document.body.style.touchAction = 'none';
      document.body.addEventListener('pointermove', this.onPointerMove);

      window.addEventListener('resize', this.onWindowResize);
    },
    onWindowResize() {
      windowHalfY = window.innerWidth / 2;
      windowHalfY = window.innerHeight / 2;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
    },
    onPointerMove(event) {
      if (event.isPrimary === false) return;
      mouseX = event.clientX - windowHalfX;
      mouseY = event.clientY - windowHalfY;
    },
    animate() {
      requestAnimationFrame(this.animate);
      this.render();
    },
    render() {
      const time = Date.now() * 0.00005;

      camera.position.x += (mouseX - camera.position.x) * 0.05;
      camera.position.y += (mouseY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      const h = (360 * (1.0 + time) % 360) / 360;
      material.color.setHSL(h, 0.5, 0.5);
      renderer.render(scene, camera);
    }
  }
}
</script>

<style scoped>
</style>