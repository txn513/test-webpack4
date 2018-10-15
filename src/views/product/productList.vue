<template>
    <section>
        <!--工具条-->
        <!--<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form align="right" :inline="true"  class="demo-form-inline">
                <el-form-item >
                    <el-button type="primary" v-on:click="getProduct(enums.PRODUCT_CODE.All)">全部商品</el-button>
                </el-form-item>
                <el-form-item >
                    <el-button type="primary" v-on:click="getProduct(enums.PRODUCT_CODE.PASSED)">已通过{{countForm.passed}}</el-button>
                </el-form-item>
                <el-form-item >
                    <el-button type="primary" v-on:click="getProduct(enums.PRODUCT_CODE.PENDING)">待审核{{countForm.pending}}</el-button>
                </el-form-item>
                <el-form-item >
                    <el-button type="primary" v-on:click="getProduct(enums.PRODUCT_CODE.NOTPASSED)">未通过{{countForm.notPassed}}</el-button>
                </el-form-item>
            </el-form>
        </el-col>-->

        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">

            <el-form align="right" :inline="true"  class="demo-form-inline">
                <el-form-item label="" prop="businessTypeCode">
                    <template>
                        <select-group :num ="product.businessTypeCode" :select="isSelect" @getresult = 'getResultNumber'></select-group>
                    </template>
                </el-form-item>
                <el-form-item label="">
                    <el-input style="width: 150px" v-model="product.spuName" placeholder="商品名称" clearable maxlength="40"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-input style="width: 150px"  v-model="product.spuCode" placeholder="商品编码" clearable maxlength="40"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-input style="width: 150px"  v-model="product.spuModel" placeholder="型号" clearable maxlength="40"></el-input>
                </el-form-item>
                <el-form-item label="" prop="classId">
                    <el-cascader
                            style="width: 150px"
                            v-model="classIdList"
                            placeholder="商品分类"
                            :options="classList"
                            :props="props"
                            :show-all-levels="false"
                            filterable
                            clearable
                            change-on-select
                    ></el-cascader>
                </el-form-item>
                <el-form-item label="" prop="brandId">
                    <el-select style="width: 150px"  v-model="product.brandId" clearable filterable placeholder="商品品牌">
                        <el-option
                                v-for="item in brandList"
                                :key="item.id"
                                :value ="item.id"
                                clearable
                                :label="item.brandEngName">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" v-on:click="seachDate">查询</el-button>
                </el-form-item>
                <el-form-item label="">
                    <el-button v-if="isAuth('mpys:product:insert')" type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <tree-product :listLoading = 'listLoading' :columns="columns" :tree-structure="true"  :data-source="dataSource"
                      @handleQuery="handleQuery" @handleEdit="handleEdit" @handleAudit="handleAudit"  @handleDelete="handleDel"
                      @handleDeleteSpu="handleDeleteSpu"
                      @handleAuditBy="handleAuditBy" ></tree-product>


        <!--工具条-->
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

        <!--新增界面-->
        <el-dialog title="新增" v-model="addFormVisible" :visible.sync="addFormVisible">

            <el-form :model="addForm" label-width="100px" :rules="formRules" ref="addForm">

                <el-form-item label="业务类型" prop="businessTypeCode">
                    <template>
                        <select-group-add :num ="addForm.businessTypeCode"  :select="isAddSelect" @getresult = 'getAddResultNumber'></select-group-add>
                    </template>
                </el-form-item>

                <el-form-item label="商品分类" prop="classIdList">
                    <el-cascader
                            v-model="addForm.classIdList"
                            placeholder="试试搜索：分类"
                            :options="classTree"
                            :props="props"
                            filterable
                            :disabled="classDisabled"
                            change-on-select
                            @change="handleClassChange"
                    ></el-cascader>
                </el-form-item>

                <el-form-item label="商品名称" prop="spuName">
                    <el-input v-model="addForm.spuName" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="商品副标题" prop="spuTitle">
                    <el-input v-model="addForm.spuTitle" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="商品品牌" prop="brandId">
                    <el-select v-model="addForm.brandId" clearable filterable placeholder="请选择">
                        <el-option
                                v-for="item in brandList"
                                :key="item.id"
                                :value ="item.id"
                                :label="item.brandEngName">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="型号" prop="spuModel">
                    <el-input v-model="addForm.spuModel" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="是否测试" prop="testDataFlag">
                    <el-radio-group v-model="addForm.testDataFlag">
                        <el-radio class="radio" :label="1">是</el-radio>
                        <el-radio class="radio" :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="商品主图" prop="imgPath" >
                    <fileupload @getresult="getResult" :imglist = "imgList" :number="num" :type="type"></fileupload>
                </el-form-item>

                <el-form-item label="商品属性" prop="attrList">
                    <el-form-item v-for="item in attrList" :key="item.id" :label="item.attrName" prop="attrList" >
                        <el-checkbox v-for="itemInner in item.attrvals" :key="itemInner.id" v-model="itemInner.checked"  @change="handleAttrCheckedChange">{{itemInner.attrValue}}</el-checkbox>
                    </el-form-item>
                </el-form-item>

                <el-form-item label="商品信息">
                    <div v-for="item in skuList">
                        <el-row :gutter="1" type="flex" style="margin-bottom: 5px">
                            <el-col>{{item.skuAttrsDesc}}</el-col>
                        </el-row>
                    </div>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>



        <!--修改界面-->
        <el-dialog title="修改" v-model="editFormVisible" :visible.sync="editFormVisible">

            <el-form  :model="editForm" label-width="100px" :rules="formRules" ref="editForm">

                <el-form-item label="业务类型" prop="businessTypeCode">
                    <template>
                        <select-group-add :num ="editForm.businessTypeCode" :select="isEditSelect" @getresult = 'getEditResultNumber'></select-group-add>
                    </template>
                </el-form-item>

                <el-form-item label="商品分类" prop="classIdList">
                    <el-cascader
                            v-model="editForm.classIdList"
                            placeholder="试试搜索：分类"
                            :options="classList"
                            :props="props"
                            filterable
                            change-on-select
                            disabled
                    ></el-cascader>
                </el-form-item>
                <el-form-item label="商品名称" prop="spuName">
                    <el-input v-model="editForm.spuName" auto-complete="off" ></el-input>
                </el-form-item>

                <el-form-item label="商品副标题" prop="spuTitle">
                    <el-input v-model="editForm.spuTitle" auto-complete="off" ></el-input>
                </el-form-item>

                <el-form-item label="是否测试" prop="testDataFlag">
                    <el-radio-group v-model="editForm.testDataFlag">
                        <el-radio class="radio" :label="1">是</el-radio>
                        <el-radio class="radio" :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="型号" prop="spuModel">
                    <el-input v-model="editForm.spuModel" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="商品品牌" prop="brandId">
                    <el-select v-model="editForm.brandId" clearable filterable placeholder="请选择">
                        <el-option
                                v-for="item in brandList"
                                :key="item.id"
                                :value ="item.id"
                                :label="item.brandEngName">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="商品主图" prop="imgPath">
                    <fileupload @getresult="getResult" :imglist = "imgList" :number="num" :type="type"></fileupload>
                </el-form-item>

                <el-form-item label="商品属性" prop="attrList">
                    <el-form-item :label="item.attrName" prop="attrList" v-for="item in attrList" :key="item.id">
                        <el-checkbox v-model="itemInner.checked" :disabled="itemInner.disable" v-for="itemInner in item.attrvals" :key="itemInner.id" @change="handleAttrCheckedChange">{{itemInner.attrValue}}</el-checkbox>
                    </el-form-item>
                </el-form-item>

                <el-form-item label="商品信息">
                    <div v-for="item in originSkuList">
                        <el-row :gutter="1" type="flex" style="margin-bottom: 5px">
                            <el-col>{{item.skuAttrsDesc}}</el-col>
                        </el-row>
                    </div>
                </el-form-item>

                <el-form-item label="商品sku">
                    <div v-for="item in skuList">
                        <el-row :gutter="1" type="flex" style="margin-bottom: 5px">
                            <el-col>{{item.skuAttrsDesc}}</el-col>
                        </el-row>
                    </div>
                </el-form-item>

            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">保存</el-button>
                <el-button @click.native="editFormVisible = false">取消</el-button>
            </div>
        </el-dialog>




        <!--查看页面-->
        <el-dialog title="查看" v-model="queryFormVisible" :visible.sync="queryFormVisible">

            <el-form  :model="queryForm" label-width="100px" >

                <el-form-item label="业务类型" prop="businessTypeCode">
                    <template>
                        <select-group :num ="queryForm.businessTypeCode" :select="isQuerySelect" @getresult = 'getQueryResultNumber'></select-group>
                    </template>
                </el-form-item>

                <el-form-item label="商品分类">
                    <el-input v-model="queryForm.className" auto-complete="off" :readonly="true"></el-input>
                </el-form-item>
                <el-form-item label="商品名称">
                    <el-input v-model="queryForm.spuName" auto-complete="off" :readonly="true"></el-input>
                </el-form-item>

                <el-form-item label="商品副标题">
                    <el-input v-model="queryForm.spuTitle" auto-complete="off" :readonly="true"></el-input>
                </el-form-item>

                <el-form-item label="商品品牌" >
                    <el-input v-model="queryForm.brandName" auto-complete="off" :readonly="true"></el-input>
                </el-form-item>

                <el-form-item label="商品主图">
                    <template slot-scope="scope">
                        <img style="width: 150px;height: 150px" :src="imgList[0].url" class="avatar" >
                    </template>
                </el-form-item>

                <!--<el-form-item label="商品属性">
                    <template>
                        <el-table
                                :data="queryForm.attrList"
                                border>
                                <el-table-column v-for="(column) in queryForm.attrList"
                                                 :label="column.attrName" >
                                    <template slot-scope="scope">
                                        {{column.attrvals[scope.$index].attrValue}}
                                    </template>
                                </el-table-column>
                        </el-table>
                    </template>
                </el-form-item>-->

                <el-form-item label="商品信息">
                    <div v-for="item in originSkuList">
                        <el-row :gutter="1" type="flex" style="margin-bottom: 5px">
                            <el-col>{{item.skuAttrsDesc}}</el-col>
                        </el-row>
                    </div>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="queryFormVisible = false">返回</el-button>
            </div>
        </el-dialog>

        <!--查看审核页面-->
        <el-dialog title="审核信息" v-model="queryAuditFormVisible" :visible.sync="queryAuditFormVisible">
            <!--列表-->
            <el-table :data="queryAuditForm"  height="500" highlight-current-row v-loading="listLoading"
                      style="width: 100%;">
                <el-table-column prop="auditTime" label="审核时间"   ></el-table-column>
                <el-table-column prop="auditById" label="审核人"   ></el-table-column>
                <el-table-column prop="auditFlag" label="审核状态"  sortable :formatter="formatAudit"></el-table-column>
                <el-table-column prop="remark" label="备注"   ></el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="queryAuditFormVisible = false">返回</el-button>
            </div>
        </el-dialog>

        <!--审核操作-->
        <el-dialog title="审核" v-model="auditFormVisible" :visible.sync="auditFormVisible">
            <el-form  :model="auditForm" label-width="100px" :rules="auditFormRules" ref="auditForm">
                <el-form-item label="审核信息" prop="remark">
                    <el-input type="textarea"  v-model="auditForm.remark" auto-complete="off" clearable maxlength="255"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetForm('auditForm')">重置</el-button>
                <el-button @click.native="auditFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="handleAuditById(2)" :loading="addLoading">审核通过</el-button>
                <el-button type="primary" @click.native="handleAuditById(1)" :loading="addLoading">审核不通过</el-button>
            </div>
        </el-dialog>

    </section>
