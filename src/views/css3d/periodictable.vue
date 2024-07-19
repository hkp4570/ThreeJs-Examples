<script>
import * as THREE from 'three'
import { CSS3DRenderer, CSS3DObject, TrackballControls } from 'three/addons'
import TWEEN from 'three/addons/libs/tween.module';
import { table } from './static'

let scene, camera, renderer, controls
let objects = []
const targets = { table: [], sphere: [], helix: [], grid: [] }
export default {
  mounted () {
    this.init()
    this.animate()
  },
  methods: {
    init () {
      scene = new THREE.Scene()
      camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000)
      camera.position.z = 3000

      renderer = new CSS3DRenderer()
      renderer.setSize(window.innerWidth, window.innerHeight)
      document.getElementById('container').appendChild(renderer.domElement)

      controls = new TrackballControls(camera, renderer.domElement)
      controls.minDistance = 500
      controls.maxDistance = 6000
      controls.addEventListener('change', this.render)

      // table
      for (let i = 0; i < table.length; i += 5) {
        const element = document.createElement('div')
        element.className = 'element'
        element.style.backgroundColor = `rgba(0,127,127,${Math.random() * 0.5 + 0.25})`

        const number = document.createElement('div')
        number.className = 'number'
        number.textContent = (i / 5) + 1
        element.appendChild(number)

        const symbol = document.createElement('div')
        symbol.className = 'symbol'
        symbol.textContent = table[i]
        element.appendChild(symbol)

        const details = document.createElement('div')
        details.className = 'details'
        details.innerHTML = table[i + 1] + '<br>' + table[i + 2]
        element.appendChild(details)

        const objectCSS = new CSS3DObject(element)
        objectCSS.position.x = Math.random() * 4000 - 2000
        objectCSS.position.y = Math.random() * 4000 - 2000
        objectCSS.position.z = Math.random() * 4000 - 2000
        scene.add(objectCSS)

        objects.push(objectCSS)

        const object = new THREE.Object3D();
        object.position.x = ( table[ i + 3 ] * 140 ) - 1330;
        object.position.y = - ( table[ i + 4 ] * 180 ) + 990;

        targets.table.push( object );
      }

      // sphere
      const vector = new THREE.Vector3()
      for (let i = 0, l = objects.length; i < l; i++) {
        const phi = Math.acos(-1 + (2 * i) / l)
        const theta = Math.sqrt(l * Math.PI) * phi

        const object = new THREE.Object3D()
        object.position.setFromSphericalCoords(800, phi, theta)
        vector.copy(object.position).multiplyScalar(2)
        object.lookAt(vector)

        targets.sphere.push(object)
      }

      // helix
      for (let i = 0, l = objects.length; i < l; i++) {
        const theta = i * 0.175 + Math.PI;
        const y = - ( i * 8 ) + 450;
        const object = new THREE.Object3D();
        object.position.setFromCylindricalCoords( 900, theta, y );

        vector.x = object.position.x*2;
        vector.y = object.position.y;
        vector.z = object.position.z*2;

        object.lookAt(vector);
        targets.helix.push(object);
      }

      // grid
      for (let i = 0; i < objects.length; i++) {
        const object = new THREE.Object3D();
        object.position.x = ( ( i % 5 ) * 400 ) - 800;
        object.position.y = ( - ( Math.floor( i / 5 ) % 5 ) * 400 ) + 800;
        object.position.z = ( Math.floor( i / 25 ) ) * 1000 - 2000;
        targets.grid.push(object);
      }

      this.transform(targets.table, 2000);
      window.addEventListener('resize', this.onWindowResize, false);

      const buttonTable = document.getElementById('table')
      buttonTable.addEventListener('click', () => {
        this.transform(targets.table, 2000);
      })
      const buttonSphere = document.getElementById('sphere')
      buttonSphere.addEventListener('click', () => {
        this.transform(targets.sphere, 2000);
      })
      const buttonHelix = document.getElementById('helix')
      buttonHelix.addEventListener('click', () => {
        this.transform(targets.helix, 2000);
      })
      const buttonGrid = document.getElementById('grid')
      buttonGrid.addEventListener('click', () => {
        this.transform(targets.grid, 2000);
      })
    },
    transform(targets, duration){
        TWEEN.removeAll();
      for ( let i = 0; i < objects.length; i ++ ) {

        const object = objects[ i ];
        const target = targets[ i ];

        new TWEEN.Tween( object.position )
          .to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
          .easing( TWEEN.Easing.Exponential.InOut )
          .start();

        new TWEEN.Tween( object.rotation )
          .to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
          .easing( TWEEN.Easing.Exponential.InOut )
          .start();

      }

      new TWEEN.Tween( this )
        .to( {}, duration * 2 )
        .onUpdate( () => renderer.render(scene,camera) )
        .start();
    },
    onWindowResize(){
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      this.render();
    },
    animate () {
      requestAnimationFrame(this.animate)
      TWEEN.update();

      controls.update();
    },
    render () {
      renderer.render(scene, camera)
    }
  }
}
</script>

<template>
  <div>
    <div id="container"></div>
    <div id="menu">
      <button id="table">TABLE</button>
      <button id="sphere">SPHERE</button>
      <button id="helix">HELIX</button>
      <button id="grid">GRID</button>
    </div>
  </div>
</template>

<style>
.element {
  width: 120px;
  height: 160px;
  box-shadow: 0px 0px 12px rgba(0, 255, 255, 0.5);
  border: 1px solid rgba(127, 255, 255, 0.25);
  font-family: Helvetica, sans-serif;
  text-align: center;
  line-height: normal;
  cursor: default;
}

.element:hover {
  box-shadow: 0px 0px 12px rgba(0, 255, 255, 0.75);
  border: 1px solid rgba(127, 255, 255, 0.75);
}

.element .number {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 12px;
  color: rgba(127, 255, 255, 0.75);
}

.element .symbol {
  position: absolute;
  top: 40px;
  left: 0px;
  right: 0px;
  font-size: 60px;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.75);
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.95);
}

.element .details {
  position: absolute;
  bottom: 15px;
  left: 0px;
  right: 0px;
  font-size: 12px;
  color: rgba(127, 255, 255, 0.75);
}
#menu {
  position: absolute;
  bottom: 20px;
  width: 100%;
  text-align: center;
}
button {
  color: rgba(127,255,255,0.75);
  background: transparent;
  outline: 1px solid rgba(127,255,255,0.75);
  border: 0px;
  padding: 5px 10px;
  cursor: pointer;
}

button:hover {
  background-color: rgba(0,255,255,0.5);
}

button:active {
  color: #000000;
  background-color: rgba(0,255,255,0.75);
}
</style>
