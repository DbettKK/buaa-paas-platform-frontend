<template>
  <div>
    <a-menu v-model="currentMenu" mode="horizontal">
      <a-menu-item key="user" @click="currentMenu[0] = 'user'"><a-icon type="user" />自定义镜像列表</a-menu-item>
      <a-menu-item key="local" @click="currentMenu[0] = 'local'"><a-icon type="home" />本地镜像列表</a-menu-item>
    </a-menu>
    <!--本地-->
    <div v-if="currentMenu[0] === 'local'" style="background-color: #ececec; padding: 20px; margin-top: 15px">
      <a-alert message="使用本地镜像时，请在仓库Dockerfile中直接使用FROM xxx命令即可，通过本地镜像创建会更加快捷！" banner/>
      <a-row :gutter="24"v-for="item1 in createOrderArray('local')" :key="item1" style="margin-top: 15px">
        <a-col :span="8" v-for="item in createOrderArrayV2(item1, 'local')" :key="item">
          <a-card hoverable :bordered="false">
            <span slot="title">
              <a-avatar style="margin-right: 12px;" :style="{backgroundColor: '#' + getRandomColor()}">
                {{ localImages.imageInfo[item].name[0].toUpperCase() }}
              </a-avatar>
              {{ localImages.imageInfo[item].name }}
            </span>
          </a-card>
        </a-col>
      </a-row>
    </div>
    <!--自定义-->
    <div v-if="currentMenu[0] === 'user'" style="text-align: right; margin-top: 15px">
      <a-button type="primary" @click="addImageModal.visible = true;">添加镜像</a-button>
<!--      <a-button type="danger" style="margin-left: 10px">删除镜像</a-button>-->
    </div>
    <div v-if="currentMenu[0] === 'user' && loadingFlag" style="background-color: #ececec; padding: 20px; margin-top: 15px">
      <a-row :gutter="24"v-for="item1 in createOrderArray('user')" :key="item1" style="margin-top: 15px">
        <a-col :span="8" v-for="item in createOrderArrayV2(item1, 'user')" :key="item">
          <a-card hoverable @click.native="showUserImageDrawer(item)">
            <div slot="title">
              <a-avatar style="margin-right: 12px;" :style="{backgroundColor: '#' + getRandomColor()}">
                {{ userImages.imageInfo[item].name[0].toUpperCase() }}
              </a-avatar>
              {{ userImages.imageInfo[item].name }}
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <a-modal
      title="添加镜像"
      :visible="addImageModal.visible"
      :confirm-loading="addImageModal.confirmLoading"
      ok-text="确认"
      cancel-text="取消"
      @ok="addImage"
      @cancel="addImageModal.visible = false;"
    >
      <a-alert type="info" message="注：仓库内部需包含用于创建镜像的Dockerfile" banner/>
      <div style="margin-top: 15px">
        镜像名称：<a-input placeholder="请输入镜像名称且不能重复" v-model="addImageModal.imageName" style="width: 300px" required/>
      </div>
      <div style="margin-top: 15px">
        仓库链接：<a-input placeholder="请输入包含Dockerfile的仓库链接地址" v-model="addImageModal.repoURL" style="width: 300px" :required="true"/>
