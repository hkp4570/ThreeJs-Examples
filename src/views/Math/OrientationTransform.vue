<template>
  <canvas id="mainCanvas"></canvas>
</template>

<script>
import * as THREE from 'three';
let camera, scene, renderer, target, mesh;
const spherical = new THREE.Spherical();
const rotationMatrix = new THREE.Matrix4();
// 四元数表示旋转
const targetQuaternion = new THREE.Quaternion();
const clock = new THREE.Clock();
let speed = 2;
export default {
  mounted() {
    this.init();
    this.animate();
  },
  methods: {
    init() {
      camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight,0.1,10);
      camera.position.set(0,0,3);

      renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('mainCanvas'),
        antialias: true,
      })
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);

      scene = new THREE.Scene();

      // 锥 指向圆点
      const coneGeometry = new THREE.ConeGeometry(0.1,0.5,8);
      coneGeometry.rotateX(Math.PI * 0.5);
      mesh = new THREE.Mesh(coneGeometry, new THREE.MeshNormalMaterial());
      scene.add(mesh);

      // 目标圆点
      const targetGeometry = new THREE.SphereGeometry(0.05);
      target = new THREE.Mesh(targetGeometry, new THREE.MeshBasicMaterial({color: 0xff0000}));
      scene.add(target);

      //
      const sphereGeometry = new THREE.SphereGeometry(1.5,32,32);
      const sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0xcccccc,
        wireframe: true,
        transparent: true,
        opacity: 0.3,
      })
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      scene.add(sphere);

      window.addEventListener('resize', this.onWindowResized);
      this.generateTarget();
    },
    generateTarget(){
      spherical.radius = 1.5;
      spherical.phi = Math.acos((Math.random() * 2) - 1);
      spherical.theta = Math.random() * Math.PI * 2;
      target.position.setFromSpherical(spherical);

      rotationMatrix.lookAt(target.position, mesh.position, mesh.up);
      targetQuaternion.setFromRotationMatrix(rotationMatrix);
      setTimeout( this.generateTarget, 2000 );
    },
    onWindowResized(){
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    },
    animate() {
      requestAnimationFrame(this.animate);
      const delta = clock.getDelta();
      if(!mesh.quaternion.equals(targetQuaternion)){
        const step = speed * delta;
        mesh.quaternion.rotateTowards(targetQuaternion, step);
      }
      renderer.render(scene,camera);
    }
  }
}
</script>

<style scoped>

</style>