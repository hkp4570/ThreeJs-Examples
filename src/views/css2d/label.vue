<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { CSS2DRenderer, CSS2DObject } from 'three/addons'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'

let scene, camera, renderer, gui, labelRenderer, controls, moon
const textureLoader = new THREE.TextureLoader()
const clock = new THREE.Clock()
export default {
  mounted () {
    this.init()
    this.animate()
  },
  methods: {
    init () {
      const EARTH_RADIUS = 1
      const MOON_RADIUS = 0.27

      scene = new THREE.Scene()

      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 200)
      camera.position.set(10, 5, 20)
      camera.lookAt(scene.position)
      camera.layers.enableAll() // 此操作将使得相机能够捕捉到所有图层的图像，适用于需要同时处理多个图层的场景。

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: document.getElementById('mainCanvas'),
      })
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(window.devicePixelRatio)

      labelRenderer = new CSS2DRenderer()
      this.$refs.container.appendChild(labelRenderer.domElement)
      labelRenderer.setSize(window.innerWidth, window.innerHeight)
      labelRenderer.domElement.style.position = 'absolute'
      labelRenderer.domElement.style.top = '0px'

      const dirLight = new THREE.DirectionalLight(0xffffff, 3)
      dirLight.position.set(0, 0, 1)
      dirLight.layers.enableAll()
      scene.add(dirLight)
      const dirHelper = new THREE.DirectionalLightHelper(dirLight, 5)
      scene.add(dirHelper)

      const axesHelper = new THREE.AxesHelper(5)
      axesHelper.layers.enableAll()
      scene.add(axesHelper)

      const earthGeometry = new THREE.SphereGeometry(EARTH_RADIUS, 16, 16)
      const earthMaterial = new THREE.MeshPhongMaterial({
        specular: 0x333333, // 材质高光颜色
        shininess: 5, // 材质高亮程度
        map: textureLoader.load('/texture/planets/earth_atmos_2048.jpg'),
        specularMap: textureLoader.load('/texture/planets/earth_specular_2048.jpg'),
        normalMap: textureLoader.load('/texture/planets/earth_normal_2048.jpg'),
        normalScale: new THREE.Vector2(0.85, 0.85),
      })
      earthMaterial.map.colorSpace = THREE.SRGBColorSpace
      const earth = new THREE.Mesh(earthGeometry, earthMaterial)
      scene.add(earth)

      const moonGeometry = new THREE.SphereGeometry(MOON_RADIUS, 16, 16)
      const moonMaterial = new THREE.MeshPhongMaterial({
        shininess: 5,
        map: textureLoader.load('/texture/planets/moon_1024.jpg'),
      })
      moonMaterial.map.colorSpace = THREE.SRGBColorSpace
      moon = new THREE.Mesh(moonGeometry, moonMaterial)
      moon.position.set(2.5, 0, 0)
      scene.add(moon)

      earth.layers.enableAll()
      moon.layers.enableAll()

      const earthDiv = document.createElement('div')
      earthDiv.className = 'label'
      earthDiv.textContent = 'Earth'
      earthDiv.style.backgroundColor = 'transparent'

      const earthLabel = new CSS2DObject(earthDiv)
      earthLabel.position.set(1.5 * EARTH_RADIUS, 0, 0)
      earthLabel.center.set(0, 1)
      earth.add(earthLabel)
      earthLabel.layers.set(0)

      const earthMassDiv = document.createElement('div')
      earthMassDiv.className = 'label'
      earthMassDiv.textContent = '5.972 × 10^24 kg'
      earthMassDiv.style.backgroundColor = 'transparent'

      const earthMassLabel = new CSS2DObject(earthMassDiv)
      earthMassLabel.position.set(1.5 * EARTH_RADIUS, 0, 0)
      earthMassLabel.center.set(0, 0)
      earth.add(earthMassLabel)
      earthMassLabel.layers.set(1)

      const moonDiv = document.createElement('div')
      moonDiv.className = 'label'
      moonDiv.textContent = 'Moon'
      moonDiv.style.backgroundColor = 'transparent'

      const moonLabel = new CSS2DObject(moonDiv)
      moonLabel.position.set(1.5 * MOON_RADIUS, 0, 0)
      moonLabel.center.set(0, 1)
      moon.add(moonLabel)
      moonLabel.layers.set(0)

      const moonMassDiv = document.createElement('div')
      moonMassDiv.className = 'label'
      moonMassDiv.textContent = '7.347 × 10^22 kg'
      moonMassDiv.style.backgroundColor = 'transparent'

      const moonMassLabel = new CSS2DObject(moonMassDiv)
      moonMassLabel.position.set(1.5 * MOON_RADIUS, 0, 0)
      moonMassLabel.center.set(0, 0)
      moon.add(moonMassLabel)
      moonMassLabel.layers.set(1)

      controls = new OrbitControls(camera, labelRenderer.domElement)
      controls.minDistance = 5
      controls.maxDistance = 100

      this.initGui()
      window.addEventListener('resize', this.onWindowResize)
    },
    onWindowResize () {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      labelRenderer.setSize(window.innerWidth, window.innerHeight)
    },
    initGui () {
      const layers = {
        'Toggle Name': function () {

          camera.layers.toggle(0)

        },
        'Toggle Mass': function () {

          camera.layers.toggle(1)

        },
        'Enable All': function () {

          camera.layers.enableAll()

        },

        'Disable All': function () {

          camera.layers.disableAll()

        }
      }
      gui = new GUI()
      gui.add(layers, 'Toggle Name')
      gui.add(layers, 'Toggle Mass')
      gui.add(layers, 'Enable All')
      gui.add(layers, 'Disable All')
      gui.open()
    },
    animate () {
      requestAnimationFrame(this.animate)
      const time = clock.getElapsedTime()
      moon.position.set(2.5 * Math.cos(time), 0, 2.5 * Math.sin(time))
      controls.update()
      renderer.render(scene, camera)
      labelRenderer.render(scene, camera)
    }
  }
}
</script>

<template>
  <div ref="container">
    <canvas id="mainCanvas"></canvas>
  </div>

</template>

<style>
.label {
  color: #FFF;
  font-family: sans-serif;
  padding: 2px;
  background: rgba(0, 0, 0, .6);
}
</style>
