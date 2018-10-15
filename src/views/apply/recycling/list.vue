<template>
    <section>


        <!--<div class="toolbar el-col el-col-24" style="margin-top: 20px;text-align:right;">-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">

            <!--<div>-->
            <el-form align="right" :inline="true"  class="demo-form-inline">
                <el-form-item>
                    <template>
                        <select-group :num ="number" :select="isSelect" @getresult = 'getResultNumber'></select-group>
                    </template>
                </el-form-item>
                &nbsp时间：
                <el-date-picker
                        v-model="queryTime"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        align="right">
                </el-date-picker>
                &nbsp订单号：<el-input size="medium" v-model="orderId" placeholder="订单号" style="width:170px;"></el-input>
                &nbsp会员号码：<el-input size="medium" v-model="phoneQu" placeholder="会员号码" style="width:170px;"></el-input>
                &nbsp业务类型：
                <el-select v-model="applyTypeQu" clearable style="width:120px;">
                    <el-option
                            v-for="item in applyTypeList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            :disabled="item.disabled">
                    </el-option>
                </el-select>
                &nbsp订单状态：
                <el-select v-model="orderStatus" clearable style="width:120px;">
                    <el-option
                            v-for="item in payStatusOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>

                &nbsp;&nbsp;
                <!--提交按钮-->
                <el-button type="primary"  v-on:click="searchByCondition" :loading="listLoading" >查询</el-button>
            <!--</div>-->
            </el-form>
        <!--</div>-->
        </el-col>

        <el-table
                v-loading="listLoading"
                element-loading-text="拼命加载中"
                :data="orderListData"
                style="width: 100%;margin-top: 30px;">
            <el-table-column
                    prop="id"
                    label="订单编号"
                    show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
                    prop="applyType"
                    label="业务类型"
                    show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
                    prop="createTime"
                    label="提交时间"
                    :formatter="dateFormat"
                    show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
                    prop="phone"
                    label="会员电话号码"
                    show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
                    prop="applyStatus"
                    label="订单状态"
                    show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
                    prop="businessTypeCode"
                    label="业务来源"
                    :formatter="formatBusinessType"
                    show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
                    label="操作"
                    show-overflow-tooltip

                    fixed="right">
                <template slot-scope="scope">
                    <el-button @click="handlePend(scope.row)" type="primary"  size="mini">查看详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--订单列表分页-->
        <el-col :span="24" style="margin-top: 10px">
            <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageNum"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total=total style="float: right">
            </el-pagination>
        </el-col>




    </section>
</template>

