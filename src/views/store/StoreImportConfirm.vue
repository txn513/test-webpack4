<template>
    <section>
        <el-col :span="24" class="toolbar" style="padding-bottom: 10px;">
            <div style="text-align:right;">
                <el-button type="primary" @click="queryAllCount" >全部({{eachStatusCount.allCount}})</el-button>
                <el-button type="primary" @click="queryWaitingCount" >待鉴定({{eachStatusCount.waitingCount}})</el-button>
                <el-button type="primary" @click="queryAlreadyCount">已鉴定({{eachStatusCount.alreadyCount}})</el-button>
                <el-button type="primary" @click="queryImportCount">已入库({{eachStatusCount.importCount}})</el-button>
            </div>
        </el-col>
        <!--工具条-->
        <el-col :span="24"  class="toolbar" style="padding-bottom: 0px;">
            <el-form ref="search" :model="search" align="right" :inline="true" class="demo-form-inline">
                <el-form-item label="鉴定单号" >
                    <el-input v-model="search.appraisal_no" size="small"  placeholder="鉴定单号"></el-input>
                </el-form-item>
                <el-form-item label="入库单号">
                    <el-input v-model="search.import_no" size="small"  placeholder="入库单号"></el-input>
                </el-form-item>
                <el-form-item label="入库时间">
                    <el-date-picker
                            v-model="search.inStorage_time"
                            type="daterange"
                            size="small"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="鉴定时间">
                    <el-date-picker
                            v-model="search.appraisal_time"
                            type="daterange"
                            size="small"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" v-on:click="searchData">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="list" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
           <!-- <el-table-column type="selection"></el-table-column>-->
            <el-table-column prop="appraisalNo" label="鉴定单号" width="150" ></el-table-column>
            <el-table-column prop="orderStatus" label="状态" :formatter="formatStatus" show-overflow-tooltip></el-table-column>
            <el-table-column prop="importNo" label="入库单号" width="150"></el-table-column>
            <el-table-column prop="articleName" label="商品名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="articleAttrs" label="商品属性" show-overflow-tooltip></el-table-column>
            <el-table-column prop="articleSpuCode" label="商品型号" show-overflow-tooltip></el-table-column>
            <el-table-column prop="qty" label="鉴定数量" show-overflow-tooltip></el-table-column>
            <el-table-column prop="appraisalResult" label="鉴定结果" :formatter="formatStatus" show-overflow-tooltip></el-table-column>
            <el-table-column prop="appraisalTime" label="鉴定时间" sortable :formatter="dateFormat" show-overflow-tooltip></el-table-column>
            <el-table-column prop="inStorageTime" label="入库时间" sortable :formatter="dateFormat" show-overflow-tooltip></el-table-column>
            <el-table-column prop="consigneeAccountName" label="收货人" show-overflow-tooltip></el-table-column>
            <el-table-column prop="appraisalAccountName" label="鉴定人" show-overflow-tooltip></el-table-column>

            <el-table-column fixed="right" label="操作" width="270">
                <template slot-scope="scope">
                    <el-button v-if="isAuth('mpys:storeimportconfirm:update') && scope.row.orderStatus == 0" type="primary"
                               size="mini"  @click="identifyFunction(scope.row)">鉴定  </el-button>
                    <el-button v-if="isAuth('mpys:storeimportconfirm:delete') && scope.row.orderStatus == 1" type="primary"
                               size="mini" @click="cancelAppraisalFunction(scope.row)">取消鉴定 </el-button>
                    <el-button v-if="isAuth('mpys:storeimportconfirm:insert') && scope.row.orderStatus == 1" type="primary"
                               size="mini"  @click="showImportStoreDialog(scope.row)">确认入库 </el-button>
                    <el-button v-if="isAuth('mpys:storeimportconfirm:view') && (scope.row.orderStatus == 1 || scope.row.orderStatus == 2)" type="primary"
                               size="mini"  @click="showDetail(scope.row)">查看  </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--弹出层-->
        <el-dialog title="鉴定" v-if="this.isDestory" style="margin-left: -500px;margin-top: -50px;width: 150%;height:120%;" @close="closeDialog"
                   :visible.sync="dialogTableVisible">
                <storeImportIdentifyDetail :toDetail="identifyId" :toDetailQty="toDetailQty" ></storeImportIdentifyDetail>
        </el-dialog>

        <!--弹出层-->
        <el-dialog title="查看" v-if="this.viewIsDestory" style="margin-left: -500px;margin-top: -50px;width: 150%;height:120%;" @close="showDetailClose"
                   :visible.sync="identifyDetailViewVisible">
            <identifyDetailView :toView="identifyId"></identifyDetailView>
        </el-dialog>

        <!--弹出层-->
        <el-dialog title="入库时间" width="300px" v-loading="confirmLoading" :visible.sync="importStoreVisible">
            <div class="block">
                <el-date-picker
                        v-model="inStorageTime"
                        type="datetime"
                        placeholder="选择日期时间">
                </el-date-picker>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="importStoreVisible = false">取消</el-button>
                <el-button type="primary" @click="confirmImportStoreFunction" >提交</el-button>
            </div>
        </el-dialog>


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
    import storeImportIdentifyDetail from './StoreImportIdentifyDetail.vue'
    import identifyDetailView from './IdentifyDetailView.vue'
    import {
        getStoreImportConfirmList,identify,cancelAppraisal,confirmImportStore,getCount,
    } from '../../api/api';

    export default {
        components:{
            storeImportIdentifyDetail,identifyDetailView
        },
        data() {
            return {
                filters: {
                    name: '',
                },
                list: [],
                total: 0,
                title: "新增",//弹出框标题
                pageNum: 1, //当前页码
                pageSize: 10,//页数
                listLoading: false,
                confirmLoading:false,
                isDestory : false,
                viewIsDestory: false,
                sels: [],//列表选中列
                formVisible: false,//编辑界面是否显示
                loading: false,
                dialogTableVisible:false,
                identifyDetailViewVisible: false,
                importStoreVisible: false,
                inStorageTime:'',
                importConfirmId:'',
                identifyId: '',
                toDetailQty:0,
                formRules: {
                    name: [
                        {required: true, message: '请输入姓名', trigger: 'blur'}
                    ]
                },
                search: {
                    appraisal_no: "",
                    import_no: "",
                    appraisal_time: [],
                    inStorage_time: [],
                    orderStatus: 3,
                },
                eachStatusCount: {
                    allCount: 0,
                    waitingCount: 0,
                    alreadyCount: 0,
                    importCount: 0,
                },
                rowId:'',
            }
        },
        methods: {
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
            queryAllCount(){
                this.search.orderStatus = 3;
                this.pageNum = 1;
                this.clearSearch();
                this.getData();
            },
            queryWaitingCount(){
                this.search.orderStatus = 0;
                this.pageNum = 1;
                this.clearSearch();
                this.getData();
            },
            queryAlreadyCount(){
                this.search.orderStatus = 1;
                this.pageNum = 1;
                this.clearSearch();
                this.getData();
            },
            queryImportCount(){
                this.search.orderStatus = 2;
                this.pageNum = 1;
                this.clearSearch();
                this.getData();
            },
            clearSearch(){
                this.search.appraisal_no = "";
                this.search.import_no =  "";
                this.search.appraisal_time = [];
                this.search.inStorage_time = [];
            },
            searchData(){
                this.pageNum = 1;
                this.getData();
            },
            //获取用户列表
            getData() {
                let para = {
                    appraisalNo: this.search.appraisal_no,
                    importNo: this.search.import_no,
                    appraisalTime: this.search.appraisal_time,
                    inStorageTime: this.search.inStorage_time,
                    orderStatus: this.search.orderStatus,
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    }
                };
                this.listLoading = true;
                getStoreImportConfirmList(para).then((res) => {
                    this.listLoading = false;
                    this.total = res.data.paginationInfo.total;
                    this.list = res.data.list;
                }, (res) => {
                    this.listLoading = false;
                }).catch(() => {
                });
            },
            getCount(){
                getCount().then((res) => {
                    this.eachStatusCount.allCount = res.data.allCount;
                    this.eachStatusCount.waitingCount = res.data.waitingCount;
                    this.eachStatusCount.alreadyCount = res.data.alreadyCount;
                    this.eachStatusCount.importCount = res.data.importCount;
                })
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            //时间格式化
            dateFormat(row, column) {
                var time = row[column.property];
                if (time == undefined || time === (-2209017600000)) {
                    return "";
                }
                var date = new Date(time);
                return util.dateFormat("yyyy-MM-dd hh:mm:ss", date);
            },
            //鉴定结果
            formatStatus(row, column) {
                var property = column.property;
                var value = row[column.property];
                if ("appraisalResult" == property){
                    switch (value){
                        case 0: return "合格";
                        case 1: return "不合格";
                        case 2: return "部分合格";
                    }
                }else if ("orderStatus" == property){
                    switch (value){
                        case 0: return "待鉴定";
                        case 1: return "已鉴定";
                        case 2: return "已入库";
                    }
                }
                return null;
            },
            identifyFunction(row) {
                //传值子组件，查询列表用
                this.dialogTableVisible = true;
                this.isDestory = true;
                this.identifyId = row["appraisalNo"];
                this.toDetailQty = row["qty"];
                this.rowId = row["id"];
            },
            closeDialog(){
                this.dialogTableVisible = false;
                this.isDestory = false;
                //关闭组件，更新鉴定信息
                let user = JSON.parse(sessionStorage.getItem('user'));
                let para = {
                    id: this.rowId,
                    appraisalAccountId: user.id,
                };
                identify(para).then((res) => {
                    this.getData();
                    this.getCount();
                });
            },
            showDetail(row){
                this.identifyDetailViewVisible = true;
                this.viewIsDestory = true;
                this.identifyId = row["appraisalNo"];
                this.rowId = row["id"];
            },
            showDetailClose(){
                this.identifyDetailViewVisible = false;
                this.viewIsDestory = false;
            },
            cancelAppraisalFunction(row){
                this.rowId = row["id"];
                let para = {
                    id: this.rowId,
                };
                cancelAppraisal(para).then((res) => {
                    if (!this.GLOBAL.isResonseSuccess(res)){
                        this.$message.error(res.message());
                        return;
                    }
                    this.getData();
                    this.getCount();
                });
            },
            showImportStoreDialog(row){
                this.importStoreVisible = true;
                this.inStorageTime = "";
                this.importConfirmId = row["id"];
            },
            confirmImportStoreFunction(){
                let para = {
                    id: this.importConfirmId,
                    inStorageTime: this.inStorageTime,
                };
                this.confirmLoading = true;
                confirmImportStore(para).then((res) => {
                    if (!this.GLOBAL.isResonseSuccess(res)){
                        this.$message.error(res.message());
                        return;
                    }
                    this.getData();
                    this.getCount();
                    this.importStoreVisible = false;
                    this.confirmLoading = false;
                });
            },
        },
        mounted() {
            this.getData();
            this.getCount();
        }
    }

</script>

<style scoped>

</style>