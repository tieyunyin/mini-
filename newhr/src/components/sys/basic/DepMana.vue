
<template>
<div>
  <div style="width: 500px">
    <el-input
        placeholder="请输入部门名称进行搜索... "
        prefix-icon="el-icon-search"
        size="small"
        v-model="filterText">
    </el-input>

    <el-tree
        class="filter-tree"
        :data="dps"
        :props="defaultProps"
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        ref="tree">
      <span class="custom-tree-node" style="display: flex;justify-content: space-between;width: 100%" slot-scope="{  data }">
        <span>{{ data.name }}</span>
        <span>
          <el-button
              type="primary"
              size="mini"
              class="depBtn"
              @click="() => showAddDepView(data)">
            添加部门
          </el-button>
          <el-button
              type="danger"
              size="mini"
              class="depBtn"
              @click="() => deleteDep(data)">
            删除部门
          </el-button>
        </span>
      </span>
    </el-tree>
    <el-dialog
        title="添加部门 "
        :visible.sync="dialogVisible"
        width="30%">
      <div>
          <table >
            <tr>
              <td><el-tag size="small">上级部门</el-tag></td>
              <td>{{pname}}</td>
            </tr>
            <tr>
              <td><el-tag size="small">部门名称</el-tag></td>
              <td><el-input size="small" v-model="dep.name" placeholder="请输入部门名称..."></el-input></td>
            </tr>
          </table>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="doAddDep">确 定</el-button>
  </span>
    </el-dialog>

  </div>
</div>
</template>
<script >
import {deleteRequest, getRequest, postRequest} from "@/utils/api";

export default {
      name:"DepMana",
      data(){
        return{
          dep:{
            name:'',
            parentId:-1
          },
          pname:'',
          dialogVisible:false,
          filterText:'',
          dps:[],
          defaultProps:{
            children:'children',
            label:'name'
          }
        }
      },
      watch: {
        filterText(val) {
          this.$refs.tree.filter(val);
        }
      },
    mounted(){
      this.initDeps();
    },
      methods:{
        removeDepFromDeps(deps,dep){
          for(let i=0;i<deps.length;i++){
            let d=deps[i];
            if(d.id===dep){
              deps.splice(i,1);
              return
            }else{
              this.removeDepFromDeps(d.children,dep);
            }
          }
        }
        ,
        addDep2Deps(deps,dep){
            for(let i=0;i<deps.length;i++){
              let d=deps[i];
              if(d.id===dep.parentId){
                d.children=d.children.concat(dep);
                return
              }else{
                this.addDep2Deps(d.children,dep);
              }
            }
        },
        initdep(){
          this.dep={
            name:'',
                parentId:-1
          },
          this.pname=''
        },
        doAddDep(){
          postRequest("/system/basic/department/",this.dep).then(resp=>{
            if(resp){
              this.addDep2Deps(this.dps,resp.obj);
              this.dialogVisible=false;
              this.initdep();
            }
          })
        },
        deleteDep(data){
          this.$confirm('此操作将永久【'+data.name+'】部门, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            deleteRequest("/system/basic/department/"+data.id).then(resp=>{
              if(resp){
                this.removeDepFromDeps(this.dps,data.id);
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        },
        showAddDepView(data){
          this.pname=data.name;
          this.dep.parentId=data.id;
          this.dialogVisible=true;

        },
        initDeps(){
          getRequest("/system/basic/department/").then(resp=>{
            if(resp){
              this.dps=resp;
            }
          })
        },

        filterNode(value, data){
          if (!value) return true;
          return data.name.indexOf(value) !== -1;
        }
      }
    }
</script>

<style>
.depBtn{
  padding: 2px;
}
</style>