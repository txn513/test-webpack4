<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">

            <el-form align="right" :inline="true"  class="demo-form-inline">
                <el-form-item label="">
                    <el-input v-model="filters.orgCode" placeholder="门店编码"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-input v-model="filters.orgName" placeholder="门店名称"></el-input>
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
                    <el-button v-if="isAuth('mpys:shopinfo:insert')" type="primary" @click="handleEditOrAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="list" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
             <el-table-column prop="orgCode" label="门店编码"></el-table-column>
             <el-table-column prop="orgName" label="门店名称" show-overflow-tooltip></el-table-column>
             <el-table-column prop="abbr" label="简称" show-overflow-tooltip></el-table-column>
             <el-table-column prop="shopType" label="类型" :formatter="formatDisableFlag" show-overflow-tooltip></el-table-column>
             <el-table-column prop="regionName" label="区域" show-overflow-tooltip></el-table-column>
             <el-table-column prop="keeper" label="负责人"></el-table-column>
             <el-table-column prop="telephone" label="店长手机" show-overflow-tooltip></el-table-column>
             <el-table-column prop="phoneOne" label="门店电话1" show-overflow-tooltip></el-table-column>
             <el-table-column prop="phoneTwo" label="门店电话2" show-overflow-tooltip></el-table-column>
             <el-table-column prop="address" label="地址" show-overflow-tooltip></el-table-column>
            <el-table-column prop="area" label="面积㎡"></el-table-column>
             <el-table-column prop="lngLat" label="经纬度" :formatter="formatlngLat" show-overflow-tooltip></el-table-column>
             <el-table-column prop="serviceNames" label="服务" show-overflow-tooltip></el-table-column>
            <el-table-column prop="storeNames" label="仓库" show-overflow-tooltip></el-table-column>
            <el-table-column prop="disableFlag" label="状态" :formatter="formatDisableFlag"></el-table-column>

            <el-table-column  fixed="right" label="操作" width="230">
                <template slot-scope="scope">
                    <el-button v-if="isAuth('mpys:shopinfo:update')" type="primary" :disabled="scope.row.disableFlag == '1'" size="mini" @click="handleEditOrAdd(scope.$index, scope.row, false)">编辑</el-button>
                    <el-button v-if="isAuth('mpys:shopinfo:delete') && false" type="primary" :disabled="scope.row.disableFlag == '1'" size="mini" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                    <el-button v-if="isAuth('mpys:shopinfo:update') && scope.row.disableFlag == 1" type="primary" size="mini" @click="updateDisableFlag(scope.row, 0)">启用</el-button>
                    <el-button v-if="isAuth('mpys:shopinfo:update') && scope.row.disableFlag == 0" type="primary" size="mini" @click="updateDisableFlag(scope.row, 1)">停用</el-button>
                    <el-button v-if="isAuth('mpys:shopinfo:view')" type="primary" size="mini" @click="handleEditOrAdd(scope.$index, scope.row, true)">查看</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
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
                        <el-form-item label="编码" prop="orgCode" ref="refOrgCode">

                    <!--        <el-input
                                    suffix-icon="el-icon-search" @focus="orgVisible=true"
                                    v-model="form.orgCode" :disabled="isDisable" auto-complete="off">
                            </el-input>-->
                            <el-input v-model="form.orgCode" :disabled="isDisable" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="名称" prop="orgName">
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
                        <el-form-item label="类型" prop="shopType">
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
                    <el-col :span="24">
                        <el-form-item label="地址" prop="address">
                            <el-input v-model="form.address" :disabled="isDisable" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="责任人" prop="keeper">
                            <el-input v-model="form.keeper" :disabled="isDisable" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="店长手机" prop="telephone">
                            <el-input v-model="form.telephone" :disabled="isDisable" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="门店电话" prop="phoneOne">
                            <el-input v-model="form.phoneOne" :disabled="isDisable" auto-complete="off"></el-input>
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
                    <el-col :span="8">
                        <el-form-item label="门店电话2" prop="phoneTwo">
                            <el-input v-model="form.phoneTwo" :disabled="isDisable" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="仓库" prop="stores">
                            <el-select v-model="form.stores" :disabled="isDisable" multiple placeholder="请选择">
                                <el-option
                                        v-for="item in storeList"
                                        :key="item.storeNo"
                                        :value ="item.storeNo"
                                        :label="item.storeName"
                                        :disabled="item.status == 0">
                                    <span v-if="form.id != null">
                                        <span style="float: left">{{ item.storeName }}</span>
                                        <span v-if="item.status == 1" style="float: right; color: #8492a6; font-size: 13px">
                                            启用
                                        </span>
                                        <span v-if="item.status == 0" style="float: right; color: #8492a6; font-size: 13px">
                                            禁用
                                        </span>
                                    </span>
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="服务" prop="services">
                            <el-select v-model="form.services" :disabled="isDisable" multiple placeholder="请选择">
                                <el-option
                                        v-for="item in serviceList"
                                        :key="item.id"
                                        :value ="item.id"
                                        :label="item.serviceName"
                                        :disabled="item.status == 0">
                                    <span v-if="form.id != null">
                                        <span style="float: left">{{ item.serviceName }}</span>
                                        <span v-if="item.status == 1" style="float: right; color: #8492a6; font-size: 13px">
                                            启用
                                        </span>
                                        <span v-if="item.status == 0" style="float: right; color: #8492a6; font-size: 13px">
                                            禁用
                                        </span>
                                    </span>
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="门店图片" prop="imgPath">
                    <span v-if="this.title != '查看'">
                        <fileupload @getresult="getResult" :disabled="isDisable" :imglist = "imgList" :number="num" :type="type"></fileupload>
                    </span>
                    <span v-if="this.title == '查看'">
                        <img :src="imgPath" height="150" width="150"/>

                    </span>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button v-if="this.isNotView == true" @click.native="formVisible = false">取消</el-button>
                <el-button v-if="this.isNotView == true" type="primary" @click.native="submit" :loading="loading">提交</el-button>
            </div>
        </el-dialog>


        <!--组织架构名品门店列表-->
        <el-dialog title="选择门店"  v-model="orgVisible" :visible.sync="orgVisible" >
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
    </section>
