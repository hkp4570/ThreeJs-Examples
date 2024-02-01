<template>
  <div class="app-container">
    <ClippingIntersection/>
  </div>
</template>

<script>
import ClippingIntersection from "@/components/Clipping-intersection.vue";
export default {
  name: 'App',
  components: {
    ClippingIntersection,
  }
}
</script>

<style>
html,body {
  margin: 0;
  padding: 0;
}
.app-container{
  width: 100vw;
  height: 100vh;
}
</style>
