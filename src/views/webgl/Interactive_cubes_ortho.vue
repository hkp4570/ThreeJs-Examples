<template>
    <canvas id="mainCanvas"></canvas>
</template>

<script>
import * as THREE from 'three';

let renderer, camera, scene, raycaster;
let pointer = new THREE.Vector2();
const frustumSize = 40;
let theta = 0;
const radius = 50;
let INTERSECTED;
export default {
    mounted() {
        this.init();
        this.animate();
    },
    methods: {
        init() {
            const aspect = window.innerWidth / window.innerHeight;
            camera = new THREE.OrthographicCamera(frustumSize * aspect / -2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / -2, 0.1, 100);

            scene = new THREE.Scene();
            scene.background = new THREE.Color(0xf0f0f0);

            renderer = new THREE.WebGLRenderer({
                antialias: true,
                canvas: document.getElementById('mainCanvas')
            })
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);

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
            }
            raycaster = new THREE.Raycaster();
            window.addEventListener('resize', this.onResize);
            document.addEventListener('pointermove', this.onPointerMove);
        },
        onResize() {
            const aspect = window.innerWidth / window.innerHeight;

            camera.left = - frustumSize * aspect / 2;
            camera.right = frustumSize * aspect / 2;
            camera.top = frustumSize / 2;
            camera.bottom = - frustumSize / 2;

            camera.updateProjectionMatrix();

            renderer.setSize( window.innerWidth, window.innerHeight );
        },
        onPointerMove(event) {
            pointer.x = ( (event.clientX - 200) / window.innerWidth ) * 2 - 1;
            pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        },
        animate() {
            requestAnimationFrame(this.animate);
            this.render();
        },
        render() {
            theta += 0.1;

            camera.position.x = radius * Math.sin( THREE.MathUtils.degToRad( theta ) );
            camera.position.y = radius * Math.sin( THREE.MathUtils.degToRad( theta ) );
            camera.position.z = radius * Math.cos( THREE.MathUtils.degToRad( theta ) );
            camera.lookAt( scene.position );

            camera.updateMatrixWorld();

            // find intersections

            raycaster.setFromCamera( pointer, camera );

            const intersects = raycaster.intersectObjects( scene.children, false );

            if ( intersects.length > 0 ) {

                if ( INTERSECTED != intersects[ 0 ].object ) {

                    if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

                    INTERSECTED = intersects[ 0 ].object;
                    INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
                    INTERSECTED.material.emissive.setHex( 0xff0000 );

                }

            } else {

                if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

                INTERSECTED = null;

            }

            renderer.render( scene, camera );
        }
    }
}
</script>