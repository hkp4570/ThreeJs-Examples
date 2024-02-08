<template>
  <div class="app-container">
    <a-layout style="height: 100%">
      <a-layout-sider theme="light">
          <a-menu mode="inline" :default-selected-keys="currentRouteName" v-model="currentRouteName">
            <a-menu-item :key="route.name" v-for="route of routes">
              <router-link :to="route.path" :exact="true" active-class="" exact-active-class="">{{ route.name }}</router-link>
            </a-menu-item>
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
