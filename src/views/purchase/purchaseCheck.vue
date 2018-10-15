<template>
    <section>
        <div class="toolbar el-col el-col-24" style="margin-top: 20px;text-align:right;">
            <div style="margin-top: 10px;text-align:left;">当前状态：<span class="order-status">已审核</span></div>
            <div>
                <span v-if="state == 0">
                    <el-button type="primary" v-if="isAuth('mpys:purchaseOrder:check')" v-on:click="printPurchaseOrder()" :loading="listLoading" >打印采购单</el-button>
                </span>
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
                    <el-select disabled v-model="createStoreId" placeholder="请选择">
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
                    <el-select disabled  v-model="orderTableData[0].priorityLevel" placeholder="请选择">
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
                    label="收货方">
                <template slot-scope="scope">
                    <el-select disabled   v-model="orderTableData[0].acceptStoreId" placeholder="请选择" filterable>
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
                    <el-select disabled  v-model="orderTableData[0].payStoreId" placeholder="请选择">
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
                    <el-select disabled  style="width: 100px" v-model="scope.row.quality" placeholder="请选择">
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
                    label="供应商">
                <template slot-scope="scope">

                    <el-autocomplete
                            :disabled="true"
                            v-model="scope.row.supplierName"
                            :fetch-suggestions="querySearch"
                            :value="scope.row.supplierName"
                            placeholder="请输入内容"
                            @select="handleSelect(scope.row,$event)"
                    ></el-autocomplete>
                </template>
            </el-table-column>
            <el-table-column
                    prop="price"
                    label="采购单价">
            </el-table-column>
            <el-table-column
                    prop="number"
                    label="采购数量">
            </el-table-column>
        </el-table>


        <!--操作信息-->
        <h3 style="margin-top: 50px;">操作信息</h3>
        <el-table
                v-loading="listLoading"
                element-loading-text="拼命加载中"
                :data="operatInfoList"
                style="width: 100%">
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
    import {getStoreInfoList,checkPurchaseOrder,getQualityList,getOrderInfoById,getPurchaseSupplierList,getBillUrl} from '../../api/api';
    export default {
        data() {
            return {
                state:"",//订单状态
                //远程搜索供应商参数
                restaurants: [],
                state4: '',
                timeout:  null,
                price:"",
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

                //选择商品列表分页参数
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

            //采购订单审核
            checkFormSubmit(){
                let para ={
                    purchaseAddDto: this.orderTableData[0],
                    purchaseGoodsDetails:this.goodsDetailList,
                };
                console.log(para);
                checkPurchaseOrder(para).then((data) => {
                    if (this.GLOBAL.isResonseSuccess(data)) {
                        //this.addFormVisible = false;
                        this.$message({
                            message: '审核成功',
                            type: 'success'
                        });
                        this.$router.push({path: '/purchaseOrder/list'});
                    } else {
                        this.open(data.data);
                    }
                });
            },

            //获取仓库
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
            //打印采购单
            printPurchaseOrder(){
                var orderNo = this.id;
                getBillUrl("/purchaseOrder/print?orderNo=" + orderNo);
            },
            //获取商品品质列表
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
            //当前时间格式化
            dateFormat:function(row, column) {
                var dateTime = row[column.property];
                if (!dateTime) {
                    return "";
                }
                return util.formatDate.format(new Date(dateTime), 'yyyy-MM-dd hh:mm:ss');
            },


            //渲染供应商输入框组件
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