<script>
    import util from '../../../common/js/util'
    import {getConsignmentApplyList} from '../../../api/api';
    import selectGroup from '@/components/selectGroup';
    export default {
        data() {
            return {
                number:-1,//后台传过来的十进制数据
                isSelect: true,//是否可选
                businessTypeCode: -1,
                //订单列表分页
                pageSize:10,
                page: 1,
                total:0,
                pageNum: 1, //当前页码
                listLoading: false,
                pageNum1: 1, //当前页码

                //查询条件参数
                orderId:"",//订单id
                orderStatus:'',//订单状态
                queryTime: [],//搜索日期范围
                applyTypeQu: '',//
                phoneQu: '',//

                //列表数据
                // businessTypeCode:"",
                orderListData: [],//订单主信息列表数据
                id:"",//订单编号
                phone:"",//电话号码
                createTime:"",//提交时间
                applyStatus:'',//申请状态
                applyType:'',//业务类型
                //业务类型集合数据列表
                applyTypeList: [
                    {
                        value: 1,
                        label: '回收'
                    },{
                        value: 2,
                        label: '寄卖',
                    },
                    {
                        value: 3,
                        label: '鉴定',
                    },
                    {
                        value: 4,
                        label: '租赁',
                    },
                    {
                        value: 5,
                        label: '质押',
                    },
                    {
                        value: 6,
                        label: '置换',
                    }
                ],

                //订单状态数据集合
                payStatusOptions: [
                    {
                        value: 0,
                        label: '待审核'
                    },{
                        value: 10,
                        label: '待确认寄送'
                    },
                    {
                        value: 20,
                        label: '待鉴定'
                    },
                    {
                        value: 30,
                        label: '待处理'
                    },
                    {
                        value: 40,
                        label: '待寄回'
                    },
                    {
                        value: 50,
                        label: '待发货'
                    },
                    {
                        value: 60,
                        label: '已发货'
                    },
                    {
                        value: 70,
                        label: '待打款'
                    },
                    {
                        value: 80,
                        label: '待收款'
                    },
                    {
                        value: 90,
                        label: '待退还'
                    },
                    {
                        value: 100,
                        label: '超时未退'
                    },
                    {
                        value: 110,
                        label: '过期未还款'
                    },
                    {
                        value: 120,
                        label: '已退还'
                    },
                    {
                        value: 130,
                        label: '已完成'
                    },
                    {
                        value: 140,
                        label: '已关闭'
                    },
                ],

            }
        },
        methods: {

            //分页显示所有订单数据列表
            consignmentApplyList(){
                var para = {
                    businessTypeCode: this.businessTypeCode,
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    },
                    id: this.orderId,
                    applyStatus: this.orderStatus,
                    applyType: this.applyTypeQu,
                    phone: this.phoneQu,
                    startTime:(this.queryTime && this.queryTime.length > 0)?this.queryTime[0]:'',
                    endTime:(this.queryTime && this.queryTime.length > 0)?this.queryTime[1]:'',
                };

                this.listLoading = true;
                getConsignmentApplyList(para).then((data) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(data)){
                            this.total = data.data.paginationInfo.total;
                            this.orderListData=data.data.list;
                            var d = data.data.list;
                            for(var i=0;i<d.length;i++){
                                if(d[i].applyType == 1 ){
                                    d[i].applyType = "回收";
                                }else if(d[i].applyType == 2 ){
                                    d[i].applyType = "寄卖";
                                }else if(d[i].applyType == 3 ){
                                    d[i].applyType = "鉴定";
                                }else if(d[i].applyType == 4 ){
                                    d[i].applyType = "租赁";
                                }else if(d[i].applyType == 5 ){
                                    d[i].applyType = "质押";
                                }else if(d[i].applyType == 6 ){
                                    d[i].applyType = "置换";
                                }else{
                                    d[i].applyType = "未知的类型";
                                }
                                if(d[i].applyStatus == 0 ){
                                    d[i].applyStatus = "待审核";
                                }else if(d[i].applyStatus == 10 ){
                                    d[i].applyStatus = "待确认寄送";
                                }else if(d[i].applyStatus == 20 ){
                                    d[i].applyStatus = "待鉴定";
                                }else if(d[i].applyStatus == 30 ){
                                    d[i].applyStatus = "待处理";
                                }else if(d[i].applyStatus == 40 ){
                                    d[i].applyStatus = "待寄回";
                                }else if(d[i].applyStatus == 50 ){
                                    d[i].applyStatus = "待发货";
                                }else if(d[i].applyStatus == 60 ){
                                    d[i].applyStatus = "已发货";
                                }else if(d[i].applyStatus == 70 ){
                                    d[i].applyStatus = "待打款";
                                }else if(d[i].applyStatus == 80 ){
                                    d[i].applyStatus = "待收款";
                                }else if(d[i].applyStatus == 90 ){
                                    d[i].applyStatus = "待退还";
                                }else if(d[i].applyStatus == 100 ){
                                    d[i].applyStatus = "超时未退";
                                }else if(d[i].applyStatus == 110 ){
                                    d[i].applyStatus = "过期未还款";
                                }else if(d[i].applyStatus == 120 ){
                                    d[i].applyStatus = "已退还";
                                }else if(d[i].applyStatus == 130 ){
                                    d[i].applyStatus = "已完成";
                                }else if(d[i].applyStatus == 140 ){
                                    d[i].applyStatus = "已关闭";
                                }else{
                                    d[i].applyStatus = "未知的类型";
                                }
                            }
                        }
                    }
                    , data => {
                        this.listLoading = false;
                    }
                );
            },

            //条件查询分页bug优化
            searchByCondition(){
                this.pageNum=1;
                this.consignmentApplyList();
            },


            //点击查看按钮,跳转到详情界面
            handlePend(row){
                if(row.applyType == "回收"){
                    this.$router.push({path: '/recyclingDetail?id='+row.id+'&applyStatus='+row.applyStatus});
                }
                if(row.applyType == "寄卖"){
                    this.$router.push({path: '/consignmentDetail?id='+row.id+'&applyStatus='+row.applyStatus});
                }
                if(row.applyType == "鉴定"){
                    this.$router.push({path: '/appraisalDetail?id='+row.id+'&applyStatus='+row.applyStatus});
                }
                if(row.applyType == "置换"){
                    this.$router.push({path: '/substitutionDetail?id='+row.id+'&applyStatus='+row.applyStatus});
                }
                if(row.applyType == "质押"){
                    this.$router.push({path: '/pledgeDetail?id='+row.id+'&applyStatus='+row.applyStatus});
                }
                if(row.applyType == "租赁"){
                    this.$router.push({path: '/leaseDetail?id='+row.id+'&applyStatus='+row.applyStatus});
                }

            },

            //条件查询分页bug优化
            // getProductListByCondition(){
            //     this.page1=1;
            //     this.selectGoodsList();
            // },


            //<!--订单列表分页-->
            handleCurrentChange(val) {
                this.pageNum = val;
                this.consignmentApplyList();
            },
            //处理分页条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.consignmentApplyList();
            },
            //当前时间格式化
            dateFormat:function(row, column) {
                var dateTime = row[column.property];
                if (!dateTime) {
                    return "";
                }
                return util.formatDate.format(new Date(dateTime), 'yyyy-MM-dd hh:mm:ss');
            },
            formatBusinessType: function (row) {
                switch (row.businessTypeCode){
                    case 1:
                        return "洗护";
                    case 2:
                        return "名品";
                    case 4:
                        return "态奢";
                    case 8:
                        return "悦生活";
                }
                return '未知';
            },
            getResultNumber(result){
                this.businessTypeCode = result;
            },


        },
        mounted() {
            this.consignmentApplyList();
        },
        components: {
            selectGroup
        }
    }
</script>
<style scoped>
    #toolbar{
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }
</style>