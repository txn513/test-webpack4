
<template>
    <section>
        <div class="toolbar el-col el-col-24" style="margin-top: 20px;text-align:right;">
            &nbsp;
            <!--店铺选择-->
            <el-select v-model="shopName" placeholder="店铺名称" filterable >
                <el-option
                        v-for="item in options1"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>

            <!--日期控件-->
            <!--<span class="demonstration">带快捷选项</span>-->
            <el-date-picker
                    v-model="value2"
                    type="daterange"
                    :picker-options="pickerOptions"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    align="right">
            </el-date-picker>

            <!--提交按钮-->
            <el-button type="primary" plain v-on:click="getSpreadChannelInfo" :loading="listLoading" icon="el-icon-search">查询</el-button>
        </div>

        <template>
            <div class="hello">
                <tree-total :columns="columns" :businessTypeCode = "businessTypeCode" :tree-structure="true" :data-source="tableData"  v-loading="listLoading" :time="value2"></tree-total>
            </div>
        </template>

    </section>
</template>
<style>


</style>
<script>
    import {getSpreadChannelInfoFun} from '../../api/api';
    import util from '../../common/js/util';
    import {TreeTotal} from '../../components/treeTable'

    export default {
        data() {
            return {
                cityName:this.$route.query.city,
                value2:JSON.parse(this.$route.query.date),
                businessTypeCode:this.$route.query.businessTypeCode,
                shopName:'',
                columns: [
                    {
                        text: '渠道',
                        dataIndex: 'title',
                    },
                    {
                        text: '推广(注册会员)数',
                        dataIndex: 'count'
                    },
                ],
                tableData: [],//表格数据
                options1: [],//店铺列表
                value1: '',//默认店铺
                listLoading: false,
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

            };
        },
        components: {
            TreeTotal
        },
        methods:{
            getSpreadChannelInfo() {
                //检查日期是是否超过一个月
                var d = this.value2[1]-this.value2[0];
                if(d>31*24*60*60*1000){
                    this.open('日期范围不能超过一个月');//弹出框提示
                    return;
                }
                var para = {
                    cityName:this.cityName,
                    shopName:this.shopName,
                    betweenDate:[util.dateFormat("yyyy-MM-dd",new Date(this.value2[0])),util.dateFormat("yyyy-MM-dd",new Date(this.value2[1]))],  //日期范围
                    businessTypeCode: this.businessTypeCode,
                };
                this.listLoading = true;
                getSpreadChannelInfoFun(para).then((data) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(data)){
                            //搜索店铺的下拉列表(只初始化一次)
                            var flag = this.options1.length==0?false:true;
                            var list = data.data;

                            var arr=[];
                            var n=-1;
                            //var totalCount=list.length>0?list[0].count:0;

                            for(var i=1;i<list.length;i++){
                                var row = list[i];
                                var shopName=row.shopName;
                                var userName=row.userName;
                                var chaType=row.chaType;
                                var count=row.count;

                                var chaName = chaType==0?'App':'微信';
                                var tempArr= userName.split('_');
                                var sprId=row.sprId;//渠道信息id
                                var uname=tempArr[1];

                                var shopRow={};
                                if(shopName!=-1&&userName==-1&&chaType==-1){
                                    n++;
                                    shopRow.title=shopName;
                                    shopRow.count=count;
                                    shopRow.children=[];
                                    arr[n]=shopRow;

                                    //搜索店铺的下拉列表(只初始化一次)
                                    if(flag===false){
                                        this.options1.push({value: shopName, label: shopName});
                                        if(i<=1){
                                            this.options1.unshift({value: null, label: '所有店铺'});
                                        }
                                    }
                                }

                                var userRow={};
                                if(shopName!=-1&&userName!=-1&&chaType==-1){
                                    userRow.title=uname;
                                    userRow.count=count;
                                    userRow.children=[];
                                    arr[n].children.push(userRow);
                                }

                                var chaRow={};
                                if(shopName!=-1&&userName!=-1&&chaType!=-1){
                                    chaRow.title=chaName;
                                    chaRow.count=count;
                                    chaRow.sprId=sprId;
                                    chaRow.chaType=chaType;

                                    var index=arr[n].children.length-1;
                                    arr[n].children[index].children.push(chaRow);
                                }
                            }
                            //console.log(arr);
                            this.tableData=arr;
                        }
                    }
                    ,data => { this.listLoading = false;}
                );
            },

            open(msg) {
                this.$alert(msg, {
                    confirmButtonText: '确定',
                });
            }
        },
        mounted(){
            //线下推广统计
            this.getSpreadChannelInfo();
        }
    }

</script>
<style>
    th .cell{
        text-align: center;
    }
</style>

