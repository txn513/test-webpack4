<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form align="right" :inline="true"  class="demo-form-inline">
                <el-form-item label="">
                    <el-input v-model="filters.supName" placeholder="商品名称" clearable></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-cascader :options="this.filters.type.options" clearable  placeholder="商品类型" :props="this.props"  v-model="selectedOptions" @change="handleChange"> </el-cascader>
                </el-form-item>
                <el-form-item label="">
                    <el-select v-model="filters.brand.value" clearable placeholder="品牌">
                        <el-option v-for="item in filters.brand.options" :key="item.id" :label="item.brandName" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" v-on:click="searchData()">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="list"  highlight-current-row v-loading="listLoading" style="width: 100%;">
            <el-table-column prop="storeName" label="所属仓库" show-overflow-tooltip></el-table-column>
            <el-table-column prop="skuCode" label="SKU编码" show-overflow-tooltip></el-table-column>
            <el-table-column prop="spuName" label="商品名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="className" label="类型"></el-table-column>
            <el-table-column prop="brandName" label="品牌" show-overflow-tooltip></el-table-column>
            <el-table-column prop="qualityName" label="品质"></el-table-column>
            <el-table-column prop="surplusStock" label="可用数量"></el-table-column>
            <el-table-column prop="blockedStock" label="冻结数量"></el-table-column>
            <el-table-column prop="totalStock" label="总数量"></el-table-column>

            <el-table-column fixed="right" label="操作" width="150" class-name="small-padding fixed-width" align="center">
                <template slot-scope="scope">
                    <el-button @click="handleView(scope.$index, scope.row)" type="primary" size="mini">查看</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 查看库存详情窗口 -->
        <el-dialog title="库存详情" :visible.sync="detailDialogVisible">
            <el-table height="550" highlight-current-row :data="barCodeDetails" v-loading="detailListLoading">
                <el-table-column property="barCode" label="库存条码"></el-table-column>
                <el-table-column property="available" label="状态" :formatter="formatBarcodeStatus"></el-table-column>
            </el-table>

            <el-pagination background
                           @size-change="detailHandleSizeChange"
                           @current-change="detailHandleCurrentChange"
                           :current-page="detailPageNum"
                           :page-sizes="[10, 20, 30, 40]"
                           :page-size="detailPageSize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="detailTotal" >
            </el-pagination>
        </el-dialog>

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
    import {getStoreGoodsList,storeList,getProductClassList,getProductBrandList,queryBarCodesByStoreAndSkuCode} from '../../api/api';

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
                selectedOptions:[],

                list: [],                   // 主列表相关参数
                total: 0,
                pageNum: 1,
                pageSize: 10,
                listLoading: false,

                barCodeDetails: [],         // 详情页相关参数
                detailTotal: 0,
                detailPageNum: 1,
                detailPageSize: 10,
                detailListLoading: false,
                detailDialogVisible: false,
                selectedRow: null,          // 用来接收点击查看的行记录
                selectIndex: null
            }
        },
        methods: {
            //获取库存数据列表
            getList() {
                this.listLoading = true;
                let para = {
                    brandId:this.filters.brand.value,
                    classId:this.filters.type.value,
                    spuName:this.filters.supName.trim(),
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    }
                };
                getStoreGoodsList(para).then((res) => {
                    this.listLoading = false;
                    this.total = res.data.paginationInfo.total;
                    this.list = res.data.list;
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },

            // 点击查询按钮
            searchData() {
                this.pageNum = 1;
                this.getList();
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

            // 获取库存数据详情列表
            handleView(index,row) {
                this.selectedRow = row;         // 绑定行记录，便于详情页分页查询
                this.selectIndex = index;
                this.detailDialogVisible = true;
                this.detailListLoading = true;
                let para = {
                    storeCode: row.storeCode,
                    skuCode: row.skuCode,
                    pageInfo: {
                        pageNum: this.detailPageNum,
                        pageSize: this.detailPageSize
                    }
                };
                queryBarCodesByStoreAndSkuCode(para).then((res) => {
                    this.detailListLoading = false;
                    this.detailTotal = res.data.paginationInfo.total;
                    this.barCodeDetails = res.data.list;
                }).catch(err => {
                    this.detailListLoading = false;
                    this.barCodeDetails = null;
                    var errMsg = err.response.data.message;
                    this.$message({showClose: true, message: errMsg, type: 'error'});
                });
            },
            // 详情页切换页数
            detailHandleCurrentChange(val) {
                this.detailPageNum = val;
                this.handleView(this.selectIndex,this.selectedRow);
            },
            // 详情页处理分页条数
            detailHandleSizeChange(val) {
                this.detailPageSize = val;
                this.handleView(this.selectIndex,this.selectedRow);
            },

            initStore: function (){
                storeList().then((res) => {
                    this.filters.store.options = res.data;
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },

            // 初始化商品类型下拉
            initProductClass:function(){
                getProductClassList().then((res) => {
                    this.filters.type.options = res.data;
                }).catch(err => {
                    this.listLoading = false;
                    var errMsg = err.response.data.message;
                    this.$message({showClose: true, message: '初始化商品类型下拉错误:' + errMsg, type: 'error'});
                });
            },

            // 初始化商品品牌下拉
            initProductBrandList:function(){
                getProductBrandList().then((res) => {
                    this.filters.brand.options = res.data;
                }).catch(err => {
                    this.listLoading = false;
                    var errMsg = err.response.data.message;
                    this.$message({showClose: true, message: '初始化商品品牌下拉错误:' + errMsg, type: 'error'});
                });
            },

            handleChange:function(){
                this.filters.type.value = this.selectedOptions[this.selectedOptions.length-1];
            },

            //性别显示转换
            formatBarcodeStatus: function (row, column) {
                return row.available === true ? '可用' : row.available === false ? '停用' : '未知状态';
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