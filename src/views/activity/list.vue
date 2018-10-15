<template>
    <section>
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <div style="text-align:right;">
                <el-button type="primary" @click="checkQuery()">全部({{count.allCount}})</el-button>
                <el-button type="primary" @click="checkQuery(5)">未开始({{count.noStartCount}})</el-button>
                <el-button type="primary" @click="checkQuery(6)">活动中({{count.startingCount}})</el-button>
                <el-button type="primary" @click="checkQuery(7)">已结束({{count.endingCount}})</el-button>
                <el-button type="primary" @click="checkQuery(4)">已终止({{count.forbidCount}})</el-button>
            </div>
        </el-col>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form align="right" :inline="true"  class="demo-form-inline">
                <el-form-item label="时间">
                    <el-date-picker
                        v-model="filters.time"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="审核状态">
                    <el-select v-model="filters.status" placeholder="请选择" clearable>
                        <el-option
                            v-for="item in checkStatus"
                            :key="item.id"
                            :label="item.status"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="渠道">
                    <el-select v-model="filters.channel" placeholder="请选择" clearable>
                        <el-option
                            v-for="item in addChannel"
                            :key="item.id"
                            :label="item.channelName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="活动名称">
                    <el-input
                        v-model="filters.name"
                        placeholder="请输入活动名称" clearable></el-input>
                </el-form-item>
                <el-form-item >
                    <el-button type="primary" @click="query">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button v-if="isAuth('scloud:couponactivity:insert')" type="primary" @click="handleAdd()">新增活动</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table
            :data="list"
            highlight-current-row
            v-loading="listLoading"
            style="width: 100%;">
            <el-table-column
                prop="activityCode"
                label="活动编号"
                sortable
                show-overflow-tooltip>
            </el-table-column>

            <el-table-column
                prop="activityName"
                label="活动名称"
                sortable
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="startTime"
                label="活动开始时间"
                sortable
                :formatter="dateFormat">
            </el-table-column>
            <el-table-column
                    prop="endTime"
                    label="活动结束时间"
                    sortable
                    :formatter="dateFormat">
            </el-table-column>
            <el-table-column
                prop="channelName"
                label="活动渠道"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="enableFlag"
                label="活动状态"
                sortable
                :formatter="formatStatus">
            </el-table-column>
            <el-table-column
                fixed="right"
                label="操作"
                width="400">
                <template slot-scope="scope">
                    <el-button type="primary"  size="mini" @click="see(scope.row)">查看详情</el-button>
                    <el-button v-if="isAuth('scloud:couponactivity:update') && scope.row.enableFlag == 0" type="primary"  size="mini" @click="check(scope.row)">审核</el-button>
                    <el-button v-if="isAuth('scloud:couponactivity:update') && scope.row.enableFlag == 0" type="primary"  size="mini" @click="edit(scope.row)">编辑</el-button>
                    <el-button v-if="isAuth('scloud:couponactivity:update') && scope.row.enableFlag != 3" type="primary"  size="mini" @click="forbid(scope.row)">终止</el-button>
                    <el-button v-if="isAuth('scloud:couponactivity:delete') && scope.row.enableFlag == 0" type="primary"  size="mini" @click="del(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--新增弹出窗-->
        <el-dialog
                :title="title"
                :visible.sync="dialogVisible"
                width="50%">
            <el-form ref="form" :model="form" :rules="formRules" label-width="80px">
                <el-form-item label="活动名称"  prop="activityName">
                    <el-input v-model="form.activityName" placeholder="请输入活动名称"></el-input>
                </el-form-item>
                <el-form-item label="时间范围" prop="time">
                    <el-date-picker
                            v-model="form.time"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="活动渠道" prop="channelTypeList">
                    <el-checkbox-group v-model="form.channelTypeList">
                        <el-checkbox v-for="item in addChannel" :label="item.id" :key="item.id">{{item.channelName}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="优惠工具" prop="coupon">
                    <el-select
                        collapse-tags
                        v-model="form.couponType"
                        placeholder="请选择优惠券种类"
                        @change = 'getCouponType'>
                        <el-option
                                v-for="item in couponType"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                    <el-select
                            v-model="form.coupon"
                            collapse-tags
                            placeholder="请选择优惠券面额">
                        <el-option
                                v-for="item in coupon"
                                :key="item.id"
                                :label="item.couponContent"
                                :value="item.id">
                        </el-option>
                    </el-select>
                    <el-button type="primary" @click="addCoupon">添加</el-button>
                </el-form-item>
                <el-form-item>
                    <el-card v-for="(item,index) in form.items" :key="item.id" class="box-card" style="width: 280px;display: inline-block;margin-left: 10px">
                        <div>
                            <span>{{item.name}}</span>
                            <el-button style="margin-left: 20px" type="primary" size="mini" @click="showConfig(index)">配置</el-button>
                            <el-button type="primary" size="mini" @click = 'delCoupon(item.id)'>删除</el-button>
                        </div>
                        <div>
                            {{item.desc}}
                        </div>
                        <!--<div class="product">-->
                            <!--<span>产品1</span>-->
                            <!--<span>产品1</span>-->
                            <!--<span>产品1</span>-->
                            <!--<span>产品1</span>-->
                            <!--<span>产品1</span>-->
                            <!--<span>产品1</span>-->
                            <!--<span>产品1</span>-->
                        <!--</div>-->
                    </el-card>
                </el-form-item>
                <el-form-item label="活动描述">
                    <el-input
                            v-model="form.remark"
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="请输入内容"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible=false">取消</el-button>
                <el-button type="primary" @click="onSubmit">提交</el-button>
            </div>
        </el-dialog>
        <!--修改弹出窗-->
        <el-dialog
                title="修改活动"
                :visible.sync="isEditShow"
                width="50%">
            <el-form ref="editForm" :model="editForm" :rules="formRules" label-width="80px">
                <el-form-item label="活动名称" prop="activityName">
                    <el-input v-model="editForm.activityName"></el-input>
                </el-form-item>
                <el-form-item label="时间范围" prop="time">
                    <el-date-picker
                            v-model="editForm.time"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitEdit" :loading = 'isLoading'>提交</el-button>
                <el-button @click="isEditShow=false">取消</el-button>
            </div>
        </el-dialog>
        <!--审核详情弹出窗-->
        <el-dialog
                :title="checkTitle"
                :visible.sync="isCheckShow"
                width="50%">
            <el-form ref="checkForm" :model="checkForm" >
                <el-form-item label="活动名称：">
                    {{checkForm.activityName}}
                </el-form-item>
                <el-form-item label="活动编号：">
                    {{checkForm.activityCode}}
                </el-form-item>
                <el-form-item label="活动时间：">
                    {{checkForm.time}}
                </el-form-item>
                <el-form-item label="优惠渠道：">
                    {{checkForm.channel}}
                </el-form-item>
                <el-form-item label="优惠券信息：">
                    <el-table
                        :data="checkForm.ticket"
                        highlight-current-row
                        style="width: 100%;">
                        <el-table-column
                            prop="tool"
                            label="优惠工具">
                        </el-table-column>
                        <el-table-column
                            prop="time"
                            label="有效期">
                        </el-table-column>
                    </el-table>

                </el-form-item>
                <el-form-item label="备注">
                    <el-input
                        v-model="checkForm.checkRemark"
                        v-if="!isEdit"
                        type="textarea"
                        :autosize="{ minRows: 2, maxRows: 4}"
                        placeholder="请输入内容"></el-input>
                    <span v-if="isEdit">{{checkForm.remark}}</span>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer" v-if="isButtonShow">
                <el-button type="primary" @click="onSubmitCheck(1)" :loading = 'isLoading'>通过</el-button>
                <el-button @click="onSubmitCheck(2)">不通过</el-button>
            </div>
        </el-dialog>
        <!--配置弹出窗-->
        <el-dialog
                title="配置券"
                :visible.sync="isShow"
                width="50%">
            <el-form ref="configForm" :model="configForm" :rules="configFormRules" label-width="80px">
                <el-form-item label="有效期" prop="time">
                    <el-date-picker
                            v-model="configForm.time"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            style="width: 400px;">
                    </el-date-picker>

                </el-form-item>

                <el-form-item label="生成数量" prop="total">
                    <el-input v-model="configForm.total" type="number" style="width: 100px" ></el-input>
                    <span>张</span>
                    <!--<div style="display: inline-block" v-for="item in configForm.number.channel">-->
                        <!--<el-radio style="margin-left: 20px" v-model="item.isSelect">{{item.name}}</el-radio>-->
                        <!--<el-input v-model="item.num" style="width: 50px;"></el-input>-->
                        <!--<span>张</span>-->
                    <!--</div>-->

                </el-form-item>

                <!--<el-form-item label="限领数量">-->
                    <!--<span>每人限领</span>-->
                    <!--<el-input v-model="configForm.limit" style="width: 50px;"></el-input>-->
                    <!--<span>张</span>-->
                <!--</el-form-item>-->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="selectConfig">确定</el-button>
                <el-button @click="isShow=false">关闭</el-button>
            </div>
        </el-dialog>
        <!--工具条-->
        <el-col :span="24" style="margin-top: 10px">
            <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync = "pageNum"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total" style="float: right">
            </el-pagination>
        </el-col>
    </section>
</template>

<script>
    import util from '@/common/js/util';
    import {getCouponActivityList,getAllCount,getChannel,getCouponType,addCouponActivity,getCouponActivityById,checkActivity,editActivity,removeActivity,forbidActivity} from "@/api/api";

    // 导入组件
    export default {
        data() {
            var checkNum = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入生成数量'));
                }

                if (value <=0) {
                    callback(new Error('生成数量必须大于0'));
                } else {
                    callback();
                }

            };
            return {
                //统计数目
                count:{
                    allCount:0,
                    endingCount:0,
                    forbidCount:0,
                    noStartCount:0,
                    startingCount:0
                },
                checkStatus:[
                    {
                        id: 0,
                        status: '待审核'
                    },
                    {
                        id: 1,
                        status: '已通过'
                    },
                    {
                        id: 2,
                        status: '未通过'
                    }
                ],//审核状态
                channel: [],//渠道列表
                addChannel: [],//新增时渠道列表
                filters: {
                    time: [],
                    status: '',
                    channel: '',
                    name: ''
                },//查询条件
                isLoading: false,//是否显示按钮loading
                list: [],//表格数据
                dialogVisible: false,//弹出框是否显示
                title:'新增',//弹出框标题
                isButtonShow: true,
                couponType:[
                    {
                        id: 1,
                        name: '现金券'
                    }
                ],//审核状态
                coupon:[],//券面值
                form: {
                    activityName: '',
                    time:'',
                    channelTypeList: [],
                    startTime:'',
                    endTime:'',
                    remark:'',
                    coupon:'',//优惠券id
                    items: []//活动窗口
                },//弹出窗数据
                config:[],//配置数据
                editConfig:[],//回显配置数据
                formRules: {
                    activityName: [{required: true, message: '请输入活动名称', trigger: 'blur'}],
                    time: [{required: true, message: '请选择活动时间范围', trigger: 'blur'}],
                    channelTypeList: [{required: true, message: '请选择活动渠道', trigger: 'change',type: 'array'}],
                    coupon: [{required: true, message: '请选择优惠券', trigger: 'blur'}],

                },//新增或修改验证规则
                isEditShow: false,//是否显示修改框
                editForm: {
                    id:'',
                    activityName: '',
                    time:'',
                },//修改弹出窗数据
                isShow:false,//配置窗口是否显示
                configForm: {
                    time:[],
                    total: ''
                },//配置窗数据
                index:'',//当前配置框的下表
                configFormRules: {
                    time: [{required: true, message: '请选择活动时间范围', trigger: 'blur'}],
                    total: [{ validator: checkNum, trigger: 'blur' }],

                },//新增或修改验证规则

                isCheckShow: false,//是否显示审核详情
                checkForm: {
                    id: '',
                    activityName: '',
                    activityCode:'',
                    time: '',
                    ticket: [],
                    remark:'',
                    checkRemark: ''
                },//审核详情数据
                isEdit: false,//查看是否可编辑
                checkTitle: "审核",

                // 列表数据
                list: [],
                pageNum: 1, //当前页码
                pageSize: 10,//页数
                listLoading: false,
                total: 0,


            }
        },
        methods: {
            //顶部状态查询结果
            checkQuery(status){
                this.pageNum=1;
                this.getCouponActivityList(status);
            },
            //时间格式化
            dateFormat(row, column, cellValue, index){
                return util.dateFormat('yyyy-MM-dd hh:mm:ss',new Date(cellValue))
            },
            formatStatus(row, column, cellValue, index){
                switch (cellValue){
                    case 0:
                        return '待审核'
                        break;
                    case 1:
                        return '已通过'
                        break;
                    case 2:
                        return '未通过'
                        break;
                    case 3:
                        return '已终止'
                        break;
                    case 5:
                        return '未开始'
                        break;
                    case 6:
                        return '活动中'
                        break;
                    case 7:
                        return '已结束'
                        break;
                }
            },
            query() {
                this.pageNum=1;
                this.getCouponActivityList();
            },
            //确定当前配置
            selectConfig(){
                this.$refs.configForm.validate((valid) => {
                    if (valid) {
//                        if(this.index!=null){
                            this.config[this.index].couponAmount = Number(this.configForm.total);
                            this.config[this.index].endTime = util.dateFormat('yyyy-MM-dd hh:mm:ss',this.configForm.time[1]);
                            this.config[this.index].startTime = util.dateFormat('yyyy-MM-dd hh:mm:ss',this.configForm.time[0]);
                            this.editConfig[this.index].total = this.configForm.total;
                            this.editConfig[this.index].time = this.configForm.time;
//                        }else{
//                            this.config.push({
//                                couponAmount: Number(this.configForm.total),
//                                couponTypeId: this.form.coupon,
//                                endTime: util.dateFormat('yyyy-MM-dd hh:mm:ss',this.configForm.time[1]),
//                                startTime: util.dateFormat('yyyy-MM-dd hh:mm:ss',this.configForm.time[0])
//                            });
//                            this.editConfig.push({
//                                id: this.form.coupon,
//                                total: this.configForm.total,
//                                time: this.configForm.time
//                            });
//
//                        }
                        this.isShow = false;
                    }
                })

            },
            //切换页数
            handleCurrentChange(val) {
                this.pageNum = val;
                this.getCouponActivityList();
            },
            //处理分页条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.getCouponActivityList();
            },
            //获取渠道
            getChannel(type) {
                let businessId = type||null;
                getChannel({enableFlag: 1,businessId:businessId}).then((res) => {
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        if(businessId){
                            this.addChannel = res.data;
                        }else {
                            this.channel = res.data;
                        }
                    }
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },
            //优惠券类型
            getCouponType() {
                getCouponType({couponType: 1}).then((res) => {
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.coupon = res.data;
                    }
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },
            //获取统计数量
            getAllCount(){
                getAllCount().then((res) => {
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.count = res.data;
                    }

                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },
            //获取列表
            getCouponActivityList(status) {
                let code = status || this.filters.status;
                let startTime,endTime;
                if(!this.filters.time){
                    startTime = '';
                    endTime = '';
                }else{
                    startTime = this.filters.time.length!==0?util.dateFormat('yyyy-MM-dd hh:mm:ss',this.filters.time[0]):'';
                    endTime = this.filters.time.length!==0?util.dateFormat('yyyy-MM-dd hh:mm:ss',this.filters.time[1]):'';
                }

                let param =
                    {
                        activityName: this.filters.name.trim(),
                        channelTypeId: this.filters.channel,
                        enableFlag: code,
                        startTime: startTime,
                        endTime: endTime,
                        pageInfo: {
                            pageNum: this.pageNum,
                            pageSize: this.pageSize
                        },
                    };
                getCouponActivityList(param).then((res) => {
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        let list = res.data.list;
                        for(var i=0;i<list.length;i++){
                            if(list[i].enableFlag == 1){
                                if(new Date(list[i].startTime).getTime() > new Date().getTime()){
                                    list[i].enableFlag = 5
                                }else if(new Date(list[i].startTime).getTime() <= new Date().getTime() && new Date(list[i].endTime).getTime() >= new Date().getTime()){
                                    list[i].enableFlag = 6
                                }else if(new Date(list[i].endTime).getTime() < new Date().getTime()){
                                    list[i].enableFlag = 7
                                }
                            }
                        }
                        this.list = list;
                        this.total = res.data.paginationInfo.total;
                    }

                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },
            getCouponActivityById(id,flag){
                getCouponActivityById({id:id}).then((res) => {
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        let result= res.data;
                        if(flag){
                            //说明是编辑
                            this.editForm = {
                                id: result.id,
                                activityName: result.activityName,
                                time: [new Date(result.startTime),new Date(result.endTime)],
                            }
                        }else{
                            let channel = '';
                            let ticket = [];
                            result.channelTypeList.forEach(
                                (item,index)=>{
                                    if(index!=result.channelTypeList.length-1){
                                        channel+= item.channelName+'/'
                                    }else{
                                        channel+= item.channelName
                                    }

                                }
                            );
                            result.couponTypeList.forEach(
                                (item)=>{
                                    ticket.push(
                                        {
                                            time: util.dateFormat('yyyy-MM-dd hh:mm:ss',new Date(item.startTime))+'至'+util.dateFormat('yyyy-MM-dd hh:mm:ss',new Date(item.endTime)),
                                            tool: item.couponName+'：'+item.couponDecimalName+'，'+item.couponAmount+'张'

                                        }
                                    )
                                }
                            );
                            //说明是审核
                            this.checkForm = {
                                time: util.dateFormat('yyyy-MM-dd hh:mm:ss',new Date(result.startTime))+'至'+util.dateFormat('yyyy-MM-dd hh:mm:ss',new Date(result.endTime)),
                                id: result.id,
                                activityName: result.activityName,
                                activityCode: result.activityCode,
                                ticket: ticket,
                                channel:channel,
                                remark: result.remark,
                                checkRemark: ''

                            };
                        }

                    }
                }, (res) => { this.listLoading = false; } ).catch(() => {});

            },
            //添加显示 ----------add
            handleAdd() {
                this.dialogVisible = true;
                this.form.couponType = '';
                this.form.items = [];
                this.config = [];
                this.editConfig = [];
                //重置表单
                this.$nextTick(() => {
                  this.$refs.form.resetFields();
                });

            },
            addCoupon(){
                if(!this.form.coupon){
                    this.$message.error('请先选择优惠券');
                    return;
                }
                let desc  = this.coupon.find(item => {
                    return item.id === this.form.coupon;
                });
                let isExist = this.form.items.find(item => {
                    return item.id === this.form.coupon;
                });
                if(isExist){
                    this.$message.error('已存在请勿重复添加');
                    return;
                }

                this.form.items.push({
                    name: '现金券',
                    desc: desc.couponContent,
                    id: this.form.coupon
                })
                this.config.push({
                    couponAmount: '',
                    couponTypeId: this.form.coupon,
                    endTime: '',
                    startTime: ''
                });
                this.editConfig.push({
                    id: this.form.coupon,
                    total: '',
                    time: []
                });
            },
            //提交新增活动
            onSubmit(){
                this.isLoading = true;
                let startTime = this.form.time.length==0?'':util.dateFormat('yyyy-MM-dd hh:mm:ss',this.form.time[0]);
                let endTime = this.form.time.length==0?'':util.dateFormat('yyyy-MM-dd hh:mm:ss',this.form.time[1]);
                let param =
                {
                    activityName: this.form.activityName,
                    startTime: startTime,
                    endTime: endTime,
                    remark: this.form.remark,
                    channelTypeList: this.form.channelTypeList,
                    couponTypeList: this.config
                }

                this.$refs.form.validate((valid) => {
                    if (valid) {
                        let flag = true;
                        this.config.forEach((item)=>{
                            if(!item.couponAmount){
                                flag = false;
                                return;
                            }
                        });
                        if(!flag || this.config.length ==0){
                            this.$message.error('请添加对应优惠券配置');
                            return;
                        }
//                        if(this.config.length!==this.form.items.length){
//                            this.$message.error('请添加对应优惠券配置');
//                            return;
//                        }
                        addCouponActivity(param).then((res) => {
                            this.isLoading = false;
                            if (this.GLOBAL.isResonseSuccess(res)) {
                                this.$message({
                                    message: '新增成功',
                                    type: 'success'
                                });
                                this.dialogVisible = false;
                                this.getCouponActivityList();
                            }
                        }, (res) => { this.listLoading = false; } ).catch(() => {});
                    }
                })
            },

            //删除优惠券
            delCoupon: function (id) {
                //获取此时选中的数据
                //显示当前添加框
                this.form.items.splice(this.form.items.findIndex(item => item.id === id), 1);
                this.config.splice(this.config.findIndex(item => item.couponTypeId === id), 1);
                this.editConfig.splice(this.config.findIndex(item => item.id === id), 1);
            },
            //显示配置框
            showConfig(index) {
                this.isShow = true;
                this.index = index;
                if(this.editConfig[index]){

                    this.configForm.time = this.editConfig[index].time;
                    this.configForm.total = this.editConfig[index].total;
                }else {
                    this.$nextTick(() => {
                        this.$refs.configForm.resetFields();
                    });
                }

            },
            //显示详情
            see(row) {
                this.isButtonShow = false;
                this.isCheckShow = true;
                this.checkTitle = '查看详情';
                this.getCouponActivityById(row.id);
                this.isEdit= true;
            },
            //显示审核详情
            check(row) {
                this.isButtonShow = true;
                this.isCheckShow = true;
                this.checkTitle = '审核';
                this.isEdit= false;
                this.getCouponActivityById(row.id);
            },
            //提交审核详情
            onSubmitCheck(status) {
                this.isLoading = true;
                let param = {
                    checkRemark: this.checkForm.checkRemark,
                    enableFlag: status,
                    id: this.checkForm.id
                };
                checkActivity(param).then((res) => {
                    this.isLoading = false;
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.$message({
                            message: '审核成功',
                            type: 'success'
                        });
                        this.isCheckShow = false;
                        this.getCouponActivityList();
                    }
                }, (res) => { this.listLoading = false; } ).catch(() => {});

            },
            //编辑活动
            edit(row) {
                this.isEditShow = true;
                this.getCouponActivityById(row.id,1);
            },
            //提交修改
            submitEdit(){
                let startTime = util.dateFormat('yyyy-MM-dd hh:mm:ss',this.editForm.time[0]);
                let endTime = util.dateFormat('yyyy-MM-dd hh:mm:ss',this.editForm.time[1]);;
                let param =
                    {
                        id: this.editForm.id,
                        activityName: this.editForm.activityName,
                        startTime: startTime,
                        endTime: endTime,

                    }
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        editActivity(param).then((res) => {
                            if (this.GLOBAL.isResonseSuccess(res)) {
                                this.$message({
                                    message: '修改成功',
                                    type: 'success'
                                });
                                this.isEditShow = false;
                                this.getCouponActivityList();
                            }
                        }, (res) => { this.listLoading = false; } ).catch(() => {});
                    }
                })
            },
            //删除活动
            del(row) {
                this.$confirm('确认删除吗？', '提示', {}).then(() => {
                    removeActivity({id: row.id}).then((res) => {
                        if (this.GLOBAL.isResonseSuccess(res)) {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getCouponActivityList();
                        }
                    });
                });
            },
            //删除活动
            forbid(row) {
                this.$confirm('确认终止吗？', '提示', {}).then(() => {
                    forbidActivity({id: row.id}).then((res) => {
                        if (this.GLOBAL.isResonseSuccess(res)) {
                            this.$message({
                                message: '终止成功',
                                type: 'success'
                            });
                            this.getCouponActivityList();
                        }
                    });
                });
            }


        },

        created() {
            this.getAllCount();
            this.getChannel();
            this.getChannel(1);
//            this.getCouponType();
            this.getCouponActivityList();

        }
    }

</script>

<style scoped>
    .product{
        width: 210px;
        display: flex;
        flex-wrap: wrap;
    }
    .product span{
        display: inline-block;
        width: 50px;
    }
</style>