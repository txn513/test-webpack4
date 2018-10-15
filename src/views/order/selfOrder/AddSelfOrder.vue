<template>
    <section>
    <el-form ref="form" :model="form" :rules="addFormRules" label-width="110px" @submit.prevent="onSubmit" style="margin:20px;width:62%;min-width:600px;">
        <el-col :span="24" style="padding-bottom: 0px;padding-top: 10px;"><h3>基本信息</h3></el-col>
        <el-form-item label="业务类型" prop="businessCode">
            <el-select v-model="form.businessCode" placeholder="请选择业务类型">
                <el-option label="名品" value=2></el-option>
            </el-select>
        </el-form-item>
	    <el-form-item label="订单来源" prop="orderSourceType">
            <el-select v-model="form.orderSourceType" placeholder="请选择订单来源" @change="selectedOrderType">
                <el-option label="京东" value="10"></el-option>
                <el-option label="淘宝" value="11"></el-option>
                <el-option label="门店" value="5"></el-option>
            </el-select>
        </el-form-item>
        <!--选择京东、淘宝才会显示 外部订单编号-->
        <el-form-item v-if="outOrderIdAndDistributionType" label="外部订单编号" prop="orderOutId">
            <el-input v-model="form.orderOutId"></el-input>
        </el-form-item>
        <el-form-item label="配送方式" prop="distributionType">
            <el-radio-group v-model="form.distributionType">
                <el-radio label="3" :disabled="disabledFlag1">三方物流</el-radio>
            </el-radio-group>
            <el-radio-group v-model="form.distributionType">
                <el-radio label="1" :disabled="disabledFlag2">门店自取</el-radio>
            </el-radio-group>
        </el-form-item>

        <el-form-item label="收货人" prop="receiverName">
            <el-input v-model="form.receiverName" placeholder="请填写收货人姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="receiverPhone">
            <el-input v-model="form.receiverPhone" placeholder="请填写收货人手机号码"></el-input>
        </el-form-item>
        <el-form-item label="邮政编码" prop="receiverCode">
            <el-input v-model="form.receiverCode" placeholder="请填写邮政编码"></el-input>
        </el-form-item>

        <el-form-item label="所在区域" prop="selfAddress">
            <template slot-scope="scope">
                <el-select v-model="province.value" placeholder="请选择" style="width: 15%"  @change="initCity">
                    <el-option v-for="(item,index) in province.options" :key="item.code" :label="item.regionNameC" :value="index" />
                </el-select>
                <el-select v-model="city.value" placeholder="请选择" style="width: 15%" @change="initArea">
                    <el-option v-for="(item,index) in city.options" :key="item.code" :label="item.regionNameC" :value="index" />
                </el-select>
                <el-select v-model="area.value" placeholder="请选择" style="width: 15%">
                    <el-option v-for="(item,index) in area.options" :key="item.code" :label="item.regionNameC" :value="index"/>
                </el-select>
            </template>
        </el-form-item>
        <el-form-item label="收货地址" prop="receiverAddress">
            <el-input v-model="form.receiverAddress" placeholder="请填写收货地址"></el-input>
        </el-form-item>

        <el-form-item label="" label-width="0px" prop="selectedProductList">
            <el-col :span="24" style="padding-bottom: 0px;"><h3>商品信息</h3></el-col>
            <el-col :span="24" style="padding-bottom: 5px;"><el-button type="primary" @click="selectProduct">新增商品</el-button></el-col >
        </el-form-item>

    <!--已选择的商品信息列表-->
    <el-table :data="selectedProductList" border highlight-current-row style="width: 100%;">
            <el-table-column id="index" type="index" label="序号" width="48"></el-table-column>
            <el-table-column prop="spuCode" label="商品编号" min-width="90">
            </el-table-column>
            <el-table-column prop="skuCode" label="SKU">
            </el-table-column>
            <el-table-column prop="spuName" label="商品名称" showOverflowTooltip>
            </el-table-column>
            <el-table-column prop="brandName" label="品牌" showOverflowTooltip>
            </el-table-column>
            <el-table-column prop="property" label="属性" showOverflowTooltip>
            </el-table-column>
            <el-table-column prop="spuModel" label="型号" showOverflowTooltip>
            </el-table-column>
            <el-table-column prop="qualityName" label="品质" showOverflowTooltip width="50">
            </el-table-column>
            <el-table-column prop="damage" label="损伤部位" showOverflowTooltip>
            </el-table-column>
            <el-table-column label="单价" min-width="90">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.salesPrice" @blur="getTotalPrice"></el-input>
                </template>
            </el-table-column>
            <el-table-column prop="number" label="数量" min-width="90">
                <template  slot-scope="scope">
                    <el-input v-model="scope.row.number" @blur="getTotalPrice"></el-input>
                </template>
            </el-table-column>
            <el-table-column prop="storeName" label="所属仓库" showOverflowTooltip>
            </el-table-column>
            <el-table-column label="操作" showOverflowTooltip min-width="75">
                <template slot-scope="scope">
                    <el-button type="danger" size="small" @click="deleteCurrentSelectedProduct(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
    </el-table>

    <el-input id="initialPriceInputId" v-model="form.initialPrice" readonly>
    </el-input>

    <el-col :span="24"  style="padding-bottom: 0px;padding-top: 10px;"><h3>发票信息</h3></el-col >
    <el-form-item label="发票信息" prop="invoiceFlag">
        <el-radio-group v-model="form.invoiceFlag" @change="haveInvoice">
            <el-radio label="1">开发票</el-radio>
            <el-radio label="0">不开发票</el-radio>
        </el-radio-group>
    </el-form-item>
	</el-form>

    <el-form :rules="addFormInvoiceRules" ref="invoiceForm" :model="invoiceForm" label-width="110px" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
        <el-form-item v-if="addInvoiceFormVisibleFlag"  label="发票类型" prop="invoiceProforma">
            <el-select v-model="invoiceForm.invoiceProforma" placeholder="请选择发票类型" disabled>
                <el-option label="电子普通发票" value="2"></el-option>
            </el-select>
        </el-form-item>

        <el-form-item v-if="addInvoiceFormVisibleFlag" label="发票抬头类型" prop="invoiceType">
            <el-select v-model="invoiceForm.invoiceType" placeholder="请选择发票抬头类型" @change="invoiceTileType">
                <el-option label="个人" value="1"></el-option>
                <el-option label="单位" value="2"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="发票抬头名称" prop="invoiceTitleName" v-if="invoiceTileTypeFlag == '1' && addInvoiceFormVisibleFlag" >
            <el-input v-model="invoiceForm.invoiceTitleName" placeholder="请填写姓名"></el-input>
        </el-form-item>
        <el-form-item label="发票抬头名称" prop="invoiceTitleCompany" v-if="invoiceTileTypeFlag == '2' && addInvoiceFormVisibleFlag">
            <el-input v-model="invoiceForm.invoiceTitleCompany" placeholder="请填写公司发票抬头"></el-input>
        </el-form-item>
        <el-form-item label="纳税人识别号" prop="payTaxesNo" v-if="invoiceTileTypeFlag == '2' && addInvoiceFormVisibleFlag">
            <el-input v-model="invoiceForm.payTaxesNo" placeholder="请填写纳税人识别号"></el-input>
        </el-form-item>
        <el-form-item v-if="addInvoiceFormVisibleFlag" label="发票内容" prop="invoiceContent">
            <el-radio-group v-model="invoiceForm.invoiceContent">
                <el-radio label="1">商品明细</el-radio>
                <el-radio label="2">商品类别</el-radio>
            </el-radio-group>
        </el-form-item>

        <el-form-item v-if="addInvoiceFormVisibleFlag" label="收票人手机" prop="invoicePhone">
            <el-input v-model="invoiceForm.invoicePhone" placeholder="请填写收票人手机号码"></el-input>
        </el-form-item>
        <el-form-item v-if="addInvoiceFormVisibleFlag" label="收票人邮箱" prop="invoiceEmail">
            <el-input v-model="invoiceForm.invoiceEmail" placeholder="请填写收票人邮箱"></el-input>
        </el-form-item>

        <el-form-item style="float: right">
            <el-button @click="toOrderDetailList">取消</el-button>
            <el-button type="primary" @click="submitForm('form')">提交</el-button>
        </el-form-item>
    </el-form>

        <el-dialog title="选择商品" v-model="selectProductVisibleFlag" :visible.sync="selectProductVisibleFlag">
            <el-form ref="searchForm" :model="searchForm" align="left" :inline="true"  class="demo-form-inline" label-width="80px" style="width:60%;min-width:600px;">
                <el-form-item label="" prop="orderSource">
                    <el-select v-model="searchForm.searchType.value" placeholder="请选择查询关键字">
                        <el-option label="商品编码" value="1"></el-option>
                        <el-option label="商品名称" value="2"></el-option>
                        <el-option label="SKU" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="" prop="keyword2">
                    <el-input placeholder="请输入" v-model="searchForm.searchKw"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary"  @click="searchList">搜索</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="productList" border style="width: 100%;" @row-dblclick="selectCurrentProduct">
                <el-table-column prop="spuCode" label="商品编号">
                </el-table-column>
                <el-table-column prop="skuCode" label="sku编码">
                </el-table-column>
                <el-table-column prop="spuName" label="商品名称" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="storeNO" label="仓库编号" v-if="false" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="brandName" label="品牌" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="property" label="属性" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="spuModel" label="型号" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="qualityName" label="品质" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="damage" label="损伤部位" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="surplusStock" label="数量" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="storeName" label="所属仓库" show-overflow-tooltip>
                </el-table-column>
            </el-table>
            <!--工具条-->
            <el-row :gutter="24"  style=";padding-top: 10px;">
                <el-col :span="24">
                    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
                                   :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" style="float: right">
                    </el-pagination>
                </el-col>
            </el-row>
        </el-dialog>
 </section>
