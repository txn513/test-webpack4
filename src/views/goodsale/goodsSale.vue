<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form  :inline="true" class="demo-form-inline">
                <el-form-item label="订单号:" >
                    <el-input size="small" v-model="search.id" placeholder="输入订单号" style="width:150px;"></el-input>
                </el-form-item>
                <el-form-item label="创建日期:" >
                    <el-date-picker
                            size="small"
                            v-model="queryDate"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="业务类型">
                    <template>
                        <select-group size="small" :num ="search.businessCode" :select="isSelect" @getresult = 'getResultNumber'></select-group>
                    </template>
                </el-form-item>
                <el-form-item label="订单来源:" >
                    <el-select size="small" v-model="search.orderSourceType" placeholder="请选择订单来源">
                        <el-option label="--请选择订单来源--" value=""></el-option>
                        <el-option label="京东" value="10"></el-option>
                        <el-option label="淘宝" value="11"></el-option>
                        <el-option label="门店" value="5"></el-option>
                        <el-option label="APP" value="3"></el-option>
                        <el-option label="微信小程序" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="支付状态:" >
                    <el-select size="small" v-model="search.payStatus" placeholder="请选择支付状态">
                        <el-option label="--请选择支付状态--" value=""></el-option>
                        <el-option label="未付款" value="0"></el-option>
                        <el-option label="已付款" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属" >
                    <el-input size="small" v-model="search.storeName" placeholder="请输入所属仓库或门店名称" style="width:150px;"></el-input>
                </el-form-item>
                <el-form-item label="城市" >
                    <el-select style="width: 150px" size="small" v-model="search.cityName" clearable filterable placeholder="城市">
                        <el-option
                                v-for="item in cityNameList"
                                :key="item"
                                :value ="item"
                                clearable
                                :label="item">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="商品编码" >
                    <el-input size="small" v-model="search.spuCode" placeholder="" style="width:150px;"></el-input>
                </el-form-item>
                <el-form-item label="SKU" >
                    <el-input size="small" v-model="search.skuCode" placeholder="" style="width:150px;"></el-input>
                </el-form-item>
                <el-form-item label="商品单价" >
                    <el-input size="small" v-model="search.minPrice" placeholder="" style="width:100px;"></el-input>至
                    <el-input size="small" v-model="search.maxPrice" placeholder="" style="width:100px;"></el-input>
                </el-form-item>

                <!--<el-form-item label="采购单价" >-->
                    <!--<el-input size="small" v-model="search.minPurchasePrice" placeholder="" style="width:100px;"></el-input>至-->
                    <!--<el-input size="small" v-model="search.maxPurchasePrice" placeholder="" style="width:100px;"></el-input>-->
                <!--</el-form-item>-->
                <el-form-item label="商品分类" prop="classId">
                    <el-cascader
                            size="small"
                            style="width: 150px"
                            v-model="classIdList"
                            placeholder="商品分类"
                            :options="classList"
                            :props="props"
                            :show-all-levels="false"
                            filterable
                            clearable
                            change-on-select>
                    </el-cascader>
                </el-form-item>
                <el-form-item label="商品品牌" prop="brandId">
                    <el-select style="width: 150px" size="small" v-model="search.brandName" clearable filterable placeholder="商品品牌">
                        <el-option
                                v-for="item in brandList"
                                :key="item.id"
                                :value ="item.brandName"
                                clearable
                                :label="item.brandName">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否开票:" >
                    <el-select size="small" v-model="search.invoiceFlag" placeholder="">
                        <el-option label="未开票" value="0"></el-option>
                        <el-option label="已开票" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品品名" >
                    <el-input size="small" v-model="search.spuName" placeholder="" style="width:150px;"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-button size="small" type="primary" v-on:click="searchByCondition()"  >查询</el-button>
                </el-form-item>
                <el-form-item label="">
                    <el-button  size="small" v-if="isAuth('scloud:goodsale:export')" type="primary" v-on:click="exportData()">导出</el-button>
                </el-form-item>
            </el-form>
        </el-col>


        <el-table
                border
                :data="tableCountData"
                prop="orderNum"
                style="width: 45%;margin-left: 5%;margin-top: 30px;margin-bottom: 20px;">
            <el-table-column
                    align="center"
                    prop="orderCountPrice"
                    label="总收入">
            </el-table-column>
            <!--<el-table-column-->
                    <!--align="center"-->
                    <!--prop="orderPurchasePrice"-->
                    <!--label="总采购金额">-->
            <!--</el-table-column>-->
            <el-table-column
                    align="center"
                    prop="orderCount"
                    label="总销售数量">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="orderDiscountPrice"
                    label="总优惠金额">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="orderPaidPrice"
                    label="总订单销售金额">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="sinterCurrencyNum"
                    label="森特币抵扣数量">
            </el-table-column>
        </el-table>

        <el-table
                v-loading="listLoading"
                :data="tableData"
                stripe
                style="width: 100%">
            <el-table-column
                    sortable
                    prop="createTime"
                    label="订单创建时间"
                    show-overflow-tooltip
                    :formatter="dateFormat">
            </el-table-column>
            <el-table-column
                    sortable
                    prop="id"
                    label="订单号"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="spuCode"
                    label="商品编码"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="skuCode"
                    label="SKU"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="spuName"
                    label="销售商品品名"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="className"
                    label="分类"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="brandName"
                    label="品牌"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="salesPrice"
                    label="商品单价"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="number"
                    label="销售数量"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="sumPrice"
                    label="商品金额"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="payPrice"
                    label="实付"
                    show-overflow-tooltip>
            </el-table-column>

            <!--<el-table-column-->
                    <!--sortable-->
                    <!--prop="purchasePrice"-->
                    <!--label="采购价格"-->
                    <!--show-overflow-tooltip>-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
                    <!--sortable-->
                    <!--prop="purchaseSumPrice"-->
                    <!--label="采购金额"-->
                    <!--show-overflow-tooltip>-->
            <!--</el-table-column>-->
            <el-table-column
                    sortable
                    prop="outCount"
                    label="出库数量"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="invoiceFlag"
                    label="是否开票"
                    show-overflow-tooltip :formatter="invoiceFlagFormat">
            </el-table-column>
            <el-table-column
                    sortable
                    prop="businessCode"
                    label="业务类型"
                    show-overflow-tooltip :formatter="businessCodeFormat">
            </el-table-column>
            <el-table-column
                    sortable
                    prop="orderSourceType"
                    label="订单来源"
                    show-overflow-tooltip :formatter="formatOrderSource">
            </el-table-column>
            <el-table-column
                    sortable
                    prop="payStatus"
                    label="支付状态"
                    show-overflow-tooltip :formatter="payStatusFormat">
            </el-table-column>
            <el-table-column
                    sortable
                    prop="storeName"
                    label="所属"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="cityName"
                    label="城市"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作"
                    width="150">
                <template slot-scope="scope">
                    <el-button @click="orderDetail(scope.$index, scope.row)" size="mini" type="primary">查看订单</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageNum"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total" style="float: right;margin-top: 10px">
        </el-pagination>
    </section>
