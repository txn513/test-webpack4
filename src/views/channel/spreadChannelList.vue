<template>
    <section>
        <!--查询-->
        <div class="toolbar el-col el-col-24" style="margin-top: 40px;text-align:right;">
            <div class="block">
               <!-- <div style="float:left"><el-button type="primary"  align="center"  v-on:click="addSpreadChannelButton"  icon="el-icon-circle-plus-outline">新增</el-button></div>-->
                <div style="float:left"> <el-button type="primary"  align="center"  v-on:click="synchronizationChaParameterBtn" >同步门店信息</el-button></div>
                <!--按钮-->
                <el-input size="medium" v-model.trim="queryKey" placeholder="输入渠道名称" style="width:370px;"></el-input>
                <el-button type="primary"  v-on:click="getSpreadChannelList(true)" :loading="listLoading" icon="el-icon-search">查询</el-button> &nbsp; &nbsp;
            </div>
        </div>

        <!--table-->
        <el-table v-loading="listLoading" :data="spreadChannel" style="width: 100%;margin-top: 30px;">
            <el-table-column type="index" width="50"> </el-table-column>
            <el-table-column sortable align="center" prop="chaName"label="渠道名称"> </el-table-column>
            <el-table-column sortable align="center" prop="relateType" label="类型"> </el-table-column>
            <el-table-column sortable align="center" prop="count" label="推广次数"> </el-table-column>
            <el-table-column sortable align="center" prop="percentage" label="操作">
                <template slot-scope="scope">
                    <el-button @click="manageDetail(scope.row)" type="text" size="small">详细管理</el-button>
                    <el-button @click="isDelete(scope.row)" type="text" size="small" >{{scope.row.enable}}</el-button>
                </template>
            </el-table-column>

        </el-table>

        <!--分页-->
        <div class="block" style="text-align:right;">
            <el-pagination @current-change="handleCurrentChange"
                           :page-size="pageSize"
                           layout="prev, pager, next"
                           :total="total">
            </el-pagination>
        </div>


        <!--新增基础推广信息界面    该功能暂未开放-->
        <el-dialog title="新增" v-model="addFormVisible" :visible.sync="addFormVisible">
            <el-form :model="addBaseForm" label-width="80px" :rules="addFormRules" ref="addBaseForm">
                <el-form-item label="渠道名称" prop="chaName">
                    <el-input v-model="addBaseForm.chaName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="relateType" >
                    <el-radio-group v-model="addBaseForm.relateType">
                        <el-radio class="radio" :label="1">个人</el-radio>
                        <el-radio class="radio" :label="0">门店</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="用户名称" prop="userName">
                    <el-input v-model="addBaseForm.userName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="联系电话" prop="userPhone">
                    <el-input v-model="addBaseForm.userPhone" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="userPassword">
                    <el-input type="password" v-model="addBaseForm.userPassword" ></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="text" v-model="addBaseForm.remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
              <!--  <el-button @click="resetForm('ruleForm')">重置</el-button>-->
                <el-button type="primary" @click.native="addSubmit('addBaseForm')" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>


        <!--新增推广详情界面-->
        <el-dialog title="新增" v-model="addInfoFormVisible" :visible.sync="addInfoFormVisible">
            <el-form :model="addInfoForm" label-width="80px" :rules="addInfoFormRules" ref="addInfoForm">
                <el-form-item label="渠道名称" prop="chaName">
                    <el-input v-model="addInfoForm.chaName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="渠道类型" prop="chaType" >
                    <el-radio-group v-model="addInfoForm.chaType">
                        <el-radio class="radio" :label="0">APP</el-radio>
                        <el-radio class="radio" :label="1">微信</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="渠道参数" prop="chaParameter">
                    <el-input v-model="addInfoForm.chaParameter" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="text" v-model="addInfoForm.remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addInfoFormVisible = false">取消</el-button>
                <!--  <el-button @click="resetForm('ruleForm')">重置</el-button>-->
                <el-button type="primary" @click.native="addInfoSubmit('addInfoForm')" :loading="addInfoLoading">提交</el-button>
            </div>
        </el-dialog>


        <!--渠道详情管理界面-->
        <el-dialog title="渠道管理" v-model="manageDetailVisible" :visible.sync="manageDetailVisible">
           <el-button type="primary" size="small" align="center"  v-on:click="addSpreadChannelInfoButton" >新增</el-button>
            <el-table :data="spreadChannelInfo">
                <el-table-column type="index" width="50"> </el-table-column>
                <el-table-column sortable align="center"  property="chaName" label="名称"></el-table-column>
                <el-table-column sortable align="center"  property="chaType" label="渠道类型"></el-table-column>
                <el-table-column sortable align="center"  property="chaParameter" label="渠道参数"></el-table-column>
                <el-table-column sortable align="center"  property="count" label="推广次数"></el-table-column>
                <el-table-column sortable align="center"  property="remark" label="备注"></el-table-column>
                <el-table-column sortable align="center" prop="percentage" label="操作">
                    <template slot-scope="scope">
                       <!-- <el-button @click="editManageDetail(scope.row)" type="text" size="small">编辑</el-button>-->
                        <el-button @click="isDeleteTo(scope.row)" type="text" size="small" >{{scope.row.enable}}</el-button>
                    </template>
                </el-table-column>

            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="manageDetailVisible = false">关闭</el-button>
            </div>
        </el-dialog>

    </section>

