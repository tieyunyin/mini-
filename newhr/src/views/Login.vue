  <template>
  <div>
    <el-form
        :rules="rules"
        ref="loginForm"
        :model="loginForm"
        v-loading="loading"
        element-loading-text="正在登录..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        class="loginContainer"><!--rules表示绑定的校验规则在Javascript里面对应的大类-->
      <h3 class="title">系统登录</h3>
      <el-form-item prop="username"><!--property表示绑定的校验规则在Javascript里面对应的小类-->
        <el-input type="text" v-model="loginForm.username" autocomplete="off" placeholder="请输入用户名" class="usernamepassword">
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="loginForm.password" autocomplete="off" placeholder="请输入用户密码"  @keydown.enter.native="submitlogin"   class="usernamepassword">
        </el-input>
      </el-form-item>
      <el-checkbox class="remember" ></el-checkbox>
      <el-button type="primary" style="width:100%" class="usernamepassword" v-on:click="submitlogin">登录</el-button>
    </el-form>

  </div>
</template>

<script >

import {postKeyValueRequest} from "@/utils/api";
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Login",
  data() {
    return{
      loading:false,
      loginForm:{
        username:null,
        password:null
      },
      rules:{
        username:[{required:true,message:'请输入用户名',trigger:'blur'}],
        password:[{required:true,message:'请输入密码',trigger:'blur'}]
      }
    }
  },
  methods:{
    submitlogin(){
      this.$refs.loginForm.validate((valid)=>{
        if(valid){
          this.loading=true;
          postKeyValueRequest('/doLogin',this.loginForm).then(resp=>{
            this.loading=false;
            if(resp){
              this.$store.commit('INIT_CURRENTHR',resp.obj);
              window.sessionStorage.setItem("user",JSON.stringify(resp.obj))
              let path=this.$route.query.redirect;
              this.$router.replace((path==='/'||path===undefined)?'/home':path);
            }
          })
        }
        else {
          this.$message.error("未输入用户名或密码！");
        }
      })
    }
  }
}
</script>
<style >
.loginContainer{
  border-radius: 15px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 15px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}
.usernamepassword{
  height: 40px;
}
.title{
  margin: 15px auto 20px  auto;
  text-align: center;
  color: #505458;
}
.remember{
  text-align: left;
  margin: 0 0 10px 0;
}
</style>