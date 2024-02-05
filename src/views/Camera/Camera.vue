<template>
  <canvas id="mainCanvas"></canvas>
</template>

<script>
import * as THREE from 'three';

let scene, camera, renderer;
let screen_width = window.innerWidth;
let screen_height = window.innerHeight;
let aspect = screen_width / screen_height;

let cameraPerspective, cameraOrtho;
let cameraPerspectiveHelper, cameraOrthoHelper;
let activeCamera, activeHelper, cameraRig;
let mesh;
const frustumSize = 600;
export default {
  mounted() {
    this.init();
    this.animate();
  },
  methods: {
    init() {

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(50, aspect * 0.5, 1, 10000);
      camera.position.z = 2500;

      cameraPerspective = new THREE.PerspectiveCamera(50, aspect * 0.5, 150, 1000);
      cameraPerspectiveHelper = new THREE.CameraHelper(cameraPerspective);
      scene.add(cameraPerspectiveHelper);

      cameraOrtho = new THREE.OrthographicCamera(0.5 * frustumSize * aspect / -2, 0.5 * frustumSize * aspect / 2, frustumSize / 2, frustumSize / -2, 150, 1000);
      cameraOrthoHelper = new THREE.CameraHelper(cameraOrtho);
      scene.add(cameraOrthoHelper);

      activeCamera = cameraPerspective;
      activeHelper = cameraPerspectiveHelper;

      cameraPerspective.rotation.y = Math.PI;
      cameraOrtho.rotation.y = Math.PI;

      cameraRig = new THREE.Group();
      cameraRig.add(cameraPerspective);
      cameraRig.add(cameraOrtho);
      scene.add(cameraRig);

      mesh = new THREE.Mesh(
          new THREE.SphereGeometry(100, 16, 8),
          new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true})
      );
      scene.add(mesh);

      const mesh2 = new THREE.Mesh(
          new THREE.SphereGeometry(50, 16, 8),
          new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: true})
      );
      mesh2.position.y = 150;
      mesh.add(mesh2);

      const mesh3 = new THREE.Mesh(
          new THREE.SphereGeometry(5, 16, 8),
          new THREE.MeshBasicMaterial({color: 0x0000ff, wireframe: true})
      )
      mesh3.position.z = 150;
      cameraRig.add(mesh3);

      const geometry = new THREE.BufferGeometry();
      const vertices = [];
      for (let i = 0; i < 1000; i++) {
        vertices.push(THREE.MathUtils.randFloatSpread(2000));
        vertices.push(THREE.MathUtils.randFloatSpread(2000));
        vertices.push(THREE.MathUtils.randFloatSpread(2000));
      }
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

      const particles = new THREE.Points(geometry, new THREE.PointsMaterial({color: 0x888888}));
      scene.add(particles);


      renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('mainCanvas'),
        antialias: true,
      })
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(screen_width, screen_height);
      renderer.autoClear = false;

      window.addEventListener('keydown', this.onkeydown);
      window.addEventListener('resize', this.onWindowResize);
    },
    onkeydown(event) {
      switch (event.keyCode) {
        case 79:
          activeCamera = cameraOrtho;
          activeHelper = cameraOrthoHelper;
          break;
        case 80:
          activeCamera = cameraPerspective;
          activeHelper = cameraPerspectiveHelper;
          break;
      }
    },
    onWindowResize() {
      screen_width = window.innerWidth;
      screen_height = window.innerHeight;
      aspect = screen_width / screen_height;
      renderer.setSize(screen_width, screen_height);

      camera.aspect = 0.5 * aspect;
      camera.updateProjectionMatrix();

      cameraPerspective.aspect = 0.5 * aspect;
      cameraPerspective.updateProjectionMatrix();

      cameraOrtho.left = -0.5 * aspect * frustumSize / 2;
      cameraOrtho.right = 0.5 * aspect * frustumSize / 2;
      cameraOrtho.top = frustumSize / 2;
      cameraOrtho.bottom = -frustumSize / 2;
      cameraOrtho.updateProjectionMatrix();
    },
    animate() {
      requestAnimationFrame(this.animate);
      this.render();
    },
    render() {
      const r = Date.now() * 0.0005;
      mesh.position.x = 700 * Math.cos(r);
      mesh.position.y = 700 * Math.sin(r);
      mesh.position.z = 700 * Math.sin(r);

      mesh.children[0].position.x = 70 * Math.cos(2 * r);
      mesh.children[0].position.z = 70 * Math.sin(r);
      if (activeCamera === cameraPerspective) {
        cameraPerspective.fov = 35 + 30 * Math.sin(0.5 * r);
        cameraPerspective.far = mesh.position.length();
        cameraPerspective.updateProjectionMatrix();

        cameraPerspectiveHelper.update();
        cameraPerspectiveHelper.visible = true;
        cameraOrthoHelper.visible = false;
      } else {
        cameraOrtho.far = mesh.position.length;
        cameraOrtho.updateProjectionMatrix();

        cameraOrthoHelper.update();
        cameraOrthoHelper.visible = true;
        cameraPerspectiveHelper.visible = false;
      }

      cameraRig.lookAt(mesh.position);
      renderer.clear();
      activeHelper.visible = false;
      renderer.setViewport(0, 0, screen_width / 2, screen_height);
      renderer.render(scene, activeCamera);
      activeHelper.visible = true;
      renderer.setViewport(screen_width / 2, 0, screen_width / 2, screen_height);
      renderer.render(scene, camera);
    }
  }
}
</script>

<style scoped>

</style>