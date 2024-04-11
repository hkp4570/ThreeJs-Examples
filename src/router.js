import Vue from 'vue';
import VueRouter from "vue-router";
import ClippingIntersection from "@/views/Clipping/Clipping-intersection.vue";
import GeometryCube from '@/views/Geometry/Cube.vue';
import MathOrientationTransform from '@/views/Math/OrientationTransform.vue';
import Camera from "@/views/Camera/Camera.vue";
import HappySpringFestival from "@/views/HappySpringFestival/index.vue";
import Billboards from "@/views/Points/Billboards.vue";
import Layers from "@/views/webgl/Layers.vue";
import InteractiveCube from "@/views/webgl/InteractiveCube.vue";
import InteractiveCubeGpu from "@/views/webgl/InteractiveCubeGpu.vue";
import Sprites from '@/views/Points/Sprties.vue';
import DrawingLine from "@/views/DrawingLine.vue";
import Indexed from "@/views/Line/Indexed.vue";
import Lines from "@/views/Line/Lines.vue";
import Dashed from "@/views/Line/Dashed.vue";
import Text from '@/views/Geometry/Text.vue';
import Colors from "@/views/Geometry/Colors.vue";
import Convex from "@/views/Geometry/Convex.vue";
import ControlsOrbit from '@/views/misc/controls_orbit.vue';
import RaycasterSprite from '@/views/webgl/Raycaster_sprite.vue';
import InstancingRaycast from '@/views/webgl/Instancing_raycast.vue';
import InteractiveVoxelpainter from '@/views/webgl/Interactive_voxelpainter.vue';
import InteractiveCubesOrtho from '@/views/webgl/Interactive_cubes_ortho.vue';
import InteractiveBufferGeometry from '@/views/webgl/Interactive_bufferGeometry.vue';
import RoadLight from '@/views/道路流光/index.vue';
import Earth3D from '@/views/3D地球/index.vue';
import ChinaMap from '@/views/绘制中国地图/index.vue';
import ExtrudeShapes from '@/views/Geometry/Extrude_shapes.vue';
import SunEarthMoon from '@/views/模拟太阳地球月亮运动/index.vue';
import Shapes from '@/views/Geometry/shapes.vue';
import Skybox from '@/views/天空盒/index.vue';
import MaterialsCubemapDynamic from '@/views/webgl/Materials_cubemap_dynamic.vue';
import IrregularShape from '@/views/绘制不规则图形/index.vue';
import MaterialsCubemapRefraction from '@/views/webgl/Materials_cubemap_refraction.vue';
import ObjectCollision from '@/views/物体碰撞检测/index.vue';
import House from '@/views/绘制房子/index.vue';
import AnimationMixer from "@/views/AnimationMixer动画混合器/index.vue";

export const routes = [
    {
        path: '/clippingIntersection',
        name: 'clippingIntersection',
        component: ClippingIntersection,
    }, {
        path: '/geometryCube',
        name: 'geometryCube',
        component: GeometryCube,
    }, {
        path: '/mathOrientationTransform',
        name: 'mathOrientationTransform',
        component: MathOrientationTransform,
    }, {
        path: '/camera',
        name: 'camera',
        component: Camera,
    }, {
        path: '/happySpringFestival',
        name: 'happySpringFestival',
        component: HappySpringFestival
    }, {
        path: '/billboard',
        name: 'billboard',
        component: Billboards,
    }, {
        path: '/layers',
        name: 'layers',
        component: Layers,
    }, {
        path: '/interactiveCube',
        name: 'interactiveCube',
        component: InteractiveCube,
    }, {
        path: '/interactiveCubeGpu',
        name: 'interactiveCubeGpu',
        component: InteractiveCubeGpu,
    }, {
        path: '/sprites',
        name: 'sprites',
        component: Sprites,
    }, {
        path: '/drawingLine',
        name: 'drawingLine',
        component: DrawingLine,
    }, {
        path: '/indexed',
        name: 'indexed',
        component: Indexed,
    }, {
        path: '/lines',
        name: 'lines',
        component: Lines
    }, {
        path: '/dashed',
        name: 'dashed',
        component: Dashed,
    }, {
        path: '/text',
        name: 'text',
        component: Text,
    }, {
        path: '/colors',
        name: 'colors',
        component: Colors
    }, {
        path: '/convex',
        name: 'convex',
        component: Convex
    }, {
        path: '/controls_orbit',
        name: 'controls_orbit',
        component: ControlsOrbit
    }, {
        path: '/raycaster_sprite',
        name: 'raycaster_sprite',
        component: RaycasterSprite
    }, {
        path: '/instancing_raycast',
        name: 'instancing_raycast',
        component: InstancingRaycast
    }, {
        path: '/interactive_voxelpainter',
        name: 'interactive_voxelpainter',
        component: InteractiveVoxelpainter
    }, {
        path: '/interactive_cubes_ortho',
        name: 'interactive_cubes_ortho',
        component: InteractiveCubesOrtho
    }, {
        path: '/interactive_bufferGeometry',
        name: 'interactive_bufferGeometry',
        component: InteractiveBufferGeometry
    }, {
        path: '/roadLight',
        name: 'roadLight',
        component: RoadLight
    }, {
        path: '/earth3D',
        name: 'earth3D',
        component: Earth3D,
    }, {
        path: '/chinaMap',
        name: 'chinaMap',
        component: ChinaMap,
    }, {
        path: '/extrude_shapes',
        name: 'extrude_shapes',
        component: ExtrudeShapes,
    }, {
        path: '/sunEarthMoon',
        name: 'sunEarthMoon',
        component: SunEarthMoon,
    }, {
        path: '/shapes',
        name: 'shapes',
        component: Shapes,
    }, {
        path: '/skybox',
        name: 'skybox',
        component: Skybox,
    }, {
        path: '/materials_cubemap_dynamic',
        name: 'materials_cubemap_dynamic',
        component: MaterialsCubemapDynamic,
    }, {
        path: '/irregular_shape',
        name: 'irregular_shape',
        component: IrregularShape,
    }, {
        path: '/Materials_cubemap_refraction',
        name: 'Materials_cubemap_refraction',
        component: MaterialsCubemapRefraction,
    }, {
        path: '/object_collision',
        name: 'object_collision',
        component: ObjectCollision,
    }, {
        path: '/house',
        name: 'house',
        component: House,
    }, {
        path: '/animationMixer',
        name: 'animationMixer',
        component: AnimationMixer,
    }
]

export const router = new VueRouter({
    mode: 'history',
    routes,
});

router.afterEach((to) => {
    document.title = to.name || 'app';
})

Vue.use(VueRouter);