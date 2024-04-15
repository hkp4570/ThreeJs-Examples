<template>
<canvas id="mainCanvas"></canvas>
</template>

<script>
import * as THREE from 'three';
import { ParallaxBarrierEffect } from 'three/addons/effects/ParallaxBarrierEffect.js';

let scene, camera, renderer;
let spheres = [];
let effect;
let mouseX=0, mouseY=0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight/ 2;
export default {
  mounted() {
    this.init();
    this.animate();
  },
  methods:{
    init(){
      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.01, 100);
      camera.position.z = 3;

      renderer = new THREE.WebGLRenderer({canvas: document.getElementById('mainCanvas'),antialias: true});
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);

      const path = '/texture/pisa/';
      const format = '.png';
      const urls = [
        `${path}px${format}`,`${path}nx${format}`,
        `${path}py${format}`,`${path}ny${format}`,
        `${path}pz${format}`,`${path}nz${format}`,
      ];
      const textureCube = new THREE.CubeTextureLoader().load(urls);
      scene.background = textureCube;

      const geometry = new THREE.SphereGeometry(0.1,32,16);
      const material = new THREE.MeshBasicMaterial({color: 0xffffff, envMap: textureCube});
      for (let i = 0; i < 500; i++) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = Math.random() * 10 - 5;
        mesh.position.y = Math.random() * 10 - 5;
        mesh.position.z = Math.random() * 10 - 5;
        mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 3 + 1;
        scene.add(mesh);
        spheres.push(mesh);
      }
      effect = new ParallaxBarrierEffect(renderer);
      effect.setSize(window.innerWidth || 2,window.innerHeight || 2);

      window.addEventListener('resize',this.onResize);
      document.addEventListener('mousemove', this.onMousemove);
    },
    onResize(){
      windowHalfX = window.innerWidth / 2;
      windowHalfY = window.innerHeight / 2;
      camera.aspect = window.innerWidth/window.innerHeight;
      camera.updateProjectionMatrix();
      effect.setSize(window.innerWidth,window.innerHeight);
    },
    onMousemove(event) {
      mouseX = (event.offsetX - windowHalfX) / 100;
      mouseY = (event.offsetY - windowHalfY) / 100;
    },
    animate(){
      const timer = 0.0001 * Date.now();
      camera.position.x += ( mouseX - camera.position.x ) * .05;
      camera.position.y += ( - mouseY - camera.position.y ) * .05;

      camera.lookAt( scene.position );
      for (let i = 0; i < spheres.length; i++) {
        const sphere = spheres[ i ];

        sphere.position.x = 5 * Math.cos( timer + i );
        sphere.position.y = 5 * Math.sin( timer + i * 1.1 );
      }
      requestAnimationFrame(this.animate);
      effect.render(scene,camera);
    }
  }
}
</script>