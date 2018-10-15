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
                    <el-button type="primary" v-if="" v-on:click="confirm()" :loading="listLoading" >确认收货</el-button>
                    <el-button type="primary" v-if="" v-on:click="closeOrder()" :loading="listLoading" >关闭订单</el-button>
                </span>
                <span v-if="applyStatus=='待鉴定'">
                    <el-button type="primary" v-if="" v-on:click="appraisalPass()" :loading="listLoading" >鉴定通过</el-button>
                    <el-button type="primary" v-if="" v-on:click="appraisalNotPass()" :loading="listLoading" >鉴定不通过</el-button>
                </span>
                <span v-if="applyStatus=='待处理'">
                    <el-button type="primary" v-if="isShow" v-on:click="modifyPrice()" :loading="listLoading" >修改售价和佣金</el-button>
                    <el-button type="primary" v-if="" v-on:click="GoToReturn()" :loading="listLoading" >转到退货处理</el-button>
                    <el-button type="primary" v-if="isShow" v-on:click="alreadyConsignmentBtn()" :loading="listLoading" >转已寄卖</el-button>
                </span>
                <span v-if="applyStatus=='待打款'">
                    <el-button type="primary" v-if="" v-on:click="makeMoney()" :loading="listLoading" >财务打款</el-button>
                </span>
                <span v-if="applyStatus=='已发货'">
                    <el-button type="primary" v-if="" v-on:click="confirmCusGetBtn()" :loading="listLoading" >确认客户收货</el-button>
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
                    prop="price"
                    label="期望价格">
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
                    label="售价">
            </el-table-column>
            <el-table-column
                    prop="commission"
                    label="佣金">
            </el-table-column>
            <el-table-column
                    prop="modifySalePrice"
                    label="变更售价">
            </el-table-column>
            <el-table-column
                    prop="modifyCommission"
                    label="变更佣金">
            </el-table-column>
        </el-table>

        <!--支付信息-->
        <h3 style="margin-top: 50px;">支付信息</h3>
        <el-table
                v-loading="listLoading"
                element-loading-text="拼命加载中"
                :data="paymentInfo"
                style="width: 100%;margin-top: 5px;">
            <el-table-column
                    prop="receiverBank"
                    label="汇款银行">
            </el-table-column>
            <el-table-column
                    prop="receiverName"
                    label="汇款户名">
            </el-table-column>
            <el-table-column
                    prop="receiverAccount"
                    label="汇款账号">
            </el-table-column>
            <el-table-column
                    prop="payPrice"
                    label="汇款金额">
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
        <el-dialog title="初审通过，同意寄卖" style="width: 100%" v-model="passFormVisible" :visible.sync="passFormVisible">
            <el-form ref="passForm" :model="passForm" :rules="passFormRules" label-width="100px" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
                <el-form-item label="处理备注" prop="remark">
                    <el-input v-model="passForm.remark" type="textarea" style="width: 70%;"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click.native="passFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="passSubmit('passForm')" >同意寄卖</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--拒绝寄卖弹出窗-->
        <el-dialog title="拒绝寄卖" style="width: 100%" v-model="refuseFormVisible" :visible.sync="refuseFormVisible">
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
        <!--鉴定通过弹出窗-->
        <el-dialog title="鉴定通过" style="width: 100%" v-model="appraisalPassFormVisible" :visible.sync="appraisalPassFormVisible">
            <el-form ref="appraisalPassForm" :model="appraisalPassForm" :rules="appraisalPassFormRules" label-width="100px" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
                <el-form-item label="处理备注" prop="remark">
                    <el-input v-model="appraisalPassForm.remark" type="textarea" style="width: 70%;"></el-input>
                </el-form-item>
                <el-form-item label="售价" prop="salePrice">
                    <el-input v-model="appraisalPassForm.salePrice" type="number" style="width: 70%;"></el-input>
                </el-form-item>
                <el-form-item label="佣金" prop="commission">
                    <el-input v-model="appraisalPassForm.commission" type="number" style="width: 70%;"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click.native="appraisalPassFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="appraisalPassSubmit('appraisalPassForm')" >鉴定通过</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--鉴定不通过弹出窗-->
        <el-dialog title="鉴定不通过" style="width: 100%" v-model="appraisalNotPassFormVisible" :visible.sync="appraisalNotPassFormVisible">
            <el-form ref="appraisalNotPassForm" :model="appraisalNotPassForm" :rules="appraisalNotPassFormRules" label-width="100px" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
                <el-form-item label="处理备注" prop="remark">
                    <el-input v-model="appraisalNotPassForm.remark" type="textarea" style="width: 70%;"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click.native="appraisalNotPassFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="appraisalNotPassSubmit('appraisalNotPassForm')" >鉴定不通过</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--修改回收价弹出窗-->
        <el-dialog title="修改售价和佣金" style="width: 100%" v-model="modifyVisible" :visible.sync="modifyVisible">
            <el-form ref="modifyForm" :model="modifyForm" :rules="modifyFormRules" label-width="100px" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
                <el-form-item label="售价" prop="recyclingPrice">
                    <el-input disabled v-model="modifyForm.recyclingPrice" type="number" style="width: 70%;"></el-input>
                </el-form-item>
                <el-form-item label="佣金" prop="consignmentCommission">
                    <el-input disabled v-model="modifyForm.consignmentCommission" type="number" style="width: 70%;"></el-input>
                </el-form-item>
                <el-form-item label="修改售价" prop="modifySalePrice">
                    <el-input v-model="modifyForm.modifySalePrice" type="number" style="width: 70%;"></el-input>
                </el-form-item>
                <el-form-item label="修改佣金" prop="modifyCommission">
                    <el-input v-model="modifyForm.modifyCommission" type="number" style="width: 70%;"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click.native="modifyVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="modifySubmit('modifyForm')" >确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--转到退货处理弹出窗-->
        <el-dialog title="转退货处理" style="width: 100%" v-model="returnVisible" :visible.sync="returnVisible">
            <el-form ref="returnForm" :model="returnForm" :rules="returnFormRules" label-width="100px" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
                <el-form-item label="快递单号" prop="logisticsNo">
                    <el-input v-model="returnForm.logisticsNo" type="number" style="width: 70%;"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click.native="returnVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="returnSubmit('returnForm')" >确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--财务打款弹出窗-->
        <el-dialog title="财务打款" style="width: 100%" v-model="makeMoneyVisible" :visible.sync="makeMoneyVisible">
            <el-form ref="makeMoneyForm" :model="makeMoneyForm" :rules="makeMoneyFormRules" label-width="100px" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
                <el-form-item label="售价" prop="salePrice">
                    <el-input disabled v-model="makeMoneyForm.salePrice" type="number" style="width: 70%;"></el-input>
                </el-form-item>
                <el-form-item label="佣金" prop="salePrice">
                    <el-input disabled v-model="makeMoneyForm.commission" type="number" style="width: 70%;"></el-input>
                </el-form-item>
                <el-form-item label="银行" prop="receiverBank">
                    <el-input disabled v-model="makeMoneyForm.receiverBank" type="text" style="width: 70%;"></el-input>
                </el-form-item>
                <el-form-item label="账号" prop="receiverAccount">
                    <el-input disabled v-model="makeMoneyForm.receiverAccount" type="number" style="width: 70%;"></el-input>
                </el-form-item>
                <el-form-item label="户名" prop="receiverName">
                    <el-input disabled v-model="makeMoneyForm.receiverName" type="text" style="width: 70%;"></el-input>
                </el-form-item>
                <el-form-item label="打款金额" prop="payPrice">
                    <el-input v-model="makeMoneyForm.payPrice" type="number" style="width: 70%;"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click.native="makeMoneyVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="makeMoneySubmit('makeMoneyForm')" >确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </section>
