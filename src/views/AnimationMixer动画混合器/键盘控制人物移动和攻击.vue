<template>
  <canvas id="mainCanvas"></canvas>
</template>

<script>
import * as THREE from 'three';
import {FBXLoader} from "three/addons";

let scene, renderer, camera;
const clock = new THREE.Clock();
let mixer = null;
let dlight = null;
let keyCodeW = false, keyCodeA = false, keyCodeS = false, keyCodeD = false, keyCodeK = false;
let meshHY = null;
let moveNum = false;
let gui = {};
// 踢 8 9 10
let attackList = [12, 8, 9, 10] // 连招的循序
let attackCombo = true
let skills = 0 // 下标
let clickNum = 0 // 点击次数

export default {
  mounted() {
    this.init();
    this.animate();
  },
  methods: {
    init() {
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x87ceeb);
      scene.fog = new THREE.Fog(0x87ceeb, 200, 10000);

      camera = new THREE.PerspectiveCamera(40, 2, 0.1, 10000);
      camera.position.set(-1000, 1000, 100);
      camera.lookAt(scene.position);

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: document.getElementById('mainCanvas')
      })
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.shadowMap.enabled = true;

      const axes = new THREE.AxesHelper(700);
      scene.add(axes);

      const light = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
      scene.add(light);

      // 方向光
      {
        const light = new THREE.DirectionalLight(0xaaaaaa);
        light.position.set(0, 200, 100);
        light.lookAt(new THREE.Vector3());

        light.castShadow = true;
        light.shadow.camera.top = 300;
        light.shadow.camera.bottom = -300;
        light.shadow.camera.left = -300;
        light.shadow.camera.right = 300;
        dlight = light;
        scene.add(dlight);
      }
      // 地面
      {
        const loader = new THREE.TextureLoader();
        const texture = loader.load('/texture/ground.jpg');
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.magFilter = THREE.NearestFilter;
        texture.repeat.set(100, 100);

        const geometry = new THREE.PlaneGeometry(10000, 10000);
        const material = new THREE.MeshPhongMaterial({
          map: texture,
          side: THREE.DoubleSide
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = Math.PI * -0.5;
        mesh.receiveShadow = true; // 接收阴影
        scene.add(mesh);
      }

      let actions = [];
      {
        const loader = new FBXLoader();
        loader.load('/models/Naruto.fbx', (object) => {
          console.log(object, 'object');
          object.position.y = 110;
          // 模型的每个部位都可以投影
          object.traverse(function (child) {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          })
          dlight.target = object;
          meshHY = object;
          scene.add(object);

          mixer = new THREE.AnimationMixer(object);
          for (let i = 0; i < object.animations.length; i++) {
            actions[i] = mixer.clipAction(object.animations[i]);
          }
          gui['action'] = function (s) {
            for (let j = 0; j < actions.length; j++) {
              if (j === s) {
                actions[j].play();
              } else {
                actions[j].stop();
              }
            }
          }
        });
      }
      document.addEventListener('keydown', function (e) {
        const ev = e || window.event;
        switch (ev.keyCode) {
          case 87:
            keyCodeW = true;
            break;
          case 65:
            keyCodeA = true;
            break;
          case 83:
            keyCodeS = true;
            break;
          case 68:
            keyCodeD = true;
            break;
          case 75:
            keyCodeK = true;
            break;
        }
      }, false)
      document.addEventListener('keyup', function (e) {
        const ev = e || window.event;
        switch (ev.keyCode) {
          case 87:
            keyCodeW = false;
            break;
          case 65:
            keyCodeA = false;
            break;
          case 83:
            keyCodeS = false;
            break;
          case 68:
            keyCodeD = false;
            break;
        }
      }, false)
    },
    onCodeMove(mesh) {
      if (keyCodeW) {
        mesh.position.x += 2;
        camera.position.x += 2;
        dlight.position.x += 2;
        mesh.rotation.y = Math.PI * 0.5;
      }
      if (keyCodeS) {
        mesh.position.x -= 2;
        camera.position.x -= 2;
        dlight.position.x -= 2;
        mesh.rotation.y = Math.PI * 1.5;
      }
      if (keyCodeA) {
        mesh.position.z -= 2;
        camera.position.z -= 2;
        dlight.position.z -= 2;
        mesh.rotation.y = Math.PI;
      }
      if (keyCodeD) {
        mesh.position.z += 2;
        camera.position.z += 2;
        dlight.position.z += 2;
        mesh.rotation.y = Math.PI * 2;
      }
      if (keyCodeW && keyCodeD) {
        mesh.rotation.y = Math.PI * 0.25;
      }
      if (keyCodeW && keyCodeA) {
        mesh.rotation.y = Math.PI * 0.75
      }
      if (keyCodeA && keyCodeS) {
        mesh.rotation.y = Math.PI * 1.25
      }
      if (keyCodeS && keyCodeD) {
        mesh.rotation.y = Math.PI * 1.75
      }
      if (keyCodeK) {
        this.attack();
      } else {
        this.resetMove();
      }
    },
    attack() {
      clickNum++;
      if (attackCombo) {
        attackCombo = false;
        gui['action'](attackList[skills]);
        this.timeCallback();
      }
    },
    timeCallback() {
      setTimeout(() => {
        skills++;
        if (skills === clickNum || skills > attackList.length - 1) {
          skills = 0
          clickNum = 0
          attackCombo = true
          keyCodeK = false
          moveNum = true
        } else {
          gui['action'](attackList[skills]);
          this.timeCallback();
        }
      }, meshHY.animations[attackList[skills]].duration * 1000)
    },
    resetMove() {
      if (keyCodeW || keyCodeA || keyCodeS || keyCodeD) {
        gui['action'](3);
        moveNum = true;
      } else {
        if (moveNum) {
          moveNum = false;
          gui['action'](24);
        }
      }
    },
    animate() {
      const time = clock.getDelta();
      if (mixer) {
        mixer.update(time);
      }
      if (meshHY) {
        this.onCodeMove(meshHY);
      }
      requestAnimationFrame(this.animate);
      renderer.render(scene, camera);
    }
  }
}
</script>