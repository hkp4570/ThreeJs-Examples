<template>
  <canvas id="mainCanvas"></canvas>
</template>

<script>
import * as THREE from 'three';
import GUI from 'lil-gui';
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
  showHelpers: true,
  alphaToCoverage: true,
};
export default {
  data() {
    return {}
  },
  mounted() {
    this.init();
    this.render();
  },
  methods: {
    init() {
      renderer = new THREE.WebGLRenderer({antialias: true, canvas: document.getElementById('mainCanvas')});
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.localClippingEnabled = true;

      scene = new THREE.Scene();

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

      // helper
      const helper = new THREE.Group();
      helper.add(new THREE.PlaneHelper(clipPlanes[0], 2, 0xff0000));
      helper.add(new THREE.PlaneHelper(clipPlanes[1], 2, 0x00ff00));
      helper.add(new THREE.PlaneHelper(clipPlanes[2], 2, 0x0000ff));
      scene.add(helper);

      // gui
      const gui = new GUI();
      // 透明度抗锯齿
      gui.add(params, 'alphaToCoverage').onChange(value => {
        group.children.forEach(g => {
          g.material.alphaToCoverage = Boolean(value);
          g.material.needsUpdate = true;
        })
        this.render();
      })
      // 裁剪平面的行为
      gui.add(params, 'clipIntersection').name('clip intersection').onChange(value => {
        const children = group.children;
        for (let i = 0; i < children.length; i++) {
          children[i].material.clipIntersection = value;
        }
        this.render();
      })
      // 平面到原点的距离
      gui.add(params, 'planeConstant',-1,1).step(0.01).name('plane constant').onChange(value => {
        clipPlanes.forEach(c => {
          c.constant = value;
        })
        this.render();
      })
      // 辅助平面
      gui.add(params, 'showHelpers').name('show helpers').onChange(value => {
        helper.visible = Boolean(value);
        this.render();
      })

      window.addEventListener('resize', this.windowResize);

    },
    windowResize(){
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
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