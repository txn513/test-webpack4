<template>
    <section>
        <!--查询-->
        <div class="toolbar el-col el-col-24" style="margin-top: 40px;text-align:right;">
            <el-input size="medium" v-model.trim="siteId" placeholder="地点编号" clearable style="width:200px;"></el-input>
            &nbsp;&nbsp;
            <el-input size="medium" v-model.trim="addr" placeholder="详细地址" clearable style="width:200px;"></el-input>
            &nbsp;&nbsp;
            <!--城市选择-->
            <el-select v-model="shopId" placeholder="所属店铺" filterable style="width:140px;">
                <el-option label="所有店铺" value=""></el-option>
                <el-option
                        v-for="item in shopList"
                        :key="item.id"
                        :label="item.orgName"
                        :value="item.id">
                </el-option>
            </el-select>
            &nbsp;&nbsp;
            <!--状态-->
            <el-select v-model="statusFlag" placeholder="状态" style="width:120px;">
                <el-option label="所有" value=""></el-option>
                <el-option label="在线" value="0"></el-option>
                <el-option label="离线" value="1"></el-option>
                <el-option label="不可用" value="2"></el-option>
            </el-select>&nbsp;
            &nbsp;&nbsp;
            <!--提交按钮-->
            <el-button type="primary" v-on:click="getRes()" :loading="listLoading" icon="el-icon-search">查询</el-button>
            &nbsp;&nbsp;   &nbsp;&nbsp;
            <div class="block">
                <div style="float:left"> <el-button type="primary"  align="center"  v-on:click="synchronization" >同步智能柜信息</el-button></div>
            </div>

        </div>

        <!--table-->
        <el-table v-loading="listLoading" :data="site" style="width: 100%;margin-top: 30px;">
            <el-table-column  align="center" prop="siteId"label="地点编号"> </el-table-column>
            <!-- <el-table-column  align="center" prop="account"label="门店账号"> </el-table-column>-->
            <el-table-column  align="center" prop="shopName" label="店铺名称" > </el-table-column>
            <el-table-column  align="center" prop="fullName" label="地点全名" > </el-table-column>
            <el-table-column  align="center" prop="addr" label="详细地址" show-overflow-tooltip> </el-table-column>
            <el-table-column  align="center" prop="statusFlag" label="状态" > </el-table-column>
            <el-table-column  align="center" prop="disableFlag" label="启用" >
                <template slot-scope="scope">
                    <span v-if="scope.row.disableFlag==='启用'">已禁用</span>
                    <span v-if="scope.row.disableFlag==='禁用'">已启用</span>
                </template>
            </el-table-column>

            <el-table-column  align="center" prop="percentage" label="操作">
                <template slot-scope="scope">
                    <el-button @click="siteEdit(scope.$index, scope.row)" type="primary" size="mini">编辑</el-button>
                    <el-button @click="isDeletes(scope.row)" type="primary" size="mini"  >{{scope.row.disableFlag}}</el-button>
                </template>
            </el-table-column>

        </el-table>

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


        <el-dialog title="编辑" v-model="editFormVisible" :visible.sync="editFormVisible"  >
            <el-form  :model="editForm" label-width="120px"  ref="editForm" :rules="editFormRules" style="width: 100%;height: 100%">
                <el-form-item label="地点编号" prop="siteId">
                    <el-input v-model="editForm.siteId" disabled ></el-input>
                </el-form-item>
                <el-form-item label="地点名称" prop="siteName">
                    <el-input v-model="editForm.siteName" disabled ></el-input>
                </el-form-item>
                <el-form-item label="地点全名" prop="fullName">
                    <el-input v-model="editForm.fullName" disabled ></el-input>
                </el-form-item>
                <el-form-item label="详细地址" prop="addr">
                    <el-input v-model="editForm.addr" ></el-input>
                </el-form-item>
                <el-form-item label="地区门店筛选" >
                    <area-code :shopData ="shopData"  ref="child"  @getProvince="getProvince" @getCity="getCity" @getresult = "getErea"></area-code>
                </el-form-item>
                <el-form-item label="选择门店" prop="storeId">
                    <el-select style="width: 552px;" v-model="editForm.storeId" placeholder="选择门店" filterable >
                        <el-option
                                v-for="item in options1"
                                :key="item.value"
                                :label="'门店名称: ' + item.orgName + ' ' + '门店地址: ' + item.address"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="地区选择"  >
                    <addr-select :editData ="editData"  ref="child" @getresult = "getResult"  ></addr-select>
                </el-form-item>

                <el-form-item label="经度" prop="longitude">
                    <el-input v-model="editForm.longitude" ></el-input>
                </el-form-item>
                <el-form-item label="纬度" prop="latitude">
                    <el-input v-model="editForm.latitude" ></el-input>
                </el-form-item>

            </el-form>

            <div id="allmap" :loading="loadingMap"></div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="submitForm" :loading="editFormLoading">保存</el-button>
                <el-button @click.native="editFormVisible = false">取消</el-button>
            </div>

        </el-dialog>



    </section>