</template>

<script>
    import OrderUtil from '../../common/js/OrderUtil';
    import selectGroup from '../../components/selectGroup';
    import {productClassTreeByBusinessFun,productBrandListByBusinessIdFun,getGoodsSaleList,getGoodsSaleCount,getCityName} from '../../api/api';
    export default {
        components:{
            selectGroup
        },
        data() {
            return {
                listLoading:false,
                number: -1,//后台传过来的十进制数据
                isSelect: true,//是否可选
                businessCode:-1,//业务类型
                tableData:[],//表格数据
                tableCountData:[],//表格数据
                cityNameList:[],//城市列表
                total: 0,
                pageNum: 1, //当前页码
                pageSize: 10,//页数
                queryDate:[],//搜索日期范围
                classIdList:[],//分类id
                classList:[],//分类
                brandList:[],//品牌
                /**分类渲染模板**/
                props: {
                    value: 'id',
                    label: 'name',
                    children: 'children',
                },
                search: {
                    id:"",
                    beginDate:"",
                    endDate:"",
                    businessCode: -1,
                    orderSourceType:"",
                    payStatus:"",
                    storeName:"",
                    cityName:"",
                    spuName:"",
                    spuCode:"",
                    skuCode:"",
                    minPrice:"",
                    maxPrice:"",
                    minPurchasePrice:"",
                    maxPurchasePrice:"",
                    classId:"",
                    brandName:"",
                    invoiceFlag:"",
                }
            }
        },
        methods: {
            getResultNumber(result){
                this.businessCode = result;
                this.search.businessCode = result ;
                this.classIdList = [];
                this.getBrandListByBusinessId();
                this.getClassTree();
            },

            getData(){
                let para = this.search;
                para.beginDate = this.queryDate.length > 0 ? this.queryDate[0] + ' 00:00:00' : '';
                para.endDate = this.queryDate.length > 0 ? this.queryDate[1] + ' 23:59:59' : '';
                para.classId = this.classIdList.length > 0 ? this.classIdList[this.classIdList.length - 1]: '';
                para.pageInfo = {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                };
                if (para.minPrice !== '' && para.maxPrice === '') {
                    this.$message({
                        message: "请填写商品单价",
                        type: 'error'
                    });
                    return;
                }
                if (para.minPrice === '' && para.maxPrice !== '') {
                    this.$message({
                        message: "请填写商品单价",
                        type: 'error'
                    });
                    return;
                }
                let flag = (!this.checkNumber(para.minPrice.trim())) || (!this.checkNumber(para.maxPrice.trim()));
                if (flag)  {
                    this.$message({
                        message: "商品单价必须为数字",
                        type: 'error'
                    });
                    return;
                }
                this.listLoading = true;
                getGoodsSaleList(para).then((data) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(data)) {
                            this.tableData = data.data.list;
                            this.total = data.data.paginationInfo.total;
                        }
                    }
                    ,data => { this.listLoading = false;}
                );
            },

            getCount(){
                let para = this.search;
                para.beginDate = this.queryDate.length > 0 ? this.queryDate[0] + ' 00:00:00' : '';
                para.endDate = this.queryDate.length > 0 ? this.queryDate[1] + ' 23:59:59' : '';
                para.classId = this.classIdList.length > 0 ? this.classIdList[this.classIdList.length - 1]: '';
                if (para.minPrice !== '' && para.maxPrice === '') {
                    this.$message({
                        message: "请填写商品单价",
                        type: 'error'
                    });
                    return;
                }
                if (para.minPrice === '' && para.maxPrice !== '') {
                    this.$message({
                        message: "请填写商品单价",
                        type: 'error'
                    });
                    return;
                }

                let flag = (!this.checkNumber(para.minPrice.trim())) || (!this.checkNumber(para.maxPrice.trim()));
                if (flag)  {
                    this.$message({
                        message: "商品单价必须为数字",
                        type: 'error'
                    });
                    return;
                }

                getGoodsSaleCount(para).then((data) => {
                        if (this.GLOBAL.isResonseSuccess(data)) {
                            this.tableCountData = data.data;
                        }
                    }
                    ,data => { this.listLoading = false;}
                );
            },

            checkNumber(number) {
                if (number === ''){
                    return true;
                }
                //判断字符串是否为数字 //判断正整数 /^[1-9]+[0-9]*]*$/
                let re = /^[0-9]+.?[0-9]*$/;
                return re.test(number);

            },

            getCityNameList() {
                getCityName({}).then((data) => {
                        if (this.GLOBAL.isResonseSuccess(data)) {
                            this.cityNameList = data.data;
                        }
                    }
                    ,data => { }
                );
            },

            //分页查询
            handleCurrentChange(val) {
                this.pageNum = val;
                this.getData();
            },
            //处理分页条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.getData();
            },

            //条件查询
            searchByCondition(){
                this.pageNum = 1;
                this.getData();
                this.getCount();
            },
            //导出
            exportData() {
                let token = JSON.parse(sessionStorage.getItem('user')).token;
                let param = this.search;
                param.beginDate = (this.queryDate && this.queryDate.length > 0) ? this.queryDate[0] : '';
                param.endDate = (this.queryDate && this.queryDate.length > 0) ? this.queryDate[1] : '';
                param.classId = this.classIdList[this.classIdList.length - 1];
                if(token != null) {
                    param.token = token;
                    let url = process.env.API_ROOT + "/goodsale/export";
                    let p = this.urlEncode(param);
                    window.location.href = url + "?" + p.substr(1, p.length);
                }
            },


            /**
             * param 将要转为URL参数字符串的对象
             * key URL参数字符串的前缀
             * encode true/false 是否进行URL编码,默认为true
             *
             * return URL参数字符串
             */
            urlEncode (param, key, encode) {
                if(param==null) return '';
                let paramStr = '';
                let t = typeof (param);
                if (t === 'string' || t === 'number' || t === 'boolean') {
                    paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
                } else {
                    for (let i in param) {
                        let k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
                        paramStr += this.urlEncode(param[i], k, encode);
                    }
                }
                return paramStr;
            },

            //查看订单详情
            orderDetail(index,row){
                this.$router.push({path: '/orderSelf/queryDetailById?id=' + row.id + '&orderStatus=' + row.orderStatus});
            },

            //时间格式化
            dateFormat(row, column) {
                return OrderUtil.commonDateFormat(row, column);
            },
            //是否开票
            invoiceFlagFormat: function (row){
                return row.invoiceFlag === 1 ? "已开票" : "未开票";
            },
            //业务类型
            businessCodeFormat: function (row){
                if (row.businessCode === 1){
                    return '洗护';
                } else if (row.businessCode === 2){
                    return '名品';
                } else if (row.businessCode === 4){
                    return '态奢';
                } else {
                    return '未知';
                }
            },
            //订单来源
            formatOrderSource: function (row) {
                if (row.orderSourceType === 1){
                    return '微信小程序';
                } else if (row.orderSourceType === 2){
                    return '微信公众号';
                } else if(row.orderSourceType === 3){
                    return '苹果app';
                } else if (row.orderSourceType === 4){
                    return '安卓app';
                } else if(row.orderSourceType === 5){
                    return '门店';
                } else if (row.orderSourceType === 10){
                    return '京东';
                } else if(row.orderSourceType === 11){
                    return '淘宝';
                } else if (row.orderSourceType === 12){
                    return '其他';
                } else {
                    return '未知';
                }
            },

            payStatusFormat: function (row) {
                if (row.payStatus === 0){
                    return '未付款';
                } else if (row.payStatus === 1){
                    return '已付款';
                } else {
                    return '未知';
                }
            },

            /**获取分类树信息**/
            getClassTree () {
                let param = {
                    businessTypeCode: this.businessCode
                };
                productClassTreeByBusinessFun(param).then((res) => {
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.classList = res.data;
                    }
                }, (res) => { }).catch(() => { });
            },

            getBrandListByBusinessId() {
                productBrandListByBusinessIdFun({businessTypeCode: this.businessCode}).then((res) => {
                    this.brandList = [];
                    this.brandList.push({id:0, brandName:'请选择'});
                    for (let i = 0; i < res.data.length; i++) {
                        this.brandList.push({id:res.data[i].id, brandName:res.data[i].brandName});
                    }
                }, (res) => { } ).catch(() => {});
            },
        },

        mounted() {
            this.getClassTree();
            this.getBrandListByBusinessId();
            this.getData();
            this.getCount();
            this.getCityNameList()
        }
    }

</script>

<style scoped>
    .selections {
        display: flex;
        justify-content: flex-end;
        flex-wrap: wrap;
    }
    /*.selections .el-form-item,
    .selections .el-button {
        float: right;
    }*/
    .selections .el-form-item {
        margin-bottom: 10px !important;
    }
    .selections button {
        height: 40px;
        margin-left: 10px;
    }
    .selections .el-input {
        
    }
    .el-input--small input {
        height: 40px;
    }
    .selections .el-input__inner {
        height: 40px !important;
        margin-left: 10px;
    }
    .el-form--inline .el-form-item,
    .el-form--inline el-date-picker {
        margin-right: 0;
        margin-left: 10px;
    }
    .el-form--inline .el-form-item {
        height: 40px    ;
    }
    .el-form--inline .el-form-item__content {
        height: 40px;
    }
</style>