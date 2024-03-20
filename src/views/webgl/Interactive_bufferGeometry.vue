<template>
    <canvas id="mainCanvas"></canvas>
</template>
<script>
import * as THREE from 'three';

let renderer, camera, scene, mesh;
let raycaster = new THREE.Raycaster(), pointer = new THREE.Vector2();
let line;
export default {
    mounted() {
        this.init();
        this.animate();
    },
    methods: {
        init() {
            scene = new THREE.Scene();
            // scene.background = new THREE.Color(0x050505);
            // scene.fog = new THREE.Fog(0x050505,2000,3500);

            camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
            camera.position.z = 100;
            camera.lookAt(0, 0, 0);

            renderer = new THREE.WebGLRenderer({
                antialias: true,
                canvas: document.getElementById('mainCanvas')
            })
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);

            scene.add(new THREE.AmbientLight(0x444444, 3));

            const light1 = new THREE.DirectionalLight(0xffffff, 1.5);
            scene.position.set(1, 1, 1);
            scene.add(light1);

            const light2 = new THREE.DirectionalLight(0xffffff, 4.5);
            scene.position.set(0, -1, 0);
            scene.add(light2);

            const axesHelper = new THREE.AxesHelper(600);
            scene.add(axesHelper);

            const positions = new Float32Array([
                0, 0, 0,
                0, 10, 0,
                10, 0, 0,
            ])
            const colors = new Float32Array([
                1, 0, 0,
                1, 1, 0,
                0, 1, 0
            ])
            const normals = new Float32Array([
                0, 0, 1,
                0, 0, 1,
                0, 0, 1
            ])
            let geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
            geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
            geometry.computeBoundingSphere();

            let material = new THREE.MeshPhongMaterial({
                color: 0xaaaaaa,
                specular: 0xffffff,
                shininess: 250,
                side: THREE.DoubleSide,
                vertexColors: true,
            })
            mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);

            geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(4 * 3), 3));
            material = new THREE.LineBasicMaterial({color: 0xffffff, transparent: true});
            line = new THREE.Line(geometry, material);
            scene.add(line);

            window.addEventListener('resize', this.onResize);
            document.addEventListener('pointermove', this.onPointerMove);

        },
        onResize() {
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

            raycaster.setFromCamera(pointer, camera);
            const intersects = raycaster.intersectObject(mesh);
            if (intersects.length > 0) {
                const intersect = intersects[0];
                const face = intersect.face;

                const linePosition = line.geometry.attributes.position;
                const meshPosition = mesh.geometry.attributes.position;

                linePosition.copyAt(0, meshPosition, face.a);
                linePosition.copyAt(1, meshPosition, face.b);
                linePosition.copyAt(2, meshPosition, face.c);
                linePosition.copyAt(3, meshPosition, face.a);

                mesh.updateMatrix();
                line.geometry.applyMatrix4(mesh.matrix);
                line.visible = true;
            } else {
                line.visible = false;
            }
            renderer.render(scene, camera);
        },
    }
}
</script>

<style scoped>

</style>