<template>
<canvas id="mainCanvas"></canvas>
</template>

<script>
import * as THREE from 'three';
import {OrbitControls} from "three/addons/controls/OrbitControls.js";

let scene, renderer, camera, controls;
const loader = new THREE.TextureLoader();
export default {
    mounted() {
        this.init();
        this.animate();
    },
    methods:{
        init(){
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0x87ceeb);
            scene.fog = new THREE.Fog(0x87ceeb, 200,10000)

            camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight,1,10000);
            camera.position.set(1000,500,1500);
            camera.lookAt(0,0,0);

            renderer = new THREE.WebGLRenderer({
                canvas: document.getElementById('mainCanvas'),
                antialias: true,
            })
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth,window.innerHeight);
            renderer.setAnimationLoop(this.animate);

            controls = new OrbitControls(camera,renderer.domElement);

            const axes = new THREE.AxesHelper(700);
            scene.add(axes);

            {
                const light = new THREE.HemisphereLight(0xffffff, 0x000000,1);
                scene.add(light);
            }

            {
                // 平面
                const texture = loader.load('/house/1.jpg');
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.magFilter = THREE.NearestFilter;
                texture.repeat.set(100,100);

                const planeGeometry = new THREE.PlaneGeometry(10000,10000);
                const planeMaterial = new THREE.MeshPhongMaterial({
                    map:texture,
                    side: THREE.DoubleSide,
                })
                const mesh = new THREE.Mesh(planeGeometry,planeMaterial);
                mesh.rotation.x = Math.PI * -0.5;
                scene.add(mesh);
            }
            {
                // 地面
                const texture = loader.load('/house/2.jpg');
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.magFilter = THREE.NearestFilter;
                texture.repeat.set(2,2);

                const planeGeometry = new THREE.PlaneGeometry(300,300);
                const planeMaterial = new THREE.MeshPhongMaterial({
                    map:texture,
                    side: THREE.DoubleSide,
                })
                const mesh = new THREE.Mesh(planeGeometry,planeMaterial);
                mesh.rotation.x = Math.PI * -0.5;
                mesh.position.y = 1;
                scene.add(mesh);
            }

            const extrudeSetting = {
                amount: 8,
                bevelSegments: 2,
                steps: 2,
                bevelSize: 1,
                bevelThickness: 1
            }
            {
                // 绘制侧墙
                function wallAdd(){
                    const shape = new THREE.Shape();
                    shape.moveTo(-150, 0) // 绘制方法类似canvas中的绘制方法
                    shape.lineTo(150, 0)
                    shape.lineTo(150, 150)
                    shape.lineTo(0, 200)
                    shape.lineTo(-150, 150)
                    const extrudeGeometry = new THREE.ExtrudeGeometry(shape,extrudeSetting);
                    const material = new THREE.MeshBasicMaterial({color:0xe5d890});
                    const sideWall = new THREE.Mesh(extrudeGeometry, material);
                    sideWall.position.y = 1;
                    return sideWall;
                }
                const sideWall1 = wallAdd();
                const sideWall2 = wallAdd();
                sideWall1.position.z = -150;
                sideWall2.position.z = 150;
                scene.add(sideWall1);
                scene.add(sideWall2);
            }

            {
                // 后墙
                const shape = new THREE.Shape();
                shape.moveTo(-150, 0)
                shape.lineTo(150, 0)
                shape.lineTo(150, 150)
                shape.lineTo(-150, 150)
                const extrudeGeometry = new THREE.ExtrudeGeometry(shape,extrudeSetting);
                const material = new THREE.MeshBasicMaterial({color:0xe5d890});
                const backWall = new THREE.Mesh(extrudeGeometry,material);
                backWall.position.x = -150;
                backWall.position.y = 1;
                backWall.rotation.y = Math.PI * 0.5;
                scene.add(backWall);
            }

            {
                // 前墙
                const shape = new THREE.Shape();
                shape.moveTo(-148, 0)
                shape.lineTo(148, 0)
                shape.lineTo(148, 148)
                shape.lineTo(-148, 148)

                const shape_a = new THREE.Path()
                shape_a.moveTo(30, 30)
                shape_a.lineTo(80, 30)
                shape_a.lineTo(80, 80)
                shape_a.lineTo(30, 80)
                shape_a.lineTo(30, 30)
                shape.holes.push(shape_a)

                const shape_b = new THREE.Path()
                shape_b.moveTo(-20, 0)
                shape_b.lineTo(-20, 100)
                shape_b.lineTo(-80, 100)
                shape_b.lineTo(-80, 0)
                shape_b.lineTo(-20, 0)
                shape.holes.push(shape_b)

                const extrudeGeometry = new THREE.ExtrudeGeometry(shape,extrudeSetting);
                const material = new THREE.MeshBasicMaterial({color:'grey'});
                const frontWall = new THREE.Mesh(extrudeGeometry,material);
                frontWall.rotation.y = Math.PI * 0.5;
                frontWall.position.y = 1;
                frontWall.position.x = 150;
                scene.add(frontWall);
            }

            {
                // 房顶
                function roof(){
                    const roofGeometry = new THREE.BoxGeometry(200,320,10);
                    const roofTexture = loader.load('/house/3.jpg');
                    roofTexture.wrapT = roofTexture.wrapS = THREE.RepeatWrapping;
                    roofTexture.repeat.set(2,2);
                    const textureMaterial = new THREE.MeshBasicMaterial({map:roofTexture});
                    const colorMaterial = new THREE.MeshBasicMaterial({color:'grey'});
                    const materials = [colorMaterial,colorMaterial,colorMaterial,colorMaterial,colorMaterial,textureMaterial];
                    const roof = new THREE.Mesh(roofGeometry, materials);
                    return roof;
                }
                const roof1 = roof();
                roof1.rotation.x = Math.PI / 2
                roof1.rotation.y = (-Math.PI / 4) * 0.4
                roof1.position.y = 170
                roof1.position.x = 90

                const roof2 = roof()
                roof2.rotation.x = Math.PI / 2
                roof2.rotation.y = (Math.PI / 4) * 0.4
                roof2.position.y = 170
                roof2.position.x = -90

                scene.add(roof1)
                scene.add(roof2)
            }

            {
                // 门框
                const shape = new THREE.Shape();
                shape.moveTo(-20, 0)
                shape.lineTo(-20, 100)
                shape.lineTo(-80, 100)
                shape.lineTo(-80, 0)
                shape.lineTo(-20, 0)

                const shape_c = new THREE.Path()
                shape_c.moveTo(-25, 5)
                shape_c.lineTo(-25, 95)
                shape_c.lineTo(-75, 95)
                shape_c.lineTo(-75, 5)
                shape_c.lineTo(-25, 5)

                shape.holes.push(shape_c);

                const frameGeometry = new THREE.ExtrudeGeometry(shape, extrudeSetting);
                const frameMaterial = new THREE.MeshBasicMaterial({color:'silver'});
                const frame = new THREE.Mesh(frameGeometry, frameMaterial);

                // 门
                const doorGeometry = new THREE.BoxGeometry(50,90,4);
                const doorTexture = loader.load('/house/4.jpg');
                const doorMaterial = new THREE.MeshBasicMaterial({map:doorTexture});
                const door = new THREE.Mesh(doorGeometry, doorMaterial);
                door.position.set(-50, 50, 5)

                const group = new THREE.Group();
                group.add(frame);
                group.add(door) // 往Group加入门板

                group.position.x = 143
                group.position.y = 1
                group.rotation.y = Math.PI / 2
                scene.add(group);
            }

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