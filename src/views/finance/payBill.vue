<template>
    <section>
        <el-row   class="toolbar">
            <!--工具条-->
            <el-form ref="searchData"  :model="searchData" label-position="left"  align="left" :inline="true"  class="demo-form-inline search-form">
                <el-col :span="24"  style="padding-bottom: 0px;">
                    <el-input size="medium" v-model.trim="searchData.orderId" placeholder="订单号、流水号" style="width:300px;" clearable></el-input>
<!--                    <el-form-item  prop="businessTypeCode">
                        <template>
                            <select-group-add :num ="searchData.businessId"  :select="isSelect" @getresult = 'getResultNumber'></select-group-add>
                        </template>
                    </el-form-item>-->

                    <el-form-item prop="businessTypeCode">
                        <template>
                            <select-group :num ="searchData.businessId" :select="isSelect" @getresult = 'getResultNumber'></select-group>
                        </template>
                    </el-form-item>
                    <!--<el-form-item label="渠道" >-->
                    <el-form-item   >
                        <el-select v-model="searchData.payType" placeholder="支付方式" clearable style="width: 150px">
                            <el-option v-for="item in listPayType" :key="item.id"    :label="item.name" :value="item.id" />
                        </el-select>
                    </el-form-item>
                    <el-form-item   >
                        <el-select v-model="searchData.payMethod" placeholder="支付渠道" clearable   style="width: 150px">
                            <el-option v-for="item in listPayMethod" :key="item.id"    :label="item.name" :value="item.id" />
                        </el-select>
                    </el-form-item>
                    <el-form-item >
                        <el-select v-model="searchData.tradeType" placeholder="账单类型"  clearable   style="width: 150px">
                            <el-option v-for="item in listTradeType" :key="item.id"    :label="item.name" :value="item.id" />
                        </el-select>
                    </el-form-item>
                    <el-form-item   >
                        <el-date-picker clearable
                                        v-model="tradeDate"
                                        type="daterange"
                                        :picker-options="pickerOptions"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                        align="right">
                        </el-date-picker>
                    </el-form-item>
                    <el-button   type="primary" @click="getData(1)"  >查询</el-button>
                </el-col>
            </el-form>
        </el-row>
