<template>

    <section>
        <div class="toolbar el-col el-col-24" style="justify-content: space-between">
            <div>当前状态：
                <span class="order-status">{{applyStatus}}</span>
            </div>
            <!--提交按钮-->
            <div>
                <span v-if="applyStatus=='待审核'">
                    <el-button type="primary" v-if="" v-on:click="pass()" :loading="listLoading" >初审通过</el-button>
                    <el-button type="primary" v-if="" v-on:click="refuse()" :loading="listLoading" >拒绝</el-button>
                </span>
                <span v-if="applyStatus=='待确认寄送'">
                    <el-button type="primary" v-if="" v-on:click="confirmGetGood()" :loading="listLoading" >确认收货</el-button>
                    <el-button type="primary" v-if="" v-on:click="closeOrder()" :loading="listLoading" >关闭订单</el-button>
                </span>
                <span v-if="applyStatus=='待鉴定'">
                    <el-button type="primary" v-if="" v-on:click="appraisalComplete()" :loading="listLoading" >鉴定完成</el-button>
                    <el-button type="primary" v-if="isShow" v-on:click="appraisalPrice()" :loading="listLoading" >鉴定金额</el-button>
                </span>
                <span v-if="applyStatus=='待寄回'">
                    <el-button type="primary" v-if="" v-on:click="confirmReturn()" :loading="listLoading" >确认寄回</el-button>
                </span>
            </div>

        </div>

        <h3 style="margin-top: 50px;">基本信息</h3>
        <el-table
                v-loading="listLoading"
                element-loading-text="拼命加载中"
                :data="baseInfo"
                style="width: 100%;margin-top: 5px;">
            <el-table-column
                    prop="id"
                    label="订单编号"
                    >
            </el-table-column>
            <el-table-column
                    prop="createTime"
                    :formatter="dateFormat"
                    label="下单时间">
            </el-table-column>
            <el-table-column
                    prop="phone"
                    label="会员电话号码">
            </el-table-column>

        </el-table>
        <!--商品信息表格-->
        <h3 style="margin-top: 50px;">商品信息</h3>
        <el-table
                v-loading="listLoading"
                element-loading-text="拼命加载中"
                :data="itemsInfo"
                style="width: 100%;margin-top: 5px;">
            <el-table-column
                    prop="className"
                    label="品类">
            </el-table-column>
            <el-table-column
                    prop="brandName"
                    label="品牌">
            </el-table-column>
            <el-table-column
                    prop="imgPaths"
                    label="图片">
                <template slot-scope="scope"><img v-for="item in scope.row.imgPaths" :src="getImgUrl(item)" v-on:click="showImg(item)" style="width: 50px;height: 50px;margin-left: 10px" ></template>
            </el-table-column>
        </el-table>

        <!--配送信息表格-->
        <h3 style="margin-top: 50px;">配送信息</h3>
        <el-table
                v-loading="listLoading"
                element-loading-text="拼命加载中"
                :data="distributionInfoList"
                style="width: 100%;margin-top: 5px;">
            <el-table-column
                    prop="distributionType"
                    label="类型">
            </el-table-column>
            <!--<el-table-column-->
                    <!--prop="consigneePeople"-->
                    <!--label="收货人">-->
            <!--</el-table-column>-->
            <el-table-column
                    prop="phone"
                    label="收货人电话">
            </el-table-column>
            <!--<el-table-column
                    prop="postcode"
                    label="邮政编码">
            </el-table-column>-->
            <el-table-column
                    prop="address"
                    label="地址">
            </el-table-column>
            <el-table-column
                    prop="logisticsNo"
                    label="物流单号">
            </el-table-column>
        </el-table>

        <!--费用信息-->
        <h3 style="margin-top: 50px;">费用信息</h3>
        <el-table
                v-loading="listLoading"
                element-loading-text="拼命加载中"
                :data="costInfo"
                style="width: 100%;margin-top: 5px;">
            <el-table-column
                    prop="salePrice"
                    label="鉴定金额">
            </el-table-column>
        </el-table>

        <!--鉴定信息-->
        <h3 style="margin-top: 50px;">鉴定信息</h3>
        <el-table
                v-loading="listLoading"
                element-loading-text="拼命加载中"
                :data="appImgInfo"
                style="width: 100%;margin-top: 5px;">
            <el-table-column
                    prop="imgPaths"
                    label="">
                <template slot-scope="scope"><img v-for="item in scope.row.imgPaths" :src="getImgUrl(item)" v-on:click="showImg(item)" style="width: 50px;height: 50px;margin-left: 10px" ></template>
            </el-table-column>
        </el-table>

        <!--操作信息-->
        <h3 style="margin-top: 50px;">操作信息</h3>
        <el-table
                v-loading="listLoading"
                element-loading-text="拼命加载中"
                :data="operationInfo"
                style="width: 100%;margin-top: 5px;">
            <el-table-column
                    prop="operator"
                    label="操作者">
            </el-table-column>
            <el-table-column
                    prop="updateTime"
                    :formatter="dateFormat"
                    label="操作时间">
            </el-table-column>
            <el-table-column
                    prop="orderStatus"
                    label="订单状态">
            </el-table-column>
            <el-table-column
                    prop="operationContent"
                    label="操作">
            </el-table-column>
            <el-table-column
                    prop="remark"
                    label="备注"
                    @change="">
            </el-table-column>
        </el-table>
        <!--图片弹出窗-->
        <el-dialog title="  "  style="width: 100%;height:100%;margin: auto"  :visible.sync="isImgShow">
            <img :src="imgSrc" />
        </el-dialog>
        <!--同意弹出窗-->
        <el-dialog title="初审通过，同意鉴定" style="width: 100%" v-model="passFormVisible" :visible.sync="passFormVisible">
            <el-form ref="passForm" :model="passForm" :rules="passFormRules" label-width="100px" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
                <el-form-item label="处理备注" prop="remark">
                    <el-input v-model="passForm.remark" type="textarea" style="width: 70%;"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click.native="passFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="passSubmit('passForm')" >同意鉴定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--拒绝寄卖弹出窗-->
        <el-dialog title="拒绝鉴定" style="width: 100%" v-model="refuseFormVisible" :visible.sync="refuseFormVisible">
            <el-form ref="refuseForm" :model="refuseForm" :rules="passFormRules" label-width="100px" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
                <el-form-item label="拒绝原因" prop="remark">
                    <el-input v-model="refuseForm.remark" type="textarea" style="width: 70%;"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click.native="refuseFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="refuseSubmit('refuseForm')" >确认拒绝</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--确认收货弹出窗-->
        <el-dialog title="确认收货" style="width: 100%" v-model="confirmFormVisible" :visible.sync="confirmFormVisible">
            <el-form ref="confirmForm" :model="confirmForm" :rules="confirmFormRules" label-width="100px" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
                <el-form-item label="快递单号" prop="logisticsNo">
                    <el-input v-model="confirmForm.logisticsNo" type="number" style="width: 70%;"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click.native="confirmFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="confirmSubmit('confirmForm')" >确认收货</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--关闭订单弹出窗-->
        <el-dialog title="关闭订单" style="width: 100%" v-model="closeFormVisible" :visible.sync="closeFormVisible">
            <el-form ref="closeForm" :model="closeForm" :rules="closeFormRules" label-width="100px" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
                <el-form-item label="原因" prop="remark">
                    <el-input v-model="closeForm.remark" type="textarea" style="width: 70%;"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click.native="closeFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="closeSubmit('closeForm')" >关闭订单</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--鉴定完成弹出窗-->
        <el-dialog title="鉴定完成" style="width: 100%" v-model="appraisalPassFormVisible" :visible.sync="appraisalPassFormVisible">
            <el-form ref="appraisalPassForm" :model="appraisalPassForm" :rules="appraisalPassFormRules" label-width="100px" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
                <el-form-item label="图片" prop="imgs">
                    <fileupload @getresult="getResult" :imglist = "imgList" :number="num" :type="type"></fileupload>
                </el-form-item>
                <el-form-item>
                    <el-button @click.native="appraisalPassFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="appraisalPassSubmit('appraisalPassForm')" >鉴定完成</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--鉴定金额弹出窗-->
        <el-dialog title="鉴定金额" style="width: 100%" v-model="appraisalNotPassFormVisible" :visible.sync="appraisalNotPassFormVisible">
            <el-form ref="appraisalNotPassForm" :model="appraisalNotPassForm" :rules="appraisalNotPassFormRules" label-width="170px" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
                <el-form-item label="已收到客户的鉴定金额" prop="salePrice">
                    <el-input v-model="appraisalNotPassForm.salePrice" type="number" style="width: 70%;"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click.native="appraisalNotPassFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="appraisalNotPassSubmit('appraisalNotPassForm')" >确认</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--确认寄回弹出窗-->
        <el-dialog title="确认寄回" style="width: 100%" v-model="makeMoneyVisible" :visible.sync="makeMoneyVisible">
            <el-form ref="makeMoneyForm" :model="makeMoneyForm" :rules="makeMoneyFormRules" label-width="100px" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
                <el-form-item label="快递单号" prop="logisticsNo">
                    <el-input v-model="makeMoneyForm.logisticsNo" type="number" style="width: 70%;"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click.native="makeMoneyVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="confirmReturnSubmit('makeMoneyForm')" >确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </section>
