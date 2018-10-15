<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form ref="filters" :model="filters"  align="right" :inline="true"  class="demo-form-inline">
                <el-form-item label="兑换码名称">
                    <el-input v-model="filters.name" placeholder="请输入兑换码名称" clearable></el-input>
                </el-form-item>
                <el-form-item label="创建时间">
                    <el-date-picker
                            v-model="filters.time"
                            align="right"
                            type="date"
                            placeholder="选择日期"
                            :picker-options="pickerOptions1">
                    </el-date-picker>
                </el-form-item>
                <el-form-item >
                    <el-button type="primary" @click="search">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button v-if="isAuth('scloud:redeemcode:insert')" type="primary" @click="handleAdd">新增兑换码</el-button>
                </el-form-item>
                <!--<el-form-item>-->
                    <!--<el-button type="primary" @click="handleAdd">导入</el-button>-->
                <!--</el-form-item>-->
                <el-form-item>
                    <el-button v-if="isAuth('scloud:redeemcode:export')"  type="primary" @click="exportRedeemCode">导出</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table
                :data="list"
                highlight-current-row
                v-loading="listLoading"
                style="width: 100%;"
                @selection-change="handleSelectionChange">
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column
                prop="exchangeName"
                label="名称">
            </el-table-column>
            <el-table-column
                prop="exchangeCode"
                label="兑换码">
            </el-table-column>
            <el-table-column
                prop="remark"
                label="兑换详情">
            </el-table-column>
            <el-table-column
                prop="createTime"
                label="创建时间"
                sortable>
            </el-table-column>
            <el-table-column
                    prop="shopName"
                    label="区域"
                    sortable>
            </el-table-column>
            <el-table-column
                fixed="right"
                label="操作"
                width="180">
                <template slot-scope="scope">
                    <el-button v-if="isAuth('scloud:redeemcode:view')" type="primary"  size="mini" @click="see(scope.row)">查看详情</el-button>
                    <el-button v-if="isAuth('scloud:redeemcode:delete')" type="primary"  size="mini" @click="del(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--新增或修改弹出窗-->
        <el-dialog
                :title="title"
                :visible.sync="dialogVisible"
                width="50%">
            <el-form ref="form" :model="form" :rules="formRules" label-width="80px">
                <el-form-item label="名称" prop="exchangeName">
                    <el-input v-model="form.exchangeName" placeholder="请输入兑换码名称"></el-input>
                </el-form-item>
                <!--<el-form-item label="限领数量" prop="num">-->
                    <!--<el-input v-model="form.num"></el-input>-->
                <!--</el-form-item>-->
                <el-form-item label="使用店铺" prop="shopId">
                    <el-select v-model="form.shopId" style="width: 300px" placeholder="请选择使用店铺">
                        <el-option
                                v-for="item in shopList"
                                :key="item.id"
                                :label="item.orgName"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="关联活动" prop="activityInfo">
                    <el-select
                        v-model="form.activities"
                        multiple
                        collapse-tags
                        placeholder="请选择"
                        style="width: 300px"
                        @change='selectActivity'>
                        <el-option
                            v-for="item in activities"
                            :key="item.id"
                            :label="item.activityName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <div
                    v-for="item in form.activityInfo"
                    :key="item.id">
                    <el-form-item
                        v-for="item1 in item.couponTypeList"
                            :key="item1.id">
                        <span>{{item1.couponName}}</span>
                        <el-input v-model="item1.couponCount" type="number" style="width: 100px;"></el-input>
                        <span>张</span>
                    </el-form-item>
                    <el-form-item label="生成数量">
                        <el-input v-model="item.redeemCodeCount" type="number" placeholder="请输入生成数量"></el-input>
                    </el-form-item >
                </div>
                <el-form-item label="备注">
                    <el-input
                            v-model="form.remark"
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit" :loading = 'isLoading'>提交</el-button>
                    <el-button @click="dialogVisible=false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--查看详情弹出窗-->
        <el-dialog
                title="查看详情"
                :visible.sync="isCheckShow"
                width="50%">
            <el-form ref="checkForm" :model="checkForm" >
                <el-form-item label="兑换码名称：">
                    {{checkForm.exchangeName}}
                </el-form-item>
                <el-form-item label="使用店铺：">
                    {{checkForm.shopName}}
                </el-form-item>
                <el-form-item label="活动信息：">
                    <el-table
                            :data="checkForm.activities"
                            highlight-current-row
                            style="width: 100%;">
                        <el-table-column
                                prop="name"
                                label="活动名称">
                        </el-table-column>
                        <el-table-column
                                prop="number"
                                label="兑换码数量">
                        </el-table-column>
                        <el-table-column
                                prop="info"
                                label="优惠券信息">
                        </el-table-column>
                    </el-table>

                </el-form-item>
                <el-form-item label="备注">
                    {{checkForm.remark}}
                </el-form-item>

            </el-form>
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
    import {getShop,getRedeemCode,addRedeemCode,getRedeemCodeById,removeRedeemCode,getEffectiveActivity,getAllActivityList,exportRedeemCode} from "@/api/api";
    import {exportCount} from "@/api/api";

    // 导入组件
    export default {
        data: function () {
            return {
                //统计数目
                pickerOptions1: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    }, {
                        text: '一周前',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    }]
                },
                filters: {
                    name: '',
                    time: ''
                },//查询条件
                multipleSelection:[],//当前勾选的id
                dialogVisible: false,//弹出框是否显示
                title:'新增兑换码',//弹出框标题
                shopList:[],//门店列表
                activities: [],//当前有效活动列表
                activitiesAll: [],//当前所有活动列表
                isLoading: false,
                form: {
                    exchangeName: '',
                    shopId: '',
                    activities: [],
                    activityInfo: [
                    ],//活动数组
                    remark:''
                },//弹出窗数据
                formRules: {
                    exchangeName: [{required: true, message: '请输入兑换码名称', trigger: 'blur'}],
                    shopId: [{required: true, message: '请选择使用店铺', trigger: 'change'}],
                    activityInfo: [{required: true, message: '请选择活动', trigger: 'change'}]
                },//新增或修改验证规则
                isCheckShow: false,//查看详情框
                checkForm:{

                },//查看详情框数据
                list: [],
                pageNum: 1, //当前页码
                pageSize: 10,//页数
                listLoading: false,
                total: 0,


            }
        },
        methods: {

            search(){
                this.pageNum=1;
                this.getRedeemCode();
            },
            exportRedeemCode(){
                let params = {
                    exchangeName:this.filters.name,
                    createTime:this.filters.time
                };
                exportCount(params).then((res) => {
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        let params;
                        if(this.multipleSelection.length === 0) {
                            params = "&exchangeName=" + this.filters.name + "&createTime=" + this.filters.time;
                        } else {
                            let ids = [];
                            this.multipleSelection.forEach(
                                (item)=>{
                                    ids.push(item.id);
                                }
                            );
                            params = "&ids=" + ids.join(',')
                        }

                        location.href = exportRedeemCode(params);
                    }
                }, () => {});
            },
            handleSelectionChange(val){
                this.multipleSelection = val;
            },
            //时间格式化
            dateFormat(row, column) {
                return OrderUtil.commonDateFormat(row, column);
            },
            formatStatus(row, column) {
                return OrderUtil.formatStatus(row, column);
            },
            //切换页数
            handleCurrentChange(val) {
                this.pageNum = val;
                this.getRedeemCode();
            },
            //处理分页条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.getRedeemCode();
            },
            //获取门店列表
            getShopList(){
                getShop().then((res) => {
                        this.shopList = res.data;
                    }
                );
            },
            //获取兑换码列表
            getRedeemCode(){
                let createTime = this.filters.time?util.dateFormat('yyyy-MM-dd',this.filters.time):'';
                let param = {
                    createTime: createTime,
                    exchangeName:this.filters.name,
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    }

                };
                getRedeemCode(param).then((res) => {
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.list = res.data.list;
                        this.total = res.data.paginationInfo.total;
                    }
                }, () => { this.listLoading = false; } ).catch(() => {});

            },
        //获取查看详情信息
            getRedeemCodeById(id){
                getRedeemCodeById({id:id}).then((res) => {
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        //拼接详情信息
                        let result = res.data;
                        let shop= this.shopList.find(item=> item.id === result.shopId);
                        let activities = [];
                        result.activityInfo.forEach((item)=>{
                            let activity = this.activitiesAll.find(item1=> item1.id === item.activityId);
                            let activityInfo = {
                                name: activity.activityName,
                                number: item.redeemCodeCount,
                                info: ''

                            };
                            item.couponInfo.forEach((item2,index)=>{
                                let couponInfo = activity.couponTypeList.find(item3=>item3.id==item2.activityConfigureId);
                                if(index!=item.couponInfo.length-1){
                                    activityInfo.info+=couponInfo.couponName+'：'+item2.couponCount+'张，'
                                }else{
                                    activityInfo.info+=couponInfo.couponName+'：'+item2.couponCount+'张'
                                }


                            });

                            activities.push(
                                activityInfo
                            );
                        });
                        this.checkForm = {
                            exchangeName: result.exchangeName,
                            shopName: shop.orgName,
                            remark: result.remark,
                            activities: activities
                        };
                        this.isCheckShow = true;
                    }
                }, () => { this.listLoading = false; } ).catch(() => {});

            },
            //获取有效活动列表
            getEffectiveActivity(){
            //根据id获取兑换码
                getEffectiveActivity().then((res) => {
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.activities = res.data;

                    }
                }, () => { this.listLoading = false; } ).catch(() => {});
            },
            //获取所以活动列表
            getAllActivityList(){
                //根据id获取兑换码
                getAllActivityList().then((res) => {
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.activitiesAll = res.data;

                    }
                }, () => { this.listLoading = false; } ).catch(() => {});
            },

            //添加显示 ----------add
            handleAdd: function () {
                this.dialogVisible = true;
                this.form.activities = [];
                //重置表单
                this.$nextTick(() => {
                    this.$refs.form.resetFields();
                });
            },
            //选择关联
            selectActivity(){
                this.form.activityInfo = [];//先清空
                //加载选中的活动
                this.form.activities.forEach(
                    (item)=>{
                        let activity = this.activities.find(
                            item1 => item==item1.id
                        )
                        activity.couponTypeList.forEach((key)=>{

                            this.$set(key,'couponCount', null);
                        })

                        this.$set(activity,'redeemCodeCount', null);
                        this.form.activityInfo.push(activity);
                    }
                )

            },
            //提交新增
            onSubmit(){

                let param = {
                    exchangeName: "",
                    shopId: "",
                    remark: "",
                    activityInfo: [
                    ]
                };
                param.exchangeName = this.form.exchangeName;
                param.shopId = this.form.shopId;
                param.remark = this.form.remark;
                param.activityInfo = [];
                this.form.activityInfo.forEach(
                    (item)=>{
                        let activity = {};
                        activity.activityId = item.id;
                        activity.redeemCodeCount = item.redeemCodeCount;
                        activity.couponInfo = [];
                        item.couponTypeList.forEach(
                            (item1)=>{
                                let items = {};
                                items.couponTypeId = item1.couponTypeId;
                                items.activityConfigureId = item1.id;
                                items.couponCount = item1.couponCount;
                                activity.couponInfo.push(items);
                            }
                        )
                        param.activityInfo.push(activity);
                    }
                )
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        let flag = true;
                        param.activityInfo.forEach(
                            (item)=>{
                                if(!item.redeemCodeCount){
                                    this.$message.error('请输入生成兑换码数量');
                                    flag = false;
                                    return;
                                }
                                if(item.redeemCodeCount<=0){
                                    this.$message.error('生成兑换码数量必须大于0');
                                    flag = false;
                                    return;
                                }

                                item.couponInfo.forEach(
                                    (item1)=>{
                                        if(!item1.couponCount){
                                            this.$message.error('请输入对应优惠券数量');
                                            flag = false;
                                            return;
                                        }
                                        if(item1.couponCount<0){
                                            this.$message.error('优惠券数量不能为负数');
                                            flag = false;
                                            return;
                                        }
                                    }
                                )
                            }
                        )
                        if(!flag){
                            return;
                        }
                        this.isLoading = true;
                        addRedeemCode(param).then((res) => {
                            this.isLoading = false;
                            if (this.GLOBAL.isResonseSuccess(res)) {
                                this.$message({
                                    message: '新增成功',
                                    type: 'success'
                                });
                                this.dialogVisible = false;
                                this.getRedeemCode();
                            }
                        }, (res) => { this.listLoading = false; } ).catch(() => {});
                    }
                })

            },
            //显示详情
            see(row) {

                this.getRedeemCodeById(row.id);
            },
            //删除兑换码
            del(row) {
                this.$confirm('确认删除吗？', '提示', {}).then(() => {
                    removeRedeemCode({id: row.id}).then((res) => {
                        if (this.GLOBAL.isResonseSuccess(res)) {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getRedeemCode();
                        }
                    });
                });
            },


        },

        created() {
            //this.getData();
            this.getShopList();
            this.getRedeemCode();
            this.getEffectiveActivity();
            this.getAllActivityList();

        }
    }

</script>

<style scoped>

</style>