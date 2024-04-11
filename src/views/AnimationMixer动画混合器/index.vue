<template>
<canvas id="mainCanvas"></canvas>
</template>

<script>
import * as THREE from 'three';
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {FBXLoader} from "three/addons";

let scene, renderer, camera, controls;
const clock = new THREE.Clock();
let mixer = null;
let keyNum = 1;

export default {
    mounted() {
        this.init();
        this.animate();
    },
    methods:{
        init(){
          scene = new THREE.Scene();
          scene.background = new THREE.Color(0x87ceeb);
          scene.fog = new THREE.Fog(0x87ceeb, 200, 10000);

          camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
          camera.position.set(0, 100, 500);
          camera.lookAt(scene.position);

          renderer = new THREE.WebGLRenderer({
            antialias: true,
            canvas: document.getElementById('mainCanvas')
          })
          renderer.setPixelRatio(window.devicePixelRatio);
          renderer.setSize(window.innerWidth, window.innerHeight);

          controls=new OrbitControls(camera, renderer.domElement);

          const axes = new THREE.AxesHelper(700);
          scene.add(axes);

          const light = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
          scene.add(light);

          {
            const loader = new THREE.TextureLoader();
            const texture = loader.load('/texture/ground.jpg');
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.magFilter = THREE.NearestFilter;
            texture.repeat.set(100,100);

            const geometry = new THREE.PlaneGeometry(10000, 10000);
            const material = new THREE.MeshPhongMaterial({
              map: texture,
              side: THREE.DoubleSide
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.rotation.x = Math.PI * -0.5;
            scene.add(mesh);
          }

          let actions = [];
          let gui={};

          {
            const loader = new FBXLoader();
            loader.load('/models/Naruto.fbx', (object) => {
              console.log(object, 'object');
              object.position.y = 110;
              scene.add(object);

              mixer = new THREE.AnimationMixer(object);
              for (let i = 0; i < object.animations.length; i++) {
                actions[i] = mixer.clipAction(object.animations[i]);
              }
              gui['action'] = function(s){
                for (let j = 0; j < actions.length; j++) {
                  if(j === s){
                    actions[j].play();
                  }else{
                    actions[j].stop();
                  }
                }
              }
            });
          }
          document.addEventListener('keydown', function(e){
            if(e && e.code ==='Space'){
              if(keyNum === 27){
                keyNum = 1;
              }
              keyNum += 1;
              gui['action'](keyNum);
            }
          })
        },
        animate(){
          const time = clock.getDelta();
          if(mixer){
            mixer.update(time);
          }
          requestAnimationFrame(this.animate);
          renderer.render(scene, camera);
          controls.update();
        }
    }
}
</script>