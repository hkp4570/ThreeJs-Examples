import Vue from 'vue';
import VueRouter from "vue-router";
import ClippingIntersection from "@/views/Clipping/Clipping-intersection.vue";
import GeometryCube from '@/views/Geometry/Cube.vue';

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
    }
]

export const router = new VueRouter({
    mode: 'history',
    routes,
});

router.afterEach((to) => {
    document.title = to.name;
})

Vue.use(VueRouter);