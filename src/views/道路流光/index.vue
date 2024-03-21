<template>
    <canvas id="mainCanvas"></canvas>
</template>

<script>
import * as THREE from 'three';

let renderer, camera, scene;
let tu;
export default {
    mounted() {
        this.init();
        this.animate();
    },
    methods: {
        init() {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100);
            camera.position.z = 50;
            camera.lookAt(0, 0, 0);

            renderer = new THREE.WebGLRenderer({
                antialias: true,
                canvas: document.getElementById('mainCanvas')
            })
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);

            let texture = new THREE.TextureLoader().load('/img/line.png', function (t) {
                tu = t;
            });
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(1, 1);
            texture.needsUpdate = true;

            let material = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.BackSide,
                transparent: true,
            })

            const curve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(-10, 0, 10),
                new THREE.Vector3(-5, 5, 5),
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(5, -5, 5),
                new THREE.Vector3(10, 0, 10)
            ]);
            let tubeGeometry = new THREE.TubeGeometry(curve, 80, 0.1);
            let mesh = new THREE.Mesh(tubeGeometry, material);
            scene.add(mesh);
        },
        animate() {
            if (tu) {
                tu.offset.x -= 0.01;
            }
            requestAnimationFrame(this.animate);
            renderer.render(scene, camera);
        }
    }
}
</script>
<style scoped>

</style>