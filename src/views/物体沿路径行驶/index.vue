<template>
  <canvas id="mainCanvas"></canvas>
</template>

<script>
import * as THREE from 'three';
import {OrbitControls} from "three/addons/controls/OrbitControls.js";

let camera, scene, renderer, controls;
let wheelMeshes, targetBob, targetMaterial, targetMesh, turretPivot, curve, tank, targetCamera;
const targetPosition2 = new THREE.Vector3();
const tankPosition = new THREE.Vector2();
const tankTarget = new THREE.Vector2();
let cameras = [];

export default {
  mounted() {
    this.init();
    this.animate();
  },
  methods: {
    init() {
      function createCamera(fov = 40) {
        const aspect = window.innerWidth / window.innerHeight;
        const near = 0.1;
        const far = 1000;
        return new THREE.PerspectiveCamera(fov, aspect, near, far);
      }

      scene = new THREE.Scene();
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: document.getElementById('mainCanvas'),
      });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);

      camera = createCamera();
      camera.position.set(8, 4, 10).multiplyScalar(3);
      camera.lookAt(0, 0, 0);
      controls = new OrbitControls(camera, renderer.domElement);
      controls.update();

      {
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(0, 20, 0);
        scene.add(light);
      }
      {
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(1, 2, 4);
        scene.add(light);
      }
      {
        const groundGeometry = new THREE.PlaneGeometry(50, 50);
        const groundMaterial = new THREE.MeshPhongMaterial({color: 0xcc8866, depthWrite: false});
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = Math.PI * -0.5;
        scene.add(ground);
      }

      tank = new THREE.Object3D();
      scene.add(tank);

      const carWidth = 4;
      const carHeight = 1;
      const carLength = 8;
      const bodyGeometry = new THREE.BoxGeometry(carWidth, carHeight, carLength);
      const bodyMaterial = new THREE.MeshPhongMaterial({color: 0x6688aa});
      const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
      bodyMesh.position.y = 1.4;
      tank.add(bodyMesh);

      const wheelRadius = 1;
      const wheelThickness = 0.5;
      const wheelSegments = 36;
      const wheelGeometry = new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelThickness, wheelSegments);
      const wheelMaterial = new THREE.MeshPhongMaterial({color: 0x888888});

      const wheelPositions = [
        [-carWidth / 2 - wheelThickness / 2, -carHeight / 2, carLength / 3],
        [carWidth / 2 + wheelThickness / 2, -carHeight / 2, carLength / 3],
        [-carWidth / 2 - wheelThickness / 2, -carHeight / 2, 0],
        [carWidth / 2 + wheelThickness / 2, -carHeight / 2, 0],
        [-carWidth / 2 - wheelThickness / 2, -carHeight / 2, -carLength / 3],
        [carWidth / 2 + wheelThickness / 2, -carHeight / 2, -carLength / 3]
      ];
      wheelMeshes = wheelPositions.map(position => {
        const mesh = new THREE.Mesh(wheelGeometry, wheelMaterial);
        mesh.position.set(...position);
        mesh.rotation.z = Math.PI * 0.5;
        bodyMesh.add(mesh);
        return mesh;
      })
      // 局部相机
      const tankCameraFov = 75;
      const tankCamera = createCamera(tankCameraFov);
      tankCamera.position.set(0, 3, -6);
      tankCamera.rotation.y = Math.PI;
      bodyMesh.add(tankCamera);

      const demoGeometry = new THREE.SphereGeometry(
        2,
        12,
        12,
        0,
        Math.PI * 2,
        0,
        Math.PI * 0.5,
      );
      const demoMesh = new THREE.Mesh(demoGeometry, bodyMaterial);
      bodyMesh.add(demoMesh);
      bodyMesh.position.y = 0.5;

      const turretGeometry = new THREE.BoxGeometry(0.5, 0.5, 5);
      const turretMesh = new THREE.Mesh(turretGeometry, bodyMaterial);
      turretPivot = new THREE.Object3D();
      turretPivot.position.y = 0.5;
      turretMesh.position.z = 0.25;
      turretPivot.add(turretMesh);
      bodyMesh.add(turretPivot);

      // 目标
      const targetGeometry = new THREE.SphereGeometry(0.5, 36, 36);
      targetMaterial = new THREE.MeshPhongMaterial({color: 0x00ff00, flatShading: true});
      targetMesh = new THREE.Mesh(targetGeometry, targetMaterial);
      const targetElevation = new THREE.Object3D();
      targetBob = new THREE.Object3D();
      targetElevation.position.z = 10;
      targetElevation.position.y = 8;
      targetElevation.add(targetBob);
      scene.add(targetElevation);
      targetBob.add(targetMesh);

      // 目标上的相机
      targetCamera = createCamera();
      targetCamera.position.y = 1;
      targetCamera.position.z = -2;
      targetCamera.rotation.y = Math.PI;
      targetBob.add(targetCamera);

      // 绘制移动路径
      curve = new THREE.SplineCurve([
        new THREE.Vector2(-10, 20),
        new THREE.Vector2(-5, 5),
        new THREE.Vector2(0, 0),
        new THREE.Vector2(5, -5),
        new THREE.Vector2(10, 0),
        new THREE.Vector2(5, 10),
        new THREE.Vector2(-5, 10),
        new THREE.Vector2(-10, -10),
        new THREE.Vector2(-15, -8),
        new THREE.Vector2(-10, 20)
      ]);
      const points = curve.getPoints(50);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({color: 0xff0000});
      const splineObject = new THREE.Line(geometry, material);
      splineObject.rotation.x = Math.PI * 0.5
      splineObject.position.y = 0.05
      scene.add(splineObject);

      cameras = [
        {cam: camera, desc: '全局相机'},
        {cam: targetCamera, desc: '目标上的相机'},
        {cam: tankCamera, desc: '底盘 局部相机'}
      ]
    },
    animate() {
      requestAnimationFrame(this.render);
    },
    render(time) {
      time *= 0.001;
      wheelMeshes.forEach((obj) => {
        obj.rotation.x = time * 3
      })
      targetBob.position.y = Math.sin(time * 2) * 4;
      targetMaterial.emissive.setHSL((time * 10) % 1, 1, 0.25);
      targetMaterial.color.setHSL((time * 10) % 1, 1, 0.25);
      targetMesh.getWorldPosition(targetPosition2);
      turretPivot.lookAt(targetPosition2);

      const tankTime = time * 0.05
      curve.getPointAt(tankTime % 1, tankPosition)
      curve.getPointAt((tankTime + 0.01) % 1, tankTarget)
      tank.position.set(tankPosition.x, 0, tankPosition.y)
      tank.lookAt(tankTarget.x, 0, tankTarget.y)

      const camera1 = cameras[time % cameras.length | 0]
      tank.getWorldPosition(targetPosition2)
      targetCamera.lookAt(targetPosition2)

      renderer.render(scene, camera1.cam)
    }
  }
}
</script>