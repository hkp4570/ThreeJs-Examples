<template>
  <canvas id="mainCanvas"></canvas>
</template>

<script>
import * as THREE from 'three';
import {PerspectiveCamera} from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {ConvexGeometry} from "three/examples/jsm/Addons.js";
import {BufferGeometryUtils} from "three/examples/jsm/Addons.js";

let camera, renderer, scene, group;
export default {
  mounted() {
    this.init();
    this.animate();
  },
  methods: {
    init() {
      scene = new THREE.Scene();

      camera = new PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);
      camera.position.set(15, 20, 30);
      scene.add(camera);

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: document.getElementById('mainCanvas')
      })
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);

      // controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.minDistance = 20;
      controls.maxDistance = 50;
      controls.maxPolarAngle = Math.PI / 2;

      // ambient light
      scene.add(new THREE.AmbientLight(0x666666));

      // point light
      const pointLight = new THREE.PointLight(0xffffff, 3, 0, 0);
      scene.add(pointLight);

      // helper
      scene.add(new THREE.AxesHelper(20));

      // textures
      const loader = new THREE.TextureLoader();
      const texture = loader.load('/texture/disc.png');
      texture.colorSpace = THREE.SRGBColorSpace;

      // group
      group = new THREE.Group();
      scene.add(group);

      // point
      let dodecahedronGeometry = new THREE.DodecahedronGeometry(10);
      dodecahedronGeometry.deleteAttribute('normal');
      dodecahedronGeometry.deleteAttribute('uv');

      dodecahedronGeometry = BufferGeometryUtils.mergeVertices(dodecahedronGeometry);

      const vertices = [];
      const positionAttribute = dodecahedronGeometry.getAttribute('position');

      for (let i = 0; i < positionAttribute.count; i++) {
        const vertex = new THREE.Vector3();
        vertex.fromBufferAttribute(positionAttribute, i);
        vertices.push(vertex);
      }

      const pointsMaterial = new THREE.PointsMaterial({
        color: 0x0080ff,
        map: texture,
        size: 1,
        alphaTest: 0.5,
      })
      const pointGeometry = new THREE.BufferGeometry().setFromPoints(vertices);
      const points = new THREE.Points(pointGeometry, pointsMaterial);
      group.add(points);

      // convex
      const meshMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        opacity: 0.5,
        side: THREE.DoubleSide,
        transparent: true
      })
      const meshGeometry = new ConvexGeometry(vertices);
      const mesh = new THREE.Mesh(meshGeometry, meshMaterial);
      group.add(mesh);

      window.addEventListener('resize', this.onWindowResize);
    },
    onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    },
    animate() {
      requestAnimationFrame(this.animate);
      group.rotation.y += 0.005;
      renderer.render(scene, camera);
    }
  }
}
</script>