<template>
<canvas id="mainCanvas"></canvas>
</template>

<script>
import * as THREE from 'three';
export default {
  data(){
    return {
      camera: null,
      renderer: null,
      scene: null,
      mesh: null,
    }
  },
  mounted() {
    this.init();
    this.animate();
  },
  methods: {
    init(){
      this.scene = new THREE.Scene();
      this.renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('mainCanvas'),
        antialias: true
      });
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(window.innerWidth, window.innerHeight);

      this.camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight,0.1,100);
      this.camera.position.z = 3;

      // 加载纹理
      const texture = new THREE.TextureLoader().load('/texture/crate.gif');
      texture.colorSpace = THREE.SRGBColorSpace;


       this.mesh = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial({
        map: texture,
      }))
      this.scene.add(this.mesh);
    },
    animate(){
      requestAnimationFrame(this.animate);
      this.mesh.rotation.x += 0.005;
      this.mesh.rotation.y += 0.01;
      this.renderer.render(this.scene, this.camera);
    }
  }
}
</script>

<style scoped>

</style>