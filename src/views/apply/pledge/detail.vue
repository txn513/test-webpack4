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
                    <el-button type="primary" v-if="isShow" v-on:click="pledgePriceBtn()" :loading="listLoading" >质押金额</el-button>
                    <el-button type="primary" v-if="" v-on:click="GoToReturn()" :loading="listLoading" >转到退货处理</el-button>
                </span>
                <span v-if="applyStatus=='待打款'">
                    <el-button type="primary" v-if="" v-on:click="makeMoney()" :loading="listLoading" >财务打款</el-button>
                </span>
                <span v-if="applyStatus=='待收款'">
                    <el-button type="primary" v-if="" v-on:click="financeGetMoneyBtn()" :loading="listLoading" >财务收款</el-button>
                    <!--<el-button type="primary" v-if="" v-on:click="expireNotPaymentBtn()" :loading="listLoading" >过期未还款</el-button>-->
                </span>
                <span v-if="applyStatus=='待寄回'">
                    <el-button type="primary" v-if="" v-on:click="pledgeGoodsReturnBtn()" :loading="listLoading" >质押物寄回</el-button>
                </span>
                <span v-if="applyStatus=='过期未还款'">
                    <el-button type="primary" v-if="" v-on:click="toPurchaseInStorageBtn()" :loading="listLoading" >转采购入库</el-button>
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
            <el-table-column
                    prop="pledgeCycle"
                    label="质押周期">
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
                    label="质押金额">
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
        <el-dialog title="初审通过，同意质押" style="width: 100%" v-model="passFormVisible" :visible.sync="passFormVisible">
            <el-form ref="passForm" :model="passForm" :rules="passFormRules" label-width="100px" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
                <el-form-item label="处理备注" prop="remark">
                    <el-input v-model="passForm.remark" type="textarea" style="width: 70%;"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click.native="passFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="passSubmit('passForm')" >同意质押</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--拒绝寄卖弹出窗-->
        <el-dialog title="拒绝质押" style="width: 100%" v-model="refuseFormVisible" :visible.sync="refuseFormVisible">
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
                <el-form-item label="建议质押金" prop="salePrice">
                    <el-input v-model="appraisalPassForm.minSubstitutionPrice" type="number" style="width: 30%;"></el-input>
                    至
                    <el-input v-model="appraisalPassForm.maxSubstitutionPrice" type="number" style="width: 30%;"></el-input>
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
        <!--质押金弹出窗-->
        <el-dialog title="质押金--财务打款金额" style="width: 100%" v-model="modifyVisible" :visible.sync="modifyVisible">
            <el-form ref="modifyForm" :model="modifyForm" :rules="modifyFormRules" label-width="120px" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
                <el-form-item label="建议金额" prop="advicePrice">
                    <el-input disabled v-model="modifyForm.advicePrice" type="text" style="width: 70%;"></el-input>
                </el-form-item>
                <el-form-item label="实际质押金" prop="salePrice">
                    <el-input v-model="modifyForm.salePrice" type="number" style="width: 70%;"></el-input>
                </el-form-item>
                <el-form-item label="质押到期时间" required>
                    <el-form-item prop="endTime">
                        <el-date-picker type="date" placeholder="选择日期" v-model="modifyForm.endTime" ></el-date-picker>
                    </el-form-item>
                </el-form-item>
                <el-form-item>
                    <el-button @click.native="modifyVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="pledgePriceSubmit('modifyForm')" >确认已打款</el-button>
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
                <el-form-item label="质押金额" prop="salePrice">
                    <el-input disabled v-model="makeMoneyForm.salePrice" type="number" style="width: 70%;"></el-input>
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
        <!--财务收款弹出窗-->
        <el-dialog title="财务收款" style="width: 100%" v-model="receiveMoneyFormVisible" :visible.sync="receiveMoneyFormVisible">
            <el-form ref="receiveMoneyForm" :model="receiveMoneyForm" :rules="receiveMoneyFormRules" label-width="200px" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
                <el-form-item label="已收到会员质押退款金额" prop="priceSpread">
                    <el-input v-model="receiveMoneyForm.priceSpread" type="number" style="width: 70%;"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click.native="receiveMoneyFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="receiveMoneySubmit('receiveMoneyForm')" >确定已收款</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--质押物寄回弹出窗-->
        <el-dialog title="质押物发货" style="width: 100%" v-model="sendGoodsFormVisible" :visible.sync="sendGoodsFormVisible">
            <el-form ref="sendGoodsForm" :model="sendGoodsForm" :rules="sendGoodsFormRules" label-width="100px" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
                <el-form-item label="快递单号" prop="logisticsNo">
                    <el-input v-model="sendGoodsForm.logisticsNo" type="number" style="width: 70%;"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click.native="sendGoodsFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="pledgeGoodsReturnSubmit('sendGoodsForm')" >确认发货</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--过期未还款弹出窗-->
        <el-dialog title="过期未还款" style="width: 100%" v-model="expireFormVisible" :visible.sync="expireFormVisible">
            <el-form ref="expireForm" :model="expireForm" :rules="expireFormRules" label-width="100px" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
                <el-form-item label="质押到期日" :formatter="dateFormat" prop="endTime">
                    <el-input disabled v-model="expireForm.endTime" type="text" style="width: 70%;"></el-input>
                </el-form-item>
                <el-form-item label="" prop="">
                    是否确认此质押单逾期收不到质押退款，转为【过期未还款】质押单？
                </el-form-item>
                <el-form-item>
                    <el-button @click.native="expireFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="expireSubmit('expireForm')" >确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </section>