</template>

<script>
    import {addOrder,stockSearchGoods,getRegion} from '../../../api/api';
	export default {
		data() {
            var checkMobile = (rule, value, callback) => {
                var reg = new RegExp(/^1[3456789]\d{9}$/);
                if (!reg.test(value)) {
                    callback(new Error('手机号码格式错误'));
                } else {
                    callback();
                }
            };

            var checkEmail = (rule, value, callback) => {
                var reg = new RegExp(/[a-zA-Z0-9]{1,10}@[a-zA-Z0-9]{1,5}\.[a-zA-Z0-9]{1,5}/);
                if (!reg.test(value)) {
                    callback(new Error('邮箱格式错误'));
                } else {
                    callback();
                }
            };

            var checkInvoiceTitleName = (rule, value, callback) =>{
                if((this.invoiceForm.invoiceType == '1' ||this.invoiceForm.invoiceType == '') && this.invoiceForm.invoiceTitleName == ''){
                    return callback(new Error('请填写姓名'));
                } else {
                    return callback()
                }
            };

            var checkInvoiceTitleCompany = (rule, value, callback) =>{
                if(this.invoiceForm.invoiceType == '2' && this.invoiceForm.invoiceTitleCompany == ''){
                    return callback(new Error('请填写公司发票抬头'));
                } else {
                    return callback()
                }
            };

			return {
                province:{options:[{}],value:0},
                city:{options: [{code: "0",regionNameC: "",id: 0}],value:0},
                area:{options: [{code: "0",regionNameC: "",id: 0}],value:0},

                form: {
                    businessCode: '',
                    orderSourceType: '',
                    orderOutId:'',
                    receiverName: '',//收货人姓名
                    receiverPhone: '',//收货人电话
                    receiverCode:'',
                    selfAddress:'',
                    region:'',
                    receiverAddress:'',//收货人地址
                    invoiceFlag: '0',//是否开发票 0:不开发票(默认);1:开发票
                    distributionType: '',
                    selectedProductList: [],
                    initialPrice: '总计：￥ 0'
                },

                invoiceForm: {
                    invoiceType: '',
                    invoiceTitle: '',
                    invoiceTitleName: '',
                    invoiceTitleCompany: '',
                    payTaxesNo: '',
                    invoiceContent: '',
                    invoicePhone: '',
                    invoiceEmail: '',
                    invoiceProforma: '2'
				},

                searchForm: {
                    searchType:{ value: '1' },
                    searchKw: ''
                },

                addInvoiceFormVisibleFlag: true, //是否开发票，true：开发票 false: 不开发票
                invoiceTileTypeFlag: 1,  //发票类型，1：个人 2: 单位
                selectProductVisibleFlag: false,//选择商品界面是否显示
                outOrderIdAndDistributionType: false,//根据订单来源显示隐藏外部订单编号、配置方式
                disabledFlag1: false,//是否禁用三方物流选项
                disabledFlag2: false,//是否禁用门店自取选项
                excludeProducts:[],//通过商品id排除已选择过的商品
                productList:[],//供选择的商品信息列表
                selectedProductList:[],//已选择的商品信息列表
                total: 0,
                pageNum: 1, //当前页码
                pageSize: 10,//页数

                addFormRules: {
                    businessCode: [
                        { required: true, message: '请选择业务类型' }
                    ],
                    orderSourceType: [
                        { required: true, message: '请选择订单来源' }
                    ],
                    orderOutId: [
                        { required: true, message: '请填写外部订单编号', trigger: 'blur' },
                        { max: 64, message: '外部订单编号不能超过64个字符', trigger: 'blur' },
                        {pattern: /^(\d)*$/, message: '外部订单编号只能输入数字', trigger: 'blur'}
                    ],
                    distributionType: [
                        { required: true, message: '请选择配送方式' }
                    ],
                    receiverName: [
                        { required: true, message: '请填写收货人姓名', trigger: 'blur' },
                        { max: 32, message: '收货人姓名不能超过32个字符', trigger: 'blur' }
                    ],
                    receiverPhone: [
                        { required: true, message: '请填写收货人手机号码', trigger: 'blur' },
                        {validator: checkMobile, trigger: 'blur'}
                    ],
                    receiverCode: [
                        { max: 20, message: '邮政编码不能超过20个字符', trigger: 'blur' },
                        {pattern: /^(\d)*$/, message: '邮政编码格式错误', trigger: 'blur'}
                    ],
                    selfAddress: [
                        { required: true, message: '请选择收货人所在区域' }
                    ],
                    receiverAddress: [
                        { required: true, message: '请填写收货人详细地址', trigger: 'blur' },
                        { max: 200, message: '收货人详细地址不能超过200个字符', trigger: 'blur' }
                    ],
                    invoiceFlag: [
                        { required: true, message: '请选择是否开发票' }
                    ]
                },

                addFormInvoiceRules: {
                    invoiceProforma: [
                        { required: true, message: '请选择发票类型' }
                    ],
                    invoiceType: [
                        { required: true, message: '请选择发票抬头类型' }
                    ],
                    invoiceTitleName: [
                        {validator: checkInvoiceTitleName, required: true, trigger: 'blur'},
                        { max: 64, message: '发票抬头名称不能超过64个字符', trigger: 'blur' }
                    ],
                    invoiceTitleCompany: [
                        {validator: checkInvoiceTitleCompany, required: true, trigger: 'blur'},
                        { max: 64, message: '发票抬头名称不能超过64个字符', trigger: 'blur' }
                    ],
                    payTaxesNo: [
                        { required: true, message: '请填写纳税人识别号', trigger: 'blur' },
                        { max: 32, message: '纳税人识别号不能超过32个字符', trigger: 'blur' }
                    ],
                    invoiceContent: [
                        { required: true, message: '请选择发票内容' }
                    ],
                    invoicePhone: [
                        { required: true, message: '请填写收票人手机', trigger: 'blur' },
                        {validator: checkMobile, trigger: 'blur'}
                    ],
                    invoiceEmail: [
                        { required: true, message: '请填写收票人邮箱', trigger: 'blur' },
                        {validator: checkEmail, trigger: 'blur'}
                    ]
                }
			}
		},
		methods: {

            //切换页数
            handleCurrentChange(val) {
                this.pageNum = val;
                this.searchList();
            },
            //处理分页条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.searchList();
            },

            submitForm(formName) {
                this.$refs.form.validate((validForm) => {
                    this.$refs.invoiceForm.validate((validInvoiceForm) => {
                        if (validForm && validInvoiceForm) {
                            if(this.selectedProductList.length == 0){
                                this.$message({
                                    message: '请选择商品',
                                    type: 'warning'
                                });
                                return;
                            } else  {
                                let productList = this.selectedProductList;
                                //正整数
                                var numberRegu = /^[1-9]\d*$/;

                                //价格规则，最多2位小数
                                var priceRegu = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/;
                                for (var product of productList) {
                                    if (!priceRegu.test(product.salesPrice)){
                                        this.$message({
                                            message: '商品价格只能输入非0且最多2位小数的正数',
                                            type: 'error'
                                        });
                                        return;
                                    }

                                    if (!numberRegu.test(product.number)){
                                        this.$message({
                                            message: '商品数量只能输入正整数',
                                            type: 'error'
                                        });
                                        return;
                                    }
                                }
                            }

                            let receiverAddress = "";
                            try {
                                receiverAddress = this.province.options[this.province.value].regionNameC + "-" + this.city.options[this.city.value].regionNameC + "-" + this.area.options[this.area.value].regionNameC + "-" + this.form.receiverAddress;
                            }
                            catch (err) {
                                this.$message({
                                    message: '地区选择有误',
                                    type: 'warning'
                                });
                                return;
                            }

                            this.addLoading = true;

                            //基本信息数据
                            let para = Object.assign({}, this.form);
                            let initialPriceSub = para.initialPrice;

                            if(initialPriceSub.includes("￥")){
                                para.initialPrice = initialPriceSub.substring(initialPriceSub.indexOf('￥')+1,initialPriceSub.length);
                            }

                            para.receiverAddress = receiverAddress;

                            //基本信息数据
                            let orderSelfAddReqDto = para;

                            //发票数据
                            let orderSelfInvoiceReqDto = Object.assign({}, this.invoiceForm);

                            if(orderSelfInvoiceReqDto.invoiceType == '1'){
                                orderSelfInvoiceReqDto.invoiceTitle = orderSelfInvoiceReqDto.invoiceTitleName;
                            }

                            if(orderSelfInvoiceReqDto.invoiceType == '2'){
                                orderSelfInvoiceReqDto.invoiceTitle = orderSelfInvoiceReqDto.invoiceTitleCompany;
                            }

                            //选择的订单商品明细数据
                            let orderSelfProductReqDto = this.selectedProductList;
                            let formPara = {...para, orderSelfInvoiceReqDto, orderSelfAddReqDto, orderSelfProductReqDto};
                            addOrder(formPara).then((res) => {
                                if (this.GLOBAL.isResonseSuccess(res)) {
                                    this.$message({
                                        message: '保存成功',
                                        type: 'success'
                                    });
                                    this.toOrderDetailList();
                                }else {
                                    this.$message({
                                        message: '操作失败,'+ res.message == undefined ? "" : res.message,
                                        type: 'error'
                                    });
                                }
                            }).catch(function (event) {
                                    console.log(event.toLocaleString());
                                }
                            );
                        }
                    });
                });
            },

            //双击商品列表选择当前商品并关闭商品列表
            selectCurrentProduct(row) {
                row.salesPrice = '';
                row.stockId = row.id;
                row.onSaleTime = new Date(row.onSaleTime);
                //row.imgUrl = row.imgPath;
                //删除不需要的id属性，避免映射到后台相关DTO中的id字段，进而避免产生不可预期的问题 2018/6/20
                for(var item in row){
                    if (item == 'id'){
                        delete row[item];
                    }
                }

                this.selectedProductList.push(row);
                this.excludeProducts.push(row.stockId);
                this.selectProductVisibleFlag = false;
                this.searchForm.searchKw = '';
            },

            //选择商品按钮
            selectProduct() {
                let para = {
                    searchType: this.searchForm.searchType.value,
                    kw: this.searchForm.searchKw,
                    excludeIds: this.excludeProducts,
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize
                    }
                };
                stockSearchGoods(para).then((resp) => {
                    if (resp.data.list.length == 0){
                        this.$message({
                            message: '没有可售卖的商品',
                            type: 'warning'
                        });
                    } else {
                        this.productList = resp.data.list;
                        this.total = resp.data.paginationInfo.total;
                        this.selectProductVisibleFlag = true;
                    }
                });
            },

            //选择订单类型
            selectedOrderType(orderType) {
                if (orderType == '10' || orderType == '11') {
                    this.outOrderIdAndDistributionType = true;
                    this.disabledFlag1 = false;
                    this.disabledFlag2 = true;
                    this.form.distributionType = '3';

                } else {
                    this.outOrderIdAndDistributionType = false;
                    this.disabledFlag1 = true;
                    this.disabledFlag2 = false;
                    this.form.distributionType = '1';
                    this.form.orderOutId = '';
                }
            },

            //是否开发票 0：不开发票 1：开发票
            haveInvoice(label) {
                if (label == '1') {
                    this.addInvoiceFormVisibleFlag = true;
                    this.invoiceForm.invoiceContent = '1';
                } else {
                    this.addInvoiceFormVisibleFlag = false;
                    //this.$refs.invoiceForm.resetFields();
                }
            },

            //发票类型 1：个人 2：单位
            invoiceTileType(value) {
                if (value == '1') {

                    this.invoiceTileTypeFlag = 1;
                } else {

                    this.invoiceTileTypeFlag = 2;
                }
            },

            //删除当前商品
            deleteCurrentSelectedProduct(index) {
                this.$confirm('确认删除当前所选商品吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.selectedProductList.splice(index, 1);
                    this.excludeProducts.splice(index, 1);

                    this.getTotalPrice();
                }).catch(() => {
                });
            },

            searchList() {
                var excludeProducts = [];
                if(this.selectedProductList.length >0){
                    this.selectedProductList.forEach(function(data,index){
                        excludeProducts.push(data.id);
                    });
                }

                let para = {
                    searchType: this.searchForm.searchType.value,
                    kw: this.searchForm.searchKw,
                    excludeIds:this.excludeProducts,
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize
                    }
                };
                stockSearchGoods(para).then((res) => {
                    this.listLoading = false;
                    this.productList = res.data.list;
                    this.total = res.data.paginationInfo.total;
                }, (res) => {
                    this.listLoading = false;
                }).catch(() => {
                });
            },

            initProvince() {
                getRegion({upperRegion: 0}).then((res) => {
                    this.province.options = res.data;
                    this.city={options: [{code: "0",regionNameC: "",id: 0}],value:0};
                    this.area={options: [{code: "0",regionNameC: "",id: 0}],value:0};
                    this.initCity();
                }, (res) => {
                    this.listLoading = false;
                }).catch(() => {
                });
            },

            initCity() {
                let code= this.province.options[this.province.value].code;
                getRegion({upperRegion: code}).then((res) => {
                    this.city.options = res.data;
                    this.city.value=0;
                    this.initArea();
                }, (res) => {
                    this.listLoading = false;
                }).catch(() => {
                });
            },

            initArea() {
                let code= this.city.options[this.city.value].code;
                getRegion({upperRegion: code}).then((res) => {
                    this.area.options = res.data;
                    this.area.value=0;
                    this.form.selfAddress='x';
                }, (res) => {
                    this.listLoading = false;
                }).catch(() => {
                });
            },

            toOrderDetailList(){
                this.$router.push({path:'/orderSelf/list'});
            },

            getTotalPrice(){
                let productList = this.selectedProductList;
                let totalPrice = 0;
                for (var product of productList) {
                    if(product.salesPrice && product.number){
                        let temp = 0;
                        let temp2 = 0;
                        if (product.salesPrice.includes(".")){
                            temp += product.salesPrice.split(".")[1].length;

                            if (totalPrice.toString().includes(".")){
                                temp2 += totalPrice.toString().split(".")[1].length;
                            }
                            if(temp2 == 0){
                                totalPrice = Number(totalPrice.toString().replace(".","")) + (Number(product.salesPrice.replace(".","")) * Number(product.number))/Math.pow(10,Math.max(temp,temp2));
                            } else {
                                totalPrice = (Number(totalPrice.toString().replace(".","")) + Number(product.salesPrice.replace(".","")) * Number(product.number))/Math.pow(10,Math.max(temp,temp2));
                            }
                        } else {
                            totalPrice = totalPrice + product.salesPrice * product.number;
                        }
                    }
                }
                this.form.initialPrice = "总计：￥" + totalPrice;
            }
        },

        created() {
            this.initProvince();
            this.haveInvoice(this.form.invoiceFlag);
        }
	}
</script>

<style>
    #initialPriceInputId{
        text-align: right;
        padding-right: 80px;
        border-radius: 0;
        border-top: 0;
    }

    .cell{
        padding-left: 9px !important;
    }
</style>