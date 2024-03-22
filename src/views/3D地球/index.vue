<template>
    <canvas id="mainCanvas"></canvas>
</template>

<script>
import * as THREE from 'three';
import {OrbitControls} from "three/addons/controls/OrbitControls.js";

let renderer, camera, scene, controls;
const rotateSlowArr = [];
const bigByOpacityArr = [];
const moveArr = [];
let opacitys = [];
const lines = [];
let landOrbitObject = new THREE.Object3D();
let earthObject = new THREE.Object3D();
let moonObject = new THREE.Object3D();
const loader = new THREE.TextureLoader();
const geometryLz = new THREE.BufferGeometry();
const globeRadius = 5;
let indexBol = true;

const vertexShader = `
        attribute float aOpacity;
        uniform float uSize;
        varying float vOpacity;

        void main(){
            gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
            gl_PointSize = uSize;

            vOpacity=aOpacity;
        }
        `
const fragmentShader = `
          varying float vOpacity;
          uniform vec3 uColor;

          float invert(float n){
              return 1.-n;
          }

          void main(){
            if(vOpacity <=0.2){
                discard;
            }
            vec2 uv=vec2(gl_PointCoord.x,invert(gl_PointCoord.y));
            vec2 cUv=2.*uv-1.;
            vec4 color=vec4(1./length(cUv));
            color*=vOpacity;
            color.rgb*=uColor;

            gl_FragColor=color;
          }
          `
