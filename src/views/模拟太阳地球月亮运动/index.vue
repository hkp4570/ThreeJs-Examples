<template>
    <canvas id="mainCanvas"></canvas>
</template>

<script>
import * as THREE from 'three';
import {OrbitControls} from "three/addons/controls/OrbitControls.js";

let renderer, camera, scene, controls;
const objects = [];
const loader = new THREE.TextureLoader();

export default {
    mounted() {
        this.init();
        this.animate();
    },
    methods: {
        init() {
            camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.set(0, 0, 50);
            camera.up.set(0, 0, 1);
            camera.lookAt(0, 0, 0);

            scene = new THREE.Scene();

            renderer = new THREE.WebGLRenderer({
                antialias: true,
                canvas: document.getElementById('mainCanvas')
            })
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);

            const light = new THREE.PointLight(0xffffff, 600);
            scene.add(light);

            const cameraHelper = new THREE.CameraHelper(camera);
            scene.add(cameraHelper);

            controls = new OrbitControls(camera, renderer.domElement);


            scene.background = loader.load('/img/starrySky.jpg');

            const sphereGeometry = new THREE.SphereGeometry(2,36,36);

            // 太阳
            const sunTexture = loader.load('/img/sun.jpg');
            const sunMaterial = new THREE.MeshBasicMaterial({map:sunTexture});
            const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
            sunMesh.scale.set(3 ,3,3);

            // 地球
            const earthTexture = loader.load('/img/earth.jpg');
            const earthMaterial = new THREE.MeshPhongMaterial({map: earthTexture});
            const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);

            // 太阳系
            const solarSystem = new THREE.Object3D();
            scene.add(solarSystem);
            objects.push(solarSystem);

            solarSystem.add(sunMesh);

            // 地月系
            const landOrbit = new THREE.Object3D();
            landOrbit.position.z = 20;
            solarSystem.add(landOrbit);
            objects.push(landOrbit);

            const moonTexture = loader.load('/img/moon.jpg');
            const moonMaterial = new THREE.MeshPhongMaterial({map:moonTexture});
            const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
            moonMesh.scale.set(0.5,0.5,0.5);
            moonMesh.position.x = 5;
            objects.push(moonMesh);

            landOrbit.add(earthMesh);
            landOrbit.add(moonMesh);

            window.addEventListener('resize', this.onResize);
        },
        onResize(){
            camera.aspect = window.innerWidth/window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        },
        animate() {
            requestAnimationFrame(this.animate);
            objects.forEach(obj => {
                obj.rotation.y = Date.now() * 0.001;
            })
            renderer.render(scene, camera);
        }
    }
}
</script>