<template>
    <section>
        <div class="toolbar el-col el-col-24" style="margin-top: 20px;text-align:right;">
            <!--业务分类-->
            <select-group :num="number" :select="isSelect" @getresult='getResultNumber'></select-group>&nbsp;

            <!--订单号、门店或洗护中心名称、支付流水号、用户手机搜索-->
            <el-input size="medium" v-model.trim="key" placeholder="订单号或会员手机号" style="width:160px;"></el-input>&nbsp;
            <!--<el-input size="medium" v-model.trim="phone" placeholder="会员手机号" style="width:180px;"></el-input>&nbsp;-->
            <el-input size="medium" v-model.trim="sysUserName" placeholder="业务员" style="width:160px;"></el-input>&nbsp;
            <el-input size="medium" v-model.trim="orderOutId" placeholder="外部订单号" style="width:160px;"></el-input>&nbsp;
            <!--支付状态-->
            <el-select v-model="payStatus" placeholder="支付状态" style="width:120px;">
                <el-option
                        v-for="item in payStatusOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>&nbsp;

            <!--支付方式-->
            <el-select v-model="payMethod" placeholder="支付方式" style="width:120px;">
                <el-option
                        v-for="item in payMethodOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>&nbsp;

            <!--订单来源-->
            <el-select v-model="orderSourceType" placeholder="订单来源" style="width:120px;">
                <el-option
                        v-for="item in orderSourceTypeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>&nbsp;

            <!--是否开发票-->
            <el-select v-model="invoiceFlag" placeholder="是否发票" style="width:120px;">
                <el-option label="所有" value=""></el-option>
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
            </el-select>&nbsp;

            <!--代客户支付 -->
            <el-select v-model="replacePayFlag" placeholder="代客户支付" style="width:120px;">
                <el-option label="所有" value=""></el-option>
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
            </el-select>
            &nbsp;
            <!--地区选择-->
            <el-select v-model="cityName" placeholder="门店所属城市" filterable style="width:140px;">
                <el-option label="所有城市" value=""></el-option>
                <el-option
                        v-for="item in cityList"
                        :key="item.id"
                        :label="item.regionName"
                        :value="item.regionName">
                </el-option>
            </el-select>&nbsp;

            <!--日期控件-->
            <!--<span class="demonstration">带快捷选项</span>-->
            <el-date-picker
                    v-model="picker"
                    type="daterange"
                    :picker-options="pickerOptions"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    align="right">
            </el-date-picker>&nbsp;
            &nbsp;&nbsp;
            <!--提交按钮-->
            <el-button type="primary" v-on:click="getResult()" :loading="listLoading">查询</el-button>
            &nbsp;&nbsp;&nbsp;
            <el-button v-if="isAuth('scloud:selfOrderTotal:export')" type="primary" @click="exportFinance">导出
            </el-button>
            <el-tooltip class="item" effect="dark" content="提示:导出结果最多只能有两万条数据" placement="top-start">
                <span class="el-icon-question" style="position: relative;left:1px;bottom:12px;"></span>
            </el-tooltip>
        </div>

        <div v-loading="listLoading">
            <el-tooltip class="item" effect="dark" content="提示:统计所有已完成的订单" placement="top-start">
                <span class="el-icon-question" style="position: relative;left:90%;top:43px; "></span>
            </el-tooltip>
            <!--table-->
            <el-table
                    border
                    :data="payTotal"
                    style="width: 80%;margin-top: 30px;margin-left: 9%;">
                <el-table-column
                        align="center"
                        prop="paidPrice"
                        label="总收入">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="orderNum"
                        label="总订单数">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="couponPrice"
                        label="总优惠金额">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="initPrice"
                        label="总订单金额">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="servicePrice"
                        label="总手续费">
                </el-table-column>
            </el-table>

            <el-tooltip class="item" effect="dark" content="提示:统计所有支付的订单" placement="top-start">
                <span class="el-icon-question" style="position: relative;left:90%;top:43px; "></span>
            </el-tooltip>
            <!--table-->
            <el-table
                    border
                    :data="payTypeTotal"
                    style="width: 80%;margin-top: 30px;margin-left: 9%;">
                <el-table-column
                        align="center"
                        prop="kpay"
                        label="客户支付宝">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="kwx"
                        label="客户微信">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="kunionpay"
                        label="客户银联">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="spay"
                        label="商家-支付宝">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="swx"
                        label="商家-微信">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="pospay"
                        label="Pos机">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="payscan"
                        label="支付宝扫码">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="wxscan"
                        label="微信扫码">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="gzh"
                        label="公众号">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="xcx"
                        label="小程序">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="sinterCurrency"
                        label="森特币">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="qt"
                        label="其他">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="couponPrice"
                        label="优惠券金额">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="discountPrice"
                        label="折扣金额">
                </el-table-column>
            </el-table>

            <!--table-->
            <el-table
                    :data="orderList"
                    style="width: 100%;margin-top: 60px;">
                <el-table-column
                        type="index">
                </el-table-column>
                <el-table-column
                        show-overflow-tooltip
                        align="center"
                        prop="createTime"
                        label="下单时间">
                </el-table-column>
                <el-table-column
                        show-overflow-tooltip
                        align="center"
                        prop="id"
                        label="订单号">
                </el-table-column>
                <el-table-column
                        show-overflow-tooltip
                        align="center"
                        prop="orderStatus"
                        label="订单状态">
                </el-table-column>
                <el-table-column
                        show-overflow-tooltip
                        align="center"
                        prop="businessCode"
                        label="业务类型">
                </el-table-column>
                <el-table-column
                        show-overflow-tooltip
                        show-overflow-tooltip
                        align="center"
                        prop="orderSourceType"
                        label="订单来源">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="payStatus"
                        label="支付状态">
                </el-table-column>
                <!--<el-table-column
                        show-overflow-tooltip
                        align="center"
                        prop="orderOutId"
                        label="外部订单号">
                </el-table-column>-->
                <el-table-column
                        show-overflow-tooltip
                        align="center"
                        prop="phone"
                        label="会员手机">
                </el-table-column>
                <el-table-column
                        show-overflow-tooltip
                        align="center"
                        prop="ss"
                        label="所属">
                </el-table-column>
                <el-table-column
                        show-overflow-tooltip
                        align="center"
                        prop="cityName"
                        label="城市">
                </el-table-column>
                <el-table-column
                        show-overflow-tooltip
                        align="center"
                        prop="invoiceFlag"
                        label="是否开票">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="replacePayFlag"
                        label="是否代客支付">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="sysUserName"
                        label="业务员">
                </el-table-column>
                <el-table-column
                        show-overflow-tooltip
                        align="center"
                        prop="initialPrice"
                        label="订单销售金额">
                </el-table-column>
                <el-table-column
                        show-overflow-tooltip
                        align="center"
                        prop="paidPrice"
                        label="订单实付金额">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop=""
                        label="详情">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" size="mini" type="primary">订单详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!--分页-->
        <div class="block" style="text-align:right;">
            <!--<el-pagination @current-change="handleCurrentChange"
                           :page-size="pageSize"
                           layout="prev, pager, next"
                           :total="totalPage">
            </el-pagination>-->

            <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="page"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totalPage" style="float: right;margin-top: 10px">
            </el-pagination>

        </div>
    </section>
