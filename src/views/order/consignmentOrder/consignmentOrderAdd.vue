<template>
    <section>
        <!--新增界面-->
            <el-form   label-width="120px" :label-position="labelPosition" ref="addForm" :model="addForm"  v-loading="listLoading"  :rules="addFormRules">
                <el-form-item label="所属仓库" prop="storeId">
                    <el-select v-model="storeList.value" placeholder="请选择仓库" @change="changeStore"   >
                        <el-option v-for="(item,index) in storeList.options" :key="item.id"   :label="item.storeName" :value="index" />
                    </el-select>
                </el-form-item>

                <el-form-item label="寄卖人" prop="consignerName">
                    <el-col :span="8">
                        <el-input  v-model="addForm.consignerName" placeholder="请填写姓名" ></el-input>
                    </el-col >
                </el-form-item>
                <el-form-item label="联系方式" prop="consignerPhone">
                    <el-col :span="8">
                        <el-input  v-model="addForm.consignerPhone" placeholder="请填写电话"></el-input>
                    </el-col >
                </el-form-item>

                <el-form-item label="邮政编码" prop="consignerCode">
                    <el-col :span="8">
                        <el-input  v-model="addForm.consignerCode" placeholder="请填写邮政编码"></el-input>
                    </el-col >
                </el-form-item>

                <el-form-item label="所在区域" prop="consignerAddress">
                    <template slot-scope="scope">
                        <el-select v-model="province.value" placeholder="请选择" style="width: 15%"  @change="initCity">
                            <el-option v-for="(item,index) in province.options" :key="item.code" :label="item.regionNameC" :value="index" />
                        </el-select>
                        <el-select v-model="city.value" placeholder="请选择" style="width: 15%" @change="initArea">
                            <el-option v-for="(item,index) in city.options" :key="item.code" :label="item.regionNameC" :value="index" />
                        </el-select>
                        <el-select v-model="area.value" placeholder="请选择" style="width: 15%">
                            <el-option v-for="(item,index) in area.options" :key="item.code" :label="item.regionNameC" :value="index"/>
                        </el-select>
                    </template>
                </el-form-item>

                <el-form-item label="寄卖人地址" prop="address">
                    <el-col :span="20">
                        <el-input  v-model="addForm.address" placeholder="详细地址"></el-input>
                    </el-col >
                </el-form-item>


                <!--     选择商品               -->
                <el-form-item  prop="productSelect">
                    <el-button type="primary" @click="selectProduct"  prop="productSelect">选择寄卖商品</el-button>
                </el-form-item>
                <!--已选择的商品信息列表-->
                <el-table :data="selectedProductList"  highlight-current-row style="width: 100%;" current-row-key="" border>
                    <!--<el-table-column type="index" label="商品序号"></el-table-column>-->
                    <el-table-column prop="spuCode" label="商品编号"    show-overflow-tooltip/>
                    <el-table-column prop="spuName" label="商品名称"    show-overflow-tooltip/>
                    <el-table-column prop="spuBrand" label="商品品牌"   show-overflow-tooltip/>
                    <el-table-column prop="wikiAttrsValue" label="属性" show-overflow-tooltip/>
                    <el-table-column prop="spuModel" label="型号" show-overflow-tooltip/>
                </el-table>

                <el-form-item >
                </el-form-item>

                <el-form-item label="商品品质" prop="qualityId">
                    <el-select v-model="qualityList.value" placeholder="请选择商品品质">
                        <el-option v-for="(item,index) in qualityList.options" :key="item.id"    :label="item.qualityName" :value="index" />
                    </el-select>
                </el-form-item>


                <el-form-item label="寄卖价格" prop="consignmentPrice">
                    <el-col :span="8">
                        <el-input  v-model="addForm.consignmentPrice" placeholder="请填写价格"></el-input>
                    </el-col >
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-col :span="16">
                        <el-input type="textarea":rows="3" v-model="addForm.remark" placeholder="请填写备注"></el-input>
                    </el-col>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align:right;">
                <el-button @click.native="addCancel">取 消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>


        <!--弹窗-->
        <el-dialog title="选择商品" v-model="selectProductVisibleFlag" :visible.sync="selectProductVisibleFlag">
            <el-form ref="searchForm" :model="searchForm" align="left" :inline="true"  class="demo-form-inline"  style="margin:10px;width:60%;min-width:600px;">
                <el-form-item label="" prop="orderSource">
                    <el-select v-model="searchForm.searchType" placeholder="请选择查询关键字">
                        <el-option label="商品编码" value="0" />
                        <el-option label="商品名称" value="1" />
                        <!--<el-option label="库存条码" value="库存条码"></el-option>-->
                    </el-select>
                </el-form-item>
                <el-form-item label="" prop="keyword2">
                    <el-input placeholder="请输入" v-model="searchForm.keyword"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary"  @click="handleCurrentChange(1)">搜索</el-button>
                </el-form-item>
            </el-form>
            <!--列表-->
            <el-table :data="productList"   style="width: 100%;" @row-dblclick="selectCurrentProduct" border>
                <el-table-column prop="spuCode" label="商品编号"  show-overflow-tooltip/>
                <el-table-column prop="spuName" label="商品名称"   show-overflow-tooltip/>
                <el-table-column prop="spuBrand" label="商品品牌"  show-overflow-tooltip/>
                <el-table-column prop="wikiAttrsValue" label="属性" show-overflow-tooltip/>
                <el-table-column prop="spuModel" label="型号" show-overflow-tooltip/>
              <!--  <el-table-column prop="appraisalResults" label="鉴定结果">
                </el-table-column>-->
            </el-table>

            <!--工具条-->
            <el-row :gutter="24"  style=";padding-top: 10px;">
                <el-col :span="24">
                    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
                                   :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" style="float: right">
                    </el-pagination>
                </el-col>
            </el-row>

        </el-dialog>

    </section>
