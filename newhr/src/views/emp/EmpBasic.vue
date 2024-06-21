<template>
<div >
  <div >
    <div >
      <div style="display: flex;justify-content: space-between">
        <div>
          <el-input size="small" placeholder="请输入员工名进行查询..."
                    clearable
                    @clear="initEmps"
                    prefix-icon="el-icon-search" style="width:300px;margin-right: 10px"
                    :disabled="showAdvanceSearchView"
                    v-model="keyword" @keydown.native.enter="initEmps"></el-input>
          <el-button size="small" type="primary" icon="el-icon-search" @click="initEmps" :disabled="showAdvanceSearchView">搜索</el-button>
          <el-button size="small" type="primary" @click="showAdvanceSearchView=!showAdvanceSearchView">
            <i :class="showAdvanceSearchView?'fa fa-angle-double-up':'fa fa-angle-double-down'" aria-hidden="true"></i>
            高级搜索</el-button>
        </div>
        <div>
          <el-upload
              :show-file-list="false"
              :before-upload="beforeUpload"
              :on-success="onSuccess"
              :on-error="onError"
              :disabled="importDataDisabled"
              style="display: inline-flex;margin-right: 8px"
              action="/emp/basic/import/"
          >
            <el-button :disabled="importDataDisabled" size="small" type="success" :icon="importDataBtnIcon">

              {{importDataBtnText}}</el-button>
          </el-upload>

          <el-button size="small" type="success" icon="el-icon-download" @click="exportData">

            导出数据</el-button>
          <el-button size="small" type="primary" icon="el-icon-plus" @click="showAddEmpView">
            添加用户</el-button>
        </div>
      </div>
    <transition name="slide-fade">
      <div v-show="showAdvanceSearchView" style="border: 1px solid #409eff;border-radius: 5px;box-sizing: border-box;padding: 5px ;margin: 10px
