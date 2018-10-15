<template>
    <section>
        <el-col :span="24"  class="toolbar" style="padding-bottom: 0px;">
            <div style="text-align:right;">
                <el-button v-if="isShowDelete" type="primary" @click="identifyOver" >鉴定完成</el-button>
                <el-button v-if="isShowDelete" type="primary" @click="add">新增</el-button>
            </div>
        </el-col>
        <!--列表-->
        <el-table :data="list"  height="650" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;margin-bottom: 10px">
            <el-table-column prop="appraisalNo" label="鉴定单号" width="150"></el-table-column>
            <el-table-column prop="articleName" label="商品名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="articleAttrs" label="商品属性" show-overflow-tooltip></el-table-column>
            <el-table-column prop="articleSpuCode" label="商品型号" show-overflow-tooltip></el-table-column>
            <el-table-column prop="qty" label="鉴定数量" show-overflow-tooltip>
                <template  slot-scope="scope">
                    <el-input :disabled="isDisable" v-model="scope.row.qty" ></el-input>
                </template>
            </el-table-column>
            <el-table-column prop="appraisalResultsFlag" label="鉴定结果" show-overflow-tooltip>
                    <template  slot-scope="scope">
                        <el-select :disabled="isDisable" v-model="scope.row.appraisalResultsFlag" placeholder="请选择" @change="selectGetAppraisalResulat($event,scope.$index)">
                            <el-option :key="0" :value="0" label="合格"></el-option>
                            <el-option :key="1" :value="1" label="不合格"></el-option>
                        </el-select>
                    </template>
            </el-table-column>
            <el-table-column prop="appraisalQtyName" label="鉴定品质" show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-select :disabled="scope.row.appraisalResultsFlag == '1' || isDisable == true" v-model="scope.row.appraisalQtyName" placeholder="请选择" @change="selectGetQuality($event,scope.$index)">
                        <el-option v-for="item in appraisalQty" :key="item.qualityId" :label="item.qualityName" :value="item.qualityName"   > </el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column prop="injureSiteName" label="损伤部位" show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-select :disabled="scope.row.appraisalQtyName == '全新' || scope.row.appraisalResultsFlag == '1' || isDisable == true"
                               v-model="scope.row.injureSiteName" placeholder="请选择" @change="selectGetInjureSite($event,scope.$index)">
                        <el-option v-for="item in injureSite" :key="item.id" :label="item.damageName" :value="item.damageName"> </el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column prop="price" label="鉴定价格"  show-overflow-tooltip>
                <template  slot-scope="scope">
                    <el-input :disabled="scope.row.appraisalResultsFlag == '1' || isDisable == true"
                              v-model="scope.row.price" :formatter="formatPrice"></el-input>
                </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" width="160" show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-input type="textarea" :row="2" :disabled="scope.row.appraisalQtyName == '全新' || scope.row.appraisalResultsFlag == '1' || isDisable == true"
                              v-model="scope.row.remark"></el-input>
                </template>
            </el-table-column>

            <el-table-column fixed="right" label="操作" width="200">
                <template slot-scope="scope">
                    <el-button type="primary"  size="mini" v-if="isShowInventoryBarcode" @click="showInventoryBarcode(scope.$index, scope.row)">查看条码</el-button>
                    <el-button type="primary"  size="mini" v-if="isShowDelete" @click="del(scope.$index, scope.row)">删除</el-button>
                    <el-button v-if="isShowInventoryBarcode" type="primary"  size="mini" @click="printBarcode(scope.row)">打印条码</el-button>
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

    </section>
</template>

