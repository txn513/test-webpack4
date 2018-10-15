<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form align="right" :inline="true"  class="demo-form-inline">
                <el-form-item >
                    <el-button type="primary" v-on:click="seachDate(enums.PRODUCT_SHELF.All)">全部商品({{countForm.all}})</el-button>
                </el-form-item>
                <el-form-item >
                    <el-button type="primary" v-on:click="seachDate(enums.PRODUCT_SHELF.SHELF)">已上架({{countForm.shelf}})</el-button>
                </el-form-item>
                <el-form-item >
                    <el-button type="primary" v-on:click="seachDate(enums.PRODUCT_SHELF.NOTSHELF)">未上架({{countForm.notShelf}})</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">

            <el-form align="right" :inline="true"  class="demo-form-inline">
                <el-form-item>
                    <select-group :num ="product.businessTypeCode" :select="isSelect" @getresult = 'getResultNumber'></select-group>
                </el-form-item>
                <el-form-item>
                    <el-cascader
                            v-model="product.classIdList"
                            placeholder="商品分类"
                            :options="classList"
                            :props="props"
                            :show-all-levels="false"
                            filterable
                            clearable
                            change-on-select
                    ></el-cascader>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="product.spuName" placeholder="商品名称" clearable maxlength="40"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="product.skuCode" placeholder="SKU" clearable maxlength="40"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="product.brandId" clearable filterable placeholder="品牌">
                        <el-option
                                v-for="item in brandList"
                                :key="item.id"
                                :value ="item.id"
                                :label="item.brandName">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="product.qualityId" clearable filterable placeholder="成色">
                        <el-option
                                v-for="item in qualityList"
                                :key="item.id"
                                :value ="item.id"
                                :label="item.qualityName">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" v-on:click="seach">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>


        <!--列表-->
        <el-table :data="list"  highlight-current-row v-loading="listLoading"
                  style="width: 100%;">
            <!--<el-table-column type="selection" ></el-table-column>-->

            <el-table-column prop="spuCode" label="商品编号"  sortable show-overflow-tooltip></el-table-column>
            <el-table-column  label="商品主图" >
                <template slot-scope="scope"><img  :src="getImgUrl(scope.row.imgPath)" style="width: 50px;height: 50px" ></template>
            </el-table-column>
            <el-table-column width="150" prop="skuCode" label="SKU"  sortable show-overflow-tooltip></el-table-column>
            <el-table-column :formatter="getBusinessTypeCode" label="业务类型"  sortable show-overflow-tooltip ></el-table-column>
            <el-table-column prop="spuName" label="商品名称"   sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="propertyValue" label="属性"  sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="qualityName" label="品质"  sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="className" label="分类"  sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="brandName" label="品牌"  sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="salesPrice" label="商品价格"  sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="shelfNumber" label="上架数量"  sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="stockNumber" label="库存数量"  sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="onSaleFlag" label="状态"   :formatter="formatOnSaleFlag" show-overflow-tooltip></el-table-column>
            <el-table-column v-if="isAuth('mpys:sku:update') || isAuth('mpys:sku:view')"  fixed="right" label="操作" width="220">
                <template slot-scope="scope">
                    <el-button v-if="isAuth('mpys:sku:update')" type="primary"  size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <!--<el-button v-if="isAuth('mpys:sku:view')" type="danger" size="mini" @click="handleQuery(scope.$index, scope.row)">查看</el-button>-->
                    <el-button v-if="isAuth('mpys:sku:saleflag:update') && scope.row.onSaleFlag == 0"  type="primary" size="mini" @click="handleSale(scope.$index, scope.row,1)">下架</el-button>
                    <el-button v-if="isAuth('mpys:sku:saleflag:update') && scope.row.onSaleFlag == 1" type="primary" size="mini" @click="handleSale(scope.$index, scope.row,0)">上架</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" style="margin-top: 10px">
            <!--<el-button v-if="isAuth('mpys:user:delete')" type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>-->
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


        <!--修改界面-->
        <el-dialog title="编辑" v-model="editFormVisible" :visible.sync="editFormVisible">

            <el-form  :model="form" label-width="100px" :rules="formRules" ref="form">
                <el-form-item label="商品名称">
                    {{form.spuName}}
                </el-form-item>

                <el-form-item label="商品副标题">
                    {{form.spuTitle}}
                </el-form-item>

                <el-form-item label="商品品牌" >
                    {{form.brandName}}
                </el-form-item>

                <el-form-item label="分类名称" >
                    {{form.className}}
                </el-form-item>

                <el-form-item label="属性" >
                    {{form.propertyValue}}
                </el-form-item>

                <el-form-item label="品质" >
                    {{form.qualityName}}
                </el-form-item>

                <el-form-item label="损伤部位" >
                    {{form.attrValue}}
                </el-form-item>

                <el-form-item label="备注" >
                    {{form.remark}}
                </el-form-item>

                <el-form-item label="是否校验库存" prop="checkStock">
                    <el-radio-group v-model="form.checkStock">
                        <el-radio class="radio" :label="1">不校验</el-radio>
                        <el-radio class="radio" :label="0">校验</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="售卖名称" prop="productSales">
                    <el-input v-model="form.productSales" placeholder="此名称为商品APP内显示名称" clearable maxlength="55"></el-input>
                </el-form-item>

                <el-form-item label="最高采购价">
                    ￥{{form.minPrice}}
                </el-form-item>

                <el-form-item label="最低采购价">
                    ￥{{form.maxPrice}}
                </el-form-item>

                <el-form-item label="价格" prop="salesPrice">
                    <el-input v-model="form.salesPrice" placeholder="销售价格" clearable maxlength="10"></el-input>
                </el-form-item>

                <el-form-item label="库存数量">
                    {{form.originStock}}
                </el-form-item>

                <el-form-item label="上架数量" prop="onStock">
                    <el-input v-model="form.onStock" placeholder="上架数量" clearable maxlength="10"></el-input>
                </el-form-item>

                <el-form-item label="是否热卖" prop="hotFlag">
                    <el-radio-group v-model="form.hotFlag">
                        <el-radio class="radio" :label="0">否</el-radio>
                        <el-radio class="radio" :label="1">是</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="销售保障" prop="protectId">
                    <el-select v-model="form.protectId" clearable filterable multiple placeholder="请选择">
                        <el-option
                                v-for="item in protectList"
                                :key="item.id"
                                :value ="item.id"
                                :label="item.protectName">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="轮播图片" prop="circleImgList">
                    <fileupload @getresult="getResult" :imglist = "imgList" :number="num" :type="type"></fileupload>
                </el-form-item>
                <el-form-item label="详情编辑" prop="detailsImgList">
                    <fileupload @getresult="getDetailsResult" :imglist = "detailsImg" :number="num" :type="type"></fileupload>
                </el-form-item>

                <el-form-item label="内容" >
                    <editor class="editor" :value="form.content" :isImage="!isImage" @input="getEditContent"></editor>
                </el-form-item>

            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

    </section>
