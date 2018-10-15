<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form align="right" :inline="true"  class="demo-form-inline">
                <el-form-item label="">
                     <el-select v-model="filters.store.value" clearable placeholder="请选择">
                        <el-option v-for="item in filters.store.options" :key="item.storeNo" :label="item.storeName" :value="item.storeNo"></el-option>
                     </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-input v-model="filters.supName" placeholder="商品名称"></el-input>
                </el-form-item>
                <el-form-item label="">
                     <el-cascader :options="this.filters.type.options" clearable :props="this.props"  v-model="selectedOptions" @change="handleChange"> </el-cascader>
                </el-form-item>
                <el-form-item label="">
                     <el-select v-model="filters.brand.value" clearable placeholder="品牌">
                        <el-option v-for="item in filters.brand.options" :key="item.id" :label="item.brandName" :value="item.id">
                        </el-option>
                      </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" v-on:click="getList(1)">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="list"   highlight-current-row v-loading="listLoading" style="width: 100%;">
            <el-table-column prop="storeName" label="仓库" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="skuCode" label="SKU" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="spuName" label="商品名称" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="className" label="类型" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="brandName" label="品牌" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="qualityName" label="品质" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="surplusStock" label="可用数量" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="blockedStock" label="冻结数量" sortable show-overflow-tooltip></el-table-column>
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
    import {getStockList,storeList,getProductClassList,getProductBrandList} from '../../api/api';

    export default {
        data() {
            return {
                filters: {
                    supName: '',
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
                    }
                },
                props:{
                    label:"name",
                    value:"id"
                },
                list: [],
                selectedOptions:[],
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
                    storeCode:this.filters.store.value,
                    brandId:this.filters.brand.value,
                    classId:this.filters.type.value,
                    spuName:this.filters.supName.trim(),
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    }
                };
                getStockList(para).then((res) => {
                    this.listLoading = false;
                    this.total = res.data.paginationInfo.total;
                    this.list = res.data.list;
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