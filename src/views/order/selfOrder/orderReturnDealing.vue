<template>
    <section>
        <!--工具条-->
        <div  class="toolbar" style="padding-bottom: 0px;justify-content: space-between;">
            <span>自营订单->退货详情-><span class="order-status">退货中</span></span>
            <div style="text-align:right;">
                <span align="right">
                    <el-button type="primary" @click="backOrderReturnList">返回</el-button>
                </span>
            </div>
        </div>

        <h3 style="margin-top: 50px;">退货商品</h3>
        <el-table :data="productData" style="width: 100%" stripe border  aria-label="商品信息">
            <el-table-column prop="id" label="商品编号" show-overflow-tooltip></el-table-column>
            <!--<el-table-column prop="orderSourceType" label="商品图片"></el-table-column>-->
            <el-table-column prop="spuName" label="商品名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="price" label="价格" sortable :formatter="formatPrice"></el-table-column>
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
        <el-form :model="orderReturnData" ref="orderReturnData" label-width="160px" style="margin:20px;width:60%;min-width:600px;">
            <el-form-item label="实付金额" prop="returnsPrice">
                <el-input v-model="orderReturnData.returnsPrice" auto-complete="off" disabled></el-input>
            </el-form-item>
            <el-form-item label="退运费" prop="logisticsPriceFlag">
                <el-input v-model="orderReturnData.logisticsPriceFlag" auto-complete="off" disabled></el-input>
            </el-form-item>
            <el-form-item label="退款金额" prop="returnsAllPrice">
                <el-input v-model="orderReturnData.returnsAllPrice" auto-complete="off" disabled></el-input>
            </el-form-item>
            <el-form-item label="收货点" prop="shopName">
                <el-input v-model="orderReturnData.shopName" auto-complete="off" disabled></el-input>
            </el-form-item>
            <el-form-item label="收货人姓名" prop="consignerName">
                <el-input v-model="orderReturnData.consignerName" auto-complete="off" disabled></el-input>
            </el-form-item>
            <el-form-item label="收货地址" prop="consignerAddress">
                <el-input v-model="orderReturnData.consignerAddress" auto-complete="off" disabled></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="consignerPhone">
                <el-input v-model="orderReturnData.consignerPhone" auto-complete="off" disabled></el-input>
            </el-form-item>
            <el-form-item label="处理备注" prop="remark">
                <el-input v-model="orderReturnData.remark" auto-complete="off" disabled></el-input>
            </el-form-item>
        </el-form>

        <h3 style="margin-top: 50px;">操作信息</h3>
        <el-table :data="logData" style="width: 100%" stripe border  aria-label="订单信息">
            <el-table-column prop="operator" label="处理人" show-overflow-tooltip></el-table-column>
            <el-table-column prop="operationContent" label="操作信息" show-overflow-tooltip></el-table-column>
            <el-table-column prop="updateTime" label="处理时间" show-overflow-tooltip sortable :formatter="dateFormat"></el-table-column>
            <el-table-column prop="remark" label="处理备注" show-overflow-tooltip></el-table-column>
        </el-table>

        <h3 style="margin-top: 50px;">退货单信息</h3>
        <el-form :model="operatorData" ref="operatorData" :rules="operatorDataRules" label-width="160px" style="margin:20px;width:60%;min-width:600px;">
            <el-form-item label="备注" prop="remarks">
                <el-input v-model="operatorData.remarks" auto-complete="off"></el-input>
            </el-form-item>
        </el-form>

        <el-col :span="24" class="toolbar" style="padding-bottom: 0.5%;display: flex;justify-content: center">
            <el-button type="success" @click="confirmReturn">确认收货</el-button>
            <!--<el-button type="warning" @click="refusePay">拒绝退款</el-button>-->
        </el-col>

    </section>
</template>
<script>
    import util from '../../../common/js/util'
    import {searchOrderReturnDeal, confirmOrderReturn} from '../../../api/api';

    export default {
        data() {
            return {
                id:this.$route.query.id,
                orderId:this.$route.query.orderId,
                productData:[],//商品信息
                orderData:[],//退货单信息
                orderReturnData:{
                    returnsPrice: '',
                    logisticsPriceFlag: '',
                    returnsAllPrice: '',
                    shopName: '',
                    consignerName: '',
                    consignerAddress: '',
                    consignerPhone: '',
                    remark: '',
                    remarks: ''
                },//退货单信息
                logData:[],//操作信息
                operatorData:{
                    remarks: ''
                },//处理备注

                totalPrice:'',//合计
                listLoading:false,

                operatorDataRules: {
                    remarks: [{pattern: /[\u4e00-\u9fa5]/, message: '备注必须包含中文' },
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
                        return '京东';
                        break;
                    case 2:
                        return '淘宝';
                        break;
                    case 3:
                        return '门店';
                        break;
                    default:
                        return '其它:';
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
                searchOrderReturnDeal(para).then((res) => {
                    this.listLoading = false;
                    if (this.GLOBAL.isResonseSuccess(res)){
                        var list = res.data;
                        this.orderData = [list.orderReturns];//退货单信息
                        this.orderData[0].orderSourceType = list.orderSelf.orderSourceType;//订单来源
                        this.orderData[0].orderOutId = list.orderSelf.orderOutId;//外部订单编号
                        this.orderReturnData = list.orderReturns;//退货单信息
                        this.productData = list.orderReturnsProducts;//退货订单商品明细信息
                        this.logData = list.orderOperatorInformations;//日志操作信息

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

            //确认收货提交
            confirmReturn(){
                this.orderReturnData.remarks = this.operatorData.remarks;
                let para = Object.assign({}, this.orderReturnData);
                this.$refs.operatorData.validate((valid) => {
                    if (valid) {
                        confirmOrderReturn(para).then((res) => {
                            if (this.GLOBAL.isResonseSuccess(res)) {
                                this.$message({
                                    message: '操作成功',
                                    type: 'success'
                                });
                                this.$router.push({path: '/orderReturns/list'});
                            }
                        });
                    }
                });
            },

            //显示拒绝退款界面
            refusePay: function () {
                this.$confirm('确认拒绝退款？', '提示', {}).then(() => {
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