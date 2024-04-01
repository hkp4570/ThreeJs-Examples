<template>
    <div class="shape_wrapper" ref="container">
        <canvas id="mainCanvas"></canvas>
    </div>
</template>

<script>
import * as THREE from 'three';

let scene, camera, renderer, group;
let windowHalfX = window.innerWidth / 2;

let pointerX = 0;
let pointerXOnPointerDown = 0;

let targetRotation = 0;
let targetRotationOnPointerDown = 0;
export default {
    mounted() {
        this.init();
        this.animate();
    },
    methods: {
        init() {
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0xf0f0f0);

            camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
            camera.position.set(0, 150, 500);
            scene.add(camera);

            renderer = new THREE.WebGLRenderer({
                antialias: true,
                canvas: document.getElementById('mainCanvas')
            })
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);

            const light = new THREE.PointLight(0xffffff, 2.5, 0, 0);
            camera.add(light);

            group = new THREE.Group();
            group.position.y = 50;
            scene.add(group);

            const loader = new THREE.TextureLoader();
            const texture = loader.load('/texture/uv_grid_opengl.jpg');
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.wrapT = texture.wrapS = THREE.RepeatWrapping;
            texture.repeat.set(0.008, 0.008);

            function addShape(shape, extrudeSetting, color, x, y, z, rx, ry, rz, s) {
                // 环形缓冲几何体
                let geometry = new THREE.ShapeGeometry(shape);
                let mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
                    side: THREE.DoubleSide,
                    map: texture
                }));
                mesh.position.set(x, y, z - 175);
                mesh.rotation.set(rx, ry, rz);
                mesh.scale.set(s, s, s);
                group.add(mesh);

                geometry = new THREE.ShapeGeometry(shape);
                mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color, side: THREE.DoubleSide}));
                mesh.position.set(x, y, z - 125);
                mesh.rotation.set(rx, ry, rz);
                mesh.scale.set(s, s, s);
                group.add(mesh);

                geometry = new THREE.ExtrudeGeometry(shape, extrudeSetting);
                mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color: color}));
                mesh.position.set(x, y, z - 75);
                mesh.rotation.set(rx, ry, rz);
                mesh.scale.set(s, s, s);
                group.add(mesh);

                addLineShape(shape, color, x, y, z, rx, ry, rz, s);
            }

            function addLineShape(shape, color, x, y, z, rx, ry, rz, s) {
                shape.autoClose = true;
                const points = shape.getPoints(); // 获取不均匀的点
                const spacedPoints = shape.getSpacedPoints(50); // 获取50个均匀的点

                const geometryPoint = new THREE.BufferGeometry().setFromPoints(points);
                const geometrySpacedPoint = new THREE.BufferGeometry().setFromPoints(spacedPoints);

                let line = new THREE.Line(geometryPoint, new THREE.LineBasicMaterial({color}));
                line.position.set(x, y, z - 25);
                line.rotation.set(rx, ry, rz);
                line.scale.set(s, s, s);
                group.add(line);

                line = new THREE.Line(geometrySpacedPoint, new THREE.LineBasicMaterial({color}));
                line.position.set(x, y, z + 25);
                line.rotation.set(rx, ry, rz);
                line.scale.set(s, s, s);
                group.add(line);

                let particles = new THREE.Points(geometryPoint, new THREE.PointsMaterial({color, size: 4}));
                particles.position.set(x, y, z + 75);
                particles.rotation.set(rx, ry, rz);
                particles.scale.set(s, s, s);
                group.add(particles);

                // 没有闭合
                particles = new THREE.Points( geometrySpacedPoint, new THREE.PointsMaterial( { color: color, size: 4 } ) );
                particles.position.set( x, y, z + 125 );
                particles.rotation.set( rx, ry, rz );
                particles.scale.set( s, s, s );
                group.add( particles );
            }

            // triangle
            const triangleShape = new THREE.Shape()
                .moveTo(80, 20)
                .lineTo(40, 80)
                .lineTo(120, 80)
                .moveTo(80, 20);

            const sqlLength = 80;
            const squareShape = new THREE.Shape()
                .moveTo(0,0)
                .lineTo(0, sqlLength)
                .lineTo(sqlLength, sqlLength)
                .lineTo(sqlLength,0)
                .lineTo(0,0)

            const extrudeSettings = {
                depth: 8,
                bevelEnabled: true,
                bevelSegments: 2,
                steps: 2,
                bevelSize: 1,
                bevelThickness: 1
            }
            addShape(triangleShape, extrudeSettings, 0x8080f0, -180, 0, 0, 0, 0, 0, 1);
            addShape( squareShape, extrudeSettings, 0x0040f0, 150, 100, 0, 0, 0, 0, 1 );

            window.addEventListener('resize', this.onResize);
            this.$refs.container.addEventListener('pointerdown', this.onPointerDown);
        },
        onResize() {
            windowHalfX = window.innerWidth / 2;
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        },
        onPointerDown(event) {
            pointerXOnPointerDown = event.offsetX - windowHalfX;
            targetRotationOnPointerDown = targetRotation;

            this.$refs.container.addEventListener('pointermove', this.onPointerMove);
            this.$refs.container.addEventListener('pointerup', this.onPointerUp);
        },
        onPointerMove(event) {
            pointerX = event.offsetX - windowHalfX;
            targetRotation = targetRotationOnPointerDown + (pointerX - pointerXOnPointerDown) * 0.02;
        },
        onPointerUp() {
            this.$refs.container.removeEventListener('pointermove', this.onPointerMove);
            this.$refs.container.removeEventListener('pointerup', this.onPointerUp);
        },
        animate() {
            requestAnimationFrame(this.animate);
            group.rotation.y += (targetRotation - group.rotation.y) * 0.05;
            renderer.render(scene, camera);
        }
    }
}
</script>
<style scoped>
.shape_wrapper {
    width: 100%;
    height: 100%;
}
</style>