<template>
    <canvas id="mainCanvas"></canvas>
</template>

<script>
import * as THREE from 'three';

let renderer, camera, scene;
let rollOverMesh, rollOverMaterial;
let cubeGeo, cubeMaterial;
let raycaster, pointer, plane;
const objects = [];
let isShiftDown = false;
export default {
    mounted() {
        this.init();
        this.animate();
    },
    methods: {
        init() {
            camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
            camera.position.set(500, 800, 1300);
            camera.lookAt(0, 0, 0);

            scene = new THREE.Scene();
            scene.background = new THREE.Color(0xf0f0f0);

            renderer = new THREE.WebGLRenderer({
                antialias: true,
                canvas: document.getElementById('mainCanvas')
            })
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);

            const rollOverGeo = new THREE.BoxGeometry(50, 50, 50);
            rollOverMaterial = new THREE.MeshBasicMaterial({color: 0xff0000, opacity: 0.5, transparent: true});
            rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial);
            scene.add(rollOverMesh);

            const map = new THREE.TextureLoader().load('texture/square-outline-textured.png');
            map.colorSpace = THREE.SRGBColorSpace;
            cubeGeo = new THREE.BoxGeometry(50, 50, 50);
            cubeMaterial = new THREE.MeshLambertMaterial({color: 0xfeb74c, map: map});

            const gridHelper = new THREE.GridHelper(1000, 20);
            scene.add(gridHelper);

            raycaster = new THREE.Raycaster();
            pointer = new THREE.Vector2();

            const geometry = new THREE.PlaneGeometry(1000, 1000);
            geometry.rotateX(-Math.PI / 2);
            plane = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({visible: false}));
            scene.add(plane);
            objects.push(plane);

            const ambientLight = new THREE.AmbientLight(0x606060, 3);
            scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
            directionalLight.position.set(1, 0.75, 0.5).normalize();
            scene.add(directionalLight);

            window.addEventListener('resize', this.onResize);
            document.addEventListener('pointermove', this.onPointerMove);
            document.addEventListener('pointerdown', this.onPointerDown);
            document.addEventListener('keydown', this.onKeyDown);
            document.addEventListener('keyup', this.onKeyUp);

        },
        onResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        },
        onPointerMove(event) {
            pointer.x = ((event.clientX - 200) / window.innerWidth) * 2 - 1;
            pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(pointer, camera);
            const intersects = raycaster.intersectObjects(objects, false);
            if (intersects.length > 0) {
                const intersect = intersects[0];
                rollOverMesh.position.copy(intersect.point).add(intersect.face.normal);
                rollOverMesh.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
                this.animate();
            }
        },
        onPointerDown(event) {
            pointer.x = ((event.clientX - 200) / window.innerWidth) * 2 - 1;
            pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(pointer, camera);
            const intersects = raycaster.intersectObjects(objects, false);
            if (intersects.length > 0) {
                const intersect = intersects[0];
                if (isShiftDown) {
                    if (intersect.object !== plane) {
                        scene.remove(intersect.object);
                        objects.splice(objects.indexOf(intersect.object), 1);
                    }
                } else {
                    const voxel = new THREE.Mesh(cubeGeo, cubeMaterial);
                    voxel.position.copy(intersect.point).add(intersect.face.normal);
                    voxel.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
                    scene.add(voxel);
                    objects.push(voxel);
                }
                this.animate();
            }
        },
        onKeyDown(event) {
            if (event.keyCode === 16) {
                isShiftDown = true;
            }
        },
        onKeyUp(event) {
            if (event.keyCode === 16) {
                isShiftDown = false;
            }
        },
        animate() {
            renderer.render(scene, camera);
        }
    }
}
</script>

<style scoped>

</style>