<template>
  <canvas id="mainCanvas"></canvas>
</template>
<script>
import * as THREE from 'three';
import {GeometryUtils} from 'three/examples/jsm/Addons.js';

let renderer, camera, scene;
let WIDTH = window.innerWidth, HEIGHT = window.innerHeight;
const objects = [];
export default {
  mounted() {
    this.init();
    this.animate();
  },
  methods: {
    init() {
      camera = new THREE.PerspectiveCamera(60, WIDTH / HEIGHT, 1, 200);
      camera.position.set(0, 0, 150);

      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x111111);
      scene.fog = new THREE.Fog(0x111111, 150, 200);

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: document.getElementById('mainCanvas')
      })
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(WIDTH, HEIGHT);

      const points = GeometryUtils.hilbert3D(new THREE.Vector3(0, 0, 0), 25.0, 1, 0, 1, 2, 3, 4, 5, 6, 7);
      const spline = new THREE.CatmullRomCurve3(points);

      const samples = spline.getPoints(points.length * 6);
      const geometrySpline = new THREE.BufferGeometry().setFromPoints(samples);

      const line = new THREE.Line(geometrySpline, new THREE.LineDashedMaterial({
        color: 0xffffff,
        dashSize: 1,
        gapSize: 0.5
      }));
      line.computeLineDistances();
      objects.push(line);
      scene.add(line);

      const geometryBox = this.box(50, 50, 50);
      const lineSegments = new THREE.LineSegments(geometryBox, new THREE.LineDashedMaterial({
        color: 0xffaa00,
        dashSize: 3,
        gapSize: 1.5,
      }));
      lineSegments.computeLineDistances();
      objects.push(lineSegments);
      scene.add(lineSegments);

      window.addEventListener('resize', this.onWindowResize);
    },
    box(width, height, depth) {
      width = width * 0.5;
      height = height * 0.5;
      depth = depth * 0.5;
      const geometry = new THREE.BufferGeometry();
      const position = [];
      position.push(
          -width, -height, -depth,
          -width, height, -depth,

          -width, height, -depth,
          width, height, -depth,

          width, height, -depth,
          width, -height, -depth,

          width, -height, -depth,
          -width, -height, -depth,

          -width, -height, depth,
          -width, height, depth,

          -width, height, depth,
          width, height, depth,

          width, height, depth,
          width, -height, depth,

          width, -height, depth,
          -width, -height, depth,

          -width, -height, -depth,
          -width, -height, depth,

          -width, height, -depth,
          -width, height, depth,

          width, height, -depth,
          width, height, depth,

          width, -height, -depth,
          width, -height, depth
      );
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));
      return geometry;
    },
    onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    },
    animate() {
      requestAnimationFrame(this.animate);
      this.render();
    },
    render() {
      const time = Date.now() * 0.001;
      scene.traverse(function (object) {
        if (object.isLine) {
          object.rotation.x = 0.25 * time;
          object.rotation.y = 0.25 * time;
        }
      })
      renderer.render(scene, camera);
    }
  }
}
</script>