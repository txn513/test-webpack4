<template>
    <div>
        <div id="righttool" class ="stationdetail">
            <div><span>服务点名称：</span><label>{{stationData.name}}</label></div>
            <div><span>城市：</span><label>{{stationData.cityName}}</label></div>
            <div><span>地址：</span><label>{{stationData.address}}</label></div>
            <div><span>性质：</span><label>{{stationData.name}}</label></div>

            <!--
            <div><span>营业时间：</span><label>{{stationData.businessTime}}</label></div>
            <div><span>高峰时间：</span><label>{{stationData.rushTime}}</label></div>
            -->
            <div>
                <span>营业时间：</span>
                <label >
                    <p v-for="item in openingTimes" style="margin:0 180px;padding:0;">
                        {{item.value2}}&nbsp;-&nbsp;{{item.value3}}&nbsp;&nbsp;{{item.value1}}
                        <span v-if="item.value4" style="width:40px;">开启</span>
                        <span v-else style="width:40px;">关闭</span>
                    </p>
                </label>
            </div>
            <div>
                <span>高峰时间：</span>
                <label >
                    <p v-for="item in fastigiumTimes" style="margin:0 180px;padding:0;">
                        {{item.value2}}&nbsp;-&nbsp;{{item.value3}}&nbsp;&nbsp;{{item.value1}}
                        <span v-if="item.value4" style="width:40px;">开启</span>
                        <span v-else style="width:40px;">关闭</span>
                    </p>
                </label>
            </div>

            <div><span>上门取件：</span><label v-if="stationData.visit == 0">关闭</label><label v-else>开启</label></div>
            <div><span>智能柜取件：</span><label v-if="stationData.cabnet == 0">关闭</label><label v-else>开启</label></div>
            <div><span>用户自送门店：</span><label v-if="stationData.scene == 0">关闭</label><label v-else>开启</label></div>
            <!--<div><span>加工中心：</span><label>{{stationData.productName}}</label></div>-->
            <div><span>手机：</span><label>{{stationData.mobile}}</label></div>
            <div><span>经度：</span><label>{{stationData.lng}}</label></div>
            <div><span>纬度：</span><label>{{stationData.lat}}</label></div>
            <div><span>备注：</span><label>{{stationData.desc}}</label></div>
        </div>
        <div style="text-align: right;"><el-button style="width: 120px; text-align: center" type="primary" plain v-on:click="editStation" :loading="listLoading">编辑服务点</el-button>
            <el-button style="width: 120px;" type="primary" plain v-on:click="editPartition" :loading="listLoading">编辑分区</el-button></div>
        <div class="toolbar el-col el-col-24" v-loading="loadingMap" style="margin:20px 0px 0px 0px;padding:0;">
            <div id="allmap"></div>
        </div>
    </div>
</template>
<script>
    import BMap from 'BMap';
    import BMapLib from 'BMapLib';
    import {getServicePartitionsFun} from '../../api/api';
    import {getStationDetailFun} from '../../api/api';
    import util from '../../common/js/util';