0px;">
        <el-row>
          <el-col :span="5">
              政治面貌：
                <el-select v-model="searchValue.politicId" placeholder="政治面貌" size="mini" style="width: 130px">
                    <el-option
                     v-for="item in politicsstatus"
                      :key="item.id"
                      :label="item.name"
                     :value="item.id">
                    </el-option>
              </el-select>
          </el-col>
          <el-col :span="4">
            民族:
            <el-select v-model="searchValue.nationId" placeholder="民族" size="mini" style="width: 130px">
              <el-option
                  v-for="item   in nations"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            职位:
            <el-select v-model="searchValue.posId" placeholder="职位" size="mini" style="width: 130px">
              <el-option
                  v-for="item in positions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            职称:
            <el-select v-model="searchValue.jobLevelId" placeholder="职称" size="mini" style="width: 130px">
              <el-option
                  v-for="item in joblevels"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="7">
            聘用形式:
            <el-radio-group v-model="searchValue.engageForm">
              <el-radio label="劳动合同">劳动合同</el-radio>
              <el-radio label="劳务合同" >劳务合同</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px">
          <el-col :span="5">
            所属部门：
            <el-popover
                placement="bottom"
                title="部门"
                width="200"
                trigger="manual"
                v-model="popVisible">
              <el-tree default-expand-all :data="allDeps" :props="defaultProps" @node-click="searchViewHandleNodeClick"></el-tree>
              <div slot="reference"  style="width: 130px;display: inline-flex;font-size:13px;border: 1px solid #dedede ;height: 25px;border-radius: 5px;
              cursor: pointer;align-items: center;padding-left: 8px;box-sizing: border-box;margin-left: 3px" @click="showDepView">{{inputDepName}}
              </div>
            </el-popover>
          </el-col>
          <el-col :span="10">
            入职日期:
            <el-date-picker
                v-model="searchValue.beginDateScope"
                type="daterange"
                value-format="yyyy-MM-dd"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                size="mini"
                end-placeholder="结束日期">
            </el-date-picker>
          </el-col>
          <el-col :span="5" :offset="4">
              <el-button size="mini">取消</el-button>
              <el-button size="mini" icon="el-icon-search" type="primary" @click="initEmps('advanced')">搜索</el-button>
          </el-col>
        </el-row>
      </div>
    </transition>
      <div style="margin-top: 10px">
        <el-table
            :data="emps"
            size="small"
            stripe
            border
            v-loading="loading"
            element-loading-text="正在加载..."
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            style="width: 100%">
          <el-table-column
              type="selection"
              width="55">
          </el-table-column>
          <el-table-column
              prop="name"
              fixed
              label="姓名"
              align="left"
              width="100">
          </el-table-column>
          <el-table-column
              prop="gender"
              label="性别"
              align="left"
              width="90">
          </el-table-column>
          <el-table-column
              prop="workID"
              label="工号"
              align="left"
              width="90">
          </el-table-column>
          <el-table-column
              prop="birthday"
              width="110"
              align="left"
              label="出生日期">
          </el-table-column>
          <el-table-column
              prop="idCard"
              width="180"
              align="left"
              label="身份证号码">
          </el-table-column>
          <el-table-column
              prop="wedlock"
              width="80"
              label="婚姻状况">
          </el-table-column>
          <el-table-column
              prop="nation.name"
              width="50"
              label="民族">
          </el-table-column>
          <el-table-column
              prop="nativePlace"
              width="80"
              label="籍贯">
          </el-table-column>
          <el-table-column
              prop="politicsstatus.name"
              label="政治面貌">
          </el-table-column>
          <el-table-column
              prop="email"
              width="180"
              align="left"
              label="电子邮件">
          </el-table-column>
          <el-table-column
              prop="phone"
              width="115"
              align="left"
              label="电话号码">
          </el-table-column>
          <el-table-column
              prop="address"
              width="220"
              align="left"
              label="联系地址">
          </el-table-column>
          <el-table-column
              prop="department.name"
              width="100"
              align="left"
              label="所属部门">
          </el-table-column>
          <el-table-column
              prop="position.name"
              width="110"
              label="职位">
          </el-table-column>
          <el-table-column
              prop="jobLevel.name"
              width="110"
              label="职称">
          </el-table-column>
          <el-table-column
              prop="engageForm"
              width="100"
              align="left"
              label="聘用形式">
          </el-table-column>
          <el-table-column
              prop="tiptopDegree"
              width="80"
              align="left"
              label="最高学历">
          </el-table-column>
          <el-table-column
              prop="school"
              width="150"
              align="left"
              label="毕业院校">
          </el-table-column>
          <el-table-column
              prop="specialty"
              width="150"
              align="left"
              label="专业名称">
          </el-table-column>
          <el-table-column
              prop="beginDate"
              width="100"
              align="left"
              label="入职日期">
          </el-table-column>
          <el-table-column
              prop="conversionTime"
              width="100"
              align="left"
              label="转正日期">
          </el-table-column>
          <el-table-column
              prop="beginContract"
              width="105"
              align="left"
              label="合同起始日期">
          </el-table-column>
          <el-table-column
              prop="endContract"
              width="105"
              align="left"
              label="合同终止日期">
          </el-table-column>
          <el-table-column
              width="100"
              align="left"
              label="合同期限">
            <template slot-scope="scope">
              <el-tag>{{scope.row.contractTerm}}</el-tag>年
            </template>
          </el-table-column>
          <el-table-column
              fixed="right"
              width="200px"
              label="操作">
            <template slot-scope="scope">
              <el-button @click="showEditEmpView(scope.row)" style="padding: 5px" size="mini">编辑</el-button>
              <el-button style="padding: 5px" size="mini" type="primary">查看高级资料 </el-button>
              <el-button @click="deleteEmp(scope.row)" style="padding: 5px" size="mini" type="danger">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="display: flex;justify-content: flex-end">
          <el-pagination
              background
              @current-change="currentChange"
              @size-change="sizeChange"
              layout="sizes, prev, pager, next, jumper, ->, total, slot"
              :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
  <div style="margin-top: 10px"></div>
  <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="80%" >
    <div>
      <el-form size="small" :model="emp" :rules="rules" ref="empForm">
        <el-row>
          <el-col :span="6">
               <el-form-item label="姓名:" prop="name">
                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit" v-model="emp.name" placeholder="请输入员工姓名..."></el-input>
               </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="性别:" prop="gender">
              <el-radio-group v-model="emp.gender">
                <el-radio label="男">男</el-radio>
                <el-radio label="女" >女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="出生日期:" prop="birthday">
              <el-date-picker
                  v-model="emp.birthday"
                  size="mini"
                  type="date"
                  value-format="yyyy-MM-dd"
                  style="width: 150px"
                  placeholder="出生日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="政治面貌:" prop="politicId">
              <el-select v-model="emp.politicId" placeholder="政治面貌" size="mini" style="width: 200px">
                <el-option
                    v-for="item in politicsstatus"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="民族:" prop="nationId">
              <el-select v-model="emp.nationId" placeholder="民族" size="mini" style="width: 150px">
                <el-option
                    v-for="item in nations"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="籍贯:" prop="nativePlace">
              <el-input size="mini" style="width: 120px" prefix-icon="el-icon-edit" v-model="emp.nativePlace" placeholder="请输入籍贯..."></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="电子邮箱:" prop="email">
              <el-input size="mini" style="width: 150px" prefix-icon="el-icon-message" v-model="emp.email" placeholder="请输入电子邮箱..."></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="联系地址:" prop="address">
              <el-input size="mini" style="width: 200px" prefix-icon="el-icon-edit" v-model="emp.address" placeholder="请输入联系地址..."></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="职位:" prop="posId">
              <el-select v-model="emp.posId" placeholder="职位" size="mini" style="width: 150px">
                <el-option
                    v-for="item in positions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="职称:" prop="jobLevelId">
              <el-select v-model="emp.jobLevelId" placeholder="职称" size="mini" style="width: 150px">
                <el-option
                    v-for="item in joblevels"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="所属部门:" prop="departmentId">
              <el-popover
                  placement="bottom"
                  title="部门"
                  width="200"
                  trigger="manual"
                  v-model="popVisible">
                <el-tree default-expand-all :data="allDeps" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
                <div slot="reference"  style="width: 150px;display: inline-flex;font-size:13px;border: 1px solid #dedede ;height: 25px;border-radius: 5px;
              cursor: pointer;align-items: center;padding-left: 8px;box-sizing: border-box" @click="showDepView">{{inputDepName}}
                </div>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="电话号码:" prop="phone">
              <el-input size="mini" style="width: 200px" prefix-icon="el-icon-phone" v-model="emp.phone" placeholder="请输入电话号码..."></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="工号:" prop="workId">
              <el-input disabled size="mini" style="width: 150px" prefix-icon="el-icon-edit" v-model="emp.workID" placeholder="请输入工号..."></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="学历:" prop="tiptopDegree">
              <el-select v-model="emp.tiptopDegree" placeholder="学历" size="mini" style="width: 150px">
                <el-option
                    v-for="item in tiptopDegree"
                    :key="item"
                    :label="item"
                    :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="毕业院校:" prop="school">
              <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit" v-model="emp.school" placeholder="请输入毕业院校..."></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="专业名称:" prop="specialty">
              <el-input size="mini" style="width: 200px" prefix-icon="el-icon-edit" v-model="emp.specialty" placeholder="请输入专业名称..."></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="入职日期:" prop="beginDate">
              <el-date-picker
                  v-model="emp.beginDate"
                  size="mini"
                  type="date"
                  value-format="yyyy-MM-dd"
                  style="width: 130px"
                  placeholder="入职日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="转正日期:" prop="conversionTime">
              <el-date-picker
                  v-model="emp.conversionTime"
                  size="mini"
                  type="date"
                  value-format="yyyy-MM-dd"
                  style="width: 130px"
                  placeholder="转正日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="合同起始日期:" prop="beginContra">
              <el-date-picker
                  v-model="emp.beginContract"
                  size="mini"
                  type="date"
                  value-format="yyyy-MM-dd"
                  style="width: 130px"
                  placeholder="合同起始日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="合同终止日期:" prop="endContract">
              <el-date-picker
                  v-model="emp.endContract"
                  size="mini"
                  type="date"
                  value-format="yyyy-MM-dd"
                  style="width: 150px"
                  placeholder="合同终止日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="身份证号码:" prop="idCard">
              <el-input size="mini" style="width: 180px" prefix-icon="el-icon-edit" v-model="emp.idCard" placeholder="请输入身份证号码..."></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="聘用形式:" prop="engageForm">
              <el-radio-group v-model="emp.engageForm">
                <el-radio label="劳动合同">劳动合同</el-radio>
                <el-radio label="劳务合同" >劳务合同</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="婚姻状况:" prop="wedlock">
              <el-radio-group v-model="emp.wedlock">
                <el-radio label="已婚">已婚</el-radio>
                <el-radio label="未婚">未婚</el-radio>
                <el-radio label="离异">离异</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false" size="small">取 消</el-button>
    <el-button type="primary" @click="doAddEmp" size="small">确 定</el-button>
  </span>
  </el-dialog>
