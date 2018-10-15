<template>
    <div>
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form align="right" :inline="true"  class="demo-form-inline">
                <el-form-item>
                    <template>
                        <select-group :num ="number" :select="isSelect" @getresult = 'getResultNumber'></select-group>
                    </template>
                </el-form-item>
                <el-form-item >
                    <el-select v-model="value1" placeholder="请选择地区" filterable >
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
                    <el-button type="primary" v-on:click="getRegMember">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <div class="toolbar el-col el-col-24" style="margin:0;padding:0;background: none;">
            <div id="chartLine" style="width:100%; height:400px;margin-bottom: 55px;"></div>
        </div>

        <el-row style="position:static;" v-loading="listLoading">
            <div style="margin-top:35px;"></div>
            <h1 style="font-size: 18px; ">新增明细</h1>
            <el-col :span="12">
                <div class="grid-content bg-purple" style="margin-left:250px;width:360px;">
                    <el-table
                            :default-sort = "{prop: 'number1', order: 'descending'}"
                            :data="tableData1"
                            style="width: 100%">
                        <el-table-column
                                sortable
                                prop="cityName"
                                label="城市"
                                width="180">
                        </el-table-column>
                        <el-table-column
                                sortable
                                prop="number1"
                                label="新增"
                                width="180">
                        </el-table-column>
                    </el-table>
                </div>
            </el-col>
            <el-col :span="12">
               <div class="grid-content bg-purple-light" style="width:360px;">
                    <el-table
                            :default-sort = "{prop: 'number1', order: 'descending'}"
                            :data="tableData2"
                            style="width: 100%">
                        <el-table-column
                                sortable
                                prop="idate"
                                label="日期"
                                width="180">
                        </el-table-column>
                        <el-table-column
                                sortable
                                prop="number1"
                                label="新增"
                                width="180">
                        </el-table-column>
                    </el-table>
                </div>
            </el-col>
        </el-row>
    </div>

</template>
<script>
    import selectGroup from '@/components/selectGroup';
    import {getRegMemberFun} from '../../api/api';
    import {getCityListFun} from '../../api/api';
    import echarts from 'echarts';
    import util from '../../common/js/util';
    export default {
        components:{
            selectGroup
        },
        data() {
            return {
                tableData1: [],//按城市显示表格列表
                tableData2: [],//按日期显示表格列表
                chartLine: null,
                data1:[],//日期列表
                data2:[],//条数列表
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

            getRegMember() {
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
                getRegMemberFun(para).then((data) => {
                    this.listLoading = false;
                    this.data1=[];
                    this.data2=[];
                    this.tableData1=[];
                    this.tableData2=[];
                    if (this.GLOBAL.isResonseSuccess(data)){
                        var countByCity = data.data.countByCity;//按城市统计
                        var countByDate = data.data.countByDate;//按日期统计

                        if(countByCity.length>=1){
                            //处理数据库为空或者为null的城市
                            if(countByCity[countByCity.length-1].cityName==''){
                                countByCity[countByCity.length-1].cityName='未定义';
                            }
                            if(countByCity[countByCity.length-1].number1==0){
                                countByCity.pop();
                            }

                            for(var i=0;i<countByDate.length;i++){
                                //console.log(i + ":" + JSON.stringify(obj));
                                var obj = countByDate[i];
                                var idate = obj.idate;
                                var number1 = obj.number1;

                                this.data1.push(idate);
                                this.data2.push(number1);
                            }
                        }

                        this.tableData1=countByCity;
                        this.tableData2=countByDate;

                    }
                        // 统计图表
                        this.drawLineChart();
                }
                ,data => { this.listLoading = false;}
                );
            },
            drawLineChart() {
                this.chartLine = echarts.init(document.getElementById('chartLine'));
                this.chartLine.setOption({
                    title: {
                        text: '新增用户'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data:this.data1
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name: '注册用户',
                            type: 'line',
                            stack: '总量',
                            //data: [120, 132, 101, 134, 90, 230, 210]
                            data:this.data2
                        },
                    ]
                });
            },
            open(msg) {
                this.$alert(msg, {
                    confirmButtonText: '确定',
                });
            }
        },
        mounted(){
            //获取注册城市列表
            this.getCityList();
            //统计注册会员
            this.getRegMember();
        }
    }

</script>

<style>
    body, html{
        width: 100%;
        height: 100%;
        margin:0;
        font-family:"微软雅黑";
        font-size:14px;
    }
    #allmap {
        width:100%;
        height:100%;
        overflow: hidden;
    }
    #result{
        width:100%;
    }
    li{
        line-height:28px;
    }
    .cityList{
        height: 320px;
        width:372px;
        overflow-y:auto;
    }
    .sel_container{
        z-index:9999;
        font-size:12px;
        position:absolute;
        right:37px;
        top:50px;
        width:140px;
        background:rgba(255,255,255,0.8);
        height:30px;
        line-height:30px;
        padding:5px;
    }
    .map_popup {
        position: absolute;
        z-index: 200000;
        width: 382px;
        height: 344px;
        right:0px;
        top:40px;
    }
    .map_popup .popup_main {
        background:#fff;
        border: 1px solid #8BA4D8;
        height: 100%;
        overflow: hidden;
        position: absolute;
        width: 100%;
        z-index: 2;
    }
    .map_popup .title {
        background: url("http://map.baidu.com/img/popup_title.gif") repeat scroll 0 0 transparent;
        color: #6688CC;
        font-weight: bold;
        height: 24px;
        line-height: 25px;
        padding-left: 7px;
    }
    .map_popup button {
        background: url("http://map.baidu.com/img/popup_close.gif") no-repeat scroll 0 0 transparent;
        cursor: pointer;
        height: 12px;
        position: absolute;
        right: 4px;
        top: 6px;
        width: 12px;
    }
</style>