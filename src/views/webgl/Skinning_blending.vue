<script>
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import GUI from 'lil-gui'

let scene, renderer, camera, controls
let clock, model, skeleton, mixer, actions, settings
let idleAction, walkAction, runAction
export default {
  mounted () {
    this.init()
    // this.animate();
  },
  methods: {
    init () {
      clock = new THREE.Clock()
      scene = new THREE.Scene()
      scene.background = new THREE.Color(0xa0a0a0)
      scene.fog = new THREE.Fog(0xa0a0a0, 10, 50)

      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100)
      camera.position.set(1, 5, -3)
      camera.lookAt(0, 1, 0)

      renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('mainCanvas'),
        antialias: true
      })
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(window.innerWidth, window.innerHeight)

      controls = new OrbitControls(camera, renderer.domElement)

      // light
      const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 3)
      hemiLight.position.set(0, 20, 0)
      const hemiHelper = new THREE.HemisphereLightHelper(hemiLight, 100)
      scene.add(hemiLight)
      scene.add(hemiHelper)

      const dirLight = new THREE.DirectionalLight(0xffffff, 3)
      dirLight.position.set(3, 10, -10)
      dirLight.castShadow = true
      dirLight.shadow.camera.top = 2
      dirLight.shadow.camera.bottom = -2
      dirLight.shadow.camera.left = -2
      dirLight.shadow.camera.right = 2
      dirLight.shadow.camera.near = 0.1
      dirLight.shadow.camera.far = 40
      scene.add(dirLight)

      // ground
      const groundGeometry = new THREE.PlaneGeometry(100, 100)
      const groundMaterial = new THREE.MeshPhongMaterial({ color: 0xcbcbcb, depthWrite: false })
      const mesh = new THREE.Mesh(groundGeometry, groundMaterial)
      mesh.rotation.x = -Math.PI / 2
      mesh.receiveShadow = true
      scene.add(mesh)

      const loader = new GLTFLoader()
      loader.load('/models/Soldier.glb', gltf => {
        model = gltf.scene
        scene.add(model)

        model.traverse(object => {
          if (object.isMesh) object.castShadow = true
        })

        skeleton = new THREE.SkeletonHelper(model)
        skeleton.visible = true
        scene.add(skeleton)

        const animations = gltf.animations
        mixer = new THREE.AnimationMixer(model)
        idleAction = mixer.clipAction(animations[0])
        walkAction = mixer.clipAction(animations[3])
        runAction = mixer.clipAction(animations[1])

        actions = [idleAction, walkAction, runAction]

        this.createPanel()

        this.activateAllActions()
        this.animate()
      })
      window.addEventListener('resize', this.onResize)
    },
    onResize () {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    },
    createPanel () {
      settings = {
        'show model': true,
        'show skeleton': false,
        'set custom duration': 3.5,
        'modify idle weight': 0.0,
        'modify walk weight': 1.0,
        'modify run weight': 0.0,
      }
      const gui = new GUI({ width: 310 })
      const folder1 = gui.addFolder('Visibility')
      const folder5 = gui.addFolder('Blend Weights')
      folder1.add(settings, 'show model').onChange(this.showModal)
      folder1.add(settings, 'show skeleton').onChange(this.showSkeleton)
      folder5.add(settings, 'modify idle weight', 0.0, 1.0, 0.01).listen().onChange(weight => {
        this.setWeight(idleAction, weight)
      })
      folder5.add(settings, 'modify walk weight', 0.0, 1.0, 0.01).listen().onChange(weight => {
        this.setWeight(walkAction, weight)
      })
      folder5.add(settings, 'modify run weight', 0.0, 1.0, 0.01).listen().onChange(weight => {
        this.setWeight(runAction, weight)
      })
      folder1.open()
      folder5.open()
    },
    showModal (visibility) {
      model.visible = visibility
    },
    showSkeleton (visibility) {
      skeleton.visible = visibility
    },

    setWeight (action, weight) {
      action.enabled = true
      action.setEffectiveTimeScale(1)
      action.setEffectiveWeight(weight)
    },
    activateAllActions () {
      this.setWeight(idleAction, settings['modify idle weight'])
      this.setWeight(walkAction, settings['modify walk weight'])
      this.setWeight(runAction, settings['modify run weight'])
      actions.forEach(action => {
        action.play()
      })
    },
    animate () {
      requestAnimationFrame(this.animate)
      let mixerUpdateDelta = clock.getDelta()
      mixer.update(mixerUpdateDelta)
      renderer.render(scene, camera)
    }
  }
}
</script>

<template>
  <canvas id="mainCanvas"></canvas>
</template>

<style scoped>

</style>