<script>
import * as THREE from 'three';
let scene, camera, renderer, mixer;
const clock = new THREE.Clock();
export default {
  mounted () {
    this.init();
    // this.animate();
  },
  methods:{
    init(){
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.x = 300;
      camera.position.y = 200;
      camera.position.z = 100;
      camera.lookAt(scene.position);

      scene.background = new THREE.Color(0x000000);

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: document.getElementById('mainCanvas'),
      })
      renderer.setPixelRatio( window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);

      const geometry = new THREE.BoxGeometry(100, 100, 100);
      const material = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        wireframe: true
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(0, 0, 0);
      // 定义的name
      mesh.name ='box';
      scene.add(mesh);
      console.log(mesh)

      // 动画行为片段
      function getClip() {
        const times = [0, 1]; // 关键帧时间数组，离散的时间点序列
        const values = [0, 0, 0, 0, 100, 0]; // 与时间点对应的值组成的数组
        // 创建位置关键帧对象：0时刻对应位置0, 0, 0   10时刻对应位置150, 0, 0 这里和mesh.name要对应
        const posTrack = new THREE.VectorKeyframeTrack('box.position', times, values);
        const duration = 1;
        return new THREE.AnimationClip('stonePosClip', duration, [posTrack]);
      }

      mixer = new THREE.AnimationMixer(mesh);
      const action = mixer.clipAction(getClip());
      action.timeScale = 1;
      action.loop = THREE.LoopPingPong;
      action.play();

      this.animate();
    },
    animate(){
      const delta = clock.getDelta();
      if(mixer){
        mixer.update(delta);
      }
      requestAnimationFrame(this.animate);
      camera.lookAt(scene.position);
      renderer.render(scene,camera);
    }
  }
}
</script>

<template>
<div>
  <canvas id="mainCanvas"></canvas>
</div>
</template>

<style scoped>

</style>
