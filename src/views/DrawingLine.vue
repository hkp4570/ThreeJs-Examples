<template>
  <div ref="container" class="drawingLine_container"></div>
</template>
<script>
import * as THREE from 'three';
let renderer, camera, scene;
export default {
  mounted() {
    this.init();
    this.animate();
  },
  methods: {
    init(){
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight,1,1000);
      camera.position.z = 100;
      camera.lookAt(0,0,0);
      renderer = new THREE.WebGLRenderer({});
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth,window.innerHeight);
      this.$refs.container.appendChild(renderer.domElement);

      const material = new THREE.LineBasicMaterial({color: 0x0000ff});
      const points = [];
      points.push(new THREE.Vector3(-10,0,0));
      points.push(new THREE.Vector3(0,10,0));
      points.push(new THREE.Vector3(10,0,0));
      const geometry = new THREE.BufferGeometry().setFromPoints(points);

      const line = new THREE.Line(geometry, material);
      scene.add(line);

    },
    animate(){
      renderer.render(scene,camera);
    }
  }
}
</script>

<style scoped>
  .drawingLine_container{
    width: 100%;
    height: 100%;
  }
</style>