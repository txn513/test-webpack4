7<template>
    <section>
        <!-- 入库单状态工具条 -->
        <el-col :span="24" class="toolbar" style="padding-bottom: 10px;">
            <div style="text-align:right;">
                <el-button type="primary" @click="queryAllStatus" >全部({{eachStatusCount.allCount}})</el-button>
                <el-button type="primary" @click="queryWait()">待收货({{eachStatusCount.waitingCount}})</el-button>
                <el-button type="primary" @click="queryPart()">部分收货({{eachStatusCount.partCount}})</el-button>
                <el-button type="primary" @click="queryAll()">完全收货({{eachStatusCount.completeCount}})</el-button>
                <el-button type="primary" @click="queryCancle()">已取消({{eachStatusCount.canceledCount}})</el-button>
                <el-button type="primary" @click="queryClosed()">已关闭({{eachStatusCount.closedCount}})</el-button>
            </div>
        </el-col>

        <!-- 列表筛选工具条 -->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form align="right" :inline="true"  class="demo-form-inline">
                <span>订单号：</span>
                <el-input size="medium" v-model="filterParams.sourceNo" placeholder="输入订单号" style="width:250px;" clearable filterable></el-input>

                <span>入库类型：</span>
                <el-form-item>
                    <el-select v-model="filterParams.importType" placeholder="请选择入库类型" clearable filterable>
                        <el-option v-for="item in importTypeConst" :key="item.id" :label="item.value" :value="item.key"></el-option>
                    </el-select>
                </el-form-item>

                <span>订单来源：</span>
                <el-form-item>
                    <el-select v-model="filterParams.orderSource" placeholder="请选择订单来源" clearable filterable>
                        <el-option v-for="item in orderSourceConst" :key="item.id" :label="item.value" :value="item.key"></el-option>
                    </el-select>
                </el-form-item>

                <span>日期：</span>
                <el-date-picker
                        v-model="filterParams.createTime"
                        type="daterange"
                        start-placeholder="创建开始日期"
                        end-placeholder="创建结束日期"
                        :default-time="['00:00:00', '23:59:59']">
                </el-date-picker>

                <el-button type="primary"  v-on:click="searchData()" :loading="listLoading" >查询</el-button>
            </el-form>
        </el-col>

        <!-- 列表展示 -->
        <el-table :data="importOrderMains" stripe style="width: 100%">
            <el-table-column sortable prop="importNo" label="入库单号" show-overflow-tooltip></el-table-column>
            <el-table-column sortable prop="sourceNo" label="来源订单号" show-overflow-tooltip></el-table-column>
            <el-table-column prop="importType" label="入库类型" :formatter="parseImpType"></el-table-column>
            <el-table-column prop="orderStatus" label="状态" :formatter="parseOrderStatus"></el-table-column>
            <el-table-column prop="orderSource" label="订单来源" :formatter="parseOrderSourse"></el-table-column>
            <el-table-column prop="logisticsCompany" label="物流公司" show-overflow-tooltip></el-table-column>
            <el-table-column prop="logisticsQueryNo" label="物流单号" show-overflow-tooltip></el-table-column>
            <el-table-column prop="storeName" label="所属仓库"></el-table-column>
            <el-table-column sortable prop="createTime" label="创建时间" show-overflow-tooltip :formatter="formatDate"></el-table-column>

            <el-table-column fixed="right" label="操作" width="250" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.orderStatus != 40"@click="storeImportDetail(scope.$index, scope.row)" type="primary" size="mini">签收</el-button>
                    <el-button @click="storeImportDetail(scope.$index, scope.row,'1')" type="primary"  size="mini">查看</el-button>
                    <el-button v-if="scope.row.orderStatus == 20" @click="close(scope.row)"  type="primary"  size="mini">关闭</el-button>
                </template>
            </el-table-column>

        </el-table>
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
    </section>
</template>

