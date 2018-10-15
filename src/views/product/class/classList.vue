<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form align="right" :inline="true" class="demo-form-inline">
                <el-form-item label="">
                    <template>
                        <select-group :num ="query.businessTypeCode" :select="true" @getresult = 'getQueryBusinessType'></select-group>
                    </template>
                </el-form-item>
                <el-form-item label="">
                    <el-input v-model="query.className" placeholder="分类名称"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" v-on:click="seachDate">查询</el-button>
                </el-form-item>
                <el-form-item label="">
                    <el-button v-if="isAuth('mpys:class:insert')" type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!--列表-->
        <tree-goods-class :listLoading = 'listLoading' :columns="columns" :tree-structure="true" @handleEdit="handleEdit" @handleDel="handleDel" @bindAttrs="bindAttr" @bindBrand="bindBrand" :data-source="classList"></tree-goods-class>

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

        <el-dialog title="绑定属性" v-model="attrFormVisible" :visible.sync="attrFormVisible">
            <el-form label-width="100px" ref="attrEditForm">
                <el-form-item label="属性">
                    <el-transfer
                            v-model="selfAttrIdList"
                            filterable
                            :props="{key:'id', label:'attrName'}"
                            :filter-method="attrFilter"
                            :titles="['属性列表', '已选属性']"
                            :data="allAttrList">
                    </el-transfer>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click.native="attrFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="bindAttrSubmit" :loading="attrLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--编辑界面-->
        <el-dialog title="编辑" v-model="editFormVisible" :visible.sync="editFormVisible">
            <el-form :model="editForm" label-width="100px" :rules="formRules" ref="editForm">
                <el-form-item label="业务类型" prop="businessTypeCode">
                    <template>
                        <select-group-add :num ="editForm.businessTypeCode"  :select="false" @getresult = 'getEditBusinessType'></select-group-add>
                    </template>
                </el-form-item>

                <el-form-item label="父级分类" prop="classId">
                    <el-cascader
                            v-model="classIdList"
                            placeholder="试试搜索：分类"
                            :options="classTree"
                            :props="props"
                            filterable
                            disabled
                            change-on-select
                            show-all-levels
                    ></el-cascader>
                </el-form-item>

                <el-form-item label="分类名称" prop="className">
                    <el-input v-model="editForm.className" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="英文名称" prop="classEngName">
                    <el-input v-model="editForm.classEngName" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="排序" prop="sortBy">
                    <el-input type="number" v-model="editForm.sortBy" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="分类logo" prop="imgPath">
                    <fileupload @getresult="getResult" :imglist = "imgList" :number="num" :type="type"></fileupload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>


        <!--新增界面-->
        <el-dialog title="新增" v-model="addFormVisible" :visible.sync="addFormVisible">
            <el-form :model="addForm" label-width="100px" :rules="formRules" ref="addForm">

                <el-form-item label="业务类型" prop="businessTypeCode">
                    <template>
                        <select-group-add :num ="addForm.businessTypeCode"  :select="true" @getresult = 'getAddBusinessType'></select-group-add>
                    </template>
                </el-form-item>

                <el-form-item label="父级分类" prop="classId">
                    <el-cascader
                            v-model="classIdList"
                            placeholder="试试搜索：分类"
                            :options="classTree"
                            :props="props"
                            filterable
                            change-on-select
                            show-all-levels
                    ></el-cascader>
                </el-form-item>

                <el-form-item label="分类名称" prop="className">
                    <el-input v-model="addForm.className" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="英文名称" prop="classEngName">
                    <el-input v-model="addForm.classEngName" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="排序" prop="sortBy">
                    <el-input type="number" v-model="addForm.sortBy" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="分类logo" prop="imgPath">
                    <fileupload @getresult="getResult" :imglist = "imgList" :number="num" :type="type"></fileupload>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--绑定品牌界面-->
        <el-dialog title="绑定品牌" v-model="bindBrandForm.formVisible" :visible.sync="bindBrandForm.formVisible">
            <el-form :model="bindBrandForm" label-width="100px" ref="bindBrandForm">
                <el-form-item label="分类名称" prop="classId">
                    <el-input v-model="bindBrandForm.className" readonly auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="商品品牌" prop="brandId">
                    <el-select v-model="bindBrandForm.brandId" clearable filterable placeholder="请选择">
                        <el-option
                                v-for="item in bindBrandForm.brandList"
                                :key="item.id"
                                :value ="item.id"
                                clearable
                                :label="item.brandEngName">
                        </el-option>
                    </el-select>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="bindBrandForm.formVisible = false">取消</el-button>
                <el-button type="primary" @click.native="bindBrandSubmit" :loading="bindBrandForm.submitLoading">提交</el-button>
            </div>
        </el-dialog>

    </section>
