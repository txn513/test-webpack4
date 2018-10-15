<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form align="right" :inline="true"  class="demo-form-inline">
                <el-form-item label="活动名称">
                    <el-input v-model="filters.activityName"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" v-on:click="searchData">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="activityList" stripe border  highlight-current-row v-loading="listLoading" style="width: 100%;">
            <el-table-column type="index" label="序号" align="center" width="60"></el-table-column>
            <el-table-column prop="activityName" label="活动名称" show-overflow-tooltip width="180"></el-table-column>
            <el-table-column prop="startTime" label="活动开始时间" show-overflow-tooltip :formatter="dateFormat"></el-table-column>
            <el-table-column prop="endTime" label="活动结束时间" show-overflow-tooltip :formatter="dateFormat"></el-table-column>
            <el-table-column prop="couponAmount" label="优惠券总量" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="couponUseCount" label="优惠券使用量" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="couponUse" label="优惠券使用率" show-overflow-tooltip></el-table-column>
            <el-table-column prop="couponRebackCount" label="优惠券退回量" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="couponReback" label="退回率" show-overflow-tooltip></el-table-column>
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
    import {getActivityCountList} from '../../api/api';
    import moment from 'moment';

    export default {
        data() {
            return {
                filters: {
                    activityName: ''
                },
                activityList: [],
                total: 0,
                pageNum: 1, //当前页码
                pageSize: 10,//页数
                listLoading: false
            }
        },
        methods: {
            //时间格式化
            dateFormat:function(row, column) {
                var dateTime = row[column.property];
                if (!dateTime) {
                    return "";
                }
                return util.formatDate.format(new Date(dateTime), 'yyyy-MM-dd hh:mm:ss');
            },

            //获取统计数据列表
            getActivityList() {
                let para = {
                    activityName: this.filters.activityName.trim(),
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    }
                };
                this.listLoading = true;
                getActivityCountList(para).then((res) => {
                    this.listLoading = false;
                    this.total = res.data.paginationInfo.total;
                    this.activityList = res.data.list;
                    for(var i=0; i< this.activityList.length; i++){
                        if (this.activityList[i].couponAmount != null && this.activityList[i].couponAmount != 0) {
                            this.activityList[i].couponUse = parseFloat(this.activityList[i].couponUseCount / this.activityList[i].couponAmount * 100).toFixed(2) + "%";
                            this.activityList[i].couponReback = parseFloat(this.activityList[i].couponRebackCount / this.activityList[i].couponAmount * 100).toFixed(2) + "%";
                        }
                        else {
                            this.activityList[i].couponUse = 0 + "%";
                            this.activityList[i].couponReback = 0 + "%";
                        }
                    }
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },
            //点击查询
            searchData() {
                this.pageNum = 1;
                this.getActivityList();
            },
            //切换页数
            handleCurrentChange(val) {
                this.pageNum = val;
                this.getActivityList();
            },
            //处理分页条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.getActivityList();
            }

        },
        mounted() {
            this.getActivityList();
        }
    }

</script>

<style scoped>

</style>