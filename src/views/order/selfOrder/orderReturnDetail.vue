<template>
    <section>
        <!--工具条-->
        <div  class="toolbar" style="padding-bottom: 0px;justify-content: space-between;">
            <span>自营订单->退货详情-><span class="order-status">待处理</span></span>
            <div style="text-align:right;">
                <span align="right">
                    <el-button type="primary" @click="backOrderReturnList">返回</el-button>
                </span>
            </div>
        </div>

        <h3 style="margin-top: 50px;">退货商品</h3>
        <el-table :data="productData" style="width: 100%" stripe border  aria-label="商品信息">
            <el-table-column prop="id" label="商品编号" show-overflow-tooltip></el-table-column>
            <el-table-column prop="spuName" label="商品名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="salesPrice" label="价格" sortable :formatter="formatPrice"></el-table-column>
            <el-table-column prop="property" label="属性" show-overflow-tooltip></el-table-column>
            <el-table-column prop="spuModel" label="型号" show-overflow-tooltip></el-table-column>
            <el-table-column prop="number" label="数量" sortable></el-table-column>
            <el-table-column prop="qualityName" label="品质" show-overflow-tooltip></el-table-column>
            <el-table-column prop="total" label="小计" sortable :formatter="formatPrice"></el-table-column>
        </el-table>
        <el-input v-model="totalPrice" id="priceStyle" readonly>
        </el-input>

        <h3 style="margin-top: 50px;">退货单信息</h3>
        <el-table :data="orderData" style="width: 100%" stripe border  aria-label="订单信息">
            <el-table-column prop="id" label="退货编号" show-overflow-tooltip></el-table-column>
            <el-table-column prop="orderId" label="订单编号" show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-button @click="orderDetail(scope.$index, scope.row)" type="text">查看订单</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="orderSourceType" label="订单来源" :formatter="formatSourceType"></el-table-column>
            <el-table-column prop="orderOutId" label="外部订单编号" show-overflow-tooltip></el-table-column>
            <el-table-column prop="returnsStatus" label="申请状态" sortable :formatter="formatStatus"></el-table-column>
            <el-table-column prop="createTime" label="申请时间" show-overflow-tooltip sortable :formatter="dateFormat"></el-table-column>
            <!--<el-table-column prop="receiverName" label="用户账号"></el-table-column>-->
            <el-table-column prop="receiverName" label="联系人" show-overflow-tooltip></el-table-column>
            <el-table-column prop="receiverPhone" label="联系电话" show-overflow-tooltip></el-table-column>
            <el-table-column prop="returnReason" label="退货原因" show-overflow-tooltip></el-table-column>
            <el-table-column prop="problemDescription" label="问题描述" show-overflow-tooltip></el-table-column>
            <!--<el-table-column prop="imgUrl" label="凭证照片"></el-table-column>-->
        </el-table>

        <h3 style="margin-top: 50px;">退货单信息</h3>
        <el-form :model="orderReturnData" :rules="editFormRules" ref="orderReturnData" label-width="160px" style="margin:20px;width:60%;min-width:600px;">
            <el-form-item label="实付金额" prop="returnsPrice">
                <el-input v-model="orderReturnData.returnsPrice" auto-complete="off" disabled></el-input>
            </el-form-item>
            <el-form-item label="退运费" prop="logisticsPriceFlag">
                <el-radio-group v-model="orderReturnData.logisticsPriceFlag">
                    <el-radio class="radio" :label="1">退运费</el-radio>
                    <el-radio class="radio" :label="0">不退运费</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="退款金额" prop="returnsAllPrice">
                <el-input v-model="orderReturnData.returnsAllPrice" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="选择收货点" prop="shopId">
                <el-select v-model="orderReturnData.shopId" placeholder="选择收货点" @change="changValue">
                    <el-option
                            v-for="item in StoreList"
                            :key="item.id"
                            :label="item.storeName"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="收货人姓名" prop="consignerName">
                <el-input v-model="orderReturnData.consignerName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="收货地址" prop="consignerAddress">
                <el-input v-model="orderReturnData.consignerAddress" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="consignerPhone">
                <el-input v-model="orderReturnData.consignerPhone" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="处理备注" prop="remark">
                <el-input v-model="orderReturnData.remark" auto-complete="off"></el-input>
            </el-form-item>
        </el-form>

        <el-col :span="24" class="toolbar" style="padding-bottom: 0.5%;display: flex;justify-content: center">
            <el-button type="success" @click="agreeReturn">同意退货</el-button>
            <el-button type="warning" @click="refuseReturn">拒绝退货</el-button>
        </el-col>

        <!--同意退货界面-->
        <el-dialog title="同意退货" style="width: 70%" :visible.sync="addFormVisible">
            <el-form :model="orderReturnData" label-width="100px" style="margin:20px;width:60%;min-width:600px;">
                <el-form-item label="退款金额">
                    <el-input v-model="orderReturnData.returnsAllPrice" style="width: 50%;" disabled></el-input>
                </el-form-item>
                <el-form-item label="操作备注">
                    <el-input v-model="orderReturnData.remark" style="width: 50%;" disabled></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click.native="agreeSubmit('orderReturnData')">提交</el-button>
                    <el-button @click.native="addFormVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

    </section>
