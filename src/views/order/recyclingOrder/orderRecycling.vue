<template>
    <section>
        <!--搜索查询工具条-->
        <el-col :span="24" class="toolbar">
            <el-form :model="filters"  align="right" :inline="true" >
                <el-form-item>
                    <el-button  type="primary" @click="allRecyclingOrder()" >全部订单({{allOrder}})</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button  type="primary" @click="completedRecyclingOrder()">已完成({{completed}})</el-button>
                </el-form-item>
                <el-form-item label="订单号">
                    <el-input v-model="filters.id" placeholder="请输入订单号"></el-input>
                </el-form-item>
                <el-form-item label="创建时间" >
                    <el-date-picker type="date" v-model="filters.createTime"  placeholder="请输入创建时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="商品名称" >
                    <el-input v-model="filters.spuName" placeholder="请输入商品名称"></el-input>
                </el-form-item>
                <el-form-item >
                    <el-button type="primary" v-on:click="searchData">查询</el-button>
                </el-form-item>
                <el-button  type="primary" @click="handleAdd" >新增</el-button>
            </el-form>
        </el-col>

        <!--回收订单列表-->
        <el-table :data="list" stripe   v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
             <el-table-column prop="id" label="订单编号"  align='center'  show-overflow-tooltip></el-table-column>
             <el-table-column prop="createTime" label="创建时间"   align='center' sortable  :formatter="dateFormat"  show-overflow-tooltip></el-table-column>
             <el-table-column prop="spuName" label="商品名称"   align='center'   show-overflow-tooltip></el-table-column>
             <el-table-column prop="consignerName" label="回收用户"   align='center'   show-overflow-tooltip></el-table-column>
             <el-table-column prop="orderStatus" label="订单状态"  align='center'  :formatter="formatStatus"  show-overflow-tooltip></el-table-column>
             <el-table-column prop="storeName" label="仓库"  align='center'    show-overflow-tooltip></el-table-column>
             <el-table-column  fixed="right" label="操作"  align='center' width="150"    show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-button @click="orderDetail(scope)" type="primary" size="mini">查看详情</el-button>
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
    import {getOrderRecyclingList,orderRecyclingCountFun} from "../../../api/api";
    export default {

        data() {
            return {
                orderStatus:-1,//订单状态
                allOrder:0,//所有订单
                completed:0,//已完成订单
                /*stayPaymentOrder:0,//待付款
                stayHandleOrder:0,//待处理
                stayConfirmSendOrder:0,//待确认寄送
                stayAppraisalOrder:0,//待鉴定
                stayConfirmofferOrder:0,//待确认报价
                stayPaymentOrder:0,//待付款
                closed:0,//已关闭*/
                //头部搜索框
                filters: {
                    id:'',
                    spuName:'',
                    createTime:'',
                },
                brandList:[{id:1,brandName:"b1"},{id:2,brandName:"b2"}],//品牌
                classList:[],//类型
                qualityList:[{id:1,qualityName:"q1"},{id:2,qualityName:"q2"}],//质量
                list: [],
                total: 0,
                title:"新增回收订单",//弹出框标题
                pageNum: 1, //当前页码
                pageSize: 10,//页数
                listLoading: false,
                labelPosition: 'right',
                sels: [],//列表选中列

                addFormVisible:false,//新增回收订单
                addLoading: false,
                Time:'',

            }
        },
        methods: {

            dateFormat:function(row ,column){
                if(row.createTime == undefined){
                      return ''
                }
                return  util.dateFormat("yyyy-MM-dd hh:mm:ss",new Date(row.createTime));
            },

            //刷新
            refresh(){
                this.allRecyclingOrder();
            },

            //根据订单状态统计订单数量
            orderRecyclingCount(){
                this.listLoading = true;
                orderRecyclingCountFun().then((data) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(data)){
                            var list = data.data;
                            this.allOrder = list.allOrder;
                            this.completed = list.completed;
                        }
                    }
                    ,data => { this.listLoading = false;}
                );
            },



            //二次查询,所有订单
            allRecyclingOrder(){
                this.orderStatus = -1;
                this.filters.id="";
                this.filters.spuName="";
                this.filters.createTime="";
                this.searchData();
            },
            //二次查询,已完成订单
            completedRecyclingOrder(){
                this.orderStatus = 60;
                this.filters.id="";
                this.filters.spuName="";
                this.filters.createTime="";
                this.searchData();
            },
            //根据Id查询获取商品信息跳转
            orderDetail(scope){

                this.$router.push({path:'/orderRecycling/query?id='+scope.row.id+'&orderStatus='+scope.row.orderStatus})
           },
            //添加显示 ----------add
            handleAdd: function () {
                this.$router.push({path: '/recyclingOrderAdd'});
            },

            //订单状态
            formatStatus: function(row, column) {
                switch (row.orderStatus) {
                    case 10:
                        return '待处理';
                        break;
                    case 20:
                        return '待确认寄送';
                        break;
                    case 30:
                        return '待鉴定';
                        break;
                    case 40:
                        return '待确认报价';
                        break;
                    case 50:
                        return '待付款';
                        break;
                    case 60:
                        return '已完成';
                        break;
                    default:
                        return '已关闭';
                }

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

            //列表选中
            selsChange: function (sels) {
                this.sels = sels;
            },

            //获取列表
            getData() {

                let para = {
                    id:this.filters.id,
                    createTime:this.filters.createTime,
                    spuName:this.filters.spuName,
                    orderStatus:this.orderStatus,
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    }
                };
                this.listLoading = true;
                getOrderRecyclingList(para).then((res) => {
                    this.listLoading = false;
                    this.total = res.data.paginationInfo.total;
                    this.list = res.data.list;
                    if(this.createTime === ""||this.createTime === null){
                        delete para.createTime;
                    }

                }, (res) => { this.listLoading = false; } ).catch(() => {});
            }
        },
        mounted() {
            this.getData();
            this.orderRecyclingCount()
        }
    }

</script>

<style scoped>

</style>