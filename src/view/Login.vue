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
        <a-button @click="toRegister">注册</a-button>
        <a-button type="primary" html-type="submit" style="margin-left: 15px">登录</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
export default {
  name: 'Login.vue',
  data() {
    return {
      form: this.$form.createForm(this, { name: 'coordinated' }),
      username: '',
      password: '',
    }
  },
  methods: {
    login() {
      this.$http.post(this.API + '/login', this.$qs.stringify({
        username: this.username,
        password: this.password
      })).then(res => {
        if (res.data.success) {
          this.$message.success("登录成功");
          window.sessionStorage.setItem('token', res.data.data.token);
          window.sessionStorage.setItem('username', this.username);
          this.$router.push('/');
        } else {
          this.$message.error("登录失败")
        }
      }).catch(e => {
        this.$message.error("登录失败")
      })
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.username = values['username'];
          this.password = values['password'];
          this.login();
        }
      });
    },
    toRegister() {
      this.$router.push('/register');
    }
  }
}
</script>

<style scoped>

</style>
