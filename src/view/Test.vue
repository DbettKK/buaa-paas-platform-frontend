<template>
  <div class="home">
      <Header/>
<!--      <ChangeCode/>-->
  </div>
</template>

<script>
import Header from "../components/Header.vue";
import ChangeCode from "../components/ChangeCode";

export default {
  name: "Home",
  components: {
    Header,
    ChangeCode,
  },
};
</script>

<style scoped>
.contentBox {
  min-height: calc(100% - 64px);
}
.home {
  min-height: 100%;
}
</style>
