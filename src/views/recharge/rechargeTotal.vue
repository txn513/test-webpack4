<template>
    <section>
        <div class="toolbar el-col el-col-24" style="margin-top: 20px;text-align:right;">
            <el-input size="medium" v-model.trim="phone" placeholder="输入电话进行搜索" clearable
                      style="width:200px;"></el-input>
            &nbsp;&nbsp;
            <el-date-picker
                    value-format="yyyy-MM-dd"
                    v-model="picker"
                    type="daterange"
                    :picker-options="pickerOptions"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    align="right">
            </el-date-picker>&nbsp;
            &nbsp;&nbsp;
            <!--支付方式-->
            <el-select v-model="paymentType" placeholder="支付方式" style="width:120px;">
                <el-option label="所有" value=""></el-option>
                <el-option label="微信" value="0"></el-option>
                <el-option label="支付宝" value="1"></el-option>
            </el-select>&nbsp;
            &nbsp;&nbsp;
            <!--提交按钮-->
            <el-button type="primary" v-on:click="getResult(true)" :loading="listLoading" icon="el-icon-search">查询</el-button>
            &nbsp;&nbsp;
            <!--导出-->
            <el-button type="primary" style="float: right;margin-bottom: 30px;margin-top: 30px;" @click="exportRecharge">&nbsp;&nbsp;导出&nbsp;&nbsp;</el-button>
        </div>

        <!--统计信息-->
        <el-table border :data="totalInfo" style="width: 80%;margin-top: 30px;margin-left: 9%;">
            <el-table-column align="center" prop="memberCount" label="充值用户数量"></el-table-column>
            <el-table-column align="center" prop="rechargeCount" label="充值笔数"></el-table-column>
            <el-table-column align="center" prop="paymentAmountCount" label="支付总金额(元)"></el-table-column>
            <el-table-column align="center" prop="sinterCurrencyCount" label="森特币总数"></el-table-column>
        </el-table>

        <!--列表-->
        <el-table border v-loading="listLoading" element-loading-text="拼命加载中" :data="list" style="width: 100%;margin-top: 30px;">
            <el-table-column type="index" align="center" width="50"></el-table-column>
            <el-table-column align="center" show-overflow-tooltip prop="paymentId" width="260" label="流水号"></el-table-column>
            <el-table-column align="center" prop="phone" label="手机号"></el-table-column>
            <el-table-column align="center" prop="createTime" label="充值时间" :formatter="dateFormat"></el-table-column>
            <el-table-column align="center" prop="paymentAmount" label="付款金额(元)"></el-table-column>
            <el-table-column align="center" prop="sinterCurrencyCount" label="森特币数量"></el-table-column>
            <el-table-column align="center" prop="paymentTypeStr" label="支付类型"></el-table-column>
            <el-table-column align="center" width="260" prop="chargeOrderId" label="充值交易号"></el-table-column>
        </el-table>

        <!--分页工具条-->
        <el-col :span="24" style="margin-top: 10px">
            <el-pagination
                    background
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
    import util from '../../common/js/util';
    import {getRechargeListFun} from '../../api/api';
    import {getRechargeTotalFun} from '../../api/api';

    export default {
        data() {

            return {
                pageNum: 1, //当前页码
                pageSize: 10,//页数
                total: 0,
                list: [],
                listLoading: false,
                phone: '',
                paymentType:null,
                totalInfo:[],

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
                picker: [
                    //new Date(new Date(new Date().getTime()-30*24*60*60*1000).getFullYear(), new Date(new Date().getTime()-30*24*60*60*1000).getMonth(), new Date(new Date().getTime()-30*24*60*60*1000).getDate()),//前30天日期
                    //new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) //当天日期
                ],
            };
        },
        methods: {
            //点击查询
            getResult() {
                this.pageNum = 1;
                //充值记录
                this.getRechargeList();
                //充值统计信息
                this.getRechargeTotal();
            },
            //切换页数
            handleCurrentChange(val) {
                this.pageNum = val;
                //充值记录
                this.getRechargeList();
                //充值统计信息
                this.getRechargeTotal();
            },
            //处理分页条数
            handleSizeChange(val) {
                this.pageSize = val;
                //充值记录
                this.getRechargeList();
                //充值统计信息
                this.getRechargeTotal();
            },
            //时间格式化
            dateFormat: function (row, column) {
                var dateTime = row[column.property];
                if (!dateTime) {
                    return "";
                }
                return util.formatDate.format(new Date(dateTime), 'yyyy-MM-dd hh:mm:ss');
            },

            //获取充值列表
            getRechargeList(flag) {
                let para = {
                    pageInfo: {
                        pageNum: flag === true ? 1 : this.pageNum,
                        pageSize: this.pageSize,
                    },
                    phone: this.phone,
                    begenDate: this.picker[0] != null && this.picker[0] != '' ? this.picker[0] + " 00:00:00" : '',
                    endDate: this.picker[1] != null && this.picker[1] != '' ? this.picker[1] + " 23:59:59" : '',
                    paymentType: this.paymentType,
                };
                this.listLoading = true;
                getRechargeListFun(para).then((res) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(res)) {
                            this.list = res.data.list;
                            this.total = res.data.paginationInfo.total;
                        }
                    }
                    , res => {
                        this.listLoading = false;
                    }
                );
            },

            //获取充值统计信息
            getRechargeTotal(flag) {
                let para = {
                    phone: this.phone,
                    begenDate: this.picker[0] != null && this.picker[0] != '' ? this.picker[0] + " 00:00:00" : '',
                    endDate: this.picker[1] != null && this.picker[1] != '' ? this.picker[1] + " 23:59:59" : '',
                    paymentType: this.paymentType,
                };
                getRechargeTotalFun(para).then((res) => {
                        if (this.GLOBAL.isResonseSuccess(res)) {
                            //console.log(res.data);
                            this.totalInfo=[];
                            this.totalInfo.push(res.data);
                        }
                    }
                );
            },
            //导出
            exportRecharge(){
                var url = process.env.API_ROOT;
                url+='/exportRecharge?pageFlag=false';

                if(this.phone){
                    url+='&phone='+this.phone;
                }
                if(this.paymentType){
                    url+='&paymentType='+this.paymentType;
                }
                if(this.picker[0]!=null&&this.picker[0]!=''&&this.picker[1]!=null&&this.picker[1]!=''){
                    url+='&begenDate='+this.picker[0] + " 00:00:00";
                    url+='&endDate='+this.picker[1] + " 23:59:59";
                }
                //window.open(url);
                location=url;
            }

        },
        mounted() {

            //获取充值列表
            this.getRechargeList();
            //充值统计信息
            this.getRechargeTotal();
        }
    }
</script>
