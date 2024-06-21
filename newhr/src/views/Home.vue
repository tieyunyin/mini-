<script >
import {Message, MessageBox} from "element-ui";
import {getRequest} from "@/utils/api";
//import { useRouter,useRoute } from 'vue-router'
import router from "@/router";
import store from "@/store";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name:"Home",
  data(){
    return{
      user:JSON.parse(window.sessionStorage.getItem("user"))
    }
  },

  computed: {
    alluse(){
      return this.$store.state.routes;
    }
  },
  mounted() {
    this.$store.dispatch('connect');
  },
  methods:{
    goChat() {
      this.$router.push("/chat");
    },
    menuclick(index){
      //console.log(index);
     this.$router.push(index);
    }
    ,
    commandHandler(cmd){
      if(cmd==='logout'){
        MessageBox.confirm(
            '此操作将注销登录是否继续',
            'Warning',
            {
              confirmButtonText: '是',
              cancelButtonText: '否',
              type: 'warning',
            }
        )
            .then(() => {
              getRequest("/logout");
              window.sessionStorage.removeItem("user");
              router.replace({ path: '/' });
              store.commit('initRoutes',[]);
            })
            .catch(() => {
              Message({
                type: 'info',
                message: '已取消操作！',
              })
            })
      }
    }
  }
}
</script>

<template>
  <div>
    <el-container>
      <el-header class="homeHeader">
        <div class="title">微人事 </div>
      <div>
        <el-button icon="el-icon-bell" type="text" style="margin-right: 8px;color: #000000" size="medium" @click="goChat"></el-button>
        <el-dropdown class="userInfo" @command="commandHandler">
   <span class="el-dropdown-link">
     {{user.name}}<i><img :src="user.userface" ></i>
   </span>

          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="userinfo">个人中心</el-dropdown-item>
            <el-dropdown-item command="setting">设置</el-dropdown-item>
            <el-dropdown-item command="logout" divided>注销登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      </el-header>
      <el-container>
        <el-aside width="215px">
          <el-menu @select="menuclick" width="215px" >
            <el-submenu :index="index+''" v-for="(item,index) in alluse " :key="index" >
              <template slot="title"  >
                <i style="color: #409eff;margin-right:5px" :class="item.iconCls"></i>
                <span>{{item.name}}</span>
              </template>
              <el-menu-item  :index="child.path" v-for="(child,indexj) in item.children" :key="indexj">
                {{child.name}}</el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path!='/home'">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{this.$router.currentRoute.name}}</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="homewelcome" v-if="this.$router.currentRoute.path=='/home'">
            欢迎来到微人事
          </div>
          <router-view class="homeRouterView"/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style>
.homeRouterView{
  margin-top: 10px;
}
.homewelcome{
   text-align: center;
  font-size: 30px;
  font-family: 华文行楷;
  color: #409eff;
  padding-top: 50px;
}
.homeHeader{
  background-color: #409eff;
  display:flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  box-sizing: border-box;
}
.homeHeader .title{
  font-size: 30px;
  font-family: 华文行楷;
  color:#f1f6fa
}
.homeHeader .el-icon-arrow-down {
  font-size: 12px;
}
.homeHeader .userInfo{
  cursor:pointer;
}
.el-dropdown-link img{
  width: 40px;
  height: 48px;
  border-radius: 24px;
}
.el-dropdown-link{
  display: flex;
  align-items: center;
}
</style>