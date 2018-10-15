<template>
    <section>
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form align="right" :inline="true"  class="demo-form-inline">
                <el-form-item label="">
                    <el-button v-if="isAuth('mpys:pickupdiscount:insert')" type="primary" @click="dialog('addDialog')">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--添加弹出层-->
        <el-dialog title="新增" :visible.sync="dialogAddFormVisible" width="40%">
            <el-form :model="addForm" :rules="addRules" ref="addForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="名称：" prop="activityName">
                    <el-input v-model="addForm.activityName" style="width: 40%"></el-input>
                </el-form-item>

                <el-form-item label="渠道类型：" prop="channelTypeCheckList">
                    <el-checkbox-group v-model="addForm.channelTypeCheckList">
                        <el-checkbox label="0">APP</el-checkbox>
                        <el-checkbox label="1">公众号</el-checkbox>
                        <el-checkbox label="2">小程序</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>

                <el-form-item label="取件方式：" prop="pickupType">
                    <el-radio-group v-model="addForm.pickupType">
                        <el-radio  label="0">上门取件</el-radio >
                        <el-radio  label="1">自送门店</el-radio >
                        <el-radio  label="2">自送智能柜</el-radio >
                        <el-radio  label="3">快递配送</el-radio >
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="折扣率：" prop="activityDiscounts">
                    <el-input v-model="addForm.activityDiscounts" style="width: 10%"></el-input>
                    <span style="color: darkgrey;">&nbsp;&nbsp;提示:9折就填写9,&nbsp;95折填写9.5</span>
                </el-form-item>

                <el-form-item label="活动城市：" prop="checkedCities">
                    <el-button  @click="dialog('addCityDialog')" type="text">添加</el-button>
                </el-form-item>

                <el-form-item prop="startTime" label="活动时间：" style="display: inline-block">
                    <el-date-picker type="datetime" placeholder="活动开始时间" v-model="addForm.startTime" style="width:200px" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                </el-form-item>
                &nbsp;——&nbsp;
                <el-form-item prop="endTime" style="display: inline-block;">
                    <el-date-picker type="datetime" placeholder="活动结束时间" v-model="addForm.endTime" style="width:200px;position: relative;right:94px;"  format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                </el-form-item>

                <el-form-item label="备注：">
                    <el-input type="textarea" v-model="addForm.remark" style="width: 80%"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogAddFormVisible=false;dialogEditFormVisible=false;">取消</el-button>
                <el-button type="primary" @click="submitForm('addForm')" v-loading="submitLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--编辑弹出层-->
        <el-dialog title="编辑" :visible.sync="dialogEditFormVisible" width="40%">
            <el-form :model="editForm" :rules="editRules" ref="editForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="名称：" prop="activityName">
                    <el-input v-model="editForm.activityName" style="width: 40%"></el-input>
                </el-form-item>

                <el-form-item label="渠道类型：" prop="channelTypeCheckList">
                    <span style="font-weight: bold;" v-if="editForm.channelType==0">APP</span>
                    <span style="font-weight: bold;" v-if="editForm.channelType==1">公众号</span>
                    <span style="font-weight: bold;" v-if="editForm.channelType==2">小程序</span>
                </el-form-item>

                <el-form-item label="配送类型：" prop="pickupType">
                    <span style="font-weight: bold;" v-if="editForm.pickupType===0">上门取件</span>
                    <span style="font-weight: bold;" v-if="editForm.pickupType===1">自送门店</span>
                    <span style="font-weight: bold;" v-if="editForm.pickupType===2">自送智能柜</span>
                    <span style="font-weight: bold;" v-if="editForm.pickupType===3">快递配送</span>
                </el-form-item>

                <el-form-item label="折扣：" prop="activityDiscounts">
                    <span style="font-weight: bold;">{{editForm.activityDiscounts*10}}折</span>
                </el-form-item>

                <el-form-item label="活动城市：" prop="checkedCities">
                    <span style="font-weight: bold;">{{editForm.cityNames}}</span>
                </el-form-item>

                <el-form-item prop="startTime" label="活动时间：" style="display: inline-block">
                    <el-date-picker type="datetime" placeholder="活动开始时间" v-model="editForm.startTime" style="width:200px" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                </el-form-item>
                &nbsp;——&nbsp;
                <el-form-item prop="endTime" style="display: inline-block;">
                    <el-date-picker type="datetime" placeholder="活动结束时间" v-model="editForm.endTime" style="width:200px;position: relative;right:94px;"  format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                </el-form-item>

                <el-form-item label="备注：">
                    <el-input type="textarea" v-model="editForm.remark" style="width: 80%"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm('editForm')" v-loading="submitLoading">保存</el-button>
                <el-button @click="dialogAddFormVisible=false;dialogEditFormVisible=false;">取消</el-button>
            </div>

        </el-dialog>

        <!--选择城市弹出框-->
        <el-dialog title="选择城市" :visible.sync="dialogCityListVisible" width="30%">
            <el-form label-width="100px" class="demo-ruleForm">
                <el-form-item label="">
                    <el-checkbox-group v-model="addForm.checkedCities" >
                        <el-checkbox v-for="city in cities" :key="city.cityId" :value="city.cityId" :label="city.cityId" style="margin-left: 0;margin-right: 30px;">{{city.cityName}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="dialogCityListVisible=false">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!--列表-->
        <el-table border v-loading="listLoading" element-loading-text="拼命加载中" :data="list" style="width: 100%;margin-top: 30px;">
            <el-table-column type="index" align="center" width="50"></el-table-column>
            <el-table-column width="160" align="center" prop="activityCode" label="标识"></el-table-column>
            <el-table-column align="center" prop="activityName" label="名称"></el-table-column>
            <el-table-column align="center" sortable prop="channelType" label="渠道" :formatter="formatChannelType"></el-table-column>
            <el-table-column align="center" prop="activityDiscounts" label="折扣"></el-table-column>
            <el-table-column width="350" align="center" prop="cityNames" label="城市"></el-table-column>
            <el-table-column width="340" align="center" label="时限">
                <template slot-scope="scope">
                    <span>
                        {{scope.row.startTime}}&nbsp;——&nbsp;{{scope.row.endTime}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column align="center" sortable prop="enableFlag" label="状态" :formatter="formatEnableFlag"></el-table-column>

            <el-table-column v-if="isAuth('mpys:pickupdiscount:update')"  fixed="right" label="操作" width="250">
                <template slot-scope="scope">
                    <el-button v-if="isAuth('mpys:pickupdiscount:update')" type="primary"  size="mini" @click="enable(scope.$index, scope.row)">{{scope.row.enableFlag == 1 ? "停用" : "启用"}}</el-button>
                    <el-button v-if="isAuth('mpys:pickupdiscount:update')" type="primary"  size="mini" @click="dialog('editDialog',scope.$index, scope.row)">编辑</el-button>
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

    import {enablePickupDiscountFun} from '../../api/api';
    import {addOrUpdatePickupDiscountFun} from '../../api/api';
    import {getPickupDiscountListFun} from '../../api/api';
    import {getAllCityFun} from '../../api/api';
    import {getPickupDiscountById} from '../../api/api';

    import util from '../../common/js/util';

    export default {
        data() {
            //自定义验证折扣率
            var validateDiscounts = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入折扣率'));
                } else if(value>=10 || value<1){
                    callback(new Error('折扣率格式错误'));
                }else{
                    callback();
                }
            };
            //自定义验证城市
            var validateCheckedCities = (rule, value, callback) => {
                if (this.addForm.checkedCities.length ==0) {
                    callback(new Error('请选择城市'));
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
                dialogCityListVisible:false,

                cities:[], //[{cityName:'上海',cityId:1}, {cityName:'北京',cityId:2}, {cityName:'广州',cityId:3}, {cityName:'深圳',cityId:4}],

                addForm: {
                    activityName:"",//名称
                    channelTypeCheckList:[],//选中的渠道类型
                    pickupType:"",//送件方式
                    activityDiscounts:"",//折扣
                    remark: '',//备注
                    startTime:'',//开始时间
                    endTime:'',//结束时间
                    checkedCities:[],//选中的城市列表
                },
                editForm: {
                    id:"",
                    activityName: '',//名称
                    remark: '',//备注
                    startTime:"",//开始时间
                    endTime:"",//结束时间
                },
                addRules: {
                    activityName: [
                        { required: true, message: '请输入名称', trigger: 'blur' },
                        { min: 3, max: 25, message: '长度在 3 到 25 个字符', trigger: 'blur' }
                    ],
                    channelTypeCheckList: [
                        { required: true, message: '请选择渠道类型', trigger: 'change' }
                    ],
                    pickupType: [
                        { required: true, message: '请选择配送方式', trigger: 'change' }
                    ],
                    activityDiscounts: [
                        { required: true, validator:validateDiscounts, trigger: 'blur' },
                    ],
                    checkedCities: [
                        {required: true, validator:validateCheckedCities, trigger: 'blur' },
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
                },
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
            };
        },
        methods: {
            //类型转换
            formatChannelType:function (row, column) {
                return row.channelType === 0 ? 'APP' : row.channelType === 1 ? '公众号' : '小程序';
            },
            //状态显示转换
            formatEnableFlag: function (row, column) {
                return row.enableFlag === 1 ? '启用' : row.enableFlag === 0 ? '停用' : '未知';
            },

            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        //新增或编辑
                        this.addOrUpdatePickupDiscount(formName);
                    } else {
                        return false;
                    }
                });
            },

            //点击查询
            searchPickup() {
                this.pageNum = 1;
                this.getPickupDiscountList();
            },
            //切换页数
            handleCurrentChange(val) {
                this.pageNum = val;
                this.getPickupDiscountList();
            },
            //处理分页条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.getPickupDiscountList();
            },

            addOrUpdatePickupDiscount(formName){
                this.submitLoading = true;
                if(formName=='addForm'){
                    addOrUpdatePickupDiscountFun(this.addForm).then((data) => {
                        this.submitLoading = false;
                        if(this.GLOBAL.isResonseSuccess(data)){
                            var msg = data.msg==""?"添加失败!":data.msg;
                            var data=data.data;
                            if(data!=null){
                                this.$message({
                                    type: 'success',
                                    message: '添加成功!'
                                });
                                this.dialogAddFormVisible = false;
                                this.getPickupDiscountList();
                            }else{
                                this.$message({
                                    type: 'error',
                                    message: msg
                                });
                            }
                        }
                    } ,data => { this.submitLoading = false; });
                }
                if(formName=='editForm'){
                    this.submitLoading = true;
                    this.editForm.startTime = util.formatDate.format(new Date(this.editForm.startTime), 'yyyy-MM-dd hh:mm:ss');
                    this.editForm.endTime = util.formatDate.format(new Date(this.editForm.endTime), 'yyyy-MM-dd hh:mm:ss');
                    addOrUpdatePickupDiscountFun(this.editForm).then((data) => {
                        this.submitLoading = false;
                        if(this.GLOBAL.isResonseSuccess(data)){
                            if(data.data==true){
                                this.$message({
                                    type: 'success',
                                    message: '编辑成功!'
                                });
                                this.dialogEditFormVisible=false;
                                this.getPickupDiscountList();
                            }else if(data.data==null){
                                this.$message({
                                    type: 'error',
                                    message: data.msg
                                })
                            }else{
                                this.$message({
                                    type: 'error',
                                    message: '编辑失败'
                                });
                            }
                        }
                    } ,data => { this.submitLoading = false; });
                }
            },
            //弹出框
            dialog(dialogName,index,row){
                if(dialogName=='addDialog'){
                    this.dialogAddFormVisible = true;
                    this.addForm.activityName='';
                    this.addForm.channelTypeCheckList=[];
                    this.addForm.pickupType= '';
                    this.addForm.activityDiscounts= '';
                    this.addForm.startTime= '';
                    this.addForm.endTime= '';
                    this.addForm.remark= '';
                    this.addForm.checkedCities=[];
                }
                if(dialogName=="editDialog"){
                    this.dialogEditFormVisible = true;
                    getPickupDiscountById({id:row.id}).then((res) => {
                        if(this.GLOBAL.isResonseSuccess(res)){
                            this.editForm = {
                                id: res.data.id,
                                activityName: res.data.activityName,//名称
                                remark: res.data.remark,//备注
                                channelType:res.data.channelType,
                                pickupType:res.data.pickupType,
                                activityDiscounts:res.data.activityDiscounts,
                                enableFlag : res.data.enableFlag,
                                startTime: new Date(res.data.startTime),
                                endTime: new Date(res.data.endTime)
                            }
                            this.editForm.cityNames=row.cityNames;
                        }
                    });
                }

                if(dialogName=="addCityDialog"){
                    this.dialogCityListVisible=true;
                }
            },
            //获取列表
            getPickupDiscountList() {
                let para = {
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    }
                };
                this.listLoading = true;
                getPickupDiscountListFun(para).then((res) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(res)){
                            this.list=res.data.list;
                            for(var i=0;i<this.list.length;i++){
                                //取件方式
                                var pickupType =this.list[i].pickupType;
                                if(pickupType == 0){
                                    pickupType = "上门取件";
                                }else if(pickupType == 1){
                                    pickupType = "自送门店";
                                }else if(pickupType == 2){
                                    pickupType = "自送智能柜";
                                }else if(pickupType == 3){
                                    pickupType = "快递配送";
                                }else{
                                    pickupType = "无";
                                }
                                this.list[i].activityDiscounts = pickupType+": "+this.list[i].activityDiscounts*10+"折";
                                this.list[i].startTime = util.formatDate.format(new Date(this.list[i].startTime), 'yyyy-MM-dd hh:mm:ss');
                                this.list[i].endTime = util.formatDate.format(new Date(this.list[i].endTime), 'yyyy-MM-dd hh:mm:ss');
                            }

                            this.total = res.data.paginationInfo.total;
                        }
                    }
                    ,res => { this.listLoading = false; }
                );
            },
            getAllCity(){
                var _this=this;
                getAllCityFun(null).then((data) => {
                    if (this.GLOBAL.isResonseSuccess(data)){
                        var data =data.data;
                        for(var i=0;i<data.length;i++){
                            var obj = {
                                cityName:data[i].cityName,
                                cityId:data[i].cityId,
                            };
                            _this.cities.push(obj);
                        }
                    }
                })
            },
            enablePickupDiscount(index,row){
                var msg = row.enableFlag=== 1 ? "您确定停用该折扣吗?" : "您确定启用该折扣吗?";
                this.$confirm(msg, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    //执行禁用,启用操作
                    enablePickupDiscountFun({id:row.id}).then((data) => {
                        if (this.GLOBAL.isResonseSuccess(data)){
                            if(data.data==true){
                                this.$message({
                                    type: 'success',
                                    message: '操作成功!'
                                });
                                this.getPickupDiscountList();
                            }else if(data.data==null){
                                this.$message({
                                    type: 'error',
                                    message: data.data.msg
                                });
                                this.getPickupDiscountList();
                            } else{
                                this.$message({
                                    type: 'error',
                                    message: '操作失败'
                                });
                            }
                        }
                    });
                }).catch(() => {
                });

            },
            //禁用,启用
            enable(index,row){
                this.enablePickupDiscount(index,row);
            },
        },
        mounted() {
            //获取配送方式折扣列表
            this.getPickupDiscountList();
            //获取所有开通的城市
            this.getAllCity();
        }
    }
</script>
