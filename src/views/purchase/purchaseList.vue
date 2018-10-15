<template>
	<section>

		<!--工具条-->
		<el-col :span="24" class="toolbar" id="toolbar" >
			<div style="text-align:right;">
				<el-button  type="primary" @click="allPurchaseOrder()" >全部({{allOrder}})</el-button>
				<el-button  type="primary" @click="pendingPurchaseOrder()">待处理({{pending}})</el-button>
				<el-button  type="primary" @click="confirmedPurchaseOrder()">已确认({{confirmed}})</el-button>
				<el-button  type="primary" @click="auditedPurchaseOrder()">已审核({{audited}})</el-button>
				<!--<el-button  type="primary" @click="returnedPurchaseOrder()">已退货({{returned}})</el-button>-->
			</div>
		</el-col>

		<div class="toolbar el-col el-col-24" style="margin-top: 20px;text-align:right;">

			<div>
				&nbsp采购单号：<el-input size="medium" v-model="orderId" placeholder="采购单号" style="width:170px;"></el-input>
				&nbsp状态：
				<el-select v-model="orderStatus" clearable style="width:120px;">
					<el-option
							v-for="item in payStatusOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
					</el-option>
				</el-select>
				&nbsp收货方：
				<el-select v-model="acceptStoreId" clearable style="width:120px;">
					<el-option
							v-for="item in acceptStoreOptions"
							:key="item.id"
							:label="item.storeName"
							:value="item.id">
					</el-option>
				</el-select>

				<!--日期控件-->
				&nbsp申请日期：
				<el-date-picker
						v-model="queryTime"
						type="date"
						placeholder="选择日期">
				</el-date-picker>
				&nbsp;&nbsp;
				<!--提交按钮-->
				<el-button type="primary"  v-on:click="searchByCondition" :loading="listLoading" >查询</el-button>
				<el-button v-if="isAuth('mpys:purchaseOrder:save')" type="primary" @click="addFormBtn()">新增</el-button>
			</div>
		</div>

		<el-table
				v-loading="listLoading"
				element-loading-text="拼命加载中"
				:data="orderListData"
				style="width: 100%;margin-top: 30px;">
			<el-table-column
					type="index"
					label="序号"
					show-overflow-tooltip
					width="50">
			</el-table-column>
			<el-table-column
					prop="id"
					label="采购单号"
					show-overflow-tooltip
					width="250">
			</el-table-column>
			<el-table-column
					prop="state"
					label="状态"
					show-overflow-tooltip
					width="132">
			</el-table-column>
			<el-table-column
					prop="createStoreId"
					label="申请方"
					show-overflow-tooltip
					width="135">
			</el-table-column>
			<el-table-column
					prop="payStoreId"
					label="结算对象"
					show-overflow-tooltip
					width="134">
			</el-table-column>
			<el-table-column
					prop="acceptStoreId"
					label="收货方"
					show-overflow-tooltip
					width="110">
			</el-table-column>
			<el-table-column
					prop="priorityLevel"
					label="优先级"
					show-overflow-tooltip
					width="70">
			</el-table-column>
			<el-table-column
					prop="createTime"
					label="申请时间"
					:formatter="dateFormat"
					show-overflow-tooltip
					width="200">
			</el-table-column>
			<el-table-column
					prop="createrId"
					label="申请人"
					show-overflow-tooltip
					width="100">
			</el-table-column>
			<el-table-column
					prop="checkTime"
					label="审核时间"
					:formatter="dateFormat"
					show-overflow-tooltip
					width="200">
			</el-table-column>
			<el-table-column
					prop="checkerId"
					label="审核人"
					show-overflow-tooltip
					width="100">
			</el-table-column>
			<el-table-column
					label="操作"
					show-overflow-tooltip
					width="150"
					fixed="right">
				<template slot-scope="scope">
					<span v-if ="scope.row.state == '待处理'" >
						<el-button @click="handlePend(scope.row)" type="primary"  size="mini">查看</el-button>
						<el-button v-if="isAuth('mpys:purchaseOrder:save')" @click="handleDelete(scope.row)" type="primary"  size="mini">删除</el-button>
					</span>
					<span v-if ="scope.row.state == '已确认'" >
						<el-button @click="handleConfirm(scope.row)" type="primary"  size="mini">查看</el-button>
					</span>
					<span v-if ="scope.row.state == '已审核'" >
						<el-button @click="handleReturn(scope.row)"  type="primary"  size="mini">查看</el-button>
						<!--<el-button @click="handleReturn(scope.row)" type="text" size="small">申请退回</el-button>-->
					</span>
				</template>
			</el-table-column>
		</el-table>
		<!--订单列表分页-->
		<el-col :span="24" style="margin-top: 10px">
			<el-pagination
					background
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:current-page="pageNum"
					:page-sizes="[10, 20, 30, 40]"
					:page-size="pageSize"
					layout="total, sizes, prev, pager, next, jumper"
					:total=total style="float: right">
			</el-pagination>
		</el-col>

		<!--新增弹出窗-->
		<el-dialog width="80%" title="新增" v-model="addFormVisible" :visible.sync="addFormVisible">
			<h3 style="margin-top: 10px;">基本信息</h3>
			<!--订单基本信息表格-->
			<el-table
					v-loading="listLoading"
					element-loading-text="拼命加载中"
					:data="orderTableData"
					style="width: 100%;margin-top: 5px;">
				<el-table-column
						prop="createStoreId"
						label="申请方"
						width="180">
					<template slot-scope="scope">
						<el-select v-model="orderTableData[0].createStoreId" placeholder="请选择">
							<el-option
									v-for="item in StoreList1"
									:key="item.id"
									:label="item.storeName"
									:value="item.id">
							</el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column
						prop="priorityLevel"
						label="优先级"
						width="180">
					<template slot-scope="scope">
						<el-select v-model="orderTableData[0].priorityLevel" placeholder="请选择">
							<el-option
									v-for="item in priorityLevels"
									:key="item.value"
									:label="item.label"
									:value="item.value">
							</el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column
						prop="acceptStoreId"
						label="收货方"
						width="180">
					<template slot-scope="scope">
						<el-select @change="changValue" v-model="orderTableData[0].acceptStoreId" placeholder="请选择" filterable>
							<el-option
									v-for="item in StoreList2"
									:key="item.id"
									:label="item.storeName"
									:value="item.id">
							</el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column
						prop="payStoreId"
						label="结算对象"
						width="180">
					<template slot-scope="scope">
						<el-select v-model="orderTableData[0].payStoreId" placeholder="请选择">
							<el-option
									v-for="item in StoreList3"
									:key="item.id"
									:label="item.storeName"
									:value="item.id">
							</el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column
						prop="accepter"
						label="收件人"
						width="182">
				</el-table-column>
				<el-table-column
						prop="accepterPhone"
						label="收件电话"
						width="170">
				</el-table-column>
				<el-table-column
						prop="accepterAddress"
						label="地址"
						width="410">
				</el-table-column>
			</el-table>

			<!--详细商品添加表格-->
			<h3 style="margin-top: 50px;">商品信息</h3>
			<el-button type="primary"  @click="selectGoodsBtn()" :loading="listLoading" >选择商品</el-button>
			<el-table
					v-loading="listLoading"
					element-loading-text="拼命加载中"
					:data="goodsDetailList"
					:summary-method="getSummaries"
					show-summary
					sum-text="商品数量"
					style="width: 100%;margin-top: 5px;">
				<el-table-column
						prop="goodsId"
						label="商品编号"
						width="200">
				</el-table-column>
				<el-table-column
						prop="goodsName"
						label="商品名称"
						width="170">
				</el-table-column>
				<el-table-column
						prop="attr"
						label="属性"
						width="300">
				</el-table-column>
				<el-table-column
						prop="model"
						label="型号"
						width="170">
				</el-table-column>
				<el-table-column
						prop="quality"
						label="品质"
						width="170">
					<template slot-scope="scope">
						<el-select style="width: 100px" v-model="scope.row.quality" placeholder="请选择">
							<el-option
									v-for="item in qualityList"
									:key="item.qualityName"
									:label="item.qualityName"
									:value="item.qualityName">
							</el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column
						prop="supplierId"
						label="供应商"
						width="170">
					<template slot-scope="scope">
						<el-input
								placeholder="请输入内容"
								v-model="scope.row.supplierId"
								:disabled="true">
						</el-input>
					</template>
				</el-table-column>
				<el-table-column
						prop="number"
						label="采购数量"
						width="170">
					<template slot-scope="scope">
						<el-input
								type="number"
								placeholder="请输入内容"
								v-model="scope.row.number"
						>
						</el-input>
					</template>
				</el-table-column>
				<el-table-column
						align="center"
						label="操作">
					<template slot-scope="scope">
						<el-button @click.native.prevent="deleteRow(scope.$index, goodsDetailList)" type="text">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div style="text-align: right;margin-bottom: 25px;margin-top: 30px;">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addFormSubmit()" >提交</el-button>
			</div>
		</el-dialog>

		<!--选择商品弹出窗-->
		<el-dialog title="选择商品" v-model="selectFormVisible" :visible.sync="selectFormVisible" >
			<div class="toolbar el-col el-col-24" style="text-align: right;">
				<el-select clearable v-model="type" placeholder="请选择搜索类别" style="width:120px;">
					<el-option label="商品编码" value=0></el-option>
					<el-option label="商品名称" value=1></el-option>
				</el-select>
				&nbsp;
				<el-input v-model="queryName" placeholder="请输入名称" style="width:170px;"></el-input>
				&nbsp;
				&nbsp;
				<el-button type="primary" v-on:click="getProductListByCondition()" :loading="listLoading1" >搜索</el-button>
			</div>

			<el-table
					v-loading="listLoading"
					element-loading-text="拼命加载中"
					:data="addgoodList"
					border
					style="width: 100%;margin-top: 5px;"
					@row-dblclick="selectGoodEvent">
				<el-table-column
						prop="goodsId"
						label="商品编码"
						width="200">
				</el-table-column>
				<el-table-column
						prop="goodsName"
						label="商品名称"
						width="170">
				</el-table-column>
				<el-table-column
						prop="brand"
						label="品牌"
						width="170">
				</el-table-column>
				<el-table-column
						prop="attr"
						label="属性"
						width="200">
				</el-table-column>
				<el-table-column
						prop="model"
						label="型号"
						width="170">
				</el-table-column>
			</el-table>

			<!--选择商品列表分页-->
			<div class="block" style="text-align:right;">
				<el-pagination
						background
						@size-change="handleSizeChange1"
						@current-change="handleCurrentChange1"
						:current-page="page1"
						:page-sizes="[8, 16, 24, 32]"
						:page-size="pageSize1"
						layout="total, sizes, prev, pager, next, jumper"
						:total="total1">
				</el-pagination>
			</div>

			<!--选择商品列表分页-->
			<!--<div class="block" style="text-align:right;">
				<el-pagination @current-change="handleCurrentChange1"
							   :page-size="pageSize1"
							   layout="prev, pager, next"
							   :total="total1">
				</el-pagination>
			</div>-->

		</el-dialog>


	</section>
