<template>
    <section>
        <!-- 出库单状态工具条 -->
        <el-col :span="24" class="toolbar" style="padding-bottom: 10px;">
            <div style="text-align:right;">
                <el-button type="primary" @click="queryAllStatus" >全部({{eachStatusCount.allCount}})</el-button>
                <el-button type="primary" @click="queryPending()">待处理({{eachStatusCount.pendingCount}})</el-button>
                <el-button type="primary" @click="queryPicking()">拣货中({{eachStatusCount.pickingCount}})</el-button>
                <el-button type="primary" @click="queryReCheck()">复核完成({{eachStatusCount.reCheckCount}})</el-button>
                <el-button type="primary" @click="queryShipped()">已发运({{eachStatusCount.shippedCount}})</el-button>
                <el-button type="primary" @click="queryClosed()">已关闭({{eachStatusCount.closedCount}})</el-button>
            </div>
        </el-col>

        <!-- 列表筛选工具条 -->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form align="right" :inline="true"  class="demo-form-inline">
                <span>订单号：</span>
                <el-input size="medium" v-model="filterParams.expNo" placeholder="输入订单号或出库单号" style="width:250px;" clearable></el-input>

                <span>出库类型：</span>
                <el-form-item>
                    <el-select v-model="filterParams.expType" placeholder="请选择出库类型">
                        <el-option v-for="item in expTypeConst" :key="item.key" :label="item.value" :value="item.key"></el-option>
                    </el-select>
                </el-form-item>

                <span>创建时间：</span>
                <el-date-picker
                        v-model="filterParams.createTime"
                        type="daterange"
                        start-placeholder="创建开始日期"
                        end-placeholder="创建结束日期"
                        :default-time="['00:00:00', '23:59:59']">
                </el-date-picker>
                <span>发货时间：</span>
                <el-date-picker
                        v-model="filterParams.deliveryTime"
                        type="daterange"
                        start-placeholder="发货开始日期"
                        end-placeholder="发货结束日期"
                        :default-time="['00:00:00', '23:59:59']">
                </el-date-picker>
                <el-button type="primary" v-on:click="searchData()" :loading="listLoading" >查询</el-button>
            </el-form>
        </el-col>

        <!-- 列表展示 -->
        <el-table :data="exportOrderMains" stripe style="width: 100%">
            <el-table-column sortable prop="expNo" label="出库单号" width="150px" show-overflow-tooltip></el-table-column>
            <el-table-column sortable prop="sourceNo" label="来源订单号" width="220px" show-overflow-tooltip></el-table-column>
            <el-table-column prop="expType" label="出库类型" :formatter="parseExpType" show-overflow-tooltip></el-table-column>
            <el-table-column prop="orderStatus" label="状态" :formatter="parseOrderStatus" show-overflow-tooltip></el-table-column>
            <el-table-column prop="deliveryType" label="配送方式" :formatter="parseDeliveryType" show-overflow-tooltip></el-table-column>
            <el-table-column prop="logisticsCompany" label="物流公司" show-overflow-tooltip></el-table-column>
            <el-table-column prop="consigneeName" label="收件人" show-overflow-tooltip></el-table-column>
            <el-table-column prop="consigneeAddress" label="收件人地址" show-overflow-tooltip></el-table-column>
            <el-table-column prop="consigneePhone" label="收件人电话" show-overflow-tooltip></el-table-column>
            <el-table-column prop="logisticsQueryNo" label="物流单号" show-overflow-tooltip></el-table-column>
            <el-table-column prop="storeName" label="所属仓库" show-overflow-tooltip></el-table-column>
            <el-table-column sortable prop="deliveryTime" label="发货时间" width="155px" show-overflow-tooltip :formatter="formatDate"></el-table-column>
            <el-table-column sortable prop="createTime" label="创建时间" width="155px" show-overflow-tooltip :formatter="formatDate"></el-table-column>

            <el-table-column fixed="right" label="操作" width="150" class-name="small-padding fixed-width" align="left">
                <template slot-scope="scope">
                    <el-button @click="storeExportDetail(scope.$index, scope.row)" type="primary" size="mini">查看</el-button>
                    <el-button v-if="scope.row.orderStatus == 30" @click="close(scope.row)" type="primary" size="mini">关闭</el-button>
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
                :total="total" style="float: right;">
        </el-pagination>
    </section>
</template>