export default {
    mounted() {
        this.init();
        this.animate();
    },
    methods: {
        init() {
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0x020924);

            camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
            camera.position.set(5, -20, 200);
            camera.lookAt(0, 3, 0);

            renderer = new THREE.WebGLRenderer({
                antialias: true,
                canvas: document.getElementById('mainCanvas')
            })
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);

            controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.enableZoom = true;
            controls.autoRotate = false;
            controls.autoRotateSpeed = 2;
            controls.enablePan = false;

            const ambientLight = new THREE.AmbientLight(0xcccccc, 1.1);
            scene.add(ambientLight);
            const directionLight1 = new THREE.DirectionalLight(0xffffff, 0.2);
            directionLight1.position.set(1, 0.1, 0).normalize();
            const directionLight2 = new THREE.DirectionalLight(0xf2ffff, 0.2);
            directionLight2.position.set(1, 0.1, 0.1).normalize();
            scene.add(directionLight1);
            scene.add(directionLight2);
            const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.2);
            hemiLight.position.set(0, 1, 0);
            scene.add(hemiLight);
            const directionLight3 = new THREE.DirectionalLight(0xffffff);
            directionLight3.position.set(1, 500, -20);
            directionLight3.castShadow = true;
            directionLight3.shadow.camera.top = 18;
            directionLight3.shadow.camera.bottom = -10;
            directionLight3.shadow.camera.left = -52;
            directionLight3.shadow.camera.right = 12;
            scene.add(directionLight3);

            // 绘制星空背景
            this.bg();
            this.earth();
            this.drawChart();
            this.dazzleLight();
        },
        generateSprite() {
            const canvas = document.createElement('canvas');
            canvas.width = 16;
            canvas.height = 16;
            const context = canvas.getContext('2d');
            const gradient = context.createRadialGradient(
                canvas.width / 2,
                canvas.height / 2,
                0,
                canvas.width / 2,
                canvas.height / 2,
                canvas.width / 2,
            )
            gradient.addColorStop(0, 'rgba(255,255,255,1)')
            gradient.addColorStop(0.2, 'rgba(0,255,255,1)')
            gradient.addColorStop(0.4, 'rgba(0,0,64,1)')
            gradient.addColorStop(1, 'rgba(0,0,0,1)')
            context.fillStyle = gradient;
            context.fillRect(0, 0, canvas.width, canvas.height);
            const texture = new THREE.CanvasTexture(canvas);
            return texture;
        },
        bg() {
            const positions = [];
            const geometry = new THREE.BufferGeometry();
            for (let i = 0; i < 10000; i++) {
                const vertex = new THREE.Vector3();
                vertex.x = Math.random() * 2 - 1;
                vertex.y = Math.random() * 2 - 1;
                vertex.z = Math.random() * 2 - 1;
                positions.push(vertex.x, vertex.y, vertex.z);
            }
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            geometry.computeBoundingSphere();

            const startMaterial = new THREE.PointsMaterial({
                map: this.generateSprite(),
                size: 2,
                transparent: true,
                opacity: 1,
                blending: THREE.AdditiveBlending,
                sizeAttenuation: true,
            })
            let starts = new THREE.Points(geometry, startMaterial);
            starts.scale.set(300, 300, 300);
            scene.add(starts);
        },
        earth() {
            const radius = globeRadius;
            const widthSegments = 100;
            const heightSegments = 100;
            const sphereGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);

            const earthTexture = loader.load('img/earth.jpg');
            const earthMaterial = new THREE.MeshStandardMaterial({
                map: earthTexture,
            })
            const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);

            const moonTexture = loader.load('img/moon.jpg');
            const moonMaterial = new THREE.MeshPhongMaterial({
                map: moonTexture
            })
            const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
            moonMesh.scale.set(0.1, 0.1, 0.1);
            moonMesh.position.x = 10;

            moonObject.add(moonMesh);
            moonObject._y = 0;
            moonObject._s = 1;
            rotateSlowArr.push(moonObject);

            earthObject.add(earthMesh);
            earthObject.rotation.set(0.5, 2.9, 0.1);
            earthObject._y = 2.0;
            earthObject._s = 0.1;
            rotateSlowArr.push(earthObject);

            landOrbitObject.add(earthObject);
            landOrbitObject.add(moonObject);
            scene.add(landOrbitObject);
        },
        spotCircle(spot) {
            // 圆
            const geometry1 = new THREE.CircleGeometry(0.01, 100);
            const material1 = new THREE.MeshBasicMaterial({color: 0xff0000, side: THREE.DoubleSide});
            const circle = new THREE.Mesh(geometry1, material1);
            circle.position.set(spot[0], spot[1], spot[2]);
            // mesh在球面上的法线方向(球心和球面坐标构成的方向向量)
            const coordVec3 = new THREE.Vector3(spot[0], spot[1], spot[2]).normalize();
            // mesh默认在XOY平面上，法线方向沿着z轴new THREE.Vector3(0, 0, 1)
            const meshNormal = new THREE.Vector3(0, 0, 1);
            circle.quaternion.setFromUnitVectors(meshNormal, coordVec3);
            earthObject.add(circle);

            // 圆环
            const geometry2 = new THREE.RingGeometry(0.03, 0.04, 100);
            const material2 = new THREE.MeshBasicMaterial({color: 0xff0000, side: THREE.DoubleSide, transparent: true});
            const circleY = new THREE.Mesh(geometry2, material2);
            circleY.position.set(spot[0], spot[1], spot[2]);
            circleY.lookAt(new THREE.Vector3(0, 0, 0));
            earthObject.add(circleY);
            bigByOpacityArr.push(circleY);
        },
        // 线上移动物体
        moveSpot(curve) {
            // 线上的移动物体
            const aGeo = new THREE.SphereGeometry(0.04, 0.04, 0.04)
            const aMater = new THREE.MeshPhongMaterial({color: 0xff0000, side: THREE.DoubleSide})
            const aMesh = new THREE.Mesh(aGeo, aMater)
            // 保存曲线实例
            aMesh.curve = curve
            aMesh._s = 0

            moveArr.push(aMesh)
            earthObject.add(aMesh)
        },
        // 连接两个点 三维三次贝塞尔曲线
        lineConnect(posStart, posEnd) {
            const v0 = this.lglt2xyz(posStart[0], posStart[1], globeRadius)
            const v3 = this.lglt2xyz(posEnd[0], posEnd[1], globeRadius)

            // angleTo() 计算向量的夹角
            const angle = v0.angleTo(v3)
            let vtop = v0.clone().add(v3)
            // multiplyScalar 将该向量与所传入的 标量进行相乘
            vtop = vtop.normalize().multiplyScalar(globeRadius)

            let n
            if (angle <= 1) {
                n = (globeRadius / 5) * angle
            } else if (angle > 1 && angle < 2) {
                n = (globeRadius / 5) * Math.pow(angle, 2)
            } else {
                n = (globeRadius / 5) * Math.pow(angle, 1.5)
            }

            const v1 = v0
                .clone()
                .add(vtop)
                .normalize()
                .multiplyScalar(globeRadius + n)
            const v2 = v3
                .clone()
                .add(vtop)
                .normalize()
                .multiplyScalar(globeRadius + n)
            // 三维三次贝塞尔曲线(v0起点，v1第一个控制点，v2第二个控制点，v3终点)
            const curve = new THREE.CubicBezierCurve3(v0, v1, v2, v3)

            // 绘制 目标位置
            this.spotCircle([v0.x, v0.y, v0.z])
            this.spotCircle([v3.x, v3.y, v3.z])
            this.moveSpot(curve)

            const lineGeometry = new THREE.BufferGeometry()
            // 获取曲线 上的50个点
            let points = curve.getPoints(50)
            let positions = []
            let colors = []
            let color = new THREE.Color()

            // 给每个顶点设置演示 实现渐变
            for (let j = 0; j < points.length; j++) {
                color.setHSL(0.81666 + j, 0.88, 0.715 + j * 0.0025) // 粉色
                colors.push(color.r, color.g, color.b)
                positions.push(points[j].x, points[j].y, points[j].z)
            }
            // 放入顶点 和 设置顶点颜色
            lineGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3, true))
            lineGeometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3, true))

            const material = new THREE.LineBasicMaterial({vertexColors: THREE.VertexColors, side: THREE.DoubleSide})
            const line = new THREE.Line(lineGeometry, material)

            earthObject.add(line)
        },
        drawChart() {
            let markPos = this.lglt2xyz(106.553091, 29.57337, 5);
            this.spotCircle([markPos.x, markPos.y, markPos.z]);
            let markPos2 = this.lglt2xyz(106.553091, 33.57337, 5);
            this.spotCircle([markPos2.x, markPos2.y, markPos2.z]);
            let markPos3 = this.lglt2xyz(111.553091, 29.57337, 5);
            this.spotCircle([markPos3.x, markPos3.y, markPos3.z]);

            this.lineConnect([121.48, 31.23], [116.4, 39.91])
            this.lineConnect([121.48, 31.23], [121.564136, 25.071558])
            this.lineConnect([121.48, 31.23], [104.896185, 11.598253])
            this.lineConnect([121.48, 31.23], [130.376441, -16.480708])
            this.lineConnect([121.48, 31.23], [-71.940328, -13.5304])
            this.lineConnect([121.48, 31.23], [-3.715707, 40.432926])
        },
        // 边界炫光
        dazzleLight() {
            const loader = new THREE.FileLoader()
            loader.load('/file/100000.json', (data) => {
                const jsondata = JSON.parse(data)
                console.log('🚀 ~ file: index.html:454 ~ loader.load ~ jsondata:', jsondata)

                // 中国边界
                const feature = jsondata.features[0]
                const province = new THREE.Object3D()
                province.properties = feature.properties.name
                // 点数据
                const coordinates = feature.geometry.coordinates

                coordinates.forEach((coordinate) => {
                    // coordinate 多边形数据
                    coordinate.forEach((rows) => {
                        // 绘制线
                        const line = this.lineDraw(rows, 0xaa381e)
                        province.add(line)
                    })
                })
                // 添加地图边界
                earthObject.add(province)

                // 拉平 为一维数组
                const positions = new Float32Array(lines.flat(1))
                // 设置顶点
                geometryLz.setAttribute('position', new THREE.BufferAttribute(positions, 3))
                // 设置 粒子透明度为 0
                opacitys = new Float32Array(positions.length).map(() => 0)
                geometryLz.setAttribute('aOpacity', new THREE.BufferAttribute(opacitys, 1))

                geometryLz.currentPos = 0
                // 炫光移动速度
                geometryLz.pointSpeed = 20

                // 控制 颜色和粒子大小
                const params = {
                    pointSize: 2.0,
                    pointColor: '#4ec0e9'
                }

                // 创建着色器材质
                const material = new THREE.ShaderMaterial({
                    vertexShader: vertexShader,
                    fragmentShader: fragmentShader,
                    transparent: true, // 设置透明
                    uniforms: {
                        uSize: {
                            value: params.pointSize
                        },
                        uColor: {
                            value: new THREE.Color(params.pointColor)
                        }
                    }
                })
                const points = new THREE.Points(geometryLz, material)

                earthObject.add(points)
            })
        },
        lineDraw(polygon, color) {
            const lineGeometry = new THREE.BufferGeometry()
            const pointsArray = new Array()
            polygon.forEach((row) => {
                // 转换坐标
                const xyz = this.lglt2xyz(row[0], row[1], globeRadius)
                // 创建三维点
                pointsArray.push(xyz)

                if (indexBol) {
                    // 为了好看 这里只要内陆边界
                    lines.push([xyz.x, xyz.y, xyz.z])
                }
            })

            indexBol = false

            // 放入多个点
            lineGeometry.setFromPoints(pointsArray)

            const lineMaterial = new THREE.LineBasicMaterial({
                color: color
            })
            return new THREE.Line(lineGeometry, lineMaterial)
        },
        // 经纬度转换为坐标
        lglt2xyz(lng, lat, radius) {
            // 以z轴正方向为起点的水平方向弧度值
            const theta = (90 + lng) * (Math.PI / 180);
            // 以y轴正方向为起点的垂直方向弧度值
            const phi = (90 - lat) * (Math.PI / 180);
            return new THREE.Vector3().setFromSpherical(new THREE.Spherical(radius, phi, theta));
        },
        animate(time) {
            requestAnimationFrame(this.animate);
            this.render(time);
        },
        render(time) {
            time *= 0.003;
            // rotateSlowArr.forEach(obj => {
            //     obj.rotation.y = obj._y + time + obj._s;
            // })
            moveArr.forEach(function (mesh) {
                mesh._s += 0.01
                let tankPosition = new THREE.Vector3()
                tankPosition = mesh.curve.getPointAt(mesh._s % 1)
                mesh.position.set(tankPosition.x, tankPosition.y, tankPosition.z)
            })
            controls.update();
            renderer.clear();
            renderer.render(scene, camera);
        }
    }
}
</script>

<style scoped>

</style>