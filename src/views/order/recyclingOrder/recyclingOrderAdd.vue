<template>
    <section>
        <!--新增界面-->
            <el-form   label-width="120px" :label-position="labelPosition" ref="addForm" :model="addForm"  v-loading="listLoading"  :rules="addFormRules">
                <el-form-item label="所属仓库" prop="storeId">
                    <el-select v-model="storeList.value" placeholder="请选择仓库" @change="changeStore"   >
                        <el-option v-for="(item,index) in storeList.options" :key="item.id"    :label="item.storeName" :value="index" />
                    </el-select>
                </el-form-item>

                <el-form-item label="客户姓名" prop="consignerName">
                    <el-col :span="8">
                        <el-input  v-model="addForm.consignerName" placeholder="请填写姓名" ></el-input>
                    </el-col >
                </el-form-item>
                <el-form-item label="联系电话" prop="consignerPhone">
                    <el-col :span="8">
                        <el-input  v-model="addForm.consignerPhone" placeholder="请填写电话"></el-input>
                    </el-col >
                </el-form-item>
                <!--     选择商品               -->
                <el-form-item  prop="productSelect">
                    <el-button type="primary" @click="selectProduct"  prop="productSelect">选择回收商品</el-button>
                </el-form-item>
                <!--已选择的商品信息列表-->
                <el-table :data="selectedProductList"  highlight-current-row style="width: 100%;" current-row-key="" border>
                    <el-table-column prop="spuCode" label="商品编码"   show-overflow-tooltip/>
                    <el-table-column prop="spuName" label="商品名称"   show-overflow-tooltip/>
                    <el-table-column prop="wikiAttrsValue" label="属性"   show-overflow-tooltip/>
                    <el-table-column prop="spuModel" label="型号"   show-overflow-tooltip/>
                    <el-table-column prop="spuBrand" label="品牌"   show-overflow-tooltip/>
                </el-table>

                <el-form-item label="商品品质" prop="qualityId" style="margin-top: 2%;">
                    <el-select v-model="qualityList.value" placeholder="请选择商品品质">
                        <el-option v-for="(item,index) in qualityList.options" :key="item.id"    :label="item.qualityName" :value="index" />
                    </el-select>
                </el-form-item>

                <el-form-item label="回收价格" prop="recyclingPrice">
                    <el-col :span="8">
                        <el-input  v-model="addForm.recyclingPrice" placeholder="请填写价格"></el-input>
                    </el-col >
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-col :span="16">
                        <el-input type="textarea":rows="3" v-model="addForm.remark" placeholder="请填写备注"></el-input>
                    </el-col>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer" style="float: right">
                <el-button @click.native="addCancel">取 消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提 交</el-button>
            </div>


        <!--弹窗-->
        <el-dialog title="选择商品" v-model="selectProductVisibleFlag" :visible.sync="selectProductVisibleFlag">
            <el-form ref="searchForm" :model="searchForm" align="left" :inline="true"  class="demo-form-inline"  style="margin:10px;width:60%;min-width:600px;">
                <el-form-item label="" prop="orderSource">
                    <el-select v-model="searchForm.searchType" placeholder="请选择查询关键字">
                        <el-option label="商品编码" value="0" />
                        <el-option label="商品名称" value="1" />
                    </el-select>
                </el-form-item>
                <el-form-item label="" prop="keyword2">
                    <el-input placeholder="请输入" v-model="searchForm.keyword"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary"  @click="selectProductByKey">搜索</el-button>
                </el-form-item>
            </el-form>
            <!--列表-->
            <el-table :data="productList"   style="width: 100%;" @row-dblclick="selectCurrentProduct" border>
                <el-table-column prop="spuCode" label="商品编码"   show-overflow-tooltip/>
                <el-table-column prop="spuName" label="商品名称"   show-overflow-tooltip/>
                <el-table-column prop="wikiAttrsValue" label="属性"   show-overflow-tooltip/>
                <el-table-column prop="spuModel" label="型号"   show-overflow-tooltip/>
                <el-table-column prop="spuBrand" label="品牌"   show-overflow-tooltip/>
            </el-table>

            <!--分页显示工具条-->
            <el-row :gutter="24"  style=";padding-top: 10px;">
                <el-col :span="24" style="margin-top: 10px">
                    <el-pagination
                            background
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="pageNum"
                            :page-sizes="[10, 20, 30, 40]"
                            :page-size="pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total" style="float: right">
                    </el-pagination>
                </el-col>
            </el-row>
        </el-dialog>


    </section>