</template>

<script>
    import util from '../../../common/js/util'
    import {getRecyclingInfoById,passOrRefuseSubmitFun,confirmSubmitFun,closeSubmitFun,appraisalPassSubmitFun,saveSubstitutionPriceIntervalFun,returnSubmitFun,makePledgeMoneyFun,toPurchaseInStorageFun,inputPledgeMoneyFun,financeReceiveMoneyFun,pledgeGoodsReturnFun,expireNotPayment} from '../../../api/api';
    export default {
        data() {
            return {
                baseInfo:[],//基本信息
                id:this.$route.query.id,
                //applyStatus:this.$route.query.applyStatus,
                applyStatus:'',
                createTime:'',
                phone:'',
                pledgeCycle:'',

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
                remark:"",

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
                    maxSubstitutionPrice:"",
                    minSubstitutionPrice:'',
                },
                //校验规则
                appraisalPassFormRules: {
                    remark: [
                        { required: true, message: '请输入备注内容', trigger: 'blur' },
                    ],
                    maxSubstitutionPrice: [
                        { required: true, message: '请输入商品可置换的最小价格', trigger: 'blur' },
                    ],
                    minSubstitutionPrice: [
                        { required: true, message: '请输入商品可置换的最大价格', trigger: 'blur' },
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
                    advicePrice:"",
                    salePrice:"",
                    endTime:"",
                },
                //校验规则
                modifyFormRules: {
                    salePrice: [
                        { required: true, message: '请输入质押金', trigger: 'blur' },
                    ],
                    endTime: [
                        { type: 'date',required: true, message: '请选择质押到期时间', trigger: 'blur' },
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
                    receiverBank:"",
                    receiverAccount:"",
                    receiverName:"",
                    payPrice:"",
                    isHaveOperation:true,
                },
                //校验规则
                makeMoneyFormRules: {
                    payPrice: [
                        { required: true, message: '请输入打款金额', trigger: 'blur' },
                    ]
                },

                //财务收款弹出框
                receiveMoneyFormVisible : false,
                receiveMoneyForm : {
                    id:"",
                    priceSpread:"",
                },
                //校验规则
                receiveMoneyFormRules: {
                    priceSpread: [
                        { required: true, message: '请输入收款金额', trigger: 'blur' },
                    ]
                },


                //质押物发货弹出框
                sendGoodsFormVisible : false,
                sendGoodsForm : {
                    id:"",
                    logisticsNo:"",
                },
                //校验规则
                sendGoodsFormRules: {
                    logisticsNo: [
                        { required: true, message: '请输入快递单号', trigger: 'blur' },
                    ]
                },
                //过期未还款弹出框
                expireFormVisible : false,
                expireForm : {
                    id:"",
                    endTime:"",
                },
                //校验规则
                expireFormRules: {
                },
                endTime:"",

                maxSubstitutionPrice:'',
                minSubstitutionPrice:'',
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
                getRecyclingInfoById(para).then((data) => {
                    this.baseInfo.push(data.data.baseInfo) ;
                    this.itemsInfo.push(data.data.itemsInfo);
                    this.distributionInfoList.push(data.data.distributionInfoList);
                    this.costInfo.push(data.data.costInfo);
                    this.paymentInfo.push(data.data.paymentInfo);
                    //this.operationInfo.push(data.data.operationInfo);
                    this.operationInfo = data.data.operationInfo;

                    var d = data.data.baseInfo;
                    let format = util.formatDate.format(new Date(d.endTime), 'yyyy-MM-dd');
                    this.endTime = format;
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
                    if (d.pledgeCycle == 1) {
                        this.baseInfo[0].pledgeCycle = "1个月";
                    }else if (d.pledgeCycle ==  3) {
                        this.baseInfo[0].pledgeCycle = "3个月";
                    }else if (d.pledgeCycle == 6) {
                        this.baseInfo[0].pledgeCycle = "6个月";
                    }else if (d.pledgeCycle == 12 ){
                        this.baseInfo[0].pledgeCycle = "12个月";
                    }else{
                        this.baseInfo[0].pledgeCycle = "";
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
                        //this.isShow = false;
                    }
                    // else {
                    //     //this.isShow = true;
                    //     if(f.salePrice == 0){
                    //         f.salePrice="";
                    //     }
                    // }
                    if(f.minSubstitutionPrice == 0){
                        this.isShow = false;
                    }else {
                        this.isShow = true;
                    }

                    this.maxSubstitutionPrice = f.maxSubstitutionPrice;
                    this.minSubstitutionPrice = f.minSubstitutionPrice;

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
                                this.$message({
                                    message: '操作成功',
                                    type: 'success'
                                });
                                this.passFormVisible = false;
                                //window.location.reload();
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
                    flag: true,
                    minSubstitutionPrice: "",
                    maxSubstitutionPrice: "",
                };
            },
            //鉴定通过，提交后台请求
            appraisalPassSubmit(){
                this.$refs.appraisalPassForm.validate((valid) => {
                    if (valid) {
                        var min = this.appraisalPassForm.minSubstitutionPrice;
                        var max = this.appraisalPassForm.maxSubstitutionPrice;
                        if (min > max) {
                            this.$message({
                                message: '输入的价格区间应该从小往大',
                                type: 'error'
                            });
                            return false;
                        }
                        this.appraisalPassForm.id = this.id;
                        saveSubstitutionPriceIntervalFun(this.appraisalPassForm).then((data) => {
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

            //点击质押金额按钮，打开弹出窗
            pledgePriceBtn(){
                this.modifyVisible = true;
                var maxPrice = this.maxSubstitutionPrice
                var minPrice = this.minSubstitutionPrice
                var curPrice = minPrice+ "元至" + maxPrice + "元";
                this.modifyForm = {
                    id: "",
                    advicePrice: curPrice,
                    salePrice: "",
                    endTime: "",
                };
            },
            //质押金额，提交后台请求
            pledgePriceSubmit(){
                this.$refs.modifyForm.validate((valid) => {
                    if (valid) {
                        this.modifyForm.id = this.id;
                        //let format = util.dateFormat("yyyy-MM-dd",new Date(this.endTime));
                        //this.modifyForm.endTime = this.endTime
                        inputPledgeMoneyFun(this.modifyForm).then((data) => {
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
                var curPrice = this.costInfo[0].salePrice;
                var bank = this.paymentInfo[0].receiverBank;
                var account = this.paymentInfo[0].receiverAccount;
                var name = this.paymentInfo[0].receiverName;
                this.makeMoneyForm = {
                    id: "",
                    salePrice:curPrice,
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
                        makePledgeMoneyFun(this.makeMoneyForm).then((data) => {
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

            //点击财务收款按钮，打开弹出窗
            financeGetMoneyBtn(){
                this.receiveMoneyFormVisible = true;
                this.receiveMoneyForm = {
                    id: "",
                    priceSpread: "",
                    flag: true,
                };
            },
            //财务收款，提交后台请求
            receiveMoneySubmit(){
                this.$refs.receiveMoneyForm.validate((valid) => {
                    if (valid) {
                        this.receiveMoneyForm.id = this.id;
                        financeReceiveMoneyFun(this.receiveMoneyForm).then((data) => {
                            if (this.GLOBAL.isResonseSuccess(data)) {
                                this.receiveMoneyFormVisible = false;
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


            //确认收货按钮
            toPurchaseInStorageBtn(){
                this.$confirm('质押到期未退质押金，确定转采购入库?', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var orderId = this.id;
                    var para={id:orderId};
                    toPurchaseInStorageFun(para).then((data) => {
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

            //点击质押物寄回按钮，打开弹出窗
            pledgeGoodsReturnBtn(){
                this.sendGoodsFormVisible = true;
                this.sendGoodsForm = {
                    id: "",
                    logisticsNo: "",
                };
            },
            //质押物寄回，提交后台请求
            pledgeGoodsReturnSubmit(){
                this.$refs.sendGoodsForm.validate((valid) => {
                    if (valid) {
                        this.sendGoodsForm.id = this.id;
                        pledgeGoodsReturnFun(this.sendGoodsForm).then((data) => {
                            if (this.GLOBAL.isResonseSuccess(data)) {
                                this.sendGoodsFormVisible = false;
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


            //点击过期未还款按钮，打开弹出窗
            expireNotPaymentBtn(){
                this.expireFormVisible = true;
                let time = this.endTime;
                this.expireForm = {
                    id: "",
                    endTime: time,
                };
            },
            //过期未还款，提交后台请求
            expireSubmit(){
                this.$refs.expireForm.validate((valid) => {
                    if (valid) {
                        this.expireForm.id = this.id;
                        expireNotPayment(this.expireForm).then((data) => {
                            if (this.GLOBAL.isResonseSuccess(data)) {
                                this.expireFormVisible = false;
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