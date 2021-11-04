<template>
  <div style="width: 360px; text-align: center">
    <h1
      style="margin-top: 20px; margin-left: 5px; font-size: 38px; float: left"
    >
      <b>修改密码</b>
    </h1>
    <a-input-password
      size="large"
      placeholder="新密码"
      ref="passwordInput"
      v-model="newCode"
      style="margin-top: 30px"
    >
      <a-icon slot="prefix" type="key" />
    </a-input-password>
    <a-input-password
      size="large"
      placeholder="请重复新密码"
      ref="passwordInput"
      v-model="reaffirmCode"
      style="margin-top: 30px"
    >
      <a-icon slot="prefix" type="key" />
    </a-input-password>
    <a-row
      type="flex"
      justify="center"
      style="margin-top: 24px; margin-bottom: 12px"
    >
      <a-col :span="11" style="margin-right: 20px">
        <a-button size="large" type="primary" block @click="submit"
        >确定修改</a-button
        >
      </a-col>
    </a-row>
    <div style="text-align: center" />
  </div>
</template>

<style>
.logo {
  width: 40px;
  height: 40px;
  float: top;
}
#particles-js {
  width: 100%;
  height: calc(100% - 100px);
  position: absolute;
}
</style>

<script>
// @ is an alias to /src
// import Vue from "vue";
export default {
  name: "ChangeCode",
  components: {},
  mounted() {
    this.getUsername();
  },
  data() {
    return {
      username: "",
      oldCode: "",
      formalCode: "",
      newCode: "",
      reaffirmCode: "",
      errorFormalCode: false,
      unmatched: false,
    };
  },
  methods: {
    submit() {
      // const that = this;
      // if (
      //   this.newCode == "" ||
      //   this.reaffirmCode == ""
      // ) {
      //   that.$message.error("密码不得为空");
      //   return;
      // } else if (this.newCode.length <= 6) {
      //   that.$message.error("密码过短，请设置高于6位的密码");
      //   return;
      // } else {
      //   if (this.newCode != this.reaffirmCode) {
      //     this.unmatched = true;
      //     that.$message.error("请确保两次输入相同密码");
      //     return;
      //   } else {
      //     this.unmatched = false;
      //     this.$axios({
      //       method: "post",
      //       url: "https://api.gugoo.xyz:15600/change_info",
      //       data: {
      //         token: this.$store.state.token,
      //         password: this.newCode,
      //         description:'',
      //         avatar:'',
      //       },
      //     })
      //       .then((response) => {
      //         if (response != null){
      //           that.$message.success("修改成功");
      //           window.location.reload();
      //         }
      //       })
      //       .catch((response) => {
      //         console.log(response);
      //       });
      //   }
      // }
    },
    getUsername() {
      // this.username = this.$store.state.username;
    },
  },
  created() {
    // this.$store.state.showNav = true;
  },
  destroyed() {
    // this.$store.state.showNav = true;
  },
};
</script>