</template>

<script>
    import {addOrderReclaim,getUserStoreList,getWikiList,getProductQualityList} from "../../../api/api";
    import OrderUtil from '../../../common/js/OrderUtil';

    // 导入组件
    export default {
        data: function () {

            var checkPrice = (rule, value, callback) => {
                var reg = new RegExp(/^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/);
                if(!reg.test(value)){
                    callback(new Error('请输入正确的价格'));
                }else {
                    callback();
                }
            };

            var checkMobile = (rule, value, callback) => {
                var reg = new RegExp(/^1[3456789]\d{9}$/);
                if (!reg.test(value)) {
                    callback(new Error('请确认手机号码是否填写正确'));
                } else {
                    callback();
                }
            };
            return {
                listLoading: false,
                storeList:{options: [{storeNo: "",storeName: "",id: 0}],value:0},//仓库
                qualityList:{options:[{id:1,qualityName:"q1"},{id:2,qualityName:"q2"}],value:0},//质量
                labelPosition: 'left',
                total: 0,
                pageNum: 1, //当前页码
                pageSize: 10,//页数
                loading: false,
                addLoading: false,
                //新增寄卖订单form表单----------add
                addForm: {
                    storeId:'',
                    storeName:'',
                    shopNo:'',
                    consignerName: '',
                    consignerPhone: '',

                    spuName:'',  //商品名称
                    spuBrand:'',//商品品牌
                    className:'',//商品分类

                    spuCode:'',//商品编码
                    spuModel:'',//商品编码
                    wikiCode:'',//商品基础信息编码

                    qualityId:'',//商品品质id,即成色
                    qualityName:'',//商品品质id,即成色

                    recyclingPrice: '',
                    remark: '',




                },
                //新增寄卖订单验证
                addFormRules: {
                    storeId: [{required: true, message: '请选所属仓库', trigger: 'blur'}],
                    consignerName: [
                        {required: true, message: '请输入客户名称', trigger: 'blur'},
                        {max: 20, message: '长度不超过20个字符', trigger: 'blur' }],
                    consignerPhone: [
                        { required: true, message: '请输入电话', trigger: 'blur'},
                        {validator: checkMobile, trigger: 'blur'},
                    ],
                    productSelect:[{required: true, message: '请选择商品'}],
                    qualityId: [{required: true, message: '请选择质量', trigger: 'blur'}],
                    recyclingPrice: [
                        { required: true, message: '请输入回收价格', trigger: 'blur'},
                        {validator: checkPrice, trigger: 'blur'},
                        {max: 12, message: '数值太大', trigger: 'blur' }
                    ],
                    remark:[{max: 255, message: '长度不超过255个字符', trigger: 'blur' }]
                }
                ,
                //选择商品
                searchForm: {
                    searchType: "",
                    keyword: ''
                },
                productList:[],//供选择的商品信息列表
                selectedProductList:[],//已选择的商品信息列表
                selectProductVisibleFlag: false,//选择商品界面是否显示
            }

        },
        methods: {
            //选择商品按钮,显示弹窗------
            selectProduct() {
                this.selectProductByKey();
                this.selectProductVisibleFlag = true;
            },
            //切换页数
            handleCurrentChange(val) {
                this.pageNum = val;
                this.selectProductByKey();
            },
            //处理分页条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.selectProductByKey();
            },

            //获取质量列表
            getQualityList() {
                let para = {
                    "qualityLabel": 0,
                    "qualityName": "string"
                };
                this.listLoading = true;
                getProductQualityList(para).then((res) => {
                    this.listLoading = false;
                    OrderUtil.handleResult(res,()=>{
                        if(res.data==undefined || res.data.length<=0){
                            this.qualityList={};
                            return ;
                        }
                        this.qualityList.options = res.data;
                        this.qualityList.value= 0;
                        this.changeQuality();
                    },undefined,false);
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },
            //品质选择
            changeQuality(){
                console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~pz");
                this.addForm.qualityId = this.qualityList.options[this.qualityList.value].id+"";
                this.addForm.qualityName = this.qualityList.options[this.qualityList.value].qualityName;
            },


            //获取仓库列表
            getStoreList() {
                let para = {};
                this.listLoading = true;
                getUserStoreList(para).then((res) => {
                    this.listLoading = false;
                    OrderUtil.handleResult(res,()=>{
                        if(res.data.length<=0){
                            return ;
                        }
                        var nameresult = res.data.filter(function(item,index,array){
                            return (item.id>0);
                        });
                        this.storeList.options =nameresult;
                        this.storeList.value  = 0;
                        this.changeStore();
                    },undefined,false);
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },
            //仓库选择
            changeStore(){
                this.addForm.storeId = this.storeList.options[this.storeList.value].id+"";
                this.addForm.storeName = this.storeList.options[this.storeList.value].storeName;
                this.addForm.shopNo = this.storeList.options[this.storeList.value].storeNo;
            },

            //点击搜索商品
            selectProductByKey() {
                let t = this.searchForm.searchType;
                let para =   {
                    spuCode:null,
                    spuName:null,
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize
                    }
                };
                if(t==0) {
                    para.spuCode = this.searchForm.keyword;
                }else if(t==1){
                    para.spuName = this.searchForm.keyword;
                }

                getWikiList(para).then((res) => {
                    this.listLoading = false;
                    OrderUtil.handleResult(res,()=>{
                        this.productList = res.data.list;
                        this.total = res.data.paginationInfo.total;
                    },undefined,false);

                });


            },
            //双击商品列表选择当前商品并关闭商品列表
            selectCurrentProduct(row) {
                row.number = 1;
                row.price = '';
                this.selectedProductList=[]; //清空
                this.selectedProductList.push(row); //添加
                this.selectProductVisibleFlag = false;
                this.addFormRules.productSelect[0].required=false;
            },


            //取消
            addCancel(){
                this.$router.push({path: '/orderRecycling'});
            },
            //提交新增订单表单
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if(valid){
                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        let para = Object.assign({}, this.addForm);
                        if(this.selectedProductList.length<=0){
                            this.$message({
                                message: '商品选择有误',
                                type: 'warning'
                            });
                            return;
                        }
                        console.log(para);
                        console.log( this.selectedProductList);
                        console.log( this.selectedProductList[0]);

                        para.recyclingPrice=this.addForm.recyclingPrice;//价格
                        para.spuName=this.selectedProductList[0].spuName;//商品名称
                        para.spuBrand=this.selectedProductList[0].spuBrand;//商品品牌
                        para.className=this.selectedProductList[0].className;
                        para.wikiCode=this.selectedProductList[0].wikiCode;
                        para.spuCode=this.selectedProductList[0].spuCode;
                        para.spuModel=this.selectedProductList[0].spuModel;
                        para.wikiAttrsValue=this.selectedProductList[0].wikiAttrsValue;

                        console.log( para);
                        console.log( JSON.stringify(para));

                        this.listLoading = true;

                     addOrderReclaim(para).then((res) => {
                        this.listLoading = false;
                        OrderUtil.handleResult(res,()=>{
                            this.$refs['addForm'].resetFields();
                            this.addFormVisible = false;
                            this.getData();
                            this.selectedProductList = []; //清空
                            this.$router.push({path: '/orderRecycling'});
                        });

                    }, (res) => {
                        this.listLoading = false;
                    }).catch(() => {});
                     });
                    }

                });

            },
            getData() {
                this.getStoreList();
                this.getQualityList();
            },
        },
        mounted() {
            this.getData();
        }
    }

</script>

<style scoped>

</style>