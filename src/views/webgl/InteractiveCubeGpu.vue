<template>
  <canvas id="mainCanvas"></canvas>
</template>
<script>
import * as THREE from 'three';

let renderer, camera, scene;
let pickingTexture, pickingScene;
const pickingData = [];
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
      scene.background = new THREE.Color(0xffffff);

      renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('mainCanvas')
      })
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);

      scene.add(new THREE.AmbientLight(0xcccccc));

      const light = new THREE.DirectionalLight(0xffffff, 3);
      light.position.set(0,500,2000);
      scene.add(light);

      // const defaultMaterial = new THREE.MeshPhongMaterial({
      //   color: 0xffffff,
      //   flatShading: true,
      //   vertexColors: true,
      //   shininess: 0
      // })
      pickingScene = new THREE.Scene();
      pickingTexture = new THREE.WebGLRenderTarget(1,1, {
        type: THREE.IntType,
        format: THREE.RGBAIntegerFormat,
        internalFormat: 'RGBA32I',
      })

      function applyId(geometry, id){
        const position = geometry.attribute.position;
        const array = new Int16Array(position.count);
        array.fill(id);
        const bufferAttribute = new THREE.Int16BufferAttribute(array, 1, false);
        bufferAttribute.gpuType = THREE.IntType;
        geometry.setAttribute( 'id', bufferAttribute );
      }
      function applyVertexColors(geometry, color){
        const position = geometry.attribute.position;
        const colors = [];
        for (let i = 0; i < position.count; i++) {
          colors.push(color.r,color.g,color.b);
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
        pickingData[ i ] = {

          position: position,
          rotation: rotation,
          scale: scale

        };
      }
    },
    animate() {

    }
  }
}
</script>