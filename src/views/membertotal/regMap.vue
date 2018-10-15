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
                    注册会员数:&nbsp;<span style="color:#4D98DD">{{ countAll }}个</span>&nbsp;&nbsp;&nbsp;
                    获取坐标会员:&nbsp;<span style="color:#4D98DD">{{ count }}个</span>&nbsp;&nbsp;&nbsp;
                </el-form-item>
                <el-form-item >
                    <!--地区选择-->
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
                </el-form-item>
                <el-form-item >
                    <el-button type="primary" v-on:click="getRegMap">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <div class="toolbar el-col el-col-24" v-loading="listLoading" style="margin:0;padding:0;">
            <div id="allmap"></div>
        </div>
    </div>

</template>
<script>
    import BMap from 'BMap';
    import {getRegMapFun} from '../../api/api';
    import {getCityListFun} from '../../api/api';
    import util from '../../common/js/util';
    import selectGroup from '@/components/selectGroup';

    export default {
        components:{
            selectGroup
        },
        data() {
            return {
                data_info:[],//坐标点
                options1: [],//地区
                value1: '深圳市',
                listLoading: false,
                count:0,//有效注册会员的数量
                countAll:0,//所有注册会员的数量
                map: null,
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
                    new Date(new Date(new Date().getTime()-3*24*60*60*1000).getFullYear(), new Date(new Date().getTime()-3*24*60*60*1000).getMonth(), new Date(new Date().getTime()-3*24*60*60*1000).getDate()),//前三天日期
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
                            this.options1=data.data;
                        }
                    }
                    ,data => { this.listLoading = false;}
                );
            },

            //百度地图api
            getRegMap() {
                this.showMap();//初始化地图

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
                getRegMapFun(para).then((data) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(data)){
                            this.data_info = data.data.list;
                            //this.options1=data.data.city;
                            this.count=data.data.count;
                            this.countAll=data.data.countAll;

                            //百度地图api
                            if(data.data.list.length>0){
                                //有数据
                                this.map.centerAndZoom(new BMap.Point(this.data_info[0].lon, this.data_info[0].lat), 12);//中心地标
                                //var points = [];  // 添加海量点数据
                                for(var i=0;i<this.data_info.length;i++){
                                    var marker = new BMap.Marker(new BMap.Point(this.data_info[i].lon,this.data_info[i].lat));  // 创建标注
                                    this.map.addOverlay(marker);// 将标注添加到地图中

                                    //海量数据显示
                                    //points.push(new BMap.Point(this.data_info[i].lon,this.data_info[i].lat));
                                }

                                //海量数据显示
                                /*
                                var options = {
                                    size: 4,
                                    shape: 7,
                                    color: '#d340c3'
                                }
                                var pointCollection = new BMap.PointCollection(points, options);  // 初始化PointCollection
                                this.map.addOverlay(pointCollection);  // 添加Overlay
                                */
                            }else{
                                //没有数据
                                this.open('暂无数据');//弹出框提示
                                this.showMap();   // 没有数据,初始化地图
                            }

                        }
                    }
                    ,data => { this.listLoading = false;}
                );
            },
            showMap(){
                // 百度地图API功能
                this.map = new BMap.Map("allmap");   // 创建地图实例
                var point = new BMap.Point(113.957738, 22.556651);  // 创建点坐标
                this.map.centerAndZoom(point, 12);                 // 初始化地图，设置中心点坐标和地图级别
                this.map.enableScrollWheelZoom();
                this.map.addControl(new BMap.NavigationControl());  //添加默认缩放平移控件

                //控制地图高度
                document.getElementById("allmap").style.height=document.documentElement.clientHeight-210+"px";

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
            this.showMap();
            this.getRegMap();
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