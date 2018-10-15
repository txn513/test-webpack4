<template>
    <section>
        <div class="toolbar el-col el-col-24" style="margin-top: 20px;text-align:right;">
            <!--业务分类-->
            <select-group :num ="number" :select="isSelect" @getresult = 'getResultNumber'></select-group>&nbsp;

            <!--订单号、门店或洗护中心名称、支付流水号、用户手机搜索-->
            <el-input size="medium" v-model.trim="key" placeholder="订单号、门店、支付流水号" style="width:370px;"></el-input>&nbsp;
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
            下单时间:
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
            <el-button type="primary" v-on:click="getFinance(true)" :loading="listLoading">查询</el-button>
        </div>

        <div  v-loading="listLoading">
            <!--table-->
            <el-table
                    border
                    :data="payTypeTotal"
                    style="width: 80%;margin-top: 30px;margin-left: 9%;">
                <el-table-column
                        align="center"
                        prop="total"
                        label="总收入">
                </el-table-column>
               <!-- <el-table-column
                    align="center"
                    prop="gapPrice"
                    label="补差价">
                </el-table-column>-->

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
                <!--<el-table-column
                        align="center"
                        prop="sinterCurrency"
                        label="森特币">
                </el-table-column>-->
            </el-table>

            <el-button type="primary" style="float: right;margin-bottom: 30px;" @click="exportFinance">&nbsp;&nbsp;导出&nbsp;&nbsp;</el-button>

            <!--table-->
            <el-table
                    :data="orderList"
                    style="width: 100%;margin-top: 60px;">
                <el-table-column
                        type="index">
                </el-table-column>
                <el-table-column
                        sortable
                        align="center"
                        prop="createTime"
                        label="下单时间">
                </el-table-column>
                <el-table-column
                        show-overflow-tooltip
                        align="center"
                        prop="id"
                        width="125"
                        label="订单号">
                </el-table-column>
                <el-table-column
                        show-overflow-tooltip
                        sortable
                        align="center"
                        prop="payTime"
                        width="102"
                        label="支付时间">
                </el-table-column>
                <el-table-column
                        sortable
                        show-overflow-tooltip
                        align="center"
                        prop="orderStatus"
                        label="订单状态">
                </el-table-column>
                <el-table-column
                        sortable
                        align="center"
                        prop="initialPrice"
                        label="订单原价">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="useSintercurrency"
                        label="森特币抵扣数">
                </el-table-column>

                <el-table-column
                        sortable
                        align="center"
                        prop="orderDiscount"
                        label="订单折扣">
                </el-table-column>
                <el-table-column
                        sortable
                        align="center"
                        prop="paidPrice"
                        label="支付金额">
                </el-table-column>
                <el-table-column
                        sortable
                        align="center"
                        prop="cwzk"
                        label="财务折扣">
                </el-table-column>
                <el-table-column
                        show-overflow-tooltip
                        align="center"
                        prop="shopName"
                        label="门店">
                </el-table-column>
                <!--<el-table-column
                        sortable
                        align="center"
                        prop="cityName"
                        label="门店所属城市">
                </el-table-column>-->
                <el-table-column
                        align="center"
                        prop="payMethod"
                        label="支付类型">
                </el-table-column>
                <el-table-column
                        sortable
                        align="center"
                        prop="payStatus"
                        label="支付状态">
                </el-table-column>
                <el-table-column
                        show-overflow-tooltip
                        align="center"
                        prop="tradeNo"
                        label="支付流水号">
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
    import {getFinanceFun} from '../../api/api';
    import {getCityListData} from '../../api/api';
    import {exportFinanceFun} from '../../api/api';
    import util from '../../common/js/util';
    import selectGroup from '@/components/selectGroup';

    export default {
        components:{
            selectGroup
        },
        data() {
            return {
                listLoading: false,
                pageSize:this.GLOBAL.CONSTANT_DATA.PAGESIZE,
                totalPage:0,
                page: 1,
                key:'',//订单号、门店所属城市、洗护中心、流水号、用户手机搜索
                payTypeTotal:[],//支付方式金额统计
                payStatus:'',//支付状态
                payMethod:'',//支付方式
                cityName: null,//城市

                number:-1,//后台传过来的十进制数据
                isSelect: true,//是否可选
                businessTypeCode: -1,


                //支付方式
                payMethodOptions: [{
                    value: null,
                    label: '全部'
                },{
                    value: '0',
                    label: '顾客支付宝'
                },{
                    value: '1',
                    label: '顾客微信支付'
                },{
                    value: '2',
                    label: '顾客银联卡支付'
                },{
                    value: '3',
                    label: '商家-支付宝代支付'
                },{
                    value: '4',
                    label: '商家-微信代支付'
                },{
                    value: '5',
                    label: 'Pos机支付'
                },{
                    value: '6',
                    label: '支付宝扫描支付'
                },{
                    value: '7',
                    label: '微信扫描支付'
                },{
                    value: '8',
                    label: '公众号'
                },{
                    value: '9',
                    label: '森特币'
                },{
                    value: '10',
                    label: '小程序'
                }],
                //支付状态
                payStatusOptions: [{
                    value: null,
                    label: '全部'
                },{
                    value: '0',
                    label: '未支付'
                },{
                    value: '1',
                    label: '已支付'
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
                    new Date(new Date(new Date().getTime()-30*24*60*60*1000).getFullYear(), new Date(new Date().getTime()-30*24*60*60*1000).getMonth(), new Date(new Date().getTime()-30*24*60*60*1000).getDate()),//前30天日期
                    new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) //当天日期
                ],
                orderList:[],//表格数据
                cityList: [],//地区列表
            };
        },
        methods:{
            //选择业务类型
            getResultNumber(result){
                this.businessTypeCode = result;
            },
            //获取注册城市列表
            getCityList(){
                getCityListData(null).then((data) => {
                        if (this.GLOBAL.isResonseSuccess(data)){
                            this.cityList=data.data;
                        }
                    }
                );
            },

            getFinance(flag) {
                //检查日期是是否超过一个月
                var d = this.picker[1].getTime()-this.picker[0].getTime();
                if(d>31*24*60*60*1000){
                    this.open('日期范围不能超过一个月');//弹出框提示
                    return;
                }

                var para = {
                    pageInfo:{
                        pageNum:flag===true?1:this.page,
                        pageSize:this.pageSize,
                    },
                    cityName:util.getCity(this.cityName),
                    //cityName:this.city,
                    betweenDate:[util.dateFormat("yyyy-MM-dd",new Date(this.picker[0])),util.dateFormat("yyyy-MM-dd",new Date(this.picker[1]))],  //日期范围
                    key:this.key,//订单号、门店所属城市、洗护中心、流水号、用户手机搜索
                    payStatus:this.payStatus,//订单状态
                    payMethod:this.payMethod,//支付方式
                    businessTypeCode: this.businessTypeCode,

                };
                this.listLoading = true;
                getFinanceFun(para).then((data) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(data)){
                            this.payTypeTotal=[];
                            //支付方式金额统计
                            var payTypeTotal = data.data.financePaypayTypeTotal;
                            if(payTypeTotal!=null){
                                payTypeTotal.total=util.moneyFormat((payTypeTotal.total+payTypeTotal.gapPrice).toFixed(2))+"元";
                                payTypeTotal.kpay=util.moneyFormat(payTypeTotal.kpay.toFixed(2))+"元";
                                payTypeTotal.kwx=util.moneyFormat(payTypeTotal.kwx.toFixed(2))+"元";
                                payTypeTotal.kunionpay=util.moneyFormat(payTypeTotal.kunionpay.toFixed(2))+"元";
                                payTypeTotal.spay=util.moneyFormat(payTypeTotal.spay.toFixed(2))+"元";
                                payTypeTotal.swx=util.moneyFormat(payTypeTotal.swx.toFixed(2))+"元";
                                payTypeTotal.pospay=util.moneyFormat(payTypeTotal.pospay.toFixed(2))+"元";
                                payTypeTotal.payscan=util.moneyFormat(payTypeTotal.payscan.toFixed(2))+"元";
                                payTypeTotal.wxscan=util.moneyFormat(payTypeTotal.wxscan.toFixed(2))+"元";
                                payTypeTotal.gzh=util.moneyFormat(payTypeTotal.gzh.toFixed(2))+"元";
                                payTypeTotal.xcx=util.moneyFormat(payTypeTotal.xcx.toFixed(2))+"元";
                                if(payTypeTotal.gapPrice){
                                    payTypeTotal.gapPrice=util.moneyFormat(payTypeTotal.gapPrice.toFixed(2))+"元";
                                }else{
                                    payTypeTotal.gapPrice='0.00元';
                                }
                                this.payTypeTotal.push(payTypeTotal);
                            }
                            //console.log(payTypeTotal);
                            //支付方式
                            var financeResDto = data.data.financeResDto;
                            //console.log(financeOrder);
                            this.totalPage = financeResDto.paginationInfo.total;
                            var list = financeResDto.list;
                            //console.log(list);
                            for(var i=0;i<list.length;i++){
                                //财务折扣(实际支付的钱+使用森特币数*森特币实际价值/订单价格)
                                //console.log(list[i].paidPrice,list[i].useSintercurrency,list[i].initialPrice);
                                if(list[i].paidPrice>0){
                                    list[i].cwzk=parseFloat((list[i].paidPrice+list[i].useSintercurrency*0)/list[i].initialPrice).toFixed(2);
                                }
                                //订单状态
                                list[i].orderStatus=util.getOrderStatus(list[i].orderStatus);
                                //实际价格
                                list[i].initialPrice=util.moneyFormat(list[i].initialPrice.toFixed(2))+"元";
                                //支付价格
                                var paidPrice = util.moneyFormat(list[i].paidPrice.toFixed(2));
                                list[i].paidPrice=list[i].payStatus==1?paidPrice+"元":'';
                                //支付类型
                                list[i].payMethod=util.getPayType(list[i].payMethod);
                                //支付状态
                                if(list[i].payStatus==0){
                                    list[i].payStatus='未支付';
                                    list[i].payTime=null;
                                }else if(list[i].payStatus==1){
                                    list[i].payStatus='已支付';
                                }
                                //是否开发票
                                if(list[i].vId){
                                    list[i].vid='已申请';
                                }else {
                                    list[i].vid='未申请';
                                }
                                //支付时间
                                if(list[i].payTime!=null && list[i].payTime!=''){
                                    list[i].payTime = util.dateFormat('yyyy-MM-dd hh:mm:ss',new Date(list[i].payTime));
                                }



                            }
                            this.orderList=list;
                        }
                    }
                    ,data => { this.listLoading = false;}
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
                this.getFinance();
            },
            //处理分页条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.getFinance();
            },
            handleClick(row) {
                this.$router.push({path: '/orderSelf/queryDetailById?id='+row.id+'&orderStatus='+row.os});
            },
            //导出
            exportFinance(){
                /*var para= {
                    cityName: util.getMyCity(this.city),
                    betweenDate: [util.dateFormat("yyyy-MM-dd", new Date(this.picker[0])), util.dateFormat("yyyy-MM-dd", new Date(this.picker[1]))],  //日期范围
                    key: this.key,//订单号、门店所属城市、洗护中心、流水号、用户手机搜索
                    payStatus: this.payStatus,//支付方式
                    payType: this.payType,//订单状态
                };
                exportFinanceFun(para).then((data) => {
                        if (this.GLOBAL.isResonseSuccess(data)){
                            //data.data.unshift({id: null, regionName: '所有城市'});
                            //this.cityList=data.data;
                        }
                    }
                );*/

                var url = process.env.API_ROOT;
                url+='/finance/exportFinance?pageFlag=false';
                if(this.cityName){
                    url+='&cityName='+util.getCity(this.cityName);
                }
                url+='&betweenDate='+[util.dateFormat("yyyy-MM-dd",new Date(this.picker[0])),util.dateFormat("yyyy-MM-dd",new Date(this.picker[1]))];
                if(this.key){
                    url+='&key='+this.key;
                }
                if(this.payStatus){
                    url+='&payStatus='+this.payStatus;
                }
                if(this.payMethod){
                    url+='&payMethod='+this.payMethod;
                }if(this.businessTypeCode&&this.businessTypeCode){
                    url+='&businessTypeCode='+this.businessTypeCode;
                }
                //window.open(url);
                location=url;
            }
        },
        mounted(){
            //获取注册城市列表
            this.getCityList();
            //财务列表
            this.getFinance();
        }
    }

</script>

