<script >
import {deleteRequest, getRequest, postRequest,putRequest} from "@/utils/api";

export default {
  name:"SalSob",
  data(){
    return{
      dialogTitle:'添加工资账套',
      dialogVisible:false,
      salaries:[],
      activeItemIndex:0,
      salaryItemName:[
          '基本工资',
          '交通补助',
          '午餐补助',
          '奖金',
          '养老金比率',
          '养老金基数',
          '医疗保险比率',
          '医疗保险基数',
          '公积金比率',
          '公积金基数',
          '账套名称'
      ],
      salary:{
        basicSalary:null,
        trafficSalary:null,
        lunchSalary:null,
        bonus:null,
        pensionPer:null,
        pensionBase:null,
        medicalPer:null,
        medicalBase:null,
        accumulationFundPer:null,
        accumulationFundBase:null,
        name:''
      }
    }
  },
  mounted() {
    this.initSalaries();
  },
  methods:{
    showEditSalaryView(data){
      this.dialogTitle="修改工资账套"
      this.dialogVisible=true
      this.salary.basicSalary=data.basicSalary;
      this.salary.trafficSalary=data.trafficSalary;
      this.salary.lunchSalary=data.lunchSalary;
      this.salary.bonus=data.bonus;
      this.salary.pensionPer=data.pensionPer;
      this.salary.pensionBase=data.pensionBase;
      this.salary.medicalPer=data.medicalPer;
      this.salary.medicalBase=data.medicalBase;
      this.salary.accumulationFundPer=data.accumulationFundPer;
      this.salary.accumulationFundBase=data.accumulationFundBase;
      this.salary.name=data.name;
      this.salary.id=data.id;
    },
    deleteSalary(data){
      this.$confirm('此操作将永久【'+data.name+'】账套, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //console.log(data.id)
        deleteRequest("/salary/sob/"+data.id).then(resp=>{
          if(resp){
            this.initSalaries();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    lastStep(){
      if(this.activeItemIndex==0){
        this.salary={
          basicSalary:null,
          trafficSalary:null,
          lunchSalary:null,
          bonus:null,
          pensionPer:null,
          pensionBase:null,
          medicalPer:null,
          medicalBase:null,
          accumulationFundPer:null,
          accumulationFundBase:null,
          name:''
        }
        this.dialogVisible=false
        return;
      }
     this.activeItemIndex--;
    },
    nextStep(){
      if(this.activeItemIndex==10){
        if(this.salary.id){

          putRequest('/salary/sob/',this.salary).then(resp=>{
            if(resp){
              this.initSalaries();
              this.dialogVisible=false;
            }
          })
        }
        else {
          postRequest('/salary/sob/',this.salary).then(resp=>{
            if(resp){
              this.initSalaries();
              this.dialogVisible=false;
            }
          })
        }
        this.salary={
          basicSalary:null,
          trafficSalary:null,
          lunchSalary:null,
          bonus:null,
          pensionPer:null,
          pensionBase:null,
          medicalPer:null,
          medicalBase:null,
          accumulationFundPer:null,
          accumulationFundBase:null,
          name:''
        }
        this.activeItemIndex=0
        return;
      }
      this.activeItemIndex++;
    },
    showAddSalaryView(){
      this.dialogTitle="添加工资胀套"
        this.dialogVisible=true;
    },
    initSalaries(){
      getRequest('/salary/sob/').then(resp=>{
        console.log(resp);
        if(resp){
          this.salaries=resp;
        }
      })
    }
  }
}
</script>

<template>
<div>
  <div style="display: flex;justify-content: space-between">
      <el-button size="small" icon="el-icon-plus" type="primary" @click="showAddSalaryView">添加工资账套</el-button>
      <el-button size="small" icon="el-icon-refresh" type="success" @click="initSalaries"></el-button>
  </div>
  <div  style="margin-top: 10px">
      <el-table :data="salaries" border stripe >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column width="120" prop="name" label="账套名称"></el-table-column>
          <el-table-column width="70" prop="basicSalary" label="基本工资"></el-table-column>
          <el-table-column width="70" prop="trafficSalary" label="交通补助"></el-table-column>
          <el-table-column width="70" prop="lunchSalary" label="午餐补助"></el-table-column>
          <el-table-column width="70" prop="bonus" label="奖金"></el-table-column>
          <el-table-column width="100" prop="createDate" label="启用时间"></el-table-column>
        <el-table-column label="养老金" align="center">
            <el-table-column width="70" prop="pensionPer" label="比率"></el-table-column>
            <el-table-column width="70" prop="pensionBase" label="基数"></el-table-column>
        </el-table-column>
        <el-table-column label="医疗保险" align="center">
          <el-table-column width="70" prop="medicalPer" label="比率"></el-table-column>
          <el-table-column width="70" prop="medicalBase" label="基数"></el-table-column>
        </el-table-column>
        <el-table-column label="公积金" align="center">
          <el-table-column width="70" prop="accumulationFundPer" label="比率"></el-table-column>
          <el-table-column width="70" prop="accumulationFundBase" label="基数"></el-table-column>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="showEditSalaryView(scope.row)" size="mini">编辑</el-button>
            <el-button size="mini" type="danger" @click="deleteSalary(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
  </div>
  <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="50%">
    <div style="display: flex;justify-content: space-around;align-items: center">
      <el-steps direction="vertical" :active="activeItemIndex">
        <el-step :title="itemName" v-for="(itemName,index) in salaryItemName" :key="index"></el-step>
      </el-steps>
      <el-input v-model="salary[title]" :placeholder="'请输入'+salaryItemName[index]+'...'" v-for="(value,title,index) in salary"
                :key="index" v-show="activeItemIndex===index" style="width: 200px">
      </el-input>
    </div>
    <span slot="footer" class="dialog-footer">
    <el-button size="small" @click="lastStep">{{activeItemIndex===0?'取消':'上一步'}}</el-button>
    <el-button size="small" type="primary" @click="nextStep">{{activeItemIndex===10?'完成':'下一步'}}</el-button>
  </span>
  </el-dialog>
</div>
</template>

<style >

</style>