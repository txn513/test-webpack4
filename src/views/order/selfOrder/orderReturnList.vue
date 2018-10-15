<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <div style="text-align:right;">
                <el-button  type="primary" @click="allOrderReturn()" >全部申请({{allOrder}})</el-button>
                <el-button  type="primary" @click="preDealOrderReturn()">待处理({{preDeal}})</el-button>
                <el-button  type="primary" @click="dealingOrderReturn()">退货中({{dealing}})</el-button>
                <el-button  type="primary" @click="prepayOrderReturn()">待付款({{prepay}})</el-button>
                <el-button  type="primary" @click="completedOrderReturn()">已完成({{completed}})</el-button>
                <el-button  type="primary" @click="closedOrderReturn()">已拒绝({{closed}})</el-button>
            </div>
        </el-col>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form align="right" :inline="true"  class="demo-form-inline">
                <el-form-item label="订单号:" >
                    <el-input size="medium" v-model="orderId" placeholder="输入订单号" style="width:250px;"></el-input>
                </el-form-item>
                <el-form-item label="退货号:" >
                    <el-input size="medium" v-model="id" placeholder="输入退货号" style="width:250px;"></el-input>
                </el-form-item>
                <el-form-item label="日期:" >
                    <el-date-picker v-model="createTime" type="date" placeholder="选择日期"></el-date-picker>
                </el-form-item>
                <el-button type="primary" v-on:click="searchData" :loading="listLoading">查询</el-button>
            </el-form>
        </el-col>

        <el-table :data="tableData" stripe border  highlight-current-row v-loading="listLoading" style="width: 100%;">
            <el-table-column prop="id" label="退货编号" show-overflow-tooltip></el-table-column>
            <el-table-column prop="orderId" label="订单编号" show-overflow-tooltip></el-table-column>
            <el-table-column prop="createTime" label="申请时间" show-overflow-tooltip sortable :formatter="dateFormat"></el-table-column>
            <el-table-column prop="returnsPrice" label="退款金额" sortable :formatter="formatPrice"></el-table-column>
            <el-table-column prop="receiverName" label="用户账号" show-overflow-tooltip></el-table-column>
            <el-table-column prop="returnsStatus" label="申请状态" sortable :formatter="formatStatus"></el-table-column>
            <el-table-column prop="updateTime" label="处理时间" show-overflow-tooltip sortable :formatter="updateFormat"></el-table-column>
            <el-table-column  fixed="right" label="操作" width="120">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="orderDetail(scope.$index, scope.row)">查看详情</el-button>
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
    </section>
</template>

