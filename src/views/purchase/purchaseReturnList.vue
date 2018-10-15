<template>
	<section>

		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<div style="text-align:right;">
				<el-button  type="primary" @click="allPurchaseOrder()" >全部({{allOrder}})</el-button>
				<el-button  type="primary" @click="pendingPurchaseOrder()">待处理({{pending}})</el-button>
				<el-button  type="primary" @click="returningPurchaseOrder()">退回中({{returning}})</el-button>
				<el-button  type="primary" @click="retreatedPurchaseOrder()">已退回({{retreated}})</el-button>
				<el-button  type="primary" @click="canceledPurchaseOrder()">已取消({{canceled}})</el-button>
			</div>
		</el-col>

		<div class="toolbar el-col el-col-24" style="margin-top: 20px;text-align:right;">
			&nbsp采购订单号：<el-input size="medium" v-model="queryOrderId" placeholder="" style="width:170px;"></el-input>
			&nbsp退货单号：<el-input size="medium" v-model="queryReturnOrderId" placeholder="" style="width:170px;"></el-input>
			<!--&nbsp供应商：<el-input size="medium" v-model="querySupplier" placeholder="" style="width:170px;"></el-input>-->

			&nbsp;&nbsp;
			<!--提交按钮-->
			<el-button type="primary" plain v-on:click="purchaseReturnOrderList()" :loading="listLoading" icon="el-icon-search">查询</el-button>
		</div>

		<el-table
				v-loading="listLoading"
				element-loading-text="拼命加载中"
				:data="orderReturnListData"
				border
				style="width: 100%;margin-top: 30px;">
			<el-table-column
					prop="id"
					label="退货单号"
					width="210">
			</el-table-column>
			<el-table-column
					prop="purchaseOrderId"
					label="采购订单号"
					width="210">
			</el-table-column>
			<el-table-column
					prop="state"
					label="状态">
			</el-table-column>
			<!--<el-table-column
					prop="supplier"
					label="供应商名称"
					width="134">
			</el-table-column>
			<el-table-column
					prop="linkman"
					label="联系人"
					width="310">
			</el-table-column>
			<el-table-column
					prop="mobile"
					label="电话"
					width="132">
			</el-table-column>
			<el-table-column
					prop="phone"
					label="手机号"
					width="132">
			</el-table-column>-->
			<el-table-column
					prop="logisticsCompanyId"
					label="物流公司"
					width="200">
			</el-table-column>
			<el-table-column
					prop="logisticsNumber"
					label="物流单号"
					width="200">
			</el-table-column>
			<el-table-column
					prop="returnTime"
					label="退回时间"
					width="200">
			</el-table-column>
			<el-table-column
					label="操作"
					width="200"
					fixed="right">
				<template slot-scope="scope">
					<el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
					<el-button type="text" size="small">编辑</el-button>
				</template>
			</el-table-column>
		</el-table>
	</section>
</template>

<script>
    import {purchaseReturnOrderListFun,purchaseReturnOrderCountFun} from '../../api/api';

    export default {
        methods: {

            //获取采购订单统计
            purchaseReturnOrderCount(){
                this.listLoading = true;
                purchaseReturnOrderCountFun().then((data) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(data)){
                            var list = data.data;
                            this.allOrder = list.allOrder;
                            this.pending = list.pending;
                            this.returning = list.returning;
                            this.retreated = list.retreated;
                            this.canceled = list.canceled;

                        }
                    }
                    ,data => { this.listLoading = false;}
                );
            },
            //获取采购退回订单列表
            purchaseReturnOrderList() {
                var para = {
                    pageInfo: {
                        pageNum: this.page,
                        pageSize: this.pageSize,
                    },
                    queryOrderId: this.queryOrderId,
                    queryReturnOrderId: this.queryReturnOrderId,
                };

                this.listLoading = true;
                purchaseReturnOrderListFun(para).then((data) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(data)){
                            this.total = data.data.paginationInfo.total;
                            this.orderReturnListData=data.data.list;
                            var d = data.data.list;
                            for(var i=0;i<d.length;i++){
                                if(d[i].state == 0 ){
                                    d[i].state = "待处理";
                                }else if(d[i].state == 1 ){
                                    d[i].state = "退回中";
                                }else if(d[i].state == 2 ){
                                    d[i].state = "已退回";
                                }else if(d[i].state == 3 ){
                                    d[i].state = "已取消";
                                }else {
                                    d[i].state = "";
								}
                            }
                        }
                    }
                    , data => {
                        this.listLoading = false;
                    }
                );
            },

            //二次查询,所有订单
            allPurchaseOrder(){
                this.pageNum=1;
                this.orderStatus = "";
                this.orderId="";
                this.orderOutId="";
                this.createTime="";
                this.purchaseReturnOrderList();
            },
            //二次查询,待处理订单
            pendingPurchaseOrder(){
                this.pageNum=1;
                this.orderStatus = 0;
                this.orderId="";
                this.orderOutId="";
                this.createTime="";
                this.purchaseReturnOrderList();
            },
            //二次查询,退回中订单
            returningPurchaseOrder(){
                this.pageNum=1;
                this.orderStatus = 1;
                this.orderId="";
                this.orderOutId="";
                this.createTime="";
                this.purchaseReturnOrderList();
            },
            //二次查询,已退回订单
            retreatedPurchaseOrder(){
                this.pageNum=1;
                this.orderStatus = 2;
                this.orderId="";
                this.orderOutId="";
                this.createTime="";
                this.purchaseReturnOrderList();
            },
            //二次查询,已取消订单
            canceledPurchaseOrder(){
                this.pageNum=1;
                this.orderStatus = 3;
                this.orderId="";
                this.orderOutId="";
                this.createTime="";
                this.purchaseReturnOrderList();
            },

        },

        data() {
            return {
                queryOrderId:'',//采购订单号
                queryReturnOrderId:'',//退货采购订单号
                querySupplier: "",
				//列表数据
				id:"",
				orderId:"",
                state:"",
                supplier:"",
                linkman:"",
                mobile:"",
                phone:"",
                logisticsCompanyId:"",
                logisticsNumber:"",
                returnTime:"",

                orderReturnListData:[],
                listLoading: false,
            }
        },
        mounted() {
            this.purchaseReturnOrderList();
            this.purchaseReturnOrderCount();
        }
    }
</script>