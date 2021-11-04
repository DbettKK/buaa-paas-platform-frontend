<template>
  <div class="re-header">
    <div style="font-size: 24px; font-weight: 800; cursor: pointer; color: white; margin-left: 48px">
      Our-PaaS
    </div>
    <a-dropdown>
      <a-menu style="margin-top: 4px" slot="overlay">
        <a-menu-item key="2" @click="exit">退出登录</a-menu-item>
      </a-menu>
      <a-button type="link" style="color: #666666">
        <a-avatar style="margin-right: 12px; ":style="{backgroundColor: '#' + getRandomColor()}">
          {{ username[0].toUpperCase() }}
        </a-avatar>
        <span style="font-size: 18px; color: #fff">{{ username }}</span>
        <a-icon type="down" />
      </a-button>
    </a-dropdown>
  </div>
</template>

<script>
// import Vue from 'vue';
import ChangeCode from "./ChangeCode";
const moveOutColor = "#fff";
const moveOverColor = "rgb(159,234,249)";
export default {
  components: {
    ChangeCode,
  },
  data() {
    return {
      username: 'A',
    };
  },
  created() {
    this.username = window.sessionStorage.getItem('username');
  },
  methods: {
    getRandomColor() {
      console.log(Math.floor(Math.random()*(2<<23)).toString(16));
      return Math.floor(Math.random()*(2<<23)).toString(16);
    },
    exit() {
      window.sessionStorage.clear();
      this.$router.push('/login');
    },
  },
};
</script>

<style>
.header-top-logo {
  cursor: pointer;
  width: 158px;
  height: 46px;
  background: url("../assets/logo.png");
  margin: 12px 32px 0px 32px;
  float: left;
  z-index: 2;
}
.search {
  cursor: pointer;
  height: 40px;
  margin: 0px 0px 0px calc(50vw - 300px);
  float: left;
}
.re-header {
  background: black;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  text-align: center;
  z-index: 10;
}
.header-menu {
  text-align: right;
}
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
