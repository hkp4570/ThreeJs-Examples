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
  methods:{
    init(){
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0xcccccc);
      scene.fog = new THREE.FogExp2(0xcccccc, 0.002);

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: document.getElementById('mainCanvas')
      })
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);

      camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight,1,1000);
      camera.position.set(400,200,0);

      // controls
      controls = new OrbitControls(camera, renderer.domElement);
      controls.listenToKeyEvents(window); // 绑定事件
      controls.enableDamping = true; // 开启阻尼 必须在动画循环中调用update
      controls.dampingFactor = 0.05; // 阻尼系数
      controls.screenSpacePanning = false; // 摄像机在屏幕空间内平移
      controls.minDistance = 100;
      controls.maxDistance = 500;
      controls.maxPolarAngle = Math.PI / 2;

      const geometry = new THREE.ConeGeometry(10,30,4,1);
      const material = new THREE.MeshPhongMaterial({color: 0xffffff, flatShading: true});
      for (let i = 0; i < 500; i++) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = Math.random() * 1600 - 800;
        mesh.position.y = 0;
        mesh.position.z = Math.random() * 1600 - 800;
        mesh.updateMatrix();
        mesh.matrixAutoUpdate = false;
        scene.add(mesh);
      }

      const dirLight1 = new THREE.DirectionalLight(0xffffff, 3);
      dirLight1.position.set(1,1,1);
      scene.add(dirLight1);
      const dirLight2 = new THREE.DirectionalLight(0x002288, 3);
      dirLight2.position.set(-1,-1,-1);
      scene.add(dirLight2);
      const ambientLight = new THREE.AmbientLight(0x555555);
      scene.add(ambientLight);

      window.addEventListener('resize', this.onWindowResize);
    },
    onWindowResize(){
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    },
    animate(){
      requestAnimationFrame(this.animate);
      controls.update();
      renderer.render(scene,camera);
    }
  }
}
</script>

<style scoped>
</style>