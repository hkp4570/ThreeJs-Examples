<template>
    <canvas id="mainCanvas"></canvas>
</template>

<script>
import * as THREE from 'three';
import {OrbitControls} from "three/addons/controls/OrbitControls.js";

let scene, camera, renderer, controls, cube1, cube2;
export default {
    mounted() {
        this.init();
        this.animate();
    },
    methods: {
        init() {
            scene = new THREE.Scene();

            camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 10000);
            camera.position.set(0, 6, 5);
            camera.lookAt(0, 0, 0);

            renderer = new THREE.WebGLRenderer({
                canvas: document.getElementById('mainCanvas'),
                antialias: true,
            })
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setAnimationLoop(this.animate);

            controls = new OrbitControls(camera, renderer.domElement);

            {
                const light = new THREE.DirectionalLight(0xffffff, 1);
                light.position.set(-1, 10, 4);
                scene.add(light);
            }

            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const material1 = new THREE.MeshPhongMaterial({
                color: 0x6688aa,
            })
            const material2 = new THREE.MeshPhongMaterial({
                color: 0x6688aa,
            })
            cube1 = new THREE.Mesh(geometry, material1);
            cube1.position.x = -1;
            scene.add(cube1);

            cube2 = new THREE.Mesh(geometry, material2);
            cube2.position.x = 1;
            scene.add(cube2);
            console.log(cube1,'cube1')
            document.addEventListener('keydown', this.onKeydown);
        },
        onIntersect(){
            let bool = false; // 是否碰撞
            // 获取移动物体中心点的世界坐标
            const centerCoord = cube1.position.clone();
            // 获取移动物体所有顶点坐标
            const position = cube1.geometry.attributes.position;
            const vertices = [];
            for (let i = 0; i < position.count; i++) {
                vertices.push(new THREE.Vector3(position.getX(i),position.getY(i),position.getZ(i)));
            }
            // 物体移动时转换顶点坐标
            for (let i = 0; i < vertices.length; i++) {
                const vertexWorldCoord = vertices[i].clone().applyMatrix4(cube1.matrixWorld);

                const dir = vertexWorldCoord.clone().sub(centerCoord);

                const raycaster = new THREE.Raycaster(centerCoord, dir.clone().normalize());
                let intersects = raycaster.intersectObjects([cube2], true);
                if(intersects.length > 0){
                    if (intersects[0].distance < vertexWorldCoord.length()) {
                        bool = true
                    }
                }
            }
            return bool;
        },
        onKeydown(event) {
            switch (event.keyCode) {
                // 上
                case 38:
                    cube1.position.y += 0.05;
                    break;
                //     下
                case 40:
                    cube1.position.y -= 0.05;
                    break;
                //     左
                case 37:
                    cube1.position.x -= 0.05;
                    break;
                case 39:
                    cube1.position.x += 0.05;
                    break;
            }
            if(this.onIntersect()){
                cube1.material.color.set('yellow')
            } else{
                cube1.material.color.set(0x6688aa)
            }
        },
        animate() {
            controls.update();
            renderer.render(scene, camera);
        }
    }
}
</script>