</template>

<script>
    import util from '../../../common/js/util'
    import {getRecyclingInfoById,passOrRefuseSubmitFun,confirmSubmitFun,closeSubmitFun,appraisalPassSubmitFun,modifyCommissionFun,returnSubmitFun,makeMoneySubmitFun,alreadyConsignment,confirmCusGetFun} from '../../../api/api';
    export default {
        data() {
            return {
                baseInfo:[],//基本信息
                id:this.$route.query.id,
                applyStatus:this.$route.query.applyStatus,
                createTime:'',
                phone:'',

                itemsInfo:[],//商品信息
                className:'',
                brandName:'',
                price:'',
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
                commission:'',
                modifySalePrice:'',
                modifyCommission:'',

                paymentInfo:[],//支付信息
                receiverBank:'',
                receiveName:'',
                receiverAccount:'',
                payPrice:'',

                operationInfo:[],//操作日志信息
                operator:'',
                updateTime:'',
                orderStatus:'',
                operation:'',

                modifySalePrice:'',//修改后的回收价格

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
                    remark:"",
                    salePrice:"",
                    commission:"",
                    flag:'',
                },
                //校验规则
                appraisalPassFormRules: {
                    remark: [
                        { required: true, message: '请输入备注内容', trigger: 'blur' },
                    ],
                    salePrice: [
                        { required: true, message: '请输入售卖价格', trigger: 'blur' },
                    ],
                    commission: [
                        { required: true, message: '请输入佣金价格', trigger: 'blur' },
                    ]
                },
                //鉴定不通过弹出框
                appraisalNotPassFormVisible : false,
                appraisalNotPassForm : {
                    id:"",
                    remark:"",
                    flag:'',
                },
                //校验规则
                appraisalNotPassFormRules: {
                    remark: [
                        { required: true, message: '请输入备注内容', trigger: 'blur' },
                    ]
                },
                //修改回收价弹出框
                modifyVisible : false,
                modifyForm : {
                    id:"",
                    recyclingPrice:"",
                    modifySalePrice:"",
                    consignmentCommission:"",
                    modifyCommission:"",
                },
                //校验规则
                modifyFormRules: {
                    modifySalePrice: [
                        { required: true, message: '请输入修改后的价格', trigger: 'blur' },
                    ],
                    modifyCommission: [
                        { required: true, message: '请输入修改后的佣金价格', trigger: 'blur' },
                    ]
                },
                //转退货处理弹出框
                returnVisible : false,
                returnForm : {
                    id:"",
                    logisticsNo:"",
                },
                //校验规则
                returnFormRules: {
                    logisticsNo: [
                        { required: true, message: '请输入快递单号', trigger: 'blur' },
                    ]
                },
                //财务打款弹出框
                makeMoneyVisible : false,
                makeMoneyForm : {
                    id:"",
                    salePrice:"",
                    commission:"",
                    receiverBank:"",
                    receiverAccount:"",
                    receiverName:"",
                    payPrice:"",
                },
                //校验规则
                makeMoneyFormRules: {
                    payPrice: [
                        { required: true, message: '请输入打款金额', trigger: 'blur' },
                    ]
                },

                isShow :true

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
                getRecyclingInfoById(para).then((data) => {
                    this.baseInfo.push(data.data.baseInfo) ;
                    this.itemsInfo.push(data.data.itemsInfo);
                    this.distributionInfoList.push(data.data.distributionInfoList);
                    this.costInfo.push(data.data.costInfo);
                    this.paymentInfo.push(data.data.paymentInfo);
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
                    if(f.salePrice == 0 && f.commission == 0){
                        this.costInfo = null;
                        this.isShow = false;
                    }else {
                        this.isShow = true;
                        if(f.modifyCommission == 0){
                            f.modifyCommission="";
                        }
                        if(f.modifySalePrice == 0){
                            f.modifySalePrice="";
                        }
                    }

                    var p = data.data.paymentInfo;
                    if(p.payPrice == 0){
                        p.payPrice="";
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
            confirm(){
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

            //点击鉴定通过按钮，打开弹出窗
            appraisalPass(){
                this.appraisalPassFormVisible = true;
                this.appraisalPassForm = {
                    id: "",
                    remark: "",
                    salePrice: "",
                    commission: "",
                    flag: true,
                };
            },
            //鉴定通过，提交后台请求
            appraisalPassSubmit(){
                this.$refs.appraisalPassForm.validate((valid) => {
                    if (valid) {
                        this.appraisalPassForm.id = this.id;
                        appraisalPassSubmitFun(this.appraisalPassForm).then((data) => {
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

            //点击鉴定不通过按钮，打开弹出窗
            appraisalNotPass(){
                this.appraisalNotPassFormVisible = true;
                this.appraisalNotPassForm = {
                    id: "",
                    remark: "",
                    flag: false,
                };
            },
            //鉴定不通过，提交后台请求
            appraisalNotPassSubmit(){
                this.$refs.appraisalNotPassForm.validate((valid) => {
                    if (valid) {
                        this.appraisalNotPassForm.id = this.id;
                        appraisalPassSubmitFun(this.appraisalNotPassForm).then((data) => {
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

            //点击修改回收价按钮，打开弹出窗
            modifyPrice(){
                this.modifyVisible = true;
                //var that = this;
                var curPrice = this.costInfo[0].salePrice;
                var curCommission = this.costInfo[0].commission;
                this.modifyForm = {
                    id: "",
                    recyclingPrice: curPrice,
                    modifySalePrice: "",
                    consignmentCommission: curCommission,
                    modifyCommission: "",
                };
            },
            //修改售价和佣金，提交后台请求
            modifySubmit(){
                this.$refs.modifyForm.validate((valid) => {
                    if (valid) {
                        this.modifyForm.id = this.id;
                        modifyCommissionFun(this.modifyForm).then((data) => {
                            if (this.GLOBAL.isResonseSuccess(data)) {
                                this.modifyVisible = false;
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

            //点击退货按钮，打开弹出窗
            GoToReturn(){
                this.returnVisible = true;
                this.returnForm = {
                    id: "",
                    logisticsNo: "",
                };
            },
            //退货处理，提交后台请求
            returnSubmit(){
                this.$refs.returnForm.validate((valid) => {
                    if (valid) {
                        this.returnForm.id = this.id;
                        returnSubmitFun(this.returnForm).then((data) => {
                            if (this.GLOBAL.isResonseSuccess(data)) {
                                this.returnVisible = false;
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

            //点击财务打款按钮，打开弹出窗
            makeMoney(){
                this.makeMoneyVisible = true;
                var curPrice = this.costInfo[0].modifySalePrice;
                if(curPrice==0){
                    curPrice = this.costInfo[0].salePrice;
                }
                var curCommission = this.costInfo[0].modifyCommission;
                if(curCommission==0){
                    curCommission = this.costInfo[0].commission;
                }
                var bank = this.paymentInfo[0].receiverBank;
                var account = this.paymentInfo[0].receiverAccount;
                var name = this.paymentInfo[0].receiverName;
                this.makeMoneyForm = {
                    id: "",
                    salePrice:curPrice,
                    commission:curCommission,
                    receiverBank:bank,
                    receiverAccount:account,
                    receiverName:name,
                    payPrice:"",
                };
            },
            //财务打款，提交后台请求
            makeMoneySubmit(){
                this.$refs.makeMoneyForm.validate((valid) => {
                    if (valid) {
                        this.makeMoneyForm.id = this.id;
                        makeMoneySubmitFun(this.makeMoneyForm).then((data) => {
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
            //转已寄卖按钮
            alreadyConsignmentBtn(){
                this.$confirm('商品已卖出?', '提示', {
                    confirmButtonText: '已寄卖',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var orderId = this.id;
                    var para={id:orderId};
                    alreadyConsignment(para).then((data) => {
                        if (this.GLOBAL.isResonseSuccess(data)) {
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            });
                            this.recyclingInfo();
                        }else {
                            this.$message({
                                message: '操作失败',
                                type: 'error'
                            });
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'success',
                        message: '操作已取消'
                    });
                });
            },

            //确认收货按钮
            confirmCusGetBtn(){
                this.$confirm('顾客已收货?', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var orderId = this.id;
                    var para={id:orderId};
                    confirmCusGetFun(para).then((data) => {
                        if (this.GLOBAL.isResonseSuccess(data)) {
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            });
                            this.recyclingInfo();


                        }else {
                            this.$message({
                                message: '操作失败',
                                type: 'error'
                            });
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'success',
                        message: '操作已取消'
                    });
                });
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