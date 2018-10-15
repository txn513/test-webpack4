<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form align="right" :inline="true"  class="demo-form-inline">
                <el-form-item label="">
                    <el-button type="primary" v-on:click="searchActivity">查询</el-button>
                </el-form-item>
                <el-form-item label="">
                    <el-button v-if="isAuth('mpys:recharge:insert')" type="primary" @click="dialog('addDialog')">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--添加弹出层-->
        <el-dialog title="添加活动项目" :visible.sync="dialogAddFormVisible" width="40%">
            <el-form :model="addForm" :rules="addRules" ref="addForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="活动名称" prop="activityName">
                    <el-input v-model="addForm.activityName" style="width: 40%"></el-input>
                </el-form-item>

                <el-form-item label="渠道类型" prop="channelTypeCheckList">
                    <el-checkbox-group v-model="addForm.channelTypeCheckList">
                        <el-checkbox label="1">小程序</el-checkbox>
                        <el-checkbox label="2">公众号</el-checkbox>
                        <el-checkbox label="3">APP</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>

                <el-form-item label="充值数量" prop="sinterCurrencyAmount">
                    <el-input v-model="addForm.sinterCurrencyAmount" style="width: 12%"></el-input>
                </el-form-item>

                <el-form-item label="赠送数量" prop="giveSinterCurrency">
                    <el-input v-model="addForm.giveSinterCurrency" style="width: 12%"></el-input>
                    （例：做充100得120活动，则在“充值数量”填100，“赠送数量”填20）
                </el-form-item>

                <el-form-item prop="startTime" label="活动时间" style="display: inline-block">
                    <el-date-picker type="datetime" placeholder="活动开始时间" v-model="addForm.startTime" style="width:200px" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                </el-form-item>
                &nbsp;——&nbsp;
                <el-form-item prop="endTime" style="display: inline-block;">
                    <el-date-picker type="datetime" placeholder="活动结束时间" v-model="addForm.endTime" style="width:200px;position: relative;right:94px;"  format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                </el-form-item>

                <el-form-item label="备注">
                    <el-input type="textarea" v-model="addForm.remark" style="width: 80%"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogAddFormVisible=false;dialogEditFormVisible=false;">取消</el-button>
                <el-button type="primary" @click="submitForm('addForm')" v-loading="submitLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--编辑弹出层-->
        <el-dialog title="编辑活动项目" :visible.sync="dialogEditFormVisible" width="40%">
            <el-form :model="editForm" :rules="editRules" ref="editForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="活动名称" prop="activityName">
                    <el-input v-model="editForm.activityName" style="width: 40%"></el-input>
                </el-form-item>

                <el-form-item label="渠道类型">
                    <span style="font-weight: bold;" v-if="editForm.channelType==1">小程序</span>
                    <span style="font-weight: bold;" v-if="editForm.channelType==2">公众号</span>
                    <span style="font-weight: bold;" v-if="editForm.channelType==3">APP</span>
                </el-form-item>

                <el-form-item label="充值数量">
                    <span style="font-weight: bold;">{{editForm.sinterCurrencyAmount}}</span>
                </el-form-item>

                <el-form-item label="赠送数量">
                    <span style="font-weight: bold;">{{editForm.giveSinterCurrency}}</span>
                </el-form-item>

                <el-form-item prop="startTime" label="活动时间" style="display: inline-block">
                    <el-date-picker type="datetime" placeholder="活动开始时间" v-model="editForm.startTime" style="width:200px" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                </el-form-item>
                &nbsp;——&nbsp;
                <el-form-item prop="endTime" style="display: inline-block;">
                    <el-date-picker type="datetime" placeholder="活动结束时间" v-model="editForm.endTime" style="width:200px;position: relative;right:94px;"  format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                </el-form-item>

                <el-form-item label="备注">
                    <el-input type="textarea" v-model="editForm.remark" style="width: 80%"></el-input>
                </el-form-item>
                <el-form-item>

                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm('editForm')" v-loading="submitLoading">保存</el-button>
                <el-button @click="dialogEditFormVisible=false">取消</el-button>
            </div>
        </el-dialog>

        <!--列表-->
        <el-table border v-loading="listLoading" element-loading-text="拼命加载中" :data="list" style="width: 100%;margin-top: 30px;">
            <el-table-column type="index" align="center" width="50"></el-table-column>
            <el-table-column width="290" align="center" prop="activityCode" label="标识"></el-table-column>
            <el-table-column width="200" align="center" prop="activityName" label="名称"></el-table-column>
            <el-table-column align="center" prop="channelType" label="渠道" :formatter="formatChannelType"></el-table-column>
            <el-table-column sortable align="center" prop="sinterCurrencyAmount" label="充值数量"></el-table-column>
            <el-table-column sortable align="center" prop="giveSinterCurrency" label="赠送数量"></el-table-column>
            <el-table-column width="340" align="center" label="时限">
                <template slot-scope="scope">
                    <span>
                        {{scope.row.startTime}}&nbsp;——&nbsp;{{scope.row.endTime}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column sortable align="center" prop="enableFlag" label="状态" :formatter="formatEnableFlag"></el-table-column>
            <el-table-column v-if="isAuth('mpys:recharge:update')"  fixed="right" label="操作" width="250">
                <template slot-scope="scope">
                    <el-button v-if="isAuth('mpys:recharge:update')" type="primary"  size="mini" @click="enable(scope.$index, scope.row)">{{scope.row.enableFlag == 1 ? "停用" : "启用"}}</el-button>
                    <el-button v-if="isAuth('mpys:recharge:update')" type="primary"  size="mini" @click="dialog('editDialog',scope.$index, scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--分页工具条-->
        <el-col :span="24" style="margin-top: 10px">
            <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageNum"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total" style="float: right">
            </el-pagination>
        </el-col>

    </section>
</template>

<script>
    import {addOrUpdateFun,enableRechargeActivityFun,getById,getRechargeActivityFun} from '../../api/api';
    import util from '../../common/js/util';

    export default {
        data() {
            //自定义验证森特币数量
            var validate = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入森特币数量'));
                } else if(!(new RegExp(/^[1-9][0-9]*$/).test(value))){
                    callback(new Error('森特币数量只能为正整数'));
                }else{
                    callback();
                }
            };
            return {
                pageNum: 1, //当前页码
                pageSize: 10,//页数
                total:0,
                list:[],
                listLoading:false,
                submitLoading: false,
                dialogAddFormVisible:false,
                dialogEditFormVisible:false,
                index:'',//列表索引
                addForm: {
                    id:'',//id
                    activityName: '',//名称
                    channelTypeCheckList:[],//选中的渠道类型
                    sinterCurrencyAmount: '',//充值数量
                    giveSinterCurrency: '',//赠送数量
                    remark: '',//备注
                    startTime:'',//开始时间
                    endTime:'',//结束时间
                },
                editForm: {
                    id:'',//id
                    activityName: '',//名称
                    channelType: '',//渠道类型
                    sinterCurrencyAmount: '',//充值数量
                    giveSinterCurrency: '',//赠送数量
                    remark: '',//备注
                    startTime:'',//开始时间
                    endTime:'',//结束时间
                    enableFlag : '',
                },
                addRules: {
                    activityName: [
                        { required: true, message: '请输入活动名称', trigger: 'blur' },
                        { min: 3, max: 25, message: '长度在 3 到 25 个字符', trigger: 'blur' }
                    ],
                    channelTypeCheckList: [
                        { required: true, message: '请选择渠道类型', trigger: 'change' }
                    ],
                    sinterCurrencyAmount: [
                        { required: true, validator: validate, trigger: 'blur' },
                    ],
                    giveSinterCurrency: [
                        { required: true, validator: validate, trigger: 'blur' },
                    ],
                    startTime: [
                        { required: true, message: '请选择活动开始时间', trigger: 'change' }
                    ],
                    endTime: [
                        { required: true, message: '请选择活动结束时间', trigger: 'change' }
                    ]
                },
                editRules: {
                    activityName: [
                        { required: true, message: '请输入活动名称', trigger: 'blur' },
                        { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
                    ],
                    startTime: [
                        { required: true, message: '请选择活动开始时间', trigger: 'change' }
                    ],
                    endTime: [
                        { required: true, message: '请选择活动结束时间', trigger: 'change' }
                    ]
                }
            };
        },
        methods: {
            //类型转换
            formatChannelType:function (row, column) {
                return row.channelType === 1 ? '小程序' : row.channelType === 2 ? '公众号' : 'APP';
            },
            //状态显示转换
            formatEnableFlag: function (row, column) {
                return row.enableFlag === 1 ? '启用' : row.enableFlag === 0 ? '停用' : '未知';
            },

            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        //新增或编辑
                        this.addOrUpdate(formName);
                    } else {
                        return false;
                    }
                });
            },

            //点击查询
            searchActivity() {
                this.pageNum = 1;
                this.getRechargeActivity();
            },
            //切换页数
            handleCurrentChange(val) {
                this.pageNum = val;
                this.getRechargeActivity();
            },
            //处理分页条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.getRechargeActivity();
            },

            addOrUpdate(formName){
                this.submitLoading = true;
                if(formName=='addForm'){
                    addOrUpdateFun(this.addForm).then((res) => {
                        this.submitLoading = false;
                        if(this.GLOBAL.isResonseSuccess(res)){
                            var list=res.data;
                            if(list!=null){
                                this.$message({
                                    type: 'success',
                                    message: '添加成功!'
                                });
                                this.dialogAddFormVisible = false;
                                for(var i=0;i<list.length;i++) {
                                    list[i].startTime = util.formatDate.format(new Date(list[i].startTime), 'yyyy-MM-dd hh:mm:ss');
                                    list[i].endTime = util.formatDate.format(new Date(list[i].endTime), 'yyyy-MM-dd hh:mm:ss');
                                    this.list.push(list[i]);
                                }
                            }else{
                                this.$message({
                                    type: 'error',
                                    message: '该活动与其他活动冲突: 同一种森特币数量和渠道在同一个时间段里只能开启一种'
                                });
                            }
                        }
                    } ,res => { this.submitLoading = false; });
                }
                if(formName=='editForm'){
                    this.submitLoading = true;
                    this.editForm.startTime = util.formatDate.format(new Date(this.editForm.startTime), 'yyyy-MM-dd hh:mm:ss');
                    this.editForm.endTime = util.formatDate.format(new Date(this.editForm.endTime), 'yyyy-MM-dd hh:mm:ss');
                    addOrUpdateFun(this.editForm).then((res) => {
                        this.submitLoading = false;
                        if(this.GLOBAL.isResonseSuccess(res)){
                            var list=res.data[0];
                            if(list!=null){
                                this.$message({
                                    type: 'success',
                                    message: '编辑成功!'
                                });
                                this.dialogEditFormVisible = false;
                                list.startTime = util.formatDate.format(new Date(list.startTime), 'yyyy-MM-dd hh:mm:ss');
                                list.endTime = util.formatDate.format(new Date(list.endTime), 'yyyy-MM-dd hh:mm:ss');
                                this.list.splice(this.index,1,list);
                            }else{
                                this.$message({
                                    type: 'error',
                                    message: '该活动与其他活动冲突: 同一种森特币数量和渠道在同一个时间段里只能开启一种'
                                });
                            }
                        }
                    } ,res => { this.submitLoading = false; });
                }
            },
            //弹出框
            dialog(dialogName,index,row){
                if(dialogName=='addDialog'){
                    this.dialogAddFormVisible = true;
                    this.addForm.id='';//id
                    this.addForm.activityName= '';//名称
                    this.addForm.channelTypeCheckList= [];//渠道类型
                    this.addForm.sinterCurrencyAmount= '';//充值数量
                    this.addForm.giveSinterCurrency= '';//赠送数量
                    this.addForm.remark= '';//备注
                    this.addForm.startTime= '';//开始时间
                    this.addForm.endTime= '';//结束时间
                }
                if(dialogName=="editDialog"){
                    this.dialogEditFormVisible = true;
                    getById({id:row.id}).then((res) => {
                        if(this.GLOBAL.isResonseSuccess(res)){
                            this.editForm = {
                                id: res.data.id,
                                activityName: res.data.activityName,//名称
                                channelType: res.data.channelType,//渠道类型
                                sinterCurrencyAmount: res.data.sinterCurrencyAmount,//充值数量
                                giveSinterCurrency: res.data.giveSinterCurrency,//赠送数量
                                remark: res.data.remark,//备注
                                enableFlag : res.data.enableFlag,
                                startTime: new Date(res.data.startTime),
                                endTime: new Date(res.data.endTime)
                            }
                        }
                    });
                }
            },
            //获取充值活动列表
            getRechargeActivity() {
                let para = {
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    }
                };
                this.listLoading = true;
                getRechargeActivityFun(para).then((res) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(res)){
                            this.list=res.data.list;
                            for(var i=0;i<this.list.length;i++){
                                this.list[i].startTime = util.formatDate.format(new Date(this.list[i].startTime), 'yyyy-MM-dd hh:mm:ss');
                                this.list[i].endTime = util.formatDate.format(new Date(this.list[i].endTime), 'yyyy-MM-dd hh:mm:ss');
                            }

                            this.total = res.data.paginationInfo.total;
                        }
                    }
                    ,res => { this.listLoading = false; }
                );
            },
            enableRechargeActivity(index,row){
                var msg = row.enableFlag=== 1 ? "您确定停用该活动吗?" : "您确定启用该活动吗?";
                this.$confirm(msg, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    //执行启用禁用操作
                    enableRechargeActivityFun({id:row.id}).then((res) => {
                        if (this.GLOBAL.isResonseSuccess(res)){
                            if (res.code == 1) {
                                this.$message({
                                    type: 'success',
                                    message: '操作成功!'
                                });
                                this.list[index].enableFlag=this.list[index].enableFlag=== 1 ? 0 : 1;
                            }else{
                                this.$message({
                                    type: 'error',
                                    message: '该活动与其他活动冲突: 同一种森特币数量和渠道在同一个时间段里只能开启一种'
                                });
                            }
                        }
                    });
                }).catch(() => {
                });

            },
            //禁用,启用
            enable(index,row){
                this.enableRechargeActivity(index,row);
            }
        },
        mounted() {
            //获取充值活动列表
            this.getRechargeActivity();
        }
    }
</script>
