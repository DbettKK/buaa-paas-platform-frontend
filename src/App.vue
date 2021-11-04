<template>
  <div id="app">
    <router-view v-if="isRouterActive"></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  provide() {
    return {
      reload: this.reload
    }
  },
  data(){
    return{
      isRouterActive: true
    }
  },
  methods: {
    reload(){
      this.isRouterActive = false;
      this.$nextTick(function () {
        this.isRouterActive = true;
      })
    }
  }
}
</script>

<style>
#app {
  display:flex;
  flex-direction:column;
  height: 100%;
  min-height: 100%;
}
</style>
