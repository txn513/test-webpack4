<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form align="right" :inline="true"  class="demo-form-inline">
                <el-form-item label="">
                    <el-date-picker v-model="filters.dateTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                                    value-format="yyyy-MM-dd" style="width:360px"></el-date-picker>
                </el-form-item>
                <el-form-item label="">
                    <el-select v-model="filters.store.value" clearable placeholder="请选择">
                        <el-option v-for="item in filters.store.options" :key="item.storeNo" :label="item.storeName" :value="item.storeNo"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="filters.brandList.value" multiple clearable placeholder="品牌">
                        <el-option v-for="item in filters.brandList.options" :key="item.storeNo" :label="item.brandEngName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-cascader v-model="filters.classList.value" placeholder="商品分类" :options="filters.classList.options" @change="changeClass" :props="props"
                                 :show-all-levels="false" filterable multiple clearable change-on-select />
                </el-form-item>
                <el-form-item>
                    <el-select v-model="filters.qualityList.value" multiple clearable placeholder="成色">
                        <el-option v-for="item in filters.qualityList.options" :key="item.storeNo" :label="item.qualityName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="在库时长">
                        <el-radio-group v-model="filters.retainType">
                            <el-radio class="radio" change-on-select @change="changeType" :label="0" >小于30天</el-radio>
                            <el-radio class="radio" change-on-select @change="changeType" :label="1" >30天-90天</el-radio>
                            <el-radio class="radio" change-on-select @change="changeType" :label='2' >90天以上</el-radio>
                            <el-radio class="radio" change-on-select @change="changeType" :label='3' >自定义</el-radio>
                        </el-radio-group>
                        <el-input-number size="medium" v-model="filters.minRetainDate" :disabled="filters.retainDate" controls-position="right" :precision="0" :step="1" :max="99999" :min="0"  @change="changeMinRetainDate"></el-input-number>
                        <span>天 至</span>
                        <el-input-number size="medium" v-model="filters.maxRetainDate" :disabled="filters.retainDate" controls-position="right" :precision="0" :step="1" :max="99999" :min="0"></el-input-number>
                        <span>天</span>
                </el-form-item>
                <el-form-item label="成本">
                    <el-input-number size="medium" v-model="filters.minCost" controls-position="right" :precision="2" :step="1" :max="9999999999" :min="0" @change="changeMinCost"></el-input-number>
                    <span>至</span>
                    <el-input-number size="medium" v-model="filters.maxCost" controls-position="right" :precision="2" :step="1" :max="9999999999" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item label="商品属性">
                    <el-button v-if="attrConditions.length == 0" type="primary" v-on:click="showGoodsAttrMdl()">+</el-button>
                    <el-button-group  v-if="attrConditions.length > 0" v-for="item  in attrConditions" style="margin-left: 5px">
                        <el-button >{{item.name}}</el-button>
                        <el-button icon="el-icon-delete"  v-on:click="removeAttrConditions(item.id)"></el-button>
                    </el-button-group>
                    <el-button type="primary" v-on:click="search(1)">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!--列表-->
        <el-table :data="statistics"  border highlight-current-row v-loading="statisticsLoading" style="width: 100%;margin-bottom: 85px;">
            <el-table-column prop="initialCostInStock" label="初期在库成本" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="initialCategoryInStockCount" label="初期在库品类数" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="endCostInStock" label="末期在库成本" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="endCategoryInStockCount" label="末期在库品类数" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="averageTimeInStock" label="平均在库时间" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="inventoryTurnover" label="库存周转率" sortable show-overflow-tooltip></el-table-column>
        </el-table>
        <el-row><el-button type="primary" v-on:click="exportList()" style="float: right;">导出</el-button></el-row>
        <!--列表-->
        <el-table :data="list"  border highlight-current-row v-loading="listLoading" style="width: 100%;;margin-top: 26px;">
            <el-table-column prop="id" label="序号" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="brandName" label="品牌" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="className" label="品类" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="goodsName" label="商品名称" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="qualityName" label="成色" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="skuCode" label="商品id" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="cost" label="成本" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="retainDay" label="在库时长" sortable show-overflow-tooltip></el-table-column>
        </el-table>
        <!--工具条-->
        <el-col :span="24" style="margin-top: 10px">
            <el-pagination background
                           @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :current-page="pageNum"
                           :page-sizes="[10, 20, 30, 40]"
                           :page-size="pageSize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="total" style="float: right">
            </el-pagination>
        </el-col>
        <!-- 选择商品属性 -->
        <el-dialog title="选择筛选属性" :visible.sync="goodsAttrDialog">
            <el-form>
                <el-form-item v-for="item in attrList" >
                    <el-checkbox :indeterminate="isIndeterminate[item.id]" v-model="checkAll[item.id]"  :key="item.id"  :label="item.id" @change="handleCheckAllChange(item.id,$event)">{{item.attrName}}</el-checkbox>
                    <el-checkbox-group v-model="checkbox" >
                        <el-checkbox v-for="itemInner in item.attrvals" :key="itemInner.id"  :label="itemInner.id"  @change="handleCheckChange(item.id)" >{{itemInner.attrValue}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="goodsAttrDialog = false" >取消</el-button>
                <el-button type="primary" @click.native="showAttrConditions" >提交</el-button>
            </div>
        </el-dialog>

    </section>
</template>

<script>
    Array.prototype.indexOf = function(val) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == val) return i;
        }
        return -1;
    };
    Array.prototype.remove = function(val) {
        var index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    };
    Array.prototype.getIndexWithArr = function (_obj) {
        var len = this.length;
        for(var i = 0; i < len; i++)
        {
            if(this[i].id == _obj.id)
            {
                return parseInt(i);
            }
        }
        return -1;
    };
    Array.prototype.removeObjWithArr = function (_obj) {
        var length = this.length;
        for(var i = 0; i < length; i++)
        {
            if(this[i].itemId == _obj.itemId)
            {
                if(i == 0)
                {
                    this.shift(); //删除并返回数组的第一个元素
                    return;
                }
                else if(i == length-1)
                {
                    this.pop();  //删除并返回数组的最后一个元素
                    return;
                }
                else
                {
                    this.splice(i,1); //删除下标为i的元素
                    return;
                }
            }
        }
    };
    import {productSpuPrepareFun,getAnalysisStatistics,productSpuListAttrsByClassIdFun,storeList,getAnalysis,exportStock} from '../../api/api';

    export default {
        data() {
            return {
                filters: {
                    dateTime:[new Date(),new Date()],
                    store:{
                        options: [],
                        value: ''
                    },
                    classList:{
                        options: [],
                        value: []
                    },
                    brandList:{
                        options: [],
                        value: []
                    },
                    qualityList:{
                        options: [],
                        value: []
                    },
                    attrValIds:[],
                    retainType:0,
                    minRetainDate:'',
                    maxRetainDate:'',
                    minCost:'',
                    maxCost:'',
                    retainDate:true
                },
                props: {
                    value: 'id',
                    label: 'name',
                    children: 'children',
                },
                list:[],
                statistics:[],
                attrList:[],
                checkAll:[],
                checkbox:[],
                attrConditionValues:[],//属性全选
                attrConditions:[],
                isIndeterminate:[],
                goodsAttrDialog:false,
                total: 0,
                pageNum: 1, //当前页码
                pageSize: 10,//页数
                listLoading: false,
                statisticsLoading: false
            }
        },
        methods: {
            //切换页数
            handleCurrentChange(val) {
                this.pageNum = val;
                this.search();
            },
            //处理分页条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.search();
            },
            searchStatistics(){
                this.statisticsLoading = true;
                let para = {
                    beginDate:(this.filters.dateTime && this.filters.dateTime.length>0)?this.filters.dateTime[0]:'',
                    endDate:(this.filters.dateTime && this.filters.dateTime.length>0)?this.filters.dateTime[1]:'',
                    storeCode:this.filters.store.value,
                    retainType:this.filters.retainType,
                    minRetainDate:this.filters.minRetainDate,
                    maxRetainDate:this.filters.maxRetainDate,
                    brandIds:this.filters.brandList.value,
                    classIds:this.filters.classList.value,
                    qualityIds:this.filters.qualityList.value,
                    minCost:this.filters.minCost,
                    maxCost:this.filters.maxCost,
                    attrValIds:this.filters.attrValIds,
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize
                    }
                };
                getAnalysisStatistics(para).then((res) => {
                    this.listLoading = false;
                    this.statistics = [res.data];
                    this.statisticsLoading = false;
                }).catch(err => { });
            },
            //获取数据列表
            search(pageNum) {
                this.listLoading = true;
                if(pageNum && pageNum ==1){
                    this.searchStatistics();
                }
                this.pageNum = pageNum || this.pageNum;
                let para = {
                    beginDate:(this.filters.dateTime && this.filters.dateTime.length>0)?this.filters.dateTime[0]:'',
                    endDate:(this.filters.dateTime && this.filters.dateTime.length>0)?this.filters.dateTime[1]:'',
                    storeCode:this.filters.store.value,
                    retainType:this.filters.retainType,
                    minRetainDate:this.filters.minRetainDate,
                    maxRetainDate:this.filters.maxRetainDate,
                    brandIds:this.filters.brandList.value,
                    classIds:this.filters.classList.value,
                    qualityIds:this.filters.qualityList.value,
                    minCost:this.filters.minCost,
                    maxCost:this.filters.maxCost,
                    attrValIds:this.filters.attrValIds,
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize
                    }
                };
                getAnalysis(para).then((res) => {
                    this.listLoading = false;
                    this.list = res.data.list;
                    this.total = res.data.paginationInfo.total;
                }).catch(err => { });
            },
            initStore: function (){
                storeList().then((res) => {
                    this.filters.store.options = res.data;
                }).catch(err => { });
            },
            /**获取当前商品需要得初始化数据**/
            spuPrepare() {
                productSpuPrepareFun().then((res) => {
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.filters.classList.options = res.data.classTree;
                        this.filters.brandList.options = res.data.brandList;
                        this.filters.qualityList.options = res.data.qualityList;
                    }
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },
            showGoodsAttrMdl(){
                if(this.filters.classList.value == null || this.filters.classList.value.length ==0 ){
                    this.$message({showClose: true, message: "请先选择商品分类", type: 'warning'});
                }else{
                    this.listAttrsByClassId(this.filters.classList.value[0]);
                }
            },
            listAttrsByClassId (id) {
                productSpuListAttrsByClassIdFun({id:id}).then((res) => {
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        if(res.data.length==0){
                            this.$message({showClose: true, message: "当前分类没有可用的商品属性", type: 'warning'});
                        }else{
                            //清除所有为null的对象
                            let str = JSON.stringify(res.data).replace(/ /g,"").replace(/,null/g,"").replace(/\[null,/g,"\[");
                            this.attrList = JSON.parse(str);
                            this.goodsAttrDialog=true
                        }
                    }
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },
            changeType(){
                if(this.filters.retainType==3){
                    this.filters.retainDate = false;
                }else{
                    this.filters.minRetainDate = '';
                    this.filters.maxRetainDate = '';
                    this.filters.retainDate = true;
                }
            },
            changeClass(){
                this.filters.attrValIds = [];
                this.attrList=[];
                this.attrs=[];//属性全选
                this.attrConditions=[];
                this.attrConditionValues=[];
            },
            changeMinRetainDate(){
                if(this.filters.minRetainDate>this.filters.maxRetainDate){
                    this.$message({showClose: true, message: "最小在库时长不能大于最大在库时间。", type: 'warning'});
                    this.filters.minRetainDate = '';
                    return;
                }
            },
            changeMinCost(){
                if(this.filters.minCost>this.filters.maxCost){
                    this.$message({showClose: true, message: "最小成本不能大于最大成本。", type: 'warning'});
                    this.filters.minCost = '';
                    return;
                }
            },
            exportList(){
                if(this.total >20000){
                    this.$message({showClose: true, message: "导出行数超过2万条，只导出前2万条。", type: 'warning'});
                }
                if(this.total == 0){
                    this.$message({showClose: true, message: "没有可以导出的数据。", type: 'warning'});
                    return ;
                }
                let brandIds = "";
                this.filters.brandList.value.forEach(function (value) {
                    brandIds += (","+value);
                });
                let classIds = "";
                this.filters.classList.value.forEach(function (value) {
                    classIds += (","+value);
                });
                let qualityIds = "";
                this.filters.qualityList.value.forEach(function (value) {
                    qualityIds += (","+value);
                });
                let attrValIds = "";
                this.filters.attrValIds.forEach(function (value) {
                    attrValIds += (","+value);
                });

                let param = "&beginDate="+(this.filters.dateTime.length>0?this.filters.dateTime[0]:'');
                param += ("&endDate="+(this.filters.dateTime.length>0?this.filters.dateTime[1]:''));
                param += ("&storeCode="+this.filters.store.value);
                param += ("&retainType="+this.filters.retainType);
                param += ("&minRetainDate="+this.filters.minRetainDate);
                param += ("&maxRetainDate="+this.filters.maxRetainDate);
                param += ("&brandIds="+brandIds.substring(1));
                param += ("&classIds="+classIds.substring(1));
                param += ("&qualityIds="+qualityIds.substring(1));
                param += ("&minCost="+this.filters.minCost);
                param += ("&maxCost="+this.filters.maxCost);
                param += ("&attrValStrIds="+attrValIds.substring(1));
                location.href = exportStock(param);
            },
            handleCheckAllChange(id,event){
                let checkbox = this.checkbox;
                let cancelAllCheckBox = this.cancelAllCheckBox;
                this.isIndeterminate[id] = false;
                if(event){
                    this.attrList.forEach(function(attrs){
                        if(id == attrs.id){    //如果选中的是当前属性下
                            attrs.attrvals.forEach(function(attrvals){
                                checkbox.push(attrvals.id);
                            });
                            return;
                        }
                    })
                }else{
                    cancelAllCheckBox(id);
                }
            },
            handleCheckChange(id){
                let checkedCount = this.getCheckedCount(id);
                let totalCount = this.getTotalCount(id);
                this.checkAll[id] = checkedCount === totalCount;
                this.isIndeterminate[id] = checkedCount > 0 && checkedCount < totalCount;
            },
            refreshCheckBox(id){
                let handleCheckChange = this.handleCheckChange;
                this.attrList.forEach(function(attrs){
                    handleCheckChange(attrs.id);
                });
            },
            cancelAllCheckBox(id){
                let checkbox = this.checkbox;
                this.attrList.forEach(function(attrs){
                    if(attrs.id == id){
                        attrs.attrvals.forEach(function(attrvals){
                            let i = checkbox.length;
                            while (i--) {
                                if(checkbox[i] == attrvals.id){
                                    checkbox.remove(checkbox[i]);
                                }
                            }
                        });
                    }
                });
            },

            getCheckedCount(id){
                let count = 0;
                let checkbox = this.checkbox;
                this.attrList.forEach(function(attrs){
                    if(id == attrs.id){    //如果选中的是当前属性下
                        checkbox.forEach(function(id){
                            attrs.attrvals.forEach(function(attrvals){
                                if(id == attrvals.id){ count++; }
                            });
                        });
                        return;
                    }
                })
                return count;
            },
            getTotalCount(id){
                let count = 0;
                this.attrList.forEach(function(attrs){
                    if(id == attrs.id) {
                        count = attrs.attrvals.length;
                        return;
                    }
                })
                return count;
            },
            getAttrConditions(){
                let conditions = [];
                let checkAll = this.checkAll;
                let checkbox = this.checkbox;
                this.attrList.forEach(function(attrs){
                    if(checkAll[attrs.id]){
                        conditions.push({id:'all'+attrs.id , name:attrs.attrName + " | 所有"});
                        return;
                    }else{
                        attrs.attrvals.forEach(function(attrvals){
                            checkbox.forEach(function(id){
                                if(id == attrvals.id){
                                    conditions.push({id:attrvals.id , name:attrs.attrName + " | "+attrvals.attrValue});
                                }
                            });
                        });
                    }
                });
                return conditions;
            },
            showAttrConditions(){
                this.goodsAttrDialog = false;
                this.attrConditions = this.getAttrConditions();
            },
            removeAttrConditions(id){
                let checkbox = this.checkbox;
                let cancelAllCheckBox = this.cancelAllCheckBox;
                if("number" != typeof id && id.indexOf("all") >=0){
                    id = id.substring(id.indexOf("all")+3);
                    this.checkAll[id] = false;
                    cancelAllCheckBox(id);
                }else{
                    checkbox.forEach(function (checkboxId) {
                        if(id === checkboxId){
                            checkbox.remove(id);
                        }
                    })
                }
                this.refreshCheckBox();
                this.attrConditions = this.getAttrConditions();
            }
        },
        mounted() {
            this.initStore();
            this.search();
            this.searchStatistics();
            this.spuPrepare();
        }
    }
</script>