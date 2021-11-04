<template>
  <div>
    <a-alert message="在下列容器列表中选择并创建编排" type="info" show-icon/>
    <div style="text-align: right; margin-top: 15px">
      <a-button type="primary" :disabled="!isChosen" @click="appModalVisible = true">创建编排</a-button>
    </div>
    <a-table :columns="columns" :data-source="containerInfo" :row-selection="rowSelection" style="margin-top: 15px; text-align: center">
      <span slot="image" slot-scope="text"><a-tag color="orange">{{text}}</a-tag></span>
      <span slot="status" slot-scope="text">{{text}}</span>
      <span slot="port" slot-scope="port">v6home.fewings.xyz:{{ port }}</span>
      <span slot="createTime" slot-scope="createTime">{{ createTime }}</span>
    </a-table>

    <a-modal
      title="创建编排"
      :visible="appModalVisible"
      ok-text="确认"
      cancel-text="取消"
      @ok="createApp"
      @cancel="appModalVisible = false;"
    >
      <a-alert type="info" message="请确认使用如下容器创建编排" banner />
      <div style="margin-top: 15px">
        使用容器：
        <a-tag color="green" v-for="(item, index) in appContainers" :key="index">
          {{item}}
        </a-tag>
      </div>
      <div style="margin-top: 15px">
        编排名称：<a-input placeholder="请输入编排名称" v-model="appName" style="width: 300px"/>
      </div>
    </a-modal>
  </div>
</template>

<script>
const columns = [
  {
    title: '序号',
    dataIndex: 'num',
    key: 'num',
    align: 'center'
  },
  {
    title: '容器名称',
    dataIndex: 'containerName',
    key: 'containerName',
    align: 'center'
  },
  {
    title: '使用镜像',
    dataIndex: 'image',
    key: 'image',
    //slots: { title: 'customTitle' },
    scopedSlots: { customRender: 'image' },
    align: 'center'
  },
  {
    title: '容器状态',
    dataIndex: 'status',
    key: 'status',
    scopedSlots: { customRender: 'status'},
    align: 'center'
  },
  {
    title: '端口映射',
    dataIndex: 'port',
    key: 'port',
    scopedSlots: { customRender: 'port' },
    align: 'center'
  },
  {
    title: '最后修改时间',
    dataIndex: 'createTime',
    key: 'createTime',
    scopedSlots: { customRender: 'createTime' },
    align: "center",
  },
]
export default {
  name: 'CreateApp',
  data () {
    return {
      columns,
      rowSelection: {
        onChange: (selectedRowKeys, selectedRows) => {
          this.appContainers = [];
          this.isChosen = selectedRows.length > 0;
          for (let item of selectedRows) {
            this.appContainers.push(item.containerName);
          }
        },
      },
      isChosen: false,
      containerInfo: [],
      appContainers: [],
      appModalVisible: false,
      appName: '',
    }
  },
  created() {
    this.getContainers();
  },
  methods: {
    getContainers() {
      this.$http.get(this.API + '/containers', {
        headers: {token: window.sessionStorage.getItem('token')}
      }).then(res => {
        if (res.data.success) {
          let index = 1;
          for (let item of res.data.data) {
            this.containerInfo.push({
              num: index,
              key: index + '',
              containerName: item.name,
              image: item.image,
              port: item.port,
              status: item.status,
              createTime: this.fixTime(item.created),
              info: '',
            });
            index++;
          }
        }
      }).catch(e => {
        console.log(e);
      });
    },
    fixTime(time) {
      return new Date(+ new Date(time) + 8 * 3600 * 1000).toISOString()
        .replace(/T/g, ' ')
        .replace(/\.[\d]{3}Z/, '');
    },
    createApp() {
      this.$http.post(this.API + '/app/create', this.$qs.stringify({
        containers: JSON.stringify(this.appContainers),
        app_name: this.appName,
      }), {headers: {token: window.sessionStorage.getItem('token')}
      }).then(res => {
        if (res.data.success) {
          this.$message.success('创建编排成功');
          this.appModalVisible = false;
        } else {
          this.$message.error('编排创建失败，' + res.data.message);
        }
      }).catch();
    }
  }
}
</script>

<style scoped>
.code-mirror-div >>> .CodeMirror{
  height: 600px;
}
</style>
