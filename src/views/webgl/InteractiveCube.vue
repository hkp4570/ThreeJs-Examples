<template>
  <canvas id="mainCanvas"></canvas>
</template>

<script>
import * as THREE from 'three';

let renderer, camera, scene, rayCaster;
let theta = 0, radius = 5, INTERSECTED;
const pointer = new THREE.Vector2();
export default {
  mounted() {
    this.init();
    this.animate();
  },
  methods: {
    init() {
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf0f0f0);

      rayCaster = new THREE.Raycaster();

      camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);

      renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('mainCanvas'),
      })
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);

      const light = new THREE.DirectionalLight(0xffffff, 3);
      light.position.set(1, 1, 1).normalize();
      scene.add(light);

      const geometry = new THREE.BoxGeometry();
      for (let i = 0; i < 2000; i++) {
        const object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff}));
        object.position.x = Math.random() * 40 - 20;
        object.position.y = Math.random() * 40 - 20;
        object.position.z = Math.random() * 40 - 20;

        object.rotation.x = Math.random() * 2 * Math.PI;
        object.rotation.y = Math.random() * 2 * Math.PI;
        object.rotation.z = Math.random() * 2 * Math.PI;

        object.scale.x = Math.random() + 0.5;
        object.scale.y = Math.random() + 0.5;
        object.scale.z = Math.random() + 0.5;
        scene.add(object);

        window.addEventListener('resize', this.onWindowResize);
        document.addEventListener('mousemove', this.onPointerMove);
      }

    },
    onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    },
    onPointerMove(event) {
      pointer.x = ((event.clientX - 200) / window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    },
    animate() {
      requestAnimationFrame(this.animate);
      this.render();
    },
    render() {
      theta += 0.1;
      // 相机绕场景中心旋转
      camera.position.x = radius * Math.sin(THREE.MathUtils.degToRad(theta));
      camera.position.y = radius * Math.sin(THREE.MathUtils.degToRad(theta));
      camera.position.z = radius * Math.cos(THREE.MathUtils.degToRad(theta));
      camera.lookAt(scene.position);

      camera.updateMatrixWorld();

      rayCaster.setFromCamera(pointer, camera);

      const intersects = rayCaster.intersectObjects(scene.children, false);
      if (intersects.length > 0) {
        if(INTERSECTED !== intersects[0].object){
          if(INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

          INTERSECTED = intersects[0].object;
          INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
          INTERSECTED.material.emissive.setHex(0xff0000);
        }
      } else {
        if(INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
        INTERSECTED = null;
      }

      renderer.render(scene, camera);
    }
  }
}
</script>