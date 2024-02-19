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

export const routes = [
    {
        path: '/clippingIntersection',
        name: 'clippingIntersection',
        component: ClippingIntersection,
    },
    {
        path: '/geometryCube',
        name: 'geometryCube',
        component: GeometryCube,
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
    },
    {
        path: '/happySpringFestival',
        name:'happySpringFestival',
        component: HappySpringFestival
    },
    {
        path:'/billboard',
        name:'billboard',
        component: Billboards,
    },
    {
        path: '/layers',
        name: 'layers',
        component: Layers,
    },
    {
        path: '/interactiveCube',
        name: 'interactiveCube',
        component: InteractiveCube,
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