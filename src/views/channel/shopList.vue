<template>
    <section>
        <!--查询-->
        <div class="toolbar el-col el-col-24" style="margin-top: 40px;text-align:right;">
            <div class="block">
                <!--按钮-->
                <el-input size="medium" v-model.trim="queryKey" placeholder="输入渠道名称或账号" style="width:370px;"></el-input>
                <el-button size="medium" type="primary"  v-on:click="getSpreadChannelList(true)" :loading="listLoading" icon="el-icon-search" v-if="isAuth('scloud:channelforshop:view')">查询</el-button>
                <el-button size="medium" type="primary"  align="center"  v-on:click="synchronizationChaParameterBtn" v-if="isAuth('scloud:channelforshop:insert')">同步门店信息</el-button>
            </div>
        </div>

        <!--table-->
        <el-table v-loading="listLoading" :data="spreadChannel" style="width: 100%;margin-top: 30px;">
            <el-table-column type="index" width="50"> </el-table-column>
            <el-table-column sortable align="center" prop="channelName"label="渠道名称"> </el-table-column>
            <el-table-column sortable align="center" prop="userName"label="账号"> </el-table-column>
            <el-table-column sortable align="center" prop="relateType" label="类型"> </el-table-column>
            <el-table-column sortable align="center" prop="count" label="推广次数"> </el-table-column>
            <el-table-column sortable align="center" prop="percentage" label="操作">
                <template slot-scope="scope">
                    <el-button @click="getShowQRcode(scope.row)" type="primary" size="mini" v-if="isAuth('scloud:channelforshop:shopinfo:view')">推广码</el-button>
                    <el-button @click="manageDetail(scope.row)" type="primary" size="mini" v-if="isAuth('scloud:channelforshop:view')">详细管理</el-button>
                    <el-button @click="isDelete(scope.row)" type="primary" size="mini" v-if="isAuth('scloud:channelforshop:update')" >{{scope.row.enable}}</el-button>
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

        <!--新增基础推广信息界面    该功能暂未开放-->
        <el-dialog title="新增" v-model="addFormVisible" :visible.sync="addFormVisible">
            <el-form :model="addBaseForm" label-width="80px" :rules="addFormRules" ref="addBaseForm">
                <el-form-item label="渠道名称" prop="channelName">
                    <el-input v-model="addBaseForm.channelName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="relateType" >
                    <el-radio-group v-model="addBaseForm.relateType">
                        <el-radio class="radio" :label="1">个人</el-radio>
                        <el-radio class="radio" :label="0">门店</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="用户名称" prop="userName">
                    <el-input v-model="addBaseForm.userName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="联系电话" prop="userPhone">
                    <el-input v-model="addBaseForm.userPhone" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="userPassword">
                    <el-input type="password" v-model="addBaseForm.userPassword" ></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="text" v-model="addBaseForm.remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit('addBaseForm')" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>


        <!--新增推广详情界面-->
        <el-dialog title="新增" v-model="addInfoFormVisible" :visible.sync="addInfoFormVisible">
            <el-form :model="addInfoForm" label-width="80px" :rules="addInfoFormRules" ref="addInfoForm">
                <el-form-item label="渠道名称" prop="channelName">
                    <el-input v-model="addInfoForm.channelName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="渠道类型" prop="channelType" >
                    <el-radio-group v-model="addInfoForm.channelType">
                        <el-radio class="radio" :label="0">APP</el-radio>
                        <el-radio class="radio" :label="1">微信</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="渠道参数" prop="channelParameter">
                    <el-input v-model="addInfoForm.channelParameter" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="text" v-model="addInfoForm.remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addInfoFormVisible = false">取消</el-button>
                <!--  <el-button @click="resetForm('ruleForm')">重置</el-button>-->
                <el-button type="primary" @click.native="addInfoSubmit('addInfoForm')" :loading="addInfoLoading">提交</el-button>
            </div>
        </el-dialog>


        <!--渠道详情管理界面-->
        <el-dialog title="渠道管理" v-model="manageDetailVisible" :visible.sync="manageDetailVisible">
            <el-button type="primary" size="small" align="center"  v-on:click="addSpreadChannelInfoButton" style="float: right" v-if="isAuth('scloud:channelforshop:insert')">新增</el-button>
            <el-table :data="spreadChannelInfo" style="width: 100%;">
                <el-table-column type="index" width="50"> </el-table-column>
                <el-table-column sortable align="center" show-overflow-tooltip property="channelName" label="名称"></el-table-column>
                <el-table-column sortable align="center" show-overflow-tooltip property="channelType" label="渠道类型"></el-table-column>
                <el-table-column sortable align="center" show-overflow-tooltip property="channelParameter" label="渠道参数"></el-table-column>
                <el-table-column sortable align="center" show-overflow-tooltip property="count" label="推广次数"></el-table-column>
                <el-table-column sortable align="center" show-overflow-tooltip property="qrCode" label="二维码地址值"></el-table-column>
                <el-table-column sortable align="center" show-overflow-tooltip property="remark" label="备注"></el-table-column>
                <el-table-column sortable align="center" prop="percentage" width="200" label="操作">
                    <template slot-scope="scope">
                        <el-button @click="getShowQRcodeSingle(scope.row)" type="primary" size="mini">推广码</el-button>
                        <el-button @click="isDeleteTo(scope.row)" type="primary" size="mini" v-if="isAuth('scloud:channelforshop:update')">{{scope.row.enable}}</el-button>
                    </template>
                </el-table-column>

            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="manageDetailVisible = false">关闭</el-button>
            </div>
        </el-dialog>

        <template>
           <!-- <el-dialog title="注意!!!" :visible.sync="outerVisibleSingle" width="20%" >-->
                <el-dialog width="30%" title="推广码" :visible.sync="innerVisibleSingle" append-to-body >
                    <span>用户扫描推广码下载应用之后，务必让用户立即点开应用并进入首页，否则会统计不到。</span>
                    <div style="text-align: center;margin:auto;">

                        <div  v-show="isShowApp">
                        <div style="float:none">
                            <p >APP二维码</p>
                            <p><img :src="APPQRCodeUrl" width="200"  ></p>
                            <el-button round @click="download(APPQRCodeUrl,0)" >下载图片</el-button>
                        </div>
                        </div>

                        <div  v-show="isShowWechat">
                        <div style="float: none">
                            <p>微信二维码</p>
                            <p><img :src="WXQRCodeUrl" width="200"  > </p>
                            <el-button round @click="download(WXQRCodeUrl,1)" ><a :href="WXQRCodeUrl" download="w3logo"></a>下载图片</el-button>
                        </div>
                        </div>
                        <div style="clear: both;"></div>
                    </div>

                </el-dialog>
            <!--</el-dialog>-->
        </template>



        <template>
            <!--<el-dialog title="注意!!!" :visible.sync="outerVisible" width="20%" >-->
                <el-dialog width="30%" title="推广码" :visible.sync="innerVisible" append-to-body >
                    <span>用户扫描推广码下载应用之后，务必让用户立即点开应用并进入首页，否则会统计不到。</span>
                    <div style="text-align: center;margin:auto;max-height: 320px;overflow-y: auto;overflow-x:hidden">

                            <div style="float:none" v-for="item in detailList">
                                <div v-if="item.channelType === 0">
                                    <p >{{item.channelName}}--APP二维码</p>
                                    <p><img :src="APPQRCodeUrl" width="200"  ></p>
                                    <el-button round @click="download(APPQRCodeUrl,0)" >下载图片</el-button>
                                </div>

                                <div v-if="item.channelType === 1">
                                <p>{{item.channelName}}--微信二维码</p>
                                <p><img :src="WXQRCodeUrl" width="200"  > </p>
                                <el-button round @click="download(WXQRCodeUrl,1)" ><a :href="WXQRCodeUrl" download="w3logo"></a>下载图片</el-button>
                                </div>
                            </div>

                        <div style="clear: both;"></div>
                    </div>

                </el-dialog>
            <!--</el-dialog>-->
        </template>

    </section>

