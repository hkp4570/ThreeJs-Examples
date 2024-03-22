<template>
    <canvas id="mainCanvas"></canvas>
</template>

<script>
import * as THREE from 'three';
import {OrbitControls} from "three/addons/controls/OrbitControls.js";

let scene, renderer, camera, controls;
// 墨卡托投影 将经纬度转换为平面坐标
const projection = d3.geoMercator().center([116.412318, 39.909843]).translate([0, 0]);
const map = new THREE.Object3D();
export default {
    mounted() {
        this.init();
        this.animate();
    },
    methods: {
        init() {
            scene = new THREE.Scene();

            camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
            camera.position.set(0, 0, 300);
            camera.lookAt(0, 0, 0);

            renderer = new THREE.WebGLRenderer({
                canvas: document.getElementById('mainCanvas'),
                antialias: true,
            });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);

            controls = new OrbitControls(camera, renderer.domElement);

            const light = new THREE.AmbientLight(0xffffff, 1);
            scene.add(light);
            const axesHelper = new THREE.AxesHelper(700);
            scene.add(axesHelper);

            const loader = new THREE.FileLoader();
            loader.load('/file/100000_full.json', data => {
                const jsonData = JSON.parse(data);
                console.log(jsonData, 'jsonData');
                this.operationData(jsonData);
            })
        },
        // 解析数据
        operationData(jsonData) {
            const features = jsonData.features;
            features.forEach(feature => {
                const province = new THREE.Object3D();
                province.properties = feature.properties.name;
                const coordinates = feature.geometry.coordinates;
                const color = ['重庆市', '上海市'].includes(feature.properties.name) ? 'blue' : 'yellow';

                if (feature.geometry.type === 'MultiPolygon') {
                    coordinates.forEach(coordinate => {
                        coordinate.forEach(rows => {
                            const mesh = this.drawExtrudeMesh(rows, color);
                            const line = this.lineDraw(rows, color);
                            province.add(mesh);
                            province.add(line);
                        })
                    })
                }
                if(feature.geometry.type === 'Polygon'){
                    coordinates.forEach(coordinate => {
                        const mesh = this.drawExtrudeMesh(coordinate, color);
                        const line = this.lineDraw(coordinate, color);
                        province.add(mesh);
                        province.add(line);
                    })
                }
                map.add(province);
            })
            scene.add(map);
        },
        // 绘制立体几何图形
        drawExtrudeMesh(polygon, color) {
            const shape = new THREE.Shape();
            polygon.forEach((row, i) => {
                const [x, y] = projection(row);
                if (i === 0) {
                    shape.moveTo(x, -y);
                }
                shape.lineTo(x, -y);
            })
            const geometry = new THREE.ExtrudeGeometry(shape, {
                depth: true,
                bevelEnabled: false,
            })
            const material = new THREE.MeshBasicMaterial({
                color,
                transparent: true,
                opacity: 0.5,
            })
            return new THREE.Mesh(geometry, material);
        },
        lineDraw(polygon, color) {
            const lineGeometry = new THREE.BufferGeometry();
            const pointsArray = new Array();
            polygon.forEach(row => {
                const [x, y] = projection(row);
                pointsArray.push(new THREE.Vector3(x, -y, 9));
            })
            lineGeometry.setFromPoints(pointsArray);
            const lineMaterial = new THREE.LineBasicMaterial({color});
            return new THREE.Line(lineGeometry, lineMaterial);
        },
        animate() {
            requestAnimationFrame(this.animate);
            renderer.render(scene, camera);
        }
    }
}
</script>