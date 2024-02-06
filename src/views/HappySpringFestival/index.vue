<template>
  <canvas id="mainCanvas"></canvas>
</template>

<script>
import * as THREE from 'three';
import * as TWEEN from "@tweenjs/tween.js";
import {FBXLoader} from "three/addons";

let renderer, scene, camera, points;
export default {
  mounted() {
    this.init();
    this.animate();
  },
  methods: {
    init() {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(100, 0, 400);
      scene.add(camera);

      renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('mainCanvas'),
        antialias: true,
      })
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);

      const vertices = [];
      for (let i = 0; i < 30000; i++) {
        const x = THREE.MathUtils.randFloatSpread(2000);
        const y = THREE.MathUtils.randFloatSpread(2000);
        const z = THREE.MathUtils.randFloatSpread(2000);
        vertices.push(x, y, z);
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

      const star = new THREE.TextureLoader().load('img/star.png');
      const material = new THREE.PointsMaterial({size: 10, map: star});

      points = new THREE.Points(geometry, material);
      points.translateY(-100);
      scene.add(points);

      const loader = new FBXLoader();
      loader.load('/fbx/fu.fbx', function (object) {
        const startPositions = geometry.getAttribute('position');
        const destPositions = object.children[0].geometry.getAttribute('position');
        for (let i = 0; i < startPositions.count; i++) {
          const tween = new TWEEN.Tween(startPositions.array);
          const cur = i % destPositions.count;
          tween.to({
            [i * 3]: destPositions.array[cur * 3],
            [i * 3 + 1]: destPositions.array[cur * 3 + 1],
            [i * 3 + 2]: destPositions.array[cur * 3 + 2]
          }, 3000 * Math.random());
          tween.easing(TWEEN.Easing.Exponential.In);
          tween.delay(3000);

          tween.start();

          tween.onUpdate(() => {
            startPositions.needsUpdate = true;
          });
        }
      })

    },
    animate() {
      TWEEN.update();
      requestAnimationFrame(this.animate);
      points.rotation.y += 0.001;
      renderer.render(scene, camera);
    }
  }
}
</script>

<style scoped>

</style>