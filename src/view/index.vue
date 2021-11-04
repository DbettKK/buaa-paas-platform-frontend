<template>
  <a-layout id="components-layout-demo-top-side-2">
    <Header/>
    <a-layout>
      <a-layout-sider width="200" style="background: #fff">
        <a-menu
          mode="inline"
          :default-selected-keys="['1']"
          :selected-keys="currentMenuKey"
          :style="{ height: '100%', borderRight: 0 }"
        >
          <a-menu-item key="1" @click="changeStatus(menuStatusList.IMAGE_MANAGE)">
            <span><a-icon type="code-sandbox" />镜像管理</span>
          </a-menu-item>
          <a-sub-menu key="sub">
            <!--同上注释-->
            <span slot="title"><a-icon type="rocket" />容器管理</span>
            <a-menu-item key="2" @click="changeStatus(menuStatusList.CONTAINER_CREATE)">
              创建容器
            </a-menu-item>
            <a-menu-item key="3" @click="changeStatus(menuStatusList.CONTAINER_LIST)">
              容器列表
            </a-menu-item>
<!--            <a-menu-item key="6" @click="changeStatus(menuStatusList.CONTAINER_MONIT)">-->
<!--              监控容器-->
<!--            </a-menu-item>-->
          </a-sub-menu>
          <a-sub-menu key="sub4">
            <span slot="title"><a-icon type="deployment-unit" />应用部署</span>
            <a-menu-item key="4" @click="changeStatus(menuStatusList.APP_CREATE)">
              创建编排
            </a-menu-item>
<!--            <a-menu-item key="5" @click="changeStatus(menuStatusList.APP_DEPLOY)">-->
<!--              部署编排-->
<!--            </a-menu-item>-->
            <a-menu-item key="7" @click="changeStatus(menuStatusList.APP_LIST)">
              编排列表
            </a-menu-item>
          </a-sub-menu>
        </a-menu>
      </a-layout-sider>
      <a-layout style="padding: 0 24px 24px">
        <a-layout-content :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px' }">
          <div v-if="menuStatus === menuStatusList.IMAGE_MANAGE">
            <a-page-header title="镜像管理" sub-title="可以自定义创建镜像"/>
            <ListImages :key="listIStatus" @updateImage="listIStatus++" @toCreateC="toCreateContainer"/>
          </div>
          <div v-if="menuStatus === menuStatusList.CONTAINER_LIST">
            <a-page-header title="容器列表" sub-title="可以查看已经创建好的容器"/>
            <ListContainers :key="listCStatus" @update="listCStatus++"/>
          </div>
          <div v-if="menuStatus === menuStatusList.CONTAINER_CREATE">
            <a-page-header title="创建容器" sub-title="可以创建自定义容器"/>
            <div style="margin: 50px 20px 20px;"><CreateContainer @toContainerList="toContainerList"/></div>
          </div>
          <div v-if="menuStatus === menuStatusList.APP_CREATE">
            <a-page-header title="创建编排" sub-title="可以选择容器创建编排"/>
            <CreateApp/>
          </div>
          <div v-if="menuStatus === menuStatusList.APP_DEPLOY">
            <a-page-header title="部署编排" sub-title="可以选择编排进行部署"/>
            <DeployApp/>
          </div>
          <div v-if="menuStatus === menuStatusList.APP_LIST">
            <a-page-header title="编排列表" sub-title="可以查看我的编排"/>
            <ListApps :key="listAStatus" @updateApp="listAStatus++"/>
          </div>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>
<script>

import ListContainers from '../components/ListContainers'
import CreateContainer from '../components/CreateContainer'
import CreateApp from '../components/CreateApp'
import DeployApp from '../components/DeployApp'
import ListImages from '../components/ListImages'
import ListApps from '../components/ListApps'
import Header from "../components/Header"

export default {
  components: {
    Header,
    ListContainers,
    CreateContainer,
    ListImages,
    CreateApp,
    DeployApp,
    ListApps
  },
  data () {
    return {
      collapsed: false,
      menuStatus: 1,
      listCStatus: 0, // listC组件的key 用于更新组件
      listIStatus: 0,
      listAStatus: 0,
      currentMenuKey: ['1'],
      menuStatusList: {
        CLUSTER_MANAGE: 0,
        IMAGE_MANAGE: 1,
        CONTAINER_CREATE: 2,
        CONTAINER_LIST: 3,
        APP_CREATE: 4,
        APP_DEPLOY: 5,
        CONTAINER_MONIT: 6,
        APP_LIST: 7
      },
    }
  },
  methods: {
    changeStatus(status) {
      this.menuStatus = status;
      this.currentMenuKey = [status + ''];
    },
    toContainerList() {
      this.menuStatus = this.menuStatusList.CONTAINER_LIST;
      this.listCStatus++;
      this.currentMenuKey = ['3'];
    },
    toCreateContainer() {
      this.menuStatus = this.menuStatusList.CONTAINER_CREATE;
      this.currentMenuKey = ['2'];
    }
  },
  created() {
    if (!window.sessionStorage.getItem('token')) {
      this.$message.info("请先登录");
      this.$router.push('/login');
    }
  }
}
</script>

<style>
#components-layout-demo-top-side-2 .logo {
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px 28px 16px 0;
  float: left;
}
</style>
