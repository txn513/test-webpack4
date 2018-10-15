<template>
    <section>
        <div class="toolbar el-col el-col-12" style="margin-top: 20px;text-align:left;display: block;">
            <h3>订单信息查询</h3>
            <el-select v-model="order_city_name" placeholder="订单所属城市" filterable style="width:140px;" @change="changeCity('order')">
                <el-option value='' label="所有"></el-option>
                <el-option
                        v-for="item in cityList"
                        :key="item.value"
                        :label="item.regionName"
                        :value="item.regionName">
                </el-option>
            </el-select>

            <el-select v-model="order_servicePoint_id" placeholder="服务点" filterable style="width:140px;">
                <el-option value='' label="所有"></el-option>
                <el-option
                        v-for="item in servicePointList1"
                        :key="item.id"
                        :label="item.orgName"
                        :value="item.id">
                </el-option>
            </el-select>
            <el-input size="medium" v-model="order_id" placeholder="订单号" style="width:161px;"></el-input>
            <!--<span class="demonstration">带快捷选项</span>-->
            <p>
                &nbsp;&nbsp;订单创建时间:
                <el-date-picker
                        value-format="yyyy-MM-dd"
                        v-model="order_create_date"
                        type="daterange"
                        :picker-options="pickerOptions"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        align="right">
                </el-date-picker>
            </p>
        </div>

        <div class="toolbar el-col el-col-12" style="margin-top: 20px;text-align:left;">
            <div style="float: right">
                <h3>渠道查询</h3>
                <el-select v-model="channel_city_name" placeholder="服务点所属城市"  @change="changeCity('channel')" filterable style="width:140px;">
                    <el-option  value='' label="所有"></el-option>
                    <el-option
                            v-for="item in cityList"
                            :key="item.value"
                            :label="item.regionName"
                            :value="item.regionName">
                    </el-option>
                </el-select>

                <el-select v-model="channel_servicePoint_id" placeholder="服务点"  @change="changeServicePoint" filterable style="width:140px;">
                    <el-option value='' label="所有"></el-option>
                    <el-option
                            v-for="item in servicePointList2"
                            :key="item.id"
                            :label="item.orgName"
                            :value="item.id">
                    </el-option>
                </el-select>

                <el-select v-model="employee_id" placeholder="销售员"  filterable style="width:140px;">
                    <el-option value='' label="所有"></el-option>
                    <el-option
                            v-for="item in employeeList"
                            :key="item.id"
                            :label="item.trueName"
                            :value="item.id">
                    </el-option>
                </el-select>

                <el-select v-model="channel_type" placeholder="推广渠道" filterable style="width:140px;">
                    <el-option value='' label="所有"></el-option>
                    <el-option value="0" label="App"></el-option>
                    <el-option value="1" label="微信公众号"></el-option>
                </el-select>

                <!--<span class="demonstration">带快捷选项</span>-->
                <p>
                    用户注册时间:
                    <el-date-picker
                            value-format="yyyy-MM-dd"
                            v-model="user_create_date"
                            type="daterange"
                            :picker-options="pickerOptions"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            align="right">
                    </el-date-picker>
                </p>
            </div>
        </div>

        <div class="toolbar el-col el-col-24" style="justify-content:center;">
            <!--业务分类-->
            <select-group :num ="number" :select="isSelect" @getresult = 'getResultNumber'></select-group>&nbsp;
            <!--提交按钮-->
            <el-button type="primary" v-on:click="search()" :loading="listLoading">查询</el-button>
        </div>

        <div  v-loading="listLoading">
            <!--table-->
            <el-table
                    border
                    :data="turnoverTotalInfo"
                    prop="orderNum"
                    style="width: 80%;margin-left: 9%;margin-top: 30px;margin-bottom: 20px;">
                <el-table-column
                        align="center"
                        prop="orderNum"
                        label="订单数量">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="orderInitPrice"
                        label="订单原价">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="orderPaidPrice"
                        label="订单实际支付价格">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="sintercurrencyNum"
                        label="森特币抵扣数量">
                </el-table-column>
            </el-table>

            <!--table-->

            <el-button type="primary" style="float: right;margin-bottom: 30px;" @click="exportTurnover">&nbsp;&nbsp;导出&nbsp;&nbsp;</el-button>
            <el-table
                    :data="turnoverList"
                    style="width: 100%;">
                <el-table-column
                        align="center"
                        type="index">
                </el-table-column>
                <el-table-column
                        width="225"
                        align="center"
                        prop="id"
                        label="订单号">
                </el-table-column>
                <el-table-column
                        show-overflow-tooltip
                        sortable
                        width="210"
                        align="center"
                        prop="orderStatus"
                        label="订单状态">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="receiverName"
                        label="客户姓名">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="receiverPhone"
                        label="客户手机">
                </el-table-column>
                <el-table-column
                        sortable
                        align="center"
                        prop="initialPrice"
                        label="订单原价">
                </el-table-column>
                <el-table-column
                        sortable
                        align="center"
                        prop="useSintercurrency"
                        label="森特币抵扣数">
                </el-table-column>
                <el-table-column
                        sortable
                        align="center"
                        prop="paidPrice"
                        label="订单支付价格">
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
    import {getTurnoverFun} from '../../api/api';
    import {getTurnoverTotalInfoFun} from '../../api/api';
    import {getCityListData} from '../../api/api';
    import {getServicePointListFun} from '../../api/api';
    import {getDispatchListPage} from '../../api/api';
    import {exportTurnoverFun} from '../../api/api';
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
                turnoverList:[],//表格数据
                cityList: [],//城市列表
                servicePointList1:[],//订单服务点列表
                servicePointList2:[],//渠道服务点列表
                turnoverTotalInfo: [],//统计详情
                employeeList:[],//员工列表

                order_city_name:null,//订单所属城市
                channel_city_name:null,//
                order_servicePoint_id:null,//订单所属服务点
                channel_servicePoint_id:null,//渠道的服务点
                order_id:'',//订单号
                order_create_date:[],//订单创建时间
                user_create_date:[],//用户创建时间
                employee_id:null,//员工id
                channel_type:null,//渠道类型

                number:-1,//后台传过来的十进制数据
                isSelect: true,//是否可选
                businessTypeCode: -1,

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
                /*order_create_date: [
                    new Date(new Date(new Date().getTime()-30*24*60*60*1000).getFullYear(), new Date(new Date().getTime()-30*24*60*60*1000).getMonth(), new Date(new Date().getTime()-30*24*60*60*1000).getDate()),//前30天日期
                    new Date() //当天日期
                ],*/
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
                            /*data.data.unshift({id: null, regionName: '所有城市'});*/
                            this.cityList=data.data;
                        }
                    }
                );
            },
            getTurnover(para) {
                this.listLoading = true;
                getTurnoverFun(para).then((data) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(data)){
                            var list = data.data.list;
                            this.totalPage = data.data.paginationInfo.total;
                            for(var i=0;i<list.length;i++){
                                if(list[i].payStatus==0){
                                    list[i].payStatus='未支付';
                                }else if(list[i].payStatus==1){
                                    list[i].payStatus='已支付';
                                }
                                //订单状态
                                //list[i].orderStatus=util.getOrderStatus(list[i].orderStatus);
                                list[i].paidPrice=list[i].paidPrice>0?list[i].paidPrice:'';
                                list[i].useSintercurrency=list[i].useSintercurrency>0?list[i].useSintercurrency:'';
                            }
                            this.turnoverList=list;
                        }
                    }
                    ,data => { this.listLoading = false;}
                );
            },
            //处理分页条数
            handleSizeChange(val) {
                var pageInfo={
                    pageNum:this.page,
                    pageSize:this.val,
                };
                var queryParam=this.getQueryParam();
                queryParam.pageInfo=pageInfo;

                this.getTurnover(queryParam);
            },
            //分页查询
            handleCurrentChange(page) {
                this.page = page;
                var pageInfo={
                    pageNum:this.page,
                    pageSize:this.pageSize,
                };
                var queryParam=this.getQueryParam();
                queryParam.pageInfo=pageInfo;

                this.getTurnover(queryParam);
            },
            handleClick(row) {
                this.$router.push({path: '/orderSelf/queryDetailById?id='+row.id+'&orderStatus='+row.os});
            },
            //获取营业额统计信息
            getTurnoverTotalInfo(para){
                this.turnoverTotalInfo=[];
                getTurnoverTotalInfoFun(para).then((data) => {
                    if (this.GLOBAL.isResonseSuccess(data)){
                        this.turnoverTotalInfo.push(data.data);
                    }
                })
            },
            //选择订单所属城市
            changeCity(name){
                /*if(!this.order_city_name){
                    return false;
                }*/
                var cityName = '';
                if(name=='order'){
                    this.order_id='';
                    this.order_servicePoint_id='';
                    this.servicePointList1=[];

                    cityName=this.order_city_name;
                }else{
                    this.channel_type='';
                    this.employee_id='';
                    this.channel_servicePoint_id='';
                    this.servicePointList2=[];

                    cityName=this.channel_city_name;
                }
                cityName=util.getCity(cityName);
                //根据城市id获取服务点
                getServicePointListFun({cityName:cityName}).then((data) => {
                        if (this.GLOBAL.isResonseSuccess(data)){
                            if(name=='order'){
                                this.servicePointList1=data.data;
                            }else{
                                this.servicePointList2=data.data;
                            }

                        }
                    }
                );
            },
            //切换服务点,加载员工
            changeServicePoint(){
                this.employeeList=[];
                //根据服务点id获取员工
                if(this.channel_servicePoint_id){
                    getDispatchListPage({shopId:this.channel_servicePoint_id,pageFlag:false}).then((data) => {
                            if (this.GLOBAL.isResonseSuccess(data)){
                                this.employeeList=data.data.list;
                            }
                        }
                    );
                }

            },
            //提交查询
            search(){
                var pageInfo={
                    pageNum:1,
                    pageSize:this.pageSize,
                };
                var queryParam=this.getQueryParam();
                queryParam.pageInfo=pageInfo;

                this.getTurnover(queryParam);
                this.getTurnoverTotalInfo(queryParam);
            },
            //获取查询参数
            getQueryParam(){
                var queryParam={
                    cityName:util.getCity(this.order_city_name),   //订单所属城市
                    servicePointId:this.order_servicePoint_id,       //订单所属服务点
                    orderId:this.order_id,                         //订单号
                    employeeId:this.employee_id,                   //员工id
                    channelType:this.channel_type,                 //渠道类型
                    userStartDate:this.user_create_date&&this.user_create_date[0]?this.user_create_date[0]+" 00:00:00":'',
                    userEndDate:this.user_create_date&&this.user_create_date[1]?this.user_create_date[1]+" 23:59:59":'',
                    orderStartDate:this.order_create_date&&this.order_create_date[0]?this.order_create_date[0]+" 00:00:00":'',
                    orderEndDate:this.order_create_date&&this.order_create_date[1]?this.order_create_date[1]+" 23:59:59":'',
                    businessTypeCode: this.businessTypeCode,
                };
                return queryParam;
            },
            //导出
            exportTurnover(){
                //var url='http://127.0.0.1:4001/backstage/api/v1/order/exportTurnover?&pageFlag=false';
                var url = process.env.API_ROOT;
                url+='/finance/exportTurnover?pageFlag=false';
                if(this.order_city_name){
                    url+='&cityName='+util.getCity(this.order_city_name);
                }
                if(this.order_servicePoint_id){
                    url+='&servicePointId='+this.order_servicePoint_id;
                }
                if(this.order_id){
                    url+='&orderId='+this.order_id;
                }
                if(this.employee_id){
                    url+='&employeeId='+this.employee_id;
                }
                if(this.channel_type){
                    url+='&channelType='+this.channel_type;
                }
                if(this.order_create_date&&this.order_create_date[0]){
                    url+='&orderStartDate='+this.order_create_date[0]+" 00:00:00";
                }
                if(this.order_create_date&&this.order_create_date[1]){
                    url+='&orderEndDate='+this.order_create_date[1]+" 23:59:59";
                }
                if(this.user_create_date&&this.user_create_date[0]){
                    url+='&userStartDate='+this.user_create_date[0]+" 00:00:00";
                }
                if(this.user_create_date&&this.user_create_date[1]){
                    url+='&userEndDate='+this.user_create_date[1]+" 23:59:59";
                }if(this.businessTypeCode&&this.businessTypeCode){
                    url+='&businessTypeCode='+this.businessTypeCode;
                }
                location=url;
            }
        },
        mounted(){
            //获取所服务点所有城市
            this.getCityList();

            var para = {
                pageInfo:{
                    pageNum:1,
                    pageSize:this.pageSize,
                },
                //orderStartDate:util.dateFormat("yyyy-MM-dd",this.order_create_date[0])+" 00:00:00",
                //orderEndDate:util.dateFormat("yyyy-MM-dd",this.order_create_date[1])+" 23:59:59"
            };

            //营业额列表
            this.getTurnover(para);

            //营业额统计
            this.getTurnoverTotalInfo(para);
        }
    }

</script>

<style>

</style>