</template>
<script>
    import {TreeProduct} from '../../components/treeTable'
    import {productBrandListByBusinessIdFun,productClassTreeByBusinessFun,productSpuListFun,productSpuPrepareFun,productSpuListAttrsByClassIdFun,productSpuDetailFun,productSpuInsertFun,productSpuUpdateFun,productSpuAuditFun} from '../../api/api';
    import {productSpuDeleteBySkuIdFun,productSpuAuditSkuIdFun,productSpuDetailEditFun,productSpuDeleteBySpuIdFun} from '../../api/api';
    import enums from '../../enums/enum.js'
    import fileupload from '@/components/fileUpload';
    import selectGroup from '@/components/selectGroup';
    import selectGroupAdd from '@/components/selectGroupAdd';
    export default {
        components: {
            TreeProduct,
            fileupload,
            selectGroup,
            selectGroupAdd
        },
        data() {
        return {
            /**这个是上传图片的类型 1为上传普通图片 2为上传头像 3为上传商品图片  参数为1限制为只能上传一张2为多张**/
            type:"3",
            num:'1',
            imgList:[
            ],
            enums :enums,

            /**页面查询数据**/
            isSelect: true,
            isAddSelect: true,
            isQuerySelect: false,
            isEditSelect: false,
            classDisabled: true,
            product: {
                spuName:'',
                spuCode:'',
                spuModel:'',
                brandId:'',
                classId:'',
                auditFlag:'',
                businessTypeCode:-1,
            },
            dataSource: [],
            total: 0,
            pageNum: 1, //当前页码
            pageSize: 10,//页数
            listLoading: false,
            columns: [
                {dataIndex: "spuCode", text: "商品编码"},
                {dataIndex: "mainImgPath", text: "商品图片"},
                {dataIndex: "businessTypeCode", text: "业务类型"},
                {dataIndex: "spuName", text: "商品名称"},
                {dataIndex: "spuModel", text: "商品型号"},
                {dataIndex: "brandName", text: "品牌"},
                {dataIndex: "className", text: "分类"},
                /*{dataIndex: "property", text: "属性"},*/
                {dataIndex: "wikCode", text: "信息编码"},
                {dataIndex: "propertyValue", text: "属性"},
                /*{dataIndex: "delete", text: "删除操作"},*/
                ],

            /**分类渲染模板**/
            props: {
                value: 'id',
                label: 'name',
                children: 'children',
            },
            classIdList:[],
            brandList:[],//品牌列表
            classList:[],//分类列表
            auditFormVisible: false,//审核界面是否显示
            editFormVisible: false,//编辑界面是否显示
            queryFormVisible: false,//查看界面是否显示
            queryAuditFormVisible: false,//查看审核界面是否显示
            editLoading: false,
            addFormVisible: false,//新增界面是否显示
            addLoading: false,
            auditLoading: false,

            auditFormRules : {
                remark: [{required: true, message: '请输入审核信息', trigger: 'blur'}],
            },

            formRules: {
                classIdList: [{required: true, message: '请选择商品分类', trigger: 'change' , type : 'array'}],
                spuName: [{required: true, message: '请输入商品名称', trigger: 'blur'}],
                /*spuTitle: [{required: true, message: '请输入商品副标题', trigger: 'blur'}],*/
                brandId: [{required: true, message: '请选择商品品牌', trigger: 'change'}],
                businessTypeCode: [{required: true, message: '请选择业务类型', trigger: 'blur'}],
                /*spuModel: [{required: true, message: '请输入型号', trigger: 'blur'}],*/
                /*imgPath: [{required: true, message: '请选择商品主图', trigger: 'blur'}],*/
                /*attrList: [{required: true, message: '请选择商品属性', trigger: 'blur'}],*/
            },
            /**查看页面数据**/
            queryForm: {
                className:'',
                spuName:'',
                spuTitle:'',
                brandName:'',
                attrList:[],
                businessTypeCode:'',
            },
            /**审核页面数据**/
            auditForm: {
                skuId:'',
                remark:'',
            },

            countForm:{
                passed:'',
                pending:'',
                notPassed:'',
            },
            //新增界面数据
            addForm: {
                classIdList:[],
                classId:'',
                spuName:'',
                spuTitle:'',
                spuCode:'',
                brandId:'',
                remark:'',
                spuModel:'',
                testDataFlag:0,
                businessTypeCode:0
            },
            businessTypeCode: -1,

            //编辑界面数据
            editForm: {
                classId:0,
                spuName:'',
                spuTitle:'',
                spuCode:'',
                brandId:'',
                remark:'',
                classIdList:[],
                spuModel:'',
                testDataFlag:0,
                businessTypeCode:'',
            },
            //审核界面数据
            queryAuditForm:[],
            attrList:[],
            selfAttrList:[],
            skuList:[],
            originSkuList:[],
            originImage:{
              id:0,
              imageUrl:''
            },
            attrCheckedList:[],
            classTree:[],
        }
    },
    methods: {
        /**返回值**/
        getResultNumber(result){
            this.product.businessTypeCode = result ;
            this.businessTypeCode = result;
            this.product.brandId = 0;
            this.businessTypeCode = result;
            this.classIdList = [];
            this.getBrandListByBusinessId();
            this.getClassTree();
        },

        /**返回值**/
        getAddResultNumber(result){
            this.addForm.businessTypeCode = result ;
            this.businessTypeCode = result ;
            this.addForm.brandId = 0;
            if(!result){
                this.classDisabled = true;
            }else{
                this.classDisabled = false;
            }
            this.getClassTree();
            this.getBrandListByBusinessId();
        },

        /**返回值**/
        getQueryResultNumber(result){
            this.queryForm.businessTypeCode = result ;
            this.businessTypeCode = result ;
            this.getBrandListByBusinessId();
        },

        /**返回值**/
        getEditResultNumber(result){
            this.editForm.businessTypeCode = result ;
            this.businessTypeCode = result ;
            this.getBrandListByBusinessId();
        },
        /**图片拼接**/
        getImgUrl(result){
            return this.GLOBAL.getImgUrl(result);
        },

        /**返回的图片地址**/
        getResult (result){
            //返回的图片地址
            if(result.length != 0){
                for(let item of result){
                    this.originImage.imageUrl = item.relativeUrl;
                }
            }
        },
        /**审核状态转换**/
        formatAudit (row, column) {
            return row.auditFlag === 0 ? '未审核' : row.auditFlag === 1 ? '审核不通过' : '审核通过';
        },

        /**获取商品配件列表**/
        getProduct(status) {
            let para = {
                spuName : this.product.spuName,
                spuCode : this.product.spuCode,
                spuModel : this.product.spuModel,
                brandId : this.product.brandId,
                classId : this.classIdList[this.classIdList.length-1],
                auditFlag  : status,
                businessTypeCode : this.product.businessTypeCode,
                pageInfo: {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                }
            };
            this.listLoading = true;
            productSpuListFun(para).then((res) => {
                this.listLoading = false;
                this.total = res.data.paginationInfo.total;
                this.dataSource = res.data.list;
            }, (res) => { this.listLoading = false; } ).catch(() => {});
        },

        /**获取当前商品需要得初始化数据**/
        spuPrepare () {
            // productSpuPrepareFun().then((res) => {
            //     if (this.GLOBAL.isResonseSuccess(res)) {
            //         this.brandList = res.data.brandList;
            //     }
            // }, (res) => { this.listLoading = false; } ).catch(() => {});
        },

        /**查看spu商品**/
        handleQuery (index, row) {
            this.queryFormVisible = true;
            this.getProductById(row.spuId);
        },
        getProductById (id) {
            productSpuDetailFun({id: id}).then((res) => {
                if (this.GLOBAL.isResonseSuccess(res)) {
                    this.queryForm = res.data;
                    this.originSkuList = [];
                    for (let i = 0; i < res.data.wikiList.length; i++) {
                        this.originSkuList.push({
                            id : res.data.wikiList[i].id,
                            skuAttrs : res.data.wikiList[i].property,
                            skuAttrsDesc : res.data.wikiList[i].propertyValue,
                        });
                    }
                    this.imgList = [];
                    this.imgList.push({name:"",url:this.GLOBAL.getImgUrl(this.queryForm.imgPath),relativeUrl:this.queryForm.imgPath});
                }
            }, (res) => { this.listLoading = false; } ).catch(() => {});
        },

        /**查询页面统计数据**/
        getProductCount () {
            productSpuCountFun().then((res) => {
                this.listLoading = false;
                if (this.GLOBAL.isResonseSuccess(res)) {
                    this.countForm = res.data;
                }
            }, (res) => { this.listLoading = false; } ).catch(() => {});
        },

        /**审核查看页面**/
        handleAudit (index, row) {
            this.queryAuditFormVisible = true;
            this.getProductAuditById(row.id);
        },
        getProductAuditById: function(id) {
            productSpuAuditFun({id: id}).then((res) => {
                this.listLoading = false;
                if (this.GLOBAL.isResonseSuccess(res)) {
                    this.queryAuditForm = res.data;
                }
            }, (res) => { this.listLoading = false; } ).catch(() => {});
        },

        /**审核页面**/
        handleAuditBy (index, row) {
            this.auditFormVisible = true;
            this.auditForm.skuId = row.id;
        },
        handleAuditById (auditFlag) {
            this.$confirm('确认审核该商品信息吗?', '提示', {
                type: 'warning'
            }).then(() => {
                this.auditLoading = true;
                let para = this.auditForm;
                para.auditFlag = auditFlag,
                productSpuAuditSkuIdFun(para).then((res) => {
                    this.auditLoading = false;
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.$message({
                            message: '审核操作成功',
                            type: 'success'
                        });
                        this.$refs['auditForm'].resetFields();
                        this.auditFormVisible = false;
                        this.getProduct(enums.PRODUCT_CODE.All);
                    }
                });
            }).catch(() => {
            });
        },

        /**删除**/
        handleDel (index, row) {
            this.$confirm('确认删除该子商品信息吗?', '提示', {
                type: 'warning'
            }).then(() => {
                this.listLoading = true;
                let para = {id: row.id};
                productSpuDeleteBySkuIdFun(para).then((res) => {
                    this.listLoading = false;
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getProduct(enums.PRODUCT_CODE.All);
                    }
                });
            }).catch(() => {

            });
        },

        /**删除Spu**/
        handleDeleteSpu (index, row) {
            this.$confirm('确认删除该整个商品信息吗?', '提示', {
                type: 'warning'
            }).then(() => {
                this.listLoading = true;
                let para = {id: row.spuId};
                productSpuDeleteBySpuIdFun(para).then((res) => {
                    this.listLoading = false;
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getProduct(enums.PRODUCT_CODE.All);
                    }
                });
            }).catch(() => {

            });
        },

        /**新增操作**/
        handleAdd () {
            this.imgList =[],
            this.classDisabled = true;
            this.addFormVisible = true;
            this.attrList = [];
            this.addForm.classIdList = [];
            this.addForm.businessTypeCode = 0;
            this.skuList = [];
            this.addForm.classIdList = [];
            this.originSkuList = [];
            this.brandList = [];
        },

        /**根据分类读取属性**/
        handleClassChange (value) {
            this.listAttrsByClassId(value[value.length - 1]);
            this.skuList = [];
        },
        listAttrsByClassId (id) {
            console.log(id)
            productSpuListAttrsByClassIdFun({id:id}).then((res) => {
                if (this.GLOBAL.isResonseSuccess(res)) {
                    this.attrList = res.data;
                }
            }, (res) => { this.listLoading = false; } ).catch(() => {});
        },

        //显示编辑界面
        handleEdit (index, row) {
            this.editFormVisible = true;
            this.editLoading = true;
            this.getProductEditById(row.spuId);
            this.imgList = [];

        },
        //查询当前修改前商品数据
        getProductEditById (id) {
            productSpuDetailEditFun({id: id}).then((res) => {
                this.editLoading = false;
                if (this.GLOBAL.isResonseSuccess(res)) {
                    this.editForm.id = res.data.spuId;
                    this.editForm.spuId = res.data.spuId;
                    this.editForm.brandId = res.data.brandId;
                    this.editForm.spuCode = res.data.spuCode;
                    this.editForm.spuName = res.data.spuName;
                    this.editForm.spuTitle = res.data.spuTitle;
                    this.editForm.businessTypeCode = res.data.businessTypeCode;
                    this.editForm.testDataFlag = res.data.testDataFlag;
                    this.editForm.classIdList = res.data.classIdList;
                    this.editForm.spuModel = res.data.spuModel;
                    this.attrList = res.data.allAttrList;
                    this.imgList.push({name:"",url:this.GLOBAL.getImgUrl(res.data.mainImage.imgPath),relativeUrl:res.data.mainImage.imgPath})
                    this.originImage = res.data.mainImage;
                    this.originImage.imageUrl = res.data.mainImage.imgPath;
                    this.selfAttrList = res.data.selfAttrList;

                    this.skuList = [];
                    this.originSkuList = [];
                    for (let i = 0; i < res.data.wikiList.length; i++) {
                        this.originSkuList.push({
                            id : res.data.wikiList[i].id,
                            skuAttrs : res.data.wikiList[i].property,
                            skuAttrsDesc : this.getSkuAttrsDesc(res.data.wikiList[i].property.split(',')),
                        });
                    }

                    for (let i = 0; i < this.attrList.length; i++) {
                        for (let j = 0; j < this.attrList[i].attrvals.length; j++) {
                            if (this.attrList[i].attrvals[j].checked !== undefined
                                && this.attrList[i].attrvals[j].checked) {
                                this.attrList[i].attrvals[j].disable = true;
                            }
                        }
                    }

                    productBrandListByBusinessIdFun({businessTypeCode: res.data.businessTypeCode}).then((res) => {
                        this.brandList = [];
                        for (let i = 0; i < res.data.length; i++) {
                            this.brandList.push({id:res.data[i].id, brandEngName:res.data[i].brandEngName});
                        }
                    }, (res) => { } ).catch(() => {});
                }
            }, (res) => { this.editLoading = false; } ).catch(() => {});
        },

        //新增
        addSubmit () {
            this.$refs.addForm.validate((valid) => {
                if (valid) {
                    this.$confirm('确认新增吗？', '提示', {}).then(() => {
                        if(this.addForm.businessTypeCode == 0){
                            this.$message({
                                message: '请选择业务类型!',
                                type: 'error'
                            });
                            return;
                        }
                        this.addLoading = true;
                        let para = Object.assign({}, this.addForm);
                        para.classId = this.addForm.classIdList[this.addForm.classIdList.length - 1];
                        let imgReqList = [];
                        imgReqList.push({
                            imgPath:this.originImage.imageUrl,
                            imgType:0,
                            imgStatus:0
                        });
                        let wikiReqList = [];
                        for (let i = 0; i < this.skuList.length; i++) {
                            wikiReqList.push({
                                qualityId:0,
                                property:this.skuList[i].skuAttrs
                            });
                        }
                        para.wikiReqList = wikiReqList;
                        para.imgReqList = imgReqList;
                        productSpuInsertFun(para).then((res) => {
                            this.addLoading = false;
                            if (this.GLOBAL.isResonseSuccess(res)) {
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                this.addForm.classIdList=[];
                                this.getProduct(enums.PRODUCT_CODE.All);
                            }
                        });
                    });
                }
            });
        },
        //编辑
        editSubmit () {
            this.$refs.editForm.validate((valid) => {
                if (valid) {
                    this.$confirm('确认修改吗？', '提示', {}).then(() => {
                        let para = Object.assign({}, this.editForm);
                        para.classId = this.editForm.classIdList[this.editForm.classIdList.length - 1];
                        let imgReqList = [];
                        this.originImage.imgPath = this.originImage.imageUrl,
                        imgReqList.push(this.originImage);
                        let skuReqList = [];
                        for (let i = 0; i < this.skuList.length; i++) {
                            skuReqList.push({
                                qualityId:0,
                                property:this.skuList[i].skuAttrs,
                                spuId:this.editForm.spuId
                            });
                        }
                        para.wikiReqList = skuReqList;
                        para.imgReqList = imgReqList;

                        this.editLoading = true;
                        productSpuUpdateFun(para).then((res) => {
                            this.editLoading = false;
                            if (this.GLOBAL.isResonseSuccess(res)) {
                                this.$message({
                                    message: '修改成功',
                                    type: 'success'
                                });
                                this.editForm.classIdList=[];
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.getProduct(enums.PRODUCT_CODE.All);
                            }
                        });
                    });
                }
            });
        },

        handleAttrCheckedChange (value) {
            value = !value;
            this.attrList = this.GLOBAL.deepCopy(this.attrList);
            this.createSku();
            this.filterSkuList();
        },
        createSku () {
            this.attrCheckedList = [];
            this.skuList = [];
            let curAttr = {};
            for(let i = 0; i < this.attrList.length; i++) {
                curAttr = this.attrList[i];
                let curChecked = [];
                let curAttrval = {};
                for (let j = 0; j < curAttr.attrvals.length; j++) {
                    curAttrval = curAttr.attrvals[j];
                    if (curAttrval.checked !== undefined
                        && curAttrval.checked) {
                        curChecked.push(curAttr.id + ":" + curAttrval.id);
                    }
                }
                if (curChecked.length > 0) {
                    this.attrCheckedList.push(curChecked);
                }
            }

            let result = [];
            this.skuCartesia(0, [], this.attrCheckedList, result);

            for(let i = 0; i < result.length; i++) {
                this.skuList[i] = {};
                this.skuList[i].skuAttrs = result[i].join(",");
                this.skuList[i].skuAttrsDesc = this.getSkuAttrsDesc(result[i]);
                this.skuList[i].skuCode = '';
            }
        },
        //计算sku笛卡尔积
        skuCartesia (layer, curList, dimValue, result) {
            if (layer < dimValue.length - 1) {
                if (dimValue[layer].length === 0) {
                    this.skuCartesia(layer + 1, curList, dimValue, result);
                } else {
                    for (let i = 0; i < dimValue[layer].length; i++) {
                        let list = this.GLOBAL.deepCopy(curList);
                        list.push(dimValue[layer][i]);
                        this.skuCartesia(layer + 1, list, dimValue, result);
                    }
                }
            } else if (layer === dimValue.length - 1) {
                if (dimValue[layer].length === 0) {
                    result.push(curList);
                } else {
                    for (let i = 0; i < dimValue[layer].length; i++) {
                        let list = this.GLOBAL.deepCopy(curList);
                        list.push(dimValue[layer][i]);
                        result.push(list);
                    }
                }
            }
        },
        getSkuAttrsDesc (para) {
            let desc = "";
            let isFirst = true;
            for(let i = 0; i < para.length; i++) {
                if (isFirst) {
                    desc += this.getAttrName(para[i].split(":")[0]) + ":" + this.getAttrvalName(para[i].split(":")[0], para[i].split(":")[1]);
                    isFirst = false;
                } else {
                    desc += "," + this.getAttrName(para[i].split(":")[0]) + ":" + this.getAttrvalName(para[i].split(":")[0], para[i].split(":")[1]);
                }
            }
            return desc;
        },
        getAttrName (id) {
            for(let i = 0; i < this.attrList.length; i++) {
                if (id == this.attrList[i].id) {
                    return this.attrList[i].attrName;
                }
            }
            return "";
        },
        getAttrvalName (attrId, attrvalId) {
            for(let i = 0; i < this.attrList.length; i++) {
                if (attrId == this.attrList[i].id) {
                    for(let j = 0; j < this.attrList[i].attrvals.length; j++) {
                        if (attrvalId == this.attrList[i].attrvals[j].id) {
                            return this.attrList[i].attrvals[j].attrValue;
                        }
                    }
                }
            }
            return "";
        },
        filterSkuList () {
            let attrs = [];
            for (let i = 0; i < this.originSkuList.length; i++) {
                attrs.push(this.originSkuList[i].skuAttrs);
            }
            let newSkuList = [];
            for (let i = 0; i < this.skuList.length; i++) {
                if (attrs.indexOf(this.skuList[i].skuAttrs) <= -1) {
                    newSkuList.push(this.skuList[i]);
                }
            }
            this.skuList = newSkuList;
        },
        /**查询使用**/
        seachDate(){
            this.handleCurrentChange(1);
        },
        /**分页方法**/
        handleSizeChange(val) {
            this.pageSize = val;
            this.getProduct(enums.PRODUCT_CODE.All);
        },

        handleCurrentChange(val) {
            this.pageNum = val;
            this.getProduct(enums.PRODUCT_CODE.All);
        },

        handleBusinessChange(value) {
            this.businessTypeCode = value;
            this.skuList = [];
            this.attrList = [];
            this.getClassTree();
            this.getBrandListByBusinessId();
        },
        /**获取分类树信息**/
        getClassTree () {
            let param = {
                businessTypeCode: this.businessTypeCode
            }
            productClassTreeByBusinessFun(param).then((res) => {
                if (this.GLOBAL.isResonseSuccess(res)) {
                    this.classTree = res.data;
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
    },
    mounted() {
        this.spuPrepare();
        this.getProduct(enums.PRODUCT_CODE.All);
        this.getBrandListByBusinessId();
        this.getClassTree();
    }
    }
</script>