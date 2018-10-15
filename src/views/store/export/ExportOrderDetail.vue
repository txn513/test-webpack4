<template>
  <section>
    <!--<el-form ref="form" v-loading="viewLoading" label-width="80px" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">-->
      <el-form ref="form"  label-width="80px" @submit.prevent="onSubmit" style="margin:20px;">
      <!-- 状态操作工具条-->
        <el-col :span="24" class="toolbar" style="justify-content: space-between ;padding-bottom: 1px;">
            <el-form  style="width: 100%" :inline="true"  class="demo-form-inline">
                <el-form-item style="float:left;" label="当前状态:"><span class="order-status">{{this.orderStatus}}</span></el-form-item>
                <el-form-item style="float:right;" label="">
                    <el-button type="primary" v-on:click="print">打印拣货单</el-button>
                    <el-button v-if="this.orderStatusCode == 10" type="primary" v-on:click="checkDialogVisible = true">复核</el-button>
                    <el-button v-if="this.orderStatusCode == 20" type="primary" v-on:click="shipped">发运</el-button>
                    <el-button v-if="this.orderStatusCode == 30" type="primary" v-on:click="close">关闭订单</el-button>
                    <el-button type="primary" v-on:click="refresh">刷新</el-button>
                    <el-button type="primary" v-on:click="back">返回</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!-- 出库单主表基本信息 -->
        <el-col  :span="24"  style="padding-bottom: 0px;padding-top: 10px;"><h3>基本信息</h3></el-col >
        <el-table :data="exportOrderMain" style="width: 100%">
            <el-table-column prop="expNo" label="出库单号" width="150px" show-overflow-tooltip></el-table-column>
            <el-table-column prop="sourceNo" label="来源订单号" width="220px" show-overflow-tooltip></el-table-column>
            <el-table-column prop="expType" label="出库类型" :formatter="parseExpType" show-overflow-tooltip></el-table-column>
            <el-table-column prop="deliveryType" label="配送方式" :formatter="parseDeliveryType" show-overflow-tooltip></el-table-column>
            <el-table-column prop="" label="物流公司">
                <template slot-scope="scope">
                    <el-select v-if="editable" placeholder="请选择" v-model="logisticsData.logisticsCompanyList.value">
                        <el-option
                                v-for="(item,index) in logisticsData.logisticsCompanyList.options"
                                :key="item.companyCode"
                                :label="item.logisticsCompany"
                                :value="index">
                        </el-option>
                    </el-select>
                    <span v-else>{{scope.row.logisticsCompany}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="" label="业务类型">
                <template slot-scope="scope">
                    <el-select v-if="editable" placeholder="请选择" v-model="logisticsData.businessCode">
                        <el-option
                                v-for="item in logisticsData.logisticsBusinessList"
                                :key="item.businessCode"
                                :label="item.businessName"
                                :value="item.businessCode">
                        </el-option>
                    </el-select>
                    <span v-else>{{scope.row.businessName}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="logisticsQueryNo" width="150px" label="物流单号">
                <template slot-scope="scope">
                    <el-input v-if="editable" clearable v-model="logisticsData.logisticsQueryNo"></el-input>
                    <span v-else>{{ scope.row.logisticsQueryNo }}</span>
                </template>

            </el-table-column>
            <el-table-column prop="consigneeName" label="收件人" show-overflow-tooltip></el-table-column>
            <el-table-column prop="consigneePhone" label="收件人电话" show-overflow-tooltip></el-table-column>
            <el-table-column prop="consigneeAddress" label="收件人地址" show-overflow-tooltip></el-table-column>
            <el-table-column prop="storeName" label="所属仓库" show-overflow-tooltip></el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="155px" show-overflow-tooltip :formatter="formatDate"></el-table-column>
          </el-table>

        <!-- 出库单商品明细 -->
          <el-col :span="24" style="padding-bottom: 0px;padding-top: 10px;"><h3>商品信息</h3></el-col >
          <el-table :data="exportOrderDetails" style="width: 100%" :row-class-name="tableRowClassName">
              <el-table-column label="商品编号" prop="productId" show-overflow-tooltip></el-table-column>
              <el-table-column label="SKU" prop="skuCode" show-overflow-tooltip></el-table-column>
              <el-table-column v-if="this.expType === 3" label="库存条码" width="155px" prop="barcodes" show-overflow-tooltip :formatter="parseBarCodes"></el-table-column>
              <el-table-column label="商品名称" prop="productName" show-overflow-tooltip></el-table-column>
              <el-table-column label="价格" prop="price" show-overflow-tooltip></el-table-column>
              <el-table-column label="属性" prop="productModeParams" show-overflow-tooltip></el-table-column>
              <el-table-column label="型号" prop="productMarque" show-overflow-tooltip></el-table-column>
              <el-table-column label="品质" prop="productQuality" show-overflow-tooltip></el-table-column>
              <el-table-column label="损伤部位" prop="damage" show-overflow-tooltip></el-table-column>
              <!--<el-table-column label="供应商" prop="provideName"></el-table-column>-->
              <el-table-column label="商品数量" prop="planQty" show-overflow-tooltip></el-table-column>
              <el-table-column label="已复核数量" prop="recheckQty" show-overflow-tooltip></el-table-column>
              <el-table-column label="复核状态" prop="recheckStatus" :formatter="parseRecheckStatus" show-overflow-tooltip></el-table-column>
          </el-table>
        </el-form>

        <!-- 复核窗口 -->
        <el-dialog title="复核窗口" :visible.sync="checkDialogVisible" width="20%" :before-close="closeDialog">
            <el-input v-model="barcode" placeholder="请输入商品库存条码" clearable autofocus="true" @keyup.enter.native="recheck" ref="inputRef"></el-input>
            <span slot="footer" class="dialog-footer">
                <!--<el-button @click="checkDialogVisible = false">取 消</el-button>-->
                <el-button type="primary" @click="recheck">提 交</el-button>
            </span>
        </el-dialog>

  </section>
</template>

<script>
        import util from '../../../common/js/util'
        import {queryOneExportMainByExpNo,queryExportDetailsByExpNo,
                printStoreExportOrder,getBillUrl,recheckStoreExportDetail,
                getAllLogisticsCompanyList,shippedStoreExportOrder,
                closeStoreExportOrder,getAllBusinessTypeList} from '../../../api/api';
        import parse from './ParseTypeFun';
        import moment from 'moment';
        import '@/common/css/common.css';       /*引入公共样式*/

        export default {
            data() {
                  return {
                      expNo: this.$route.query.expNo,       // 获取出库主页面传递的参数
                      storeNo: null,                        // 仓库编号
                      exportOrderMain: [],                  // 出库单主表信息
                      orderStatus: null,                    // 订单状态文本
                      expType: null,                        // 订单类型
                      orderStatusCode: null,                // 订单状态编号
                      deliveryTypeCode: null,               // 订单配送方式
                      exportOrderDetails: [],               // 表格数据--商品明细列表
                      listLoading: false,
                      checkDialogVisible: false,
                      barcode: null,                         // 商品库存条码
                      logisticsData: {                       // 物流相关数据
                          logisticsCompanyList:{options:[],value:null},    // options指定下拉的数组值，value指定下拉值的下标
                          logisticsQueryNo: null,
                          //logisticsCode: null,
                          logisticsBusinessList: [],
                          businessCode: null
                      }
                  }
            },
            computed:{  // 计算属性
                editable:function () {
                    if(this.orderStatusCode === 20 && this.deliveryTypeCode === 3){        // 快递配送方式，状态复核完成(code=20)等待发运状态才可以编辑物流信息
                        return true;
                    }else{
                        return false;
                    }
                }
            },
            methods: {
                // 查询出库单主表信息
                queryOneExportMainByExpNo() {
                    this.listLoading = true;
                    var param = {
                        expNo:this.expNo
                    };
                    queryOneExportMainByExpNo(param).then(
                        res => {
                            this.listLoading = false;
                            this.storeNo = res.data.storeNo;
                            this.orderStatus = parse.parseOrderStatusFun(res.data.orderStatus);
                            this.orderStatusCode = res.data.orderStatus;
                            this.deliveryTypeCode = res.data.deliveryType;
                            this.expType = res.data.expType;
                            //this.logisticsData.logisticsCode = res.data.logisticsCompanyNo;
                            //this.logisticsData.logisticsQueryNo = res.data.logisticsQueryNo;
                            var array = new Array();
                            array.push(res.data);
                            this.exportOrderMain = array;
                        }).catch(err => {
                            this.listLoading = false;
                        });
                },

                // 查询出库单商品明细
                queryExportDetailsByExpNo() {
                    let param = {
                        pageInfo: {
                            pageNum: 1,
                            pageSize: 100,  // 目前一张单的商品数量不多，不会涉及分页，所以给100的默认值
                        }
                    };
                    this.listLoading = true;
                    queryExportDetailsByExpNo(this.expNo,param).then(
                        res => {
                            this.listLoading = false;
                            this.exportOrderDetails = res.data.list;
                        }).catch(err => {
                            this.listLoading = false;
                            var errMsg = err.response.data.message;
                            this.$message({showClose: true, message: errMsg, type: 'error'});
                        });
                },

                // 点击打印拣货单
                print(){
                    // 根据状态判断 -> 待处理状态才调用"待处理 -> 拣货中状态更改"的接口
                    if(this.orderStatusCode === 0){
                        printStoreExportOrder(this.expNo).then(
                            res => {
                                if(res.code === 1 && res.data === true){    // 打印成功，刷新数据
                                    //this.$message({showClose: true, message: '打印预览成功', type: 'success'});
                                    this.queryOneExportMainByExpNo();
                                    this.queryExportDetailsByExpNo();

                                    this.$confirm('即将跳转拣货单预览页面, 是否继续?', '提示', {
                                        confirmButtonText: '确定',
                                        cancelButtonText: '取消',
                                        type: 'info'
                                    }).then(() => {
                                        // 预生成拣货单
                                        getBillUrl("/pickOrder/print?expNo=" + this.expNo);
                                    });
                                }else{
                                    this.$message({showClose: true, message: res.message, type: 'error'});
                                }
                            }).catch(err => {
                                var errMsg = err.response.data.message;
                                this.$message({showClose: true, message: errMsg, type: 'error'});
                            });
                    }else{
                        this.$confirm('即将跳转拣货单预览页面, 是否继续?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'info'
                        }).then(() => {
                            // 预生成拣货单
                            getBillUrl("/pickOrder/print?expNo=" + this.expNo);
                        });
                    }

                },

                // 点击提交复核
                recheck(){
                    if(this.barcode === null){
                        this.$message({showClose: true, message: '复核商品的库存条码不能为空！', type: 'error'});
                        this.$refs.inputRef.focus();
                        return;
                    }

                    // 类型为寄卖退回出库单
                    if(this.expType === 3){
                        var barCode = this.exportOrderDetails[0].barcodes;
                        var inputBarCode = '["' + this.barcode + '"]';
                        if(barCode !== inputBarCode){
                            this.barcode = '';
                            this.$message({showClose: true, message: '复核商品的库存条码有误，请核对！', type: 'error'});
                            return;
                        }
                    }

                    let param = {
                        expNo: this.expNo,
                        barcode: this.barcode,
                        storeNo: this.storeNo,
                        expType: this.expType
                    };
                    recheckStoreExportDetail(param).then(
                        res => {
                            if(res.code === 1){    // 复核成功
                                let skuCode = res.data.skuCode;
                                this.$message({showClose: true, message: '商品('+ skuCode +')复核数量加1', type: 'success'});
                                this.barcode = '';
                                this.$refs.inputRef.focus();
                                if(res.data.singleCheckStatus === 10){
                                    this.$message({showClose: true, message: '该商品('+ skuCode +')复核成功', type: 'success'});
                                }
                                if(res.data.allCheckStatus === 10){
                                    this.$message({showClose: true, message: '整单已全部复核完成', type: 'success'});
                                    this.checkDialogVisible = false;
                                }
                                this.queryOneExportMainByExpNo();
                                this.queryExportDetailsByExpNo();
                            }else{
                                //var errorMsg = res.message.substr(res.message.indexOf(']') + 2,res.message.length);
                                this.barcode = '';
                                this.$message({showClose: true, message: res.message, type: 'error'});
                                this.$refs.inputRef.focus();
                                //this.checkDialogVisible = false;
                            }
                        }).catch(err => {
                            var errMsg = err.response.data.message;
                            this.$message({showClose: true, message: errMsg, type: 'error'});
                            this.$refs.inputRef.focus();
                        });
                },
                // 单品sku复核完成，将行记录置灰
                tableRowClassName(row) {
                    if(row.row.planQty === row.row.recheckQty){     // 复核完成 -> 订单数量等于复核数量
                        return 'info-row';
                    }else{
                        return '';
                    }
                },

                // 点击发运
                shipped(){
                    // 获取下拉的对象
                    if(this.deliveryTypeCode === 3){        // 快递配送方式校验
                        var logisticsInfo = this.logisticsData.logisticsCompanyList.options[this.logisticsData.logisticsCompanyList.value];
                        if(logisticsInfo === undefined || this.logisticsData.logisticsQueryNo === null
                            || this.logisticsData.businessCode === null){
                            this.$message({showClose: true, message: '请输入物流相关信息！', type: 'error'});
                            return;
                        }
                        var reg = '^[A-Za-z0-9]+$';
                        var regResult = this.logisticsData.logisticsQueryNo.match(reg);
                        if(regResult === null){
                            this.$message({showClose: true, message: '物流单号只能包含数字或字母，请核对！', type: 'error'});
                            this.logisticsData.logisticsQueryNo = '';
                            return;
                        }
                        var QueryNoLength = this.logisticsData.logisticsQueryNo.length;
                        if(QueryNoLength > 40){
                            this.$message({showClose: true, message: '物流单号不能超过40位，请核对！', type: 'error'});
                            this.logisticsData.logisticsQueryNo = '';
                            return;
                        }
                    }

                    // 物流相关信息
                    var logisticsCompanyNo = logisticsInfo === undefined ? "" : logisticsInfo.companyCode;
                    var logisticsCompanyId = logisticsInfo === undefined ? "" : logisticsInfo.id;
                    var logisticsCompanyName = logisticsInfo === undefined ? "" : logisticsInfo.logisticsCompany;
                    var logisticsQueryNo = logisticsInfo === undefined ? "" : this.logisticsData.logisticsQueryNo;
                    var businessCode = logisticsInfo === undefined ? "" : this.logisticsData.businessCode;
                    let param = {
                        expNo: this.expNo,
                        logisticsCompanyNo: logisticsCompanyNo,
                        logisticsCompanyId: logisticsCompanyId,
                        logisticsCompanyName: logisticsCompanyName,
                        logisticsQueryNo: logisticsQueryNo,
                        businessCode: businessCode
                    };
                    shippedStoreExportOrder(param).then(
                        res => {
                            if(res.code === 1 && res.data === true) {    // 发运成功
                                this.$message({showClose: true, message: res.message, type: 'success'});
                                this.queryOneExportMainByExpNo();
                                this.queryExportDetailsByExpNo();
                            }else{
                                //var errorMsg = res.message.substr(res.message.indexOf(']') + 2,res.message.length);
                                this.$message({showClose: true, message: res.message, type: 'error'});
                            }
                        }).catch(err => {
                        this.listLoading = false;
                        var errMsg = err.response.data.message;
                        this.$message({showClose: true, message: errMsg, type: 'error'});
                    });
                },

                // 点击关闭
                close(){
                    closeStoreExportOrder(this.expNo).then((res) => {
                        if(res.code === 1) {    // 关闭成功
                            this.$message({showClose: true, message: res.message, type: 'success'});
                            this.queryOneExportMainByExpNo();
                        }else{
                            this.$message({showClose: true, message: res.message, type: 'error'});
                        }
                    }).catch(err => {
                        var errMsg = err.response.data.message;
                        this.$message({showClose: true, message: errMsg, type: 'error'});
                    });
                },

                // 关闭复核框
                closeDialog(done) {
                    this.$confirm('整单还未复核完成，确认关闭？')
                        .then(() => {
                            done();
                        }).catch(() => {
                    });
                },

                // 点击刷新
                refresh(){
                    this.queryOneExportMainByExpNo();
                    this.queryExportDetailsByExpNo();
                    this.$message({showClose: true, message: '刷新成功', type: 'success'});
                },

                // 点击返回
                back(){
                    this.$router.push({path: '/storeExportMain/list'});
                },

                // 获取未删除并且启用的物流公司
                getLogisticsCompany(){
                    let para = {}
                    getAllLogisticsCompanyList(para).then(
                        res => {
                            if(res.code === 1) {    // 获取成功
                                this.logisticsData.logisticsCompanyList.options = res.data.list;
                            }else{
                                this.$message({showClose: true, message: '获取物流公司失败', type: 'error'});
                            }
                        }).catch(err => {
                            var errMsg = err.response.data.message;
                            this.$message({showClose: true, message: errMsg, type: 'error'});
                        });
                },
                // 获取未删除并且启用的业务类型
                getBusinessName: function() {
                    let para = {}
                    getAllBusinessTypeList(para).then(
                        res => {
                            this.listLoading = false;
                            this.logisticsData.logisticsBusinessList = res.data.list;
                        }).catch(err => {
                            var errMsg = err.response.data.message;
                            this.$message({showClose: true, message: errMsg, type: 'error'});
                        });
                },

                // 时间格式化:YYYY-MM-DD HH:mm:ss
                formatDate(row, column, cellValue) {
                    if(cellValue === null || cellValue === undefined){
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
                },

                // 解析复核状态
                parseRecheckStatus(row, column, cellValue) {
                    return parse.parseRecheckStatusFun(cellValue);
                },

                // 解析库存条码(17位编码)
                parseBarCodes(row, column, cellValue) {
                    return cellValue.substr(2,17);
                }
            },
            mounted() {
                this.queryOneExportMainByExpNo();
                this.queryExportDetailsByExpNo();
                this.getLogisticsCompany();
                this.getBusinessName();
            }
        }
</script>

<style>
    .el-table .info-row{
        background: #DEDEDE;
    }
</style>