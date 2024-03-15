<template>
  <canvas id="mainCanvas"></canvas>
</template>

<script>
import * as THREE from 'three';
import GUI from 'lil-gui';
import {FontLoader} from "three/addons";
import {TextGeometry} from "three/addons";

let scene, camera, renderer;
let cameraTarget, group, materials;
let fontName = 'optimer';
let fontWeight = 'bold';
let font = undefined;
const mirror = true;
let meshText1, meshText2, textGeo;
let text = 'three.js';
let bevelEnabled = true;
const height = 20,
    size = 70,
    hover = 30,

    curveSegments = 4,

    bevelThickness = 2,
    bevelSize = 1.5;
let pointerXOnPointerDown = 0;
let windowHalfX = window.innerWidth / 2;
let pointerX = 0;
let targetRotation = 0;
let targetRotationOnPointerDown = 0;
let firstLetter = true;
export default {
  mounted() {
    this.init();
    this.animate();
  },
  methods: {
    init() {
      camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1500);
      camera.position.set(0, 400, 700);
      cameraTarget = new THREE.Vector3(0, 150, 0);

      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x000000);
      scene.fog = new THREE.Fog(0x000000, 250, 1400);

      group = new THREE.Group();
      group.position.y = 100;
      scene.add(group);

      const dirLight = new THREE.DirectionalLight(0xffffff, 0.4);
      dirLight.position.set(0, 0, 1).normalize();
      scene.add(dirLight);

      const pointLight = new THREE.PointLight(0xffffff, 4.5, 0, 0);
      pointLight.color.setHSL(Math.random(), 1, 0.5);
      pointLight.position.set(0, 100, 90);
      scene.add(pointLight);

      materials = [
        new THREE.MeshPhongMaterial({color: 0xffffff, flatShading: true}),
        new THREE.MeshPhongMaterial({color: 0xffffff})
      ]

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: document.getElementById('mainCanvas')
      })
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);

      this.loadFont();

      //   event
      document.body.style.touchAction = 'none';
      document.addEventListener('pointerdown', this.onPointerDown);
      document.addEventListener('keypress', this.onDocumentKeyPress);
      document.addEventListener('keydown', this.onDocumentKeyDown);

      const params = {
        changeColor:  () =>  {
          pointLight.color.setHSL(Math.random(), 1, 0.5);
        },
        changeWeight:  () => {
          if (fontWeight === 'bold') {
            fontWeight = 'regular';
          } else {
            fontWeight = 'bold';
          }
          this.loadFont();
        }
      }
      const gui = new GUI();
      gui.add(params, 'changeColor').name('change color');
      gui.add(params, 'changeWeight').name('change weight');
      gui.open();
    },
    onDocumentKeyDown(event) {
      if (firstLetter) {
        firstLetter = false;
        text = '';
      }
      const keyCode = event.keyCode;

      if (keyCode === 8) {
        event.preventDefault();
        text = text.substring(0, text.length - 1);
        this.refreshText();
        return false;
      }
    },
    onDocumentKeyPress(event) {
      const keyCode = event.which;
      if (keyCode === 8) {
        event.preventDefault();
      } else {
        const ch = String.fromCharCode(keyCode);
        text += ch;
        this.refreshText();
      }
    },
    onPointerDown(event) {
      if (event.isPrimary === false) return;
      pointerXOnPointerDown = event.clientX - windowHalfX;
      targetRotationOnPointerDown = targetRotation;

      document.addEventListener('pointermove', this.onPointerMove);
      document.addEventListener('pointerup', this.onPointerUp);
    },
    onPointerMove(event) {
      if (event.isPrimary === false) return;
      pointerX = event.clientX - windowHalfX;
      targetRotation = targetRotationOnPointerDown + (pointerX - pointerXOnPointerDown) * 0.02;
    },
    onPointerUp(event) {
      if (event.isPrimary === false) return;
      document.removeEventListener('pointermove', this.onPointerMove);
      document.removeEventListener('pointerup', this.onPointerUp);
    },
    loadFont() {
      const loader = new FontLoader();
      loader.load(`/font/${fontName}_${fontWeight}.typeface.json`, (response) => {
        font = response;
        this.refreshText();
      })
    },
    createText() {
      textGeo = new TextGeometry(text, {
        font: font,
        size,
        height,
        curveSegments,

        bevelThickness,
        bevelSize,
        bevelEnabled,
      })
      // 当需要获取几何体的边界框的信息时，需要先调用此方法
      textGeo.computeBoundingBox();
      const centerOffset = -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);
      meshText1 = new THREE.Mesh(textGeo, materials);
      meshText1.position.x = centerOffset;
      meshText1.position.y = hover;
      meshText1.position.z = 0;
      meshText1.rotation.x = 0;
      meshText1.rotation.y = Math.PI * 2;
      group.add(meshText1);
      if (mirror) {

        meshText2 = new THREE.Mesh(textGeo, materials);

        meshText2.position.x = centerOffset;
        meshText2.position.y = -hover;
        meshText2.position.z = height;

        meshText2.rotation.x = Math.PI;
        meshText2.rotation.y = Math.PI * 2;

        group.add(meshText2);

      }
    },
    refreshText() {
      group.remove(meshText1);
      if (mirror) group.remove(meshText2);
      if (!text) return;
      this.createText();
    },
    animate() {
      requestAnimationFrame(this.animate);
      group.rotation.y += (targetRotation - group.rotation.y) * 0.05;

      camera.lookAt(cameraTarget);
      renderer.clear();
      renderer.render(scene, camera);
    }
  }
}
</script>