<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">

            <el-form align="right" :inline="true"  class="demo-form-inline">
                <el-form-item label="">
                    <el-input v-model="filters.orgCode" placeholder="工厂编码"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-input v-model="filters.orgName" placeholder="工厂名称"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-input v-model="filters.keeper" placeholder="负责人"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-select v-model="filters.disableFlag" clearable placeholder="状态" >
                        <el-option :key="0" :value="0" label="启动"></el-option>
                        <el-option :key="1" :value="1" label="停用"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" v-on:click="searchData">查询</el-button>
                </el-form-item>
                <el-form-item label="">
                    <el-button v-if="isAuth('mpys:plantinfo:insert')" type="primary" @click="handleEditOrAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="list" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column prop="orgCode" label="工厂编码"></el-table-column>
            <el-table-column prop="orgName" label="工厂名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="abbr" label="简称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="shopType" label="类型" :formatter="formatDisableFlag" show-overflow-tooltip></el-table-column>
            <el-table-column prop="regionName" label="区域" show-overflow-tooltip></el-table-column>
            <el-table-column prop="keeper" label="负责人"></el-table-column>
            <el-table-column prop="telephone" label="电话" show-overflow-tooltip></el-table-column>
            <el-table-column prop="phoneOne" label="座机" show-overflow-tooltip></el-table-column>
            <el-table-column prop="address" label="地址" show-overflow-tooltip></el-table-column>
            <el-table-column prop="area" label="面积"></el-table-column>
            <el-table-column prop="lngLat" label="经纬度" :formatter="formatlngLat" show-overflow-tooltip></el-table-column>
            <el-table-column prop="disableFlag" label="状态" :formatter="formatDisableFlag"></el-table-column>

            <el-table-column  fixed="right" label="操作" width="230">
                <template slot-scope="scope">
                    <el-button v-if="isAuth('mpys:plantinfo:update')" type="primary" :disabled="scope.row.disableFlag == '1'" size="mini" @click="handleEditOrAdd(scope.$index, scope.row, false, 2)">编辑</el-button>
                    <el-button v-if="isAuth('mpys:plantinfo:delete') && false" type="primary" :disabled="scope.row.disableFlag == '1'" size="mini" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                    <el-button v-if="isAuth('mpys:plantinfo:update') && scope.row.disableFlag == 0" type="primary" size="mini" @click="updateDisableFlag(scope.row, 1)">停用</el-button>
                    <el-button v-if="isAuth('mpys:plantinfo:update') && scope.row.disableFlag == 1" type="primary" size="mini" @click="updateDisableFlag(scope.row, 0)">启用</el-button>
                    <el-button v-if="isAuth('mpys:plantinfo:view')" type="primary" size="mini" @click="handleEditOrAdd(scope.$index, scope.row, true)">查看</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条 跳页-->
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

        <!--编辑界面-->
        <el-dialog :title="title" v-if="this.isDestory" dis v-model="formVisible" :visible.sync="formVisible" @close="closeDialog">
            <el-form :model="form" label-width="80px" :rules="formRules" ref="form">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="工厂编码" prop="orgCode" ref="refOrgCode">
                         <!--   <el-input
                                    suffix-icon="el-icon-search" @focus="orgVisible=true"
                                    v-model="form.orgCode" :disabled="isDisable" auto-complete="off">
                            </el-input>-->
                            <el-input v-model="form.orgCode" :disabled="isDisable" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="工厂名称" prop="orgName">
                            <!--<el-input v-model="form.orgName" :disabled="true" auto-complete="off"></el-input>-->
                            <el-input v-model="form.orgName" :disabled="isDisable" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="简称" prop="abbr">
                            <el-input v-model="form.abbr" :disabled="isDisable" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="工厂类型" prop="shopType">
                            <el-select v-model="form.shopType" :disabled="isDisable" placeholder="请选择">
                                <el-option :key="0" :value="0" label="自营"></el-option>
                                <el-option :key="1" :value="1" label="加盟"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="区域" prop="regionCode">
                            <el-select v-model="form.regionCode" :disabled="isDisable" placeholder="请选择">
                                <el-option
                                        v-for="item in regionList"
                                        :key="item.distValue"
                                        :label="item.distLabel"
                                        :value="item.distValue">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="面积" prop="area">
                            <el-input v-model="form.area" :disabled="isDisable" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="负责人" prop="keeper">
                            <el-input v-model="form.keeper" :disabled="isDisable" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="座机" prop="phoneOne">
                            <el-input v-model="form.phoneOne" :disabled="isDisable" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="电话" prop="telephone">
                            <el-input v-model="form.telephone" :disabled="isDisable" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="24">

                        <el-form-item   prop="consignerAddress3" label="地址">
                            <addr-select :editData ="editData"  ref="child" @getresult = "getResult" @onAreaChange="onAreaChange('consignerAddress3')"  ></addr-select>
                        </el-form-item>

                    </el-col>
                    <el-col :space="4">
                        <el-form-item label="" prop="address" >
                            <el-input v-model="form.address" :disabled="isDisable" auto-complete="off" style="width:30%;"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="经度" prop="longitude">
                            <el-input v-model="form.longitude" :disabled="isDisable" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="纬度" prop="latitude">
                            <el-input v-model="form.latitude" :disabled="isDisable" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

            </el-form>

            <SinterMap :loading="loadingMap" :fullName="fullName" :center="{longitude:form.longitude,latitude:form.latitude}" @sinterMapClick="sinterMapClick"></SinterMap>
            <!-- <div id="allmap" :loading="loadingMap"></div> -->
            <div slot="footer" class="dialog-footer" v-if="addBtnFlag">
                <el-button v-if="this.isNotView == true" @click.native="formVisible = false">取消</el-button>
                <el-button v-if="this.isNotView == true" type="primary" @click.native="submit" :loading="loading">提交</el-button>
            </div>

            <div slot="footer" class="dialog-footer" v-if="editBtnFlag">
                <el-button v-if="this.isNotView == true" type="primary" @click.native="submit" :loading="loading">保存</el-button>
                <el-button v-if="this.isNotView == true" @click.native="formVisible = false">取消</el-button>
            </div>
        </el-dialog>

        <!--组织架构工厂列表-->
        <el-dialog title="选择工厂"  v-model="orgVisible" :visible.sync="orgVisible" >
            <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">

                <el-form align="right" :inline="true"  class="demo-form-inline">
                    <el-form-item label="">
                        <el-select v-model="orgFilters.orgFlag">
                            <el-option :key="0" :value="0" label="编码"></el-option>
                            <el-option :key="1" :value="1" label="名称"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="">
                        <el-input v-model="orgFilters.orgValue"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <el-button type="primary" v-on:click="searchOrg">查询</el-button>
                    </el-form-item>
                </el-form>
            </el-col>


            <el-table :data="orgPlantList" @row-click="choiceCodeAndName">
                <el-table-column property="orgCode" label="编码" ></el-table-column>
                <el-table-column property="orgName" label="名称"></el-table-column>
            </el-table>

            <!--分页-->
            <div class="block" style="text-align:right;">
                <el-pagination @current-change="orgHandleCurrentChange"
                               :page-size="orgPlantPageSize"
                               layout="prev, pager, next"
                               :total="orgPlantTotal">
                </el-pagination>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    // import BMap from 'BMap';
    import {getPlantList, addPlantInfo, queryArea,updatePlantInfo,updatePlantInfoStatus,logicDeletePlantInfo,getOrgListByTypeAndBusinessType} from '../../api/api';
    import fileupload from '@/components/fileUpload';
    import  {VDT ,VDATA} from '@/common/js/validate';
    import addrSelect from '@/components/addrSelect';
    import SinterMap from "@/components/map";

    export default {
        components:{
            fileupload,addrSelect,SinterMap
        },
        data() {
            return {
                editData:[],//后台返回的修改数据如果此数据为空说明是新增否则是修改
                filters: {
                    orgCode: '',
                    orgName: '',
                    keeper: '',
                    disableFlag: '',
                },
                orgFilters:{ //组织架构查询框
                    orgValue:'',
                    orgFlag:'',
                },
                type:"1",//这个是上传图片的类型 1为上传普通图片 2为上传头像 3为上传商品图片
                num:'1',//参数为1限制为只能上传一张2为多张
                list: [],
                isDestory : false,
                isNotView:true, //提交 取消按钮是否展示
                isDisable: true, //文本是否可以编辑
                addBtnFlag:true,
                editBtnFlag:true,
                regionList:[],//区域列表
                total: 0,
                title:"新增",//弹出框标题
                pageNum: 1, //当前页码
                pageSize: 10,//页数
                listLoading: false,
                formVisible: false,
                loading: false,
                loadingMap:false,//加载百度地图
                dialogVisible: false,//弹出框
                cityName:'',
                // baiduMap:'',//百度地图
                fullName: '',  //省市区

                orgPlantList:[],//组织架构中工厂列表
                orgVisible:false,//选择工厂弹框是否显示
                orgPlantTotal:0,//组织架构中工厂列表分页信息
                orgPlantPage: 1,
                orgPlantPageSize:5,
                orgName:'',
                orgCode:'',
                formRules: {
                    orgCode: [
                        {
                            validator: (rule,value,callback) => {
                                let vdt = VDATA(value, {"digits" : {msg:"请输入有效的数字"}, "maxlength":{param: "12", msg: "最大值不能超过12个字符"}})
                                if (!vdt.result && value!=undefined &&value!='') {
                                    callback(new Error(vdt.msg))
                                }else{
                                    callback();
                                }
                            },
                            trigger: 'blur'
                        }
                    ],
                    orgName: [{required: true, message: '请输入工厂名称', trigger: 'blur'},
                        {max: 20, message: '名称最多20个字符,请重新输入', trigger: 'blur' }
                    ],
                    abbr: [{max: 20, message: '简称最多20个字符,请重新输入', trigger: 'blur' }],
                    shopType: [{required: true, message: '请选择类型', trigger: 'change'}],
                    regionCode: [{required: true, message: '请选择区域', trigger: 'change'}],
                    area: [
                        {
                            validator: (rule,value,callback) => {
                                if (value != null && value != ''){
                                    var reg = new RegExp(/^[0-9]*(\.\d{1,3})?$/);
                                    if (!reg.test(value)) {
                                        callback(new Error('请输入正确格式数字,最多三位小数'))
                                    }else{
                                        callback();
                                    }
                                }else{
                                    callback();
                                }
                            },
                            trigger: 'blur'
                        }
                    ],
                    keeper: [{required: true, message: '请输入负责人姓名', trigger: 'blur'},
                        {max: 10, message: '姓名最多10个字符,请重新输入', trigger: 'blur' }
                    ],
                    phoneOne:[
                        {
                            validator: (rule,value,callback) => {
                                let vdt = VDATA(value,{"tphone" : {msg:"请输入正确格式的电话号码"}})
                                if (!vdt.result && value!=undefined &&value!='') {
                                    callback(new Error(vdt.msg))
                                }else{
                                    callback();
                                }
                            },
                            trigger: 'blur'
                        }
                    ],
                    telephone:[
                        {required: true, message: '请输入加工厂电话', trigger: 'blur'},
                        {
                            validator: (rule,value,callback) => {
                                let vdt = VDATA(value,{"mphone" : {msg:"请输入正确格式的电话"}})
                                if (!vdt.result) {
                                    callback(new Error(vdt.msg))
                                }else{
                                    callback();
                                }
                            },
                            trigger: 'blur'
                        }
                    ],
                    consignerAddress3: [{required: true, message: '请选区域', trigger: 'change'}],
                    address: [{required: true, message: '请输入地址', trigger: 'blur'},
                        {max: 100, message: '地址做多100个字符,请重新输入', trigger: 'blur' }
                    ],
                    longitude: [
                        {required: true, message: '请输入经度', trigger: 'blur'},
                        {
                            validator: (rule,value,callback) => {
                                var reg = new RegExp(/^[\-\+]?(0?\d{1,2}\.\d{6}|1[0-7]?\d{1}\.\d{6}|180)$/);
                                if (!reg.test(value)) {
                                    callback(new Error('请输入正确经度'))
                                }else{
                                    callback();
                                }
                            },
                            trigger: 'blur'
                        }
                    ],
                    latitude: [
                        {required: true, message: '请输入纬度', trigger: 'blur'},
                        {
                            validator: (rule,value,callback) => {
                                var reg = new RegExp(/^[\-\+]?([0-8]?\d{1}\.\d{6}|90)$/);
                                if (!reg.test(value)) {
                                    callback(new Error('请输入正确纬度'))
                                }else{
                                    callback();
                                }
                            },
                            trigger: 'blur'
                        }
                    ],
                },
                //编辑界面数据
                form: {
                    id:'' ,
                    orgCode:'' ,
                    orgName:'' ,
                    abbr:'' ,
                    type:'' ,
                    shopType:'' ,
                    regionCode:'' ,
                    regionName:'' ,
                    area:'' ,//面积
                    areaCode:'',//所属区域代码
                    keeper:'' ,
                    telephone:'' ,
                    phoneOne:'' ,
                    address:'' ,
                    longitude:'' ,
                    latitude:'' ,
                    lngLat:'',
                    consignerAddress3:'',
                    cityName:'',
                },

            }
        },
        methods: {
            //切换页数
            handleCurrentChange(val) {
                this.pageNum = val;
                this.getData();
            },
            //处理分页条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.getData();
            },
            searchData(){
                this.pageNum = 1;
                this.getData();
            },
            //获取用户列表
            getData() {
                let para = {
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    },
                    orgCode: this.filters.orgCode,
                    orgName: this.filters.orgName,
                    keeper: this.filters.keeper,
                    disableFlag: this.filters.disableFlag,
                };
                this.listLoading = true;
                getPlantList(para).then((res) => {
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.listLoading = false;
                        this.total = res.data.paginationInfo.total;
                        this.list = res.data.list;
                    }else{
                        this.$message.error(res.message());
                    }
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let para = {id: row.id};
                    logicDeletePlantInfo(para).then((res) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(res)) {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getData();
                        }else{
                            this.$message.error(res.message());
                        }
                    });
                }).catch(() => { });
            },
            updateDisableFlag(row, statu){
                let para = {
                    id: row.id,
                    disableFlag: statu,
                }
                updatePlantInfoStatus(para).then((res) => {
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.getData();
                    }else{
                        this.$message.error(res.message());
                    }
                });

            },
            //显示编辑/新增界面
            handleEditOrAdd: function (index, row ,isView,editFlag) {
                if (editFlag){
                    this.addBtnFlag = false;
                    this.editBtnFlag = true;
                } else {
                    this.addBtnFlag = true;
                    this.editBtnFlag = false;
                }

                if (row) {
                    if (true == isView){
                        this.title= "查看";
                        this.isDisable = true;
                        this.isNotView = false;
                    }else{
                        this.title= "编辑";
                        this.isDisable = false;
                        this.isNotView = true;
                    }
                    this.form = Object.assign({}, row);
                    this.rebuildLatLon()

                } else {
                    this.isDisable = false;
                    this.isNotView = true;
                    this.title= "新增";
                //    this.form = {};
                    //编辑界面数据
                    this.form = {
                            id:'' ,
                            orgCode:'' ,
                            orgName:'' ,
                            abbr:'' ,
                            type:'' ,
                            shopType:'' ,
                            regionCode:'' ,
                            regionName:'' ,
                            area:'' ,//面积
                            areaCode:'',//所属区域代码
                            keeper:'' ,
                            telephone:'' ,
                            phoneOne:'' ,
                            address:'' ,
                            longitude:'' ,
                            latitude:'' ,
                            lngLat:'',
                            consignerAddress3:'',
                    }
                }

                if (this.form.areaCode && this.form.areaCode.length==6){//如果所属区域代码不为空 并且长度为6
                    console.log(this.form.areaCode);
                    this.editData= [this.form.areaCode.substr(0,2),this.form.areaCode.substr(0,4),this.form.areaCode];
                    console.log(this.editData);
                }else {
                    this.editData=[];
                }


                this.formVisible = true;
                this.isDestory = true;
                this.getRegion();
                // setTimeout(()=>{this.showMap()},0);
            },
            rebuildLatLon(){
                let longitude = this.form.longitude;
                if (longitude != 180 && longitude != -180) {
                    this.form.longitude = Number(longitude).toFixed(6);
                }

                let latitude = this.form.latitude;
                if (latitude != 90 && latitude != -90){
                    this.form.latitude = Number(latitude).toFixed(6);
                }
            },
            //百度地图api
            //加载方式:1.默认初始化 2.获取默认城市 3.切换城市
            showMap(){
                // this.loadingMap = true;
                var cityName = this.cityName==''?'深圳市':this.cityName;
                this.dialogVisible = true;
               // var map = new BMap.Map("allmap");
                this.baiduMap =new BMap.Map("allmap");
                this.baiduMap.centerAndZoom(cityName,12);
                this.baiduMap.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
                this.baiduMap.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用
                // this.loadingMap = false;
                //单击获取点击的经纬度
                var _this = this;
/*                if ( "新增" == this.title){
                    _this.form.longitude='';
                    _this.form.latitude='';
                }*/

/*                map.addEventListener("click",function(e){
                    _this.form.longitude=e.point.lng;
                    _this.form.latitude=e.point.lat;
                });*/

                this.baiduMap.addEventListener("click",e =>{
                    _this.form.longitude=e.point.lng;
                    _this.form.latitude=e.point.lat;
                });
                //控制地图高度
                document.getElementById("allmap").style.height=document.documentElement.clientHeight-210+"px";
            },
            //编辑
            submit: function () {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.loading = true;
                            let para = Object.assign({}, this.form);
                            if(para.id) {
                                updatePlantInfo(para).then((res) => {
                                    this.loading = false;
                                    if (this.GLOBAL.isResonseSuccess(res)) {
                                        this.$message({
                                            message: '提交成功',
                                            type: 'success'
                                        });
                                        this.imgList = [];
                                        this.formVisible = false;
                                        this.isDestory = false;
                                        this.getData();
                                    }else{
                                        this.$message.error(res.message);
                                    }
                                });
                            } else {
                                addPlantInfo(para).then((res) => {
                                    this.loading = false;
                                    if (this.GLOBAL.isResonseSuccess(res)) {
                                        this.$message({
                                            message: '提交成功',
                                            type: 'success'
                                        });
                                        this.formVisible = false;
                                        this.isDestory = false;
                                        this.getData();
                                    }else{
                                        this.$message.error(res.message);
                                    }
                                });
                            }
                        });
                    }
                });
            },
            closeDialog: function(){
                this.isDestory = false;
            },
            getRegion: function() {
                let para = {
                    classifyCode: '001',
                }
                queryArea(para).then((res) => {
                    this.listLoading = false;
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.regionList = res.data;
                    }
                    // return false;
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },



            selsChange: function (sels) {
                this.sels = sels;
            },
            formatDisableFlag(row, column) {
                var property = column.property;
                var value = row[column.property];
                if ("disableFlag" == property){
                    switch (value){
                        case 0: return "启用";
                        case 1: return "停用";
                    }
                }else if("shopType" == property){
                    switch (value){
                        case 0: return "自营";
                        case 1: return "加盟";
                    }
                }
                return null;
            },
            /**
             * 格式化经纬度字段  经度,纬度
             * @param row
             * @param column
             * @returns {*}
             */
            formatlngLat(row, column) {
                return row.longitude+","+row.latitude;
            },
            //初始化加工厂组织架构数据
            initOrgPlant(){
                let para = {
                    orgType: 1,
                    orgCode:this.orgCode,
                    orgName:this.orgName,
                    pageInfo: {
                        pageNum: this.orgPlantPage,
                        pageSize: this.orgPlantPageSize,
                    },
                };
                getOrgListByTypeAndBusinessType(para).then((res)=>{
                    if (this.GLOBAL.isResonseSuccess(res)){
                        this.orgPlantList = res.data.list;
                        //console.log(this.orgPlantList);
                    }
                },).catch(() => {});
            },
            //查询加工厂组织架构数据
            searchOrg(){
                let codeOrNameFlag = this.orgFilters.orgFlag;
                if (1==codeOrNameFlag){//1名称  0 编码
                    this.orgName = this.orgFilters.orgValue;
                    this.orgCode = '';
                }else if(0==codeOrNameFlag){
                    this.orgName = '';
                    this.orgCode = this.orgFilters.orgValue;
                }
                this.initOrgPlant();
            },
            //工厂组织架构切换页数
            orgHandleCurrentChange(val){
                this.orgPlantPage = val;
                this.initOrgPlant();
            },
            //点击选中此编码名称
            choiceCodeAndName(row, event, column){
             //   console.log(row);
                // 赋值编辑页面 编码与名称
              this.form.orgCode = row.orgCode;
              this.form.orgName = row.orgName;
              this.$refs['refOrgCode'].clearValidate() ;
              //关闭选中加工厂弹框
              this.orgVisible = false;
            },

            //获取选中的结果
            getResult(result){
                console.log("当前选中的省市区code为:"+result);
                var code = result.split(" ");
                this.form.consignerAddress3 = code [2];
                this.form.areaCode = code [2];
                this.form.cityName = code [4];

                this.fullName = code[3] + code[4] + code[5];

                //百度地图中心移动到所选省市区
                // this.baiduMap.centerAndZoom(code[3]+code[4]+code[5],12);
            },
            onAreaChange(consignerAddress){
                console.log(consignerAddress);
                this.form[consignerAddress]=''; //验证不通过
                console.log(this.form);
            },
            sinterMapClick(e) {
              var _this = this;
              _this.form.longitude = e.point.lng;
              _this.form.latitude = e.point.lat;
            }

        },
/*        watch:{
            loadingMap(curval,oldval){
                if(curval){
                    this.showMap();
                }
            }
        },*/
        mounted() {
            this.getData();
        //    this.initOrgPlant();
        }
    }

</script>

<style>
/*    #allmap {
        width:100%;
        height:500px!important;
        overflow: hidden;
    }*/
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>