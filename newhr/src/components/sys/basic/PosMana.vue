<script >
import {getRequest} from"@/utils/api"
import {postRequest} from"@/utils/api"
import {deleteRequest} from"@/utils/api"
import {putRequest} from"@/utils/api"
export default {
  name:"PosMana",
  data(){
    return{
      pos:{
        name:''
      },
      multipleSelection:[],
      positions:[],
      dialogVisible:false,
      updatePos:{
        name:'',
        enabled:false
      }
    }
  },
  mounted() {
    this.initPositions();
  }
  ,
  methods:{
    deleteMany(){
      this.$confirm('此操作将永久【'+this.multipleSelection.length+'】条记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids='?';
        this.multipleSelection.forEach(item=>{
          ids+='ids='+item.id+'&';
        })
        deleteRequest("/system/basic/pos/"+ids).then(resp=>{
          if(resp){
            this.initPositions();
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
    handleSelectionChange(val){
    this.multipleSelection=val;
    },
    initPositions(){
      getRequest("/system/basic/pos/").then(resp=>{
        console.log(resp);
        if(resp){
          this.positions=resp;
        }
      })
    },
    showEditView(index,data){
      Object.assign(this.updatePos,data);
      this.dialogVisible=true;

    },
    doUpdate(){
      putRequest("/system/basic/pos/",this.updatePos).then(resp=>{
        if(resp){
          this.initPositions();
          this.updatePos.name='';
          this.dialogVisible=false;
        }
      })
    }
    ,
    handleDelete(index,data){
      this.$confirm('此操作将永久【'+data.name+'】职位, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRequest("/system/basic/pos/"+data.id).then(resp=>{
          if(resp){
            this.initPositions();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    addPosition(){
      if(this.pos.name){
       postRequest("/system/basic/pos/",this.pos).then(resp=>{
         if(resp){
           this.initPositions();
           this.pos.name='';
         }
       })
      }else{
        this.$message.error('职位名不能为空！');
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
        class="addPosInput"
        placeholder="添加职位..."
        prefix-icon="el-icon-plus"
        @keydown.enter.native="addPosition"
        v-model="pos.name">
    </el-input>
    <el-button icon="el-icon-plus" size="small" type="primary" @click="addPosition">添加</el-button>
  </div>
  <div class="posManaMain">
    <el-table
        :data="positions"
        border
        size="small"
        stripe
        @selection-change="handleSelectionChange"
        style="width: 70%">
      <el-table-column
          type="selection"
          width="55">
      </el-table-column>
      <el-table-column
          prop="id"
          label="编号"
          width="100">
      </el-table-column>
      <el-table-column
          prop="name"
          label="职位名称"
          width="140">
      </el-table-column>
      <el-table-column
          prop="createDate"
          label="创建时间">
      </el-table-column>
      <el-table-column>
        <el-table-column
            label="是否启用">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.enabled">已启用</el-tag>
            <el-tag type="danger" v-else>未启用</el-tag>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
          label="操作">
        <template slot-scope="scope">
          <el-button
              size="mini"
              @click="showEditView(scope.$index, scope.row)">编辑</el-button>
          <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button @click="deleteMany" type="danger" size="small" style="margin-top: 8px" :disabled="multipleSelection.length===0">批量删除</el-button>
  </div>
  <el-dialog
      title="修改职位"
      :visible.sync="dialogVisible"
      width="30%">
    <div>
      <table>
        <tr>
          <td><el-tag>职位名称</el-tag></td>
          <td> <el-input class="updatePosInput" size="small" v-model="updatePos.name"></el-input></td>
        </tr>
        <tr>
          <td><el-tag>是否启用</el-tag></td>
          <td><el-switch  active-text="启用" inactive-text="禁用" v-model="updatePos.enabled"></el-switch></td>
        </tr>
      </table>
    </div>
    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="doUpdate">确 定</el-button>
  </span>
  </el-dialog>
</div>
</template>

<style >
.addPosInput{
  width: 300px;
  margin-right: 8px;
}
.posManaMain{
  margin-top: 10px;
}
.updatePosInput{
  //margin-left: 8px;
}
</style>