<script>
    import {
        toStoreImportIdentifyDetailList,
        qualityList,
        damageListByClassId,
        identifyOver,
        getDetailBaseData,
        getInventoryBarcodeList,
        getStoreImportIdentifyDetailAllList,
        getBillUrl
    } from '../../api/api';

    export default {
        props: ['toDetail','toDetailQty'],
        data() {
            return {
                list: [],
                listLoading: false,
                sels: [],//列表选中列
                loading: false,
                //鉴定品质
                appraisalQty: [],
                //损伤部位
                injureSite: [],
                isDisable: false,
                isShowInventoryBarcode : false,
                isShowDelete : true,
                dialogVisible:false,
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

            //获取用户列表
            getData() {
                let para = {
                    appraisalNo : this.toDetail
                };
                this.listLoading = true;
                toStoreImportIdentifyDetailList(para).then((res) => {
                    this.listLoading = false;
                    this.list = res.data;
                    //将鉴定单号记录
                    this.appraisalNo = this.list[0].appraisalNo;
                    qualityList(para).then((res) => {
                        if (!this.GLOBAL.isResonseSuccess(res)){
                            this.$message.error(res.message());
                            return;
                        }
                        this.appraisalQty = res.data;
                    });
                    let  idDto = {
                        id : this.list[0].articleClassId
                    };
                    damageListByClassId(idDto).then((res) => {
                        if (!this.GLOBAL.isResonseSuccess(res)){
                            this.$message.error(res.message());
                            return;
                        }
                        this.injureSite = res.data;
                    });
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },

            selsChange(sels) {
                this.sels = sels;
            },
            selectGetAppraisalResulat(name,index){
                if (name == 1){

                    this.list[index].appraisalQtyId = '';
                    this.list[index].appraisalQtyName = '';
                    this.list[index].appraisalQtyLabel = '';
                    this.list[index].injureSiteId = '';
                    this.list[index].injureSiteName = '';
                    this.list[index].remark = '';
                    this.list[index].price = '';
                }
            },
            selectGetQuality(name,index){
                let chooseItem = this.appraisalQty.find((item)=>{
                  return item.qualityName == name;
                })
                this.list[index].appraisalQtyId = chooseItem.id;
                this.list[index].appraisalQtyName = chooseItem.qualityName;
                this.list[index].appraisalQtyLabel = chooseItem.qualityLabel;
                if (name == "全新"){
                    this.list[index].injureSiteId = '';
                    this.list[index].injureSiteName = '';
                    this.list[index].remark = '';
                    this.list[index].price = '';
                }
            },
            selectGetInjureSite(name, index){
                let chooseItem = this.injureSite.find((item)=>{
                    return item.damageName == name;
                })
                this.list[index].injureSiteId = chooseItem.id;
                this.list[index].injureSiteName = chooseItem.damageName;
            },
            //鉴定完成
            identifyOver(){
                if(this.list.length==0){
                    this.$message.error('请先新增商品');
                    return;
                }
                let currentQty  = 0;
               //循环判断数组校验
                for (let item of this.list) {
                    if(!Number(item.qty)){
                        this.$message.error('鉴定数量必须大于0');
                        return;
                    }else{
                        if(Number(item.qty) <= 0){
                            this.$message.error('鉴定数量必须大于0');
                            return ;
                        }else if(!/^\d+$/.test(item.qty)){
                            this.$message.error('鉴定价格不能为小数');
                            return ;
                        }
                        currentQty = Number(currentQty) + Number(item.qty);
                    }
                    if(item.appraisalResultsFlag == null){
                        this.$message.error('请选择鉴定结果');
                        return;
                    }
                    //当选择不合格的时候
                    if(item.appraisalResultsFlag == 1){
                    }else{

                        if(item.appraisalQtyName == null ){
                            this.$message.error('合格应选择鉴定品质');
                            return;
                        } else if(item.appraisalQtyName == "全新" ){
                            if(!Number(item.price)){
                                this.$message.error('鉴定价格必须大于0');
                                return;
                            }else{
                                if(Number(item.price) <= 0){
                                    this.$message.error('鉴定价格必须大于0');
                                    return ;
                                }
                            }
                        }else{
                        //合格不全新损失部位鉴定价格都不能为空
                            if(item.injureSiteName == null){
                                this.$message.error('合格应选择损伤部位');
                                return;
                            }
                            if(!Number(item.price)){
                                this.$message.error('鉴定价格必须大于0');
                                return;
                            }else{
                                if(Number(item.price) <= 0){
                                    this.$message.error('鉴定价格必须大于0');
                                    return ;
                                }
                            }
                            if(!item.remark){
                                this.$message.error('合格应输入备注');
                                return;
                            }
                        }
                    }
                }
                if (!(this.toDetailQty == currentQty)){
                    this.$message.error('总鉴定数量应该与鉴定单数量相等');
                    return;
                }
                this.isShowDelete = false;
                this.listLoading = true;
                //后台
                identifyOver(this.list).then((res) => {
                    if (this.GLOBAL.isResonseSuccess(res)){
                        this.$message.success('鉴定完成');
                    }else{
                        this.isShowDelete = true;
                        this.listLoading = false;
                        this.$message.error(res.message());
                    }
                    this.isDisable = true;
                    this.listLoading = false;
                    this.isShowInventoryBarcode = true;
                    let para = {
                        appraisalNo : this.toDetail
                    };
                    getStoreImportIdentifyDetailAllList(para).then((res) => {
                        this.list = res.data;
                    });
                });
            },
            add(){
                let para = {
                    appraisalNo : this.appraisalNo
                }
                getDetailBaseData(para).then((res)=>{
                    this.list.push(res.data);
                })
            },
            //删除某一行
            del(index,row){
                this.list.splice(index, 1);
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
            printBarcode(row){
                getBillUrl("/storeImportIdentifyDetail/printBarcode?id=" + row["id"]);
            },
            supplyPrintBarcode(row){
                getBillUrl("/storeImportIdentifyDetail/supplyPrintBarcode?identifyDetailId=" + row["identifyDetailId"] + "&inventoryBarcode=" + row["inventoryBarcode"]);
            },
            formatPrice(row, column, cellValue) {
                if(cellValue == 0 || cellValue === undefined ){
                    return '';
                }
                return cellValue
            },
        },
        mounted() {
            this.getData();
        }
    }

</script>

<style scoped>

</style>