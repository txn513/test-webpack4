<template>
    <div>
        <div class="toolbar el-col el-col-24" v-loading="listLoading" style="margin:20px 0px 0px 0px;padding:0;">
            <div id="allmap"></div>
        </div>
        <div id="righttool" class ="righttool">
            <dl>
                <ul>
                    <li>
                        <!--地区选择-->
                        <el-select style="width: 130px" v-model="cityname" placeholder="请选择地区" @change="citynameChanged()" filterable >
                            <el-option
                                    v-for="item in citylist"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                        <el-button style="width: 130px;float: right" type="primary" plain v-on:click="addStation" :loading="listLoading">新增服务点</el-button>
                    </li>
                    <li><p style="border-bottom:1px solid #d6d5d5;"></p></li>
                </ul>
                <ul id="serlist" v-bind:style="{display: isShowlist}">
                    <li>
                        <div >
                            <el-input type="text" v-model="sname" name="sername" placeholder="服务点名称" style="width: 130px;"></el-input>
                            <el-input type="text" v-model="seara" name="name" placeholder="全部区域" style="width: 130px;float: right"></el-input>
                        </div>
                        <div style="margin-top: 10px">
                            <el-select style="width: 130px" v-model="stype" placeholder="服务点类型" filterable >
                                <el-option
                                        v-for="item in serTypes"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                            <el-button style="width: 130px;float: right" type="primary" plain v-on:click="searchStation" :loading="listLoading">搜索</el-button>
                        </div>
                    </li>
                    <li><p style="border-bottom:1px solid #d6d5d5;"></p></li>
                    <li>
                        <div id="servicelist" class="serlist">
                            <div v-for="seritem,index in serstations":class="seritem.selected ? 'seritm selected':'seritm'" @click="serviceItmClick(seritem.sid)" >
                                <div class="sertitle"><label>{{seritem.sname}}</label><a class="seropt" href="javascript:void(0)" @click="showdetail(seritem.sid)" >编辑服务区</a></div>
                                <div class="serpart"><p>{{seritem.areaName}}</p></div>
                                <div class="sertype"><label v-if="seritem.stationtype == 0">虚拟服务点</label><label v-else>实体服务点</label></div>
                            </div>
                        </div>
                    </li>
                </ul>
                <ul id="serdetail" class="serdetail" v-if="isShowdetail=='block'" v-bind:style="{display: isShowdetail}">
                    <li><a class="seropt" href="javascript:void(0)" @click="showlist()" >&lt;返回</a></li>
                    <li>
                            <div class="seritm">
                                <div class="sertitle"><label>{{selectedData.sname}}</label></div>
                                <div class="serpart"><p>{{selectedData.areaName}}</p></div>
                                <div class="sertype"><label v-if="selectedData.stationtype == 0">虚拟服务点</label><label v-else>实体服务点</label></div>
                            </div>
                    </li>
                    <li><p style="border-bottom:1px solid #d6d5d5;"></p></li>
                    <li>
                        <div class="partitemlist">
                            <div class="partitem" v-for="sitm in selectedData.partlist":class="sitm.selected ? 'partitem selected':'partitem'"  @click="partionitmclick(sitm.pid)">
                                <label>{{sitm.pname}}</label>
                                <a href="javascript:void(0)" @click="deletePartionItem(sitm.pid)">删除</a>
                            </div>
                        </div>
                    </li>
                    <li class="serstopopt">
                        <el-button style="width: 280px;" type="primary" plain v-on:click="save" :loading="listLoading">保存</el-button>
                    </li>
                </ul>
            </dl>
        </div>
    </div>