</template>
<script>
    import {productSpuPrepareFun,productSkuListFun,productSkuDetailEditFun,productSkuChangeSaleFun,productSkuUpdateFun,productSkuCountFun,getStockUnitPrice,getBusinessGeneralList} from '../../api/api';
    import enums from '../../enums/enum.js'
    import fileupload from '@/components/fileUpload';
    import selectGroup from '@/components/selectGroup';
    import util from '@/common/js/util';
    import editor from '@/components/editor';
    export default {
        components: {
            fileupload,
            selectGroup,
            'editor':editor
        },
        data() {
            return {
                /**这个是上传图片的类型 1为上传普通图片 2为上传头像 3为上传商品图片  参数为1限制为只能上传一张2为多张**/
                type:"3",
                num:'2',
                imgList:[],
                detailsImg:[],
                isImage:false,

                enums :enums,
                /**页面查询数据**/
                isSelect: true,
                product: {
                    spuName:'',
                    skuCode:'',
                    brandId:'',
                    classId:'',
                    businessTypeCode:-1,
                    qualityId:'',
                    onSaleFlag:'',
                    classIdList:[],
                },
                /**页面展示数据**/
                countForm:{
                    all:0,
                    shelf:0,
                    notShelf:0,
                },
                businessList: [],
                list: [],
                /**分页**/
                total: 0,
                pageNum: 1,
                pageSize: 10,
                listLoading: false,
                status: 2,

                /**操作数据**/
                formVisible: false,
                editLoading: false,
                editFormVisible: false,

                brandList:[],//品牌列表
                classList:[],//分类列表
                qualityList:[],//质量列表
                protectList:[],//保障列表

                /**通用参数验证**/
                formRules: {
                    productSales: [{required: true, message: '请输入商品售卖名称', trigger: 'blur'}],
                    /*onStock: [{required: true, message: '请输入商品上架数量', trigger: 'blur'}],*/
                    protectId: [{required: true, message: '请选择商品保障属性', trigger: 'change'}],
                    circleImgList: [{required: true, message: '请选择轮播商品图片信息',trigger: 'change', type : 'array'}],
                    detailsImgList: [{required: true, message: '请选择商品详情图片信息',trigger: 'change', type : 'array'}],
                },
                /**分类渲染模板**/
                props: {
                    value: 'id',
                    label: 'name',
                    children: 'children',
                },

                /**界面数据**/
                form: {
                    skuId:'',
                    protectId:[],
                    checkStock:'',
                    spuName:'',
                    spuTitle:'',
                    brandName:'',
                    className:'',
                    propertyValue:'',
                    qualityName:'',
                    attrValue:'',
                    remark:'',
                    productSales:'',
                    suggestPrice:'',
                    salesPrice:'',
                    originStock:'',
                    onStock:'',
                    hotFlag:'',
                    circleImgList:[],
                    detailsImgList:[],
                    salesPrice:'',
                    minPrice:'',
                    maxPrice:'',
                    businessTypeCode:'',
                    content:''
                }

            }
        },
        methods: {
            /**返回值**/
            getResultNumber(result){
                this.product.businessTypeCode = result ;
            },
            /**获取类型**/
            getBusinessTypeCode(row){
                return util.formatGoodsName(row.businessTypeCode);
            },
            /**图片拼接**/
            getImgUrl(result){
                return this.GLOBAL.getImgUrl(result);
            },

            /**获取系统类型**/
            getBusiness() {
                this.listLoading = true;
                getBusinessGeneralList().then((res) => {
                    this.listLoading = false;
                this.businessList = res.data;
            }, (res) => { this.listLoading = false; } ).catch(() => {});
            },

            /**返回的轮播图片地址**/
            getResult (result){
                //返回的图片地址
                if(result.length != 0){
                    this.form.circleImgList = [];
                    for(let item of result){
                        this.form.circleImgList.push({productId:this.form.skuId,imgPath:item.relativeUrl,imgStatus:1,imgType:3})
                    }
                }
            },

            /**返回的详情图片地址**/
            getDetailsResult (result){
                //返回的图片地址
                if(result.length != 0){
                    this.form.detailsImgList = [];
                    for(let item of result){
                        this.form.detailsImgList.push({productId:this.form.skuId,imgPath:item.relativeUrl,imgStatus:1,imgType:2})
                    }
                }
            },
            /**审核状态转换**/
            formatOnSaleFlag (row, column) {
                return row.onSaleFlag === 0 ? '上架中' : '下架中';
            },
            /**编辑**/
            editSubmit: function () {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认修改吗？', '提示', {}).then(() => {
                            if(this.form.checkStock == 0 && this.form.businessTypeCode == 4){
                               if(this.form.originStock < 1){
                                   this.$message({
                                       message: '校验状态必须要有库存!',
                                       type: 'error'
                                   });
                                   return
                               }
                            }
                            let para = Object.assign({}, this.form);
                            para.protectId = this.form.protectId.join(',');
                            para.stock = this.form.onStock;
                            para.hotFlag = this.form.hotFlag;
                            para.productSales = this.form.productSales;
                            para.price = this.form.salesPrice;
                            para.id = this.form.skuId;
                            para.circleImgList = this.form.circleImgList;
                            para.detailsImgList = this.form.detailsImgList;
                            para.productContent = {content:this.form.content,productId:this.form.skuId,imgPath:'',imgStatus:1,imgType:4};
                            this.editLoading = true;
                            productSkuUpdateFun(para).then((res) => {
                                this.editLoading = false;
                                if (this.GLOBAL.isResonseSuccess(res)) {
                                    this.$message({
                                        message: '修改成功',
                                        type: 'success'
                                    });
                                    this.$refs['form'].resetFields();
                                    this.editFormVisible = false;
                                    this.getProduct(this.status);
                                }
                            });
                        });
                    }
                });
            },
            /**上下架操作**/
            handleSale (index, row , status) {
                let tatle = "上架";
                if(status === 1 ){
                    tatle= "下架";
                }

                this.$confirm('确认'+tatle+'该商品信息吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let para = {id: row.id,
                                 onSaleFlag: status,
                                 businessTypeCode: row.businessTypeCode};
                    productSkuChangeSaleFun(para).then((res) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(res)) {
                            this.$message({
                                message: tatle+'成功',
                                type: 'success'
                            });
                            this.getProductCount();
                            this.getProduct(this.status);
                        }
                    });
                }).catch(() => {

                });
            },
            /**获取商品配件列表**/
            getProduct(status) {
                let para = {
                    spuName : this.product.spuName,
                    skuCode : this.product.skuCode,
                    brandId : this.product.brandId,
                    qualityId : this.product.qualityId,
                    classId : this.product.classIdList[this.product.classIdList.length-1],
                    onSaleFlag  : status,
                    businessTypeCode : this.product.businessTypeCode,
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    }
                };
                this.listLoading = true;
                productSkuListFun(para).then((res) => {
                    this.listLoading = false;
                    this.total = res.data.paginationInfo.total;
                    this.list = res.data.list;
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },
            /**显示编辑界面**/
            handleEdit(index, row) {
                this.form.circleImgList = [];
                this.form.detailsImgList = [];
                this.imgList = [];
                this.detailsImg = [];
                this.editFormVisible = true;
                this.editLoading = true;
                this.form.content = '';
                this.getProductEditById(row);

            },
            /**查询当前价格**/
            getProductStockUnitPrice(skuCode) {
                getStockUnitPrice({id: skuCode}).then((res) => {
                    this.editLoading = false;
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.$set(this.form,"minPrice",res.data.minPrice);
                        this.$set(this.form,"maxPrice",res.data.maxPrice);
                    }
                }, (res) => { this.editLoading = false; } ).catch(() => {});
            },
            /**查询当前修改前商品数据**/
            getProductEditById(row) {
                productSkuDetailEditFun({id: row.id}).then((res) => {
                    this.editLoading = false;
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.getProductStockUnitPrice(row.skuCode);

                        this.form = Object.assign({},res.data);
                        let protectId = this.form.protectId.split(",");
                        if(!res.data.protectId){
                            this.form.protectId = [];
                        }else{
                            for(let i = 0; i < protectId.length; i++){
                                protectId [i] = parseInt(protectId [i]);
                            }
                            this.form.protectId =protectId;
                        }
                        this.form.circleImgList = res.data.circleImageList;
                        this.form.detailsImgList = res.data.detailsImgList;
                        if(res.data.productContent){
                            this.form.content = res.data.productContent.content;
                        }
                        if(this.form.circleImageList){
                            for(let i = 0; i < this.form.circleImageList.length; i++){
                                this.imgList.push({name:"",url:this.GLOBAL.getImgUrl(this.form.circleImageList[i].imgPath),relativeUrl:this.form.circleImageList[i].imgPath})
                            }
                        }
                        if( this.form.detailsImgList){
                            for(let i = 0; i < this.form.detailsImgList.length; i++){
                                this.detailsImg.push({name:"",url:this.GLOBAL.getImgUrl(this.form.detailsImgList[i].imgPath),relativeUrl:this.form.circleImageList[i].imgPath})
                            }
                        }

                    }
                }, (res) => { this.editLoading = false; } ).catch(() => {});
            },
            /**获取当前商品需要得初始化数据**/
            spuPrepare() {
                productSpuPrepareFun().then((res) => {
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.classList = res.data.classTree;
                        this.brandList = res.data.brandList;
                        this.qualityList = res.data.qualityList;
                        this.protectList = res.data.protectList;
                    }
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },
            /**查询页面统计数据**/
            getProductCount () {
                productSkuCountFun().then((res) => {
                    this.listLoading = false;
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.countForm = res.data;
                    }
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },
            /**查询使用**/
            seachDate(status){
                this.status = status;
                this.handleCurrentChange(1);
            },
            seach(){
                this.status = enums.PRODUCT_SHELF.All;
                this.handleCurrentChange(1);
            },
            /**分页**/
            handleSizeChange(val) {
                this.pageSize = val;
                this.getProduct(this.status);
            },
            handleCurrentChange(val) {
                this.pageNum = val;
                this.getProduct(this.status);
            },
            getEditContent(content){
                this.form.content = content;
            },
        },
        mounted() {
            this.getBusiness();
            this.spuPrepare();
            this.getProduct(enums.PRODUCT_SHELF.All);
            this.getProductCount();
        }
    }
</script>
<style>

</style>