<template>
  <canvas id="mainCanvas"></canvas>
</template>

<script>
import * as THREE from 'three';
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {Sky, Water} from "three/addons";
import GUI from 'lil-gui';

let camera, scene, renderer, controls;
let time = 0, mesh;
let sun, water;
export default {
  mounted() {
    this.init();
    this.animate();
  },
  methods: {
    init() {
      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 20000);
      camera.position.set(30, 30, 100);

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: document.getElementById('mainCanvas')
      })
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.5;

      sun = new THREE.Vector3();

      // water
      const waterGeometry = new THREE.PlaneGeometry(10000, 10000);
      water = new Water(waterGeometry, {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: new THREE.TextureLoader().load('/texture/waternormals.jpg', function (texture) {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        }),
        sunDirection: new THREE.Vector3(),
        sunColor: 0xffffff,
        waterColor: 0x001e0f,
        distortionScale: 3.7,
        fog: scene.fog !== undefined
      })
      water.rotation.x = -Math.PI / 2;
      scene.add(water);

      // skybox
      const sky = new Sky();
      sky.scale.setScalar(10000);
      scene.add(sky);

      const skyUniforms = sky.material.uniforms;
      skyUniforms['turbidity'].value = 10;
      skyUniforms['rayleigh'].value = 2;
      skyUniforms['mieCoefficient'].value = 0.005;
      skyUniforms['mieDirectionalG'].value = 0.8;

      const parameters = {
        elevation: 2,
        azimuth: 180
      };

      const geometry = new THREE.BoxGeometry(30, 30, 30);
      const material = new THREE.MeshStandardMaterial({roughness: 0});
      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // controls
      controls = new OrbitControls(camera, renderer.domElement);
      controls.maxPolarAngle = Math.PI * 0.495;
      controls.target.set(0, 10, 0);
      controls.minDistance = 40.0;
      controls.maxDistance = 200.0;
      controls.update();

      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      const sceneEnv = new THREE.Scene();
      let renderTarget;

      function updateSun() {
        const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
        const theta = THREE.MathUtils.degToRad(parameters.azimuth);
        sun.setFromSphericalCoords(1, phi, theta);

        sky.material.uniforms['sunPosition'].value.copy(sun);
        water.material.uniforms['sunDirection'].value.copy(sun).normalize();

        if (renderTarget !== undefined) renderTarget.dispose();

        sceneEnv.add(sky);
        renderTarget = pmremGenerator.fromScene(sceneEnv);
        scene.add(sky);

        scene.environment = renderTarget.texture;

      }

      updateSun();

      const gui = new GUI();
      const skyFolder = gui.addFolder('sky');
      skyFolder.add(parameters, 'elevation', 0, 90, 0.1).onChange(updateSun);
      skyFolder.add(parameters, 'azimuth', -180, 180, 0.1).onChange(updateSun);
      skyFolder.open();

      const waterUniforms = water.material.uniforms;
      const waterFolder = gui.addFolder('water');
      waterFolder.add(waterUniforms.distortionScale, 'value', 0, 8, 0.1).name('distortionScale');
      waterFolder.add(waterUniforms.size, 'value', 0.1, 10, 0.1).name('size');
      waterFolder.open();

      window.addEventListener('resize', this.onResize);
    },
    onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    },
    animate() {
      requestAnimationFrame(this.animate);
      controls.update();
      const time = performance.now() * 0.001;

      mesh.position.y = Math.sin( time ) * 20 + 5;
      mesh.rotation.x = time * 0.5;
      mesh.rotation.z = time * 0.51;

      water.material.uniforms[ 'time' ].value += 1.0 / 60.0;
      renderer.render(scene, camera);
    }
  }
}
</script>