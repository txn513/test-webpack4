<template>
    <section>
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <div style="text-align:right;">
                <el-button v-if="isAuth(CON_PRIVILEGE.VIEW)"  type="primary" @click="orderStatusQuery(CON_STATUS.SUCCESS)" >全部订单({{allCount}})</el-button>
                <el-button v-if="isAuth(CON_PRIVILEGE.VIEW)" type="primary" @click="orderStatusQuery(CON_STATUS.SELLING)" >寄卖中({{selling}})</el-button>
                <el-button v-if="isAuth(CON_PRIVILEGE.VIEW)" type="primary" @click="orderStatusQuery(CON_STATUS.SELLING_FINISH)">已完成({{sellingFinish}})</el-button>
            </div>
        </el-col>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form ref="filters" :model="filters"  align="right" :inline="true"  class="demo-form-inline">
                时间
                <el-date-picker
                        v-model="filters.dateTime"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                </el-date-picker>

                <el-form-item label="订单号">
                    <el-input v-model="filters.id" placeholder="" clearable></el-input>
                </el-form-item>
                <el-form-item label="商品名" prop="orderSource">
                    <el-input v-model="filters.spuName" placeholder="" clearable></el-input>
                </el-form-item>
                <el-form-item >
                    <el-button v-if="isAuth(CON_PRIVILEGE.VIEW)" type="primary" v-on:click="handleCurrentChange(1)">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button  v-if="isAuth(CON_PRIVILEGE.INSERT)" type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="list"  highlight-current-row v-loading="listLoading"  style="width: 100%;">
            <el-table-column prop="id" label="订单编号"   sortable  show-overflow-tooltip></el-table-column>
            <el-table-column prop="createTime" label="创建时间"   sortable  :formatter="dateFormat"  show-overflow-tooltip></el-table-column>
            <el-table-column prop="spuName" label="商品名"   sortable    show-overflow-tooltip></el-table-column>
            <el-table-column prop="consignerName" label="寄卖用户"   sortable  show-overflow-tooltip></el-table-column>
            <el-table-column prop="orderStatus" label="订单状态"   sortable  :formatter="formatStatus"  show-overflow-tooltip></el-table-column>
            <el-table-column prop="storeName" label="仓库"   sortable    show-overflow-tooltip></el-table-column>

            <el-table-column   fixed="right" label="操作" width="200"   show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-button v-if="isAuth(CON_PRIVILEGE.VIEW)" type="primary"  size="mini" @click="handleDetail(scope)">查看详细</el-button>
                </template>
            </el-table-column>
        </el-table>

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
    import OrderUtil from '../../../common/js/OrderUtil';
    import {getConsignmentOrderList,getConsignmentOrderCount} from "../../../api/api";

    // 导入组件
    export default {
        data: function () {
            return {
                //统计数目
                allCount:0,
                waitOperation:0,
                waitSend:0,
                waitCheck:0,
                sellingChangePrice:0,
                selling:0,
                sellingFinish:0,
                waitReturn:0,
                returnFinish:0,
                //寄卖订单状态枚举常量
                CON_STATUS : OrderUtil.data().CON_STATUS,
                CON_PRIVILEGE:OrderUtil.data().CON_PRIVILEGE,
                //是否是订单状态查询,如果是查询条件清空,后查询
                isOrderStatus: false,
                queryOrderStatus: 0,

                filters: {
                    spuName: '',
                    id: '',
                    dateTime:[]
                },
                // 列表数据
                list: [],
                pageNum: 1, //当前页码
                pageSize: 10,//页数
                listLoading: false,
                total: 0,


            }
        },
        methods: {
            orderStatusQuery: function(status){
                this.isOrderStatus =true;
                this.queryOrderStatus = status;
                this.pageNum=1;
                this.getData();
            },
            //时间格式化
            dateFormat: function (row, column) {
                return OrderUtil.commonDateFormat(row, column);
            },
            formatStatus: function (row, column) {
                return OrderUtil.formatStatus(row, column);
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
            //获取列表
            getData() {
                let para={};
                if(this.isOrderStatus){
                    para = {
                        orderStatus: this.queryOrderStatus,
                    };
                    //清空查询条件
                    this.filters= { spuName: '',id: '',dateTime:[] }
                }else {
                     para = {
                        startTime: this.filters.dateTime==null?null:this.filters.dateTime[0],
                        endTime: this.filters.dateTime==null?null:this.filters.dateTime[1],
                        id: this.filters.id,
                        spuName: this.filters.spuName,
                        pageInfo: {
                            pageNum: this.pageNum,
                            pageSize: this.pageSize,
                        },
                         //TODO 状态需不需要添加
                         orderStatus: this.queryOrderStatus
                    };
                }
                console.log(para);
                this.listLoading = true;
                getConsignmentOrderList(para).then((res) => {
                    this.listLoading = false;
                    console.log(res);
                    OrderUtil.handleResult(res,()=>{
                        this.total = res.data.paginationInfo.total;
                        this.list = res.data.list;
                        this.isOrderStatus=false;
                    },undefined,false);

                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },
            //统计订单数量
            getOrderCount(){
                this.listLoading = true;
                getConsignmentOrderCount().then((data) => {
                        this.listLoading = false;
                        OrderUtil.handleResult(data,()=>{
                            var list = data.data;
                            this.allCount = (list.allCount==null?0:list.allCount);
                            this.sellingFinish = (list.sellingFinish==null?0:list.sellingFinish);
                            this.selling = (list.selling==null?0:list.selling);
                        },undefined,false);

                    }
                    ,data => { this.listLoading = false;}
                );
            },
            //查看详情
            handleDetail: function(scope) {
                console.log(this);
                switch (scope.row.orderStatus) {
                    case 10:
                        // return '待处理';
                        this.$router.push({path: '/conOrderDetailWaitOperation?id='+scope.row.id});
                        break;
                    case 20:
                        this.$router.push({path: '/conOrderDetailWaitSend?id='+scope.row.id});
                        break;
                    // return '待确认寄送';
                    case 50:
                        this.$router.push({path: '/conOrderDetailSelling?id='+scope.row.id});
                        break;
                    case 60:
                        this.$router.push({path: '/conOrderDetailSellingFinish?id='+scope.row.id});
                        break;
                    default:
                        this.$router.push({path: '/consignmentOrderDetail?id='+scope.row.id});
                }
            },
            //添加显示 ----------add
            handleAdd: function () {
                this.$router.push({path: '/consignmentOrderAdd'});
            },

            xxxxx: function (xx) {
                console.log(xx );
            },
        },

        created() {
            this.getData();
            this.getOrderCount();

        }
    }

</script>

<style scoped>

</style>