</template>

<script>
    import util from '../../common/js/util';
    import md5 from 'js-md5';
    import { getSpreadChannelPage,enableSpreadChannel,synchronizationSpreadChannel,getSpreadChannelInfoList,enableSpreadChannelInfo,addSpreadChannelBase,addSpreadChannelInfo} from '../../api/api';

    export default {
        data() {
            return {
                spreadChannel: [],
                spreadChannelInfo: [],
                page: 1,
                listLoading: false,
                addLoading : false,
                addInfoLoading: false,
                total:0,
                pageSize:this.GLOBAL.CONSTANT_DATA.PAGESIZE,
                queryKey:"",
                addBaseForm : {
                    chaName: "",
                    userName: "",
                    userPhone: "",
                    userPassword: "",
                    userPasswordTo: "",
                    remark:"",
                    relateType: -1
                },
                addFormVisible : false,
                //数据校样  ==  未完善
                addFormRules: {
                    chaName: [
                        {required: true, message: '请输入渠道名称', trigger: 'blur'},
                    ],
                    userName: [
                        {required: true, message: '请输入用户名称', trigger: 'blur'},
                    ],
                    userPhone: [
                        {required: true, message: '请输入用户手机号码', trigger: 'blur'},
                    ],
                    userPassword: [
                        {required: true, message: '请输入用户密码', trigger: 'blur'}
                    ],
                    relateType: [
                        {required: true, message: '请选择类型', trigger: 'blur'},
                    ],

                },
                addInfoForm :{
                    scbId:null,
                    chaName: "",
                    chaParameter: "",
                    remark:"",
                    chaType: -1
                },
                addInfoFormVisible : false,
                addInfoFormRules:{
                    chaName : [
                        {required: true, message: '请输入渠道名称', trigger: 'blur'},
                    ],
                    chaParameter : [
                        {required: true, message: '请输入渠道参数', trigger: 'blur'},
                        {  max: 32, message: '最大不超过32个字符', trigger: 'blur' },
                        {  pattern:/^[a-zA-Z0-9]+$/, message: '只能包括英文字母和数字' }

                    ],
                    chaType: [
                        {required: true, message: '请选择类型', trigger: 'change'},
                    ],
                },
                manageDetailVisible : false,
            }
        },

        //渠道基本信息列表展示
        methods: {
            getSpreadChannelList(flag) {
                var para = {
                    pageInfo:{
                        pageNum:flag===true?1:this.page,
                        pageSize:this.pageSize
                    },
                    queryKey:this.queryKey
                };

                this.listLoading = true;

                getSpreadChannelPage(para).then((data) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(data)){
                            //this.total = res.data.total;
                            //alert(res.data.data.list);

                            var list = data.data.list;
                            for(var i=0;i<list.length;i++){
                                if (list[i].relateType == 0){
                                    list[i].relateType = "门店";
                                }else{
                                    list[i].relateType = "用户";
                                }

                                if(list[i].enable == 0){
                                    list[i].enable = "禁用";
                                }else{
                                    list[i].enable = "启用";
                                }
                            }

                            this.spreadChannel = data.data.list;
                            this.total = data.data.paginationInfo.total;
                        }
                    }
                    ,data => { this.listLoading = false; }
                );
            },

            //分页查询
            handleCurrentChange(page) {
                this.page = page;
                this.getSpreadChannelList();
            },

            //基本信息禁用 or 启用
            isDelete(row){

                var del = {
                    id :row.id,
                    enable : row.enable == "禁用" ? 1 :0
                };
                enableSpreadChannel(del).then((data) => {
                    if (this.GLOBAL.isResonseSuccess(data)){
                        this.getSpreadChannelList();
                    }
                });
            },

            //打开基本信息新增界面
            addSpreadChannelButton(){
                alert("暂未开放此功能!");
                return;
                this.addFormVisible= true;
                this.addBaseForm = {
                    chaName: "",
                    userName: "",
                    userPhone: "",
                    userPassword: "",
                    userPasswordTo: "",
                    remark:"",
                    relateType: ""
                };
            },

            //基本信息新增确认
            addSubmit(formName){
                this.addLoading = true;

               /* this.$refs[formName].validate((valid) => {
                    if (valid) {
                        alert('submit!');
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });*/

                let para = Object.assign({}, this.addBaseForm);
                para.userPassword = md5(this.addBaseForm.userPassword);
                addSpreadChannelBase(para).then((data) => {
                    if (this.GLOBAL.isResonseSuccess(data)){
                        this.getSpreadChannelList();
                    }
                });

                this.addLoading = false;
                this.addFormVisible= false;
            },


            //渠道详情列表页面
            manageDetail(row){

                var data = {
                    scbId : row.id
                }
                getSpreadChannelInfoList(data).then((data) => {
                    var list = data.data;
                    for(var i=0;i<list.length;i++){
                        if (list[i].chaType == 0){
                            list[i].chaType = "APP";
                        }else if (list[i].chaType == 1){
                            list[i].chaType = "微信";
                        }

                        if(list[i].enable == 0){
                            list[i].enable = "禁用";
                        }else{
                            list[i].enable = "启用";
                        }
                    }

                    this.spreadChannelInfo = data.data;
                    this.manageDetailVisible = true;

                });
                this.addInfoForm.scbId = row.id;

            },

            editManageDetail(){
                alert("暂未开放此功能!");
            },

            //禁用/启动渠道详细信息
            isDeleteTo(row){
                var del = {
                    id :row.id,
                    enable : row.enable == "禁用" ? 1 :0
                };
                enableSpreadChannelInfo(del).then((data) => {
                    if (this.GLOBAL.isResonseSuccess(data)){
                        var data ={
                            id : row.scbId
                        }
                        this.manageDetail(data);
                    }
                });
            },


            //打开新增渠道详情界面
            addSpreadChannelInfoButton(){
                this.addInfoFormVisible= true;
                this.addInfoForm = {
                    scbId:this.addInfoForm.scbId,
                    chaName: "",
                    chaParameter: "",
                    remark:"",
                    chaType: ""
                };
            },

            //添加渠道详细信息
            addInfoSubmit(ve){
                this.$refs[ve].validate((valid) => {
                    if (valid) {
                        this.addInfoLoading = true;
                        let para = Object.assign({}, this.addInfoForm);
                        addSpreadChannelInfo(para).then((data) => {

                            if (this.GLOBAL.isResonseSuccess(data)){
                                var row = {
                                    id : this.addInfoForm.scbId
                                };
                                this.manageDetail(row);
                                this.addInfoFormVisible= false;
                            }
                        });

                        this.addInfoLoading = false;
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            //同步门店信息至渠道
            synchronizationChaParameterBtn(){
                const loading = this.$loading({
                    lock: true,
                    text: '拼命同步中~',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });

                synchronizationSpreadChannel().then((data) => {
                    loading.close();

                    console.log(data);
                    if (this.GLOBAL.isResonseSuccess(data)){

                        this.$message({
                            message: '同步成功!',
                            type: 'success'
                        });
                        this.getSpreadChannelList();

                    }
                });

            }
        },

        mounted() {
            this.getSpreadChannelList();
        }
    }

</script>
