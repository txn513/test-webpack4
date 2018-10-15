<template>
    <section>
        <div class="toolbar el-col el-col-24" style="margin-top: 20px;text-align:right;">
            <div>当前状态：<span class="order-status">待处理</span></div>
            <!--提交按钮-->
            <div>
                <el-button type="primary" v-if="isAuth('mpys:purchaseOrder:save')" v-on:click="printPurchaseOrder()" :loading="listLoading" >打印采购单</el-button>
                <el-button type="primary" v-if="isAuth('mpys:purchaseOrder:save')" v-on:click="save()" :loading="listLoading" >保存</el-button>
                <el-button type="primary" v-if="isAuth('mpys:purchaseOrder:confirm')" v-on:click="submit()" :loading="listLoading" >提交</el-button>
            </div>

        </div>

        <h3 style="margin-top: 50px;">基本信息</h3>
        <el-table
                v-loading="listLoading"
                element-loading-text="拼命加载中"
                :data="orderTableData"
                style="width: 100%;margin-top: 5px;">
            <el-table-column
                    prop="id"
                    label="采购单号"
                    width="215">
            </el-table-column>
            <el-table-column
                    prop="orderTableData[0].createStoreId"
                    label="申请方">
                <template slot-scope="scope">
                    <el-select v-model="createStoreId" placeholder="请选择">
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
                    label="优先级">
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
                    @change="changValue">
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
                    label="结算对象">
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
                    label="收件人">
            </el-table-column>
            <el-table-column
                    prop="accepterPhone"
                    label="收件电话">
            </el-table-column>
            <el-table-column
                    prop="accepterAddress"
                    label="地址">
            </el-table-column>
        </el-table>
        <!--商品信息表格-->
        <h3 style="margin-top: 50px;">商品信息</h3>
        <el-button type="primary" v-if="isAuth('mpys:purchaseOrder:save')" @click="selectGoodsBtn()" :loading="listLoading" >选择商品</el-button>
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
                    label="商品编号">
            </el-table-column>
            <el-table-column
                    prop="goodsName"
                    label="商品名称">
            </el-table-column>
            <el-table-column
                    prop="attr"
                    label="属性">
            </el-table-column>
            <el-table-column
                    prop="model"
                    label="型号">
            </el-table-column>
            <el-table-column
                    prop="quality"
                    label="品质">
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
                    label="供应商">
                <template slot-scope="scope">
                    <el-autocomplete
                            disabled
                            v-model="scope.row.supplierName"
                            :fetch-suggestions="querySearch"
                            :value="scope.row.supplierName"
                            placeholder=""
                            @select="handleSelect(scope.row,$event)"
                    ></el-autocomplete>
                </template>
            </el-table-column>
            <el-table-column
                    prop="number"
                    label="采购数量">
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
                    sortable
                    align="center"
                    fixed="right"
                    label="操作">
                <template slot-scope="scope">
                    <span v-if="scope.row.id !=null">
                        <el-button v-if="isAuth('mpys:purchaseOrder:save')" @click="handleDelete(scope.row)" type="text">删除</el-button>
                    </span>
                    <span v-else>
                        <el-button @click="deleteRow(scope.$index, goodsDetailList)" type="text">删除</el-button>
                    </span>
                </template>
            </el-table-column>
        </el-table>

        <!--选择商品弹出窗-->
        <el-dialog title="选择商品" v-model="selectFormVisible" :visible.sync="selectFormVisible" >
            <div class="toolbar1 el-col el-col-24" style="text-align: right;margin-bottom: 25px;">
                <el-select v-model="type" placeholder="请选择状态" style="width:120px;">
                    <el-option label="商品编码" value="0"></el-option>
                    <el-option label="商品名称" value="1"></el-option>
                </el-select>
                &nbsp;
                <el-input v-model="queryName" placeholder="请输入名称" style="width:170px;"></el-input>
                &nbsp;
                &nbsp;
                <el-button type="primary" plain v-on:click="getProductListByCondition()" :loading="listLoading1" icon="el-icon-search">搜索</el-button>
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
                        label="商品编码">
                </el-table-column>
                <el-table-column
                        prop="goodsName"
                        label="商品名称">
                </el-table-column>
                <el-table-column
                        prop="brand"
                        label="品牌">
                </el-table-column>
                <el-table-column
                        prop="attr"
                        label="属性">
                </el-table-column>
                <el-table-column
                        prop="model"
                        label="型号">
                </el-table-column>
            </el-table>

            <!--选择商品列表分页-->
            <div class="block" style="text-align:right;">
                <el-pagination
                        background
                        @size-change="handleSizeChange1"
                        @current-change="handleCurrentChange1"
                        :current-page="pageNum"
                        :page-sizes="[8, 16, 24, 32]"
                        :page-size="pageSize1"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total=total1>
                </el-pagination>
            </div>

        </el-dialog>

        <!--操作信息-->
        <h3 style="margin-top: 50px;">操作信息</h3>
        <el-table
                v-loading="listLoading"
                element-loading-text="拼命加载中"
                :data="operatInfoList"
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
                    label="状态">
            </el-table-column>
            <el-table-column
                    prop="remark"
                    label="备注">
            </el-table-column>
        </el-table>
    </section>
