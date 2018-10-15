<template>
    <section>
        <div class="toolbar el-col el-col-24" style="justify-content: space-between">
            <div>当前状态：
                <span class="order-status">{{applyStatus}}</span>
            </div>
            <!--提交按钮-->
            <div>
                <span v-if="applyStatus=='待审核'">
                    <el-button type="primary" v-if="" v-on:click="pass()" :loading="listLoading">初审通过</el-button>
                    <el-button type="primary" v-if="" v-on:click="refuse()" :loading="listLoading">拒绝</el-button>
                </span>
                <span v-if="applyStatus=='待确认寄送'">
                    <el-button type="primary" v-if="" v-on:click="confirm()" :loading="listLoading">确认收货</el-button>
                    <el-button type="primary" v-if="" v-on:click="closeOrder()" :loading="listLoading">关闭订单</el-button>
                </span>
                <span v-if="applyStatus=='待鉴定'">
                    <el-button type="primary" v-if="" v-on:click="appraisalPass()"
                               :loading="listLoading">鉴定通过</el-button>
                    <el-button type="primary" v-if="" v-on:click="appraisalNotPass()"
                               :loading="listLoading">鉴定不通过</el-button>
                </span>
                <span v-if="applyStatus=='待处理'">
                    <el-button type="primary" v-if="isShow" v-on:click="selectSendGoods()"
                               :loading="listLoading">选择发货商品</el-button>
                    <el-button type="primary" v-if="" v-on:click="GoToReturn()" :loading="listLoading">转退货处理</el-button>
                </span>
                <span v-if="applyStatus=='待发货'">
                    <el-button type="primary" v-if="isShowMakeDifPriceBtn" v-on:click="makeDifPrice()"
                               :loading="listLoading">补差价</el-button>
                    <el-button type="primary" v-if="" v-on:click="sendGoodsBtn()" :loading="listLoading">发货</el-button>
                </span>
                <span v-if="applyStatus=='已发货'">
                    <el-button type="primary" v-if="isShowPayAccountBtn" v-on:click="payAccountBtn()"
                               :loading="listLoading">汇款账号</el-button>
                    <el-button type="primary" v-if="isShowReturnDifPriceBtn" v-on:click="returnDifPrice()"
                               :loading="listLoading">退差价</el-button>
                    <el-button type="primary" v-if="isShowGetMoneyBtn" v-on:click="confirmCusGetMoneyBtn()"
                               :loading="listLoading">确认客户已收款</el-button>
                    <el-button type="primary" v-if="" v-on:click="confirmCusGetBtn()"
                               :loading="listLoading">确认客户已收货</el-button>
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
        <h4 style="margin-left: 20px;">会员的置换商品</h4>
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
                <template slot-scope="scope"><img v-for="item in scope.row.imgPaths" :src="getImgUrl(item)"
                                                  v-on:click="showImg(item)"
                                                  style="width: 50px;height: 50px;margin-left: 10px"></template>
            </el-table-column>
        </el-table>
        <h4 style="margin-left: 20px;">想要置换的商品</h4>
        <el-table
                v-loading="listLoading"
                element-loading-text="拼命加载中"
                :data="itemsInfo"
                style="width: 100%;margin-top: 5px;">
            <el-table-column
                    prop="tarClassName"
                    label="品类">
            </el-table-column>
            <el-table-column
                    prop="tarBrandName"
                    label="品牌">
            </el-table-column>
            <el-table-column
                    prop="paths"
                    label="图片">
                <template slot-scope="scope"><img v-for="item in scope.row.paths" :src="getImgUrl(item)"
                                                  v-on:click="showImg(item)"
                                                  style="width: 50px;height: 50px;margin-left: 10px"></template>
            </el-table-column>
        </el-table>

        <!--置换商品信息-->
        <h3 style="margin-top: 50px;">置换商品信息</h3>
        <el-table
                v-loading="listLoading"
                element-loading-text="拼命加载中"
                :data="substitutionGoodsInfo"
                style="width: 100%;margin-top: 5px;">
            <el-table-column
                    prop="skuCode"
                    label="商品编码">
            </el-table-column>
            <el-table-column
                    prop="skuCode"
                    label="SKU">
            </el-table-column>
            <el-table-column
                    prop="spuName"
                    label="商品名称">
            </el-table-column>
            <el-table-column
                    prop="spuBrand"
                    label="品牌">
            </el-table-column>
            <el-table-column
                    prop="skuAttrsValue"
                    label="属性">
            </el-table-column>
            <el-table-column
                    prop="salesPrice"
                    label="价格">
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
                    prop="addPriceSpread"
                    label="补差价">
            </el-table-column>
            <el-table-column
                    prop="returnPriceSpread"
                    label="退差价">
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

        <!--选择商品弹出窗-->
        <el-dialog title="选择商品" v-model="selectFormVisible" :visible.sync="selectFormVisible">
            <div class="toolbar el-col el-col-24" style="text-align: right;">
                <el-select clearable v-model="queryType" placeholder="请选择搜索类别" style="width:120px;">
                    <el-option label="商品编码" value=0></el-option>
                    <el-option label="商品名称" value=1></el-option>
                </el-select>
                &nbsp;
                <el-input v-model="queryName" placeholder="请输入名称" style="width:170px;"></el-input>
                &nbsp;
                &nbsp;
                <el-button type="primary" v-on:click="getProductListByCondition()" :loading="listLoading">搜索</el-button>
            </div>

            <el-table
                    v-loading="listLoading"
                    element-loading-text="拼命加载中"
                    :data="addgoodList"
                    border
                    style="width: 100%;margin-top: 5px;"
                    @row-dblclick="selectGoodEvent">
                <el-table-column
                        prop="spuCode"
                        label="商品编码"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="skuCode"
                        label="SKU"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="spuName"
                        label="商品名称"
                        width="170">
                </el-table-column>
                <el-table-column
                        prop="spuBrand"
                        label="品牌"
                        width="170">
                </el-table-column>
                <el-table-column
                        prop="skuAttrsValue"
                        label="属性"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="salesPrice"
                        label="价格"
                        width="170">
                </el-table-column>
            </el-table>

            <!--选择商品列表分页-->
            <div class="block" style="text-align:right;">
                <el-pagination
                        background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="pageNum"
                        :page-sizes="[8, 16, 24, 32]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                </el-pagination>
            </div>

        </el-dialog>


        <!--图片弹出窗-->
        <el-dialog title="  "  style="width: 100%;height:100%;margin: auto"  :visible.sync="isImgShow">
            <img :src="imgSrc" />
        </el-dialog>
        <!--同意弹出窗-->
        <el-dialog title="初审通过，同意置换" style="width: 100%" v-model="passFormVisible" :visible.sync="passFormVisible">
            <el-form ref="passForm" :model="passForm" :rules="passFormRules" label-width="100px"
                     @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
                <el-form-item label="处理备注" prop="remark">
                    <el-input v-model="passForm.remark" type="textarea" style="width: 70%;"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click.native="passFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="passSubmit('passForm')">同意置换</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--拒绝寄卖弹出窗-->
        <el-dialog title="拒绝置换" style="width: 100%" v-model="refuseFormVisible" :visible.sync="refuseFormVisible">
            <el-form ref="refuseForm" :model="refuseForm" :rules="passFormRules" label-width="100px"
                     @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
                <el-form-item label="拒绝原因" prop="remark">
                    <el-input v-model="refuseForm.remark" type="textarea" style="width: 70%;"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click.native="refuseFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="refuseSubmit('refuseForm')">确认拒绝</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--确认收货弹出窗-->
        <el-dialog title="确认收货" style="width: 100%" v-model="confirmFormVisible" :visible.sync="confirmFormVisible">
            <el-form ref="confirmForm" :model="confirmForm" :rules="confirmFormRules" label-width="100px"
                     @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
                <el-form-item label="快递单号" prop="logisticsNo">
                    <el-input v-model="confirmForm.logisticsNo" type="number" style="width: 70%;"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click.native="confirmFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="confirmSubmit('confirmForm')">确认收货</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--关闭订单弹出窗-->
        <el-dialog title="关闭订单" style="width: 100%" v-model="closeFormVisible" :visible.sync="closeFormVisible">
            <el-form ref="closeForm" :model="closeForm" :rules="closeFormRules" label-width="100px"
                     @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
                <el-form-item label="原因" prop="remark">
                    <el-input v-model="closeForm.remark" type="textarea" style="width: 70%;"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click.native="closeFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="closeSubmit('closeForm')">关闭订单</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--鉴定通过弹出窗-->
        <el-dialog title="鉴定通过" style="width: 100%" v-model="appraisalPassFormVisible"
                   :visible.sync="appraisalPassFormVisible">
            <el-form ref="appraisalPassForm" :model="appraisalPassForm" :rules="appraisalPassFormRules"
                     label-width="150px" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
                <el-form-item label="处理备注" prop="remark">
                    <el-input v-model="appraisalPassForm.remark" type="textarea" style="width: 70%;"></el-input>
                </el-form-item>
                <el-form-item label="可置换商品价格区间" prop="salePrice">
                    <el-input v-model="appraisalPassForm.minSubstitutionPrice" type="number"
                              style="width: 30%;"></el-input>
                    至
                    <el-input v-model="appraisalPassForm.maxSubstitutionPrice" type="number"
                              style="width: 30%;"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click.native="appraisalPassFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="appraisalPassSubmit('appraisalPassForm')">鉴定通过</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--鉴定不通过弹出窗-->
        <el-dialog title="鉴定不通过" style="width: 100%" v-model="appraisalNotPassFormVisible"
                   :visible.sync="appraisalNotPassFormVisible">
            <el-form ref="appraisalNotPassForm" :model="appraisalNotPassForm" :rules="appraisalNotPassFormRules"
                     label-width="100px" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
                <el-form-item label="处理备注" prop="remark">
                    <el-input v-model="appraisalNotPassForm.remark" type="textarea" style="width: 70%;"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click.native="appraisalNotPassFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="appraisalNotPassSubmit('appraisalNotPassForm')">鉴定不通过
                    </el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--汇款账号弹出窗-->
        <el-dialog title="汇款账号信息" style="width: 100%" v-model="modifyVisible" :visible.sync="modifyVisible">
            <el-form ref="modifyForm" :model="modifyForm" :rules="modifyFormRules" label-width="100px"
                     @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
                <el-form-item label="银行" prop="receiverBank">
                    <el-input v-model="modifyForm.receiverBank" type="text" style="width: 70%;"></el-input>
                </el-form-item>
                <el-form-item label="户名" prop="receiverName">
                    <el-input v-model="modifyForm.receiverName" type="text" style="width: 70%;"></el-input>
                </el-form-item>
                <el-form-item label="账号" prop="receiverAccount">
                    <el-input v-model="modifyForm.receiverAccount" type="number" style="width: 70%;"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click.native="modifyVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="payAccount('modifyForm')">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--转到退货处理弹出窗-->
        <el-dialog title="转退货处理" style="width: 100%" v-model="returnVisible" :visible.sync="returnVisible">
            <el-form ref="returnForm" :model="returnForm" :rules="returnFormRules" label-width="100px"
                     @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
                <el-form-item label="快递单号" prop="logisticsNo">
                    <el-input v-model="returnForm.logisticsNo" type="number" style="width: 70%;"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click.native="returnVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="returnSubmit('returnForm')">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--发货弹出窗-->
        <el-dialog title="发货单号" style="width: 100%" v-model="sendGoodsVisible" :visible.sync="sendGoodsVisible">
            <el-form ref="sendGoodsForm" :model="sendGoodsForm" :rules="sendGoodsFormRules" label-width="100px"
                     @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
                <el-form-item label="快递单号" prop="logisticsNo">
                    <el-input v-model="sendGoodsForm.logisticsNo" type="number" style="width: 70%;"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click.native="sendGoodsVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="sendGoodsSubmit('sendGoodsForm')">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--补差价弹出窗-->
        <el-dialog title="补差价" style="width: 100%" v-model="makeMoneyVisible" :visible.sync="makeMoneyVisible">
            <el-form ref="makeMoneyForm" :model="makeMoneyForm" :rules="makeMoneyFormRules" label-width="150px"
                     @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
                <el-form-item label="已收到客户补差价" prop="priceSpread">
                    <el-input v-model="makeMoneyForm.priceSpread" type="number" style="width: 70%;"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click.native="makeMoneyVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="makeDifPriceSubmit('makeMoneyForm')">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--退差价弹出窗-->
        <el-dialog title="退差价" style="width: 100%" v-model="returnMoneyVisible" :visible.sync="returnMoneyVisible">
            <el-form ref="returnMoneyForm" :model="returnMoneyForm" :rules="returnMoneyFormRules" label-width="100px"
                     @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
                <el-form-item label="退给用户差价" prop="priceSpread">
                    <el-input v-model="returnMoneyForm.priceSpread" type="number" style="width: 70%;"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click.native="returnMoneyVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="returnDifPriceSubmit('returnMoneyForm')">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </section>