/*    import { ElButton, ElInput } from 'element-ui'; */

    export default {

        data() {
            return {
                stationData : {},
                listLoading: false,
                loadingMap:false,
                map: null,
                dManager : null,
                DefaultStrokeColor : "#6961fb",
                DefaultFillColor : "#e6e6e6",

                openingTimes:[],//营业时间
                fastigiumTimes:[],//高峰时间

                styleOptions : {
                    strokeColor : this.DefaultStrokeColor, //边线颜色。
                    fillColor : this.DefaultFillColor, //填充颜色。当参数为空时，圆形将没有填充效果。
                    strokeWeight : 2, //边线的宽度，以像素为单位。
                    strokeOpacity : 0.8, //边线透明度，取值范围0 - 1。
                    fillOpacity : 0.6, //填充的透明度，取值范围0 - 1。
                    strokeStyle : 'solid' //边线的样式，solid或dashed。
                },
            };
        },
        methods:{
            loadStationData() {
                let para = {};
                var sid = this.$route.query.id;
                //sid = 8;
                para.id = sid;
                getStationDetailFun(para).then((data) => {
                    if (this.GLOBAL.isResonseSuccess(data)) {
                        // 设置数据
                        var sdata = data.data;
                        this.stationData = {
                            sid: sdata.id,
                            name: sdata.shopName,
                            cityName: sdata.cityName,
                            address: sdata.address,
                            //stationData.businessTime = sdata.
                            //stationData.rushTime = sdata.
                            visit: sdata.pickupEnableFlag,
                            cabnet: sdata.cabinetEnabledFlag,
                            scene: sdata.sendStoresEnabledFlag,
                            //stationData.productName = sdata.
                            mobile: sdata.telephone,
                            lng: sdata.longitude,
                            lat: sdata.latitude,
                            desc: sdata.remark,
                            partlist: []
                        };


                        //营业时间和高峰时间
                        if(sdata.openingTime!=''){
                            this.openingTimes=JSON.parse(sdata.openingTime);
                        }
                        if(sdata.fastigiumTime!=''){
                            this.fastigiumTimes=JSON.parse(sdata.fastigiumTime);
                        }
                    }

                    this.stationData.partlist = [];
                    let ppara = {};
                    ppara.sids = this.stationData.sid;
                    getServicePartitionsFun(ppara).then((pdata) => {
                            if (this.GLOBAL.isResonseSuccess(pdata)) {
                                var parts = pdata.data;
                                if (parts && parts.length > 0) {
                                    for (var i = 0; i < parts.length; i++) {
                                        this.stationData.partlist.push({
                                            pname: parts[i].name,
                                            pid: parts[i].id,
                                            selected: false,
                                            points: this.converToJson(parts[i].path)
                                        });
                                    }
                                }
                            }
                            this.initCityPartitions();
                        }
                        , data => {
                        });
                }, data => {});
            },
            converToJson(js){
                var rs = [];
                if(!js || js == "")
                    return [];
                var ps = js.split(",");
                for (var i = 0 ; i < ps.length - 1; i++) {
                    var itm = ps[i];
                    var ss = itm.split(" ");
                    rs.push({lng:parseFloat(ss[0]),lat:parseFloat(ss[1])});
                }
                return rs;
            },
            initCityPartitions() {
                this.showMap();
                this.clearOverlays();
                if (this.stationData.partlist != null && this.stationData.partlist.length > 0) {
                    for (var j = 0; j < this.stationData.partlist.length; j++) {
                        var ps = this.stationData.partlist[j];
                        var ponts = [];
                        for (var k = 0; k < ps.points.length; k++) {
                            ponts.push(new BMap.Point(ps.points[k].lng, ps.points[k].lat));
                        }
                        var polygon = new BMap.Polygon(ponts, this.styleOptions);
                        this.map.addOverlay(polygon);
                    }
                }
                this.resetDefaultOverlayer();
            },
            showMap(){
                // 创建Map实例
                this.loadingMap = true;
                this.map = new BMap.Map("allmap",{enableMapClick:false});
                this.map.centerAndZoom(this.stationData.cityName, 13);
                this.map.enableScrollWheelZoom();
                this.loadingMap = false;
                var styleOptions = {strokeColor : this.DefaultStrokeColor,fillColor : this.DefaultFillColor,strokeWeight : 2,strokeOpacity : 0.8,fillOpacity : 0.6,strokeStyle : 'solid'};
                //实例化鼠标绘制工具
                this.dManager = new BMapLib.DrawingManager(this.map, {
                    isOpen : false, //是否开启绘制模式
                    enableDrawingTool : false, //是否显示工具栏
                    drawingToolOptions : {anchor : BMAP_ANCHOR_TOP_RIGHT, offset : new BMap.Size(280, 5), scale : 0.6, drawingModes : [ BMAP_DRAWING_POLYGON ]},
                    circleOptions : styleOptions, //圆的样式
                    polylineOptions : styleOptions, //线的样式
                    polygonOptions : styleOptions, //多边形的样式
                    rectangleOptions : styleOptions //矩形的样式
                });
                //控制地图高度
                document.getElementById("allmap").style.height=document.documentElement.clientHeight-400+"px";

            },
            resetDefaultOverlayer(){
                var olys = this.getAllOverlayers();
                for (var i = 0; i < olys.length; i++) {
                    olys[i].setStrokeColor(this.DefaultStrokeColor);
                    olys[i].setFillColor(this.DefaultFillColor);
                }
            },
            getAllOverlayers(){
                if(this.map == null)return false;
                var ols = this.map.getOverlays();
                if(ols.length == 0)return [];
                var rs = [];
                for(var i=0; i < ols.length; i++){
                    if(ols[i].overtype && ols[i].overtype=="Polygon")
                        rs.push(ols[i]);
                }
                return rs;
            },
            clearOverlays() {
                if(this.map == null)return false;
                var allOverlay = this.getAllOverlayers();
                for (var i = 0; i < allOverlay.length; i++){
                    this.map.removeOverlay(allOverlay[i]);
                }
            },
            //编辑服务点
            editStation(){
                this.$router.push({path: 'editOrAdd?id='+this.stationData.sid+'&actionType=edit'});
            },
            //编辑分区
            editPartition(){
                this.$router.push({path: 'partition?cityname='+this.stationData.cityName});
            }
        },
        mounted(){
            this.loadStationData();
        }
    }
</script>

<style>
    .stationdetail{}
    .stationdetail span{
        width: 180px;
        text-align: right;
        display: inline-block;
    }
    .stationdetail label{


    }
    .stationdetail .item{

    }
</style>