</template>

<script>
    import {getLuxuryShopList, removeShopInfo,getAvailableStores,getAllStores,getAvailableServices,getAllServices, queryArea, editLuxuryShopInfo, addLuxuryShopInfo,updateShopStatus,getOrgListByTypeAndBusinessType} from '../../api/api';
    import fileupload from '@/components/fileUpload';
    import  {VDT ,VDATA} from '@/common/js/validate';
    export default {
        components:{
            fileupload
        },
        data() {
            return {
                orgFilters:{ //组织架构查询框
                    orgValue:'',
                    orgFlag:'',
                },
                filters: {
                    orgCode: '',
                    orgName: '',
                    keeper: '',
                    disableFlag: '',
                    imgPath:''
                },
                type:"1",//这个是上传图片的类型 1为上传普通图片 2为上传头像 3为上传商品图片
                num:'1',//参数为1限制为只能上传一张2为多张
                imgList:[],
                list: [],
                isDestory : false,
                isNotView:true,
                isDisable: true,
                storeList:[],//仓库列表
                serviceList:[],//服务列表
                regionList:[],//区域列表
                total: 0,
                title:"新增",//弹出框标题
                pageNum: 1, //当前页码
                pageSize: 10,//页数
                listLoading: false,
                formVisible: false,
                loading: false,

                orgShopList:[],//组织架构中门店列表
                orgVisible:false,//选择门店弹框是否显示
                orgShopTotal:0,//组织架构中门店列表分页信息
                orgShopPage: 1,
                orgShopPageSize:5,
                orgName:'',
                orgCode:'',

                formRules: {
                    orgCode: [
                        {required: true, message: '请输入门店编码(必须是数字类型)', trigger: 'blur'},
                        {
                            validator: (rule,value,callback) => {
                                let vdt = VDATA(value, {"digits" : {msg:"请输入有效的数字"}, "maxlength":{param: "12", msg: "最大值不能超过12个字符"}})
                                if (!vdt.result) {
                                    callback(new Error(vdt.msg))
                                }else{
                                    callback();
                                }
                            },
                            trigger: 'blur'
                        }
                    ],
                    orgName: [{required: true, message: '请输入门店名称', trigger: 'blur'},
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
                    keeper: [{required: true, message: '请输入店长姓名', trigger: 'blur'},
                        {max: 10, message: '姓名最多10个字符,请重新输入', trigger: 'blur' }
                    ],
                    telephone:[
                        {required: true, message: '请输入店长手机号', trigger: 'blur'},
                        {
                            validator: (rule,value,callback) => {
                                let vdt = VDATA(value,{"mphone" : {msg:"请输入正确格式的电话号码"}})
                                if (!vdt.result) {
                                    callback(new Error(vdt.msg))
                                }else{
                                    callback();
                                }
                            },
                            trigger: 'blur'
                        }
                    ],
                    phoneOne:[
                        {required: true, message: '请输入门店电话', trigger: 'blur'},
                        {
                            validator: (rule,value,callback) => {
                                let vdt = VDATA(value,{"tphone" : {msg:"请输入正确格式的门店电话"}})
                                if (!vdt.result) {
                                    callback(new Error(vdt.msg))
                                }else{
                                    callback();
                                }
                            },
                            trigger: 'blur'
                        }
                    ],
                    phoneTwo:[
                        {
                            validator: (rule,value,callback) => {
                                if (value != null && value != ''&&value!=undefined){
                                    let vdt = VDATA(value,{"tphone" : {msg:"请输入正确格式的门店电话"}})
                                    if (!vdt.result) {
                                        callback(new Error(vdt.msg))
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
                    address: [{required: true, message: '请输入地址', trigger: 'blur'},
                        {max: 100, message: '地址做多100个字符,请重新输入', trigger: 'blur' }
                    ],
                    longitude: [
                        {required: true, message: '请输入经度', trigger: 'blur'},
                        {
                            validator: (rule,value,callback) => {
                                var reg = new RegExp(/^[\-\+]?(0?\d{1,2}\.\d{6}|1[0-7]?\d{1}\.\d{6}|180)$/);
                                if (!reg.test(value)) {
                                    callback(new Error('请输入正确经度,正负180六位小数'))
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
                                    callback(new Error('请输入正确纬度,正负90六位小数'))
                                }else{
                                    callback();
                                }
                            },
                            trigger: 'blur'
                        }
                    ],
                    stores: [{required: true, message: '请选择仓库', trigger: 'blur'}
                    ],
                    imgPath: [{required: true, message: '请选择图片', trigger: 'blur'}
                    ],
                },
                //编辑界面数据
                form: {
                      id:'' ,
                      orgCode:'' ,
                      orgName:'' ,
                      abbr:'' ,
                      orgType:'' ,
                      shopType:'' ,//shop_type int(11) not null comment '商家类型（1:门店;2加工中心;)',
                      regionCode:'' ,
                      regionName:'' ,
                      area:'' ,
                      keeper:'' ,
                      telephone:'' ,
                      phoneOne:'' ,
                      phoneTwo:'' ,
                      address:'' ,
                      longitude:'' ,
                      latitude:'' ,
                      lngLat:'',
                      services:[],
                      stores:[],
                      imgPath:'',
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
            getResult(result){
                let img = "";
                //返回的图片地址
                if(result.length==0){
                    console.log("当前没有图片");
                    this.form.imgPath = "";
                }else{
                    for(let item of result){
                        img += item.relativeUrl;
                    }
                    this.form.imgPath = img;
                }
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
                getLuxuryShopList(para).then((res) => {
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
                removeShopInfo(para).then((res) => {
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
                updateShopStatus(para).then((res) => {
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.getData();
                    }else{
                        this.$message.error(res.message());
                    }
                });

            },
            //显示编辑/新增界面
            handleEditOrAdd: function (index, row ,isView) {
                if (row) {
                    if (true == isView){
                        this.title= "查看";
                        this.isDisable = true;
                        this.isNotView = false;
                     //   this.getAllStores();
                        this.getAllStores();
                        this.getAllServices();
                        this.imgPath = this.GLOBAL.getImgUrl(row.imgPath);
                    }else{
                        this.title= "编辑";
                        this.isDisable = false;
                        this.isNotView = true;
                        this.getAllStores();
                        this.getAllServices();
                    }
                    this.form = Object.assign({}, row);
                    //如果服务为空 给个空数组
                    if (!this.form.services){
                        this.form.services =[];
                    }
                    this.imgList.push({name:"",url:this.GLOBAL.getImgUrl(row.imgPath)});
                    this.rebuildLatLon()

                } else {
                    this.isDisable = false;
                    this.isNotView = true;
                    this.title= "新增";
                    this.form = {};
                    this.getAvailableStores()
                    this.getAvailableServices();
                }
                this.formVisible = true;
                this.isDestory = true;
                this.getRegion();
            },
            rebuildLatLon(){
                let longitude = this.form.longitude;
                if (longitude != 180 && longitude != -180) {
                    this.form.longitude = longitude.toFixed(6);
                }

                let latitude = this.form.latitude;
                if (latitude != 90 && latitude != -90){
                    this.form.latitude = latitude.toFixed(6);
                }
            },
            //编辑
            submit: function () {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.loading = true;
                        let para = Object.assign({}, this.form);
                        if(para.id) {
                            editLuxuryShopInfo(para).then((res) => {
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
                                    this.$message.error(res.message());
                                }
                            });
                        } else {
                            addLuxuryShopInfo(para).then((res) => {
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
                                    this.$message.error(res.message());
                                }
                            });
                        }
                    });
                    }
                });
            },
            closeDialog: function(){
                this.isDestory = false;
                this.imgList = [];
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
            //新增获取可用仓库
            getAvailableStores: function() {
                getAvailableStores({status:1}).then((res) => {
                    this.listLoading = false;
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.storeList = res.data;
                    }
                    return false;
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },
            //编辑获取全部仓库
            getAllStores: function() {
                getAllStores({}).then((res) => {
                    this.listLoading = false;
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.storeList = res.data;
                    }
                    return false;
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },
            //新增获取可用服务
            getAvailableServices: function() {
                getAvailableServices({}).then((res) => {
                    this.listLoading = false;
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.serviceList = res.data;
                    }
                    return false;
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },
            //编辑获取全部服务
            getAllServices: function() {
                getAllServices({}).then((res) => {
                    this.listLoading = false;
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.serviceList = res.data;
                    }
                    return false;
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
            initOrgShop(){
                let para = {
                    //类型(1,工厂;2,门店;3,仓库)
                    orgType: 2,
                    orgCode:this.orgCode,
                    orgName:this.orgName,
                    //业务类型(1,洗护;2,名品)
                    businessType:2,
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
                this.form.orgCode = row.orgCode;
                this.form.orgName = row.orgName;
                //清除校验文字描述
                this.$refs['refOrgCode'].clearValidate() ;
                //关闭选中加门店弹框
                this.orgVisible = false;
            },
        },
        mounted() {
            this.getData();
        //    this.initOrgShop();
        }
    }

</script>

<style scoped>

</style>