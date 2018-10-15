<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">

            <el-form align="right" :inline="true"  class="demo-form-inline">

<!--                <el-form-item label="">
                    <el-select v-model="filters.channelType" clearable placeholder="支付端渠道">
                        <el-option :key="1" :value="1" label="小程序"></el-option>
                        <el-option :key="2" :value="2" label="公众号"></el-option>
                        <el-option :key="3" :value="3" label="APP"></el-option>
                        <el-option :key="4" :value="4" label="系统后台录入"></el-option>
                    </el-select>
                </el-form-item>-->
<!--                <el-form-item label="">
                    <el-select v-model="filters.businessId" clearable placeholder="业务类型">
                        <el-option :key="1" :value="1" label="洗护"></el-option>
                        <el-option :key="2" :value="2" label="名品"></el-option>
                        <el-option :key="4" :value="4" label="态奢"></el-option>
                    </el-select>
                </el-form-item>-->
                <el-form-item>
                    <template>
                        <select-group :num ="number" :select="isSelect" @getresult = 'getResultNumber'></select-group>
                    </template>
                </el-form-item>
                <el-form-item label="">
                    <el-select v-model="filters.payChannel" clearable placeholder="支付渠道">
                        <el-option :key="0" :value="0" label="线上支付"></el-option>
                        <el-option :key="1" :value="1" label="线下支付"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-select v-model="filters.enableFlag" clearable placeholder="状态" >
                        <el-option :key="0" :value="0" label="启动"></el-option>
                        <el-option :key="1" :value="1" label="停用"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" v-on:click="searchData">查询</el-button>
                </el-form-item>
                <el-form-item label="">
                    <el-button v-if="isAuth('scloud:payManner:insert')" type="primary" @click="handleEditOrAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="list"   highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
             <el-table-column prop="payChannel" label="支付渠道"  :formatter="formatDisableFlag" ></el-table-column>
<!--
             <el-table-column prop="channelType" label="支付端渠道"  :formatter="formatDisableFlag" ></el-table-column>
-->
             <el-table-column prop="businessId" label="业务类型" :formatter="formatDisableFlag"  ></el-table-column>
             <!--<el-table-column prop="payManner" label="支付方式（1:支付宝;2:微信;3:线下pos机）"   ></el-table-column>-->
             <el-table-column prop="payMannerRemark" label="支付方式描述"   ></el-table-column>
             <el-table-column prop="payRate" label="费率"   ></el-table-column>
             <el-table-column prop="enableFlag" label="状态"   :formatter="formatDisableFlag"></el-table-column>

            <el-table-column  fixed="right" label="操作" width="230">
                <template slot-scope="scope">
                    <el-button v-if="isAuth('scloud:payManner:update')" :disabled="scope.row.enableFlag == '1'"  type="primary" size="mini" @click="handleEditOrAdd(scope.$index, scope.row)">编辑</el-button>
                    <el-button v-if="isAuth('scloud:payManner:delete')&& scope.row.enableFlag == 1" type="primary" size="mini" @click="updateEnableFlag(scope.row, 0)">启用</el-button>
                    <el-button v-if="isAuth('scloud:payManner:delete')&& scope.row.enableFlag == 0" type="primary" size="mini" @click="updateEnableFlag(scope.row, 1)">禁用</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
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

        <!--编辑界面-->
        <el-dialog :title="title" v-model="formVisible" :visible.sync="formVisible" v-if="this.isDestory" @close="closeDialog">
            <el-form :model="form" label-width="120px" :rules="formRules" ref="form">
               <el-form-item label="支付渠道" prop="payChannel" v-if="this.title=='编辑'">
                   <el-select v-model="form.payChannel" :disabled="isDisable"   placeholder="请选择">
                       <el-option :key="0" :value="0" label="线上支付"></el-option>
                       <el-option :key="1" :value="1" label="线下支付"></el-option>
                   </el-select>

                  <!--<el-input v-model="form.payChannel" auto-complete="off"></el-input>-->
               </el-form-item>
