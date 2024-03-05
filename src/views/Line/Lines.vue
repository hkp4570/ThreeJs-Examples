<template>
  <canvas id="mainCanvas"></canvas>
</template>
<script>
import * as THREE from "three";

let scene, renderer, camera;
let clock;
let line;
let t = 0;
export default {
  mounted() {
    this.init();
    this.animate();
  },
  methods: {
    init() {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(27, window.innerWidth / window.innerHeight, 1, 4000);
      camera.position.z = 2750;
      renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('mainCanvas')
      })
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);

      clock = new THREE.Clock();
      const geometry = new THREE.BufferGeometry();
      const materials = new THREE.LineBasicMaterial({vertexColors: true});

      function generateMorphTargets(geometry) {
        const data = [];
        for (let i = 0; i < 10000; i++) {
          const x = Math.random() * 800 - 800 / 2;
          const y = Math.random() * 800 - 800 / 2;
          const z = Math.random() * 800 - 800 / 2;
          data.push(x, y, z);
        }
        const morphTarget = new THREE.Float32BufferAttribute(data, 3);
        morphTarget.name = 'target1';
        geometry.morphAttributes.position = [morphTarget];
      }

      const positions = [];
      const colors = [];
      for (let i = 0; i < 10000; i++) {
        const x = Math.random() * 800 - 800 / 2;
        const y = Math.random() * 800 - 800 / 2;
        const z = Math.random() * 800 - 800 / 2;
        positions.push(x, y, z);
        colors.push((x / 800) + 0.5);
        colors.push((y / 800) + 0.5);
        colors.push((z / 800) + 0.5);
      }
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      generateMorphTargets(geometry);
      geometry.computeBoundingSphere();

      line = new THREE.Line(geometry, materials);
      scene.add(line);

      window.addEventListener('resize', this.onWindowResize)
    },
    onWindowResize() {
      camera.aspect = (window.innerWidth / window.innerHeight);
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    },
    animate() {
      requestAnimationFrame(this.animate);
      this.render();
    },
    render() {
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();
      line.rotation.x = time * 0.25;
      line.rotation.y = time * 0.5;

      t += delta * 0.5;
      line.morphTargetInfluences[ 0 ] = Math.abs( Math.sin( t ) );
      renderer.render(scene, camera);
    }
  }
}
</script>