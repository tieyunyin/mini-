<script>
import {deleteRequest, getRequest} from "@/utils/api"
 import {postRequest} from"@/utils/api"
// import {deleteRequest} from"@/utils/api"
import {putRequest} from"@/utils/api"
  export default {
    name:"JobLevelMana",
    data(){
      return{
        jl:{
          name:'',
          titleLevel:''
        },
        updateJl:{
          name:'',
          titleLevel:'',
          enabled:false
        },
        jls:[],
        dialogVisible:false,
        titleLevels:[
            '正高级',
            '副高级',
            '中级',
            '初级',
            '员级'
        ]
      }
    },
    mounted() {
      this.initjls();
    },
    methods:{
      doUpdate(){
        putRequest("/system/basic/joblevel/",this.updateJl).then(resp=>{
          if(resp){
            this.initjls();
            this.dialogVisible=false;
          }
        })
      },
      showEditView(data) {
        Object.assign(this.updateJl,data);
        this.dialogVisible=true;

      },
      deleteHandler(data){
        this.$confirm('此操作将永久【'+data.name+'】职称, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteRequest("/system/basic/joblevel/"+data.id).then(resp=>{
            if(resp){
              this.initjls();
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      initjls(){
        getRequest("/system/basic/joblevel/").then(resp=>{
          this.jls=resp;
          this.jl={
            name:'',
            titleLevel:''
          }
        })
      },
      addJobLevel(){
        if(this.jl.name&&this.jl.titleLevel){
          postRequest("/system/basic/joblevel/",this.jl).then(resp=>{
            if(resp){
              this.initjls();
            }
          })
        }else{
          this.$message.error("添加字段不可为空！");
        }
      }
    }
  }
</script>

<template>
<div>
  <div>
    <el-input
        size="small"
        v-model="jl.name"
        style="width: 300px"
        prefix-icon="el-icon-plus"
        placeholder="添加职称...">
    </el-input>
      <el-select v-model="jl.titleLevel" placeholder="职称等级" size="small" style="margin-left: 5px; margin-right: 5px">
        <el-option
            v-for="item in titleLevels"
            :key="item"
            :label="item"
            :value="item">
        </el-option>
      </el-select>
    <el-button icon="el-icon-plus" type="primary" size="small" @click="addJobLevel"> 添加</el-button>
  </div>
  <div style="margin-top: 10px">
    <el-table
        :data="jls"
        size="small"
        border
        style="width: 80%">
      <el-table-column
          prop="id"
          label="编号"
          width="55">
      </el-table-column>
      <el-table-column
          prop="name"
          label="职称名称"
          width="150">
      </el-table-column>
      <el-table-column
          prop="titleLevel"
          label="职称级别">
      </el-table-column>
      <el-table-column
          prop="createDate"
          label="创建时间">
      </el-table-column>
      <el-table-column
          label="是否启用">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.enabled">已启用</el-tag>
          <el-tag type="danger" v-else>未启用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
          label="操作">
        <template slot-scope="scope">
              <el-button size="small" @click="showEditView(scope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="deleteHandler(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <el-dialog
      title="修改职称"
      :visible.sync="dialogVisible"
      width="30%">
    <div>
      <table>
        <tr>
          <td><el-tag>职称名称</el-tag></td>
          <td><el-input class="updatePosInput" size="small" v-model="updateJl.name"></el-input></td>
        </tr>
        <tr>
          <td><el-tag>职称级别</el-tag></td>
          <td>
            <el-select v-model="updateJl.titleLevel" placeholder="职称等级" size="small" style="margin-left: 5px; margin-right: 5px">
              <el-option
                  v-for="item in titleLevels"
                  :key="item"
                  :label="item"
                  :value="item">
              </el-option>
            </el-select>

          </td>
        </tr>
        <tr>
          <td><el-tag>是否启用</el-tag></td>
          <td><el-switch  active-text="启用" inactive-text="禁用" v-model="updateJl.enabled"></el-switch></td>
        </tr>

      </table>

    </div>
    <span slot="footer" class="dialog-footer">
    <el-button size="small" @click="dialogVisible = false">取 消</el-button>
    <el-button size="small" type="primary" @click="doUpdate">确 定</el-button>
  </span>
  </el-dialog>
</div>
</template>

<style scoped>

</style>