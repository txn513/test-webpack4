<template>
    <section>

        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form align="right" :inline="true"  class="demo-form-inline">
                <el-form-item prop="businessTypeCode">
                    <template>
                        <select-group :num ="brand.businessTypeCode" :select="isSelect" @getresult = 'getResultNumber'></select-group>
                    </template>
                </el-form-item>
                <el-form-item >
                    <el-input v-model="brand.brandName" placeholder="品牌名称" clearable maxlength="40"></el-input>
                </el-form-item>
                <el-form-item >
                    <el-input v-model="brand.brandEngName" placeholder="品牌英文名称" clearable maxlength="40"></el-input>
                </el-form-item>
                <el-form-item >
                    <el-button type="primary" v-on:click="seachDate">查询</el-button>
                </el-form-item>
                <el-form-item >
                    <el-button v-if="isAuth('mpys:brand:insert')" type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="list"  highlight-current-row v-loading="listLoading"
                  style="width: 100%;">
            <!--<el-table-column type="selection" ></el-table-column>-->
            <el-table-column  label="品牌logo">
                <template slot-scope="scope"><img  :src="getImgUrl(scope.row.brandLogo)" style="width: 50px;height: 50px" ></template>
            </el-table-column>
            <el-table-column :formatter="getBusinessTypeCode" label="业务类型"  sortable show-overflow-tooltip ></el-table-column>
            <el-table-column prop="brandName" label="品牌名称"  sortable show-overflow-tooltip ></el-table-column>
            <el-table-column prop="brandEngName" label="品牌英文名称"  sortable show-overflow-tooltip ></el-table-column>
            <el-table-column prop="description" label="品牌描述"  sortable show-overflow-tooltip ></el-table-column>
            <el-table-column prop="sortBy" label="品牌排序"  sortable show-overflow-tooltip ></el-table-column>
            <el-table-column v-if="isAuth('mpys:brand:update') || isAuth('mpys:brand:delete')"  fixed="right" label="操作" width="200">
                <template slot-scope="scope">
                    <el-button v-if="isAuth('mpys:brand:update')" type="primary"  size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button v-if="isAuth('mpys:brand:delete')" type="primary"  size="mini" @click="handleDel(scope.$index, scope.row)">删除</el-button>
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


        <!--品牌界面-->
        <el-dialog :title="title" v-model="formVisible" :visible.sync="formVisible">
            <el-form  :model="form" label-width="100px" :rules="formRules" ref="form">
                <el-form-item label="品牌名称" prop="brandName">
                    <el-input v-model="form.brandName" auto-complete="off" clearable maxlength="255"></el-input>
                </el-form-item>
                <el-form-item label="品牌英文名" prop="brandEngName">
                    <el-input v-model="form.brandEngName" auto-complete="off" clearable maxlength="255"></el-input>
                </el-form-item>
                <el-form-item label="业务类型" prop="businessTypeCode">
                    <template>
                        <select-group-add :num ="form.businessTypeCode"  :select="isUpdataSelect" @getresult = 'getUpdataResultNumber'></select-group-add>
                    </template>
                </el-form-item>
                <el-form-item label="品牌Logo" prop="brandLogo">
                    <fileupload @getresult="getResult" :imglist ="imgList" :number="num" :type="type"></fileupload>
                </el-form-item>
                <el-form-item label="品牌排序" prop="sortBy">
                    <el-input type="number" v-model="form.sortBy" auto-complete="off" clearable maxlength="40"></el-input>
                </el-form-item>
                <el-form-item label="品牌描述" prop="description">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="form.description" clearable maxlength="500"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="formVisible = false">取消</el-button>
                <el-button type="primary" @click.native="operBrand" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>

    </section>