<!--        <i style="font-size: 10px; color: grey" @click="openURL">示例仓库</i>-->
      </div>
    </a-modal>
    <a-modal
      title="修改镜像"
      :visible="modifyImageModal.visible"
      ok-text="确认"
      cancel-text="取消"
      @ok="modifyImage"
      @cancel="modifyImageModal.visible = false;"
    >
      <div>
        镜像名称：<a-input placeholder="请输入新的镜像名称且不能重复" v-model="modifyImageModal.imageName" style="width: 300px" required/>
      </div>
      <div style="margin-top: 15px">
        仓库链接：<a-input :placeholder="modifyImageModal.repoURL" style="width: 300px" disabled/>
      </div>
    </a-modal>

    <a-drawer
      title="镜像信息"
      placement="right"
      :width="650"
      :closable="userImageDrawer.closable"
      :visible="userImageDrawer.visible"
      @close="userImageDrawer.visible = false;"
    >
      <a-page-header title="查看自定义镜像信息" sub-title="可以创建容器、修改镜像和删除镜像"/>
      <a-alert message="请注意：镜像一旦删除，不可恢复！" banner/>
      <a-alert style="margin-top: 15px" type="info" message="请注意：镜像对应容器数量为0时才能删除" banner/>
      <a-alert style="margin-top: 15px" type="info" message="请注意：镜像修改只能修改镜像名称" banner/>
      <div class="steps-content">
        <div style="display: inline-block; text-align: left;">
          <div style="font-size: 15px; margin-bottom: 15px">镜像名称：  {{userImageDrawer.imageInfo.name}}</div>
          <div style="font-size: 15px; margin-bottom: 15px">容器数量：  {{userImageDrawer.imageInfo.containers}}</div>
          <div style="font-size: 15px; margin-bottom: 15px">创建时间：  {{userImageDrawer.imageInfo.created}}</div>
          <div style="font-size: 15px; margin-bottom: 15px">镜像大小：  {{userImageDrawer.imageInfo.size}}</div>
          <div style="font-size: 15px; margin-bottom: 15px">仓库链接：  <span @click="openURL(userImageDrawer.imageInfo.url)"><a>点击跳转</a></span></div>
        </div>
      </div>
      <div style="margin-top: 20px"><a-button type="primary" style="width: 100%" @click="$emit('toCreateC', '')">创建容器</a-button></div>
      <div style="margin-top: 20px"><a-button style="width: 100%" @click="showModifyModal(userImageDrawer.imageInfo.name, userImageDrawer.imageInfo.url)">修改镜像</a-button></div>
      <div style="margin-top: 20px"><a-button type="danger" style="width: 100%" @click="deleteImage(userImageDrawer.imageInfo.name)">删除镜像</a-button></div>
    </a-drawer>


  </div>
</template>