<!--        <el-col :span="24" style="padding-bottom: 0px;">
            <div style="text-align:right;">
                <el-button   type="primary" @click="getData(1)"  >查询</el-button>
                <el-button  type="primary" @click="resetForm"  >重置</el-button>
            </div>
        </el-col>-->
        <!--列表-->
        <el-table :data="list"  highlight-current-row v-loading="listLoading"  style="width: 100%;" @selection-change="selsChange" >

            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form :label-position="right" inline class="demo-table-expand"  label-width="100px">
                        <el-form-item label="交易时间:" class="table-item-text" >
                            <span>{{ dateFormat(props.row,null,props.row.tradeTime)}}</span>
                        </el-form-item>
                        <el-form-item label="账单类型:" class="table-item-text">
                            <span>{{ tradeTypeFormat(props.row,null,props.row.tradeType)}}</span>
                        </el-form-item>
                        <el-form-item label="外部订单号:" class="table-item-text">
                            <span>{{  props.row.tradeNo}}</span>
                        </el-form-item>
                        <el-form-item label="销售订单号:" class="table-item-text">
                            <span>{{  props.row.orderId}}</span>
                        </el-form-item>
                        <el-form-item label="订单金额:" class="table-item-text">
                            <span>{{ tradeMoneyFormat(props.row,null,props.row.tradeMoney)}}</span>
                        </el-form-item>
                        <el-form-item label="外部退款单号:" class="table-item-text">
                            <span>{{  props.row.refundTradeNo}}</span>
                        </el-form-item>
                        <el-form-item label="退款单号:" class="table-item-text">
                            <span>{{  props.row.refundOrderNo}}</span>
                        </el-form-item>
                        <el-form-item label="退款金额:" class="table-item-text">
                            <span>{{ refundMoneyFormat(props.row,null,props.row.tradeMoney)}}</span>
                        </el-form-item>
                        <el-form-item label="平台服务费:" class="table-item-text">
                            <span>{{ serviceMoneyFormat(props.row,null,props.row.serviceMoney)}}</span>
                        </el-form-item>
                        <el-form-item label="支付方式:" class="table-item-text">
                            <span>{{ payTypeFormat(props.row,null,props.row.payType)}}</span>
                        </el-form-item>
                        <el-form-item label="支付渠道:" class="table-item-text">
                            <span>{{ payMethodFormat(props.row,null,props.row.payMethod)}}</span>
                        </el-form-item>
                        <el-form-item label="业务:" class="table-item-text">
                            <span>{{ businessFormat(props.row,null,props.row.businessId)}}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>

            <!-- <el-table-column
                   type="selection"
                   width="55">
           </el-table-column>-->
            <el-table-column  type="index" />

            <el-table-column prop="tradeTime" label="交易时间"   sortable  :formatter="dateFormat"  show-overflow-tooltip    min-width="50"></el-table-column>
            <el-table-column prop="tradeNo" label="外部订单号"   sortable      show-overflow-tooltip></el-table-column>
            <el-table-column prop="orderId" label="销售订单号"   sortable    show-overflow-tooltip></el-table-column>
            <el-table-column prop="tradeType" label="账单类型"   sortable  :formatter="tradeTypeFormat" show-overflow-tooltip min-width="30" ></el-table-column>
            <el-table-column prop="tradeMoney" label="金额"    :formatter="serviceMoneyFormat"   sortable    show-overflow-tooltip min-width="30"></el-table-column>
            <!--<el-table-column prop="tradeMoney" label="订单金额"   sortable   :formatter="tradeMoneyFormat"  show-overflow-tooltip></el-table-column>
            <el-table-column prop="refundTradeNo" label="外部退款单号"   sortable     show-overflow-tooltip></el-table-column>
            <el-table-column prop="refundOrderNo" label="退款单号"   sortable    show-overflow-tooltip     ></el-table-column>
            <el-table-column prop="tradeMoney" label="退款金额"   sortable   :formatter="refundMoneyFormat" show-overflow-tooltip     ></el-table-column>-->
            <el-table-column prop="serviceMoney" label="平台服务费"   sortable  :formatter="serviceMoneyFormat"  show-overflow-tooltip min-width="30"    ></el-table-column>
            <el-table-column prop="payType" label="支付方式"   sortable  :formatter="payTypeFormat"   show-overflow-tooltip     min-width="30" ></el-table-column>
            <el-table-column prop="payMethod" label="支付渠道"   sortable  :formatter="payMethodFormat"  show-overflow-tooltip    min-width="30"  ></el-table-column>
            <el-table-column prop="businessId" label="业务"   sortable    :formatter="businessFormat" show-overflow-tooltip    min-width="30"  ></el-table-column>



        </el-table>
        <!--工具条-->
        <el-col :span="24" style="margin-top: 10px">
            <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync = "pageNum"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total" style="float: right">
            </el-pagination>
        </el-col>

    </section>
</template>