</template>

<script>
    import util from '../../common/js/util'
    import {getStoreInfoList,addPurchaseOrder,getpurchaseOrderList,getStoreInfoById,getSelectGoodsList,deleteOrderData,getQualityList,purchaseOrderCountFun} from '../../api/api';
    export default {
        data() {
            return {
                storeId:"",//仓库id
                accepter:"",//收件人

                //订单列表分页
                //pageSize:this.GLOBAL.CONSTANT_DATA.PAGESIZE,
                pageSize:10,
                page: 1,
                total:0,
                pageNum: 1, //当前页码
                listLoading: false,
                pageNum1: 1, //当前页码

                StoreList1:[],//申请仓库数据集合
                StoreList2:[],//收货仓库数据集合
                StoreList3:[],//结算仓库数据集合
                qualityList:[],//品质数据集合
                createStoreId:"",//申请仓库
                payStoreId:"",//结算仓库
                priorityLevel:"",//优先级
                accepterId:"",//收件人id
                accepterPhone:"",//收件电话
                accepterAddress:"",//收件地址
                storeName:"",//仓库名字

                addFormVisible : false,
                selectFormVisible : false,
                //查询条件参数
                orderId:"",//订单id
                orderStatus:'',//订单状态
                acceptStoreId:'',//收货方
                queryTime: "",//搜索日期
                type:"",//搜索类型
                //状态数据集合
                payStatusOptions: [
                    {
                        value: 0,
                        label: '待处理'
                    },{
                        value: 1,
                        label: '已确认'
                    },
                    {
                        value: 2,
                        label: '已审核'
                    }
                ],
                //收货方
                acceptStoreOptions: [],//仓库列表数据
                orderListData: [],//订单主信息列表数据
                addgoodList: [],//选择商品列表数据
                orderTableData:[
                    {
                        createStoreId: '',
                        acceptStoreId: '',
                        priorityLevel: '',
                        payStoreId: '',
                        accepter: '',
                        accepterPhone: '',
                        accepterAddress: ''
                    }
                ],
                goodsDetailList:[],//订单商品详细信息数据
                //优先级列表
                priorityLevels: [{
                    value: '0',
                    label: '低'
                },{
                    value: '1',
                    label: '中'
                },
                    {
                        value: '2',
                        label: '高'
                    }
                ],
                id:"",//订单id
                state:"",//订单状态
                createTime:"",//订单申请时间
                supplierId:"",//供应商
                queryName:"",//搜索名
                //选择商品列表分页参数
                total1:0,
                page1: 1,
                pageSize1:8,
                listLoading1: false,

                goodsId:"",//商品id
                goodsName:"",//商品名字
                brand:"",//商品品牌
                attr:"",//商品属性
                model:"",//商品型号
                quality:"",//商品品质
                //订单状态统计
                allOrder:0,
                pending:0,
                confirmed:0,
                audited:0,
                returned:0,
            }
        },
        methods: {

            //获取采购订单统计
            purchaseOrderCount(){
                this.listLoading = true;
                purchaseOrderCountFun().then((data) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(data)){
                            var list = data.data;
                            this.allOrder = list.allOrder;
                            if(list.pending == null){
                                this.pending = 0 ;
                            }else{
                                this.pending = list.pending;
                            }
                            if(list.confirmed == null){
                                this.confirmed = 0 ;
                            }else{
                                this.confirmed = list.confirmed;
                            }
                            if(list.audited == null){
                                this.audited = 0 ;
                            }else{
                                this.audited = list.audited;
                            }
                            if(list.returned == null){
                                this.returned = 0 ;
                            }else{
                                this.returned = list.returned;
                            }
                        }
                    }
                    ,data => { this.listLoading = false;}
                );
            },

            //分页显示所有订单数据列表
            purchaseOrderList(){
                var para = {
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    },
                    id: this.orderId,
                    state: this.orderStatus,
                    acceptStoreId: this.acceptStoreId,
                    createTime:util.dateFormat("yyyy-MM-dd",new Date(this.queryTime)),
                };
                if(this.queryTime == ""  ||this.queryTime == null){
                    delete para.createTime;
                }

                this.listLoading = true;
                getpurchaseOrderList(para).then((data) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(data)){
                            this.total = data.data.paginationInfo.total;
                            this.orderListData=data.data.list;
                            var d = data.data.list;
                            for(var i=0;i<d.length;i++){
                                if (d[i].priorityLevel == 2 ){
                                    d[i].priorityLevel = "高";
                                }else if(d[i].priorityLevel == 1){
                                    d[i].priorityLevel = "中";
                                }else if (d[i].priorityLevel == 0){
                                    d[i].priorityLevel = "低";
                                }else{
                                    d[i].priorityLevel = "";
                                }
                                if(d[i].checkerId != null){
                                    d[i].checkerId = d[i].checkerName;
                                }
                                d[i].createrId = d[i].createrName;
                                d[i].createStoreId = d[i].createStoreName;
                                d[i].acceptStoreId = d[i].acceptStoreName;
                                d[i].payStoreId = d[i].payStoreName;
                                if(d[i].state == 0 ){
                                    d[i].state = "待处理";
                                }else if(d[i].state == 1 ){
                                    d[i].state = "已确认";
                                }else if(d[i].state == 2 ){
                                    d[i].state = "已审核";
                                }else {
                                    d[i].state = "已退货";
                                }
                            }
                        }
                    }
                    , data => {
                        this.listLoading = false;
                    }
                );
            },

            //条件查询分页bug优化
            searchByCondition(){
                this.pageNum=1;
                this.purchaseOrderList();
            },

            //二次查询,所有订单
            allPurchaseOrder(){
                this.pageNum=1;
                this.orderStatus = "";
                this.orderId="";
                this.orderOutId="";
                this.createTime="";
                this.purchaseOrderList();
            },
            //二次查询,待处理订单
            pendingPurchaseOrder(){
                this.pageNum=1;
                this.orderStatus = 0;
                this.orderId="";
                this.orderOutId="";
                this.createTime="";
                this.purchaseOrderList();
            },
            //二次查询,已确认订单
            confirmedPurchaseOrder(){
                this.pageNum=1;
                this.orderStatus = 1;
                this.orderId="";
                this.orderOutId="";
                this.createTime="";
                this.purchaseOrderList();
            },
            //二次查询,已审核订单
            auditedPurchaseOrder(){
                this.pageNum=1;
                this.orderStatus = 2;
                this.orderId="";
                this.orderOutId="";
                this.createTime="";
                this.purchaseOrderList();
            },
            //二次查询,已退货订单
            /*returnedPurchaseOrder(){
                this.pageNum=1;
                this.orderStatus = 3;
                this.orderId="";
                this.orderOutId="";
                this.createTime="";
                this.purchaseOrderList();
            },*/

            //删除按钮，点击删除商品
            deleteRow(index, rows) {
                rows[index].quality = "";
                rows[index].number = "";
                rows.splice(index, 1);
            },
            //添加按钮,打开新增框
            addFormBtn() {
                this.selectGoodsList();
                this.qualityListInfo();
                this.addFormVisible = true;
                this.type = "",
                    this.queryName = "",
                    this.goodsDetailList = [];
                this.orderTableData = [
                    {
                        createStoreId: '',
                        acceptStoreId: '',
                        priorityLevel: '',
                        payStoreId: '',
                        accepter: '',
                        accepterPhone: '',
                        accepterAddress: ''
                    }
                ];
            },

            //获取仓库下拉数据列表
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
                            this.StoreList1=data.data;
                            this.StoreList2=data.data;
                            this.StoreList3=data.data;
                            this.acceptStoreOptions=data.data;
                        }
                    }
                    ,data => { this.listLoading = false;}
                );
            },
            //选择下拉收货仓库触发事件自动填充收货人信息
            changValue(value){
                var para={id : value};
                getStoreInfoById(para).then((data) => {
                    this.orderTableData[0].accepter = data.data.leader;
                    this.orderTableData[0].accepterPhone = data.data.telephone;
                    this.orderTableData[0].accepterAddress = data.data.address;
                });
            },

            //双击行商品数据填充到编辑商品表格
            selectGoodEvent(row){
                this.selectFormVisible = false;
                console.log(row.skuCode);
                var d = this.goodsDetailList;
                for(var i=0;i<d.length;i++){
                    if (d[i].goodsId == row.wikiCode){
                        this.$message({
                            message: '该商品已存在添加列表',
                            type: 'warn'
                        });
                        return ;
                    }
                }
                this.goodsDetailList.push(row);
            },
            //数据表单提交
            addFormSubmit(){
                let para ={
                    purchaseAddDto: this.orderTableData[0],
                    purchaseGoodsDetails:this.goodsDetailList,
                };
                if (this.orderTableData[0].createStoreId== "" && this.orderTableData[0].acceptStoreId== "" && this.orderTableData[0].priorityLevel== ""
                    && this.orderTableData[0].payStoreId== ""){
                    this.$message({
                        message: '基本信息不能为空',
                        type: 'error'
                    });
                    return;
                }
                if (this.goodsDetailList.length == 0){
                    this.$message({
                        message: '商品信息不能为空',
                        type: 'error'
                    });
                    return;
                }
                var d = this.goodsDetailList;
                for(var i=0;i<d.length;i++) {
                    if (d[i].number % 1 !=0) {
                        this.$message({
                            message: '采购数量应该为整数',
                            type: 'error'
                        });
                        return;
                    }
                }
                console.log(para);
                addPurchaseOrder(para).then((data) => {
                    if (this.GLOBAL.isResonseSuccess(data)) {
                        this.addFormVisible = false;
                        this.$message({
                            message: '新增成功',
                            type: 'success'
                        });
                        this.purchaseOrderList();
                        this.purchaseOrderCount();
                    } else {
                        this.open(data.data);
                    }
                });
            },
            //点击查看按钮,跳转到编辑界面
            handlePend(row){
                this.$router.push({path: '/purchasePend?id='+row.id});
            },
            handleConfirm(row){
                this.$router.push({path: '/purchaseConfirm?id='+row.id});
            },
            handleReturn(row){
                this.$router.push({path: '/purchaseCheck?id='+row.id});
            },
            //点击删除按钮
            handleDelete(row){
                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var para={id:row.id};
                    deleteOrderData(para).then((data) => {
                        if (this.GLOBAL.isResonseSuccess(data)) {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.purchaseOrderList();
                            this.purchaseOrderCount();
                        }else {
                            alert("删除失败");
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '删除已取消!'
                    });
                });
            },

            //选择商品按钮,打开选择商品框
            selectGoodsBtn() {
                this.type = "",
                this.queryName = "",
                this.page1 = 1,
                this.pageNum1 = 1,
                this.selectGoodsList();
                this.selectFormVisible = true;
            },
            //条件查询分页bug优化
            getProductListByCondition(){
                this.page1=1;
                this.selectGoodsList();
            },
            //获得选择商品列表集合数据
            selectGoodsList() {
                var queryTypeId = this.type;//查询的类别
                if(queryTypeId == 0){
                    var para = {
                        pageInfo:{
                            pageNum:this.page1,
                            pageSize:this.pageSize1,
                        },
                        wikiCode:this.queryName,//输入的搜索词
                    };
                }else if (queryTypeId == 1){
                    var para = {
                        pageInfo:{
                            pageNum:this.page1,
                            pageSize:this.pageSize1,
                        },
                        spuName:this.queryName,//输入的搜索词
                    };
                }else {
                    var para = {
                        pageInfo:{
                            pageNum:this.page1,
                            pageSize:this.pageSize1,
                        },
                    };
                }
                this.listLoading = true;
                getSelectGoodsList(para).then((data) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(data)){
                            this.addgoodList=data.data.list;
                            this.total1 = data.data.paginationInfo.total;
                            var d = data.data.list;
                            for(var i=0;i<d.length;i++){
                                d[i].goodsId = d[i].wikiCode;
                                d[i].goodsName=d[i].spuName;
                                d[i].brand=d[i].spuBrand;
                                d[i].attr=d[i].wikiAttrsValue;
                                d[i].model=d[i].spuModel;
                            }
                        }
                    }
                );
            },
            //获取商品品质下拉列表
            qualityListInfo(){
                this.listLoading = true;
                getQualityList().then((data) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(data)){
                            this.qualityList=data.data;
                        }
                    }
                );
            },

            //表格合计方法
            getSummaries(param) {
                const { columns, data } = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '商品数量';
                        return;
                    }
                    const values = data.map(item => Number(item[column.property]));
                    if (column.property=="number") {
                        sums[index] = values.reduce((prev, curr) => {
                            const value = Number(curr);
                            if (!isNaN(value)) {
                                return prev + curr;
                            } else {
                                return prev;
                            }
                        }, 0);
                        sums[index] += '';
                    } else {
                        sums[index] = ' ';
                    }
                });
                return sums;
            },

            //<!--订单列表分页-->
            handleCurrentChange(val) {
                this.pageNum = val;
                this.purchaseOrderList();
            },
            //处理分页条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.purchaseOrderList();
            },
            //处理分页条数
            handleSizeChange1(val) {
                this.pageSize1 = val;
                this.selectGoodsList();
            },

            //选择商品列表分页查询
            handleCurrentChange1(page1) {
                this.page1 = page1;
                this.selectGoodsList();
            },
            //当前时间格式化
            dateFormat:function(row, column) {
                var dateTime = row[column.property];
                if (!dateTime) {
                    return "";
                }
                return util.formatDate.format(new Date(dateTime), 'yyyy-MM-dd hh:mm:ss');
            },


        },
        mounted() {
            //获取订单列表
            this.purchaseOrderList();
            this.purchaseOrderCount();
            this.getStoreInfo();
        }
    }
</script>
<style scoped>
	#toolbar{
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}
</style>