</template>

<script>
    // import OrderUtil from '../../../common/js/OrderUtil';
    import {addConsignmentOrder,getRegion,getUserStoreList,getWikiList,getProductQualityList} from "../../../api/api";
    import OrderUtil from '../../../common/js/OrderUtil';
    // 导入组件
    export default {
        data: function () {
            return {
                listLoading: false,
                //仓库 storeList:{options: [{storeNo: "",storeName: "",id: 0}],value:0},
                storeList:{options: [],value:null},
                //质量 qualityList:{options:[{id:1,qualityName:""}],value:0},
                qualityList:{options:[],value:null},

                //省市区
                // area:{options: [{code: "0",regionNameC: "",id: 0}],value:null},
                province:{options:[],value:null},
                city:{options: [],value:null},
                area:{options: [],value:null},

                labelPosition: 'left',

                loading: false,
                addLoading: false,
                //新增寄卖订单form表单----------add
                addForm: {
                    storeId:'',
                    storeName:'',
                    storeNo:'',
                    consignerName: '',
                    consignerPhone: '',
                    consignerCode: '',
                    address: '',
                    consignerAddress:'',
                    spuCode:'',
                    wikiCode:'',
                    wikiAttrsValue:'',
                    spuName:'',  //商品名称
                    spuBrand:'',//商品品牌
                    className:'',//商品分类

                    qualityId:'',//商品品质id,即成色
                    qualityName:'',//商品品质id,即成色

                    consignmentPrice: '',
                    remark: '',

                    provinceCode: "",
                    cityCode: "",
                    areaCode: "",

                },
                //新增寄卖订单验证
                addFormRules: {
                    storeId: [{required: true, message: '请选所属仓库', trigger: 'blur'}],
                    consignerName: [{required: true, message: '请输入客户名称', trigger: 'blur'}, {max: 20, message: '长度不超过20个字符', trigger: 'blur' }],
                    consignerPhone: [{required: true, message: '请输入客户电话', trigger: 'blur'},  {pattern: /^1[3456789][0-9]{9}$/, message: '手机号格式错误' }],

                    consignerCode:[{max: 20, message: '长度不超过20个字符', trigger: 'blur' },{pattern: /^(\d)*$/, message: '邮编格式错误' }],

                    consignerAddress:[{ required: true, message: '请选择省市区' }],
                    address: [{required: true, message: '请输入客户详细地址', trigger: 'blur'}, {max: 100, message: '长度不超过100个字符', trigger: 'blur' }],

                    productSelect:[{required: true, message: '请选择商品'}],
                    qualityId: [{required: true, message: '请选择质量', trigger: 'blur'}],
                    consignmentPrice: [{required: true, message: '请输入客户寄卖价格', trigger: 'blur'}, {pattern: /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/, message: '价格数据格式错误0.00' }],
                    remark:[{max: 255, message: '长度不超过255个字符', trigger: 'blur' }]
                }
                ,
                //选择商品
                searchForm: {
                    searchType: "0",
                    keyword: '',
                },

                 productList:[],//供选择的商品信息列表
                selectedProductList:[],//已选择的商品信息列表
                selectProductVisibleFlag: false,//选择商品界面是否显示
                total: 0,
                pageNum: 1, //当前页码
                pageSize: 10,//页数

            }

        },
        methods: {

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
                this.addForm.qualityId = this.qualityList.options[this.qualityList.value].id+"";
                this.addForm.qualityName = this.qualityList.options[this.qualityList.value].qualityName;
            },
            initProvince(){
                getRegion({upperRegion:0}).then((res) => {
                    OrderUtil.handleResult(res,()=>{
                        if(res.data.length<=0){
                            return ;
                        }
                        this.province.options = res.data;
                        this.province.value = 0;
                        this.city={options: [],value:null};
                        this.area={options: [],value:null};
                        this.initCity();
                    },undefined,false);

                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },
            initCity(){
                let code= this.province.options[this.province.value].code;
                getRegion({upperRegion:code}).then((res) => {
                    OrderUtil.handleResult(res,()=>{
                        if(res.data.length<=0){
                            return ;
                        }
                        this.city.options = res.data;
                        this.city.value=0;
                        this.initArea();
                    },undefined,false);
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },
            initArea(){
                let code= this.city.options[this.city.value].code;
                getRegion({upperRegion:code}).then((res) => {
                    OrderUtil.handleResult(res,()=>{
                        if(res.data.length<=0){
                            return ;
                        }
                        this.area.options = res.data;
                        this.area.value=0;
                        this.addForm.consignerAddress='a';  // 验证通过使用
                    },undefined,false);
                }, (res) => { this.listLoading = false; } ).catch(() => {});
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
                        this.storeList.options = nameresult;
                        this.storeList.value  = 0;
                        this.changeStore();
                    },undefined,false);
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },
            //仓库选择
            changeStore(){
                this.addForm.storeId = this.storeList.options[this.storeList.value].id+"";
                this.addForm.storeName = this.storeList.options[this.storeList.value].storeName;
                this.addForm.storeNo = this.storeList.options[this.storeList.value].storeNo;
            },
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
            //点击搜索商品  getData
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
                //this.selectedProductList.unshift(row);
                this.selectedProductList=[]; //清空
                this.selectedProductList.push(row); //添加
                this.selectProductVisibleFlag = false; //隐藏
                this.addFormRules.productSelect[0].required=false;
                // this.$refs.addForm.validate(); //去除
            },
            //取消
            addCancel(){
                this.$router.push({path: '/consignmentOrder'});
            },
            //提交新增订单表单
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if(valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            let para = Object.assign({}, this.addForm);
                            delete para.address;
                            //省市区地址拼接
                            let consignerAddress = "";
                            try {
                                consignerAddress = this.province.options[this.province.value].regionNameC + "-" + this.city.options[this.city.value].regionNameC + "-" + this.area.options[this.area.value].regionNameC + "-" + this.addForm.address;
                                para.consignerAddress = consignerAddress;

                                para.provinceCode = this.province.options[this.province.value].code;
                                para.cityCode = this.city.options[this.city.value].code + "";
                                para.areaCode = this.area.options[this.area.value].code + "";
                            }
                            catch (err) {
                                this.$message({
                                    message: '地区选择有误',
                                    type: 'warning'
                                });
                                return;
                            }
                            if (this.selectedProductList.length <= 0) {
                                this.$message({
                                    message: '商品选择有误',
                                    type: 'warning'
                                });
                                return;
                            }

                            para.spuCode = this.selectedProductList[0].spuCode;//
                            para.wikiCode = this.selectedProductList[0].wikiCode;//
                            para.wikiAttrsValue = this.selectedProductList[0].wikiAttrsValue;//
                            para.spuName = this.selectedProductList[0].spuName;//商品名称
                            para.spuBrand = this.selectedProductList[0].spuBrand;//商品品牌
                            para.className = this.selectedProductList[0].className;
                            para.spuModel = this.selectedProductList[0].spuModel;
                            para.consignmentPrice=this.addForm.consignmentPrice;//价格

                            this.listLoading = true;
                            addConsignmentOrder(para).then((res) => {
                                this.listLoading = false;
                                OrderUtil.handleResult(res,()=>{
                                    this.$refs['addForm'].resetFields();
                                    this.addFormVisible = false;
                                    this.getData();
                                    this.selectedProductList = []; //清空
                                    this.$router.push({path: '/consignmentOrder'});
                                });

                            }, (res) => {
                                this.listLoading = false;
                            }).catch(() => {
                            });
                    });
                    }
                });
            },
            getData() {
                this.initProvince();
                this.getStoreList();
                this.getQualityList();
            },
        },
        created() {
            this.getData();
        }
    }

</script>

<style scoped>

</style>