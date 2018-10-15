<template>
    <div style="margin-top: 45px;">
        <el-form :inline="true" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" :loading="loadingInfo">
            <!--服务点名称-->
            <el-form-item label="服务点编码" prop="orgCode">
                <el-input v-model="ruleForm.orgCode" :disabled="isDisable" style="width: 240px;"></el-input>
<!--                <el-input
                        suffix-icon="el-icon-search" @focus="orgVisible=true" style="width: 240px;"
                        v-model="ruleForm.orgCode" :disabled="isDisable" auto-complete="off">
                </el-input>-->
            </el-form-item>
            <br/>
            <!--服务点名称-->
            <el-form-item label="服务点名称" prop="orgName">
                <!--<el-input v-model="ruleForm.orgName" :disabled="true" style="width: 240px;"></el-input>-->
                <el-input v-model="ruleForm.orgName" :disabled="isDisable" style="width: 240px;" :change="replaceValue()"></el-input>
            </el-form-item>
            <br/>

            <!--服务点类型-->
            <el-form-item label="服务点类型" prop="servicePointType">
                <el-radio-group v-model="ruleForm.servicePointType">
                    <el-radio label=1>实体服务点</el-radio>
                    <el-radio label=0>虚拟服务点</el-radio>
                </el-radio-group>
            </el-form-item>
            <br/>
            <!--是否为测试门店-->
            <el-form-item label="测试门店" prop="testDataFlag">
                <el-radio-group v-model="ruleForm.testDataFlag">
                    <el-radio label=1>是测试门店</el-radio>
                    <el-radio label=0>非测试门店</el-radio>
                </el-radio-group>
            </el-form-item>
            <br/>

            <el-form-item   prop="consignerAddress3" label="服务点地址">
                <addr-select :editData ="editData"  ref="child" @getresult = "getResult" @onAreaChange="onAreaChange('consignerAddress3')"  ></addr-select>
            </el-form-item>
            <el-form-item label="" prop="address">
                <el-input v-model="ruleForm.address" placeholder="请输入详细地址" style="width: 240px;"></el-input>
            </el-form-item>
            <br/>
            <el-form-item label="服务标签" prop="label">
                <el-input v-model="ruleForm.label" placeholder="" style="width: 240px;"></el-input>
            </el-form-item>
            <br/>

            <!--上门取件-->
            <el-form-item label="上门取件" prop="pickupFlag">
                <el-switch v-model="ruleForm.pickupFlag"></el-switch>
            </el-form-item>
            <br/>

            <!--自送门店-->
            <el-form-item label="自送门店" prop="sendStoresFlag">
                <el-switch v-model="ruleForm.sendStoresFlag"></el-switch>
            </el-form-item>
            <br/>

            <!--智能柜取件-->
            <el-form-item label="智能柜取件" prop="cabinetFlag">
                <el-switch v-model="ruleForm.cabinetFlag"></el-switch>
            </el-form-item>
            <br/>
            <!--加工中心-->
            <el-form-item label="加工中心" prop="machiningCenter" v-loading="loadingCenter">
                <el-select v-model="ruleForm.machiningCenter" placeholder="请选择或搜索加工中心名称和地址" filterable style="width: 260px;">
                    <el-option
                            v-for="item in ruleForm.machiningCenterList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            :disabled="item.disableFlag == 1">

                                     <span v-if="ruleForm.id != null">
                                        <span style="float: left">{{ item.label }}</span>
                                        <span v-if="item.disableFlag == 0" style="float: right; color: #8492a6; font-size: 13px">
                                            启用
                                        </span>
                                        <span v-if="item.disableFlag == 1" style="float: right; color: #8492a6; font-size: 13px">
                                            禁用
                                        </span>
                                    </span>

                    </el-option>

                </el-select>
            </el-form-item>
            <br/>

            <!--手机-->
            <el-form-item label="手机" prop="telephone">
                <el-input v-model="ruleForm.telephone" style="width: 240px;"></el-input>
            </el-form-item>
            <br/>

 <!--           &lt;!&ndash;图片 头像&ndash;&gt;
            <el-form-item label="图片" prop="imgPath">
                <el-input v-model="ruleForm.imgPath" style="width: 240px;"></el-input>
            </el-form-item>-->
            <el-form-item label="图片" prop="imgPath">
                <span>
                    <fileupload @getresult="getImgResult" :disabled="isDisable" :imglist = "imgList" :number="num" :type="type"></fileupload>
                </span>
            </el-form-item>
            <br/>

            <!--新增营业时间-->
            <el-form-item
                    style="display: block;"
                    v-for="(openingTime, index) in ruleForm.openingTimes"
                    label="营业时间"
                    :key="openingTime.key"
                    :prop="'openingTimes.' + index + '.value'">
                <el-time-picker
                        value-format="HH:mm"
                        format="HH:mm"
                        placeholder="起始时间"
                        v-model="openingTime.value2">
                </el-time-picker>
                &nbsp;至&nbsp;
                <el-time-picker
                        value-format="HH:mm"
                        format="HH:mm"
                        placeholder="结束时间"
                        v-model="openingTime.value3"
                       >
                </el-time-picker>
                <el-select v-model="openingTime.value1" placeholder="周期"  multiple style="width: 260px;">
                    <el-option label="周一" value="周一"></el-option>
                    <el-option label="周二" value="周二"></el-option>
                    <el-option label="周三" value="周三"></el-option>
                    <el-option label="周四" value="周四"></el-option>
                    <el-option label="周五" value="周五"></el-option>
                    <el-option label="周六" value="周六"></el-option>
                    <el-option label="周日" value="周日"></el-option>
                </el-select>
                &nbsp;&nbsp;<el-switch v-model="openingTime.value4"></el-switch>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<el-button @click.prevent="removeOpeningTime(openingTime)" v-if="index>0">删除</el-button>
            </el-form-item>

            <!--新增营业时间按钮-->
            <el-form-item style="margin-left: 100px;">
                <el-button @click="addOpeningTime">新增营业时间</el-button>
            </el-form-item>
            <br/>

            <!--新增高峰时间-->
            <el-form-item
                    style="display: block;"
                    v-for="(fastigiumTime, index) in ruleForm.fastigiumTimes"
                    label="高峰时间"
                    :key="fastigiumTime.key"
                    :prop="'fastigiumTimes.' + index + '.value'" >
                <el-time-picker
                        value-format="HH:mm"
                        format="HH:mm"
                        placeholder="起始时间"
                        v-model="fastigiumTime.value2" >
                </el-time-picker>
                &nbsp;至&nbsp;
                <el-time-picker
                        value-format="HH:mm"
                        format="HH:mm"
                        placeholder="结束时间"
                        v-model="fastigiumTime.value3"
                       >
                </el-time-picker>
                <el-select v-model="fastigiumTime.value1" placeholder="周期"  multiple style="width: 260px;">
                    <el-option label="周一" value="周一"></el-option>
                    <el-option label="周二" value="周二"></el-option>
                    <el-option label="周三" value="周三"></el-option>
                    <el-option label="周四" value="周四"></el-option>
                    <el-option label="周五" value="周五"></el-option>
                    <el-option label="周六" value="周六"></el-option>
                    <el-option label="周日" value="周日"></el-option>
                </el-select>
                &nbsp;&nbsp;<el-switch v-model="fastigiumTime.value4"></el-switch>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<el-button @click.prevent="removeFastigiumTime(fastigiumTime)" v-if="index>0">删除</el-button>
            </el-form-item>

            <!--新增高峰时间按钮-->
            <el-form-item style="margin-left: 100px;">
                <el-button @click="addFastigiumTime">新增高峰时间</el-button>
            </el-form-item>
            <br/>

            <!--备注-->
            <el-form-item label="备注" prop="remark">
                <el-input type="textarea" v-model="ruleForm.remark" style="width: 260px;"></el-input>
            </el-form-item>
            <br/>

            <!--经纬度-->
            <el-form-item label="经纬度" prop="longitude">
                <el-input v-model="ruleForm.longitude" placeholder="经度" style="width: 100px;"></el-input>
            </el-form-item>
            <el-form-item label="" prop="latitude">
                <el-input v-model="ruleForm.latitude" placeholder="纬度" style="width: 100px;"></el-input>
            </el-form-item>
            <br/>

            <!--提交按钮-->
            <el-form-item style="margin-left: 100px;">
                <el-button :loading="loadingSubmit" type="primary" @click="submitForm('ruleForm')">提交</el-button>
            </el-form-item>
        </el-form>

        <div class="toolbar el-col el-col-24" style="margin:0;padding:0;" :loading="loadingMap">
            <!-- <div id="allmap"></div> -->
            <SinterMap :loading="loadingMap" :fullName="fullName" :center="{longitude:ruleForm.longitude,latitude:ruleForm.latitude}" @sinterMapClick="sinterMapClick"></SinterMap>
        </div>

        <!--组织架构门店列表-->
        <el-dialog title="选择服务点"  v-model="orgVisible" :visible.sync="orgVisible" >
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


            <el-table :data="orgShopList" @row-click="choiceCodeAndName">
                <el-table-column property="orgCode" label="编码" ></el-table-column>
                <el-table-column property="orgName" label="名称"></el-table-column>
            </el-table>

            <!--分页-->
            <div class="block" style="text-align:right;">
                <el-pagination @current-change="orgHandleCurrentChange"
                               :page-size="orgShopPageSize"
                               layout="prev, pager, next"
                               :total="orgShopTotal">
                </el-pagination>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import util from '../../common/js/util';
    import { getServicePointInfoById,getOrgListByTypeAndBusinessType,updateServicePoint,addServicePoint,getMachiningCenterListFun} from '../../api/api';
    // import BMap from 'BMap';
    import addrSelect from '@/components/addrSelect';
    import fileupload from '@/components/fileUpload';
    import  {VDT ,VDATA} from '@/common/js/validate';
    import SinterMap from "@/components/map";
    export default {
        components:{
            fileupload,addrSelect,SinterMap
        },
        data() {
            //自定义验证手机号
            var validatePhone = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入手机号'));
                } else if(!(new RegExp(/^1\d{10}$/).test(value))){
                    callback(new Error('手机号码格式错误'));
                }else{
                    callback();
                }
            };
            return {
                type:"1",//这个是上传图片的类型 1为上传普通图片 2为上传头像 3为上传商品图片
                num:'1',//参数为1限制为只能上传一张2为多张
                imgList:[],

                editData:[],//后台返回的修改数据如果此数据为空说明是新增否则是修改
                orgFilters:{ //组织架构查询框
                    orgValue:'',
                    orgFlag:'',
                },
                orgShopList:[],//组织架构中服务点列表
                orgVisible:false,//选择服务点弹框是否显示
                orgShopTotal:0,//组织架构中服务点列表分页信息
                orgShopPage: 1,
                orgShopPageSize:5,
                orgName:'',
                orgCode:'',
                isDisable:false,

                loadingInfo:false,//加载详情
                loadingAddress:false,//加载省市区列表
                loadingSubmit:false,//加载提交按钮
                loadingMap:false,//加载百度地图
                loadingCenter:false,//加载加工中心列表
                // baiduMap:'',//百度地图
                fullName: '',  //省市区

                dialogVisible: false,//弹出框
                headPhoto: '',//头像地址字段
                imageUrl:'',//要在页面显示的头像地址
                cityName:'',//城市名称

                id:this.$route.query.id,//服务点id
                actionType:this.$route.query.actionType,//操作类型
                ruleForm: {
                    id:'',
                    orgCode:'' ,//服务点名称
                    orgName:'' ,
                    longitude:'',//经度
                    latitude:'',//纬度
                    areaCode:'',//选中省市区id
                    cityName:'',
                    address:'',//地址
                    servicePointType:'',//服务点类型
                    imgPath:'',//头像地址
                    pickupFlag:true ,//上门取件开关
                    sendStoresFlag:true ,//用户自送门店开关
                    cabinetFlag:true ,//智能柜取件开关

                    telephone:'',//负责人手机号
                    remark:'',//备注
                    label:'',//服务标签

                    openingTimes: [{
                        value1: [],//周期
                        value2: '',//开始时间
                        value3: '',//结束时间
                        value4: false,//开关
                    }],
                    fastigiumTimes: [{
                        value1: [],
                        value2: '',
                        value3: '',
                        value4: false,
                    }],
                    consignerAddress3:'',
                    machiningCenterList:[],//加工中心列表
                    machiningCenter:null,//加工中心id

                    testDataFlag:'',//是否为测试会员(0:否;1:是)
                },
                rules: {
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
                    orgName: [
                        { required: true, message: '请输入服务点名称', trigger: 'blur' },
                        /*{ min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }*/
                    ],
                    servicePointType: [
                        { required: true, message: '请选择服务点类型', trigger: 'change' }
                    ],
                    machiningCenter: [
                        { required: true, message: '请选择加工中心', trigger: 'change' }
                    ],
                    telephone: [
                        { required: true, validator: validatePhone, trigger: 'blur' },
                    ],
                    consignerAddress3: [
                        { required: true, message: '请选择区域', trigger: 'change' }
                    ],
                    address: [
                        { required: true, message: '请选择或输入服务点地址', trigger: 'blur' },
                    ],
 /*                   cascader: [
                        { required: true, message:'请选择省/市/区', trigger: 'change' },
                    ],*/
                    longitude: [
                        { required: true, message:'请选择经纬度', trigger: 'blur' },
                    ],
                    latitude: [
                        { required: true, message:'请选择经纬度', trigger: 'blur' },
                    ],
                }
            };
        },
        methods: {
            replaceValue(){
                var a = this.ruleForm.orgName.replace(/[^\w\u4E00-\u9FA5`~!@#$%^&*()_+<>?:"{},.\/;'[\]·！#￥（——）：；“”‘、，|《。》？、【】]/g, '');
                console.log(a);
                this.ruleForm.orgName = a;
            },

            //获取服务点详情
            getServicePointInfo() {
                if ('add'==this.actionType){ //如果是新增页面
                    console.log(this.actionType);
                    // this.showMap();
                }else {//编辑页面


                    let para = {};
                    para.id = this.id;
                    this.loadingInfo = true;
                    getServicePointInfoById(para).then((data) => {
                            this.loadingInfo = false;
                            if (this.GLOBAL.isResonseSuccess(data)){
                                var info = data.data;
                                if(!data.data || data.data === "" || data.data === null)return false;
                                this.ruleForm.orgName=info.orgName;//服务点名称
                                this.ruleForm.orgCode=info.orgCode;//服务点名称
                                this.ruleForm.servicePointType = info.servicePointType+'';//服务点类型
                                this.ruleForm.address=info.address;//地址
                                this.ruleForm.label=info.label;//服务标签
                                this.ruleForm.pickupFlag = info.pickupFlag==1?true:false;//上门取件开关
                                this.ruleForm.sendStoresFlag = info.sendStoresFlag==1?true:false;//用户自送门店开关
                                this.ruleForm.cabinetFlag = info.cabinetFlag==1?true:false;//智能柜取件开关
                                this.ruleForm.telephone=info.telephone;//负责人手机号
                                this.ruleForm.remark=info.remark;//备注
                                this.ruleForm.longitude=info.longitude;//经度
                                this.ruleForm.latitude=info.latitude;//纬度
                                this.ruleForm.cityName=info.cityName;//城市名
                                this.cityName=info.cityName;//城市名
                                this.ruleForm.areaCode=info.areaCode;//所属区域code
                                this.ruleForm.imgPath=info.imgPath;//头像地址
                                this.ruleForm.machiningCenter=info.shopPlantId;//加工中心id
                                this.ruleForm.testDataFlag=info.testDataFlag+'';//是否为测试门店


                                if (this.ruleForm.areaCode && this.ruleForm.areaCode.length==6){//如果所属区域代码不为空 并且长度为6
                                    console.log(this.ruleForm.areaCode);
                                    this.editData= [this.ruleForm.areaCode.substr(0,2),this.ruleForm.areaCode.substr(0,4),this.ruleForm.areaCode];
                                    console.log(this.editData);
                                }else {
                                    this.editData=[];
                                }

                                this.imgList.push({name:"",url:this.GLOBAL.getImgUrl(this.ruleForm.imgPath)});

                                if(info.openingTime!=''){
                                    this.ruleForm.openingTimes=util.jsonToArr(info.openingTime);
                                }
                                if(info.fastigiumTime!=''){
                                    this.ruleForm.fastigiumTimes=util.jsonToArr(info.fastigiumTime);
                                }

                                // this.showMap();
                            }
                        }
                        ,data => { this.loadingInfo = false; }
                    );

                }


            },


            //更新 添加服务点
            servicePointEditOrAdd() {
                var para = {
                    id:this.id,
                    address:this.ruleForm.address,//地址
                    orgName:this.ruleForm.orgName,//服务点名称
                    orgCode:this.ruleForm.orgCode,//服务点编码
                    servicePointType:this.ruleForm.servicePointType,//服务点类型

                    pickupFlag:this.ruleForm.pickupFlag?1:0,//上门取件开关
                    sendStoresFlag:this.ruleForm.sendStoresFlag?1:0,//用户自送门店开关
                    cabinetFlag:this.ruleForm.cabinetFlag?1:0,//智能柜取件开关

                    telephone:this.ruleForm.telephone,//负责人手机号
                    remark:this.ruleForm.remark,//备注
                    label:this.ruleForm.label,//服务标签
                    areaCode:this.ruleForm.areaCode,//区id
                    imgPath:this.ruleForm.imgPath,//图片地址
                    longitude:this.ruleForm.longitude,//经度
                    latitude:this.ruleForm.latitude,//纬度
                    cityName:this.ruleForm.cityName,//城市名称
                    orgType:1,//  `org_type` int(11) NOT NULL COMMENT '商家类型（1:门店;2加工中心;）',
                    shopPlantId:this.ruleForm.machiningCenter,//加工中心id
                    testDataFlag:this.ruleForm.testDataFlag,//是否为测试门店(0:否;1:是)

                    //营业时间
                    openingTime:util.arrToJson(this.ruleForm.openingTimes),
                    //高峰时间
                    fastigiumTime:util.arrToJson(this.ruleForm.fastigiumTimes),
                };
                //console.log(para);
                this.loadingSubmit = true;
                if ('add'==this.actionType){
                    addServicePoint(para).then((data) =>{
                            this.loadingSubmit = false;
                            if (this.GLOBAL.isResonseSuccess(data)){
                                this.$message({
                                    message: '新增服务点成功!',
                                    type: 'success'
                                });
                                this.$router.push({path: 'list'});
                            }else {
                               let errorMessage = data.message;
                                this.$message({
                                    message: errorMessage,
                                    type: 'error'
                                });
                                this.ruleForm.openingTimes = [{
                                    value1: [],//周期
                                    value2: '',//开始时间
                                    value3: '',//结束时间
                                    value4: false,//开关
                                }];
                                this.ruleForm.fastigiumTimes=[{
                                    value1: [],
                                    value2: '',
                                    value3: '',
                                    value4: false,
                                }];
                              //  this.$router.push({path: 'list'});
                            }
                    },
                    data =>{

                        this.loadingSubmit = false;
                        console.log(data);
                        console.log("addServicePoint error");
                           })
                }else {
                    updateServicePoint(para).then((data) => {
                            this.loadingSubmit = false;
                            if (this.GLOBAL.isResonseSuccess(data)){
                                this.addSuccess();
                                this.$router.push({path: 'list'});
                            }else {
                                let errorMessage = data.message;
                                this.$message({
                                    message: errorMessage,
                                    type: 'error'
                                });
                                this.ruleForm.openingTimes = [{
                                    value1: [],//周期
                                    value2: '',//开始时间
                                    value3: '',//结束时间
                                    value4: false,//开关
                                }];
                                this.ruleForm.fastigiumTimes=[{
                                    value1: [],
                                    value2: '',
                                    value3: '',
                                    value4: false,
                                }];
                                //  this.$router.push({path: 'list'});
                            }
                        }
                        ,data => {
                        this.loadingSubmit = false; }
                    );
                }


            },
            //获取加工中心列表
            getMachiningCenterList() {
                this.loadingCenter = true;
                getMachiningCenterListFun(null).then((data) => {
                        this.loadingCenter = false;
                        if (this.GLOBAL.isResonseSuccess(data)){
                            var machiningCenterList=data.data;
                            for(var i=0;i<machiningCenterList.length;i++){
                                var obj = {
                                    value: machiningCenterList[i].id,
                                    label: machiningCenterList[i].name+"  [地址:"+machiningCenterList[i].shopAddress+"]",
                                    disableFlag:machiningCenterList[i].disableFlag

                                }
                                this.ruleForm.machiningCenterList.push(obj);
                            }
                        }
                    }
                    ,data => { this.loadingCenter = false; }
                );
            },
            //提交
            submitForm(formName) {
                //console.log(this.ruleForm.openingTimes);
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.servicePointEditOrAdd();
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //新增营业时间
            addOpeningTime() {
                this.ruleForm.openingTimes.push({
                    value: '',
                    key: Date.now()
                });
            },
            //新增高峰时间
            addFastigiumTime() {
                this.ruleForm.fastigiumTimes.push({
                    value: '',
                    key: Date.now()
                });
            },
            //删除一个营业时间项
            removeOpeningTime(item) {
                var index = this.ruleForm.openingTimes.indexOf(item)
                if (index !== -1) {
                    this.ruleForm.openingTimes.splice(index, 1)
                }
            },
            //删除一个高峰时间项
            removeFastigiumTime(item) {
                var index = this.ruleForm.fastigiumTimes.indexOf(item)
                if (index !== -1) {
                    this.ruleForm.fastigiumTimes.splice(index, 1)
                }
            },
            addSuccess() {
                this.$message({
                    message: '编辑成功!',
                    type: 'success'
                });
            },
            //百度地图api
            //加载方式:1.默认初始化 2.获取默认城市 3.切换城市
            showMap(){
                this.loadingMap = true;
                var cityName = this.cityName==''?'深圳市':this.cityName;
                this.dialogVisible = true;
               // var map = new BMap.Map("allmap");
                this.baiduMap = new BMap.Map("allmap");
                this.baiduMap.centerAndZoom(cityName,12);
                this.baiduMap.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
                this.baiduMap.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用
                this.loadingMap = false;
                //单击获取点击的经纬度
                var _this = this;
                this.baiduMap.addEventListener("click",function(e){
                    _this.ruleForm.longitude=e.point.lng;
                    _this.ruleForm.latitude=e.point.lat;
                });

                //控制地图高度
                document.getElementById("allmap").style.height=document.documentElement.clientHeight-210+"px";
            },
            handleChange(value) {
                this.getCityName(value[0],value[1]);
                //百度地图
                // this.showMap();
            },


            //初始化加工厂组织架构数据
            initOrgShop(){
                let para = {
                    //类型(1,工厂;2,门店;3,仓库)
                    orgType: 2,
                    orgCode:this.orgCode,
                    orgName:this.orgName,
                    //业务类型(1,洗护;2,名品)
                    businessType:1,
                    pageInfo: {
                        pageNum: this.orgShopPage,
                        pageSize: this.orgShopPageSize,
                    },
                };
                getOrgListByTypeAndBusinessType(para).then((res)=>{
                    if (this.GLOBAL.isResonseSuccess(res)){
                        this.orgShopList = res.data.list;
                        //console.log(this.orgShopList);
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
                this.initOrgShop();
            },
            //工厂组织架构切换页数
            orgHandleCurrentChange(val){
                this.orgShopPage = val;
                this.initOrgShop();
            },
            //点击选中此编码名称
            choiceCodeAndName(row, event, column){
                //   console.log(row);
                // 赋值编辑页面 编码与名称
                this.ruleForm.orgCode = row.orgCode;
                this.ruleForm.orgName = row.orgName;
                //关闭弹框
                this.orgVisible = false;
            },
            //获取选中的结果
            getResult(result){
                console.log("当前选中的省市区code为:"+result);
                var code = result.split(" ");
                this.ruleForm.areaCode = code [2];
                this.ruleForm.cityName = code [4];
                this.ruleForm.consignerAddress3 = code [2];
                
                this.fullName = code[3] + code[4] + code[5];

                //百度地图中心移动到所选省市区
                // this.baiduMap.centerAndZoom(code[3]+code[4]+code[5],12);
            },
            onAreaChange(consignerAddress){
                console.log(consignerAddress);
                this.ruleForm[consignerAddress]=''; //验证不通过
                console.log(this.ruleForm);
            },
            sinterMapClick(e) {
              var _this = this;
              _this.ruleForm.longitude = e.point.lng;
              _this.ruleForm.latitude = e.point.lat;
            },
            getImgResult(result){
                let img = "";
                //返回的图片地址
                if(result.length==0){
                    console.log("当前没有图片");
                    this.ruleForm.imgPath = "";
                }else{
                    for(let item of result){
                        img += item.relativeUrl;
                    }
                    this.ruleForm.imgPath = img;
                }
            },

        },
        mounted() {
            //获取服务点详情
            this.getServicePointInfo();
          //  this.initOrgShop();
            //获取加工中心列表
            this.getMachiningCenterList();
        }
    }
</script>

<style>
    #allmap {
        width:100%;
        height:100%;
        overflow: hidden;
    }
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