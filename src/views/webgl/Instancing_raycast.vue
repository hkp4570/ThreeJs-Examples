<template>
  <canvas id="mainCanvas"></canvas>
</template>

<script>
import * as THREE from 'three';
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";

let camera, renderer, scene, mesh, controls;
let amount = parseInt(window.location.search.slice(1)) || 10;
const count = Math.pow(amount, 3);
const color = new THREE.Color();
const white = new THREE.Color().setHex(0xffffff);
const mouse = new THREE.Vector2(1,1);
const raycaster = new THREE.Raycaster();
export default {
  mounted() {
    this.init();
    this.animate();
  },
  methods: {
    init() {
      camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
      camera.position.set(amount, amount, amount);
      camera.lookAt(0, 0, 0);

      scene = new THREE.Scene();

      renderer = new THREE.WebGLRenderer(({
        antialias: true,
        canvas: document.getElementById('mainCanvas')
      }))
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);

      const light = new THREE.HemisphereLight(0xffffff, 0x888888, 3);
      light.position.set(0, 1, 0);
      scene.add(light);

      const geometry = new THREE.IcosahedronGeometry(0.5, 3);
      const material = new THREE.MeshPhongMaterial({color: 0xffffff});
      mesh = new THREE.InstancedMesh(geometry, material, count);

      let i = 0;
      const offset = (amount - 1) / 2;
      const matrix = new THREE.Matrix4();
      for (let x = 0; x < amount; x++) {
        for (let y = 0; y < amount; y++) {
          for (let z = 0; z < amount; z++) {
            matrix.setPosition(offset - x, offset - y, offset - z);
            mesh.setMatrixAt(i, matrix);
            mesh.setColorAt(i, color);

            i++;
          }
        }
      }
      scene.add(mesh);

      const gui = new GUI();
      gui.add(mesh, 'count', 0, count);

      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.enableZoom = false;
      controls.enablePan = false;

      window.addEventListener('resize', this.onResize);
      window.addEventListener('mousemove', this.onMousemove);
    },
    onResize(){
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth,window.innerHeight);
    },
    onMousemove(event){
      event.preventDefault();
      mouse.x = ((event.clientX - 200) / window.innerWidth) * 2 - 1;
      mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    },
    animate() {
      requestAnimationFrame(this.animate);
      controls.update();
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(mesh);

      if(intersects.length > 0){
        const instanceId = intersects[0].instanceId;
        mesh.getColorAt(instanceId, color);
        if(color.equals(white)){
          mesh.setColorAt(instanceId, color.setHex(Math.random() * 0xffffff));
          mesh.instanceColor.needsUpdate = true;
        }
      }
      renderer.render(scene, camera);
    }
  }
}
</script>

<style scoped>

</style>