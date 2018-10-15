<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">

            <el-form align="right" :inline="true"  class="demo-form-inline">
                <el-form-item label="物流单号">
                    <el-input v-model="filters.logisticsNumber" placeholder="物流单号"></el-input>
                </el-form-item>
                <el-form-item label="订单号">
                    <el-input v-model="filters.orderNumber" placeholder="订单号"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" v-on:click="searchData">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="trackList" stripe border  highlight-current-row v-loading="listLoading" style="width: 100%;">
            <el-table-column prop="logisticsNumber" label="物流单号" show-overflow-tooltip  width="180"></el-table-column>
            <el-table-column prop="orderNumber" label="订单号" show-overflow-tooltip  width="250"></el-table-column>
            <el-table-column prop="logisticsCompany" label="物流公司" show-overflow-tooltip></el-table-column>
            <el-table-column prop="logisticsState" label="物流状态" sortable :formatter="formatState"></el-table-column>
            <el-table-column prop="logisticsInformation" label="物流信息" show-overflow-tooltip></el-table-column>
            <el-table-column prop="recordTime" label="物流记录时间" show-overflow-tooltip sortable :formatter="dateFormat"></el-table-column>
            <el-table-column prop="logisticsTime" label="物流耗时" sortable :formatter="formatLogisticsTime"></el-table-column>
            <el-table-column prop="orderTime" label="订单耗时" sortable :formatter="formatOrderTime"></el-table-column>
            <el-table-column  fixed="right" label="操作" width="100">
                <template slot-scope="scope">
                    <el-button type="primary"  size="mini" @click="handleView(scope.$index, scope.row)">查看</el-button>
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
    import {getLogisticsTrackList} from '../../api/api';
    import moment from 'moment';

    export default {
        data() {
            return {
                filters: {
                    logisticsNumber: '',
                    orderNumber:''
                },
                trackList: [],
                total: 0,
                pageNum: 1, //当前页码
                pageSize: 10,//页数
                listLoading: false
            }
        },
        methods: {
            //状态显示转换
            formatState: function (row, column) {
                return row.logisticsState === 2 ? '在途中' : row.logisticsState === 3 ? '已签收' : '森特尔洗护配送';
            },
            //物流当前时间格式化
            dateFormat:function(row, column) {
                var dateTime = row[column.property];
                if (!dateTime) {
                    return "";
                }
                return util.formatDate.format(new Date(dateTime), 'yyyy-MM-dd hh:mm:ss');
            },
            //计算物流耗时
            formatLogisticsTime:function(row, column) {
                var dateTime = row.logisticsTime;
                if (!dateTime) {
                    return "";
                }
                else{
                    if(row.logisticsState === 3){
                        var currTime = row.recordTime;
                        var hours = (moment(currTime).valueOf() - moment(dateTime).valueOf()) / 3600000;
                        return util.moneyFormat(hours, 1);
                    }
                    else{
                        var currTime = new Date().getTime();
                        var hours = (currTime - moment(dateTime).valueOf()) / 3600000;
                        return util.moneyFormat(hours, 1);
                    }
                }
            },
            //计算订单耗时
            formatOrderTime:function(row, column) {
                var dateTime = row.orderTime;
                if (!dateTime) {
                    return "";
                }
                else{
                    if(row.logisticsState === 3){
                        var currTime = row.recordTime;
                        var hours = (moment(currTime).valueOf() - moment(dateTime).valueOf()) / 3600000;
                        return util.moneyFormat(hours, 1);
                    }
                    else{
                        var currTime = new Date().getTime();
                        var hours = (currTime - moment(dateTime).valueOf()) / 3600000;
                        return util.moneyFormat(hours, 1);
                    }
                }
            },

            //获取物流信息列表
            getLogisticsTrack() {
                let para = {
                    logisticsNumber: this.filters.logisticsNumber,
                    orderNumber: this.filters.orderNumber,
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    }
                };
                this.listLoading = true;
                getLogisticsTrackList(para).then((res) => {
                    this.listLoading = false;
                    this.total = res.data.paginationInfo.total;
                    this.trackList = res.data.list;
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },
            //点击查询
            searchData() {
                this.pageNum = 1;
                this.getLogisticsTrack();
            },
            //切换页数
            handleCurrentChange(val) {
                this.pageNum = val;
                this.getLogisticsTrack();
            },
            //处理分页条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.getLogisticsTrack();
            },
            //查看
            handleView(index,row){
                this.$router.push({path:'/logisticsTrack/query?logisticsNumber='+row.logisticsNumber+'&orderNumber='+row.orderNumber});
            }

        },
        mounted() {
            this.getLogisticsTrack();

        }
    }

</script>

<style scoped>

</style>