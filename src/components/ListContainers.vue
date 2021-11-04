<template>
  <div>
    <a-table :columns="columns" :data-source="containerInfo" style="margin-top: 15px; text-align: center">
      <span slot="image" slot-scope="text"><a-tag color="orange">{{text}}</a-tag></span>
      <span slot="status" slot-scope="text">{{text}}</span>
      <span slot="port" slot-scope="port">v6home.fewings.xyz:{{ port }}</span>
      <span slot="createTime" slot-scope="createTime">{{ createTime }}</span>
      <span slot="info" slot-scope="text, record">
        <a-dropdown :trigger="['hover']">
          <a class="ant-dropdown-link" @click="e => e.preventDefault()">
            ...
          </a>
          <a-menu slot="overlay">
            <a-menu-item @click="startContainer(record)" :disabled="checkCStatus(record) === 1">启动容器</a-menu-item>
            <a-menu-item @click="stopContainer(record)" :disabled="checkCStatus(record) === 2">停止容器</a-menu-item>
          </a-menu>
        </a-dropdown>
      </span>
      <span slot="action" slot-scope="text, record, indent">
        <a-button type="primary" size="small" @click="showModal(record)">修改容器</a-button>
        <a-button type="default" size="small" @click="showDrawer(record)">查看日志</a-button>
        <a-button type="danger" size="small" @click="showConfirm(record)">删除容器</a-button>
      </span>
    </a-table>

    <a-modal
      title="修改容器"
      :visible="modifyC.visible"
      :confirm-loading="modifyC.confirmLoading"
      ok-text="确认"
      cancel-text="取消"
      @ok="modifyContainer"
      @cancel="modifyC.visible = false;"
    >
      <div>
        容器名称：<a-input placeholder="请输入想要修改的容器名称" v-model="modifyC.cName" style="width: 300px"/>
      </div>
      <div style="margin-top: 15px">
        使用镜像：<a-input :placeholder="modifyC.image" v-model="modifyC.image" style="width: 300px" disabled/>
      </div>
      <div style="margin-top: 15px">
        映射端口：<a-input placeholder="请输入想要修改的端口号" v-model="modifyC.port" style="width: 300px" />
      </div>
    </a-modal>

    <a-drawer
      title="容器日志"
      placement="right"
      :width="720"
      :closable="logDrawer.closable"
      :visible="logDrawer.visible"
      @close="logDrawer.visible = false;"
    >
      <a-alert message="注：日志内的日期为UTC时间" banner />
      <div class="code-mirror-div">
        <codemirror v-model="confContainer.code" :options="confContainer.cmOptions" style="margin: 20px 15px;"/>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import '../js/codemirror-settings'
import 'codemirror/mode/javascript/javascript.js'

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
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    scopedSlots: { customRender: 'action' },
    align: 'center'
  },
  {
    title: '更多',
    dataIndex: 'info',
    key: 'info',
    scopedSlots: { customRender: 'info' },
    align: 'center',
  },
]

export default {
  name: 'ListContainers',
  data () {
    return {
      columns,
      containerInfo: [],
      modifyC: {
        visible: false,
        confirmLoading: false,
        oldCName: '',
        cName: '',
        port: 5000,
        image: '',
      },
      deleteC: {
        visible: false,
        cName: '',
      },
      logDrawer: {
        visible: false,
        closable: true,
      },
      confContainer: {
        code: '// This is a conf file.',
        cmOptions: {
          tabSize: 4,
          mode: 'text/javascript',
          theme: 'darcula',
          lineNumbers: true,
          line: true,
          // more CodeMirror options...
        }
      },
    }
  },
  created() {
    this.getContainers();
  },
  methods: {
    checkCStatus(record) {
      if (record.status === 'running') {
        return 1; // 禁用 启动
      }
      if (record.status === 'paused') {
        return 2; // 禁用 停止
      }
    },
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
    modifyContainer() {
      this.$http.post(this.API + '/containers/modify', this.$qs.stringify({
        new_container_name: this.modifyC.cName,
        container_name: this.modifyC.oldCName,
        port: this.modifyC.port
      }), {
        headers: {token: window.sessionStorage.getItem('token')}
      }).then(res => {
        if (res.data.success) {
          this.$message.success('容器修改成功！');
          this.modifyC.visible = false;
          this.$emit('update', '');
        }
      }).catch();
    },
    showModal(record) {
      this.modifyC.visible = true;
      this.modifyC.oldCName = record.containerName;
      this.modifyC.cName = record.containerName;
      this.modifyC.port = record.port;
      this.modifyC.image = record.image;
    },
    deleteContainer() {
      this.$http.post(this.API + '/containers/delete', this.$qs.stringify({
        container_name: this.deleteC.cName,
      }), {
        headers: {token: window.sessionStorage.getItem('token')}
      }).then(res => {
        if (res.data.success) {
          this.$message.success('容器删除成功！');
          this.$emit('update', '');
        } else {
          this.$message.error(res.data.message);
        }
      }).catch();
    },
    showConfirm(record) {
      this.deleteC.cName = record.containerName;
      let that = this;
      this.$confirm({
        title: '您确认要删除容器吗？',
        content: '当你按下删除时，容器将会直接被删除。',
        okText: '删除',
        cancelText: '取消',
        onOk() {
          that.deleteContainer();
        },
        onCancel() {},
      });
    },
    startContainer(record) {
      let that = this;
      this.$confirm({
        title: '您确认要启动容器吗？',
        content: '当你按下启动时，容器将会启动。',
        okText: '启动',
        cancelText: '取消',
        onOk() {
          that.$http.post(that.API + '/containers/start', that.$qs.stringify({
            container_name: record.containerName
          }), {headers: {token: window.sessionStorage.getItem('token')}
          }).then(res => {
            if (res.data.success) {
              that.$message.success('容器启动成功');
              that.$emit('update', '');
            }
          }).catch();
        },
        onCancel() {},
      });
    },
    stopContainer(record) {
      let that = this;
      this.$confirm({
        title: '您确认要停止容器吗？',
        content: '当你按下确认时，容器将会被停止。',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          that.$http.post(that.API + '/containers/stop', that.$qs.stringify({
            container_name: record.containerName
          }), {headers: {token: window.sessionStorage.getItem('token')}
          }).then(res => {
            if (res.data.success) {
              that.$message.success('容器停止成功');
              that.$emit('update', '');
            }
          }).catch();
        },
        onCancel() {},
      });
    },
    showDrawer(record) {
      this.$http.post(this.API + '/containers/log', this.$qs.stringify({
        container_name: record.containerName
      }), {headers: {token: window.sessionStorage.getItem('token')}
      }).then(res => {
        if (res.data.success) {
          this.confContainer.code = '// This is the log file.\n' + res.data.data.log;
        }
      }).catch()
      this.logDrawer.visible = true
    }
  }
}
</script>

<style scoped>
.code-mirror-div >>> .CodeMirror{
  height: 600px;
}
</style>