</template>

<script>




    import { getSiteList,siteIsDelete,editSiteCityCode,siteSynchronous,getShopIdByCode,getByShopId,getReassignServicePointFun} from '../../api/api';
    import BMap from 'BMap';
    import addrSelect from '@/components/addrSelect';
    import areaCode from '@/components/areaCode';
    import ElButton from "../../../node_modules/element-ui/packages/button/src/button";


    export default {
        components:{
            ElButton,
            addrSelect,
            areaCode
        },
        data() {

            var checkLon = (rule, value, callback) => {
                var reg = new RegExp('^-?((0|1?[0-7]?[0-9]?)(([.][0-9]{1,6})?)|180(([.][0]{1,6})?))$')
                if(!reg.test(value)){
                    callback(new Error('超出长度'));
                }else {
                    callback();
                }
            };

            var checkLat = (rule, value, callback) => {
                var reg = new RegExp('^-?((0|[1-8]?[0-9]?)(([.][0-9]{1,6})?)|90(([.][0]{1,6})?))$')
                if(!reg.test(value)){
                    callback(new Error('超出长度'));
                }else {
                    callback();
                }
            };
            return {
                options1: [],//门店列表
                editData: [],
                shopData: [],
                site: [],
                total: 0,
                pageNum: 1, //当前页码
                pageSize: 10,//页数
                listLoading: false,
                editFormVisible: false,//编辑界面是否显示
                dialogVisible: false,//弹出框
                loadingMap:false,
                editFormLoading:false,
                code:"",
                id : "",

                addr:'',//地址
                statusFlag:null,//状态
                shopId:null,//城市
                shopList:[],
                siteId:'',//地点编号

                //新增界面数据
                editForm: {
                    siteId:"",
                    siteName:"",
                    fullName:"",
                    addr:"",
                    longitude:"",
                    latitude:"",
                    areaCode:'',
                    cityCode:"",
                    provinceCode:"",
                    districtId:"",
                    storeId:"",
                },

                //新增寄卖订单验证
                editFormRules: {
                    addr: [
                        {required: true, message: '请输入详细地址', trigger: 'blur'},
                        {max: 50, message: '长度不超过20个字符', trigger: 'blur' }
                    ],
                    storeId: [
                        { required: true, message:'请选择门店', trigger: 'blur' },
                    ],
                    /*editData: [
                        { required: true, message:'请选择地区'},
                    ],*/
                    longitude: [
                        { required: true, message:'请选择经纬度', trigger: 'blur' },
                        {validator: checkLon, trigger: 'blur'},
                    ],
                    latitude: [
                        { required: true, message:'请选择经纬度', trigger: 'blur' },
                        {validator: checkLat, trigger: 'blur'},
                    ],
                }
                ,
            }
        },
        watch:{
            loadingMap(curval,oldval){
                if(curval){
                    this.showMap();
                }
            }
        },
        //渠道基本信息列表展示
        methods: {
            //查询
            getRes(){
                this.pageNum=1;
                this.getData();
            },

            //获取注册城市列表
            getShopList(){
                getReassignServicePointFun(null).then((data) => {
                        if (this.GLOBAL.isResonseSuccess(data)){
                            this.shopList=data.data;
                        }
                    }
                );
            },

            getResult(result){
                console.log("当前选中的省市区code为:"+result);
                var code = result.split(" ");
                this.editForm.provinceCode = code[0];
                this.editForm.cityCode = code[1];
                this.editForm.areaCode = code [2];

            },

            getProvince(result){
                console.log("当前选中的省code为:"+result);
                var code = result.split(" ");
                console.log("当前选中的省code为:"+result);
                this.code = code[0];
                this.getShop();
            },
            getCity(result){
                console.log("当前选中的省市code为:"+result);
                var code = result.split(" ");

                this.code = code[1];
                this.getShop();
            },
            getErea(result){
                console.log("当前选中的省市区code为:"+result);
                var code = result.split(" ");
                this.code = code [2];
                this.getShop();

            },

            //根据areaCode 获取门店信息
            getShop() {
                let para = {
                    areaCode:this.code,
                };
                this.listLoading = true;
                getShopIdByCode(para).then((res) => {
                        this.listLoading = false;
                        this.options1 = res.data;
                        this.editForm.storeId = res.data[0].id
                    }
                    ,res => { this.listLoading = false; }).catch(() => {}
                );
            },

            //根据门店Id 获取门店信息
            getShopByShopId() {
                if (this.id != null) {
                    let para = {
                        id:this.id,
                    };
                    this.listLoading = true;
                    getByShopId(para).then((res) => {
                        this.listLoading = false;
                        this.options1 = [{
                            orgName: res.data.orgName,
                            address: res.data.address,
                            id:res.data.id
                        }]
                    }, res => { this.listLoading = false; }).catch(() => {}
                    );
                }else {
                    this.options1 = [{
                        orgName: "",
                        address: "",
                        id:""
                    }]
                }

            },









            //显示编辑界面
            siteEdit: function (index, row) {
                this.shopData=[];
                this.shopData.push(this.editForm.provinceCode = "");
                this.shopData.push(this.editForm.cityCode = "");
                this.shopData.push(this.editForm.areaCode = "");

                this.editData=[];
                if (row.districtId.toString().length == 6 && row.districtId != 0){
                    this.editData.push(this.editForm.provinceCode = row.districtId.toString().substr(0,2));
                    this.editData.push(this.editForm.cityCode = row.districtId.toString().substr(0,4));
                    this.editData.push(this.editForm.areaCode = row.districtId);
                }else {
                    this.editData.push(this.editForm.provinceCode = "");
                    this.editData.push(this.editForm.cityCode = "");
                    this.editData.push(this.editForm.areaCode = "");
                }


                this.options1=[];
                if (row.storeId == 0){
                    row.storeId = null;
                }
                this.id=row.storeId;
                this.editForm = Object.assign({}, row);
                this.getShopByShopId();
                this.editFormVisible = true;
                setTimeout(()=>{this.showMap()},0);



            },



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

            //基本信息禁用 or 启用
            isDeletes(row){
                var del = {
                    id :row.id,
                    disableFlag : row.disableFlag == "禁用" ? 1 :0
                };

                siteIsDelete(del).then((data) => {
                    if (this.GLOBAL.isResonseSuccess(data)){
                        this.getData();
                    }
                });
            },


            synchronization () {
                let para = "";
                siteSynchronous(para).then((res) => {
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.$message({
                            message: '同步成功',
                            type: 'success'
                        });

                        this.getData();
                    }
                });
            },

            submitForm () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        if(!this.editForm.areaCode){
                            this.$message({
                                message: '地区选择请选择省市区!',
                                type: 'error'
                            });
                            return false;
                        }
                        this.$confirm('确认保存吗？', '提示', {}).then(() => {
                            this.editFormLoading = true;
                            let region = {
                                disableFlag:this.editForm.disableFlag == "禁用" ? 1 :0,
                                "districtId": this.editForm.areaCode,
                            };
                            let para = Object.assign({}, this.editForm ,region);
                            editSiteCityCode(para).then((res) => {
                                this.editFormLoading = false;
                                if (this.GLOBAL.isResonseSuccess(res)) {
                                    this.$message({
                                        message: '保存成功',
                                        type: 'success'
                                    });
                                    this.editFormVisible = false;
                                    this.getData();
                                }
                            });
                        });
                    }
                });
            },

            getData() {
                let para = {
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    },
                    addr:this.addr,
                    storeId:this.shopId,
                    statusFlag:this.statusFlag,
                    siteId:this.siteId
                };
                this.listLoading = true;
                getSiteList(para).then((res) => {
                        this.listLoading = false;
                        var list = res.data.list;
                        for(var i=0;i<list.length;i++){
                            if (list[i].statusFlag == 0){
                                list[i].statusFlag = "在线";
                            }else if(list[i].statusFlag == 1){
                                list[i].statusFlag = "离线";
                            }else{
                                list[i].statusFlag = "不可用";
                            }

                            if(list[i].disableFlag == 1){
                                list[i].disableFlag = "启用";
                            }else{
                                list[i].disableFlag = "禁用";
                            }
                        }
                        this.total = res.data.paginationInfo.total;
                        this.site = res.data.list;
                    }
                    ,res => { this.listLoading = false; }).catch(() => {}
                );
            },


            //百度地图api
            //加载方式:1.默认初始化 2.获取默认城市 3.切换城市
            showMap(){
                this.loadingMap = true;
                this.dialogVisible = true;
                var map = new BMap.Map("allmap");
                map.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
                map.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用
                this.loadingMap = false;
                //单击获取点击的经纬度
                var _this =this;
                map.addEventListener("click",function(e){
                    _this.editForm.longitude=e.point.lng;
                    _this.editForm.latitude=e.point.lat;
                });
                var point = new BMap.Point(_this.editForm.longitude, _this.editForm.latitude);
                map.centerAndZoom(point, 11);
                var marker = new BMap.Marker(point); // 创建标注
                map.addOverlay(marker);
                //控制地图高度
                document.getElementById("allmap").style.height=document.documentElement.clientHeight-210+"px";
                /* this.editFormVisible = true;*/
            },
        },


        mounted() {
            this.getData();

            //店铺列表
            this.getShopList();

        }
    }

</script>

<style>
    #allmap {
        width:100%;
        height:500px!important;
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