<script>
    import util from '../../../common/js/util'
    import {queryStoreExportMains,countEachOrderStatus,closeStoreExportOrder} from '../../../api/api';
    import moment from 'moment';
    import parse from './ParseTypeFun'

    export default {
        data() {
            return {
                exportOrderMains: [],    // 表格数据--出库单列表
                listLoading: false,
                total: 0,       // 总记录数
                pageNum: 1,     // 当前页码
                pageSize: 10,    // 分页size
                expTypeConst,   // 出库类型下拉值
                filterParams: { // 筛选查询的参数
                    expType: null,
                    expNo: null,
                    orderStatus: null,
                    createTime: null,
                    deliveryTime: null
                },
                eachStatusCount: { // 统计每种出库单状态的数量
                    allCount: 0,
                    pendingCount: 0,
                    pickingCount: 0,
                    reCheckCount: 0,
                    shippedCount: 0,
                    closedCount: 0
                }
            }
        },
        methods: {
            // 查询出库单主表信息
            queryStoreExportMains() {
                // 创建时间
                var createBeginTime = null;
                var createEndTime = null;
                var createTime = this.filterParams.createTime;
                if(createTime != null){
                    createBeginTime = createTime[0];
                    createEndTime = createTime[1];
                }

                // 发货时间
                var deliveryBeginTime = null;
                var deliveryEndTime = null;
                var deliveryTime = this.filterParams.deliveryTime;
                if(deliveryTime != null){
                    deliveryBeginTime = deliveryTime[0];
                    deliveryEndTime = deliveryTime[1];
                }

                let param = {
                    expNo: this.filterParams.expNo === '' ? null : this.filterParams.expNo,
                    expType: this.filterParams.expType,
                    orderStatus: this.filterParams.orderStatus,
                    createBeginTime: createBeginTime,
                    createEndTime: createEndTime,
                    deliveryBeginTime: deliveryBeginTime,
                    deliveryEndTime: deliveryEndTime,
                    orderField: 'create_time',
                    sortType: 'desc',
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    }
                };
                this.listLoading = true;
                queryStoreExportMains(param).then(
                    res => {
                        this.listLoading = false;
                        if(res.code === 1) {    // 请求成功
                            this.total = res.data.paginationInfo.total;
                            this.exportOrderMains = res.data.list;
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
                this.queryStoreExportMains();
            },

            // 统计每种出库单状态的数量
            countEachOrderStatus() {
                countEachOrderStatus().then(
                    res => {
                        if(res.code === 1) {    // 请求成功
                            this.eachStatusCount.allCount = res.data.allCount;
                            this.eachStatusCount.pendingCount = res.data.pendingCount;
                            this.eachStatusCount.pickingCount = res.data.pickingCount;
                            this.eachStatusCount.reCheckCount = res.data.reCheckCount;
                            this.eachStatusCount.shippedCount = res.data.shippedCount;
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
                closeStoreExportOrder(row.expNo).then(
                    res => {
                        //debugger
                        if(res.code === 1) {    // 关闭成功
                            this.$message({showClose: true, message: res.message, type: 'success'});
                            this.queryStoreExportMains();
                            this.countEachOrderStatus();
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
                this.pageNum = val;
                this.queryStoreExportMains();
            },
            // 处理分页条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.queryStoreExportMains();
            },

            // 状态组合查询 -- 全部
            queryAllStatus(){
                this.pageNum = 1;
                this.filterParams.orderStatus = null;
                initFilterParams(this);             // 清空筛选栏条件
                this.queryStoreExportMains();
            },
            // 状态组合查询 -- 待处理
            queryPending(){
                this.pageNum = 1;
                this.filterParams.orderStatus = 0;
                initFilterParams(this);             // 清空筛选栏条件
                this.queryStoreExportMains();
            },
            // 状态组合查询 -- 拣货中
            queryPicking(){
                this.pageNum = 1;
                this.filterParams.orderStatus = 10;
                initFilterParams(this);             // 清空筛选栏条件
                this.queryStoreExportMains();
            },
            // 状态组合查询 -- 复核完成
            queryReCheck(){
                this.pageNum = 1;
                this.filterParams.orderStatus = 20;
                initFilterParams(this);             // 清空筛选栏条件
                this.queryStoreExportMains();
            },
            // 状态组合查询 -- 已发运
            queryShipped(){
                this.pageNum = 1;
                this.filterParams.orderStatus = 30;
                initFilterParams(this);             // 清空筛选栏条件
                this.queryStoreExportMains();
            },
            // 状态组合查询 -- 已关闭
            queryClosed(){
                this.pageNum = 1;
                this.filterParams.orderStatus = 50;
                initFilterParams(this);             // 清空筛选栏条件
                this.queryStoreExportMains();
            },

            // 查看出库单详情
            storeExportDetail(index,row){
                this.$router.push({path: '/storeExportDetail/list',query:{expNo:row.expNo}});   // 携带出库单号
            },

            // 时间格式化:YYYY-MM-DD HH:mm:ss
            formatDate(row, column, cellValue) {
                if(cellValue === null || cellValue === undefined || cellValue === (-2209017600000)){
                    return '';
                }
                return moment(cellValue).format('YYYY-MM-DD HH:mm:ss');
            },

            // 解析出库类型
            parseExpType(row, column, cellValue) {
                return parse.parseExpTypeFun(cellValue);
            },

            // 解析订单状态
            parseOrderStatus(row, column, cellValue) {
                return parse.parseOrderStatusFun(cellValue);
            },

            // 解析配送方式
            parseDeliveryType(row, column, cellValue) {
                return parse.parseDeliveryTypeFun(cellValue);
            }
        },
        mounted() {
            this.queryStoreExportMains();
            this.countEachOrderStatus();
        }
    }

    //出库类型下拉选项
    const expTypeConst = [
        { key: null, value: '全部' },
        { key: 0, value: '销售出库' },
        { key: 1, value: '调拨出库' },
        { key: 2, value: '采购退回' },
        { key: 3, value: '寄卖退回' }
    ]

    // 初始化清空筛选栏条件
    function initFilterParams(vm) {
        vm.filterParams.expNo = null;
        vm.filterParams.expType = null;
        vm.filterParams.createTime = null;
        vm.filterParams.deliveryTime = null;
    }

</script>

<style scoped>

</style>