<!--               <el-form-item label="支付端渠道" prop="channelType" v-if="this.title=='编辑'">
                   <el-select v-model="form.channelType" :disabled="isDisable" placeholder="请选择">
                       <el-option :key="1" :value="1" label="小程序" :disabled="!onlineFlag"></el-option>
                       <el-option :key="2" :value="2" label="公众号"  :disabled="!onlineFlag"></el-option>
                       <el-option :key="3" :value="3" label="APP" :disabled="!onlineFlag"></el-option>
                       <el-option :key="4" :value="4" label="系统后台录入" ></el-option>
                   </el-select>
               </el-form-item>-->
<!--               <el-form-item label="业务类型" prop="businessId">
                   <el-select v-model="form.businessId" :disabled="isDisable" placeholder="请选择">
                       <el-option :key="1" :value="1" label="洗护"></el-option>
                       <el-option :key="2" :value="2" label="名品"></el-option>
                       <el-option :key="4" :value="4" label="态奢"></el-option>
                   </el-select>
               </el-form-item>-->
                <el-form-item label="业务类型" prop="businessId" >
                    <template>
                        <select-group-add :num ="form.businessId" :select="!isDisable" @getresult = 'getEditResultNumber' ></select-group-add>
                    </template>
                </el-form-item>
               <el-form-item label="支付方式描述" prop="payMannerRemark">
                  <el-input v-model="form.payMannerRemark" :disabled="isDisable"></el-input>
               </el-form-item>
               <el-form-item label="费率" prop="payRate">
                  <el-input v-model="form.payRate" auto-complete="off"></el-input>
               </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="submit" :loading="loading">保存</el-button>
                <el-button @click.native="formVisible = false">取消</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import {getPayMannerList, removePayManner, editPayManner, addPayManner,updatePayMannerStatus,getBusinessList} from '../../api/api';
    import  {VDT ,VDATA} from '@/common/js/validate';
    import selectGroup from '@/components/selectGroup';
    import selectGroupAdd from '@/components/selectGroupAdd';
    export default {
        components:{
            selectGroup,selectGroupAdd
        },
        data() {
            return {
                number:-1,//后台传过来的十进制数据
                isSelect: true,//是否可选
                businessId: -1,

                isEditSelect: true,//是否可选


                onlineFlag:true,//线上支付  线下支付
                filters: {
                    name: '',
                },
                list: [],
                total: 0,
                title:"新增",//弹出框标题
                pageNum: 1, //当前页码
                pageSize: 10,//页数
                listLoading: false,
                sels: [],//列表选中列
                formVisible: false,//编辑界面是否显示
                loading: false,
                formRules: {
                    businessId: [{required: true, message: '请选择业务类型', trigger: 'blur'}],
                    payMannerRemark:  [{required: true, message: '请输入支付方式描述', trigger: 'blur'},
                        {max: 50, message: '最多50个字符,请重新输入', trigger: 'blur' }
                    ],
                    payRate: [{required: true, message: '请输入费率,大于0小于1', trigger: 'blur'},
                        {
                            validator: (rule,value,callback) => {
                                if (value != null && value != ''){
                                    var reg = /^0\.[0-9]{0,7}$/;
                                    value = Number(value);
                                    if (!reg.test(value)) {
                                        callback(new Error('请输入正确格式数字大于0小于1,最多7位小数'))
                                    }else{
                                        callback();
                                    }
                                }else{
                                    callback();
                                }
                            },
                            trigger: 'blur'
                        }],
                },
                isDisable: true,
                isDestory : false,
                //编辑界面数据
                form: {
                      id:'' ,
                      payChannel:'' ,
                //      channelType:'' ,
                      businessId:'' ,
                      payManner:'' ,
                      payMannerRemark:'' ,
                      payRate:'' ,
                      enableFlag:'' ,
                      createTime:'' ,
                      updateTime:'' 
                },

            }
        },
        methods: {
            getResultNumber(result){
                this.businessId = result;
            },
            getEditResultNumber(result){
                this.form.businessId = result;
            },

            closeDialog: function(){
                this.isDestory = false;
            },

            //切换页数
            handleCurrentChange(val) {
                this.pageNum = val;
                this.getData();
            },
            //处理分页条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.getData();
            },
            searchData(){
                this.pageNum = 1;
                this.getData();
            },
            //获取用户列表
            getData() {
                let para = {
                    payChannel: this.filters.payChannel,
                //    channelType: this.filters.channelType,
                    businessId: this.businessId,
                    enableFlag: this.filters.enableFlag,
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    }
                };
                this.listLoading = true;
                getPayMannerList(para).then((res) => {
                    this.listLoading = false;
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.total = res.data.paginationInfo.total;
                        this.list = res.data.list;
                    }
                }, () => { this.listLoading = false; });
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let para = {id: row.id};
                    removePayManner(para).then((res) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(res)) {
                            this.success("删除成功");
                            this.getData();
                        }
                    });
                }).catch(() => {});
            },
            //显示编辑/新增界面
            handleEditOrAdd: function (index, row) {
                if (row) {
                    this.title= "编辑";
                    this.isDisable = true;
                    this.form = Object.assign({}, row);
                } else {
                    this.form = {};
                    this.form.businessId='';
                    this.title= "新增线下支付";
                    this.isDisable = false;
                }
                this.isDestory = true;
                this.formVisible = true;
            },
            //编辑
            submit: function () {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.loading = true;
                            let para = this.form;
                            if(para.id) {
                                editPayManner(para).then((res) => {
                                    this.loading = false;
                                    if (this.GLOBAL.isResonseSuccess(res)){
                                        this.success("修改成功");
                                        this.$refs['form'].resetFields();
                                        this.formVisible = false;
                                        this.getData();
                                     }
                                })
                            } else {

                                //只新增线下支付  线上的用脚本导入
                                //支付渠道(0:线上支付;1:线下支付)
                                this.form.payChannel=1;
                                //支付端渠道(1:小程序;2:公众号;3:APP;4:系统后台录入)
                            //    this.form.channelType=4;
                                //支付方式（支付方式（-1:其他;0:顾客支付宝;1:顾客微信支付;2:顾客银联卡支付;3:商家-支付宝代支付;4:商家-微信代支付;5:pos机支付;6:支付宝扫描支付;7:微信扫描支付;8:微信公众号支付;9:森特币;
                                // 10:小程序;11:线下））
                                this.form.payManner=11;

                                addPayManner(para).then((res) => {
                                    this.loading = false;
                                    if (this.GLOBAL.isResonseSuccess(res)) {
                                        this.success("新增成功");
                                        this.$refs['form'].resetFields();
                                        this.formVisible = false;
                                        this.getData();
                                    }else{
                                        this.$message.error(res.message());
                                    }
                                });
                            }
                        });
                    }
                });
            },

            selsChange: function (sels) {
                this.sels = sels;
            },
            success: function(message){
                this.$message({
                    message: message,
                    type: 'success'
                });
            },
            formatDisableFlag(row, column) {
                var property = column.property;
                var value = row[column.property];
                if ("enableFlag" == property){
                    switch (value){
                        case 0: return "启用";
                        case 1: return "禁用";
                    }
                }else if ("payChannel" == property){
                    //支付渠道
                    switch (value){
                        case 0: return "线上支付";
                        case 1: return "线下支付";
                    }
                }else if ("businessId" == property){
                    //业务类型
                    switch (value){
                        case 1: return "洗护";
                        case 2: return "名品";
                        case 4: return "态奢";
                        case 8: return "悦生活";
                    }
                }
                return null;
            },

            updateEnableFlag(row, statu){
                let para = {
                    id: row.id,
                    enableFlag: statu,
                }
                updatePayMannerStatus(para).then((res) => {
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.getData();
                    }else{
                        this.$message.error(res.message());
                    }
                });

            },

            getBusinessType() {
                getBusinessList().then((res) => {
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.businessList = res.data;
                    }
                }, () => {}).catch(() => {});
            },
        },
        mounted() {
            this.getData();
        },
        watch:{

        },
    }

</script>

<style scoped>

</style>