</div>
</template>
<script>
import {deleteRequest, getRequest, postRequest, putRequest} from "@/utils/api"
export default {
  name:"EmpBasic",
  data(){
    return{
      searchValue:{
        politicId:'',
        nationId:'',
        jobLevelId:'',
        posId:'',
        engageForm: null,
        departmentId: null,
        beginDateScope:null
      },
      showAdvanceSearchView:false,
      importDataDisabled:false,
      title:'',
      importDataBtnText:'导入数据',
      importDataBtnIcon:'el-icon-upload2',
      allDeps:[],
      keyword:'',
      popVisible:false,
      emps:[],
      loading:false,
      dialogVisible:false,
      total:0,
      page:1,
      size:10,
      nations:[],
      joblevels:[],
      politicsstatus:[],
      positions:[],
      tiptopDegree:['本科','大专','硕士','博士','高中','初中','小学','其他'],
      inputDepName:'所属部门  ',
      emp:{
        name: "江南一点雨",
        gender: "男",
        birthday: "1990-01-01",
        idCard: "610122199001011256",
        wedlock: "已婚",
        nationId: 1,
        nativePlace: "陕西",
        politicId: 13,
        email:"laowang@qq.com",
        phone: "18565558897",
        address: "深圳市南山区",
        departmentId: null,
        jobLevelId: 9,
        posId: 29,
        engageForm: "劳务合同",
        tiptopDegree: "本科",
        specialty: "信息管理与信息系统",
        school: "深圳大学",
        beginDate: "2018-01-01",
        workState: "在职",
        workID: "00000001",
        contractTerm: 2.0,
        conversionTime: "2018-04-01",
        notWorkDate: null,
        beginContract: "2018-01-01",
        endContract: "2020-01-01",
        workAge: null,

      },
        defaultProps: {
      children: 'children',
          label: 'name'
    },
      rules:{
       name:[{required:true,message:'请输入用户名',trigger:'blur'}],
        gender:[{required:true,message:'请输入用户性别',trigger:'blur'}],
        birthday:[{required:true,message:'请输入出生日期',trigger:'blur'}],
        idCard:[{required:true,message:'请输入身份证号码',trigger:'blur'},{
         pattern:/^(([1-9][0-9]{5}(19|20)[0-9]{2}((0[1-9])|(1[0-2]))([0-2][1-9]|10|20|30|31)[0-9]{3}([0-9]|X|x))|([1-9][0-9]{5}[0-9]{2}((0[1-9])|(1[0-2]))([0-2][1-9]|10|20|30|31)[0-9]{3}))$/,
          message: '身份证格式不对',
          trigger: "blur"
        }],
        wedlock:[{required:true,message:'请输入婚姻状况',trigger:'blur'}],
        nationId:[{required:true,message:'请输入民族',trigger:'blur'}],
        nativePlace:[{required:true,message:'请输入籍贯',trigger:'blur'}],
        politicId:[{required:true,message:'请输入政治面貌',trigger:'blur'}],
        email:[{required:true,message:'请输入邮箱',trigger:'blur'},
          {
            type:'email',
            message: '邮箱格式不正确！',
            trigger: 'blur'
          }],
        phone:[{required:true,message:'请输入员工手机号码',trigger:'blur'}],
        address:[{required:true,message:'请输入员工地址',trigger:'blur'}],
        departmentId:[{required:true,message:'请输入员工部门',trigger:'blur'}],
        jobLevelId:[{required:true,message:'请输入职称',trigger:'blur'}],
        posId:[{required:true,message:'请输入职位',trigger:'blur'}],
        engageForm:[{required:true,message:'请输入聘用形式',trigger:'blur'}],
        tiptopDegree:[{required:true,message:'请输入学历',trigger:'blur'}],
        specialty:[{required:true,message:'请输入专业',trigger:'blur'}],
        school:[{required:true,message:'请输入毕业院校',trigger:'blur'}],
        beginDate:[{required:true,message:'请输入入职日期',trigger:'blur'}],
        workState:[{required:true,message:'请输入工作状态',trigger:'blur'}],
        workID:[{required:true,message:'请输入工号',trigger:'blur'}],
        contractTerm:[{required:true,message:'请输入合同期限',trigger:'blur'}],
        conversionTime:[{required:true,message:'请输入转正日期',trigger:'blur'}],
        notworkDate:[{required:true,message:'请输入离职时间',trigger:'blur'}],
        beginContract:[{required:true,message:'请输入合同起始日期',trigger:'blur'}],
        endContract:[{required:true,message:'请输入合体结束日期',trigger:'blur'}],
        worAge:[{required:true,message:'请输入工龄',trigger:'blur'}],
      }
    }
  },
  mounted() {
    this.initEmps();
    this.initData();
    this.initPositions();
  },
  methods:{
    searchViewHandleNodeClick(data){
        this.inputDepName=data.name
        this.searchValue.departmentId=data.id;
        this.popVisible=!this.popVisible;
    },
    onError(){
      this.importDataBtnText='导入数据';
      this.importDataBtnIcon='el-icon-upload2';
      this.importDataDisabled=false;
    },
    onSuccess(){
      this.importDataBtnText='导入数据';
      this.importDataBtnIcon='el-icon-upload2';
      this.importDataDisabled=false;
      this.initEmps();
    },
    beforeUpload(){
      this.importDataBtnText='正在导入';
      this.importDataBtnIcon='el-icon-loading';
      this.importDataDisabled=true;
    },
    exportData(){
    window.open('/emp/basic/export/',"_parent");
    },
    emptyEmp(){
      this.emp={
        name: "",
        gender: "",
        birthday: "",
        idCard: "",
        wedlock: "",
        nationId:"",
        nativePlace: "",
        politicId: "",
        email:"",
        phone: "",
        address: "",
        departmentId: null,
        jobLevelId: "",
        posId: "",
        engageForm: "",
        tiptopDegree: "",
        specialty: "",
        school: "",
        beginDate: "",
        workID: "",
        contractTerm: 2.0,
        conversionTime: "",
        notWorkDate: null,
        beginContract: "",
        endContract: "",
        workAge: null,
      }
      this.inputDepName=''
    },
    showEditEmpView(data){
      this.title='编辑员工信息';
      this.emp=data;
      this.inputDepName=data.department.name;
      this.initPositions();
      this.dialogVisible=true;
    },
   deleteEmp(data){
     this.$confirm('此操作将永久【'+data.name+'】员工, 是否继续?', '提示', {
       confirmButtonText: '确定',
       cancelButtonText: '取消',
       type: 'warning'
     }).then(() => {
       //console.log(data.id)
       deleteRequest("/emp/basic/"+data.id).then(resp=>{
         if(resp){
           this.initEmps();
         }
       })
     }).catch(() => {
       this.$message({
         type: 'info',
         message: '已取消删除'
       });
     });
   },
    doAddEmp() {
      if(this.emp.id){
        this.$refs['empForm'].validate(valid=>{
          if(valid){
            putRequest("/emp/basic/",this.emp).then(resp=>{
              if(resp){
                this.dialogVisible=false;
                this.initEmps();
              }
            })
          }
        })
      }else{
        this.$refs['empForm'].validate(valid=>{
          if(valid){
            postRequest("/emp/basic/",this.emp).then(resp=>{
              if(resp){
                this.dialogVisible=false;
                this.initEmps();
              }
            })
          }
        })
      }


    },
    handleNodeClick(data){
      this.inputDepName=data.name;
      this.popVisible = !this.popVisible;
      this.emp.departmentId=data.id;
    },
    showDepView(){
      this.popVisible = !this.popVisible
    },
    initPositions() {
      getRequest('/emp/basic/positions/').then(resp=>{
        if(resp){
          this.positions=resp
        }
      })
    },
    getMaxWorkId(){
      getRequest("/emp/basic/maxWorkId/").then(resp=>{
        if(resp){
          this.emp.workID=resp.obj;
        }
      })
    },
    initData(){
      if(!window.sessionStorage.getItem("nations")||1===1){
       getRequest('/emp/basic/nations/').then(resp=>{
         if(resp){
           this.nations=resp
           window.sessionStorage.setItem("nations",JSON.stringify("resp"));
         }
       })
      }else{
        this.nations=JSON.parse(window.sessionStorage.getItem("nations"));
      }
      if(!window.sessionStorage.getItem("joblevels")){
        getRequest('/emp/basic/joblevels/').then(resp=>{
          if(resp){
            this.joblevels=resp;
            window.sessionStorage.setItem("joblevels",JSON.stringify("resp"));
          }
        })
      }else{
        this.joblevels=JSON.parse(window.sessionStorage.getItem("joblevels"));
      }
      if(!window.sessionStorage.getItem("politicsstatus")){
        getRequest('/emp/basic/politicsstatus/').then(resp=>{
          if(resp){
            this.politicsstatus=resp
            window.sessionStorage.setItem("politicsstatus",JSON.stringify("resp"));
          }
        })
      }else{
        this.politicsstatus=JSON.parse(window.sessionStorage.getItem("politicsstatus"));
      }
      if(!window.sessionStorage.getItem("deps")){
        getRequest('/emp/basic/deps/').then(resp=>{
          if(resp){
            this.allDeps=resp
            window.sessionStorage.setItem("deps",JSON.stringify("resp"));
          }
        })
      }else{
        this.allDeps=JSON.parse(window.sessionStorage.getItem("deps"));
      }
    },
    showAddEmpView(){
      this.emptyEmp();
      this.title='添加员工';

      this.getMaxWorkId();
      this.dialogVisible=true;
    },
    sizeChange(curreentSize){
      this.size=curreentSize;
      this.initEmps();
    }
    ,
    currentChange(currentPage){
      this.page=currentPage;
      this.initEmps();
    },
    initEmps(type){
      this.loading=true;
      let url='/emp/basic/?page='+this.page+"&size="+this.size;
      if(type && type==='advanced'){
        console.log(this.searchValue)
        url+='&politicId='+this.searchValue.politicId+'&nationId='+this.searchValue.nationId
        +'&jobLevelId='+this.searchValue.jobLevelId+'&posId='+this.searchValue.posId
        +'&engageForm='+this.searchValue.engageForm+'&departmentId='+this.searchValue.departmentId
        +'&beginDateScope='+this.searchValue.beginDateScope
      }else{
        url+="&name="+this.keyword
      }
      getRequest(url).then(resp=>{
        this.loading=false;
        if(resp){
          this.emps=resp.data;
          this.total=resp.total;
        }
      })
    }
  }
}
</script>
<style >
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>