<script>
    import util from '@/common/js/util';
    import {getBillFun} from '@/api/api';
    import selectGroupAdd from '@/components/selectGroupAdd';
    import selectGroup from '@/components/selectGroup';
    export default {
        components: {
            selectGroupAdd,
            selectGroup
        },
        data() {
            return {
                isSelect: true,
                list:[],
                listBusiness: [{"id":1,"name":"洗护"},{"id":2,"name":"名品"},{"id":4,"name":"态奢"}],
                listPayMethod: [{"id":1,"name":"app"},{"id":2,"name":"扫码"},{"id":5,"name":"公众号"},{"id":6,"name":"小程序"}],
                listPayType: [{"id":0,"name":"微信"},{"id":1,"name":"支付宝"}],
                listTradeType: [{"id":11,"name":"交易"},{"id":21,"name":"退款"}],
                pageNum: 1, //当前页码
                pageSize: 10,//页数
                listLoading: false,
                total: 0,
                tradeDate:[],
                searchData:{
                    orderId:null,
                    businessId:-1,
                    payMethod:null,
                    payType:null,
                    tradeType:null,
                    startTime:null,
                    endTime:null,
                    businessTypeCode:"",
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    },

                },
                //日期控件
                pickerOptions: {
                    shortcuts: [
                        {
                            text: '最近三天',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
                                picker.$emit('pick', [start, end]);
                            }
                        },
                        {
                            text: '最近一周',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                                picker.$emit('pick', [start, end]);
                            }
                        },
                        {
                            text: '最近一个月',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                                picker.$emit('pick', [start, end]);
                            }
                        }]
                },
                sels: [],//列表选中列
            };
        },
        mounted() {
            this.getData();
        },
        methods: {
            getResultNumber(result){
                 console.log(result);
                 this.searchData.businessId = result;
            },
            selsChange: function (sels) {
                this.sels = sels;
                console.log(sels);
            },

            buildSearchParam(){

                this.searchData.startTime = (!this.tradeDate || !this.tradeDate[0])?null:this.tradeDate[0].getTime();
                this.searchData.endTime = (!this.tradeDate || !this.tradeDate[1])?null:this.tradeDate[1].getTime();
                return this.searchData;

            },
            getData(pageNum){
                this.pageNum = pageNum || this.pageNum;
                let pageInfo=  {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                };
                let param = this.buildSearchParam();
                param.pageInfo = pageInfo;
                this.listLoading = true;
                console.log(JSON.stringify(param));

                getBillFun(param).then((res) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(res)){
                            console.log(res);
                            this.total = res.data.paginationInfo.total;
                            this.list = res.data.list;
                        }
                    }
                    ,data => {
                        this.listLoading = false;
                    }
                );
            },
            //时间格式化
            dateFormat: function (row, column, cellValue) {
                if(cellValue == undefined){
                    return ''
                }
                let time = util.dateFormat("yyyy-MM-dd hh:mm:ss",new Date(cellValue));
                if(time.startsWith("1900")) {
                    return "";
                }
                return  time;
            },
            //
            tradeMoneyFormat: function (row, column, cellValue) {
                if(row.tradeType==11){
                    return  this.moneyFormat(cellValue);
                }
                return "";
            },
            refundMoneyFormat: function (row, column, cellValue) {
                if(row.tradeType==21){
                    return  this.moneyFormat(cellValue);
                }
                return "";
            },
            serviceMoneyFormat: function (row, column, cellValue) {
                return  this.moneyFormat(cellValue);
            },

            moneyFormat:function(v){
                return    util.moneyFormat(v.toFixed(2));
            },
            //"账单类型
            tradeTypeFormat: function (row, column, cellValue) {
                let result = this.listTradeType.find((value, index, arr) => {
                    return value.id ==  cellValue
                });
                return result?result.name:"";

            },
            //支付方式
            payTypeFormat: function (row, column, cellValue) {
                let result = this.listPayType.find((value, index, arr) => {
                    return value.id ==  cellValue
                });
                return result?result.name:"";
            },
            //支付渠道
            payMethodFormat: function (row, column, cellValue) {
                let result = this.listPayMethod.find((value, index, arr) => {
                    return value.id ==  cellValue
                });
                return result?result.name:"";
            },
            //  业务
            businessFormat: function (row, column, cellValue) {
                let result = this.listBusiness.find((value, index, arr) => {
                    return value.id ==  cellValue
                });
                return result?result.name:"";
            },

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
            resetForm() {
                this.searchData={};
                this.tradeDate=[];
            }
        },
    }

</script>

<style lang="scss" scoped>
    .search-form{
        margin-left: 10px;
    }

    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 90px;
        color: #000000;
        opacity:0.4;
    }

/*    .table-item-text {
        color: #000000;
    }*/



    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
</style>