</template>
<script>
    import BMap from 'BMap';
    import BMapLib from 'BMapLib';
    import {getCityListFun} from '../../api/api';
    import {getServicePartitionsFun} from '../../api/api';
    import {getServiceStationsFun} from '../../api/api';
    import {savePartitionsFun} from '../../api/api';
    import {deletePartitionsFun} from '../../api/api';


    export default {
        data() {
            return {
                serstationssour:[],
                serstations:[],
                selectedData : null,
                EditingData : null,
                citylist : null,
                serTypes : [{id: -1, name: '全部服务点'},{id: 0, name: '虚拟服务点'}, {id: 1, name: '实体服务点'}],
                stype : "全部服务点",
                seara : "全部区域",
                sname : "",
                cityname: '深圳市',
                listLoading: false,
                map: null,
                dManager : null,
                DefaultStrokeColor : "#6961fb",
                DefaultFillColor : "#e2e1f9",
                SelectedStrokeColor : "#942c2c",
                SelectedFillColor : "#f15858",
                CurrentStrokeColor : "#4daafb",
                CurrentFillColor : "#a5d3fb",
                isShowdetail : "none",
                isShowlist : "block",
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
            getCityList(){
                this.listLoading = true;
                getCityListFun(null).then((data) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(data)){
                            this.citylist=data.data;
                        }
                    }
                    ,data => { this.listLoading = false;}
                );
            },
            uploadMapData(){
                let para ={};
                para.cityname = this.cityname;
                this.serstationssour = [];
                getServiceStationsFun(para).then((data) => {
                        if (this.GLOBAL.isResonseSuccess(data)){
                            // 设置数据
                            var sdata = data.data;
                            var sids = '';
                            if(sdata && sdata.length > 0) {
                                for (var i = 0; i < sdata.length; i++) {
                                    if(sdata[i].isDelete == 1)continue;
                                    sids += sids === '' ? sdata[i].sid :  "," + sdata[i].sid;
                                    this.serstationssour.push({sname:sdata[i].stationName,sid:sdata[i].sid, lng:sdata[i].lon, lat:sdata[i].lat, areaName: sdata[i].areaName,selected:false,stationtype:sdata[i].stationType, partlist:[]});
                                }
                            }
                            if(sids != "") {
                                // 获取分区数据
                                let ppara = {};
                                ppara.sids = sids;
                                getServicePartitionsFun(ppara).then((pdata) => {
                                        if (this.GLOBAL.isResonseSuccess(pdata)) {
                                            var parts = pdata.data;
                                            if(parts && parts.length > 0) {
                                                for (var i = 0; i < parts.length; i++) {
                                                    //
                                                    var pitm ={pname:parts[i].name,pid:parts[i].id,selected:false, points: this.converToJson(parts[i].path)};
                                                    // 查找service
                                                    var serviceitm;
                                                    for (var j = 0; j < this.serstationssour.length; j++) {
                                                        if(this.serstationssour[j].sid == parts[i].sid) {
                                                            serviceitm = this.serstationssour[j];
                                                            break;
                                                        }
                                                    }
                                                    serviceitm.partlist.push(pitm);
                                                }
                                            }
                                        }
                                        this.initCityPartitions();
                                    }
                                    , data => {}
                                );
                            }
                        }
                    }
                    ,data => {}
                );
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
                this.clearOverlays();
                var obj = {sname:this.sname,seara:this.seara,stype:this.stype};
                this.serstations = this.serstationssour.filter(function(item){
                    var v = item;
                    return ((obj.sname === "" || item.sname.indexOf(obj.sname) >= 0) &&
                    (obj.seara === "全部区域" || item.areaName.indexOf(obj.seara) >= 0) &&
                    (obj.stype === "全部服务点" || obj.stype === -1 || item.stationtype == obj.stype));
                });
                for (var i = 0; i < this.serstations.length; i++) {
                    if (this.selectedData && this.selectedData !== null && this.selectedData.sid === this.serstations[i].sid) {
                        this.selectedData = this.serstations[i];
                    }

                    var point = new BMap.Point(this.serstations[i].lng, this.serstations[i].lat);
                    var marker = new BMap.Marker(point);
                    //var myIcon = new BMap.Icon("markers.png", new BMap.Size(23, 25), {
                    //anchor: new BMap.Size(10, 25),
                    //});
                    //var marker = new BMap.Marker(point, {icon: myIcon});
                    //marker.addEventListener("mouseover", function(){
                    //    alert("您点击了标注");
                    //});
                    //this.map.addOverlay(marker);

                    if (this.serstations[i].partlist != null && this.serstations[i].partlist.length > 0) {
                        for (var j = 0; j < this.serstations[i].partlist.length; j++) {
                            var ps = this.serstations[i].partlist[j];
                            var ponts = [];
                            for (var k = 0; k < ps.points.length; k++) {
                                ponts.push(new BMap.Point(ps.points[k].lng, ps.points[k].lat));
                            }
                            var polygon = new BMap.Polygon(ponts, this.styleOptions);
                            this.map.addOverlay(polygon);
                            this.addOverlayeAttr(this.serstations[i].sid, this.serstations[i].partlist[j].pid, polygon);
                            polygon.editing = false;
                        }
                    }
                }
            },
            addOverlayeAttr(parantid, overid, pg){
                pg.parantid = parantid;
                pg.overlayid = overid;
                pg.overlayname = "服务区(" + overid + ")" ;
                pg.overtype = "Polygon";
                pg.addEventListener("click", this.overlayclick);
                pg.addEventListener("dblclick", this.overlaydblclick);
            },
            getPathPoints(pl){
                var points = [];
                var ps = pl.getPath();
                for(var i =0; i < ps.length;i++){
                    points.push({lng:ps[i].lng,lat:ps[i].lat});
                }
                return points;
            },
            getAllOverlayers(){
                var ols = this.map.getOverlays();
                if(ols.length == 0)return [];
                var rs = [];
                for(var i=0; i < ols.length; i++){
                    if(ols[i].overtype && ols[i].overtype=="Polygon")
                        rs.push(ols[i]);
                }
                return rs;
            },
            comparePoints(sou,targ){
                if(sou.length != targ.length)return false;
                for(var i=0;i < sou.length;i++){
                    if(sou[i].lng != targ[i].lng || sou[i].lat != targ[i].lat){
                        return false;
                    }
                }
                return true;
            },
            showMap(){
                // 创建Map实例
                this.map = new BMap.Map("allmap",{enableMapClick:false});
                this.map.centerAndZoom(this.cityname, 13);
                this.map.enableScrollWheelZoom();
                var styleOptions = {strokeColor : this.DefaultStrokeColor,fillColor : this.DefaultFillColor,strokeWeight : 2,strokeOpacity : 0.8,fillOpacity : 0.6,strokeStyle : 'solid'};
                //实例化鼠标绘制工具
                this.dManager = new BMapLib.DrawingManager(this.map, {
                    isOpen : false, //是否开启绘制模式
                    enableDrawingTool : true, //是否显示工具栏
                    drawingToolOptions : {anchor : BMAP_ANCHOR_TOP_RIGHT, offset : new BMap.Size(280, 5), scale : 0.6, drawingModes : [ BMAP_DRAWING_POLYGON ]},
                    circleOptions : styleOptions, //圆的样式
                    polylineOptions : styleOptions, //线的样式
                    polygonOptions : styleOptions, //多边形的样式
                    rectangleOptions : styleOptions //矩形的样式
                });
                //添加鼠标绘制工具监听事件，用于获取绘制结果
                this.dManager.addEventListener('overlaycomplete', this.overlayCreateCompleted);
                //控制地图高度
                document.getElementById("allmap").style.height=document.documentElement.clientHeight-140+"px";
                document.getElementById("righttool").style.height=document.documentElement.clientHeight-162+"px";
                document.getElementById("servicelist").style.height=document.documentElement.clientHeight-340+"px";
            },
            citynameChanged() {
                this.isShowdetail = "none";
                this.isShowlist = "block";
                this.stype = "全部服务点";
                this.seara = "全部区域";
                this.sname = "";
                this.map.centerAndZoom(this.cityname, 13);
                this.uploadMapData();
            },
            opentips(msg) {
                this.$alert(msg, {
                    confirmButtonText: '确定',
                });
            },
            partionitmclick(overid) {
                var ol = this.findOverlayer(overid);
                this.setSelectedStyle(ol.parantid);
                this.setEditedStyle(ol.overlayid);
            },
            overlayclick(e) {
                //if(this.isShowlist != "none")return false;
                this.setSelectedStyle(e.target.parantid);
                this.setEditedStyle(e.target.overlayid);
                return false;
            },
            overlaydblclick(e) {
                var ol = e.target;
                if(this.selectedData == null)return false;
                var pitm = null;
                for (var k = 0; k < this.selectedData.partlist.length; k++) {
                    if (ol.overlayid == this.selectedData.partlist[k].pid) {
                        pitm = this.selectedData.partlist[k];
                        break;
                    }
                }
                if(pitm == null)return false;
                if (ol.editing == false) {
                    ol.editing = true;
                    ol.enableEditing();
                } else {
                    ol.editing = false;
                    ol.disableEditing();
                }
                this.setSelectedStyle(ol.parantid);
                this.setEditedStyle(ol.overlayid);
                return false;
            },
            findOverlayer(key) {
                var allOverlay = this.getAllOverlayers();
                for(var i = 0; i < allOverlay.length; i++){
                    if(allOverlay[i].overlayid == key){
                        return allOverlay[i];
                    }
                }
                return null;
            },
            overlayCreateCompleted(e) {
                if(this.selectedData == null) {
                    this.opentips("请先选择要编辑的服务点");
                    e.overlay.hide();
                    return false;
                }
                if(e.drawingMode !== "polygon") {
                    e.overlay.hide();
                    return false;
                }
                var overid = this.getOverlayerId();
                this.addOverlayeAttr(this.selectedData.sid,overid,e.overlay);
                e.overlay.editing = true;
                e.overlay.edittype = "add";
                e.overlay.enableEditing();
                // 添加数据
                var pindex = 1+this.selectedData.partlist.length;
                this.selectedData.partlist.push({pid:overid, pname:e.overlay.overlayname,selected:true, points: e.overlay.getPath()});
                this.setSelectedStyle(e.overlay.parantid);
                this.setEditedStyle(e.overlay.overlayid);
                return false;
            },
            getOverlayerId(){
                var allOverlay = this.getAllOverlayers();
                var max = -1;
                for(var i = 0; i < allOverlay.length; i++){
                    max = max < parseInt(allOverlay[i].overlayid) ? parseInt(allOverlay[i].overlayid) : max;
                }
                return max + 1;
            },
            deletePartionItem(pid){
                this.$confirm("确定要删除该分区？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: 'warning'
                }).then(() => {
                    // 判断是否已经保存

                    let ppara = {};
                    ppara.pid = pid;
                    deletePartitionsFun(ppara).then((pdata) => {
                            if (this.GLOBAL.isResonseSuccess(pdata)) {
                                this.uploadMapData();
                            }
                        }
                        , data => {}
                    );
                }).catch(() => {
                    // 取消，返回保存
                    return false;
                });
                return false;
            },
            showdetail(sid){
                this.isShowlist = "none";
                this.isShowdetail = "block";
                this.setSelectedData(sid);
                this.setSelectedStyle(sid);
                return false;
            },
            showlist(e){
                var rs = this.getChangedOverlay();
                if(rs.length > 0){
                    this.$confirm("编辑内容尚未保存，是否放弃所所做修改？", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: 'warning'
                    }).then(() => {
                        // 撤销更改
                        this.selectedData = null;
                        this.isShowdetail = "none";
                        this.isShowlist = "block";
                        this.uploadMapData();
                    }).catch(() => {
                        return false;
                    });
                }else{
                    this.selectedData = null;
                    this.isShowdetail = "none";
                    this.isShowlist = "block";
                    var allOverlay = this.getAllOverlayers();
                    for(var i = 0; i < allOverlay.length; i++){
                        allOverlay[i].editing = false;
                        allOverlay[i].disableEditing();
                    }
                }
            },
            serviceItmClick(sid){
                this.setSelectedStyle(sid);
            },
            resetDefaultOverlayer(){
                var olys = this.getAllOverlayers();
                for (var i = 0; i < olys.length; i++) {
                    olys[i].setStrokeColor(this.DefaultStrokeColor);
                    olys[i].setFillColor(this.DefaultFillColor);
                }
            },
            setSelectedStyle(sid){
                this.resetDefaultOverlayer();
                for(var i=0;i < this.serstations.length;i++){
                    if(this.serstations[i].sid == sid){
                        this.serstations[i].selected = true;
                    }else{
                        this.serstations[i].selected = false;
                    }
                }
                var olys = this.getAllOverlayers();
                for(var i=0; i < olys.length;i++){
                    if(olys[i].parantid ==sid){
                        olys[i].setStrokeColor(this.CurrentStrokeColor);
                        olys[i].setFillColor(this.CurrentFillColor);
                    }
                }
            },
            setEditedStyle(overid){
                if(this.selectedData == null) return false;
                var isSelectedInner = false;
                for(var i=0;i < this.selectedData.partlist.length;i++){
                    if(this.selectedData.partlist[i].pid == overid){
                        this.selectedData.partlist[i].selected = true;
                        isSelectedInner = true;
                    }else{
                        this.selectedData.partlist[i].selected = false;
                    }
                }
                if(!isSelectedInner)return;
                var olys = this.getAllOverlayers();
                for(var i=0; i < olys.length;i++){
                    if(olys[i].overlayid ==overid){
                        olys[i].setStrokeColor(this.SelectedStrokeColor);
                        olys[i].setFillColor(this.SelectedFillColor);
                    }
                }
            },
            setSelectedData(sid){
                this.selectedData = null;
                for(var i=0;i < this.serstations.length;i++){
                    if(this.serstations[i].sid == sid){
                        this.selectedData = this.serstations[i];
                        break;
                    }
                }
            },
            addStation(){
                this.$router.push({path: 'editOrAdd?id=null&actionType=add'});
            },
            searchStation(){
                if( this.isShowdetail === "block"){
                    // 判断是否保存
                }
                this.selectedData = null;
                this.isShowdetail = "none";
                this.isShowlist = "block";
                // 初始化分区
                this.initCityPartitions();
            },
            clearOverlays() {
                var allOverlay = this.getAllOverlayers();
                for (var i = 0; i < allOverlay.length; i++){
                    this.map.removeOverlay(allOverlay[i]);
                }
            },
            getChangedOverlay(){
                if(this.selectedData == null)
                    return [];
                var allOverlay = this.getAllOverlayers();
                var rs = [];
                for (var i = 0; i < allOverlay.length; i++) {
                    var itm = allOverlay[i];
                    var ps;
                    if (itm.edittype && itm.edittype == 'add') {
                        ps = itm.getPath();
                    } else {
                        var pitm = null;
                        for (var k = 0; k < this.selectedData.partlist.length; k++) {
                            if (itm.overlayid == this.selectedData.partlist[k].pid) {
                                pitm = this.selectedData.partlist[k];
                                break;
                            }
                        }
                        // 判断是否发生改变
                        if (pitm != null && !this.comparePoints(pitm.points, itm.getPath())) {
                            ps = itm.getPath();
                        }else{
                            continue;
                        }
                    }
                    var path = '';
                    for (var j = 0; j < ps.length; j++) {
                        path += path == '' ? ps[j].lng + ' ' + ps[j].lat : ',' + ps[j].lng + ' ' + ps[j].lat;
                    }
                    path += path == "" ? "" : ',' + ps[0].lng + ' ' + ps[0].lat;
                    rs.push({
                        id: (itm.edittype == 'add' ? "-1" : itm.overlayid),
                        sid: parseInt(itm.parantid),
                        name: itm.overlayname,
                        path: path
                    });
                }
                return rs;
            },
            save(e){
                var rs = this.getChangedOverlay();
                for(var i = 0; i < rs.length; i++) {
                    if (rs.path == "") {
                        this.$alert("存在空分区，无法保存！", "提示", {
                            confirmButtonText: "确定",
                            type: 'warning'
                        }).then(() => {
                        }).catch(() => {
                        });
                        return false;
                    }
                }
                var para = {partition:rs}
                // 保存
                this.loading = true;
                if(rs.length > 0){
                    savePartitionsFun(rs).then((data) => {
                            if (this.GLOBAL.isResonseSuccess(data)) {
                                this.opentips("保存成功");
                            }
                            // 重新加载数据
                            this.uploadMapData();
                        }
                        , data => {this.loading = false;}
                    );
                }else{
                    this.$alert("无要保存的数据", "提示", {
                        confirmButtonText: "确定",
                        type: 'warning'
                    }).then(() => {
                    }).catch(() => {
                    });
                }
            }
        },
        mounted(){
            this.serstations = [];
            this.cityname =  this.$route.query.cityname;
            this.cityname = (!this.cityname || this.cityname === null || this.cityname === "")? "深圳市" : this.cityname;
            if(this.cityname.indexOf('市') < 0) this.cityname = this.cityname + "市";
            this.getCityList();
            this.showMap();
            this.uploadMapData();
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



    .righttool {
        border: 1px solid #f7f5f5;
        height: 100%;
        width: 280px;
        position: absolute;
        top: 0px;
        right: 20px;
        font-size: 10px;
        padding: 10px;
        background-color: #fdfdff;
        top:59px;
    }
    .righttool dl, dt, dd, ul, li {
        margin: 0;
        padding: 0;
        list-style: none;
    }

    .righttool p {
        font-size: 12px;
    }

    .righttool dt {
        font-size: 14px;
        font-family: "微软雅黑";
        font-weight: bold;
        border-bottom: 1px solid #d6d5d5;
        padding: 5px 0 5px 5px;
        margin: 5px 0;
    }

    .righttool dd {
        padding: 5px 0 0 5px;
    }

    .righttool li {
        line-height: 28px;
    }

    .righttool .serstop {

    }

    .righttool .container {
        height: 500px;
        OVERFLOW-Y: auto;
        OVERFLOW-X: hidden;
    }

    .righttool .container div {
        border: 1px solid #d6d5d5;
        margin-bottom: 5px;
        text-align: center;
        width: 90%;
    }

    .righttool .container div a {
        border: none;
        float: right;
        margin-right: 5px;
    }

    .righttool .serstopopt div {
        border: 1px solid #d6d5d5;
        margin-bottom: 5px;
        text-align: center;
        width: 100%;
    }

    .righttool .serlist {
        width: 100%;
        text-align: center;
        height: 600px;
        overflow-x: hidden;
        overflow-y: auto;
    }
    .righttool .serlist .seritm a{
        text-decoration: none;
        color: #484646;
    }
    .righttool .serlist .seritm {
        width: 230px;
        display: inline-block;
        padding: 2px;
        /*text-overflow: ellipsis;*/
        background-color: ghostwhite;
        border: solid 1px #e4e4e4;
        border-radius: 5px;
        white-space: nowrap;
        padding: 10px;
        margin-bottom: 10px;
    }
    .righttool .serlist .seritm.selected {
        border: solid 1px #a9a9a9;
        background-color: #efefef;
    }
    .righttool .serlist .seritm .sertitle {
        width: 100%;
        text-align: left;
    }
    .righttool .serlist .seritm .sertitle label{
        text-overflow: ellipsis;
        text-align: left;
        font-size: 16px;
        width: 230px;
        overflow: hidden;
        white-space: nowrap;
        display: block;
    }
    .righttool .serlist .seritm .sertype {
        width: 100%;
        text-align: left;
    }
    .righttool .serlist .seritm .seropt {
        float: right;
    }
    .righttool .serlist .seritm .serpart {
        width: 100%;
        text-align: left;
    }
    .righttool .serlist p{
        margin: 0px ;
    }
    .righttool .serlist .seritm div {
    }
    /**/
    .righttool .serdetail a{
        text-decoration: none;
        color: #484646;
    }
    .righttool .serdetail .seritm {
        width: 260px;
        display: inline-block;
        background-color: ghostwhite;
        border: solid 1px #e4e4e4;
        border-radius: 5px;
        white-space: nowrap;
        padding: 10px;
        margin-bottom: 10px;
    }
    .righttool .serdetail .seritm .sertitle {
        width: 100%;
        text-align: left;
    }
    .righttool .serdetail .seritm .sertitle label{
        text-overflow: ellipsis;
        text-align: left;
        width: 250px;
        font-size: 16px;
    }
    .righttool .serdetail .seritm .sertype {
        width: 100%;
        text-align: left;
    }
    .righttool .serdetail .seritm .seropt {
        width: 50px;
        float: right;
    }
    .righttool .serdetail .seritm .serpart {
        width: 100%;
        text-align: left;
    }
    .righttool .serdetail p{
        margin: 0px ;
    }
    .righttool .serdetail .seritm div {

    }
    .righttool .serdetail .partitemlist {
        OVERFLOW-Y: auto;
        OVERFLOW-X: hidden;
        max-height: 400px;
    }
    .righttool .serdetail .partitemlist .partitem {
        width: 240px;
        display: inline-block;
        padding: 2px;
        background-color: white;
        border: solid 1px #e3e7ec;
        border-radius: 5px;
        white-space: nowrap;
        padding: 4px;
        margin: 5px 0px 5px 0px;
    }
    .righttool .serdetail .partitemlist .partitem.selected {
        border: solid 1px #a9a9a9;
        background-color: #efefef;
    }
    .righttool .serdetail .partitemlist .partitem a{
        float: right;
        padding-right: 5px;
    }
    .righttool .serdetail .partitemlist .partitem label{
        padding-left: 5px;
        text-overflow: ellipsis;
        width: 220px;
    }

</style>