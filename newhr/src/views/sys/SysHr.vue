 <script >
 import {putRequest, getRequest, deleteRequest} from "@/utils/api"

export default {
  name:"SysHr",
  data(){
    return{
      keywords:'',
      hrs:[],
      allroles:[],
      selectedRoles:[]
    }
  },
  mounted() {
    this.initHrs();
  },
  methods:{
    deleteHr(hr){
      this.$confirm('此操作将永久【'+hr.name+'】  , 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRequest("/system/basic/hr/"+hr.id).then(resp=>{
          if(resp){
            this.initHrs();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
    ,
    doSearch(){
      this.initHrs();
    }
    ,
    initHrs(){
      getRequest("/system/hr/?keywords="+this.keywords).then(resp=>{
        if(resp){
          this.hrs=resp;
          console.log(this.hrs)
        }
      })
    },
    enabledChange(hr){
      delete hr.roles;
      putRequest("/system/hr/",hr).then(resp=>{
        if(resp){
          this.initHrs();
        }
      })
    },
    initAllRoles(){
      getRequest("/system/hr/roles/").then(resp=>{
        if(resp){
          this.allroles=resp;
        }

      })
    },
    showPop(hr){
      this.initAllRoles();
      let roles=hr.roles;
      console.log(roles);
      this.selectedRoles=[];
      roles.forEach(r=>{
        this.selectedRoles.push(r.id);
      })
    },
    hidePop(hr){
      let roles=hr.roles;
      let flag=false;
      if(roles.length!==this.selectedRoles.length){
        flag=true;
      }else{
        for(let i=0;i<roles.length;i++){
          flag=true;
          let role=roles[i];
          for(let j=0;j<this.selectedRoles.length;j++){
            let sr=this.selectedRoles[j];
            if(role.id===sr){
              flag=false;
              break;
            }
          }
          if(flag===true){
            break;
          }
        }
      }
      if(flag){
        let url='/system/hr/role?hrid='+hr.id;
        this.selectedRoles.forEach(sr=>{
          url+='&rids='+sr;
        })
        putRequest(url).then(resp=>{
          if(resp){
            this.initHrs();
          }
        })
      }

    }
  }
}
</script>

<template>
<div>
  <div style="margin-top: 10px;display: flex;justify-content: center">
  <el-input v-model="keywords" placeholder="通过用户名搜索用户..." prefix-icon="el-icon-search"
            style="width: 400px;margin-right: 10px" size="small" @keydown.enter.native="doSearch"></el-input>
    <el-button icon="el-icon-search" type="primary" size="small" @click="doSearch">搜索</el-button>
  </div>
  <div class="hr-container">
    <el-card class="hr-card" v-for="( hr,index) in hrs" :key="index" >
      <div slot="header" class="clearfix">
        <span>{{hr.name}}</span>
        <el-button style="float: right; padding: 3px 0;color: #e30007" type="text" icon="el-icon-delete" size="small" @click="deleteHr(hr)"></el-button>
      </div>
      <div>
        <div class="img-container">
          <img :src="hr.userface" :alt="hr.name" :title="hr.name" class="userface-img">
        </div>
        <div class="userinfo-container">
          <div>用户名:{{hr.name}}</div>
          <div>手机号码:{{hr.phone}}</div>
          <div>电话号码:{{hr.telephone}}</div>
          <div>地址:{{hr.address}}</div>
          <div>用户状态:<el-switch
              v-model="hr.enabled"
              @change="enabledChange(hr)"
              inactive-color="#ff4949"
              active-color="#13ce66"
              active-text="启用"
              inactive-text="禁用">
          </el-switch></div>
          <div>用户角色:<el-tag style="margin-right: 4px" size="mini" type="success" v-for="(role,indexj) in hr.roles" :key="indexj">{{role.nameZh}}</el-tag>
            <el-popover
                placement="right"
                title="角色列表"
                @show="showPop(hr)"
                @hide="hidePop(hr)"
                width="200"
                trigger="click">
              <el-select v-model="selectedRoles" multiple placeholder="请选择">
                <el-option
                    v-for="(r,indexk) in allroles"
                    :key="indexk"
                    :label="r.nameZh"
                    :value="r.id">
                </el-option>
              </el-select>
              <el-button slot="reference" size="small" icon="el-icon-more" type="text"></el-button>
            </el-popover>
          </div>
          <div>备注：{{hr.remark}}</div>
        </div>
      </div>
    </el-card>
  </div>
</div>
</template>

<style>
.userinfo-container{
  margin-top: 20px;
}
.userinfo-container div{
  font-size: 12px;
  color: #409eff;
}
.img-container{
  width: 100%;
  display: flex;
  justify-content: center;
}
.userface-img{
  width: 72px;
  height: 72px;
  border-radius: 72px;
}
.hr-container{
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.hr-card{
  width: 350px;
  margin-bottom: 20px;
}
</style>