<script>
     import util from '../../common/js/util'
     import {queryStoreImportMains ,countEachImOrderStatus ,closeImportOrder} from '../../api/api';
     import parse from './export/ParseTypeFun'
     import moment from 'moment';
    export default {
        data() {
            return {
                importOrderMains: [],    // 表格数据--出库单列表
                listLoading: false,
                total: 0,       // 总记录数
                pageNum: 1,     // 当前页码
                pageSize: 10,    // 分页size
                importTypeConst,   // 出库类型下拉值
                orderSourceConst, //订单来源下拉
                filterParams: { // 筛选查询的参数
                    sourceNo: null,
                    importType: null,
                    orderSource: null,
                    orderStatus: null,
                    createTime: null,
                },
                eachStatusCount: { // 统计每种出库单状态的数量
                    allCount: 0,
                    waitingCount: 0,
                    partCount: 0,
                    completeCount: 0,
                    canceledCount: 0,
                    closedCount: 0
                }
            }
        },
        methods: {
            // 查询入库单主表信息
            queryStoreImportMains(){
                // 创建时间
                var createBeginTime = null;
                var createEndTime = null;
                var createTime = this.filterParams.createTime;
                if(createTime != null){
                    createBeginTime = createTime[0];
                    createEndTime = createTime[1];
                }

                let param = {
                    sourceNo: this.filterParams.sourceNo === '' ? null : this.filterParams.sourceNo,
                    importType: this.filterParams.importType,
                    orderSource: this.filterParams.orderSource,
                    orderStatus: this.filterParams.orderStatus,
                    createBeginTime: createBeginTime,
                    createEndTime: createEndTime,
                    orderField: 'create_time',
                    sortType: 'desc',
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    }
                };
                this.listLoading = true;
                queryStoreImportMains(param).then(
                    res => {
                        this.listLoading = false;
                        if(res.code === 1) {    // 请求成功
                            this.total = res.data.paginationInfo.total;
                            this.importOrderMains = res.data.list;
                        }
                    } ).catch(err => {
                    this.listLoading = false;
                    var errMsg = err.response.data.message;
                    this.$message({showClose: true, message: errMsg, type: 'error'});
                });
            },
            // 点击查询按钮
            searchData() {
                this.pageNum = 1;
                this.queryStoreImportMains();
            },

            // 统计每种入库单状态的数量
            countEachImOrderStatus() {
                countEachImOrderStatus().then(
                    res => {
                        if(res.code === 1) {    // 请求成功
                            this.eachStatusCount.allCount = res.data.allCount;
                            this.eachStatusCount.waitingCount = res.data.waitingCount;
                            this.eachStatusCount.partCount = res.data.partCount;
                            this.eachStatusCount.completeCount = res.data.completeCount;
                            this.eachStatusCount.canceledCount = res.data.canceledCount;
                            this.eachStatusCount.closedCount = res.data.closedCount;
                        }else{
                            this.$message({showClose: true, message: res.message, type: 'error'});
                        }
                    }).catch(err => {
                    var errMsg = err.response.data.message;
                    this.$message({showClose: true, message: errMsg, type: 'error'});
                });
            },

            // 点击关闭
            close(row){
                let param = {
                    importNo: row.importNo
                }
             closeImportOrder(param).then(
                    res => {
                        //debugger
                        if(res.code === 1) {    // 关闭成功
                            this.$message({showClose: true, message: res.message, type: 'success'});
                            this.queryStoreImportMains();
                            //this.queryStoreImportMains();
                        }else{
                            this.$message({showClose: true, message: res.message, type: 'error'});
                        }
                    }).catch(err => {
                    var errMsg = err.response.data.message;
                    this.$message({showClose: true, message: errMsg, type: 'error'});
                });
            },

            // 切换页数
            handleCurrentChange(val) {
                //debugger
                this.pageNum = val;
                this.queryStoreImportMains();
            },
            // 处理分页条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.queryStoreImportMains();
            },

            // 状态组合查询 -- 全部
            queryAllStatus(){
                this.filterParams.orderStatus = null;
                 initFilterParams(this);             // 清空筛选栏条件
                this.queryStoreImportMains();
            },
            // 状态组合查询 -- 待收货
            queryWait(){
                //debugger
                this.filterParams.orderStatus = 0;
                initFilterParams(this);             // 清空筛选栏条件
                this.queryStoreImportMains();
            },
            // 状态组合查询 -- 部分收货
            queryPart(){
                this.filterParams.orderStatus = 10;
                initFilterParams(this);             // 清空筛选栏条件
                this.queryStoreImportMains();
            },
            // 状态组合查询 -- 完全收货
            queryAll(){
                this.filterParams.orderStatus = 20;
                initFilterParams(this);             // 清空筛选栏条件
                this.queryStoreImportMains();
            },
            // 状态组合查询 -- 已取消
            queryCancle(){
                this.filterParams.orderStatus = 30;
                initFilterParams(this);             // 清空筛选栏条件
                this.queryStoreImportMains();
            },
            // 状态组合查询 -- 已关闭
            queryClosed(){
                this.filterParams.orderStatus = 40;
                initFilterParams(this);             // 清空筛选栏条件
                this.queryStoreImportMains();
            },

            // 查看(签收)入库单详情
            storeImportDetail(index,row,flag){
                if(flag){
                    //说明是查看
                    this.$router.push({path: '/storeImportDetail/list',query:{importNo:row.importNo,flag:'look'}});   // 携带入库单号
                    return;
                }
                this.$router.push({path: '/storeImportDetail/list',query:{importNo:row.importNo}});   // 携带入库单号
            },

            // 时间格式化:YYYY-MM-DD HH:mm:ss
            formatDate(row, column, cellValue) {
                if(cellValue === null || cellValue === undefined || cellValue === (-2209017600000)){
                    return '';
                }
                return moment(cellValue).format('YYYY-MM-DD HH:mm:ss');
            },

            // 解析入库类型
            parseImpType(row, column, cellValue) {
                return parse.parseImOrderStypeFun(cellValue);
            },

            // 解析订单状态
            parseOrderStatus(row, column, cellValue) {
                return parse.parseImOrderStatusFun(cellValue);
            },

            // 解析订单来源
            parseOrderSourse(row, column, cellValue) {
                return parse.parseOrderSourseFun(cellValue);
            }
        },
        mounted() {
            this.queryStoreImportMains();
            this.countEachImOrderStatus();
        }
    }

    //入库类型下拉选项
    const importTypeConst = [
        { key: null, value: '全部' },
        { key: 0, value: '采购入库' },
        { key: 1, value: '调拨入库' },
        { key: 2, value: '退货入库' },
        { key: 3, value: '回收入库' },
        { key: 4, value: '寄卖入库' }
    ]

    //订单来源下拉选项
    const orderSourceConst = [
        { key: null, value: '全部' },
        { key: 1, value: '京东' },
        { key: 2, value: '淘宝' },
        { key: 3, value: '门店' }
    ]


    // 初始化清空筛选栏条件
  function initFilterParams(vm) {
        vm.filterParams.sourceNo = null;
        vm.filterParams.importType = null;
        vm.filterParams.orderSource = null;
        vm.filterParams.createTime = null;
   }

</script>

<style scoped>

</style>