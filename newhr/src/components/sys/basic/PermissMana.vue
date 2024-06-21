<script>
import {postRequest, getRequest, putRequest, deleteRequest} from "@/utils/api"
export default {
  name:"PermissMana",
  data(){
    return{
      role:{
        name:'',
        nameZh:''
      },
      roles:[],
      allmenus:[],
      selectedMenues:[],
      defaultProps:{
        children:'children',
        label:'name'
      }
    }
  },
  methods:{
    deleteRole(r){
      this.$confirm('此操作将永久【'+r.nameZh+'】角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRequest("/system/basic/permiss/role/"+r.id).then(resp=>{
          if(resp){
            this.initroles();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    doAddRole(){
      if(this.role.name===''||this.role.nameZh===''){
        this.$message.error("表单不能为空！");
      }else{
        postRequest("/system/basic/permiss/role",this.role).then(resp=>{
          if(resp){
            this.role.name='';
            this.role.nameZh='';
            this.initroles();
          }
        })
      }

    },
    doUpdate(rid,index){
      console.log(rid);
      let tree=this.$refs.tree[index];
      let selectKeys=tree.getCheckedKeys(true);
      let url='/system/basic/permiss/?rid='+rid;
      selectKeys.forEach(key=>{
        url+='&mids='+key;
      })
      putRequest(url).then(resp=>{
        if(resp){
          this.initroles();
        }
      })
    },
    initSelectedMenus(rid){
      getRequest("/system/basic/permiss/mids/"+rid).then(resp=>{
        if(resp){
          this.selectedMenues=resp;
        }
      })
    },
    change(rid){
      if(rid){
        this.initAllMenus();
        this.initSelectedMenus(rid);
      }
    },
    initAllMenus(){
      getRequest("/system/basic/permiss/menu").then(resp=>{
        if(resp){
          this.allmenus=resp;
        }
      })
    },
  initroles(){
    getRequest("/system/basic/permiss/").then(resp=>{
      if(resp){
        this.roles=resp;
      }
      console.log(this.roles);
    })
  }
  },
  mounted() {
    this.initroles();
  }
}
</script>

<template>
<div>
  <div class="permissManaTool">
    <el-input size="small" placeholder="请输入角色英文名" v-model="role.name">
      <template slot="prepend">ROLE_</template>
    </el-input>
    <el-input size="small" placeholder="请输入角色中文名" v-model="role.nameZh" @keydown.enter.native="doAddRole"></el-input>
    <el-button type="primary" size="small" icon="el-icon-plus" @click="doAddRole">添加角色</el-button>
  </div>
  <div style="margin-top: 10px;width: 700px">
    <el-collapse  accordion @change="change">
      <el-collapse-item :title="r.nameZh" :name="r.id" v-for="(r,index) in roles" :key="index">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>可访问的资源</span>
            <el-button style="float: right; padding: 3px 0;color: #ff0000" icon="el-icon-delete"
                       type="text" @click="deleteRole(r)"></el-button>
          </div>
          <div>
            <el-tree :key="index" show-checkbox node-key="id" ref="tree" :default-checked-keys="selectedMenues" :data="allmenus" :props="defaultProps" ></el-tree>
            <div style="display: flex;justify-content: flex-end">
              <el-button size="mini">取消修改</el-button>
              <el-button size="mini" type="primary" @click="doUpdate(r.id,index)">确认修改</el-button>
            </div>
          </div>
        </el-card>
      </el-collapse-item>
    </el-collapse>
  </div>
</div>
</template>

<style>
.permissManaTool{
  display: flex;
  justify-content: flex-start;
}
.permissManaTool .el-input{
    width: 300px;
  margin-right: 5px;
}
</style>