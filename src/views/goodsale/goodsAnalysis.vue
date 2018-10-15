<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form  :inline="true"  class="demo-form-inline">
                <el-form-item label="日期:" >
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

                <el-form-item label="仓库">
                    <el-select style="width: 150px" size="small" v-model="search.storeId" clearable filterable placeholder="仓库">
                        <el-option
                                v-for="item in storeList"
                                :key="item.storeNo"
                                :value ="item.storeNo"
                                clearable
                                :label="item.storeName">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="业务类型">
                    <template>
                        <select-group size="small" :num ="search.businessTypeCode" :select="isSelect" @getresult = 'getResultNumber'></select-group>
                    </template>
                </el-form-item>


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
                    <el-select style="width: 150px" size="small" v-model="search.brandIds" clearable multiple filterable placeholder="商品品牌">
                        <el-option
                                v-for="item in brandList"
                                :key="item.id"
                                :value ="item.id"
                                clearable
                                :label="item.brandEngName">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="成色:" >
                    <el-select size="small" v-model="search.qualityIds" multiple clearable filterable placeholder="请选择商品成色">
                        <el-option
                                v-for="item in qualityList"
                                :key="item.id"
                                :value ="item.id"
                                clearable
                                :label="item.qualityLabel">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="销售周期" prop="period" style="margin-left:50px;">
                    <el-radio-group v-model="search.period">
                        <el-radio class="radio" label="0">畅销</el-radio>
                        <el-radio class="radio" label="1">正常</el-radio>
                        <el-radio class="radio" label="2">待处理</el-radio>
                        <el-radio class="radio" label="3">滞销</el-radio>
                        <el-radio class="radio" label="4">自定义</el-radio>
                    </el-radio-group>
                    <el-input size="small" v-model="search.startDay" placeholder="请输入开始天数" style="width:150px;"></el-input>
                    <span>至</span>
                    <el-input size="small" v-model="search.endDay" placeholder="请输入结束天数" style="width:150px;"></el-input>
                    <el-button size="small" type="primary" @click="config">配置</el-button>
                </el-form-item>


                <el-form-item label="商品价格" style="margin-left:50px;">
                    <el-input size="small" v-model="search.minPrice" placeholder="" style="width:100px;"></el-input>至
                    <el-input size="small" v-model="search.maxPrice" placeholder="" style="width:100px;"></el-input>
                </el-form-item>

                <el-form-item label="商品毛利" >
                    <el-input size="small" v-model="search.minGrossPrice" placeholder="" style="width:100px;"></el-input>至
                    <el-input size="small" v-model="search.maxGrossPrice" placeholder="" style="width:100px;"></el-input>
                </el-form-item>

                <el-form-item label="">
                    <el-button size="small" v-if="isAuth('scloud:analysis:view')" type="primary" v-on:click="searchByCondition()" :loading="queryLoading" >查询</el-button>
                </el-form-item>

                <el-form-item label="">
                    <el-button  size="small" v-if="isAuth('scloud:analysis:export')" type="primary" v-on:click="exportData()">导出</el-button>
                </el-form-item>

            </el-form>
        </el-col>
        <!--配置弹出窗-->
        <el-dialog
                title="配置销售周期筛选项"
                :visible.sync="isConfigShow"
                width="50%">
            <el-form ref="configForm" :model="configForm"  label-width="80px">
                <el-form-item v-for="item in configForm.config" :label="item.label">
                    <el-input v-model="item.startDay" placeholder="请输入开始天数" type="number" style="width: 150px"></el-input>
                    <span>至</span>
                    <el-input v-model="item.endDay" placeholder="请输入结束天数" type="number" style="width: 150px"></el-input>
                </el-form-item>
                <el-form-item align="right">
                    <el-button @click="isConfigShow=false">取消</el-button>
                    <el-button type="primary" @click="updateConfig" :loading = 'isLoading'>提交</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-table
                border
                :data="tableCountData"
                prop="orderNum"
                style="width: 45%;margin-left: 5%;margin-top: 30px;margin-bottom: 20px;">
            <el-table-column
                    align="center"
                    prop="totalSales"
                    label="总销量">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="totalPrice"
                    label="支付总金额">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="numberClass"
                    label="在售品类数">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="totalGross"
                    label="总毛利">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="salesCycle"
                    label="平均售出时长">
            </el-table-column>
        </el-table>

        <el-table
                :data="tableData"
                stripe
                style="width: 100%">

            <el-table-column
                    type="selection"
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
                    prop="className"
                    label="品类"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="spuName"
                    label="商品名称"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="skuCode"
                    label="商品Code"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="qualityName"
                    label="品质"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="salesPrice"
                    label="销售价格"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="payPrice"
                    label="支付金额"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="grossPrice"
                    label="毛利"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="onSaleTimes"
                    label="上架时间"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="deliveryTimes"
                    label="出库时间"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="salesDay"
                    label="销售周期"
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
    import {productClassTreeByBusinessFun,productBrandListByBusinessIdFun,getPeriod,updatePeriod,qualityList,getGoodsAnalysisCount,getGoodsAnalysisList,getUserStoreList} from '../../api/api';
    export default {
        components:{
            selectGroup
        },
        data() {
            return {
                listLoading:false,
                queryLoading:false,
                isLoading:false,
                number: -1,//后台传过来的十进制数据
                isSelect: true,//是否可选
                businessTypeCode:-1,//业务类型
                tableData:[],//表格数据
                tableCountData:[],//表格数据
                total: 0,
                pageNum: 1, //当前页码
                pageSize: 10,//页数
                queryDate:[new Date(),new Date()],//搜索日期范围
                classIdList:[],//分类id
                classList:[],//分类
                brandList:[],//品牌
                qualityList:[],//品质
                storeList:[],//仓库
                /**分类渲染模板**/
                props: {
                    value: 'id',
                    label: 'name',
                    children: 'children',
                },
                search: {
                    beginDate:"",
                    endDate:"",
                    businessTypeCode: -1,
                    startDay: 0,
                    endDay: 0,
                    storeId:0,
                    minPrice:"",
                    maxPrice:"",
                    minGrossPrice:"",
                    maxGrossPrice:"",
                    qualityIds:[],
                    classIds:[],
                    brandIds:[],
                },
                isConfigShow: false,//是否显示配置框
                configForm:{
                    config:[]

                }//配置框数据
            }
        },
        methods: {
            getResultNumber(result){
                this.businessTypeCode = result;
                this.search.businessTypeCode = result ;
                this.classIdList = [];
                this.getBrandListByBusinessId();
                this.getClassTree();
            },
            //配置销售周期信息
            config(){
                this.isConfigShow = true;

            },
            //获取默认的周期配置信息
            getDefaultConfig(){
                getPeriod({}).then((res) => {
                        if (this.GLOBAL.isResonseSuccess(res)) {
                            this.configForm.config = res.data;
                            this.configForm.config.forEach((item,index)=>{
                                let label;
                                switch(index){
                                    case 0:
                                        label = '畅销';
                                        break;
                                    case 1:
                                        label = '正常';
                                        break;
                                    case 2:
                                        label = '待处理';
                                        break;
                                    case 3:
                                        label = '滞销';
                                        break;

                                }
                                this.configForm.config[index].label = label;
                            })
                            this.getData();
                        }
                    }
                    ,data => { this.listLoading = false;}
                );

            },
            updateConfig(){
                this.$refs.configForm.validate((valid) => {
                    let flag = true;
                    this.configForm.config.forEach((item)=>{
                        if(!item.startDay || item.startDay != 0){
                            this.$message.error('请输入开始天数');
                            flag = false;
                            return;
                        }
                        if(!item.endDay){
                            this.$message.error('请输入结束天数');
                            flag = false;
                            return;
                        }
                        if(Number(item.startDay)>=Number(item.endDay)){
                            this.$message.error('结束天数应该大于开始天数');
                            flag = false;
                            return;
                        }
                        if(Number(item.startDay)<0||Number(item.endDay)<0){
                            this.$message.error('天数不能为负数');
                            flag = false;
                            return;
                        }
                    })
                    if(!flag){
                        return;
                    }
                    this.isLoading = true;
                    let list = this.configForm.config;
                    list.forEach((item)=>{
                        delete item.label
                    });
                    let param ={
                        list:list
                    };
                    updatePeriod(param).then((res) => {

                        if (this.GLOBAL.isResonseSuccess(res)) {
                            this.isLoading = false;
                            this.$message({
                                message: '修改周期配置信息成功',
                                type: 'success'
                            });
                            this.isConfigShow = false;
                        }
                    }, (res) => { this.listLoading = false; } ).catch(() => {});
                })
            },
            getData(){
                this.search.beginDate = "";
                this.search.endDate = "";
                let para = this.search;
                if(this.search.period&&this.search.period!=4){
                    //说明不是自定义
                    para.startDay = this.configForm.config[this.search.period].startDay;
                    para.endDay = this.configForm.config[this.search.period].endDay;
                }
                if(this.queryDate != null){
                    para.beginDate = this.queryDate.length > 0 ? this.queryDate[0] + ' 00:00:00' : '';
                }
                if(this.queryDate != null){
                    para.endDate = this.queryDate.length > 0 ? this.queryDate[1] + ' 23:59:59' : '';
                }
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
                this.queryLoading = true;
                getGoodsAnalysisList(para).then((data) => {
                        this.queryLoading = false;
                        if (this.GLOBAL.isResonseSuccess(data)) {
                            this.tableData = data.data.list;
                            this.total = data.data.paginationInfo.total;
                        }
                    }
                    ,data => { this.queryLoading = false;}
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

            /**
             * 查询统计数据
             *
             **/
            getCount(){
                let para = this.search;
                if(this.queryDate != null){
                    para.beginDate = this.queryDate.length > 0 ? this.queryDate[0] + ' 00:00:00' : '';
                }
                if(this.queryDate != null){
                    para.endDate = this.queryDate.length > 0 ? this.queryDate[1] + ' 23:59:59' : '';
                }
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
                getGoodsAnalysisCount(para).then((data) => {
                        if (this.GLOBAL.isResonseSuccess(data)) {
                            this.tableCountData = data.data;
                        }
                    }
                    ,data => { this.listLoading = false;}
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
                if(this.queryDate != null){
                    param.beginDate = this.queryDate.length > 0 ? this.queryDate[0] + ' 00:00:00' : '';
                }
                if(this.queryDate != null){
                    param.endDate = this.queryDate.length > 0 ? this.queryDate[1] + ' 23:59:59' : '';
                }
                param.classId = this.classIdList[this.classIdList.length - 1];
                if (param.minPrice !== '' && param.maxPrice === '') {
                    this.$message({
                        message: "请填写商品单价",
                        type: 'error'
                    });
                    return;
                }
                if (param.minPrice === '' && param.maxPrice !== '') {
                    this.$message({
                        message: "请填写商品单价",
                        type: 'error'
                    });
                    return;
                }

                let flag = (!this.checkNumber(param.minPrice.trim())) || (!this.checkNumber(param.maxPrice.trim()));
                if (flag)  {
                    this.$message({
                        message: "商品单价必须为数字",
                        type: 'error'
                    });
                    return;
                }
                if(token != null) {
                    param.token = token;
                    let url = process.env.API_ROOT + "/goodsAnalysis/export";
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
                this.$router.push({path: '/orderSelf/queryDetailById?id=' + row.sourceNo});
            },

            /**获取分类树信息**/
            getClassTree () {
                let param = {
                    businessTypeCode: this.businessTypeCode
                };
                productClassTreeByBusinessFun(param).then((res) => {
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.classList = res.data;
                    }
                }, (res) => { }).catch(() => { });
            },

            getBrandListByBusinessId() {
                productBrandListByBusinessIdFun({businessTypeCode: this.businessTypeCode}).then((res) => {
                    this.brandList = [];
                    this.brandList.push({id:0, brandEngName:'请选择'});
                    for (let i = 0; i < res.data.length; i++) {
                        this.brandList.push({id:res.data[i].id, brandEngName:res.data[i].brandEngName});
                    }
                }, (res) => { } ).catch(() => {});
            },
            getQualityList() {
                qualityList().then((res) => {
                    this.qualityList = [];
                    this.qualityList.push({id:0, qualityLabel:'请选择'});
                    for (let i = 0; i < res.data.length; i++) {
                        this.qualityList.push({id:res.data[i].id, qualityLabel:res.data[i].qualityLabel});
                    }
                }, (res) => { } ).catch(() => {});
            },
            getStoreListList() {
                getUserStoreList().then((res) => {
                    this.storeList = [];
                this.storeList.push({storeNo:0, storeName:'所有'});
                for (let i = 0; i < res.data.length; i++) {
                    this.storeList.push({storeNo:res.data[i].storeNo, storeName:res.data[i].storeName});
                }
            }, (res) => { } ).catch(() => {});
            },
        },

        mounted() {
            this.getQualityList();
            this.getStoreListList();
            this.getCount();
            this.getDefaultConfig();
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