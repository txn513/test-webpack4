<template>
    <section>

        <!--<el-col :span="24" class="toolbar" style="padding-bottom: 0.5%;">
            <span class="label label-default" style="float: left">寄卖退货订单</span>
            <span class="label label-default" style="float: left"> > </span>
            <span class="label label-default" style="float: left" >订单详情</span>
            <el-button  type="primary" @click="refresh" style="float: right" >刷  新</el-button>
        </el-col>-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0.5%;">
            <div style="text-align:right;">
                <el-button  type="primary" @click="allConsignmentReturnOrder()" >全部订单({{allOrder}})</el-button>
                <el-button  type="primary" @click="stayHandleConsignmentReturnOrder()" >待处理({{stayHandleOrder}})</el-button>
                <el-button  type="primary" @click="waitSendConsignmentReturnOrder()" >待发货({{pendingDeliveryOrder}})</el-button>
                <el-button  type="primary" @click="completedConsignmentReturnOrder()">已完成({{completedOrder}})</el-button>
            </div>
        </el-col>
        <!--搜索查询工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :model="filters"  align="right" :inline="true" >
                <el-form-item label="退货单号" >
                    <el-input v-model="filters.id"  placeholder="请输入退货单号"></el-input>
                </el-form-item>
                <el-form-item label="订单编号">
                    <el-input v-model="filters.orderId" placeholder="请输入订单号"></el-input>
                </el-form-item>
                <el-form-item label="商品名称" >
                    <el-input v-model="filters.spuName" placeholder="请输入商品名称"></el-input>
                </el-form-item>
                <el-form-item label="退货来源" prop="orderSource">
                    <el-select v-model="filters.orderSource" placeholder="请选择退货来源">
                        <el-option
                                v-for="item in orderSourceList"
                                :key="item.id"
                                :value ="item.id"
                                :label="item.name">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item >
                    <el-button type="primary" v-on:click="searchData">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--回收订单列表-->
        <el-table :data="list" stripe  highlight-current-row v-loading="listLoading"  style="width: 100%;">
            <el-table-column prop="id" label="退货单号"  align='center'   show-overflow-tooltip></el-table-column>
            <el-table-column prop="orderId" label="订单编号"  align='center'   show-overflow-tooltip></el-table-column>
            <el-table-column prop="spuName" label="商品名称"  align='center'   show-overflow-tooltip></el-table-column>
            <el-table-column prop="receiverName" label="用户账号"  align='center'   show-overflow-tooltip></el-table-column>
            <el-table-column prop="orderStatus" label="申请状态"  align='center'  :formatter="formatStatus"  show-overflow-tooltip></el-table-column>
            <el-table-column prop="orderSource" label="退货来源"  align='center'  :formatter="formatSource"  show-overflow-tooltip></el-table-column>
            <el-table-column prop="createTime" label="创建时间"  align='center' sortable :formatter="createDateFormat"  show-overflow-tooltip></el-table-column>
            <el-table-column prop="updateTime" label="处理时间"  align='center' sortable :formatter="updateDateFormat"  show-overflow-tooltip></el-table-column>
            <el-table-column  fixed="right" label="操作"  align='center' width="150">
                <template slot-scope="scope">
                    <el-button @click="orderDetail(scope.$index, scope.row)" type="primary" size="mini">查看详情</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--分页显示工具条-->
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
    import util from  "@/common/js/util";
    import {getOrderConsignmentReturnList,orderConsignmentReturnCountFun} from "../../../api/api";




    export default {

        data() {

            return {
                orderStatus:-1,//订单状态
                allOrder:0,//所有订单
                completedOrder:0,//已完成订单
                stayHandleOrder:0,//待处理订单总数
                pendingDeliveryOrder:0,//待发货订单总数

                orderSourceList:[{id:1,name:"系统取消"},{id:2,name:"鉴定不通过"},{id:3,name:"客户取消"}],//品牌
                //头部搜索框
                filters: {
                    id:'',
                    orderId:'',
                    spuName:'',
                    orderSource:'',
                },
                list: [],
                total: 0,
                pageNum: 1, //当前页码
                pageSize: 10,//页数
                listLoading: false,
                labelPosition: 'right',

            }
        },
        methods: {

            createDateFormat:function(row ,column){
                if(row.createTime == undefined){
                    return ''
                }
                return  util.dateFormat("yyyy-MM-dd hh:mm:ss",new Date(row.createTime));
            },
            updateDateFormat:function(row ,column){
                if(row.updateTime == undefined){
                    return ''
                }
                return  util.dateFormat("yyyy-MM-dd hh:mm:ss",new Date(row.updateTime));
            },

            //刷新
            refresh(){
                this.allConsignmentReturnOrder();
            },

            //根据Id查询获取商品信息跳转
            orderDetail(index,row){
                this.$router.push({path: '/orderConsignmentReturn/query?id=' + row.id + '&orderId=' + row.orderId + '&orderStatus=' + row.orderStatus})
            },

            //订单来源
            formatSource: function(row, column) {
                    switch (row.orderSource) {
                        case 1:
                            return '系统取消';
                            break;
                        case 2:
                            return '鉴定不通过';
                            break;
                        default:
                            return '客户取消';
                    }
                },
            //订单状态
            formatStatus: function(row, column) {
                switch (row.orderStatus) {
                    case 10:
                        return '待处理';
                        break;
                    case 20:
                        return '退货中';
                        break;
                    case 30:
                        return '待发货';
                        break;
                    case 40:
                        return '已发货';
                        break;
                    case 50:
                        return '已完成';
                        break;
                    default:
                        return '已拒绝';
                }
            },

            //根据订单状态统计订单数量
            orderConsignmentReturnCount(){
                this.listLoading = true;
                orderConsignmentReturnCountFun().then((data) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(data)){
                            var list = data.data;

                            if (list.allOrder == null){
                               this.allOrder = 0;
                            }else {
                                this.allOrder = list.allOrder;
                            }
                            if (list.completedOrder == null){
                                this.completedOrder = 0;
                            }else {
                                this.completedOrder = list.completedOrder;
                            }
                            if (list.stayHandleOrder == null){
                                this.stayHandleOrder = 0;
                            }else {
                                this.stayHandleOrder = list.stayHandleOrder;
                            }
                            if (list.pendingDeliveryOrder == null){
                                this.pendingDeliveryOrder = 0;
                            }else {
                                this.pendingDeliveryOrder = list.pendingDeliveryOrder;
                            }
                        }
                    }
                    ,data => { this.listLoading = false;}
                );
            },

            //二次查询,所有订单
            allConsignmentReturnOrder(){
                this.orderStatus = -1;
                this.filters.id="";
                this.filters.spuName="";
                this.filters.orderId="";
                this.filters.orderSource="";
                this.searchData();
            },
            //二次查询,待处理订单
            stayHandleConsignmentReturnOrder(){
                this.orderStatus = 10;
                this.filters.id="";
                this.filters.spuName="";
                this.filters.orderId="";
                this.filters.orderSource="";
                this.searchData();
            },

            //二次查询,待发货订单
            waitSendConsignmentReturnOrder(){
                this.orderStatus = 30;
                this.filters.id="";
                this.filters.spuName="";
                this.filters.orderId="";
                this.filters.orderSource="";
                this.searchData();
            },

            //二次查询,已完成订单
            completedConsignmentReturnOrder(){
                this.orderStatus = 50;
                this.filters.id="";
                this.filters.spuName="";
                this.filters.orderId="";
                this.filters.orderSource="";
                this.searchData();
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
                this.pageNum=1;
                this.getData();
            },

            //获取列表
            getData() {
                let para = {
                    id:this.filters.id,
                    orderId:this.filters.orderId,
                    spuName:this.filters.spuName,
                    orderSource:this.filters.orderSource,
                    orderStatus:this.orderStatus,
                    pageInfo: {
                            pageNum: this.pageNum,
                            pageSize: this.pageSize,
                    }
                }
                this.listLoading = true;
                getOrderConsignmentReturnList(para).then((res) => {
                    this.listLoading = false;
                    this.total = res.data.paginationInfo.total;
                    this.list = res.data.list;
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            }

        },
        mounted() {
            this.getData();
            this.orderConsignmentReturnCount();
        }
    }

</script>


<style scoped>

</style>