</template>
<script>
    import {productBrandListFun,productBrandDeleteFun,productBrandAddFun,productBrandByIdFun,productBrandUpdateFun,getBusinessGeneralList} from '../../../api/api';
    import fileupload from '@/components/fileUpload';
    import selectGroup from '@/components/selectGroup';
    import selectGroupAdd from '@/components/selectGroupAdd';
    import util from '@/common/js/util';
    export default {
        components: {
            fileupload,
            selectGroup,
            selectGroupAdd
        },
        data() {
        return {
            /**这个是上传图片的类型 1为上传普通图片 2为上传头像 3为上传商品图片  参数为1限制为只能上传一张2为多张**/
            imageUrl : "",
            imgList:[],
            type:"3",
            num:'1',
            /**后台传过来的十进制数据**/
            isSelect: true,
            isUpdataSelect:false,
            /**查询列表参数使用**/
            brand: {
                businessTypeCode:-1,
                brandName:'',
                brandEngName:''
            },
            list: [],
            /**分页参数**/
            total: 0,
            pageNum: 1, //当前页码
            pageSize: 10,//页数
            /**编辑及新增操作**/
            listLoading: false,
            formVisible: false,
            addLoading: false,
            editLoading: false,
            /**通用参数验证**/
            formRules: {
                brandName: [{required: true, message: '请输入品牌名称', trigger: 'blur'}],
                brandEngName: [{required: true, message: '请输入品牌英文名称', trigger: 'blur'}],
                imageUrl: [{required: true, message: '请选择品牌图片', trigger: 'blur'}],
                sortBy: [{required: false, message: '请输入品牌排序', trigger: 'blur'}],
                description: [{required: false, message: '请输入品牌描述', trigger: 'blur'}],
                businessTypeCode: [{required: true, message: '请选择业务类型', trigger: 'blur'}],
            },
            title:"",

            /**编辑界面数据**/
            form: {
                id:'',
                businessTypeCode:-1,
                brandName:'',
                brandEngName:'',
                brandLogo:'',
                description:'',
                sortBy:'',
            },
        }
    },
    methods: {
        /**返回值**/
        getResultNumber(result){
            this.brand.businessTypeCode = result ;
        },
        /**返回值**/
        getUpdataResultNumber(result){
            this.form.businessTypeCode = result ;
        },
        /**重置**/
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.imageUrl = "";
        },
        /**返回的图片地址**/
        getResult(result){
            //返回的图片地址
            if(result.length != 0){
                for(let item of result){
                    this.imageUrl = item.relativeUrl;
                }
            }else{
                this.imageUrl = "";
            }
        },

        /**图片拼接**/
        getImgUrl(result){
            return this.GLOBAL.getImgUrl(result);
        },


        /**获取类型**/
        getBusinessTypeCode(row){
            return util.formatGoodsName(row.businessTypeCode);
        },

        /**获取商品配件列表**/
        getBrand() {
            let para = Object.assign({}, this.brand);
            para.pageInfo = {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize
            };
            this.listLoading = true;
            productBrandListFun(para).then((res) => {
                this.listLoading = false;
                this.total = res.data.paginationInfo.total;
                this.list = res.data.list;
            }, (res) => { this.listLoading = false; } ).catch(() => {});
        },
        /**新增**/
        /**显示新增界面**/
        handleAdd () {
            this.title = "新增",
            this.imgList = [],
            this.isUpdataSelect = true;
            this.form = {
                id:'',
                businessTypeCode:'',
                brandName:'',
                brandEngName:'',
                brandLogo:'',
                description:'',
                sortBy:'',
            },
            this.formVisible = true;
        },
        /**编辑**/
        /**显示编辑界面**/
        handleEdit (index, row) {
            this.title = "修改",
            this.imgList = [];
            this.isUpdataSelect = false;
            this.formVisible = true;
            this.form = {
                id:'',
                businessTypeCode :-1,
                brandName:'',
                brandEngName:'',
                brandLogo:'',
                description:'',
                sortBy:'',
            },
           this.getBrandById(row.id);
        },
        /**根据Id获取当前保障数据**/
        getBrandById (id) {
            productBrandByIdFun({id: id}).then((res) => {
                this.listLoading = false;
                if (this.GLOBAL.isResonseSuccess(res)) {
                    this.form = res.data;
                    if(res.data.brandLogo){
                        this.imgList.push({name:"",url:this.GLOBAL.getImgUrl(res.data.brandLogo),relativeUrl:res.data.brandLogo});
                        this.imageUrl = res.data.brandLogo;
                    }
                }
            }, (res) => { this.listLoading = false; } ).catch(() => {});
        },
        /**按钮操作**/
        operBrand () {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    let para = Object.assign({}, this.form);
                    para.brandLogo = this.imageUrl;
                    if(this.form.id != undefined && this.form.id != ''){
                        this.$confirm('确认修改吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                                productBrandUpdateFun(para).then((res) => {
                                this.editLoading = false;
                                if (this.GLOBAL.isResonseSuccess(res)) {
                                    this.$message({
                                        message: '修改成功',
                                        type: 'success'
                                    });
                                    this.$refs['form'].resetFields();
                                    this.formVisible = false;
                                    this.getBrand();
                                }
                            });
                        });
                    }else{
                        this.$confirm('确认新增该品牌信息吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            productBrandAddFun(para).then((res) => {
                                this.addLoading = false;
                                if (this.GLOBAL.isResonseSuccess(res)) {
                                    this.$message({
                                        message: '提交成功',
                                        type: 'success'
                                    });
                                    this.$refs['form'].resetFields();
                                    this.formVisible = false;
                                    this.getBrand();
                                }
                            });
                        });
                    }
                }
            });
        },

        /**删除**/
        handleDel (index, row) {
            this.$confirm('确认删除该品牌信息吗?', '提示', {
                type: 'warning'
            }).then(() => {
                this.listLoading = true;
                let para = {id: row.id};
                productBrandDeleteFun(para).then((res) => {
                    this.listLoading = false;
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getBrand();
                    }
                });
            }).catch(() => {});
        },
        /**查询使用**/
        seachDate(){
            this.handleCurrentChange(1);
        },
        /**处理分页条数**/
        handleSizeChange (val) {
            this.pageSize = val;
            this.getBrand();
        },
        /**切换页数**/
        handleCurrentChange (val) {
            this.pageNum = val;
            this.getBrand();
        }
    },
    mounted() {
        /**初始化调用列表**/
        this.getBrand();
    }
    }
</script>
<style scoped>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>