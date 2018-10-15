<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form align="right" :inline="true"  class="demo-form-inline">
                <el-form-item label="">
                     <el-select v-model="filters.cityList.value" clearable placeholder="请选择">
                        <el-option v-for="item in filters.cityList.options" :key="item" :label="item" :value="item"></el-option>
                     </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" v-on:click="getList(1)">查询</el-button>
                    <el-button type="primary" v-on:click="sendMsg()">发送</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="list"   highlight-current-row v-loading="listLoading" style="width: 100%;"  @selection-change="selsChange">
            <el-table-column type="selection" >
            </el-table-column>
            <el-table-column prop="nickName" label="昵称" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="phone" label="电话号码" sortable show-overflow-tooltip></el-table-column>
        </el-table>
        <!--工具条-->
        <el-col :span="24" style="margin-top: 10px">
            <el-pagination background
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
    import {getMsgCityList,sendMsg,getMsgUserList} from '../../api/api';

    export default {
        data() {
            return {
                filters: {
                    cityList:{
                        options: [],
                        value: ''
                    }
                },
                list: [],
                ids:[],
                total: 0,
                pageNum: 1, //当前页码
                pageSize: 10,//页数
                listLoading: false
            }
        },
        methods: {
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
            getList(pageNum) {
                this.listLoading = true;
                this.pageNum = pageNum || this.pageNum;
                let para = {
                    cityName:this.filters.cityList.value,
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    }
                };
                getMsgUserList(para).then((res) => {
                    this.listLoading = false;
                    this.total = res.data.paginationInfo.total;
                    this.list = res.data.list;
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },
            selsChange: function (sels) {
                var ids = [];
                sels.forEach(function(data){
                    ids.push(data.id);
                })
                this.ids = ids;
            },
            sendMsg(){
                if(this.ids == [] || this.ids.length ==0){
                    this.$message({message: '请选择推送用户', type: 'warning'});
                    return;
                }
                let para = {
                    ids:this.ids,
                    templateId:0
                }
                sendMsg(para).then((res) => {
                    if (res.code == 1) {
                        this.$message({message: '推送成功', type: 'success'});
                        this.getList();
                    } else {
                        this.$message({message: res.message, type: 'warning'});
                    }
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },
            initCityList: function (){
                getMsgCityList().then((res) => {
                    this.filters.cityList.options = res.data;
                 }, (res) => { this.listLoading = false; } ).catch(() => {});
            }
        },
        mounted() {
            this.initCityList();
            this.getList();
        }
    }
</script>