</template>

<script>
    import {getSelfOrderTotalFun, exportSelfOrderTotal} from '../../api/api';
    import {getCityListData} from '../../api/api';
    import {exportFinanceFun} from '../../api/api';
    import util from '../../common/js/util';
    import selectGroup from '@/components/selectGroup';

    export default {
        components: {
            selectGroup
        },
        data() {
            return {
                listLoading: false,
                pageSize: this.GLOBAL.CONSTANT_DATA.PAGESIZE,
                totalPage: 0,
                page: 1,
                payTypeTotal: [],//支付方式金额统计
                payStatus: '',//支付状态
                payMethod: '',//支付方式
                cityName: null,//城市

                number: -1,//后台传过来的十进制数据
                isSelect: true,//是否可选
                payTotal: [],

                //orderId:'',//订单号
                //phone:'',//手机号
                key: '',//订单号、用户手机搜索
                sysUserName: '',//业务员
                orderOutId: '',//外部订单号
                businessTypeCode: -1,
                orderSourceType: null,//订单来源
                invoiceFlag: null,//是否发票
                replacePayFlag: null,//是否代客支付

                //支付方式
                payMethodOptions: [{
                    value: null,
                    label: '全部'
                }, {
                    value: '0',
                    label: '顾客支付宝'
                }, {
                    value: '1',
                    label: '顾客微信支付'
                }, {
                    value: '2',
                    label: '顾客银联卡支付'
                }, {
                    value: '3',
                    label: '商家-支付宝代支付'
                }, {
                    value: '4',
                    label: '商家-微信代支付'
                }, {
                    value: '5',
                    label: 'Pos机支付'
                }, {
                    value: '6',
                    label: '支付宝扫描支付'
                }, {
                    value: '7',
                    label: '微信扫描支付'
                }, {
                    value: '8',
                    label: '公众号'
                }, {
                    value: '9',
                    label: '森特币'
                }, {
                    value: '10',
                    label: '小程序'
                }],
                //支付状态
                payStatusOptions: [{
                    value: null,
                    label: '全部'
                }, {
                    value: '0',
                    label: '未支付'
                }, {
                    value: '1',
                    label: '已支付'
                }],

                //订单来源(1:微信小程序;2:微信公众号;3:苹果app;4:安卓app;5:门店;10:京东;11:淘宝)
                orderSourceTypeOptions: [{
                    value: '',
                    label: '全部'
                }, {
                    value: 1,
                    label: '微信小程序'
                }, {
                    value: 2,
                    label: '微信公众号'
                }, {
                    value: 3,
                    label: '苹果app'
                }, {
                    value: 4,
                    label: '安卓app'
                }, {
                    value: 5,
                    label: '门店'
                }, {
                    value: 10,
                    label: '京东'
                }, {
                    value: 11,
                    label: '淘宝'
                }],
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
                //d3:new Date(new Date().getTime()-3*24*60*60*1000),//取前三天日期
                picker: [
                    new Date(new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).getFullYear(), new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).getMonth(), new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).getDate()),//前30天日期
                    new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) //当天日期
                ],
                orderList: [],//表格数据
                cityList: [],//地区列表
            };
        },
        methods: {
            //选择业务类型
            getResultNumber(result) {
                this.businessTypeCode = result;
            },
            //获取注册城市列表
            getCityList() {
                getCityListData(null).then((data) => {
                        if (this.GLOBAL.isResonseSuccess(data)) {
                            this.cityList = data.data;
                        }
                    }
                );
            },
            //查询搜索结果
            getResult() {
                this.page = 1;
                this.getSelfOrderTotal();
            },
            getSelfOrderTotal() {
                //检查日期是是否超过一个月
                var d = this.picker[1].getTime() - this.picker[0].getTime();
                if (d > 31 * 24 * 60 * 60 * 1000) {
                    this.open('日期范围不能超过一个月');//弹出框提示
                    return;
                }

                var para = {
                    pageInfo: {
                        pageNum: this.page,
                        pageSize: this.pageSize,
                    },

                    //orderId:this.orderId,
                    //phone:this.phone,
                    key: this.key,//订单号、用户手机搜索
                    sysUserName: this.sysUserName,
                    orderOutId: this.orderOutId,
                    businessTypeCode: this.businessTypeCode,
                    orderSourceType: this.orderSourceType,
                    invoiceFlag: this.invoiceFlag,
                    replacePayFlag: this.replacePayFlag,
                    cityName: util.getCity(this.cityName),

                    betweenDate: [util.dateFormat("yyyy-MM-dd", new Date(this.picker[0])), util.dateFormat("yyyy-MM-dd", new Date(this.picker[1]))],  //日期范围
                    payStatus: this.payStatus,//订单状态
                    payMethod: this.payMethod,//支付方式
                };
                this.listLoading = true;
                getSelfOrderTotalFun(para).then((data) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(data)) {
                            //支付方式金额统计
                            this.payTypeTotal = [];
                            var payTypeTotal = data.data.financePayTypeTotalDto;
                            if (payTypeTotal != null) {
                                payTypeTotal.total = util.moneyFormat((payTypeTotal.total + payTypeTotal.gapPrice).toFixed(2)) + "元";
                                payTypeTotal.kpay = util.moneyFormat(payTypeTotal.kpay.toFixed(2)) + "元";
                                payTypeTotal.kwx = util.moneyFormat(payTypeTotal.kwx.toFixed(2)) + "元";
                                payTypeTotal.kunionpay = util.moneyFormat(payTypeTotal.kunionpay.toFixed(2)) + "元";
                                payTypeTotal.spay = util.moneyFormat(payTypeTotal.spay.toFixed(2)) + "元";
                                payTypeTotal.swx = util.moneyFormat(payTypeTotal.swx.toFixed(2)) + "元";
                                payTypeTotal.pospay = util.moneyFormat(payTypeTotal.pospay.toFixed(2)) + "元";
                                payTypeTotal.payscan = util.moneyFormat(payTypeTotal.payscan.toFixed(2)) + "元";
                                payTypeTotal.wxscan = util.moneyFormat(payTypeTotal.wxscan.toFixed(2)) + "元";
                                payTypeTotal.gzh = util.moneyFormat(payTypeTotal.gzh.toFixed(2)) + "元";
                                payTypeTotal.xcx = util.moneyFormat(payTypeTotal.xcx.toFixed(2)) + "元";
                                payTypeTotal.qt = util.moneyFormat(payTypeTotal.qt.toFixed(2)) + "元";
                                payTypeTotal.couponPrice = util.moneyFormat(payTypeTotal.couponPrice.toFixed(2)) + "元";
                                payTypeTotal.discountPrice = util.moneyFormat(payTypeTotal.discountPrice.toFixed(2)) + "元";
                                if (payTypeTotal.gapPrice) {
                                    payTypeTotal.gapPrice = util.moneyFormat(payTypeTotal.gapPrice.toFixed(2)) + "元";
                                } else {
                                    payTypeTotal.gapPrice = '0.00元';
                                }
                                this.payTypeTotal.push(payTypeTotal);

                            }

                            //总支付金额统计
                            this.payTotal = [];
                            var payTotal = data.data.financePayTotalDto;
                            if (payTotal != null) {
                                payTotal.couponPrice = util.moneyFormat(payTotal.couponPrice.toFixed(2)) + "元";
                                payTotal.paidPrice = util.moneyFormat(payTotal.paidPrice.toFixed(2)) + "元";
                                payTotal.initPrice = util.moneyFormat(payTotal.initPrice.toFixed(2)) + "元";
                                payTotal.servicePrice = util.moneyFormat(payTotal.servicePrice.toFixed(2)) + "元";
                                //payTotal.paidPrice=util.moneyFormat(payTotal.paidPrice).toFixed(2)+"元";

                                this.payTotal.push(payTotal);
                            }

                            //支付方式
                            var financeResDto = data.data.financeResDto;

                            this.totalPage = financeResDto.paginationInfo.total;
                            var list = financeResDto.list;
                            //console.log(list);
                            for (var i = 0; i < list.length; i++) {

                                //实际价格
                                list[i].initialPrice = util.moneyFormat(list[i].initialPrice.toFixed(2)) + "元";
                                //支付价格
                                var paidPrice = util.moneyFormat(list[i].paidPrice.toFixed(2));
                                list[i].paidPrice = list[i].payStatus == '已支付' ? paidPrice + "元" : '';
                                //支付类型
                                list[i].payMethod = util.getPayType(list[i].payMethod);

                                //支付时间
                                if (list[i].payTime != null && list[i].payTime != '') {
                                    list[i].payTime = util.dateFormat('yyyy-MM-dd hh:mm:ss', new Date(list[i].payTime));
                                }

                                //所属
                                if (list[i].businessCode == '洗护') {
                                    list[i].ss = list[i].shopName;
                                } else if (list[i].businessCode == '名品') {
                                    list[i].ss = list[i].storeName;
                                }
                            }
                            this.orderList = list;
                        }
                    }
                    , data => {
                        this.listLoading = false;
                    }
                );
            },
            open(msg) {
                this.$alert(msg, {
                    confirmButtonText: '确定',
                });
            },
            //分页查询
            handleCurrentChange(page) {
                this.page = page;
                this.getSelfOrderTotal();
            },
            //处理分页条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.getFinance();
            },
            handleClick(row) {
                this.$router.push({path: '/orderSelf/queryDetailById?id=' + row.id + '&orderStatus=' + row.os});
            },
            //导出
            exportFinance() {
                var d = new Date(this.picker[0]).getTime() - new Date(this.picker[1]).getTime();
                if (this.picker != null && d > 31 * 24 * 60 * 60 * 1000) {
                    this.open('日期范围不能超过一个月');//弹出框提示
                    return;
                }

                var params = "";
                if (this.key) {
                    params += '&key=' + this.key;
                }
                if (this.sysUserName) {
                    params += '&sysUserName=' + this.sysUserName;
                }
                if (this.orderOutId) {
                    params += '&orderOutId=' + this.orderOutId;
                }
                /*if(this.businessTypeCode){
                    params+='&businessTypeCode='+this.businessTypeCode;
                }*/
                if (this.orderSourceType) {
                    params += '&orderSourceType=' + this.orderSourceType;
                }
                if (this.invoiceFlag) {
                    params += '&invoiceFlag=' + this.invoiceFlag;
                }
                if (this.replacePayFlag) {
                    params += '&replacePayFlag=' + this.replacePayFlag;
                }
                if (this.cityName) {
                    params += '&cityName=' + util.getCity(this.cityName);
                }
                params += '&betweenDate=' + [util.dateFormat("yyyy-MM-dd", new Date(this.picker[0])), util.dateFormat("yyyy-MM-dd", new Date(this.picker[1]))];

                if (this.payStatus) {
                    params += '&payStatus=' + this.payStatus;
                }
                if (this.payMethod) {
                    params += '&payMethod=' + this.payMethod;
                }
                if (this.businessTypeCode && this.businessTypeCode) {
                    params += '&businessTypeCode=' + this.businessTypeCode;
                }
                params += "&pageFlag=false";
                location.href = exportSelfOrderTotal(params);
            }
        },
        mounted() {
            //获取注册城市列表
            this.getCityList();
            //财务订单列表和支付方式统计
            this.getSelfOrderTotal();

        }
    }

</script>

