<template>
    <section>
        <!-- 标签 -->
        <el-col class="toolbar">
            <el-button type="primary" v-on:click="getList(filters.ALL)">全部({{count.total_count}})</el-button>
            <el-button type="primary" v-on:click="getList(filters.PROCESSED)">待处理({{count.processed_count}})</el-button>
            <el-button type="primary" v-on:click="getList(filters.OUT_STORE)">待出库({{count.out_store_count}})</el-button>
            <el-button type="primary" v-on:click="getList(filters.CONFIRMED)">已确认({{count.confirmed_count}})</el-button>
            <el-button type="primary" v-on:click="getList(filters.DISTRIBUTION)">配送中({{count.distribution_count}})</el-button>
            <el-button type="primary" v-on:click="getList(filters.IN_STORE)">待入库({{count.in_store_count}})</el-button>
            <el-button type="primary" v-on:click="getList(filters.WAREHOUSING)">已入库({{count.warehousing_count}})</el-button>
        </el-col>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-form align="right" :inline="true"  class="demo-form-inline">
                <el-form-item label="">
                    <el-input v-model="transferStockId" placeholder="调拨单号"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <template slot-scope="scope">
                        <el-select v-model="outStore.value"  placeholder="调出仓库" @change="outStoreChange" clearable>
                              <el-option v-for="item in outStore.options" :key="item.storeNo" :label="item.storeName" :value="item.storeNo"></el-option>
                        </el-select>
                    </template>
                </el-form-item>
                <el-form-item label="">
                    <template slot-scope="scope">
                        <el-select v-model="inStore.value"  placeholder="调入仓库" @change="inStoreChange" clearable>
                              <el-option v-for="item in inStore.options" :key="item.storeNo" :label="item.storeName" :value="item.storeNo"></el-option>
                        </el-select>
                    </template>
                </el-form-item>
                <el-form-item label="">
                    <el-date-picker v-model="dateTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" v-on:click="getList">查询</el-button>
                </el-form-item>
                <el-button type="primary" v-on:click="toAdd">新增</el-button>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="list"  highlight-current-row  v-loading="listLoading" style="width: 100%;">
            <el-table-column prop="transferStockId" label="调拨单号" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="outStoreName" label="调出仓库" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="inStoreName" label="调入仓库" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="status" label="状态" :formatter="formatStatus" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="payType" label="支付方式" :formatter="formatPayType" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="applicantName" label="申请人" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="createTime" label="申请时间"   :formatter="dateFormat" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="sex" label="操作" sortable >
                <template slot-scope="scope">
                     <el-button type="primary" size="mini" @click="toView(scope.$index,scope.row)">查看</el-button>
                     <el-button v-if="scope.row.status==0" type="primary" size="mini" @click="del(scope.$index,scope.row)">删除</el-button>
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
    import util from '../../common/js/util'
    import {getTransferList,storeList,delTransfer} from '../../api/api';

    export default {
        data() {
            return {
                filters:{
                    TOTAL:"all",
                    PROCESSED:0,
                    OUT_STORE:10,
                    CONFIRMED:20,
                    DISTRIBUTION:30,
                    IN_STORE:40,
                    WAREHOUSING:50
                },
                transferStockId:'',
                outStore:{
                    options: [],
                    value:''
                },
                inStore:{
                    options: [],
                    value:''
                },
                count:{
                    confirmed_count : 0,
                    distribution_count : 0,
                    in_store_count : 0,
                    out_store_count : 0,
                    processed_count : 0,
                    total_count : 0,
                    warehousing_count : 0
                },
                dateTime:"",
                list: [],
                total: 0,
                pageNum: 1, //当前页码
                pageSize: 10,//页数
                listLoading: false
            }
        },
        methods: {
            //状态显示转换
            formatStatus: function (row, column) {
                switch(row.status){
                    case 0:
                        return "待处理";
                    case 10:
                        return "待出库";
                    case 20:
                        return "已确认";
                    case 30:
                        return "配送中";
                    case 40:
                        return "待入库";
                    case 50:
                        return "已入库";
                    default:
                        return "未知状态";
                }
            },
            //支付方式显示转换
            formatPayType: function (row, column) {
                switch(row.payType){
                    case 2:
                        return "月结";
                    case 4:
                        return "到付";
                    case 6:
                        return "寄付";
                    case 8:
                        return "转三方支付";
                    default:
                        return "未知状态";
                }
            },dateFormat:function(row, column) {
                var dateTime = row[column.property];
                if (!dateTime) {
                    return "";
                }
                return util.formatDate.format(new Date(dateTime), 'yyyy-MM-dd hh:mm:ss');
            },
            //切换页数
            handleCurrentChange(val) {
                this.pageNum = val;
                this.getList();
            },
            //处理分页条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.getList();
            },
            //获取数据列表
            getList(status) {
                this.listLoading = true;
                let para = {
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    }
                };
                if("undefined" != typeof status && status >= 0){
                    para = Object.assign({ status:status, },para);
                    if(status == "all") delete para.status;
                }else{
                    para = Object.assign({
                       outStore:this.outStore.value,
                       inStore:this.inStore.value,
                       dateTime:this.dateTime,
                       transferStockId:this.transferStockId.trim()
                    },para);
                }
                getTransferList(para).then((res) => {
                    this.listLoading = false;
                    this.list = res.data.list;
                    this.count = res.data.count;
                    this.total = res.data.paginationInfo.total;
                }).catch(err => {
                    var errMsg = err.response.data.message;
                    this.$message({showClose: true, message: errMsg, type: 'error'});
                });
            },
            toView: function (index,row){
                this.$router.push({path:'/transferView', query:{id:row.id}});
            },
            del: function (index,row){
                this.$confirm('确认删除该记录吗?', '提示', { type: 'warning' }).then(() => {
                    this.listLoading = true;
                    let para = {
                        id:row.transferStockId
                    }
                    delTransfer(para).then((res) => {
                        this.listLoading = false;
                        if (res.code==1) {
                            this.$message({ message: '删除成功', type: 'success' });
                            this.getList();
                        }
                    }).catch(err => {
                        var errMsg = err.response.data.message;
                        this.$message({showClose: true, message: errMsg, type: 'error'});
                    });
                }).catch(() => {});
            },
            initStore: function (){
                 storeList().then((res) => {
                    this.inStore.options = res.data;
                    this.outStore.options = res.data;
                 }).catch(err => {
                     var errMsg = err.response.data.message;
                     this.$message({showClose: true, message: errMsg, type: 'error'});
                 });
            },
            toAdd: function (){
                 this.$router.push({path: '/addTransfer'});
            },
            inStoreChange:function(){
                if(this.inStore.value != "" && this.outStore.value == this.inStore.value){
                    this.$message({ message: '调入库不能与调出仓一致，请重新选择', type: 'warning' });
                    this.inStore.value = "";
                }
            },
            outStoreChange:function(){
                if(this.outStore.value != "" && this.outStore.value == this.inStore.value){
                    this.$message({ message: '调出库不能与调入仓一致，请重新选择', type: 'warning' });
                    this.outStore.value = "";
                }
            }
        },
        mounted() {
            this.initStore();
            this.getList();
        }
    }
</script>