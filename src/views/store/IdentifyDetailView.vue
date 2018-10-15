<template>
    <section>
        <!--列表-->
        <el-table :data="list" height="500"  highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;margin-bottom: 10px">
            <el-table-column prop="appraisalNo" label="鉴定单号"  width="150"></el-table-column>
            <el-table-column prop="articleName" label="商品名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="articleAttrs" label="商品属性" show-overflow-tooltip></el-table-column>
            <el-table-column prop="articleSpuCode" label="商品型号" show-overflow-tooltip></el-table-column>
            <el-table-column prop="qty" label="鉴定数量" show-overflow-tooltip></el-table-column>
            <el-table-column prop="appraisalResultsFlag" label="鉴定结果" :formatter="formatStatus" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="appraisalQtyName" label="鉴定品质" show-overflow-tooltip></el-table-column>
            <el-table-column prop="injureSiteName" label="损伤部位" show-overflow-tooltip></el-table-column>
            <el-table-column prop="price" label="鉴定价格" show-overflow-tooltip :formatter="formatPrice"></el-table-column>
            <el-table-column prop="remark" label="备注" show-overflow-tooltip> </el-table-column>
            <el-table-column fixed="right" label="操作" width="250">
                <template slot-scope="scope">
                    <el-button type="primary"  size="mini" @click="showInventoryBarcode(scope.$index, scope.row)">查看条码</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--弹出层-->
        <el-dialog title="库存条码" :visible.sync="detailDialogVisible"  width="40%" :append-to-body=true>
            <el-table :data="inventoryBarcodeList"  height="620" highlight-current-row v-loading="detailListLoading"
                      style="width: 100%;margin-bottom: 10px">
                <el-table-column prop="inventoryBarcode" label="库存条码"  ></el-table-column>
                <el-table-column fixed="right" label="操作">
                    <template slot-scope="scope">
                        <el-button size="small" type="primary" @click="supplyPrintBarcode(scope.row)">补打条码</el-button>
                    </template>
                </el-table-column>
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
        <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageNum"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total" style="float: right;margin-top: -10px">
        </el-pagination>

    </section>
</template>

<script>
    import {getStoreImportIdentifyDetailList,getInventoryBarcodeList,getBillUrl} from '../../api/api';

    export default {
        props: ['toView'],
        data() {
            return {
                list: [],
                total: 0,
                pageNum: 1, //当前页码
                pageSize: 5,//页数
                listLoading: false,
                sels: [],//列表选中列
                loading: false,
                isDestory : false,
                dialogVisible:false,
                formRules: {
                    name: [
                        {required: true, message: '请输入姓名', trigger: 'blur'}
                    ]
                },
                inventoryBarcodeList: [],
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

            //获取用户列表
            getData() {
                let para = {
                    appraisalNo : this.toView,
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    }
                };
                this.listLoading = true;
                getStoreImportIdentifyDetailList(para).then((res) => {
                    this.listLoading = false;
                    this.total = res.data.paginationInfo.total;
                    this.list = res.data.list;
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },

            selsChange: function (sels) {
                this.sels = sels;
            },

            formatStatus: function (row, column) {
                var property = column.property;
                var value = row[column.property];
                if("appraisalResultsFlag" == property) {
                    switch (value){
                        case 0: return "合格";
                        case 1: return "不合格";
                    }
                }
                return null;
            },
            showInventoryBarcode(index, row){
                this.detailPageNum = 1;
                this.getInventoryBarcode(index, row);
            },
            getInventoryBarcode(index, row) {
                // 绑定行记录，便于详情页分页查询
                this.selectedRow = row;
                this.selectIndex = index;
                this.detailDialogVisible = true;
                this.detailListLoading = true;
                let para = {
                    identifyDetailId : row["id"],
                    pageInfo: {
                        pageNum: this.detailPageNum,
                        pageSize: this.detailPageSize
                    }
                }
                getInventoryBarcodeList(para).then((res) => {
                    this.detailListLoading = false;
                    this.detailTotal = res.data.paginationInfo.total;
                    this.inventoryBarcodeList = res.data.list;
                }).catch(err => {
                    this.detailListLoading = false;
                    this.inventoryBarcodeList = null;
                    var errMsg = err.response.data.message;
                    this.$message({showClose: true, message: errMsg, type: 'error'});
                });
                this.isDestory = false;
            },
            // 详情页切换页数
            detailHandleCurrentChange(val) {
                this.detailPageNum = val;
                this.getInventoryBarcode(this.selectIndex,this.selectedRow);
            },
            // 详情页处理分页条数
            detailHandleSizeChange(val) {
                this.detailPageSize = val;
                this.getInventoryBarcode(this.selectIndex,this.selectedRow);
            },
            formatPrice(row, column, cellValue) {
                if(cellValue == 0 || cellValue === undefined ){
                    return '';
                }
                return cellValue
            },
            supplyPrintBarcode(row){
                getBillUrl("/storeImportIdentifyDetail/supplyPrintBarcode?identifyDetailId=" + row["identifyDetailId"] + "&inventoryBarcode=" + row["inventoryBarcode"]);
            },
        },
        mounted() {
            this.getData();
        }
    }

</script>

<style scoped>

</style>