<script>
import {imageInfo} from "../js/local-images";
const IMAGE_SUCCESS = 1, IMAGE_FAIL = 0;
export default {
  name: 'ListImages',
  data() {
    return {
      currentMenu: ['user'],
      loadingFlag: false,
      localImages: {
        IMAGE_IN_LINE: 3,
        imageNums: imageInfo.length,
        imageInfo: imageInfo,
      },
      userImages: {
        IMAGE_IN_LINE: 3,
        imageNums: 4,
        imageInfo: []
      },
      addImageModal: {
        repoURL: '',
        imageName: '',
        visible: false,
        confirmLoading: false,
      },
      modifyImageModal: {
        repoURL: '',
        imageName: '',
        oldImageName: '',
        visible: false,
        confirmLoading: false,
      },
      userImageDrawer: {
        visible: false,
        closable: true,
        imageInfo: {},
      }
    }
  },
  created() {
    this.getImages();
  },
  methods: {
    fixTime(time) {
      return new Date(+ new Date(time) + 8 * 3600 * 1000).toISOString()
        .replace(/T/g, ' ')
        .replace(/\.[\d]{3}Z/, '');
    },
    handleTags(history) {
      let tags = [];
      for (let item of history) {
        if (item.Tags) {
          for (let tag of item.Tags) {
            tags.push(tag);
          }
        }
      }
      return tags;
    },
    getRandomColor() {
      return Math.floor(Math.random()*(2<<23)).toString(16);
    },
    openURL() {
      window.open('https://git.scs.buaa.edu.cn/18373734/test_paas');
    },
    createOrderArray(mode) {
      let len;
      if (mode === 'user') {
        len = Math.ceil(this.userImages.imageNums / this.userImages.IMAGE_IN_LINE);
        return Array.from({length: len}, (item, index) => index);
      } else {
        len = Math.ceil(this.localImages.imageNums / this.localImages.IMAGE_IN_LINE);
        return Array.from({length: len}, (item, index) => index);
      }

    },
    createOrderArrayV2(index, mode) {
      let len = 3, lines;
      if (mode === 'user') {
        lines = Math.ceil(this.userImages.imageNums / this.userImages.IMAGE_IN_LINE);
        if (index + 1 === lines) {
          len = this.userImages.imageNums - index * 3;
          return Array.from({length: len}, (item, id) => id + 3 * index);
        } else {
          return Array.from({length: len}, (item, id) => id + 3 * index);
        }
      } else {
        lines = Math.ceil(this.localImages.imageNums / this.localImages.IMAGE_IN_LINE);
        if (index + 1 === lines) {
          len = this.localImages.imageNums - index * 3;
          return Array.from({length: len}, (item, id) => id + 3 * index);
        } else {
          return Array.from({length: len}, (item, id) => id + 3 * index);
        }
      }
    },
    getImages() {
      this.$http.get(this.API + '/images', {
        headers: {token: window.sessionStorage.getItem('token')}
      }).then(res => {
        console.log(res);
        if (res.data.success) {
          this.userImages.imageNums = res.data.data.length;
          for (let item of res.data.data) {
            this.userImages.imageInfo.push({
              name: item.name,
              containers: item.containers.length,
              created: this.fixTime(item.created),
              size: (item.size / 1024 / 1024).toFixed(1) + 'M',
              tags: this.handleTags(item.history),
              url: item.url,
            });
          }
        }
        this.loadingFlag = true;
      }).catch(e => {
        console.log(e);
        this.loadingFlag = true;
      });
    },
    addImage() {
      this.addImageModal.confirmLoading = true;
      this.$http.post(this.API + '/build-image', this.$qs.stringify({
        repo_url: this.addImageModal.repoURL,
        image_name: this.addImageModal.imageName
      }), {headers: {token: window.sessionStorage.getItem('token')}}
      ).then(res => {
        if (res.data.success) {
          this.$message.success('镜像创建成功', IMAGE_SUCCESS);
          this.openNotification(this.addImageModal.imageName, 1);
          this.$emit('updateImage', '');
        } else {
          this.$message.error(res.data.message);
        }
        console.log(res);
      }).catch(e => {
        this.$message.error('镜像创建失败');
      });
      this.$message.info("镜像创建中，请稍等");
      this.addImageModal.confirmLoading = false;
      this.addImageModal.visible = false;
    },
    modifyImage() {
      this.$http.post(this.API + '/images/rename', this.$qs.stringify({
        image_name: this.modifyImageModal.oldImageName,
        new_image_name: this.modifyImageModal.imageName,
      }), {headers: {token: window.sessionStorage.getItem('token')}
      }).then(res => {
        if (res.data.success) {
          this.$message.success('镜像修改成功');
          this.$emit('updateImage', '');
        } else {
          this.$message.success('镜像修改失败 ' + res.data.message);
        }
      }).catch();
    },
    deleteImage(imageName) {
      let that = this;
      this.$confirm({
        title: '您确认要删除镜像吗？',
        content: '当你按下删除时，镜像将会直接被删除。',
        okText: '删除',
        cancelText: '取消',
        onOk() {
          that.$http.post(that.API + '/images/delete', that.$qs.stringify({
            image_name: imageName
          }), {headers: {token: window.sessionStorage.getItem('token')}
          }).then(res => {
            if (res.data.success) {
              that.$message.info('镜像删除成功');
              that.$emit('updateImage', '');
            } else {
              that.$message.error('镜像删除失败! ' + res.data.message);
            }
          }).catch();
        },
        onCancel() {},
      });
    },
    openNotification(imageName, status) {
      let tmp = status === IMAGE_SUCCESS ? '成功啦！' : '失败';
      this.$notification.open({
        message: '镜像创建' + tmp,
        description:
          '你的名为' + imageName +'的镜像创建' + tmp,
        icon: <a-icon type="smile" style="color: orange" />,
      });
    },
    showUserImageDrawer(index) {
      this.userImageDrawer.visible = true;
      this.userImageDrawer.imageInfo = this.userImages.imageInfo[index];
    },
    showModifyModal(oldName, url) {
      this.modifyImageModal.visible = true;
      this.modifyImageModal.imageName = oldName;
      this.modifyImageModal.oldImageName = oldName;
      this.modifyImageModal.repoURL = url;
    }
  }
}
</script>

<style scoped>
.steps-content {
  margin-top: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  background-color: #fafafa;
  min-height: 200px;
  text-align: center;
  padding-top: 40px;
}
</style>
