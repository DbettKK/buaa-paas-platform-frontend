<template>
  <div style="text-align: center;">
    <h1 style="margin-top: 200px">Our-PaaS</h1>
    <a-form :form="form" @submit="handleSubmit" >
      <a-form-item>
        <a-input v-decorator="['username', { rules: [{ required: true, message: '请输入用户名' }] }]" placeholder="请输入用户名" style="width: 300px">
          <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input type="password" v-decorator="['password', { rules: [{ required: true, message: '请输入密码' }] }] "placeholder="请输入密码" style="width: 300px">
          <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input type="password" v-decorator="['rePassword', { rules: [{ required: true, message: '请再次输入密码' }] }]" placeholder="请再次输入密码" style="width: 300px">
          <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-button @click="$router.push('/login')">返回</a-button>
        <a-button type="primary" html-type="submit" style="margin-left: 15px">注册</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data() {
    return {
      form: this.$form.createForm(this, { name: 'coordinated' }),
      username: '',
      passwd: '',
      rePasswd: ''
    }
  },
  methods: {
    register() {
      if (this.passwd !== this.rePasswd) {
        this.$message.error("两次密码不一致");
      } else {
        this.$http.post(this.API + '/register', this.$qs.stringify({
          username: this.username,
          password: this.passwd
        })).then(res => {
          if (res.data.success) {
            this.$message.success("注册成功!");
            this.$router.push('/login');
          } else {
            this.$message.error("注册失败!");
          }
        }).catch(e => {
          console.log(e)
          this.$message.error("注册失败!");
        });
      }
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.username = values['username'];
          this.passwd = values['password'];
          this.rePasswd = values['rePassword'];
          this.register();
        }
      });
    }
  }
}
</script>

<style scoped>

</style>
