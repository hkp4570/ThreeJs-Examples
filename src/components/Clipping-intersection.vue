<template>
  <canvas id="mainCanvas"></canvas>
</template>

<script>
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js'

let renderer, scene, camera;
const clipPlanes = [
  new THREE.Plane(new THREE.Vector3(1, 0, 0), 0),
  new THREE.Plane(new THREE.Vector3(0, -1, 0), 0),
  new THREE.Plane(new THREE.Vector3(0, 0, -1), 0)
];
const params = {
  clipIntersection: true,
  planeConstant: 0,
  showHelpers: false,
  alphaToCoverage: true,
};
export default {
  data() {
    return {}
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      renderer = new THREE.WebGLRenderer({antialias: true, canvas: document.getElementById('mainCanvas')});
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.localClippingEnabled = true;

      scene = new THREE.Scene();
      console.log(scene);

      camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 200);
      camera.position.set(-1.5, 2.5, 3.0);

      // 轨道控制器 相机围绕目标进行轨道运动
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.addEventListener('change', this.render);
      controls.minDistance = 1;
      controls.maxDistance = 10;
      controls.enablePan = false; // 禁用摄像机平移

      //   半球光
      const light = new THREE.HemisphereLight(0xffffff, 0x080808, 4.5);
      light.position.set(-1.25, 1, 1.25);
      scene.add(light);

      // group  存放一堆物体
      const group = new THREE.Group();
      for (let i = 1; i <= 30; i += 2) {
        const geometry = new THREE.SphereGeometry(i / 30, 48, 24);
        const material = new THREE.MeshPhongMaterial({
          color: new THREE.Color().setHSL(Math.random(), 0.5, 0.5, THREE.SRGBColorSpace),
          side: THREE.DoubleSide,
          clippingPlanes: clipPlanes,
          clipIntersection: params.clipIntersection,
          alphaToCoverage: true,
        })
        group.add(new THREE.Mesh(geometry, material));
      }
      scene.add(group);
      this.render();
    },
    render() {
      renderer.render(scene, camera);
    }
  }
}
</script>

<style scoped>

</style>