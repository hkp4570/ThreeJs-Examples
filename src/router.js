import Vue from 'vue';
import VueRouter from "vue-router";
import Layouts from '@/layouts/Layouts.vue';
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
import AnimationMixerFBX from "@/views/AnimationMixer动画混合器/AnimationMixerFBX.vue";
import AnimationMixerKeydownControl from '@/views/AnimationMixer动画混合器/键盘控制人物移动和攻击.vue';
import Pisa from '@/views/webgl/Pisa.vue';
import ObjectTravel from '@/views/物体沿路径行驶/index.vue';
import PanoramaCube from '@/views/webgl/Panorama_cube.vue';
import ShaderOcean from '@/views/webgl/Shader_ocean.vue';
import AnimationKeyframes from '@/views/webgl/Animation_keyframes.vue';

export const routes = [
    {
        path: '/clippingIntersection',
        name: 'clippingIntersection',
        component: ClippingIntersection,
    },
    {
        path: '/geometry',
        name: 'geometry',
        component: Layouts,
        children: [
            {
                path: 'colors',
                name: 'colors',
                component: Colors,
            },
            {
                path: 'convex',
                name: 'convex',
                component: Convex,
            },
            {
                path: 'geometryCube',
                name: 'geometryCube',
                component: GeometryCube,
            },
            {
                path: 'extrude_shapes',
                name: 'extrude_shapes',
                component: ExtrudeShapes,
            },
            {
                path: 'shapes',
                name: 'shapes',
                component: Shapes,
            },
            {
                path: 'text',
                name: 'text',
                component: Text,
            },
        ]
    },
    {
        path: '/mathOrientationTransform',
        name: 'mathOrientationTransform',
        component: MathOrientationTransform,
    },
    {
        path: '/camera',
        name: 'camera',
        component: Camera,
    }, {
        path: '/happySpringFestival',
        name: 'happySpringFestival',
        component: HappySpringFestival
    },
    {
        path: '/points',
        name: 'points',
        component: Layouts,
        children: [
            {
                path: 'billboard',
                name: 'billboard',
                component: Billboards,
            },
            {
                path: 'sprite',
                name: 'sprite',
                component: Sprites,
            },
        ]
    },
    {
        path: '/webgl',
        name: 'webgl',
        component: Layouts,
        children: [
            {
                path: 'animation_keyframes',
                name: 'animation_keyframes',
                component: AnimationKeyframes,
            },
            {
                path: 'instancing_raycast',
                name: 'instancing_raycast',
                component: InstancingRaycast
            },
            {
                path: 'interactive_bufferGeometry',
                name: 'interactive_bufferGeometry',
                component: InteractiveBufferGeometry
            },
            {
                path: 'interactive_cubes_ortho',
                name: 'interactive_cubes_ortho',
                component: InteractiveCubesOrtho
            },
            {
                path: 'interactive_voxelpainter',
                name: 'interactive_voxelpainter',
                component: InteractiveVoxelpainter
            },
            {
                path: 'interactiveCube',
                name: 'interactiveCube',
                component: InteractiveCube,
            },
            {
                path: 'interactiveCubeGpu',
                name: 'interactiveCubeGpu',
                component: InteractiveCubeGpu,
            },
            {
                path: 'layers',
                name: 'layers',
                component: Layers,
            },
            {
                path: 'materials_cubemap_dynamic',
                name: 'materials_cubemap_dynamic',
                component: MaterialsCubemapDynamic,
            },
            {
                path: 'materials_cubemap_refraction',
                name: 'materials_cubemap_refraction',
                component: MaterialsCubemapRefraction,
            },
            {
                path: 'raycaster_sprite',
                name: 'raycaster_sprite',
                component: RaycasterSprite
            },
            {
                path: 'pisa',
                name:'pisa',
                component: Pisa,
            },
            {
                path: 'panorama_cube',
                name: '全景立方体',
                component: PanoramaCube,
            },
            {
                path: 'shader_ocean',
                name: '着色器_海洋',
                component: ShaderOcean,
            }
        ]
    },
    {

        path: '/drawingLine',
        name: 'drawingLine',
        component: DrawingLine,
    },
    {
        path: '/line',
        name: 'line',
        component: Layouts,
        children: [
            {
                path: 'indexed',
                name: 'indexed',
                component: Indexed,
            },
            {
                path: 'lines',
                name: 'lines',
                component: Lines
            },
            {
                path: 'dashed',
                name: 'dashed',
                component: Dashed,
            },
        ]
    },
    {
        path: '/controls_orbit',
        name: '轨道控制器',
        component: ControlsOrbit
    },
    {
        path: '/roadLight',
        name: '道路流光',
        component: RoadLight
    },
    {
        path: '/earth3D',
        name: '3D地球',
        component: Earth3D,
    },
    {
        path: '/chinaMap',
        name: '中国地图',
        component: ChinaMap,
    },
    {
        path: '/sunEarthMoon',
        name: '太阳地球月亮运动',
        component: SunEarthMoon,
    },
    {
        path: '/skybox',
        name: '天空盒',
        component: Skybox,
    },
    {
        path: '/irregular_shape',
        name: '不规则图形',
        component: IrregularShape,
    },
    {
        path: '/object_collision',
        name: '物体碰撞检测',
        component: ObjectCollision,
    },
    {
        path: '/house',
        name: '绘制房子',
        component: House,
    },
    {
      path: '/object_travel',
      name: '物体沿路径行驶',
      component: ObjectTravel,
    },
    {
        path: '/animationMixer',
        name: '动画混合器',
        component: Layouts,
        children: [
            {
                path: 'animationMixerFBX',
                name: '加载模型实现动画',
                component: AnimationMixerFBX,
            },
            {
                path: 'animationMixerKeydownControl',
                name: 'animationMixerKeydownControl',
                component: AnimationMixerKeydownControl
            }
        ]
    },

]

export const router = new VueRouter({
    mode: 'history',
    routes,
});

router.afterEach((to) => {
    document.title = to.name || 'app';
})

Vue.use(VueRouter);