</template>
<script>
    import {productBrandListByBusinessIdFun,productClassBindBrandFun,productClassPrepareBindBrandFun,productClassListFun,productClassBindAttrFun,productClassPrepareBindAttrFun,productClassDeleteFun,productClassGetFun,productClassTreeByBusinessFun,productClassInsertFun,productClassUpdateFun} from '../../../api/api';
    import {TreeGoodsClass} from '../../../components/treeTable'
    import fileupload from '@/components/fileUpload';
    import util from '@/common/js/util';
    import selectGroup from '@/components/selectGroup';
    import selectGroupAdd from '@/components/selectGroupAdd';

    export default {
        components: {
            TreeGoodsClass,
            fileupload,
            selectGroup,
            selectGroupAdd
        },
        data() {
            return {
                /**这个是上传图片的类型 1为上传普通图片 2为上传头像 3为上传商品图片  参数为1限制为只能上传一张2为多张**/
                type:"3",
                num:'1',
                imgList:[],
                imageUrl:"",

                /**查询参数**/
                query: {
                    className: '',
                    businessTypeCode:-1,
                },
                classList: [],
                total: 0,
                pageNum: 1,
                pageSize: 10,

                /**弹出框**/
                listLoading:false,
                editFormVisible: false,
                editLoading: false,
                addFormVisible: false,
                addLoading: false,

                //编辑界面数据
                editForm: {
                    id:'',
                    className:'',
                    classLogo:'',
                    sortBy:'',
                    classEngName:'',
                    businessTypeCode:4,

                },
                //新增界面数据
                addForm: {
                    className:'',
                    classLogo:'',
                    sortBy:'',
                    classEngName:'',
                    businessTypeCode:-1,
                },
                columns: [
                    {dataIndex: "className", text: "分类名称"},
                    {dataIndex: "businessName", text: "业务类型"},
                    {dataIndex: "classCode", text: "分类编码"},
                    {dataIndex: "classLogo", text: "分类logo"},
                    {dataIndex: "level", text: "级别"},
                ],
                classIdList:[],
                classTree:[],
                props: {
                    value: 'id',
                    label: 'name',
                    children: 'children',
                },
                formRules:{
                    businessTypeCode: [{required: true, message: '请选择业务类型', trigger: 'blur'}],
                    // classId: [{required: true, message: '请选择父级分类', trigger: 'blur'}],
                    className: [{required: true, message: '请输入分类名称', trigger: 'blur'}],
                    classEngName: [{required: true, message: '请输入分类英文名称', trigger: 'blur'}],
                    sortBy: [{required: true, message: '请输入排序名称', trigger: 'blur'}],
                    // imgPath: [{required: true, message: '请选择分类logo', trigger: 'blur'}],
                },
                attrFormVisible: false,//编辑界面是否显示
                attrLoading: false,
                attrEditForm:[],
                allAttrList:[],
                selfAttrIdList:[],
                bindClassId:0,
                bindBrandForm:{
                    classId:'',
                    brandId:'',
                    formVisible:false,
                    className:'',
                    submitLoading:false,
                    brandList:[]
                },
                businessTypeCode:-1,
            }
        },
        methods: {

            /**图片拼接**/
            getImgUrl(result){
                return this.GLOBAL.getImgUrl(result);
            },

            /**返回的图片地址**/
            getResult (result){
                //返回的图片地址
                if(result.length != 0){
                    for(let item of result){
                        this.imageUrl = item.relativeUrl;
                    }
                }else{
                    this.imageUrl = "";
                }
            },
            /**获取分类树信息**/
            getList () {
                let param = {
                    className : this.query.className,
                    businessTypeCode: this.query.businessTypeCode,
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    }
                };
                this.listLoading = true;
                productClassListFun(param).then((res) => {
                    this.listLoading = false;
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.classList = res.data.list;
                        this.total = res.data.paginationInfo.total;
                        this.setBusinessName(this.classList);
                    }
                }, (res) => { this.listLoading = false; }).catch(() => {});
            },
            handleAdd () {
                this.imgList =[];
                this.imageUrl = '';
                this.addFormVisible = true;
                this.classIdList = [-1];
                this.addForm.classEngName = '';
                this.addForm.businessTypeCode = '';
                this.getClassTree(-1);
            },
            addSubmit () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认新增吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            let para = Object.assign({}, this.addForm);
                            para.parentId = this.classIdList[this.classIdList.length - 1];
                            para.classLogo = this.imageUrl;
                            productClassInsertFun(para).then((res) => {
                                this.addLoading = false;
                                if (this.GLOBAL.isResonseSuccess(res)) {
                                    this.$message({
                                        message: '提交成功',
                                        type: 'success'
                                    });
                                    this.$refs['addForm'].resetFields();
                                    this.addFormVisible = false;
                                    this.getList();
                                    this.getClassTree(this.query.businessTypeCode);
                                }
                            });
                        });
                    }
                });
            },
            handleEdit(index, row) {
                this.imgList =[];
                let param = {
                    id:row.id
                };
                this.editLoading = true;
                productClassGetFun(param).then((res) => {
                    this.editLoading = false;
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.editForm = res.data;

                        if(res.data.classLogo){
                            this.imgList.push({name:"",url:this.GLOBAL.getImgUrl(res.data.classLogo),relativeUrl:res.data.classLogo})
                        }
                        this.imageUrl = res.data.classLogo;
                        this.classIdList = [];
                        for (let i = 0; i < this.editForm.classIdList.length; i++) {
                            if (i < this.editForm.classIdList.length - 1) {
                                this.classIdList.push(this.editForm.classIdList[i]);
                            }
                        }
                        if (this.classIdList.length === 0) {
                            this.classIdList = [-1];
                        }
                        this.getEditBusinessType(this.editForm.businessTypeCode);
                    }
                }, (res) => { this.editLoading = false; }).catch(() => {});
                this.editFormVisible = true;
            },
            editSubmit () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认修改吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            let para = Object.assign({}, this.editForm);
                            para.parentId = this.classIdList[this.classIdList.length - 1];
                            para.classLogo = this.imageUrl;
                            productClassUpdateFun(para).then((res) => {
                                this.editLoading = false;
                                if (this.GLOBAL.isResonseSuccess(res)) {
                                    this.$message({
                                        message: '提交成功',
                                        type: 'success'
                                    });
                                    this.$refs['editForm'].resetFields();
                                    this.editFormVisible = false;
                                    this.getList();
                                    this.getClassTree(this.query.businessTypeCode);
                                }
                            });
                        });
                    }
                });
            },
            handleDel (index, row) {
                this.$confirm('确认删除吗？', '提示', {}).then(() => {
                    let param = {
                        id: row.id
                    };
                    productClassDeleteFun(param).then((res) => {
                        if (this.GLOBAL.isResonseSuccess(res)) {
                            this.getList();
                        }
                    }, (res) => { }).catch(() => {});
                });
            },
            bindAttr (index, row) {
                this.bindClassId = row.id;
                this.attrFormVisible = true;
                let param = {
                    id: row.id
                };
                productClassPrepareBindAttrFun(param).then((res) => {
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.allAttrList = res.data.allAttrList;
                        this.selfAttrIdList = [];
                        for (let i = 0; i < res.data.selfAttrList.length; i++) {
                            this.selfAttrIdList.push(res.data.selfAttrList[i].id);
                        }
                    }
                }, (res) => { }).catch(() => {});
            },
            bindAttrSubmit () {
                this.$confirm('确认操作吗？', '提示', {}).then(() => {
                    let param = {
                        classId: this.bindClassId,
                        attrIds: this.selfAttrIdList
                    };
                    productClassBindAttrFun(param).then((res) => {
                        if (this.GLOBAL.isResonseSuccess(res)) {
                            this.attrFormVisible = false;
                        }
                    }, (res) => { }).catch(() => {});
                });
            },
            bindBrand (index, row) {
                this.bindBrandForm.formVisible = true;
                let param = {
                    id: row.id
                };
                productClassPrepareBindBrandFun(param).then((res) => {
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.bindBrandForm.className = res.data.classNameList.join(" / ");
                        this.bindBrandForm.classId = res.data.id;
                        this.bindBrandForm.brandId = res.data.brandId;
                    }
                }, (res) => { }).catch(() => {});
            },
            bindBrandSubmit () {
                this.$confirm('确认操作吗？', '提示', {}).then(() => {
                    let param = {
                        classId: this.bindBrandForm.classId,
                        brandId: this.bindBrandForm.brandId
                    };
                    this.bindBrandForm.submitLoading = true;
                    productClassBindBrandFun(param).then((res) => {
                        this.bindBrandForm.formVisible = false;
                        this.bindBrandForm.submitLoading = false;
                        if (this.GLOBAL.isResonseSuccess(res)) {
                            this.attrFormVisible = false;
                        }
                    }, (res) => { }).catch(() => {});
                });
            },
            /**查询使用**/
            seachDate (){
                this.handleCurrentChange(1);
            },
            handleSizeChange (val) {
                this.pageSize = val;
                this.getList();
            },
            handleCurrentChange (val) {
                this.pageNum = val;
                this.getList();
            },
            /**获取分类树信息**/
            getClassTree (type) {
                let param = {
                    businessTypeCode: type
                };
                productClassTreeByBusinessFun(param).then((res) => {
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        let tree = [];
                        let rootNode = {};
                        rootNode.id = -1;
                        rootNode.name = '顶级分类';
                        tree.push(rootNode);
                        for (let i = 0; i < res.data.length; i++) {
                            tree.push(res.data[i]);
                        }
                        this.classTree = this.GLOBAL.deepCopy(tree);
                    }
                }, (res) => { }).catch(() => { });
            },
            attrFilter (query, item) {
                if (null == query || "" === query) {
                    return true;
                }
                return item.attrName.indexOf(query) > -1;
            },
            setBusinessName(list) {
                for (let i = 0; i < list.length; i++) {
                    list[i].businessName = util.formatGoodsName(list[i].businessTypeCode);
                    if (list[i].children !== undefined && list[i].children !== null) {
                        this.setBusinessName(list[i].children);
                    }
                }
            },
            getBrandListByBusinessId() {
                productBrandListByBusinessIdFun({businessTypeCode: 1}).then((res) => {
                    this.bindBrandForm.brandList = [];
                    this.bindBrandForm.brandList.push({id:0, brandEngName:'请选择'});
                    for (let i = 0; i < res.data.length; i++) {
                        this.bindBrandForm.brandList.push({id:res.data[i].id, brandEngName:res.data[i].brandEngName});
                    }
                }, (res) => { } ).catch(() => {});
            },
            handleBusinessChange(value) {
                this.getClassTree(value);
            },
            getQueryBusinessType(type) {
                this.query.businessTypeCode = type;
            },
            getAddBusinessType(type) {
                this.addForm.businessTypeCode = type;
                this.getClassTree(type);
            },
            getEditBusinessType(type) {
                this.editForm.businessTypeCode = type;
                this.getClassTree(type);
            }
        },
        mounted () {
            this.getList();
            this.getClassTree(-1);
            this.getBrandListByBusinessId();
        }
    };
</script>

<style scoped>
</style>