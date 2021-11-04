<template>
  <div>
<!--    <a-steps :current="currentStep">-->
<!--      <a-step v-for="(item, index) in steps" :key="index" :title="item" />-->
<!--    </a-steps>-->
    <div class="steps-content">
      <div v-if="currentStep === 0">
        <a-radio-group name="radioGroup" :default-value="REMOTE_IMAGE">
          <a-radio :value="REMOTE_IMAGE" @click="createContainerWay = REMOTE_IMAGE">自定义镜像</a-radio>
<!--          <a-radio :value="LOCAL_IMAGE" @click="createContainerWay = LOCAL_IMAGE">本机镜像</a-radio>-->
        </a-radio-group>
        <div style="margin-top: 10px">
          <span>选择镜像：</span>
          <a-select  v-if="createContainerWay === LOCAL_IMAGE" default-value="" style="width: 300px">
            <a-select-option v-for="(item, index) in imageInfo" :key="index" :value="item.name">
              {{item.name}}
            </a-select-option>
          </a-select>
          <a-select v-if="createContainerWay === REMOTE_IMAGE" v-model="imageName" style="width: 300px" >
            <a-select-option v-for="(item, index) in userImageNames" :key="index" :value="item">{{item}}</a-select-option>
          </a-select>
          <div style="margin-top: 10px">输入名称：
            <a-input placeholder="请输入您喜欢的容器名称" style="width: 300px" v-model="containerName"/>
          </div >
          <div style="margin-top: 10px; margin-bottom: 20px">输入端口：
            <a-input placeholder="端口范围：5000-65536" style="width: 300px" v-model="port"/>
          </div>
        </div>
      </div>
      <div v-if="currentStep === 1" style="text-align: left; height: 100%">
        <div style="margin-left: 15px;">配置文件</div>
        <codemirror v-model="confContainer.code" :options="confContainer.cmOptions" style="margin: 20px 15px;"/>
      </div>
      <div v-if="currentStep === 2">
        <div style="text-align: center">
          <a-alert message="请确认下列信息无误后，点击开始创建按钮进行容器创建" type="info" show-icon style="width: 420px; margin-left: auto; margin-right: auto"/>
        </div>
        <div style="display: inline-block; text-align: left;">
          <div style="margin-top: 15px">
            <span v-if="createContainerWay === LOCAL_IMAGE">镜像类型：本地镜像</span>
            <span v-if="createContainerWay === REMOTE_IMAGE">镜像类型：自定义镜像</span>
          </div>
          <div style="margin-top: 10px">
            <span v-if="createContainerWay === LOCAL_IMAGE">镜像名称：<a-tag color="green">mysql</a-tag></span>
            <span v-if="createContainerWay === REMOTE_IMAGE">镜像地址：xxx</span>
          </div>
          <div style="margin-top: 10px">
            容器名称：<a-tag color="orange">{{containerName}}</a-tag>
          </div>
          <div style="margin-top: 10px; margin-bottom: 20px">配置文件： 请返回上一步查看</div>
        </div>
      </div>
    </div>
    <div class="steps-action">

<!--      <a-button :disabled="currentStep === 0" style="margin-right: 8px" @click="prev">-->
<!--        上一步-->
<!--      </a-button>-->
<!--      <a-button v-if="currentStep < steps.length - 1" type="primary" @click="next">-->
<!--        下一步-->
<!--      </a-button>-->
<!--      <a-button v-if="currentStep === steps.length - 1" type="primary" @click="startCreateContainer" >-->
<!--        开始创建-->
<!--      </a-button>-->
      <a-button type="primary" style="margin-left: 8px" @click="createContainer">创建</a-button>
    </div>
  </div>
</template>
<script>
import '../js/codemirror-settings'
import 'codemirror/mode/javascript/javascript.js'
import {imageInfo} from "../js/local-images";
const LOCAL_IMAGE = 1, REMOTE_IMAGE = 2;
export default {
  name: 'CreateContainer',
  data() {
    return {
      imageInfo,
      currentStep: 0,
      steps: ['选择镜像', '配置', '创建完成'],
      LOCAL_IMAGE,
      REMOTE_IMAGE,
      createContainerWay: REMOTE_IMAGE,
      containerName: '',
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
      userImageNames: [],
      imageName: '',
      port: '',
    };
  },
  created() {
    this.getImageNames();
  },
  methods: {
    next() {
      this.currentStep++;
    },
    prev() {
      this.currentStep--;
    },
    startCreateContainer() {
      this.$message.success('开始创建容器！');
      // 提交数据
    },
    getImageNames() {
      this.$http.get(this.API + '/images', {
        headers: {token: window.sessionStorage.getItem('token')}
      }).then(res => {
        if (res.data.success) {
          for (let item of res.data.data) {
            this.userImageNames.push(item.name);
          }
        }
      }).catch();
    },
    createContainer() {
      console.log(this.imageName);
      this.$http.post(this.API + '/run-image', this.$qs.stringify({
        image_name: this.imageName,
        port: this.port,
        container_name: this.containerName,
      }), {headers: {token: window.sessionStorage.getItem('token')}
      }).then(res => {
        console.log(res);
        if (res.data.success) {
          this.$message.success("容器创建成功");
          this.$emit('toContainerList', '');
        } else {
          this.$message.success("容器创建失败");
        }
      }).catch(e => {
        console.log(e);
        this.$message.success("容器创建失败");
      });
      this.$message.info("开始创建容器，请稍后");
    },
  },
};
</script>
<style scoped>
.steps-content {
  margin-top: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  background-color: #fafafa;
  min-height: 220px;
  text-align: center;
  padding-top: 40px;
}

.steps-action {
  text-align: center;
  margin-top: 24px;
}
</style>
