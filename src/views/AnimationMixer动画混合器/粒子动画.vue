<script>
import * as THREE from 'three'
import * as TWEEN from 'three/addons/libs/tween.module'

let scene, camera, renderer
export default {
  mounted () {
    this.init()
    this.animate()
  },
  methods: {
    init () {
      scene = new THREE.Scene()
      camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000)
      camera.position.set(100, 100, 300)
      camera.lookAt(scene.position)
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: document.getElementById('mainCanvas'),
      })
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(window.devicePixelRatio)

      function getRandomGeometry (geo) {
        const vertices = []
        for (let i = 0; i < 125; i++) {
          const x = Math.random() * 200 - 100
          const y = Math.random() * 200 - 100
          const z = Math.random() * 200 - 100
          vertices.push(x, y, z)
        }
        geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
      }

      function combineCube (geo) {
        const tweens = []
        const boxGeometry = new THREE.BoxGeometry(40, 40, 40, 5, 5, 5)
        const positions = new Float32Array(152 * 3)
        for (let i = 0; i < 152; i++) {
          const newVertices = new THREE.Vector3(
            geo.attributes.position.array[i * 3],
            geo.attributes.position.array[i * 3 + 1],
            geo.attributes.position.array[i * 3 + 2],
          )
          const toVertices = new THREE.Vector3(
            boxGeometry.attributes.position.array[i*3],
            boxGeometry.attributes.position.array[i*3 + 1],
            boxGeometry.attributes.position.array[i*3 + 2],
          )

          if (!tweens[i]) {
            tweens.push(new TWEEN.Tween(newVertices).easing(TWEEN.Easing.Exponential.In))
          }
          function update () {
            positions[i * 3] = newVertices.x
            positions[i * 3 + 1] = newVertices.y
            positions[i * 3 + 2] = newVertices.z
            geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
          }

          tweens[i].to({
            x: toVertices.x,
            y: toVertices.y,
            z: toVertices.z
          }, 5000).onUpdate(update)
          tweens[i].start();
        }
      }

      const bufferGeometry = new THREE.BufferGeometry()
      getRandomGeometry(bufferGeometry)
      setTimeout(() => {
        combineCube(bufferGeometry)
      }, 2000)

      const materials = []
      const texture = new THREE.TextureLoader().load('https://p1.music.126.net/jgzbZtWZhDet2jWzED8BTw==/109951164579600342.png')

      materials[0] = new THREE.PointsMaterial({
        transparent: true,
        map: texture,
        size: 10,
        // 粒子的大小是否和其与摄像机的距离有光，默认值 true
        sizeAttenuation: true,
      })
      materials[0].alphaTest = 0.5
      const particles = new THREE.Points(bufferGeometry, materials[0])
      scene.add(particles)

    },
    animate () {
      TWEEN.update();
      requestAnimationFrame(this.animate)
      renderer.render(scene, camera)
    }
  }
}
</script>

<template>
  <div>
    <canvas id="mainCanvas"></canvas>
  </div>
</template>

<style scoped>

</style>
