<script >
import DepMana from "@/components/sys/basic/DepMana.vue";
import EcMana from "@/components/sys/basic/EcMana.vue";
import JobLevelMana from "@/components/sys/basic/JobLevelMana.vue";
import PermissMana from "@/components/sys/basic/PermissMana.vue";
import PosMana from "@/components/sys/basic/PosMana.vue";

export default {
  name:"SysBasic",
  data(){
    return{
      activeName:'first'
    }
  },
  components:{
    DepMana,
    EcMana,
    JobLevelMana,
    PermissMana,
    PosMana
  }
}
</script>

<template>
<div>
      <el-tabs v-model="activeName" type="card" >
      <el-tab-pane label="部门管理" name="DepMana"><DepMana></DepMana></el-tab-pane>
      <el-tab-pane label="职位管理" name="PosMana"><PosMana></PosMana></el-tab-pane>
      <el-tab-pane label="职称管理" name="JobLevelMana"><JobLevelMana></JobLevelMana></el-tab-pane>
      <el-tab-pane label="奖惩规则" name="EcMana"><EcMana></EcMana></el-tab-pane>
      <el-tab-pane label="权限组" name="PermissMana"><PermissMana></PermissMana></el-tab-pane>
</el-tabs>
</div>
</template>

<style>

</style>