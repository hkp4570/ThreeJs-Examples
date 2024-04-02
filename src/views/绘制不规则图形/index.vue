<template>
    <canvas id="mainCanvas"></canvas>
</template>

<script>
import * as THREE from 'three';
import {OrbitControls} from "three/addons/controls/OrbitControls.js";

let scene, renderer, camera, controls;
export default {
    mounted() {
        this.init();
        this.animate();
    },
    methods: {
        init() {
            scene = new THREE.Scene();

            camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
            camera.position.set(0, 10, 10);
            camera.lookAt(0, 0, 0);

            renderer = new THREE.WebGLRenderer({
                canvas: document.getElementById('mainCanvas'),
                antialias: true,
            })
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setAnimationLoop(this.animate);

            controls = new OrbitControls(camera, renderer.domElement);

            const heartShape = new THREE.Shape();
            heartShape.moveTo(0, 1.5);
            heartShape.bezierCurveTo(2, 3.5, 4, 1.5, 2, -0.5);
            heartShape.lineTo(0, -2.5);
            heartShape.lineTo(-2, -0.5);
            heartShape.bezierCurveTo(-4, 1.5, -2, 3.5, 0, 1.5);

            const shape_c = new THREE.Path();
            shape_c.moveTo(-1, 1);
            shape_c.lineTo(1, 1,);
            shape_c.lineTo(1, -1);
            shape_c.lineTo(-1, -1);
            shape_c.lineTo(-1, 1);
            heartShape.holes.push(shape_c);

            // const heartGeometry = new THREE.ShapeGeometry(heartShape);
            // const heartMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00, side: THREE.DoubleSide});
            // const heartMesh = new THREE.Mesh(heartGeometry,heartMaterial);
            // scene.add(heartMesh);

            const extrudeSetting = {
                steps: 2,
                depth: 3,
            }
            const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSetting);
            const material = new THREE.MeshPhongMaterial({color: 0x00ff00, side: THREE.DoubleSide});
            const mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);

            {
                const light = new THREE.DirectionalLight(0xffffff, 1);
                light.position.set(-1, 10, 4);
                scene.add(light);
            }
            {
                const light = new THREE.DirectionalLight(0xffffff, 1);
                light.position.set(-1, -10, -4);
                scene.add(light);
            }

        },
        animate() {
            controls.update();
            renderer.render(scene, camera);
        }
    }
}
</script>

<style scoped>

</style>