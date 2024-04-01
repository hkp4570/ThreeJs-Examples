<template>
    <canvas id="mainCanvas"></canvas>
</template>

<script>
import * as THREE from 'three';
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {RGBELoader} from "three/addons";
import GUI from 'lil-gui';

let renderer, scene, camera, controls;
let cubeCamera, cubeRenderTarget;
let material, sphere, cube, torus;
export default {
    mounted() {
        this.init();
        this.animate();
    },
    methods: {
        init() {
            scene = new THREE.Scene();
            scene.rotation.y = 0.5;

            camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
            camera.position.z = 75;

            renderer = new THREE.WebGLRenderer({
                canvas: document.getElementById('mainCanvas'),
                antialias: true,
            })
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setAnimationLoop(this.animate); // 可用帧内调用函数
            renderer.toneMapping = THREE.ACESFilmicToneMapping; // ACES电影色调映射

            controls = new OrbitControls(camera, renderer.domElement);
            controls.autoRotate = true; // 自动旋转

            new RGBELoader().setPath('/texture/').load('quarry_01_1k.hdr', texture => {
                texture.mapping = THREE.EquirectangularReflectionMapping;
                scene.background = texture;
                scene.environment = texture;
            })

            cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256);
            cubeRenderTarget.texture.type = THREE.HalfFloatType; // 半浮点型

            cubeCamera = new THREE.CubeCamera(1,1000, cubeRenderTarget);

            material = new THREE.MeshStandardMaterial({
                envMap: cubeRenderTarget.texture,
                roughness: 0.05,
                metalness: 1,
            })

            const gui = new GUI();
            gui.add(material, 'roughness',0,1);
            gui.add(material, 'metalness',0,1);
            gui.add( renderer, 'toneMappingExposure', 0, 2 ).name( 'exposure' );

            sphere = new THREE.Mesh(new THREE.IcosahedronGeometry(15,8), material);
            scene.add(sphere);

            const material2 = new THREE.MeshStandardMaterial({
                roughness: 0.05,
                metalness: 0,
                color: 0xffffff,
            })
            cube = new THREE.Mesh(new THREE.BoxGeometry(15,15,15), material2);
            scene.add(cube);
            torus = new THREE.Mesh(new THREE.TorusKnotGeometry(8,3,128,16), material2);
            scene.add(torus);

            window.addEventListener('resize', this.onResize);
        },
        onResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        },
        animate(msTime) {
            const time = msTime / 1000;

            cube.position.x = Math.cos( time ) * 30;
            cube.position.y = Math.sin( time ) * 30;
            cube.position.z = Math.sin( time ) * 30;
            //
            cube.rotation.x += 0.02;
            cube.rotation.y += 0.03;
            //
            torus.position.x = Math.cos( time + 10 ) * 30;
            torus.position.y = Math.sin( time + 10 ) * 30;
            torus.position.z = Math.sin( time + 10 ) * 30;
            //
            torus.rotation.x += 0.02;
            torus.rotation.y += 0.03;

            cubeCamera.update(renderer, scene);

            controls.update();
            renderer.render(scene, camera);
        }
    }
}
</script>

<style scoped>

</style>