</template>

<script>
    import util from '../../common/js/util';
    import md5 from 'js-md5';
    import { shopSpreadChannelList,enableSpreadChannel,synchronizationSpreadChannel,getSpreadChannelInfoList,enableSpreadChannelInfo,
        addSpreadChannelBase,addSpreadChannelInfo,getChaParameter,getQrImage} from '../../api/api';

    export default {
        data() {
            return {
                detailList:[],
                spreadChannel: [],
                spreadChannelInfo: [],
                page: 1,
                listLoading: false,
                addLoading : false,
                addInfoLoading: false,
                total:0,
                pageNum: 1, //当前页码
                pageSize: 10,//页数
                queryKey:"",
                addBaseForm : {
                    channelName: "",
                    userName: "",
                    userPhone: "",
                    userPassword: "",
                    userPasswordTo: "",
                    remark:"",
                    relateType: -1
                },
                addFormVisible : false,

                //功能暂未开放
                addFormRules: {
                    channelName: [
                        {required: true, message: '请输入渠道名称', trigger: 'blur'},
                    ],
                    userName: [
                        {required: true, message: '请输入用户名称', trigger: 'blur'},
                    ],
                    userPhone: [
                        {required: true, message: '请输入用户手机号码', trigger: 'blur'},
                    ],
                    userPassword: [
                        {required: true, message: '请输入用户密码', trigger: 'blur'}
                    ],
                    relateType: [
                        {required: true, message: '请选择类型', trigger: 'blur'},
                    ],

                },
                addInfoForm :{
                    spreadChannelBaseId:null,
                    channelName: "",
                    channelParameter: "",
                    remark:"",
                    channelType: -1
                },
                addInfoFormVisible : false,
                addInfoFormRules:{
                    channelName : [
                        {required: true, message: '请输入渠道名称', trigger: 'blur'},
                    ],
                    channelParameter : [
                        {required: true, message: '请输入渠道参数', trigger: 'blur'},
                        {  max: 32, message: '最大不超过32个字符', trigger: 'blur' },
                        {  pattern:/^[a-zA-Z0-9]+$/, message: '只能包括英文字母和数字' }

                    ],
                    channelType: [
                        {required: true, message: '请选择类型', trigger: 'change'},
                    ],
                },
                manageDetailVisible : false,
                outerVisible: false,
                innerVisible: false,
                APPQRCodeUrl:"",
                WXQRCodeUrl:"",
                isShowApp : true,//下载app显示
                isShowWechat : true,
                isYesWechat : true,//下载app显示
                isYesApp : true,
                innerVisibleSingle : false,
                outerVisibleSingle : false,
            }
        },

        //渠道基本信息列表展示
        methods: {
            getSpreadChannelList(flag) {
                var para = {
                    pageInfo: {
                        pageNum:flag===true?1:this.pageNum,
                        pageSize: this.pageSize,
                    },
                    queryKey:this.queryKey
                };
                this.listLoading = true;

                shopSpreadChannelList(para).then((res) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(res)){
                            //this.total = res.data.total;
                            //alert(res.data.data.list);

                            var list = res.data.list;
                            for(var i=0;i<list.length;i++){
                                if (list[i].relateType == 0){
                                    list[i].relateType = "门店";
                                }else{
                                    list[i].relateType = "用户";
                                }
                                if(list[i].enable == 0){
                                    list[i].enable = "禁用";
                                }else{
                                    list[i].enable = "启用";
                                }
                            }
                            this.spreadChannel = res.data.list;
                            this.total = res.data.paginationInfo.total;
                        }
                    }
                    ,res => { this.listLoading = false; }
                );
            },

            //切换页数
            handleCurrentChange(val) {
                this.pageNum = val;
                this.getSpreadChannelList();
            },
            //处理分页条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.getSpreadChannelList();
            },

            //基本信息禁用 or 启用
            isDelete(row){

                var del = {
                    id :row.id,
                    enable : row.enable == "禁用" ? 1 :0
                };
                enableSpreadChannel(del).then((data) => {
                    if (this.GLOBAL.isResonseSuccess(data)){
                        this.getSpreadChannelList();
                    }
                });
            },

            //打开基本信息新增界面
            addSpreadChannelButton(){
                alert("暂未开放此功能!");
                return;
                this.addFormVisible= true;
                this.addBaseForm = {
                    channelName: "",
                    userName: "",
                    userPhone: "",
                    userPassword: "",
                    userPasswordTo: "",
                    remark:"",
                    relateType: ""
                };
            },

            //基本信息新增确认
            addSubmit(formName){
                this.addLoading = true;

                /* this.$refs[formName].validate((valid) => {
                     if (valid) {
                         alert('submit!');
                     } else {
                         console.log('error submit!!');
                         return false;
                     }
                 });*/

                let para = Object.assign({}, this.addBaseForm);
                para.userPassword = md5(this.addBaseForm.userPassword);
                addSpreadChannelBase(para).then((data) => {
                    if (this.GLOBAL.isResonseSuccess(data)){
                        this.getSpreadChannelList();
                    }
                });

                this.addLoading = false;
                this.addFormVisible= false;
            },


            //警告提醒展示
            /*warn(row){
                this.outerVisible=true;
                this.id = row.id;
                this.shopName = row.shopName;
                this.channelType = row.channelType;

            },*/


            //查看二维码时根据微信或者app来显示
            chooseChannelType(type){
                if(type === 1){
                    this.isShowWechat = true;//下载wechat显示
                    this.isShowApp = false;
                }else if(type === 0){
                    this.isShowApp = true;//下载app显示
                    this.isShowWechat = false;
                }
            },

            hiddenApp(flag){
                if(0 === flag) {
                    this.isYesApp = false;//不显示app
                }
            },
            hiddenWechat(flag){
                if(1 === flag){
                    this.isYesWechat = false;//不显示wechat
                }
            },

            showApp(flag){
                if(0 === flag){
                    this.isYesApp = true;//显示app
                }
            },
            showWechat(flag){
                if(1 === flag){
                    this.isYesWechat = true;//显示wechat
                }
            },




            //获取展示二维码
            getShowQRcode(row){
                this.outerVisible=true;
                this.id = row.id;
                this.channelName = row.channelName;
                var data = {
                    spreadChannelBaseId: this.id
                }
                this.APPQRCodeUrl = "";
                this.WXQRCodeUrl = "";
                //调用二维码
                getSpreadChannelInfoList(data).then((data) => {
                    if (this.GLOBAL.isResonseSuccess(data)){
                        var list = data.data;
                        if(list != null &&list.length >0 ){
                            for(var i=0;i<list.length;i++){
                                if(list[i].channelType == 0){
                                    var qrValue =  encodeURIComponent(process.env.APP_QRCode +list[i].channelParameter);
                                    var codeName =  encodeURIComponent(list[i].channelName+"qAPP下载推广码.jpg");
                                    this.APPQRCodeUrl = process.env.API_ROOT +"/image/createQrcodeImage?size=2000&codeName="+codeName+"&qrValue="+qrValue;
                                    getQrImage(this.APPQRCodeUrl).then((data) => {
                                        this.innerVisible = true;
                                        this.outerVisible = false;
                                    });
                                }
                                if (list[i].channelType == 1){
                                    var codeName =  encodeURIComponent(list[i].channelName+"公众号推广码.jpg");
                                    this.WXQRCodeUrl = process.env.API_ROOT +"/image/createQrcodeImage?size=2000&codeName="+codeName+"&qrValue="+list[i].qrCode;
                                    getQrImage(this.WXQRCodeUrl).then((data) => {
                                        this.innerVisible = true;
                                        this.outerVisible = false;
                                    });
                                }

                            }
                            this.detailList = data.data;


                        }else{
                            this.$message({
                                message: '该渠道未创建相关二维码信息，请转至详细管理中新增二维码信息',
                                type: 'error'
                            });
                            this.outerVisible = false;
                        }
                    }
                });

            },


            //获取展示二维码单个
            getShowQRcodeSingle(row){
                this.outerVisibleSingle=true;
                this.channelName = row.channelName;
                this.channelType = row.channelType;

                this.APPQRCodeUrl = "";
                this.WXQRCodeUrl = "";
                if(this.channelType === "微信"){
                    this.channelType = 1;
                    this.chooseChannelType(this.channelType);
                }
                if(this.channelType === "APP"){
                    this.channelType = 0;
                    this.chooseChannelType(this.channelType);
                }
                //调用二维码
                if(row != null){
                    if(this.channelType === 0){
                        var qrValue =  encodeURIComponent(process.env.APP_QRCode +row.channelParameter);
                        var codeName =  encodeURIComponent(this.channelName+"APP下载推广码.jpg");
                        this.APPQRCodeUrl = process.env.API_ROOT +"/image/createQrcodeImage?size=2000&codeName="+codeName+"&qrValue="+qrValue;
                        getQrImage(this.APPQRCodeUrl).then((data) => {
                            this.innerVisibleSingle = true;
                            this.outerVisibleSingle = false;
                        });
                        }else if (this.channelType === 1){
                            var codeName =  encodeURIComponent(this.channelName+"公众号推广码.jpg");
                            this.WXQRCodeUrl = process.env.API_ROOT +"/image/createQrcodeImage?size=2000&codeName="+codeName+"&qrValue="+row.qrCode;
                        getQrImage(this.WXQRCodeUrl).then((data) => {
                            this.innerVisibleSingle = true;
                            this.outerVisibleSingle = false;
                        });
                        }


                }else{
                    this.$message({
                        message: '未找到二维码信息!',
                        type: 'error'
                    });
                    this.outerVisibleSingle = false;
                }

            },

            download(imgURL,type){
                if(type == 0){
                    this.APPQRCodeUrl = imgURL+"&isOpen=1";
                    window.location.href = this.APPQRCodeUrl;
                }else{
                    this.WXQRCodeUrl = imgURL+"&isOpen=1";
                    window.location.href = this.WXQRCodeUrl;
                }
            },



            //渠道详情列表页面
            manageDetail(row){
                var data = {
                    spreadChannelBaseId : row.id
                }
                getSpreadChannelInfoList(data).then((data) => {
                    var list = data.data;
                    for(var i=0;i<list.length;i++){
                        if (list[i].channelType == 0){
                            list[i].channelType = "APP";
                        }else if (list[i].channelType == 1){
                            list[i].channelType = "微信";
                        }

                        if(list[i].enable == 0){
                            list[i].enable = "禁用";
                        }else{
                            list[i].enable = "启用";
                        }
                    }
                    //this.flagYesNo(row);
                    this.spreadChannelInfo = data.data;
                    this.manageDetailVisible = true;
                });

                this.addInfoForm.spreadChannelBaseId = row.id;

            },

            editManageDetail(){
                alert("暂未开放此功能!");
            },

            //禁用/启动渠道详细信息
            isDeleteTo(row){
                var del = {
                    id :row.id,
                    enable : row.enable == "禁用" ? 1 :0
                };
                enableSpreadChannelInfo(del).then((data) => {
                    if (this.GLOBAL.isResonseSuccess(data)){
                        var data ={
                            id : row.spreadChannelBaseId
                        }
                        this.manageDetail(data);
                    }
                });
            },


            //打开新增渠道详情界面
            addSpreadChannelInfoButton(){
                this.addInfoFormVisible= true;
                this.addInfoForm = {
                    spreadChannelBaseId:this.addInfoForm.spreadChannelBaseId,
                    channelName: "",
                    channelParameter: "",
                    remark:"",
                    channelType: ""
                };
            },

            //添加渠道详细信息
            addInfoSubmit(ve){
                this.$refs[ve].validate((valid) => {
                    if (valid) {
                        this.addInfoLoading = true;
                        let para = Object.assign({}, this.addInfoForm);
                        addSpreadChannelInfo(para).then((data) => {

                            if (this.GLOBAL.isResonseSuccess(data)){
                                var row = {
                                    id : this.addInfoForm.spreadChannelBaseId
                                };
                                this.manageDetail(row);
                                this.addInfoFormVisible= false;
                            }
                        });

                        this.addInfoLoading = false;
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            //同步门店信息至渠道
            synchronizationChaParameterBtn(){
                const loading = this.$loading({
                    lock: true,
                    text: '拼命同步中~',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });

                synchronizationSpreadChannel().then((data) => {
                    loading.close();

                    console.log(data);
                    if (this.GLOBAL.isResonseSuccess(data)){

                        this.$message({
                            message: '同步成功!',
                            type: 'success'
                        });
                        this.getSpreadChannelList();

                    }
                });

            }
        },

        mounted() {
            this.getSpreadChannelList();
        }
    }

</script>
