<template>
<canvas id="mainCanvas"></canvas>
</template>

<script>
import * as THREE from 'three';
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {PLYLoader} from "three/addons";

let renderer, scene, camera, controls;

let windowHalfX = window.innerWidth/2;
let windowHalfY = window.innerHeight/2;

export default {
    mounted() {
        this.init();
        this.animate();
    },
    methods:{
        init(){
            scene = new THREE.Scene();

            camera = new THREE.PerspectiveCamera(50,window.innerWidth/window.innerHeight,1,100000);
            camera.position.z = -4000;

            const cubeTexture = new THREE.CubeTextureLoader().setPath('/texture/park3Med/').load([
                'px.jpg','nx.jpg',
                'py.jpg','ny.jpg',
                'pz.jpg','nz.jpg',
            ])
            cubeTexture.mapping = THREE.CubeRefractionMapping;
            scene.background = cubeTexture;

            renderer = new THREE.WebGLRenderer({
                canvas: document.getElementById('mainCanvas'),
                antialias: true,
            })
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth,window.innerHeight);
            renderer.setAnimationLoop(this.animate);

            controls = new OrbitControls(camera, renderer.domElement);

            const ambientLight = new THREE.AmbientLight(0xffffff, 3.5);
            scene.add(ambientLight);

            const loader = new PLYLoader();
            loader.load('/models/Lucy100k.ply', geometry => {
                this.createScene(geometry, cubeTexture);
            })
        },
        createScene(geometry, texture){
            geometry.computeVertexNormals(); // 计算顶点法线
            let mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
                color: 0xffffff,
                envMap: texture,
                refractionRatio: 0.98,
            }))
            mesh.scale.set(1.5,1.5,1.5);
            scene.add(mesh);

            mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
                color: 0xccfffd,
                envMap: texture,
                refractionRatio: 0.985,
            }))
            mesh.position.x = -1500;
            mesh.scale.set(1.5,1.5,1.5);
            scene.add(mesh);

            mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
                color: 0xccddff,
                envMap: texture,
                refractionRatio: 0.98,
                reflectivity: 0.9,
            }))
            mesh.position.x = 1500;
            mesh.scale.set(1.5,1.5,1.5);
            scene.add(mesh);
        },
        animate(){
            controls.update();
            renderer.render(scene,camera);
        }
    }
}
</script>

<style scoped>

</style>