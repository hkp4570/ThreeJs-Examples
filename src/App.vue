<template>
    <div class="app-container">
        <a-layout style="height: 100%">
            <a-layout-sider theme="light" style="overflow-y: auto">
                <a-menu mode="inline" :default-selected-keys="currentRouteName" v-model="currentRouteName">
                    <a-sub-menu :key="route.name" v-for="route of routes">
                        <span slot="title" @click="() => jumpPage(route)">{{ route.name }}</span>
                        <a-menu-item :key="child.name" v-show="route.children" v-for="child of route.children" >
                          <a @click="() => jumpChildPage(route.path, child.path)">{{child.name}}</a>
                        </a-menu-item>
                    </a-sub-menu>
                </a-menu>
            </a-layout-sider>
            <a-layout>
                <a-layout-content>
                    <RouterView/>
                </a-layout-content>
            </a-layout>
        </a-layout>
    </div>
</template>

<script>
import {routes} from './router';

export default {
    name: 'App',
    data() {
        return {
            routes,
            currentRouteName: [],
        }
    },
    created() {
        this.currentRouteName = [this.$route.name || ''];
    },
    methods: {
        jumpPage(route) {
            if (this.$route.name !== route.name) {
                this.$router.push(route.path);
            }
        },
      jumpChildPage(path, childPath){
        const _path = path + '/' + childPath;
        if (this.$route.name !== _path) {
          this.$router.push(_path);
        }
      }
    },
    watch: {
        $route(to) {
            this.currentRouteName = [to.name || ''];
        }
    }
}
</script>

<style>
html, body {
    margin: 0;
    padding: 0;
    color: black;

    a {
        color: black;
    }
}

.app-container {
    width: 100vw;
    height: 100vh;
}
</style>
