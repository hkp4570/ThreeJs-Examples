<template>
    <canvas id="mainCanvas"></canvas>
</template>

<script>
import * as THREE from 'three';
import {OrbitControls} from "three/addons/controls/OrbitControls.js";

let renderer, scene, camera, controls;
export default {
    mounted() {
        this.init();
        this.animate();
    },
    methods: {
        init() {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
            camera.position.set(10, 3, 0);
            camera.lookAt(0, 0, 0);
            renderer = new THREE.WebGLRenderer({
                canvas: document.getElementById('mainCanvas'),
                antialias: true,
            })
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);
            controls = new OrbitControls(camera, renderer.domElement);

            // const skyboxImages = [
            //     '/skybox/pos-x.jpg',
            //     '/skybox/neg-x.jpg',
            //     '/skybox/pos-y.jpg',
            //     '/skybox/neg-y.jpg',
            //     '/skybox/pos-z.jpg',
            //     '/skybox/neg-z.jpg',
            // ];
            // const loader = new THREE.TextureLoader();
            // const skyGeometry = new THREE.BoxGeometry(5000,5000,5000);
            // const materialArray = [];
            // for (let i = 0; i < 6; i++) {
            //     materialArray.push(
            //         new THREE.MeshBasicMaterial({
            //             map: loader.load(skyboxImages[i]),
            //             side: THREE.BackSide,
            //         })
            //     )
            // }
            // const skybox = new THREE.Mesh(skyGeometry, materialArray);
            // scene.add(skybox);

            // const loader = new THREE.CubeTextureLoader();
            // const texture = loader.load([
            //     '/skybox/pos-x.jpg',
            //     '/skybox/neg-x.jpg',
            //     '/skybox/pos-y.jpg',
            //     '/skybox/neg-y.jpg',
            //     '/skybox/pos-z.jpg',
            //     '/skybox/neg-z.jpg',
            // ])
            // scene.background = texture;

            const loader = new THREE.TextureLoader();
            const texture = loader.load('/skybox/2.webp', () => {
                const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
                rt.fromEquirectangularTexture(renderer, texture);
                scene.background = rt.texture;
            })
        },
        animate() {
            requestAnimationFrame(this.animate);
            controls.update();
            renderer.render(scene, camera);
        }
    }
}
</script>

<style scoped>

</style>