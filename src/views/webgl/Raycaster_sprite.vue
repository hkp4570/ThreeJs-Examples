<template>
  <canvas id="mainCanvas"></canvas>
</template>

<script>
import * as THREE from 'three';
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {WebGLRenderer} from "three";

let camera, scene, renderer, group;
let selectedObject = null;
let raycaster = new THREE.Raycaster();
let pointer = new THREE.Vector2();
export default {
  mounted() {
    this.init();
    this.animate();
  },
  methods: {
    init() {
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0xcccccc);

      camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
      camera.position.set(15, 15, 15);
      camera.lookAt(scene.position);

      renderer = new WebGLRenderer(({
        antialias: true,
        canvas: document.getElementById('mainCanvas')
      }))
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);

      group = new THREE.Group();
      scene.add(group);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.minDistance = 15;
      controls.maxDistance = 250;

      const sprite1 = new THREE.Sprite(new THREE.SpriteMaterial({color: '#69f'}));
      sprite1.position.set(6, 5, 5);
      sprite1.scale.set(2, 5, 1);
      group.add(sprite1);

      // 大小随相机变化
      const sprite2 = new THREE.Sprite(new THREE.SpriteMaterial({color: '#69f', sizeAttenuation: false}));
      sprite2.material.rotation = Math.PI / 3 * 4;
      sprite2.position.set(8, -2, 2);
      sprite2.center.set(0.5, 0);
      sprite2.scale.set(0.1, 0.5, 0.1);
      group.add(sprite2);

      const group2 = new THREE.Object3D();
      group2.scale.set(1, 2, 1);
      group2.position.set(-5, 0, 0);
      group.rotation.set(Math.PI / 2, 0, 0);
      group.add(group2);

      const sprite3 = new THREE.Sprite(new THREE.SpriteMaterial({color: '#69f'}));
      sprite3.position.set(0, 2, 5);
      sprite3.scale.set(10, 2, 3);
      sprite3.center.set(-0.1, 0);
      sprite3.material.rotation = Math.PI / 3;
      group2.add(sprite3);
      // group.add(sprite3);

      window.addEventListener('resize', this.onWindowResize);
      document.addEventListener('pointermove', this.onPointerMove);
    },
    onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    },
    onPointerMove(event) {
      if (selectedObject) {
        selectedObject.material.color.set('#69f');
        selectedObject = null;
      }
      pointer.x = ((event.clientX - 200) / window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);

      const intersects = raycaster.intersectObject(group, true);
      if (intersects.length > 0) {
        const res = intersects.filter(function (res) {
          return res && res.object;
        })[0];
        if (res && res.object) {
          selectedObject = res.object;
          res.object.material.color.set('#f00');
        }
      }
    },
    animate() {
      requestAnimationFrame(this.animate);
      renderer.render(scene, camera);
    }
  }
}
</script>

<style scoped>

</style>