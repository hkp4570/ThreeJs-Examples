<script>
import * as THREE from 'three';
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {RoomEnvironment, DRACOLoader, GLTFLoader} from "three/addons";

let scene, camera, renderer, controls, mixer, clock;
export default {
  mounted() {
    this.init();
    // this.animate();
  },
  methods: {
    init() {
      clock = new THREE.Clock();
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0xbfe3dd);

      camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 100);
      camera.position.set(5, 2, 8);

      renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('mainCanvas'),
        antialias: true
      });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);

      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      scene.environment = pmremGenerator.fromScene(new RoomEnvironment(renderer), 0.04).texture;

      controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(0, 0.5, 0);
      controls.update();
      controls.enablePan = false;
      controls.enableDamping = false;

      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('/libs/draco/gltf/');

      const loader = new GLTFLoader();
      loader.setDRACOLoader(dracoLoader);
      loader.load('/models/LittlestTokyo.glb', (gltf) => {
        const model = gltf.scene;
        model.position.set(1, 1, 0);
        model.scale.set(0.01, 0.01, 0.01);
        scene.add(model);

        mixer = new THREE.AnimationMixer(model);
        mixer.clipAction(gltf.animations[0]).play();

        this.animate();
      })
    },
    animate() {
      requestAnimationFrame(this.animate);
      const delta = clock.getDelta();
      mixer.update(delta);
      controls.update();
      renderer.render(scene, camera);
    }
  }
}
</script>

<template>
  <canvas id="mainCanvas"></canvas>
</template>

<style scoped>

</style>