</template>

<script>
    import util from '../../../common/js/util'
    import fileupload from '@/components/fileUpload';
    import {getRecyclingInfoById,passOrRefuseSubmitFun,confirmSubmitFun,closeSubmitFun,saveAppMoneyFun,confirmReturnFun,saveAppFireFun,makeMoneySubmitFun,confirmCusGetFun} from '../../../api/api';
    export default {
        components:{
            fileupload
        },
        data() {
            return {
                type:"4",//这个是上传图片的类型 1为上传普通图片 2为上传头像 3为上传商品图片 4为业务图片上传
                num:'2',//参数为1限制为只能上传一张2为多张
                imgList:[
                ],//此数组为空说明是新增


                baseInfo:[],//基本信息
                id:this.$route.query.id,
                applyStatus:this.$route.query.applyStatus,
                createTime:'',
                phone:'',

                itemsInfo:[],//商品信息
                className:'',
                brandName:'',
                images:[],

                distributionInfoList:[],//配送信息
                distributionType:'',
                consigneePeople:'',
                consigneePhone:'',
                //postcode:'',
                address:'',
                logisticsNo:'',

                /*图片弹出窗*/
                isImgShow: false,
                imgSrc: '',

                costInfo:[],//费用信息
                salePrice:'',

                appImgInfo:[],//鉴定信息


                operationInfo:[],//操作日志信息
                operator:'',
                updateTime:'',
                orderStatus:'',
                operation:'',


                listLoading: false,
                //同意弹出框
                passFormVisible : false,
                passForm : {
                    id:"",
                    remark:"",
                    flag:'',
                },
                //校验规则
                passFormRules: {
                    remark: [
                        { required: true, message: '请输入备注内容', trigger: 'blur' },
                    ]
                },
                //拒绝弹出框
                refuseFormVisible : false,
                refuseForm : {
                    id:"",
                    remark:"",
                    flag:'',
                },
                //校验规则
                refuseFormRules: {
                    remark: [
                        { required: true, message: '请输入备注内容', trigger: 'blur' },
                    ]
                },
                //确认收货弹出框
                confirmFormVisible : false,
                confirmForm : {
                    id:"",
                    logisticsNo:"",
                },
                //校验规则
                confirmFormRules: {
                    logisticsNo: [
                        { required: true, message: '请输入快递单号', trigger: 'blur' },
                    ]
                },
                //关闭订单弹出框
                closeFormVisible : false,
                closeForm : {
                    id:"",
                    remark:"",
                },
                //校验规则
                closeFormRules: {
                    remark: [
                        { required: true, message: '请输入关闭订单原因', trigger: 'blur' },
                    ]
                },
                //鉴定通过弹出框
                appraisalPassFormVisible : false,
                appraisalPassForm : {
                    id:"",
                    imgs:[],
                },
                //校验规则
                appraisalPassFormRules: {
                    imgs: [
                        { required: true, message: '请选择鉴定图片信息', trigger: 'blur' },
                    ]
                },
                //鉴定不通过弹出框
                appraisalNotPassFormVisible : false,
                appraisalNotPassForm : {
                    id:"",
                    flag:"",
                    salePrice:"",
                },
                //校验规则
                appraisalNotPassFormRules: {
                    salePrice: [
                        { required: true, message: '请输入鉴定金额', trigger: 'blur' },
                    ]
                },
                //财务打款弹出框
                makeMoneyVisible : false,
                makeMoneyForm : {
                    id:"",
                    distributionType:"",
                    logisticsNo:"",
                },
                //校验规则
                makeMoneyFormRules: {
                    logisticsNo: [
                        { required: true, message: '请输入快递单号', trigger: 'blur' },
                    ]
                },
                isShow:true

            }
        },
        methods: {
            //根据id获取采购数据详情
            recyclingInfo(){
                var para={id : this.$route.query.id};
                this.baseInfo = [];
                this.itemsInfo = [];
                this.distributionInfoList = [];
                this.costInfo = [];
                this.paymentInfo = [];
                this.operationInfo = [];
                this.appImgInfo = [];
                getRecyclingInfoById(para).then((data) => {
                    this.baseInfo.push(data.data.baseInfo) ;
                    this.itemsInfo.push(data.data.itemsInfo);
                    this.distributionInfoList.push(data.data.distributionInfoList);
                    this.costInfo.push(data.data.costInfo);
                    this.appImgInfo.push(data.data.appImgInfo);
                    //this.operationInfo.push(data.data.operationInfo);
                    this.operationInfo = data.data.operationInfo;

                    var d = data.data.baseInfo;
                    if(d.applyStatus == 0 ){
                        this.applyStatus = "待审核";
                    }else if(d.applyStatus == 10 ){
                        this.applyStatus = "待确认寄送";
                    }else if(d.applyStatus == 20 ){
                        this.applyStatus = "待鉴定";
                    }else if(d.applyStatus == 30 ){
                        this.applyStatus = "待处理";
                    }else if(d.applyStatus == 40 ){
                        this.applyStatus = "待寄回";
                    }else if(d.applyStatus == 50 ){
                        this.applyStatus = "待发货";
                    }else if(d.applyStatus == 60 ){
                        this.applyStatus = "已发货";
                    }else if(d.applyStatus == 70 ){
                        this.applyStatus = "待打款";
                    }else if(d.applyStatus == 80 ){
                        this.applyStatus = "待收款";
                    }else if(d.applyStatus == 90 ){
                        this.applyStatus = "待退还";
                    }else if(d.applyStatus == 100 ){
                        this.applyStatus = "超时未退";
                    }else if(d.applyStatus == 110 ){
                        this.applyStatus = "过期未还款";
                    }else if(d.applyStatus == 120 ){
                        this.applyStatus = "已退还";
                    }else if(d.applyStatus == 130 ){
                        this.applyStatus = "已完成";
                    }else if(d.applyStatus == 140 ){
                        this.applyStatus = "已关闭";
                    }else{
                        this.applyStatus = "未知的类型";
                    }

                    var q = data.data.distributionInfoList;
                    if(q.distributionType == 0){
                        q.distributionType="寄送";
                    }else if(q.distributionType == 1){
                        q.distributionType="退回";
                    }else{
                        q.distributionType="";
                    }
                    var f = data.data.costInfo;
                    if(f.salePrice == 0){
                        this.costInfo = null;

                    }else {
                        //this.isShow = true;
                        if(f.salePrice == 0){
                            f.salePrice="";
                        }
                    }

                    var p = data.data.appImgInfo;
                    if(0 == p.imgPaths.length){
                        this.isShow = false;
                    }else{
                        this.isShow = true;
                    }

                });
            },

            //当前时间格式化
            dateFormat:function(row, column) {
                var dateTime = row[column.property];
                if (!dateTime) {
                    return "";
                }
                return util.formatDate.format(new Date(dateTime), 'yyyy-MM-dd hh:mm:ss');
            },
            /**图片拼接**/
            getImgUrl(result){
                return this.GLOBAL.getImgUrl(result);
            },
            showImg(item){
                this.imgSrc =  this.getImgUrl(item);
                this.isImgShow = true;
            },

            //点击初审通过按钮，打开弹出窗
            pass(){
                this.passFormVisible = true;
                this.passForm = {
                    id: "",
                    remark: "",
                    flag: true,
                };
            },
            //初审通过，提交后台请求
            passSubmit(){
                this.$refs.passForm.validate((valid) => {
                    if (valid) {
                        this.passForm.id = this.id;
                        passOrRefuseSubmitFun(this.passForm).then((data) => {
                            if (this.GLOBAL.isResonseSuccess(data)) {
                                this.passFormVisible = false;
                                this.$message({
                                    message: '操作成功',
                                    type: 'success'
                                });
                                this.recyclingInfo();
                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });

            },
            //点击拒绝按钮，打开弹出窗
            refuse(){
                this.refuseFormVisible = true;
                this.refuseForm = {
                    id: "",
                    remark: "",
                    flag: false,
                };
            },
            //拒绝，提交后台请求
            refuseSubmit(){
                this.$refs.refuseForm.validate((valid) => {
                    if (valid) {
                        this.refuseForm.id = this.id;
                        passOrRefuseSubmitFun(this.refuseForm).then((data) => {
                            if (this.GLOBAL.isResonseSuccess(data)) {
                                this.refuseFormVisible = false;
                                this.$message({
                                    message: '操作成功',
                                    type: 'success'
                                });
                                this.recyclingInfo();
                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //点击确认收货按钮，打开弹出窗
            confirmGetGood(){
                this.confirmFormVisible = true;
                this.confirmForm = {
                    id: "",
                    logisticsNo: "",
                };
            },
            //确认收货，提交后台请求
            confirmSubmit(){
                this.$refs.confirmForm.validate((valid) => {
                    if (valid) {
                        this.confirmForm.id = this.id;
                        confirmSubmitFun(this.confirmForm).then((data) => {
                            if (this.GLOBAL.isResonseSuccess(data)) {
                                this.confirmFormVisible = false;
                                this.$message({
                                    message: '操作成功',
                                    type: 'success'
                                });
                                this.recyclingInfo();
                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            //点击关闭订单按钮，打开弹出窗
            closeOrder(){
                this.closeFormVisible = true;
                this.closeForm = {
                    id: "",
                    remark: "",
                };
            },
            //确认收货，提交后台请求
            closeSubmit(){
                this.$refs.closeForm.validate((valid) => {
                    if (valid) {
                        this.closeForm.id = this.id;
                        closeSubmitFun(this.closeForm).then((data) => {
                            if (this.GLOBAL.isResonseSuccess(data)) {
                                this.closeFormVisible = false;
                                this.$message({
                                    message: '操作成功',
                                    type: 'success'
                                });
                                this.recyclingInfo();
                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            //点击鉴定完成按钮，打开弹出窗
            appraisalComplete(){
                //this.appImgInfo = [];
                this.imgList = [];
                this.appraisalPassFormVisible = true;
                this.appraisalPassForm = {
                    id: "",
                    imgs:[]
                };
            },
            //鉴定完成，提交后台请求
            appraisalPassSubmit(){
                this.$refs.appraisalPassForm.validate((valid) => {
                    if (valid) {
                        this.appraisalPassForm.id = this.id;
                        saveAppFireFun(this.appraisalPassForm).then((data) => {
                            if (this.GLOBAL.isResonseSuccess(data)) {
                                this.appraisalPassFormVisible = false;
                                this.$message({
                                    message: '操作成功',
                                    type: 'success'
                                });
                                this.recyclingInfo();
                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            //点击鉴定金额按钮，打开弹出窗
            appraisalPrice(){
                this.appraisalNotPassFormVisible = true;
                this.appraisalNotPassForm = {
                    id: "",
                    flag: true,
                    salePrice: "",
                };
            },
            //鉴定金额，提交后台请求
            appraisalNotPassSubmit(){
                this.$refs.appraisalNotPassForm.validate((valid) => {
                    if (valid) {
                        this.appraisalNotPassForm.id = this.id;
                        saveAppMoneyFun(this.appraisalNotPassForm).then((data) => {
                            if (this.GLOBAL.isResonseSuccess(data)) {
                                this.appraisalNotPassFormVisible = false;
                                this.$message({
                                    message: '操作成功',
                                    type: 'success'
                                });
                                this.recyclingInfo();
                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            //点击确认寄回按钮，打开弹出窗
            confirmReturn(){
                this.makeMoneyVisible = true;
                this.makeMoneyForm = {
                    id: "",
                    distributionType: 1,
                    logisticsNo:"",
                };
            },
            //确认寄回，提交后台请求
            confirmReturnSubmit(){
                this.$refs.makeMoneyForm.validate((valid) => {
                    if (valid) {
                        this.makeMoneyForm.id = this.id;
                        confirmReturnFun(this.makeMoneyForm).then((data) => {
                            if (this.GLOBAL.isResonseSuccess(data)) {
                                this.makeMoneyVisible = false;
                                this.$message({
                                    message: '操作成功',
                                    type: 'success'
                                });
                                this.recyclingInfo();
                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },


        getResult(result){
            //返回的图片地址
            if(result.length != 0){
                this.appraisalPassForm.imgs = [];
                for(let item of result){
                    this.appraisalPassForm.imgs.push({imgPath:item.relativeUrl})
                }
            }

        }


        },
        mounted() {
            this.recyclingInfo();
        }
    }
</script>
<style scoped>
    .toolbar{
        display: flex;
        justify-remark: space-between;
        align-items: center;
    }
</style>