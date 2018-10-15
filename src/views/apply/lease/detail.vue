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
                <span v-if="applyStatus=='待发货'">
                    <el-button type="primary" v-if="isShowGetMoneyBtn" v-on:click="getMoneyBtn()" :loading="listLoading">收款</el-button>
                    <el-button type="primary" v-if="" v-on:click="confirm()" :loading="listLoading">确认发货</el-button>
                    <el-button type="primary" v-if="" v-on:click="closeOrder()" :loading="listLoading">取消订单</el-button>
                </span>
                <span v-if="applyStatus=='已发货'">
                    <el-button type="primary" v-if="" v-on:click="confirmCusGetBtn()"
                               :loading="listLoading">确认客户收货</el-button>
                </span>
                <span v-if="applyStatus=='待退还'">
                    <el-button type="primary" v-if="isShow" v-on:click="confirmCollectGoodsBtn()"
                               :loading="listLoading">收到还货</el-button>
                    <el-button type="primary" v-if="isShow" v-on:click="returnDepositMoneyBtn()"
                               :loading="listLoading">退押金</el-button>
                </span>
                <span v-if="applyStatus=='超时未退'">
                    <el-button type="primary" v-if="isShow" v-on:click="confirmCollectGoodsBtn()"
                               :loading="listLoading">收到还货</el-button>
                    <el-button type="primary" v-if="isShow" v-on:click="returnDepositMoneyBtn()"
                               :loading="listLoading">退押金</el-button>
                </span>
                <span v-if="applyStatus=='已退还'">
                    <el-button type="primary" v-if="" v-on:click="returnDepositMoneyBtn()"
                               :loading="listLoading">退押金</el-button>
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
            <!--<el-table-column-->
                    <!--prop="leaseDay"-->
                    <!--label="租赁天数">-->
            <!--</el-table-column>-->
            <el-table-column
                    prop="beginTime"
                    :formatter="dateFormat"
                    label="租赁开始时间">
            </el-table-column>
            <el-table-column
                    prop="endTime"
                    :formatter="dateFormat"
                    label="租赁结束时间">
            </el-table-column>
        </el-table>
        <!--商品信息表格-->
        <h3 style="margin-top: 50px;">申请商品信息</h3>
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
                    prop="leaseDay"
                    label="租赁天数">
            </el-table-column>
        </el-table>

        <!--置换商品信息-->
        <h3 style="margin-top: 50px;">租赁商品信息</h3>
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
                    prop="price"
                    label="租金">
            </el-table-column>
            <el-table-column
                    prop="salePrice"
                    label="押金">
            </el-table-column>
            <el-table-column
                    prop="modifySalePrice"
                    label="收款金额">
            </el-table-column>
            <el-table-column
                    prop="modifyCommission"
                    label="退还押金">
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
        <el-dialog title="初审通过，同意租赁" style="width: 100%" v-model="passFormVisible" :visible.sync="passFormVisible">
            <el-form ref="passForm" :model="passForm" :rules="passFormRules" label-width="100px"
                     @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
                <el-form-item label="押金" prop="salePrice">
                    <el-input v-model="passForm.salePrice" type="number" style="width: 70%;"></el-input>
                </el-form-item>
                <el-form-item label="租金" prop="price">
                    <el-input v-model="passForm.price" type="number" style="width: 70%;"></el-input>
                </el-form-item>
                <el-form-item label="租赁天数" prop="leaseDay">
                    <el-input v-model="passForm.leaseDay" type="number" style="width: 70%;"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="selectSendGoods()" :loading="listLoading">选择租赁商品</el-button>
                </el-form-item>

                <el-form-item>
                    <el-table
                            v-loading="listLoading"
                            element-loading-text="拼命加载中"
                            :data="showGoodDetail"
                            border
                            style="width: 100%;margin-top: 5px;"
                    >
                        <el-table-column prop="spuCode" label="商品编码"></el-table-column>
                        <el-table-column prop="skuCode" label="SKU"></el-table-column>
                        <el-table-column prop="spuName" label="商品名称" width=""></el-table-column>
                        <el-table-column prop="spuBrand" label="品牌" width=""></el-table-column>
                        <el-table-column prop="skuAttrsValue" label="属性" width=""></el-table-column>
                        <el-table-column prop="salesPrice" label="价格" width=""></el-table-column>
                        <el-table-column
                                align="center"
                                label="操作">
                            <template slot-scope="scope">
                                <el-button @click.native.prevent="deleteRow(scope.$index, showGoodDetail)" type="text">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>

                <el-form-item>
                    <el-button @click.native="passFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="passSubmit('passForm')">同意</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--拒绝寄卖弹出窗-->
        <el-dialog title="拒绝" style="width: 100%" v-model="refuseFormVisible" :visible.sync="refuseFormVisible">
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
        <!--收款-->
        <el-dialog title="收款" style="width: 100%" v-model="getMoneyVisible" :visible.sync="getMoneyVisible">
            <el-form ref="getMoneyForm" :model="getMoneyForm" :rules="getMoneyFormRules" label-width="100px"
                     @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
                <el-form-item label="支付金额" prop="modifySalePrice">
                    <el-input v-model="getMoneyForm.modifySalePrice" type="number" style="width: 70%;"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click.native="getMoneyVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="getMoneySubmit('getMoneyForm')">确认</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--确认发货弹出窗-->
        <el-dialog title="确认发货" style="width: 100%" v-model="confirmFormVisible" :visible.sync="confirmFormVisible">
            <el-form ref="confirmForm" :model="confirmForm" :rules="confirmFormRules" label-width="100px"
                     @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
                <el-form-item label="快递单号" prop="logisticsNo">
                    <el-input v-model="confirmForm.logisticsNo" type="number" style="width: 70%;"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click.native="confirmFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="confirmSubmit('confirmForm')">确认发货</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--确认收货弹出窗-->
        <el-dialog title="确认收货" style="width: 100%" v-model="confirmCollectGoodsFormVisible" :visible.sync="confirmCollectGoodsFormVisible">
            <el-form ref="confirmCollectGoodsForm" :model="confirmCollectGoodsForm" :rules="confirmCollectGoodsFormRules" label-width="100px"
                     @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
                <el-form-item label="快递单号" prop="logisticsNo">
                    <el-input v-model="confirmCollectGoodsForm.logisticsNo" type="number" style="width: 70%;"></el-input>
                </el-form-item>
                <el-form-item label="还货时间" required>
                    <el-form-item prop="endTime">
                        <el-date-picker type="datetime"  placeholder="选择日期" v-model="confirmCollectGoodsForm.endTime" ></el-date-picker>
                    </el-form-item>
                </el-form-item>
                <el-form-item>
                    <el-button @click.native="confirmCollectGoodsFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="confirmCollectGoodsSubmit('confirmCollectGoodsForm')">确认收货</el-button>
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
        <!--退押金弹出窗-->
        <el-dialog title="退押金" style="width: 100%" v-model="returnDepositMoneyFormVisible"
                   :visible.sync="returnDepositMoneyFormVisible">
            <el-form ref="returnDepositMoneyForm" :model="returnDepositMoneyForm" :rules="returnDepositMoneyFormRules"
                     label-width="100px" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
                <el-form-item label="支付金额" prop="modifyCommission">
                    <el-input v-model="returnDepositMoneyForm.modifyCommission" type="number" style="width: 70%;"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click.native="returnDepositMoneyFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="returnDepositMoneySubmit('returnDepositMoneyForm')">确认</el-button>
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
        <!--财务打款弹出窗-->
        <el-dialog title="财务打款" style="width: 100%" v-model="makeMoneyVisible" :visible.sync="makeMoneyVisible">
            <el-form ref="makeMoneyForm" :model="makeMoneyForm" :rules="makeMoneyFormRules" label-width="100px"
                     @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
                <el-form-item label="售价" prop="salePrice">
                    <el-input disabled v-model="makeMoneyForm.salePrice" type="number" style="width: 70%;"></el-input>
                </el-form-item>
                <el-form-item label="银行" prop="receiverBank">
                    <el-input disabled v-model="makeMoneyForm.receiverBank" type="text" style="width: 70%;"></el-input>
                </el-form-item>
                <el-form-item label="账号" prop="receiverAccount">
                    <el-input disabled v-model="makeMoneyForm.receiverAccount" type="number"
                              style="width: 70%;"></el-input>
                </el-form-item>
                <el-form-item label="户名" prop="receiverName">
                    <el-input disabled v-model="makeMoneyForm.receiverName" type="text" style="width: 70%;"></el-input>
                </el-form-item>
                <el-form-item label="打款金额" prop="payPrice">
                    <el-input v-model="makeMoneyForm.payPrice" type="number" style="width: 70%;"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click.native="makeMoneyVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="makeMoneySubmit('makeMoneyForm')">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
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

    </section>
