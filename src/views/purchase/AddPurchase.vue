<template>
    <section>
        <div class="toolbar el-col el-col-24" style="margin-top: 20px;text-align:right;">
            <div>
                <el-button type="primary"  v-on:click="printPurchaseOrder()" :loading="listLoading" >打印采购单</el-button>
                <el-button type="primary"  v-on:click="addFormSubmit()" :loading="listLoading" >保存</el-button>
            </div>
        </div>

        <h3 style="margin-top: 50px;">基本信息</h3>
        <el-table
                v-loading="listLoading"
                element-loading-text="拼命加载中"
                :data="orderTableData"
                style="width: 100%;margin-top: 5px;">
            <el-table-column
                    prop="createStoreId"
                    label="申请方">
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
                    label="收货方">
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
                <!--<template slot-scope="scope">
                    <el-input
                            placeholder="请输入内容"
                            v-model="orderTableData[0].accepter"
                            :disabled="true">
                    </el-input>
                </template>-->
            </el-table-column>
            <el-table-column
                    prop="accepterPhone"
                    label="收件电话">
                <!--<template slot-scope="scope">
                    <el-input
                            placeholder="请输入内容"
                            v-model="orderTableData[0].accepterPhone"
                            :disabled="true">
                    </el-input>
                </template>-->
            </el-table-column>
            <el-table-column
                    prop="accepterAddress"
                    label="地址">
                <!--<template slot-scope="scope">
                    <el-input
                            placeholder="请输入内容"
                            v-model="orderTableData[0].accepterAddress"
                            :disabled="true">
                    </el-input>
                </template>-->
            </el-table-column>
        </el-table>
        <!--商品信息表格-->
        <h3 style="margin-top: 50px;">商品信息</h3>
        <el-button type="primary"  @click="selectGoods()" :loading="listLoading" >选择商品</el-button>
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
                    <el-input
                            placeholder="请输入内容"
                            v-model="scope.row.supplierId"
                            :disabled="true">
                    </el-input>
                </template>
            </el-table-column>
            <el-table-column
                    prop="number"
                    label="采购数量">
                <template slot-scope="scope">
                    <el-input
                            type="number"
                            placeholder="请输入内容"
                            v-model="scope.row.number">
                    </el-input>
                </template>
            </el-table-column>
            <el-table-column
                    sortable
                    align="center"
                    fixed="right"
                    label="操作">
                <template slot-scope="scope">
                    <el-button @click.native.prevent="deleteRow(scope.$index, goodsDetailList)" size="small" type="danger">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--选择商品弹出窗-->
        <el-dialog title="选择商品" v-model="selectFormVisible" :visible.sync="selectFormVisible" >
            <div class="toolbar el-col el-col-24" style="text-align: right;margin-bottom: 25px;">
                <el-select v-model="type" placeholder="请选择搜索类别" style="width:120px;">
                    <el-option label="商品编码" value=0></el-option>
                    <el-option label="商品名称" value=1></el-option>
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
                <el-pagination @current-change="handleCurrentChange1"
                               :page-size="pageSize1"
                               layout="prev, pager, next"
                               :total="total1">
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
    import {getStoreInfoList,getSelectGoodsList,addPurchaseOrder,getQualityList,getStoreInfoById} from '../../api/api';
    export default {
        data() {
            return {
                StoreList1:[],//申请仓库数据集合
                StoreList2:[],//收货仓库数据集合
                StoreList3:[],//结算仓库数据集合
                //value: '',
                accepterPhone:"",//收件电话
                accepterAddress:"",//收件地址
                storeName:"",//仓库名字
                orderId:"",//订单Id
                createStoreId:"",//申请仓库
                priorityLevel:"",//优先级
                acceptStoreId:"",//收货仓库
                payStoreId:"",//结算仓库
                quality:"",//品质
                number:"",//采购数量
                queryName:"",//搜索条件参数
                type:"",//搜索类型

                //选择商品列表分页参数
                total1:0,
                page1: 1,
                pageSize1:8,
                listLoading1: false,
                listLoading: false,

                qualityList: [],//品质数据集合
                addgoodList: [],//选择商品列表数据
                //优先级数据集合
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
                //订单主信息数据
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
                ],//订单信息
                operatInfoList: [],//操作日志信息集合
                goodsDetailList: [],//商品信息数据集合
                selectFormVisible : false,
            }
        },
        methods: {

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
                            this.StoreList1=data.data.list;
                            this.StoreList2=data.data.list;
                            this.StoreList3=data.data.list;
                            this.acceptStoreOptions=data.data.list;
                        }
                    }
                    ,data => { this.listLoading = false;}
                );
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
            //选择商品按钮,打开选择商品框
            selectGoods() {
                this.type = "",
                this.queryName = "",
                this.page1 = 1;
                this.selectGoodsList();
                this.selectFormVisible = true;
            },
            //删除按钮，点击删除商品
            deleteRow(index, rows) {
                rows[index].quality = " ";
                rows[index].number = " ";
                rows.splice(index, 1);
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
                //console.log(this.goodsDetailList);
            },
            //表格合计方法
            getSummaries(param) {
                const { columns, data } = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '商品数量总计';
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
                addPurchaseOrder(para).then((data) => {
                    if (this.GLOBAL.isResonseSuccess(data)) {
                        this.addFormVisible = false;
                        this.$message({
                            message: '新增成功',
                            type: 'success'
                        });
                        //this.$router.push({path: '/purchaseOrder/list'});
                        this.goodsDetailList = [];
                        this.orderTableData = [];
                    } else {
                        this.open(data.data);
                    }
                });
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
                                d[i].model=d[i].spuCode;
                            }
                        }
                    }
                );
            },
            //选择商品列表分页查询
            handleCurrentChange1(page1) {
                this.page1 = page1;
                this.selectGoodsList();
            },
            printPurchaseOrder(){
              alert("功能完善中")
            },

        },
        mounted() {
            this.getStoreInfo();
            this.qualityListInfo();
            this.selectGoodsList();
        }
    }
</script>