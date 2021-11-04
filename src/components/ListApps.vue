<template>
  <div>
    <a-list item-layout="vertical" :data-source="apps">
      <a-list-item slot="renderItem" slot-scope="item, index">
        <a-list-item-meta>
          <div slot="title">
            {{ '编排名称：' + item.app_name }}
            <div style="float: right">
              <a-button size="small" type="danger" @click="showConfirm(item.app_name)">删除编排</a-button>
            </div>
          </div>
          <a-avatar slot="avatar" :style="{backgroundColor: '#' + getRandomColor()}">
            {{ item.app_name[0].toUpperCase() }}
          </a-avatar>
        </a-list-item-meta>
        <div>
          编排内的容器：
          <a-tag slot="description" color="green" v-for="(container, idx) in item.containers" :key="idx">
            {{container}}
          </a-tag>
        </div>
      </a-list-item>
    </a-list>

  </div>
</template>

<script>
export default {
  name: 'ListApps',
  data() {
    return {
      apps: [{
        app_name: '',
      }],
    };
  },
  methods: {
    getRandomColor() {
      console.log(Math.floor(Math.random()*(2<<23)).toString(16));
      return Math.floor(Math.random()*(2<<23)).toString(16);
    },
    getApps() {
      this.$http.get(this.API + '/app/list', {
        headers: {token: window.sessionStorage.getItem('token')}
      }).then(res => {
        if (res.data.success) {
          this.apps = res.data.data;
          console.log(this.apps)
        }
      }).catch();
    },
    deleteApp(appName) {
      this.$http.post(this.API + '/app/delete', this.$qs.stringify({
        app_name: appName
      }), {
        headers: {token: window.sessionStorage.getItem('token')}
      }).then(res => {
        if (res.data.success) {
          this.$message.success('删除编排成功');
          this.$emit('updateApp', '');
        }
      }).catch();
    },
    showConfirm(appName) {
      let that = this;
      this.$confirm({
        title: '您确认要删除编排吗？',
        content: '当你按下删除时，编排将会直接被删除。',
        okText: '删除',
        cancelText: '取消',
        onOk() {
          that.deleteApp(appName);
        },
        onCancel() {},
      });
    },
  },
  created() {
    this.getApps();
  }
};
</script>

<style scoped>

</style>