</template>

<script>
    import util from '../../../common/js/util'
    import {
        getRecyclingInfoById,
        passOrRefuseSubmitFun,
        confirmSendGoodsFun,
        closeSubmitFun,
        confirmCollectGoodsFun,
        returnDepositMoneyFun,
        returnSubmitFun,
        makeMoneySubmitFun,
        cusCollectGoodsFun,
        getSelectSKUList,
        firstTrialPassFun,
        getMoneyFun,
    } from '../../../api/api';

    export default {
        data() {
            return {
                addgoodList: [],
                showGoodDetail: [],
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
                beginTime: '',
                endTime: '',

                itemsInfo: [],//商品信息
                className: '',
                brandName: '',
                leaseDay: '',

                substitutionGoodsInfo: [],//租赁商品信息
                spuName: '',
                spuBrand: '',
                skuCode: '',
                skuAttrsValue: '',
                salesPrice: '',
                spuCode: '',

                distributionInfoList: [],//配送信息
                consigneePeople: '',
                consigneePhone: '',
                address: '',
                logisticsNo: '',

                /*图片弹出窗*/
                isImgShow: false,
                imgSrc: '',

                costInfo: [],//费用信息
                salePrice: '',
                price: '',
                modifySalePrice: '',
                modifyCommission: '',


                operationInfo: [],//操作日志信息
                operator: '',
                updateTime: '',
                orderStatus: '',
                operation: '',
                remark: "",


                listLoading: false,
                //初审通过弹出框
                passFormVisible: false,
                passForm: {
                    id: "",
                    salePrice: "",
                    price: '',
                    leaseDay: '',
                },
                //校验规则
                passFormRules: {
                    salePrice: [
                        {required: true, message: '请输入押金', trigger: 'blur'},
                    ],
                    price: [
                        {required: true, message: '请输入租金', trigger: 'blur'},
                    ],
                    leaseDay: [
                        {required: true, message: '请输入租赁天数', trigger: 'blur'},
                    ],
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
                //收费弹出框
                getMoneyVisible: false,
                getMoneyForm: {
                    id: "",
                    modifySalePrice: "",
                },
                //校验规则
                getMoneyFormRules: {
                    modifySalePrice: [
                        {required: true, message: '请输入支付金额', trigger: 'blur'},
                    ]
                },
                //确认发货弹出框
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
                //确认收货弹出框
                confirmCollectGoodsFormVisible: false,
                confirmCollectGoodsForm: {
                    id: "",
                    logisticsNo: "",
                    endTime: "",
                },
                //校验规则
                confirmCollectGoodsFormRules: {
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
                //退押金弹出框
                returnDepositMoneyFormVisible: false,
                returnDepositMoneyForm: {
                    id: "",
                    modifyCommission: "",
                },
                //校验规则
                returnDepositMoneyFormRules: {
                    modifyCommission: [
                        {required: true, message: '请输入退还金额', trigger: 'blur'},
                    ]
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
                //财务打款弹出框
                makeMoneyVisible: false,
                makeMoneyForm: {
                    id: "",
                    salePrice: "",
                    receiverBank: "",
                    receiverAccount: "",
                    receiverName: "",
                    payPrice: "",
                },
                //校验规则
                makeMoneyFormRules: {
                    payPrice: [
                        {required: true, message: '请输入打款金额', trigger: 'blur'},
                    ]
                },

                isShow: false,
                isShowGetMoneyBtn: false,

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
                this.operationInfo = [];
                this.substitutionGoodsInfo = [];
                getRecyclingInfoById(para).then((data) => {
                    this.baseInfo.push(data.data.baseInfo);
                    this.itemsInfo.push(data.data.itemsInfo);
                    this.distributionInfoList.push(data.data.distributionInfoList);
                    this.costInfo.push(data.data.costInfo);
                    //this.operationInfo.push(data.data.operationInfo);
                    this.operationInfo = data.data.operationInfo;
                    this.substitutionGoodsInfo.push(data.data.substitutionGoodsInfo);

                    var d = data.data.baseInfo;
                    // let format = util.formatDate.format(new Date(d.endTime), 'yyyy-MM-dd');
                    // this.baseInfo[0].endTime = format;
                    if (d.beginTime == -2209017600000) {
                        this.baseInfo[0].beginTime = '';
                    }
                    if (d.endTime == -2209017600000) {
                        this.baseInfo[0].endTime = '';
                    }
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
                    if (f.salePrice == 0) {
                        this.costInfo = null;
                    } else {
                        this.isShow = true;
                        if (f.salePrice == 0) {
                            f.salePrice = "";
                        }
                        if (f.modifySalePrice == 0) {
                            f.modifySalePrice = "";
                            this.isShowGetMoneyBtn = true;
                        }else{
                            this.isShowGetMoneyBtn = false;
                        }
                        if (f.modifyCommission == 0) {
                            f.modifyCommission = "";
                        }
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
                this.showGoodDetail = [];
                this.passForm = {
                    id: "",
                    salePrice: "",
                    price: '',
                    leaseDay: '',
                    skuId:''
                };
            },
            //初审通过，提交后台请求
            passSubmit() {
                this.$refs.passForm.validate((valid) => {
                    if (valid) {
                        this.passForm.id = this.id;
                        let skuId = this.showGoodDetail[0].skuCode;
                        this.passForm.skuId = skuId;
                        firstTrialPassFun(this.passForm).then((data) => {
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

            //点击收费按钮，打开弹出窗
            getMoneyBtn() {
                this.getMoneyVisible = true;
                this.getMoneyForm = {
                    id: "",
                    modifySalePrice: "",
                };
            },
            //确认收货，提交后台请求
            getMoneySubmit() {
                this.$refs.getMoneyForm.validate((valid) => {
                    if (valid) {
                        this.getMoneyForm.id = this.id;
                        getMoneyFun(this.getMoneyForm).then((data) => {
                            if (this.GLOBAL.isResonseSuccess(data)) {
                                this.getMoneyVisible = false;
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

            //点击确认发货按钮，打开弹出窗
            confirm() {
                this.confirmFormVisible = true;
                this.confirmForm = {
                    id: "",
                    logisticsNo: "",
                    distributionType: 1,
                    stateId: true,
                };
            },
            //确认发货，提交后台请求
            confirmSubmit() {
                this.$refs.confirmForm.validate((valid) => {
                    if (valid) {
                        this.confirmForm.id = this.id;
                        confirmSendGoodsFun(this.confirmForm).then((data) => {
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


            //点击确认收货按钮，打开弹出窗
            confirmCollectGoodsBtn() {
                this.confirmCollectGoodsFormVisible = true;
                this.confirmCollectGoodsForm = {
                    id: "",
                    logisticsNo: "",
                    endTime: "",
                };
            },
            //确认收货，提交后台请求
            confirmCollectGoodsSubmit() {
                this.$refs.confirmCollectGoodsForm.validate((valid) => {
                    if (valid) {
                        this.confirmCollectGoodsForm.id = this.id;
                        confirmCollectGoodsFun(this.confirmCollectGoodsForm).then((data) => {
                            if (this.GLOBAL.isResonseSuccess(data)) {
                                this.confirmCollectGoodsFormVisible = false;
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

            //退押金按钮，打开弹出窗
            returnDepositMoneyBtn() {
                this.returnDepositMoneyFormVisible = true;
                this.returnDepositMoneyForm = {
                    id: "",
                    modifyCommission: ""
                };
            },
            //确定 退押金，提交后台请求
            returnDepositMoneySubmit() {
                this.$refs.returnDepositMoneyForm.validate((valid) => {
                    if (valid) {
                        this.returnDepositMoneyForm.id = this.id;
                        returnDepositMoneyFun(this.returnDepositMoneyForm).then((data) => {
                            if (this.GLOBAL.isResonseSuccess(data)) {
                                this.returnDepositMoneyFormVisible = false;
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

            //点击财务打款按钮，打开弹出窗
            makeMoney() {
                this.makeMoneyVisible = true;
                var curPrice = this.costInfo[0].modifySalePrice;
                var bank = this.paymentInfo[0].receiverBank;
                var account = this.paymentInfo[0].receiverAccount;
                var name = this.paymentInfo[0].receiverName;
                this.makeMoneyForm = {
                    id: "",
                    salePrice: curPrice,
                    receiverBank: bank,
                    receiverAccount: account,
                    receiverName: name,
                    payPrice: "",
                };
            },
            //财务打款，提交后台请求
            makeMoneySubmit() {
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


            //确认客户收货按钮
            confirmCusGetBtn() {
                this.$confirm('确认顾客已收货?', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var orderId = this.id;
                    var para = {id: orderId};
                    cusCollectGoodsFun(para).then((data) => {
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


            //仓库确认收货
            confirmCollectGoodsBtn111() {
                this.$confirm('确认仓库已收货?', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var orderId = this.id;
                    var para = {id: orderId};
                    confirmCollectGoodsFun(para).then((data) => {
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
            selectGoodEvent(row){
                this.selectFormVisible = false;
                console.log(row.skuCode);
                var d = this.showGoodDetail;
                 for(var i=0;i<d.length;i++){
                     if (i == 0){
                        this.$message({
                            message: '只能选择一件商品',
                            type: 'warn'
                        });
                        return ;
                    }
                 }
                this.showGoodDetail.push(row);
            },
            //<!--订单列表分页-->
            handleCurrentChange(val) {
                this.pageNum = val;
                this.selectGoodsList();
            },
            //处理分页条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.selectGoodsList();
            }

        },

        //删除按钮，点击删除商品
        deleteRow(index, rows) {
            rows.splice(index, 1);
        },


        mounted() {
            this.recyclingInfo();
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