</template>
<script>
    import util from '../../../common/js/util'
    import {searchOrderReturnDetail, getStoreInfoList, getStoreInfoById, agreeOrderReturn, refuseOrderReturn} from '../../../api/api';

    export default {
        data() {
            let checkPrice = (rule, value, callback) => {
                let reg = new RegExp(/^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/);
                if (!reg.test(value)) {
                    callback(new Error('请输入正确的金额'));
                } else if (value > this.orderReturnData.returnsPrice) {
                    callback(new Error('退款金额不能大于实付金额'));
                } else {
                    callback();
                }
            };
            return {
                id:this.$route.query.id,
                orderId:this.$route.query.orderId,
                productData:[],//商品信息
                orderData:[],//退货单信息
                orderReturnData:{
                    returnsPrice: '',
                    logisticsPriceFlag: '',
                    returnsAllPrice: '',
                    shopId: '',
                    shopNo: '',
                    shopName: '',
                    consignerName: '',
                    consignerAddress: '',
                    consignerPhone: '',
                    remark: ''
                },//退货单信息

                StoreList:[],//仓库信息
                totalPrice:'',//合计
                listLoading:false,

                //确认退货弹框
                addFormVisible:false,
                editFormRules: {
                    returnsAllPrice: [
                        {required: true, message: '请输入退款金额', trigger: 'blur'},
                        {validator: checkPrice, trigger: 'blur'}],
                    shopId: [{required: true, message: '请选择收货点', trigger: 'blur'}],
                    consignerName: [{required: true, message: '请输入收货人姓名', trigger: 'blur'},
                        {pattern: '', message: '' },
                        {max: 40, message: '长度不超过40个字符', trigger: 'blur' }],
                    consignerAddress: [{required: true, message: '请输入收货地址', trigger: 'blur'},
                        {pattern: /[\u4e00-\u9fa5]/, message: '收货地址必须包含中文' },
                        {max: 255, message: '长度不超过255个字符', trigger: 'blur' }],
                    consignerPhone: [{required: true, message: '请输入联系电话', trigger: 'blur'},
                        {pattern: /^1[3456789]\d{9}$/, message: '联系电话格式错误' }],
                    remark: [{pattern: /[\u4e00-\u9fa5]/, message: '处理备注必须包含中文' },
                        {max: 255, message: '长度不超过255个字符', trigger: 'blur' }],
                },
            }
        },
        methods: {
            //金额格式化
            formatPrice: function(row, column) {
                var prices = row[column.property];
                if (!prices) {
                    return "";
                }
                return util.moneyFormat(parseFloat(prices).toFixed(2));
            },
            //订单来源类型格式化
            formatSourceType: function (row, column) {
                switch (row[column.property]) {
                    case 1:
                        return '微信小程序';
                        break;
                    case 2:
                        return '微信公众号';
                        break;
                    case 3:
                        return '苹果app';
                        break;
                    case 4:
                        return '安卓app';
                        break;
                    case 5:
                        return '门店';
                        break;
                    case 10:
                        return '京东';
                        break;
                    case 11:
                        return '淘宝';
                        break;
                    default:
                        return '其它';
                }
            },
            //时间格式化
            dateFormat: function(row, column) {
                var dateTime = row[column.property];
                if (!dateTime) {
                    return "";
                }
                return util.formatDate.format(new Date(dateTime), 'yyyy-MM-dd hh:mm:ss');
            },
            //退货单状态格式化
            formatStatus: function (row, column) {
                switch (row[column.property]) {
                    case 10:
                        return '待处理';
                        break;
                    case 20:
                        return '退货中';
                        break;
                    case 30:
                        return '待付款';
                        break;
                    case 40:
                        return '已完成';
                        break;
                    case 50:
                        return '已拒绝';
                        break;
                    default:
                        return '未知状态:';
                }
            },

            searchOrderReturn(){
                var para = {
                    id:this.id,
                    orderId:this.orderId
                };
                this.listLoading = true;
                searchOrderReturnDetail(para).then((res) => {
                    this.listLoading = false;
                    if (this.GLOBAL.isResonseSuccess(res)){
                        var list = res.data;
                        this.orderData = [list.orderReturns];//退货单信息
                        this.orderData[0].orderSourceType = list.orderSelf.orderSourceType;//订单来源
                        this.orderData[0].orderOutId = list.orderSelf.orderOutId;//外部订单编号
                        this.orderReturnData = list.orderReturns;//退货单信息
                        this.productData = list.orderReturnsProducts;//退货订单商品明细信息
                        if (this.orderReturnData.shopId == 0) {
                            this.orderReturnData.shopId = null;
                        }

                        let amounts = 0;
                        let productList = list.orderReturnsProducts;
                        for (var product of productList) {
                            if (product.total) {
                                amounts += product.total;
                            }
                        }
                        this.totalPrice = "合计：" + util.moneyFormat(parseFloat(amounts).toFixed(2));
                    }
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },

            //获取仓库下拉列表
            getStoreInfo(){
                var para = {
                    pageInfo: {
                        pageNum: this.page,
                        pageSize: this.pageSize,
                    },
                };
                this.listLoading = true;
                getStoreInfoList(para).then((data) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(data)){
                            this.StoreList=data.data;
                        }
                    }
                    ,data => { this.listLoading = false;}
                );
            },

            //选择下拉仓库触发事件自动填充收货人信息
            changValue(value){
                var para={id : value};
                getStoreInfoById(para).then((data) => {
                    this.orderReturnData.shopNo = data.data.storeNo;
                    this.orderReturnData.shopName = data.data.storeName;
                    this.orderReturnData.consignerName = data.data.leader;
                    this.orderReturnData.consignerPhone = data.data.phone;
                    this.orderReturnData.consignerAddress = data.data.address;
                });
            },

            //显示确认退货界面
            agreeReturn: function () {
                this.$refs.orderReturnData.validate((valid) => {
                    if (valid) {
                        this.addFormVisible = true;
                    }
                });
            },

            //确认退货表单提交
            agreeSubmit(){
                let para = Object.assign({}, this.orderReturnData);
                agreeOrderReturn(para).then((res) => {
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.$message({
                            message: '操作成功',
                            type: 'success'
                        });
                        this.$router.push({path: '/orderReturns/list'});
                    }
                });
            },

            //显示拒绝退货界面
            refuseReturn: function () {
                this.$confirm('确认拒绝退货？', '提示', {}).then(() => {
                    let para = Object.assign({}, this.orderReturnData);
                    refuseOrderReturn(para).then((res) => {
                        if (this.GLOBAL.isResonseSuccess(res)) {
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            });
                            this.$router.push({path: '/orderReturns/list'});
                        } else {
                            this.open(res.data);
                        }
                    });
                });
            },

            //查看订单详情
            orderDetail(index,row){
                this.$router.push({path: '/orderSelf/queryDetailById?id='+row.orderId+'&orderReturnId='+row.id+'&returnsStatus='+row.returnsStatus+'&orderStatus='+row.orderStatus});
            },

            //返回退货列表
            backOrderReturnList() {
                this.$router.push({path:'/orderReturns/list'});
            }

        },
        mounted() {
            this.searchOrderReturn();
            this.getStoreInfo();//获取仓库下拉列表
        }
    }

</script>

<style>
    #priceStyle{
        text-align: right;
        padding-right: 100px;
        border-radius: 0;
        border-top: 0;
    }
</style>