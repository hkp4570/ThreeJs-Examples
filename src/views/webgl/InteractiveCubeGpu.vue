<template>
  <canvas id="mainCanvas"></canvas>
</template>
<script>
import * as THREE from 'three';
import {BufferGeometryUtils} from 'three/examples/jsm/Addons.js';
import {TrackballControls} from "three/examples/jsm/Addons.js";

let renderer, camera, scene;
let pickingTexture, pickingScene, controls;
const pickingData = [];
let highlightBox;
let pointer = new THREE.Vector2();
const clearColor = new THREE.Color();
let offset = new THREE.Vector3(10,10,10);
export default {
  mounted() {
    this.init();
    this.animate();
  },
  methods: {
    init() {
      camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
      camera.position.z = 1000;

      scene = new THREE.Scene();
      scene.background = new THREE.Color(0xffffff); // 场景背景色

      renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('mainCanvas'),
        antialias: true, // 开启抗锯齿
      })
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);

      scene.add(new THREE.AmbientLight(0xcccccc)); // 添加环境环境光

      const light = new THREE.DirectionalLight(0xffffff, 3);
      light.position.set(0, 500, 2000);
      scene.add(light);

      const defaultMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        flatShading: true,
        vertexColors: true,
        shininess: 0
      })
      pickingScene = new THREE.Scene();
      pickingTexture = new THREE.WebGLRenderTarget(1, 1, {
        type: THREE.IntType,
        format: THREE.RGBAIntegerFormat,
        internalFormat: 'RGBA32I',
      })
      const pickingMaterial = new THREE.ShaderMaterial({
        glslVersion: THREE.GLSL3,
        vertexShader: `
          attribute int id;
          flat varying int vid;
          void main(){
            vid = id;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          layout(location = 0) out int out_id;
          flat varying int vid;
          void main(){
            out_id = vid;
          }
        `
      })

      function applyId(geometry, id) {
        const position = geometry.attributes.position;
        const array = new Int16Array(position.count);
        array.fill(id);
        const bufferAttribute = new THREE.Int16BufferAttribute(array, 1, false);
        bufferAttribute.gpuType = THREE.IntType;
        geometry.setAttribute('id', bufferAttribute);
      }

      function applyVertexColors(geometry, color) {
        const position = geometry.attributes.position;
        const colors = [];
        for (let i = 0; i < position.count; i++) {
          colors.push(color.r, color.g, color.b);
        }
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      }

      const geometries = [];
      const matrix = new THREE.Matrix4();
      const quaternion = new THREE.Quaternion();
      const color = new THREE.Color();

      for (let i = 0; i < 5000; i++) {
        const geometry = new THREE.BoxGeometry();
        const position = new THREE.Vector3();
        position.x = Math.random() * 10000 - 5000;
        position.y = Math.random() * 6000 - 3000;
        position.z = Math.random() * 8000 - 4000;

        const rotation = new THREE.Euler();
        rotation.x = Math.random() * 2 * Math.PI;
        rotation.y = Math.random() * 2 * Math.PI;
        rotation.z = Math.random() * 2 * Math.PI;

        const scale = new THREE.Vector3();
        scale.x = Math.random() * 200 + 100;
        scale.y = Math.random() * 200 + 100;
        scale.z = Math.random() * 200 + 100;

        quaternion.setFromEuler(rotation);
        matrix.compose(position, quaternion, scale);
        geometry.applyMatrix4(matrix);

        applyVertexColors(geometry, color.setHex(Math.random() * 0xffffff));
        applyId(geometry, i);
        geometries.push(geometry);
        pickingData[i] = {

          position: position,
          rotation: rotation,
          scale: scale

        };
      }
      // 合并几何体
      const mergeGeometries = BufferGeometryUtils.mergeGeometries(geometries);
      scene.add(new THREE.Mesh(mergeGeometries, defaultMaterial));
      pickingScene.add(new THREE.Mesh(mergeGeometries, pickingMaterial));

      // 控制器
      controls = new TrackballControls(camera, renderer.domElement);
      controls.rotateSpeed = 1.0; // 旋转速度
      controls.zoomSpeed = 1.2;  // 缩放速度
      controls.panSpeed = 0.8; // 平移速度
      controls.noZoom = false; // 是否禁用缩放
      controls.noPan = false; // 是否禁用平移
      controls.staticMoving = true; // 使用禁用阻尼
      controls.dynamicDampingFactor = 0.3; // 设置阻尼强度

      highlightBox = new THREE.Mesh(
          new THREE.BoxGeometry(),
          new THREE.MeshLambertMaterial({color: 0xffff00})
      )
      scene.add(highlightBox);

      window.addEventListener('resize', this.onWindowResize);
      renderer.domElement.addEventListener('pointermove', this.onPointermove)
    },
    onWindowResize() {
      camera.aspect = (window.innerWidth / window.innerHeight);
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    },
    onPointermove(e){
      pointer.x = e.clientX - 200;
      pointer.y = e.clientY;
    },
    animate() {
      requestAnimationFrame(this.animate);
      this.render();
    },
    pick(){
      const dpr = window.devicePixelRatio;
      camera.setViewOffset(
          renderer.domElement.width, renderer.domElement.height,
          Math.floor(pointer.x * dpr), Math.floor(pointer.y * dpr),
          1,1
      )
      renderer.setRenderTarget(pickingTexture);
      clearColor.setRGB(-1,-1,-1);
      renderer.setClearColor(clearColor);
      renderer.render(pickingScene, camera);

      camera.clearViewOffset();

      const pixelBuffer = new Int32Array(4);
      renderer.readRenderTargetPixels(pickingTexture,0,0,1,1,pixelBuffer);
      const id = pixelBuffer[0];
      if(id !== -1){
        const data = pickingData[id];
        highlightBox.position.copy( data.position );
        highlightBox.rotation.copy( data.rotation );
        highlightBox.scale.copy( data.scale ).add( offset );
        highlightBox.visible = true;
      }else{
        highlightBox.visible = false;
      }
    },
    render() {
      controls.update();
      this.pick();
      renderer.setRenderTarget(null);
      renderer.render(scene, camera);
    }
  }
}
</script>