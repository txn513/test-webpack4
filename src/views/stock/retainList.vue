<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;margin-bottom: 0px;">
            <el-form align="right" :inline="true"  class="demo-form-inline">

                <el-form-item label="">
                     <el-select v-model="filters.store.value" placeholder="请选择仓库" clearable style="width:130px">
                        <el-option v-for="item in filters.store.options" :key="item.storeNo" :label="item.storeName" :value="item.storeNo"></el-option>
                      </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-input v-model="filters.spuName" placeholder="商品名称" style="width:130px"></el-input>
                </el-form-item>
                <el-form-item label="">
                     <el-cascader :options="this.filters.type.options" clearable :props="this.props"  v-model="selectedOptions" @change="handleChange" style="width:130px"> </el-cascader>
                </el-form-item>
                <el-form-item label="">
                     <el-select v-model="filters.brand.value" clearable placeholder="品牌" style="width:130px">
                        <el-option v-for="item in filters.brand.options" :key="item.id" :label="item.brandName" :value="item.id">
                        </el-option>
                      </el-select>
                </el-form-item>

                <el-form-item label="">
                    <el-date-picker v-model="filters.dateTime" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"  value-format="yyyy-MM-dd HH:mm:ss" style="width:360px"></el-date-picker>
                </el-form-item>
                <el-form-item label="">
                    <el-input v-model="filters.startDay" type="number" min="0" max="999999" placeholder="最小留存时间" style="width:130px"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-input v-model="filters.endDay"  type="number"  min="0" max="999999" placeholder="最大留存时间" style="width:130px"></el-input>
                </el-form-item>

                <!--工具条--><el-button type="primary" v-on:click="getList(1)">查询</el-button>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="list"  highlight-current-row v-loading="listLoading" style="width: 100%;">
            <el-table-column prop="storeName" label="仓库" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="spuName" label="商品名称" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="className" label="类型" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="brandName" label="品牌" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="inStorageTime" label="入库日期" :formatter="dateFormat" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="retainDay" label="留存时长(天)" sortable ></el-table-column>
        </el-table>
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

    import util from '../../common/js/util'
    import {getStockRetainList, storeList,getProductClassList,getProductBrandList} from '../../api/api';

    export default {
        data() {
            return {
                filters: {
                    spuName:'',
                    store:{
                        options: [],
                        value: ''
                    },
                    type:{
                        options: [],
                        value: ''
                    },
                    brand:{
                        options: [],
                        value: ''
                    },
                    dateTime:[],
                    startDay:'',
                    endDay:''
                },
                props:{
                    label:"name",
                    value:"id"
                },
                selectedOptions:[],
                list: [],
                total: 0,
                pageNum: 1, //当前页码
                pageSize: 10,//页数
                listLoading: false
            }
        },
        methods: {
            dateFormat:function(row, column) {
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
            //获取商品列表
            getList(pageNum) {
                this.pageNum = pageNum || this.pageNum;
                this.listLoading = true;
                let para = {
                    storeCode:this.filters.store.value,
                    brandId:this.filters.brand.value,
                    classId:this.filters.type.value,
                    spuName:this.filters.spuName.trim(),
                    startDate:(this.filters.dateTime && this.filters.dateTime.length > 0)?this.filters.dateTime[0]:'',
                    endDate:(this.filters.dateTime && this.filters.dateTime.length > 0)?this.filters.dateTime[1]:'',
                    startDay:this.filters.startDay,
                    endDay:this.filters.endDay,
                    pageInfo: {
                        pageNum:  this.pageNum,
                        pageSize: this.pageSize,
                    }
                };
                getStockRetainList(para).then((res) => {
                    this.listLoading = false;
                    this.list = res.data.list;
                    this.total = res.data.paginationInfo.total;
                }).catch(err => {
                    var errMsg = err.response.data.message;
                    this.$message({showClose: true, message: errMsg, type: 'error'});
                });
            },
            initStore: function (){
                 storeList().then((res) => {
                    this.filters.store.options = res.data;
                 }).catch(err => {
                     var errMsg = err.response.data.message;
                     this.$message({showClose: true, message: errMsg, type: 'error'});
                 });
            },
            initProductClass:function(){
                 getProductClassList().then((res) => {
                    this.filters.type.options = res.data;
                 }).catch(err => {
                     var errMsg = err.response.data.message;
                     this.$message({showClose: true, message: errMsg, type: 'error'});
                 });
            },
            initProductBrandList:function(){
                 getProductBrandList().then((res) => {
                    this.filters.brand.options = res.data;
                 }).catch(err => {
                     var errMsg = err.response.data.message;
                     this.$message({showClose: true, message: errMsg, type: 'error'});
                 });
            },
            handleChange:function(){
               this.filters.type.value = this.selectedOptions[this.selectedOptions.length-1];
            }
        },
        mounted() {
            this.initStore();
            this.initProductClass();
            this.initProductBrandList();
            this.getList();
        }
    }
</script>