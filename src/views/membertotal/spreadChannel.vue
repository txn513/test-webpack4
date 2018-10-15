<template>
    <section>
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form align="right" :inline="true"  class="demo-form-inline">
                <el-form-item>
                    <template>
                        <select-group :num ="number" :select="isSelect" @getresult = 'getResultNumber'></select-group>
                    </template>
                </el-form-item>
                <el-form-item >
                    <!--地区选择-->
                    <el-select v-model="value1" placeholder="店铺所属城市" filterable >
                        <el-option
                                v-for="item in options1"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item >
                    <el-date-picker
                            v-model="value2"
                            type="daterange"
                            :picker-options="pickerOptions"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            align="right">
                    </el-date-picker>
                </el-form-item>
                <el-form-item >
                    <el-button type="primary" v-on:click="getSpreadChannel">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-table
                v-loading="listLoading"
                :data="tableData"
                :span-method="objectSpanMethod"
                border
                style="width: 100%;margin-top: 30px;">
            <el-table-column
                    sortable
                    prop="cityName"
                    label="城市">
            </el-table-column>
            <el-table-column
                    sortable
                    align="center"
                    prop="chaType"
                    label="渠道">
            </el-table-column>
            <el-table-column
                    sortable
                    align="center"
                    prop="downLoadCount"
                    label="推广数">
            </el-table-column>
            <el-table-column
                    sortable
                    align="center"
                    label="操作">
                <template slot-scope="scope">
                    <el-button @click="handleInfo(scope.$index, scope.row)" type="text">详情</el-button>
                </template>
            </el-table-column>

        </el-table>
    </section>
</template>

<script>
    import {getSpreadChannelFun} from '../../api/api';
    import {getCityListFun} from '../../api/api';
    import util from '../../common/js/util';
    import selectGroup from '@/components/selectGroup';

    export default {
        components:{
            selectGroup
        },
        data() {
            return {
                tmpIndex:'',
                tableData:[],//表格数据
                options1: [],//地区列表
                value1: '',//默认地区
                listLoading: false,
                number: -1,//后台传过来的十进制数据
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
                //d3:new Date(new Date().getTime()-3*24*60*60*1000),//取前三天日期
                value2: [
                    new Date(new Date(new Date().getTime()-30*24*60*60*1000).getFullYear(), new Date(new Date().getTime()-30*24*60*60*1000).getMonth(), new Date(new Date().getTime()-30*24*60*60*1000).getDate()),//前30天日期
                    new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) //当天日期
                ]
            };
        },
        methods:{
            getResultNumber(result){
                this.businessTypeCode = result;
            },
            //获取注册城市列表
            getCityList(){
                this.listLoading = true;
                getCityListFun(null).then((data) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(data)){
                            data.data.unshift({value: '', label: '所有城市'});
                            this.options1=data.data;
                        }
                    }
                    ,data => { this.listLoading = false;}
                );
            },

            getSpreadChannel() {
                //检查日期是是否超过一个月
                var d = this.value2[1].getTime()-this.value2[0].getTime();
                if(d>31*24*60*60*1000){
                    this.open('日期范围不能超过一个月');//弹出框提示
                    return;
                }

                var para = {
                    cityName:this.value1,
                    betweenDate:[util.dateFormat("yyyy-MM-dd",new Date(this.value2[0])),util.dateFormat("yyyy-MM-dd",new Date(this.value2[1]))],  //日期范围
                    businessTypeCode: this.businessTypeCode,
                };
                this.listLoading = true;
                getSpreadChannelFun(para).then((data) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(data)){
                            var list = data.data;
                            for(var i=0;i<list.length;i++){
                                list[i].orderPrice=util.moneyFormat(parseFloat(list[i].orderPrice).toFixed(2));
                                list[i].payPrice=util.moneyFormat(parseFloat(list[i].payPrice).toFixed(2));
                                //小计
                                list[i].total=list[i].app+list[i].webchat;
                               if (list[i].chaType==1){
                                   list[i].chaType="微信推广";
                               }else if (list[i].chaType==0){
                                   list[i].chaType="APP推广";
                               }
                            }
                            this.tableData=list;
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
            //跳转到详情页面
            handleInfo(index, row) {
                //console.log(JSON.stringify(this.value2));
                var date = JSON.stringify(this.value2);
                this.$router.push({path: '/memberTotal/spreadChannelInfo?city='+row.cityName+'&date='+date + '&businessTypeCode=' + this.businessTypeCode});
            },

            objectSpanMethod({ row, column, rowIndex, columnIndex }) {
                if (columnIndex === 0 ||columnIndex === 6) {
                    if (rowIndex < this.tableData.length){
                     if(this.tableData.length==1){

                     }else{
                        }
                    }

                }
            },

        },
        mounted(){
            //获取注册城市列表
            this.getCityList();
            //线下推广统计
            this.getSpreadChannel();
        }
    }

</script>