</template>

<script>
    import util from '../../common/js/util'
    import {getStoreInfoList,getStoreInfoById,submitConfirmPurchaseOrder,getSelectGoodsList,getQualityList,getOrderInfoById,deleteOrderGoodsData,saveConfirmPurchaseOrder,getBillUrl,getPurchaseSupplierList} from '../../api/api';
    export default {
        data() {
            return {
                state:"",//订单状态
                StoreList1:[],//申请仓库数据集合
                StoreList2:[],//收货仓库数据集合
                StoreList3:[],//结算仓库数据集合
                accepterPhone:"",//收件电话
                accepterAddress:"",//收件地址
                storeName:"",//仓库名字
                selectFormVisible : false,
                orderId:"",//订单id
                createStoreId:"",//申请仓库
                priorityLevel:"",//优先级
                acceptStoreId:"",//收货方
                payStoreId:"",//结算仓库
                quality:"",//品质
                number:"",//数量
                supplierId:"",//供应商
                type:"",//类别
                queryName:"",//查询条件
                addgoodList: [],//选择商品列表数据

                //选择商品列表分页参数
                pageNum:"",
                total1:0,
                page1: 1,
                pageSize1:8,
                listLoading1: false,
                listLoading: false,

                qualityList: [],//品质数据集合
                //优先级列表
                priorityLevels: [{
                    value: 0,
                    label: '低'
                },{
                    value: 1,
                    label: '中'
                },
                {
                        value: 2,
                        label: '高'
                }],
                //订单基本信息
                orderTableData: [
                    {
                        id: '',
                        createStoreId: '',
                        acceptStoreId: '',
                        priorityLevel: '',
                        payStoreId: '',
                        accepter: '',
                        accepterPhone: '',
                        accepterAddress: ''
                    }
                ],
                //远程搜索供应商参数
                restaurants: [],
                state4: '',
                timeout:  null,

                operatInfoList: [],//操作日志信息集合
                goodsDetailList: [],//商品信息集合
                id:this.$route.query.id
            }
        },
        methods: {
            //根据id获取采购数据详情
            getPurchaseOrderInfo(){
                var para={id : this.id};
                getOrderInfoById(para).then((data) => {
                    this.orderTableData = data.data.purchaseOrderInfoDto;
                    this.goodsDetailList = data.data.purchaseGoodsDetails;
                    this.operatInfoList = data.data.orderOperatingInformationReqDtoList;
                    var d = data.data.purchaseOrderInfoDto;
                    for(var i=0;i<d.length;i++){
                        this.orderTableData[0].id=d[i].id;
                        this.createStoreId=d[i].createStoreId;
                        if(d[i].priorityLevel == 0){
                            this.priorityLevel="低";
                        }else if(d[i].priorityLevel == 1){
                            this.priorityLevel="中";
                        }else if(d[i].priorityLevel == 2){
                            this.priorityLevel="高";
                        }else{
                            this.priorityLevel="";
                        }
                        //this.priorityLevel=d[i].priorityLevel;
                        this.acceptStoreId=d[i].acceptStoreId;
                        this.payStoreId=d[i].payStoreId;
                        this.accepter=d[i].accepter;
                        this.accepterPhone=d[i].accepterPhone;
                        this.accepterAddress=d[i].accepterAddress;
                    }
                });
            },

            //打印采购单
            printPurchaseOrder(){
                var orderNo = this.id;
                getBillUrl("/purchaseOrder/print?orderNo=" + orderNo);
            },
            //数据保存
            save(){
                var d = this.goodsDetailList;
                for(var i=0;i<d.length;i++) {
                    if (!d[i].quality) {
                        this.$message({
                            message: '请选择品质',
                            type: 'error'
                        });
                        return;
                    }
                    if (!d[i].number) {
                        this.$message({
                            message: '请填写数量',
                            type: 'error'
                        });
                        return;
                    }
                    if (d[i].number % 1 !=0) {
                        this.$message({
                            message: '采购数量应该为整数',
                            type: 'error'
                        });
                        return;
                    }
                }
                let para ={
                    purchaseAddDto: this.orderTableData[0],
                    purchaseGoodsDetails:this.goodsDetailList,
                };
                console.log(para);
                saveConfirmPurchaseOrder(para).then((data) => {
                    if (this.GLOBAL.isResonseSuccess(data)) {
                        this.addFormVisible = false;
                        this.$message({
                            message: '编辑成功',
                            type: 'success'
                        });
                        this.getPurchaseOrderInfo();
                    } else {
                        this.open(data.data);
                    }
                });
            },
            //数据提交
            submit(){
                this.$confirm('你确定要确认此订单吗, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var d = this.goodsDetailList;
                    for(var i=0;i<d.length;i++) {
                        if (!d[i].quality) {
                            this.$message({
                                message: '请选择品质',
                                type: 'error'
                            });
                            return;
                        }
                        if (!d[i].number) {
                            this.$message({
                                message: '请填写数量',
                                type: 'error'
                            });
                            return;
                        }
                        if (d[i].number % 1 !=0) {
                            this.$message({
                                message: '采购数量应该为整数',
                                type: 'error'
                            });
                            return;
                        }
                    }
                    let para ={
                        purchaseAddDto: this.orderTableData[0],
                        purchaseGoodsDetails:this.goodsDetailList,
                    };
                    console.log(para);
                    submitConfirmPurchaseOrder(para).then((data) => {
                        if (this.GLOBAL.isResonseSuccess(data)) {
                            this.addFormVisible = false;
                            this.$message({
                                message: '确认成功',
                                type: 'success'
                            });
                            this.$router.push({path: '/purchaseOrder/list'});
                        } else {
                            this.open(data.data);
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '操作已取消'
                    });
                });
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
                if(d == undefined || d == null ){
                    this.goodsDetailList=[];
                    this.goodsDetailList.push(row);
                }else{
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
                }
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
            //获取所有采购供应商数据
            supplierList(){
                this.listLoading = true;
                getPurchaseSupplierList().then((data) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(data)){
                            this.restaurants=data.data;
                        }
                    }
                );
            },
            //点击删除按钮。删除商品信息
            handleDelete(row){
                //alert(row.id);
                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var para={id:row.id};
                    deleteOrderGoodsData(para).then((data) => {
                        if (this.GLOBAL.isResonseSuccess(data)) {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getPurchaseOrderInfo();
                        }else {
                            this.$message({
                                message: '删除失败',
                                type: 'error'
                            });
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '删除已取消'
                    });
                });
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

            //选择商品列表分页查询
            handleCurrentChange1(page1) {
                this.page1 = page1;
                this.selectGoodsList();
            },
            //处理分页条数
            handleSizeChange1(val) {
                this.pageSize1 = val;
                this.selectGoodsList();
            },

            //选择按钮,打开选择商品框
            selectGoodsBtn() {
                this.type = "",
                this.queryName = "",
                this.page1 = 1;
                this.selectGoodsList();
                this.selectFormVisible = true;
            },
            //条件查询分页bug优化
            getProductListByCondition(){
                this.page1=1;
                this.selectGoodsList();
            },
            //删除按钮，点击删除商品
            deleteRow(index, rows) {
                rows[index].quality = "";
                rows[index].number = "";
                rows.splice(index, 1);
            },

            //当前时间格式化
            dateFormat:function(row, column) {
                var dateTime = row[column.property];
                if (!dateTime) {
                    return "";
                }
                return util.formatDate.format(new Date(dateTime), 'yyyy-MM-dd hh:mm:ss');
            },

            querySearch(queryString, cb) {
                var restaurants = this.restaurants;
                var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            createFilter(queryString) {
                return (restaurant) => {
                    return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            handleSelect(row,item) {
                row.supplierId = item.id;
            }

        },
        mounted() {
            this.supplierList();
            this.getStoreInfo();
            this.selectGoodsList();
            this.qualityListInfo();
            this.getPurchaseOrderInfo();
        }
    }
</script>
<style scoped>
    .toolbar{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>