<script>
    import util from '../../../common/js/util'
    import {orderReturnList ,orderReturnCount} from '../../../api/api';

    export default {
        data() {
            return {
                listLoading:false,
                orderId:"",
                id:"",
                returnsStatus:-1,
                createTime: "", //暂时初始化不做日期限制
                tableData:[],//表格数据
                total: 0,
                pageNum: 1, //当前页码
                pageSize: 10,//页数
                allOrder:0,
                preDeal:0,
                dealing:0,
                prepay:0,
                completed:0,
                closed:0,
            }
        },
        methods: {
            //金额格式化
            formatPrice: function(row, column) {
                var prices = row[column.property];
                if (!prices) {
                    return "";
                }
                return util.moneyFormat(parseFloat(prices).toFixed(2));
            },
            //时间格式化
            dateFormat:function(row, column) {
                var dateTime = row[column.property];
                if (!dateTime) {
                    return "";
                }
                return util.formatDate.format(new Date(dateTime), 'yyyy-MM-dd hh:mm:ss');
            },
            //时间格式化
            updateFormat:function(row, column) {
                var dateTime = row[column.property];
                if (!dateTime || row.returnsStatus == 10) {
                    return "";
                }
                return util.formatDate.format(new Date(dateTime), 'yyyy-MM-dd hh:mm:ss');
            },
            //退货单状态格式化
            formatStatus: function (row, column) {
                switch (row[column.property]) {
                    case 10:
                        return '待处理';
                        break;
                    case 20:
                        return '退货中';
                        break;
                    case 30:
                        return '待付款';
                        break;
                    case 40:
                        return '已完成';
                        break;
                    case 50:
                        return '已拒绝';
                        break;
                    default:
                        return '未知状态:';
                }
            },
            //自营订单退货统计
            orderReturn(){
                this.listLoading = true;
                orderReturnCount().then((data) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(data)){
                            var list = data.data;
                            this.allOrder = list.allOrder;
                            this.preDeal = list.preDeal;
                            this.dealing = list.dealing;
                            this.prepay = list.prepay;
                            this.completed = list.completed;
                            this.closed = list.closed;
                        }
                    }
                    ,data => { this.listLoading = false;}
                );
            },
            //条件查询订单列表
            getByCondition(){
                let para = {
                    id:this.id,
                    orderId:this.orderId,
                    returnsStatus:this.returnsStatus,
                    createTime:util.dateFormat("yyyy-MM-dd",new Date(this.createTime)),
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    }
                };

                if(this.createTime === ""||this.createTime === null){
                    delete para.createTime;
                }
                this.listLoading = true;
                orderReturnList(para).then((res) => {
                    this.listLoading = false;
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        var list = res.data.list;
                        this.tableData = list;
                        this.total = res.data.paginationInfo.total;
                    }
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },
            //点击查询
            searchData() {
                this.pageNum = 1;
                this.getByCondition();
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
            allOrderReturn(){
                this.pageNum=1;
                this.returnsStatus = -1;
                this.orderId="";
                this.id="";
                this.getByCondition();
            },
            //二次查询,待处理订单
            preDealOrderReturn(){
                this.pageNum=1;
                this.returnsStatus = 10;
                this.orderId="";
                this.id="";
                this.createTime="";
                this.getByCondition();
            },
            //二次查询,退货中订单
            dealingOrderReturn(){
                this.pageNum=1;
                this.returnsStatus = 20;
                this.orderId="";
                this.id="";
                this.createTime="";
                this.getByCondition();
            },
            //二次查询,待付款订单
            prepayOrderReturn(){
                this.pageNum=1;
                this.returnsStatus = 30;
                this.orderId="";
                this.id="";
                this.createTime="";
                this.getByCondition();
            },
            //二次查询,已完成订单
            completedOrderReturn(){
                this.pageNum=1;
                this.returnsStatus = 40;
                this.orderId="";
                this.id="";
                this.createTime="";
                this.getByCondition();
            },
            //二次查询,已拒绝订单
            closedOrderReturn(){
                this.pageNum=1;
                this.returnsStatus = 50;
                this.orderId="";
                this.id="";
                this.createTime="";
                this.getByCondition();
            },
            //查看订单详情
            orderDetail(index,row){
                switch (row.returnsStatus) {
                    //待处理
                    case 10:
                        this.$router.push({path:'/orderReturns/queryWaitOrder?orderId='+row.orderId+'&id='+row.id});
                        break;
                    //退货中
                    case 20:
                        this.$router.push({path:'/orderReturns/queryDealOrder?orderId='+row.orderId+'&id='+row.id});
                        break;
                    //已完成
                    case 40:
                        this.$router.push({path:'/orderReturns/queryCompleteOrder?orderId='+row.orderId+'&id='+row.id});
                        break;
                    //已拒绝
                    case 50:
                        this.$router.push({path:'/orderReturns/queryRefuseOrder?orderId='+row.orderId+'&id='+row.id});
                        break;
                    default:
                        this.$router.push({path:'/orderReturns/queryByOrderId?orderId='+row.orderId+'&id='+row.id});
                }
            }
        },
        mounted() {
            this.getByCondition();
            this.orderReturn();
        }
    }

</script>

<style scoped>

</style>