</template>

<script>
    import util from '../../../common/js/util'
    import {
        getRecyclingInfoById,
        passOrRefuseSubmitFun,
        confirmSubmitFun,
        closeSubmitFun,
        saveSubstitutionPriceIntervalFun,
        confirmCusGetMoneyFun,
        returnSubmitFun,
        getSelectSKUList,
        confirmCusGetFun,
        saveSkuIdFun,
        makeDifPriceSubmitFun,
        sendGoodsSubmitFun,
        saveRemitAccountInfoFun,
        appraisalPassSubmitFun
    } from '../../../api/api';

    export default {
        data() {
            return {
                addgoodList: [],
                //订单列表分页
                pageSize: 8,
                page: 1,
                total: 0,
                pageNum: 1, //当前页码

                //选择商品列表参数
                selectFormVisible: false,
                queryType: '',
                queryName: '',


                baseInfo: [],//基本信息
                id: this.$route.query.id,
                //applyStatus:this.$route.query.applyStatus,
                applyStatus: '',
                createTime: '',
                phone: '',

                itemsInfo: [],//商品信息
                className: '',
                brandName: '',
                tarClassName: '',
                tarBrandName: '',

                substitutionGoodsInfo: [],//置换商品信息
                spuName: '',
                spuBrand: '',
                skuCode: '',
                skuAttrsValue: '',
                salesPrice: '',
                spuCode: '',

                distributionInfoList: [],//配送信息
                distributionType: '',
                consigneePeople: '',
                consigneePhone: '',
                //postcode:'',
                address: '',
                logisticsNo: '',

                /*图片弹出窗*/
                isImgShow: false,
                imgSrc: '',

                costInfo: [],//费用信息
                addPriceSpread: '',
                returnPriceSpread: '',

                paymentInfo: [],//支付信息
                receiverBank: '',
                receiveName: '',
                receiverAccount: '',

                operationInfo: [],//操作日志信息
                operator: '',
                updateTime: '',
                orderStatus: '',
                operation: '',
                remark: "",

                modifySalePrice: '',//修改后的回收价格

                listLoading: false,
                //同意弹出框
                passFormVisible: false,
                passForm: {
                    id: "",
                    remark: "",
                    flag: '',
                },
                //校验规则
                passFormRules: {
                    remark: [
                        {required: true, message: '请输入备注内容', trigger: 'blur'},
                    ]
                },
                //拒绝弹出框
                refuseFormVisible: false,
                refuseForm: {
                    id: "",
                    remark: "",
                    flag: '',
                },
                //校验规则
                refuseFormRules: {
                    remark: [
                        {required: true, message: '请输入备注内容', trigger: 'blur'},
                    ]
                },
                //确认收货弹出框
                confirmFormVisible: false,
                confirmForm: {
                    id: "",
                    logisticsNo: "",
                },
                //校验规则
                confirmFormRules: {
                    logisticsNo: [
                        {required: true, message: '请输入快递单号', trigger: 'blur'},
                    ]
                },
                //关闭订单弹出框
                closeFormVisible: false,
                closeForm: {
                    id: "",
                    remark: "",
                },
                //校验规则
                closeFormRules: {
                    remark: [
                        {required: true, message: '请输入关闭订单原因', trigger: 'blur'},
                    ]
                },
                //鉴定通过弹出框
                appraisalPassFormVisible: false,
                appraisalPassForm: {
                    id: "",
                    remark: "",
                    maxSubstitutionPrice: "",
                    minSubstitutionPrice: '',
                },
                //校验规则
                appraisalPassFormRules: {
                    remark: [
                        {required: true, message: '请输入备注内容', trigger: 'blur'},
                    ],
                    maxSubstitutionPrice: [
                        {required: true, message: '请输入商品可置换的最小价格', trigger: 'blur'},
                    ],
                    minSubstitutionPrice: [
                        {required: true, message: '请输入商品可置换的最大价格', trigger: 'blur'},
                    ]
                },
                //鉴定不通过弹出框
                appraisalNotPassFormVisible: false,
                appraisalNotPassForm: {
                    id: "",
                    remark: "",
                    flag: '',
                },
                //校验规则
                appraisalNotPassFormRules: {
                    remark: [
                        {required: true, message: '请输入备注内容', trigger: 'blur'},
                    ]
                },
                //修改回收价弹出框
                modifyVisible: false,
                modifyForm: {
                    id: "",
                    receiverBank: "",
                    receiverName: "",
                    receiverAccount: "",
                },
                //校验规则
                modifyFormRules: {
                    receiverBank: [
                        {required: true, message: '请输入银行', trigger: 'blur'},
                    ],
                    receiverName: [
                        {required: true, message: '请输入户名', trigger: 'blur'},
                    ],
                    receiverAccount: [
                        {required: true, message: '请输入账号', trigger: 'blur'},
                    ],
                },
                //转退货处理弹出框
                returnVisible: false,
                returnForm: {
                    id: "",
                    logisticsNo: "",
                },
                //校验规则
                returnFormRules: {
                    logisticsNo: [
                        {required: true, message: '请输入快递单号', trigger: 'blur'},
                    ]
                },
                //发货弹出框
                sendGoodsVisible: false,
                sendGoodsForm: {
                    id: "",
                    logisticsNo: "",
                },
                //校验规则
                sendGoodsFormRules: {
                    logisticsNo: [
                        {required: true, message: '请输入快递单号', trigger: 'blur'},
                    ]
                },
                //退差价弹出框
                makeMoneyVisible: false,
                makeMoneyForm: {
                    id: "",
                    priceSpread: "",
                },
                //校验规则
                makeMoneyFormRules: {
                    priceSpread: [
                        {required: true, message: '请输入金额', trigger: 'blur'},
                    ]
                },
                //补差价弹出框
                returnMoneyVisible: false,
                returnMoneyForm: {
                    id: "",
                    priceSpread: "",
                },
                //校验规则
                returnMoneyFormRules: {
                    priceSpread: [
                        {required: true, message: '请输入金额', trigger: 'blur'},
                    ]
                },

                isShow: true,
                isShowPayAccountBtn: false,
                isShowReturnDifPriceBtn: false,
                isShowGetMoneyBtn: false,
                isShowMakeDifPriceBtn: true,

            }
        },
        methods: {
            //根据id获取采购数据详情
            recyclingInfo() {
                var para = {id: this.$route.query.id};
                this.baseInfo = [];
                this.itemsInfo = [];
                this.distributionInfoList = [];
                this.costInfo = [];
                this.paymentInfo = [];
                this.operationInfo = [];
                this.substitutionGoodsInfo = [];
                getRecyclingInfoById(para).then((data) => {
                    this.baseInfo.push(data.data.baseInfo);
                    this.itemsInfo.push(data.data.itemsInfo);
                    this.distributionInfoList.push(data.data.distributionInfoList);
                    this.costInfo.push(data.data.costInfo);
                    this.paymentInfo.push(data.data.paymentInfo);
                    //this.operationInfo.push(data.data.operationInfo);
                    this.operationInfo = data.data.operationInfo;
                    this.substitutionGoodsInfo.push(data.data.substitutionGoodsInfo);

                    var d = data.data.baseInfo;
                    if (d.applyStatus == 0) {
                        this.applyStatus = "待审核";
                    } else if (d.applyStatus == 10) {
                        this.applyStatus = "待确认寄送";
                    } else if (d.applyStatus == 20) {
                        this.applyStatus = "待鉴定";
                    } else if (d.applyStatus == 30) {
                        this.applyStatus = "待处理";
                    } else if (d.applyStatus == 40) {
                        this.applyStatus = "待寄回";
                    } else if (d.applyStatus == 50) {
                        this.applyStatus = "待发货";
                    } else if (d.applyStatus == 60) {
                        this.applyStatus = "已发货";
                    } else if (d.applyStatus == 70) {
                        this.applyStatus = "待打款";
                    } else if (d.applyStatus == 80) {
                        this.applyStatus = "待收款";
                    } else if (d.applyStatus == 90) {
                        this.applyStatus = "待退还";
                    } else if (d.applyStatus == 100) {
                        this.applyStatus = "超时未退";
                    } else if (d.applyStatus == 110) {
                        this.applyStatus = "过期未还款";
                    } else if (d.applyStatus == 120) {
                        this.applyStatus = "已退还";
                    } else if (d.applyStatus == 130) {
                        this.applyStatus = "已完成";
                    } else if (d.applyStatus == 140) {
                        this.applyStatus = "已关闭";
                    } else {
                        this.applyStatus = "未知的类型";
                    }

                    var q = data.data.distributionInfoList;
                    if (q.distributionType == 0) {
                        q.distributionType = "寄送";
                    } else if (q.distributionType == 1) {
                        q.distributionType = "退回";
                    } else {
                        q.distributionType = "";
                    }
                    var f = data.data.costInfo;
                    if (f.priceSpread == 0) {
                        this.costInfo = null;
                    } else if (f.priceSpread < 0) {
                        this.isShowGetMoneyBtn = true;
                        this.isShowReturnDifPriceBtn = false;
                        this.costInfo[0].returnPriceSpread = f.priceSpread;
                    } else {
                        this.costInfo[0].addPriceSpread = f.priceSpread;
                        this.isShowPayAccountBtn = false;
                        this.isShowReturnDifPriceBtn = false;
                        this.isShowGetMoneyBtn = false;
                        this.isShowMakeDifPriceBtn = false;
                    }
                    if (f.minSubstitutionPrice == 0) {
                        this.isShow = false;
                    }

                    var p = data.data.paymentInfo;
                    if (p.receiverName == '') {
                        this.isShowPayAccountBtn = true;
                        this.isShowReturnDifPriceBtn = false;
                        this.isShowGetMoneyBtn = false;
                    } else {
                        this.isShowPayAccountBtn = false;
                        //this.isShowReturnDifPriceBtn=true;
                    }
                    if (p.receiverName == '' && f.priceSpread > 0) {
                        this.isShowPayAccountBtn = false;
                        this.isShowReturnDifPriceBtn = false;
                        this.isShowGetMoneyBtn = false;
                    }
                    if (p.receiverName != '' && f.priceSpread == 0) {
                        this.isShowReturnDifPriceBtn = true;
                    }
                    if (p.payPrice == 1) {
                        this.isShowGetMoneyBtn = false;
                    }
                    if (f.minSubstitutionPrice == 0 && p.receiverName == '') {
                        this.isShow = false;
                        this.isShowPayAccountBtn = false;
                        this.isShowReturnDifPriceBtn = false;
                        this.isShowGetMoneyBtn = false;
                    }

                });
            },

            //当前时间格式化
            dateFormat: function (row, column) {
                var dateTime = row[column.property];
                if (!dateTime) {
                    return "";
                }
                return util.formatDate.format(new Date(dateTime), 'yyyy-MM-dd hh:mm:ss');
            },
            /**图片拼接**/
            getImgUrl(result) {
                return this.GLOBAL.getImgUrl(result);
            },
            showImg(item) {
                this.imgSrc = this.getImgUrl(item);
                this.isImgShow = true;
            },

            //点击初审通过按钮，打开弹出窗
            pass() {
                this.passFormVisible = true;
                this.passForm = {
                    id: "",
                    remark: "",
                    flag: true,
                };
            },
            //初审通过，提交后台请求
            passSubmit() {
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
            refuse() {
                this.refuseFormVisible = true;
                this.refuseForm = {
                    id: "",
                    remark: "",
                    flag: false,
                };
            },
            //拒绝，提交后台请求
            refuseSubmit() {
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
            confirm() {
                this.confirmFormVisible = true;
                this.confirmForm = {
                    id: "",
                    logisticsNo: "",
                };
            },
            //确认收货，提交后台请求
            confirmSubmit() {
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
            closeOrder() {
                this.closeFormVisible = true;
                this.closeForm = {
                    id: "",
                    remark: "",
                };
            },
            //确认收货，提交后台请求
            closeSubmit() {
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
            appraisalPass() {
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
            appraisalPassSubmit() {
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
                                window.location.reload();
                                //this.recyclingInfo();
                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            //点击鉴定不通过按钮，打开弹出窗
            appraisalNotPass() {
                this.appraisalNotPassFormVisible = true;
                this.appraisalNotPassForm = {
                    id: "",
                    remark: "",
                    flag: false,
                };
            },
            //鉴定不通过，提交后台请求
            appraisalNotPassSubmit() {
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

            //点击汇款账号按钮，打开弹出窗
            payAccountBtn() {
                this.modifyVisible = true;
                this.modifyForm = {
                    id: "",
                    receiverBank: "",
                    receiverName: "",
                    receiverAccount: "",
                };
            },

            //汇款账号，提交后台请求
            payAccount() {
                this.$refs.modifyForm.validate((valid) => {
                    if (valid) {
                        this.modifyForm.id = this.id;
                        saveRemitAccountInfoFun(this.modifyForm).then((data) => {
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
            GoToReturn() {
                this.returnVisible = true;
                this.returnForm = {
                    id: "",
                    logisticsNo: "",
                };
            },
            //退货处理，提交后台请求
            returnSubmit() {
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
            //点击发货按钮，打开弹出窗
            sendGoodsBtn() {
                this.sendGoodsVisible = true;
                this.sendGoodsForm = {
                    id: "",
                    logisticsNo: "",
                    distributionType: 1,
                };
            },
            //发货，提交后台请求
            sendGoodsSubmit() {
                this.$refs.sendGoodsForm.validate((valid) => {
                    if (valid) {
                        this.sendGoodsForm.id = this.id;
                        sendGoodsSubmitFun(this.sendGoodsForm).then((data) => {
                            if (this.GLOBAL.isResonseSuccess(data)) {
                                this.sendGoodsVisible = false;
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

            //点击补差价按钮，打开弹出窗
            makeDifPrice() {
                this.makeMoneyVisible = true;
                this.makeMoneyForm = {
                    id: "",
                    priceSpread: '',
                    flag: true,
                };
            },
            //补差价，提交后台请求
            makeDifPriceSubmit() {
                this.$refs.makeMoneyForm.validate((valid) => {
                    if (valid) {
                        this.makeMoneyForm.id = this.id;
                        makeDifPriceSubmitFun(this.makeMoneyForm).then((data) => {
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

            //点击退差价按钮，打开弹出窗
            returnDifPrice() {
                this.returnMoneyVisible = true;
                this.returnMoneyForm = {
                    id: "",
                    priceSpread: '',
                    flag: false,
                };
            },
            //退差价，提交后台请求
            returnDifPriceSubmit() {
                this.$refs.returnMoneyForm.validate((valid) => {
                    if (valid) {
                        this.returnMoneyForm.id = this.id;
                        makeDifPriceSubmitFun(this.returnMoneyForm).then((data) => {
                            if (this.GLOBAL.isResonseSuccess(data)) {
                                this.returnMoneyVisible = false;
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


            //确认顾客已收货收货按钮
            confirmCusGetBtn() {
                this.$confirm('是否确认客户已收到平台寄去的置换商品?', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var orderId = this.id;
                    var para = {id: orderId};
                    confirmCusGetFun(para).then((data) => {
                        if (this.GLOBAL.isResonseSuccess(data)) {
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            });
                            this.recyclingInfo();
                        } else {
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

            //确认顾客已到汇款金额
            confirmCusGetMoneyBtn() {
                this.$confirm('是否确认客户已收到汇款金额?', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var orderId = this.id;
                    var para = {
                        id: orderId,
                        payPrice: 1,
                    };
                    confirmCusGetMoneyFun(para).then((data) => {
                        if (this.GLOBAL.isResonseSuccess(data)) {
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            });
                            this.recyclingInfo();
                        } else {
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

            //条件查询分页bug优化
            getProductListByCondition() {
                this.page = 1;
                this.selectGoodsList();
            },

            //点击选择发货商品按钮，打开弹出窗
            selectSendGoods() {
                this.type = "",
                    this.queryName = "",
                    this.page = 1,
                    this.pageNum = 1,
                    this.selectGoodsList();
                this.selectFormVisible = true;
            },

            //获得选择商品列表集合数据
            selectGoodsList() {
                var queryTypeId = this.queryType;//查询的类别
                if (queryTypeId == 0) {
                    var para = {
                        pageInfo: {
                            pageNum: this.pageNum,
                            pageSize: this.pageSize,
                        },
                        spuCode: this.queryName,//输入的搜索词
                        onSaleFlag: 0
                    };
                } else if (queryTypeId == 1) {
                    var para = {
                        pageInfo: {
                            pageNum: this.pageNum,
                            pageSize: this.pageSize,
                        },
                        spuName: this.queryName,//输入的搜索词
                        onSaleFlag: 0
                    };
                } else {
                    var para = {
                        pageInfo: {
                            pageNum: this.pageNum,
                            pageSize: this.pageSize,
                        },
                        onSaleFlag: 0
                    };
                }
                this.listLoading = true;
                getSelectSKUList(para).then((data) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(data)) {
                            this.addgoodList = data.data.list;
                            this.total = data.data.paginationInfo.total;

                        }
                    }
                );
            },

            //双击行商品数据填充到编辑商品表格
            selectGoodEvent(row) {

                console.log(row.skuCode);

                this.$confirm('确认选择此商品么', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.selectFormVisible = false;
                    var id = this.id;
                    var skuId = row.skuId;
                    var para = {
                        id: id,
                        skuId: skuId,
                    };
                    saveSkuIdFun(para).then((data) => {
                        if (this.GLOBAL.isResonseSuccess(data)) {
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            });
                            this.recyclingInfo();
                        } else {
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

                var d = this.substitutionGoodsInfo;
                // for(var i=0;i<d.length;i++){
                //     if (d[i].goodsId == row.wikiCode){
                //         this.$message({
                //             message: '该商品已存在添加列表',
                //             type: 'warn'
                //         });
                //         return ;
                //     }
                // }
                this.substitutionGoodsInfo.push(row);
            },


            //订单列表分页
            handleCurrentChange(val) {
                this.pageNum = val;
                this.selectGoodsList();
            },
            //处理分页条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.selectGoodsList();
            },


        },
        mounted() {
            this.recyclingInfo();
            this.selectGoodsList();
        }
    }
</script>
<style scoped>
    .toolbar {
        display: flex;
        justify-remark: space-between;
        align-items: center;
    }
</style>