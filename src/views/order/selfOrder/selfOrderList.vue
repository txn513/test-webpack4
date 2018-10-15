<template>
    <section>

        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <div style="text-align:right;">
                <el-button  type="primary" @click="preConsignmentSelfOrder(1)">待发货({{preConsignment}})</el-button>
                <el-button  type="primary" @click="consignmentedSelfOrder(1)">已发货({{consignmented}})</el-button>
                <el-button  type="primary" @click="completedSelfOrder(1)">已完成({{completed}})</el-button>
                <el-button  type="primary" @click="closedSelfOrder(1)">已关闭({{closed}})</el-button>
            </div>
        </el-col>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;" :rules="searchFormRules">
            <el-form style="float:right" :inline="true"  class="demo-form-inline selections">
                
                <el-form-item label="订单号:" >
                    <el-input size="medium" v-model="orderId" placeholder="输入订单号" style="width:250px;"></el-input>
                </el-form-item>
                <el-form-item label="业务类型">
                    <template>
                        <select-group :num ="number" :select="isSelect" @getresult = 'getResultNumber'></select-group>
                    </template>
                </el-form-item>
                <el-form-item label="外部订单编号:" >
                    <el-input size="medium" v-model="orderOutId" placeholder="输入外部订单编号" style="width:250px;"></el-input>
                </el-form-item>
                <el-form-item label="订单状态:" >
                    <el-select v-model="orderStatusSearch" placeholder="请选订单状态">
                        <el-option label="--请选择订单状态--" value=""></el-option>
                        <el-option label="提交状态" value="0"></el-option>
                        <el-option label="申请取消" value="10"></el-option>
                        <el-option label="待发货" value="20"></el-option>
                        <el-option label="待收货" value="30"></el-option>
                        <el-option label="智能柜预约中" value=40></el-option>
                        <el-option label="智能柜预约失败" value=50></el-option>
                        <el-option label="智能柜预约成功" value=60></el-option>
                        <el-option label="用户已将货物存柜" value=70></el-option>
                        <el-option label="用户已将货物存柜" value=70></el-option>
                        <el-option label="门店已分配收件员" value=80></el-option>
                        <el-option label="收件员确认前往" value=90></el-option>
                        <el-option label="收件员从柜中取件" value=100></el-option>
                        <el-option label="已关联订单" value=110></el-option>
                        <el-option label="门店收到客户的货物" value=120></el-option>
                        <el-option label="加工中心收货员从门店收货" value=130></el-option>
                        <el-option label="加工中心已收货" value=140></el-option>
                        <el-option label="清洗中" value=150></el-option>
                        <el-option label="清洗完成" value=160></el-option>
                        <el-option label="送回门店" value=170></el-option>
                        <el-option label="门店确认收货" value=180></el-option>
                        <el-option label="门店分配派件员" value=190></el-option>
                        <el-option label="派件员配送中" value=200></el-option>
                        <el-option label="派件员已存入柜中" value=210></el-option>
                        <el-option label="已签收" value=220></el-option>
                        <el-option label="用户确认已收货/已完成" value=230></el-option>
                        <el-option label="用户评价" value=240></el-option>
                        <el-option label="商家回收" value=250></el-option>
                        <el-option label="客户紧急取走" value=260></el-option>
                        <el-option label="提交退货" value=270></el-option>
                        <el-option label="已取消" value=280></el-option>
                        <el-option label="已退货" value=290></el-option>
                        <el-option label="关闭" value=300></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="订单来源:" >
                    <el-select v-model="orderSourceType" placeholder="请选择订单来源">
                        <el-option label="--请选择订单来源--" value=""></el-option>
                        <el-option label="京东" value="10"></el-option>
                        <el-option label="淘宝" value="11"></el-option>
                        <el-option label="门店" value="5"></el-option>
                        <el-option label="APP" value="3"></el-option>
                        <el-option label="微信小程序" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="会员手机号:" >
                    <el-input size="medium" v-model="phone" placeholder="请输入会员手机号" style="width:250px;"></el-input>
                </el-form-item>
                <el-form-item label="支付状态:" >
                    <el-select v-model="payStatus" placeholder="请选择支付状态">
                        <el-option label="--请选择支付状态--" value=""></el-option>
                        <el-option label="未付款" value="0"></el-option>
                        <el-option label="已付款" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属:" >
                    <el-input size="medium" v-model="storeName" placeholder="请输入所属仓库或门店名称" style="width:250px;"></el-input>
                </el-form-item>
                <el-date-picker
                        v-model="queryDate"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd"
                        align="right">
                </el-date-picker>
                
                <el-button type="primary" v-on:click="searchByCondition(2)" :loading="listLoading" >查询</el-button>
                <el-button  type="primary" @click="addSelfOrder()">新增</el-button>
            </el-form>
        </el-col>
        <el-table
                :data="tableData"
                stripe
                style="width: 100%" v-loading="listLoading">
            <el-table-column
                    sortable
                    prop="id"
                    label="订单号"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="businessCode"
                    label="业务类型"
                    show-overflow-tooltip :formatter="businessCodeFormat">
            </el-table-column>
            <el-table-column
                    sortable
                    prop="orderStatus"
                    label="订单状态"
                    show-overflow-tooltip :formatter="formatOrderStatus">
            </el-table-column>
            <el-table-column
                    sortable
                    prop="orderOutId"
                    label="外部订单编号"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="orderSourceType"
                    label="订单来源"
                    show-overflow-tooltip :formatter="formatOrderSource">
            </el-table-column>
            <el-table-column
                    sortable
                    prop="payStatus"
                    label="支付状态"
                    show-overflow-tooltip :formatter="payStatusFormat">
            </el-table-column>
            <el-table-column
                    sortable
                    prop="initialPrice"
                    label="订单金额"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="payPrice"
                    label="应付金额"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="paidPrice"
                    label="实付金额"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="storeName"
                    label="所属"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="phone"
                    label="会员手机号"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="createTime"
                    :formatter="dateFormat"
                    label="提交时间"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    label="操作"
                    width="200">
                <template slot-scope="scope">
                    <el-button @click="orderDetail(scope.$index, scope.row)" size="mini" type="primary">查看订单</el-button>
                    <span v-if="scope.row.orderStatus == 30 && scope.row.distributionType===1 || scope.row.orderStatus == 40 && scope.row.distributionType===1">
                        <el-button @click="logisticsTrackingFun(scope.$index, scope.row)" size="mini" type="primary">  物流跟踪</el-button>
                    </span>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="物流信息" v-model="logisticsTrackingVisible" :visible.sync="logisticsTrackingVisible">
            <span > 物流公司:<span class="order-status">{{logisticsCompany}}</span></span><span style="margin-left: 10em">物流单号:<span class="order-status">{{logisticsNo}}</span></span>
            <template>
                <div>
                    <log-msg :list="logisticsTracking"></log-msg>
                </div>
            </template>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="logisticsTrackingVisible = false">关闭</el-button>
            </div>
        </el-dialog>
        <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageNum"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total" style="float: right;margin-top: 10px">
        </el-pagination>

        <el-dialog ref="orderDetailDialogPopUp" title="订单详情" v-model="orderDetailVisible" :visible.sync="orderDetailVisible" class="orderDetailDialog orderDetailDialogPopUp">
            <order-detail v-if="orderDetailVisible" :currentOrderId="currentOrderId"></order-detail>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="orderDetailVisible = false">关闭</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import util from '../../../common/js/util'
    import logMsg from '@/components/logMsg'
    import OrderUtil from '../../../common/js/OrderUtil';
    import selectGroup from '@/components/selectGroup';
    import orderDetail from '@/views/order/selfOrder/selfOrderDetail';
    import {orderSelfListFun ,orderSelfCountFun,getLogisticsTrackDetail} from '../../../api/api';
    export default {
        components:{
            logMsg
        },
        components:{
            selectGroup,
            orderDetail
        },
        data() {
            return {
                logisticsTracking:[],//物流跟踪信息
                logisticsTrackingVisible:false,
                logisticsNo:'',
                logisticsCompany:"",
                listLoading:false,
                orderId:"",
                currentOrderId:'',
                number: -1,//后台传过来的十进制数据
                isSelect: true,//是否可选
                businessCode:-1,//业务类型
                orderOutId:"",
                orderStatusSearch:"",
                orderSourceType:"",
                phone:"",
                payStatus:"",
                storeName:"",
                orderStatus:-1,
                tableData:[],//表格数据
                total: 0,
                pageNum: 1, //当前页码
                pageSize: 10,//页数
                allOrder:0,
                preConsignment:0,
                consignmented:0,
                completed:0,
                closed:0,
                queryDate:[],//搜索日期范围
                orderDetailVisible:false,//订单详情
                searchFormRules:{
                    endDate:[

                    ]
                }
            }
        },
        methods: {
            getResultNumber(result){
                this.businessCode = result;
            },
            //增加自营订单
            addSelfOrder(){
                this.$router.push({path: '/orderAdd'});
            },
            orderSelfCount(){
                this.listLoading = true;
                orderSelfCountFun().then((data) => {
                        this.listLoading = true;
                        if (this.GLOBAL.isResonseSuccess(data)){
                            var list = data.data;
                            this.allOrder = list.allOrder;
                            this.preConsignment = list.preConsignment;
                            this.consignmented = list.consignmented;
                            this.completed = list.completed;
                            this.closed = list.closed;

                        }
                    }
                    ,data => { this.listLoading = false;}
                );
            },
            //初始化订单列表
            getByCondition(queryParamType){
                var para = {
                    id:this.orderId,
                    orderOutId:this.orderOutId,
                    orderStatus:this.orderStatus,
                    businessCode:this.businessCode,
                    orderSourceType:this.orderSourceType,
                    payStatus:this.payStatus,
                    storeName:this.storeName,
                    phone:this.phone,
                    orderStatusSearch:this.orderStatusSearch,
                    beginDate:(this.queryDate && this.queryDate.length > 0) ? this.queryDate[0] : '',
                    endDate:(this.queryDate && this.queryDate.length > 0) ? this.queryDate[1] : '',
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    }
                };

                if (queryParamType === 2){
                    para.orderStatus = null;
                }
                this.listLoading = true;
                orderSelfListFun(para).then((data) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(data)) {
                            this.tableData = data.data.list;
                            this.total = data.data.paginationInfo.total;
                        }
                    }
                    ,data => { this.listLoading = false;}
                );
            },
            //分页查询
            handleCurrentChange(val) {
                this.pageNum = val;
                this.getByCondition();
            },
            //处理分页条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.getByCondition();
            },
            //二次查询,所有订单
            allSelfOrder(){
                this.pageNum=1;
                this.orderStatus = -1;
                this.orderId="";
                this.orderOutId="";
                this.createTime="";
                this.getByCondition();
            },
            //二次查询,待发货订单
            preConsignmentSelfOrder(queryParamType){
                this.pageNum=1;
                this.orderStatus = 20;
                this.orderId="";
                this.orderOutId="";
                this.createTime="";
                this.getByCondition(queryParamType);
            },
            //二次查询,已发货订单
            consignmentedSelfOrder(queryParamType){
                this.pageNum=1;
                this.orderStatus = 30;
                this.orderId="";
                this.orderOutId="";
                this.createTime="";
                this.getByCondition(queryParamType);
            },
            //二次查询,已完成订单
            completedSelfOrder(queryParamType){
                this.pageNum=1;
                this.orderStatus = 230;
                this.orderId="";
                this.orderOutId="";
                this.createTime="";
                this.getByCondition(queryParamType);
            },
            //二次查询,已关闭订单
            closedSelfOrder(queryParamType){
                this.pageNum=1;
                this.orderStatus = 300;
                this.orderId="";
                this.orderOutId="";
                this.createTime="";
                this.getByCondition(queryParamType);
            },
            //条件查询
            searchByCondition(queryParamType){
                this.pageNum=1;
                this.getByCondition(queryParamType);
            },
            //查看订单详情
            orderDetail(index,row){
                this.currentOrderId = row.id
                this.orderDetailVisible = true;
            },
            //物流跟踪
            logisticsTrackingFun(index,row){
                this.logisticsTracking = [];
                this.logisticsTrackingVisible = true;
                var para = {
                    orderNumber:row.id,
                    logisticsNumber:row.logisticsNo,
                };
                this.listLoading = true;
                getLogisticsTrackDetail(para).then((res) => {
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.logisticsTracking = res.data.list;
                        this.logisticsCompany = this.logisticsTracking[0].logisticsCompany;
                        this.logisticsNo = this.logisticsTracking[0].logisticsNumber;
                    }else {
                        this.$message({
                            message: '操作失败,'+res.message==undefined?"":res.message,
                            type: 'warning'
                        });
                    }
                    this.listLoading = false;
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },
            //时间格式化
            dateFormat(row, column) {
                return OrderUtil.commonDateFormat(row, column);
            },

            businessCodeFormat: function (row){
                if (row.businessCode === 1){
                    return '洗护';
                } else if (row.businessCode === 2){
                    return '名品';
                } else if (row.businessCode === 4){
                    return '态奢';
                } else {
                    return '未知';
                }
            },

            formatOrderStatus: function (row, column) {
                if (row.orderStatus === 0){
                    return '提交状态';
                } else if (row.orderStatus === 10){
                    return '申请取消';
                } else if (row.orderStatus === 20){
                    return '待发货';
                } else if (row.orderStatus === 30){
                    return '待收货';
                } else if (row.orderStatus === 40){
                    return '智能柜预约中';
                } else if (row.orderStatus === 50){
                    return '智能柜预约失败';
                } else if (row.orderStatus === 60){
                    return '智能柜预约成功';
                } else if (row.orderStatus === 70){
                    return '用户已将货物存柜';
                } else if (row.orderStatus === 70){
                    return '用户已将货物存柜';
                } else if (row.orderStatus === 80){
                    return '门店已分配收件员';
                } else if (row.orderStatus === 90){
                    return '收件员确认前往';
                } else if (row.orderStatus === 100){
                    return '收件员从柜中取件';
                } else if (row.orderStatus === 110){
                    return '已关联订单';
                } else if (row.orderStatus === 120){
                    return '门店收到客户的货物';
                } else if (row.orderStatus === 130){
                    return '加工中心收货员从门店收货';
                } else if (row.orderStatus === 140){
                    return '加工中心已收货';
                } else if (row.orderStatus === 150){
                    return '清洗中';
                } else if (row.orderStatus === 160){
                    return '清洗完成';
                } else if (row.orderStatus === 170){
                    return '送回门店';
                } else if (row.orderStatus === 180){
                    return '门店确认收货';
                } else if (row.orderStatus === 190){
                    return '门店分配派件员';
                }  else if (row.orderStatus === 200){
                    return '派件员配送中';
                }  else if (row.orderStatus === 210){
                    return '派件员已存入柜中';
                }  else if (row.orderStatus === 220){
                    return '已签收';
                }  else if (row.orderStatus === 230){
                    return '用户确认已收货/已完成';
                }  else if (row.orderStatus === 240){
                    return '用户评价';
                }  else if (row.orderStatus === 250){
                    return '商家回收';
                }  else if (row.orderStatus === 260){
                    return '客户紧急取走';
                }  else if (row.orderStatus === 270){
                    return '提交退货';
                }  else if (row.orderStatus === 280){
                    return '已取消';
                }  else if (row.orderStatus === 290){
                    return '已退货';
                }  else if (row.orderStatus === 300){
                    return '关闭';
                } else {
                    return '未知';
                }
            },

            formatOrderSource: function (row) {
                if (row.orderSourceType === 1){
                    return '微信小程序';
                } else if (row.orderSourceType === 2){
                    return '微信公众号';
                } else if(row.orderSourceType === 3){
                    return '苹果app';
                } else if (row.orderSourceType === 4){
                    return '安卓app';
                } else if(row.orderSourceType === 5){
                    return '门店';
                } else if (row.orderSourceType === 10){
                    return '京东';
                } else if(row.orderSourceType === 11){
                    return '淘宝';
                } else if (row.orderSourceType === 12){
                    return '其他';
                } else {
                    return '未知';
                }
            },

            payStatusFormat: function (row) {
                if (row.payStatus === 0){
                    return '未付款';
                } else if (row.payStatus === 1){
                    return '已付款';
                } else {
                    return '未知';
                }
            },
        },
        mounted() {
            this.getByCondition();
            this.orderSelfCount();
        }
    }

</script>

<style scoped>
    .selections {
        display: flex;
        justify-content: flex-end;
        flex-wrap: wrap;
    }
    /*.selections .el-form-item,
    .selections .el-button {
        float: right;
    }*/
    .selections .el-form-item {
        margin-bottom: 10px !important;
    }
    .selections button {
        height: 40px;
        margin-left: 10px;
    }
    .selections .el-input {
        
    }
    .el-input--medium input {
        height: 40px;
    }
    .selections .el-input__inner {
        height: 40px !important;
        margin-left: 10px;
    }
    .el-form--inline .el-form-item,
    .el-form--inline el-date-picker {
        margin-right: 0;
        margin-left: 10px;
    }
    .el-form--inline .el-form-item {
        height: 40px    ;
    }
    .el-form--inline .el-form-item__content {
        height: 40px;
    }

</style>