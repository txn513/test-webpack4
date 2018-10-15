<template>
    <section>

        <!--工具条-->

        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form align="right" :inline="true"  class="demo-form-inline">
                <el-form-item label="商品分类">
                    <el-cascader
                            v-model="accessories.classId"
                            placeholder="试试搜索：分类"
                            :options="classList"
                            :props="props"
                            :show-all-levels="false"
                            filterable
                            clearable
                            change-on-select
                    ></el-cascader>
                </el-form-item>
                <el-form-item >
                    <el-button type="primary" v-on:click="seachDate">查询</el-button>
                </el-form-item>
                <el-form-item >
                    <el-button v-if="isAuth('mpys:accessories:insert')" type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="list"  highlight-current-row v-loading="listLoading"
                  style="width: 100%;">
            <!--<el-table-column type="selection" ></el-table-column>-->
            <el-table-column prop="className" label="分类" sortable show-overflow-tooltip  ></el-table-column>
            <el-table-column label="选项" >
               <template slot-scope="scope" >
                   <li v-for="(acc, index) in scope.row.accList">{{index+1}}.{{acc.accName}}</li>
                </template>
            </el-table-column>
            <el-table-column v-if="isAuth('mpys:accessories:update') || isAuth('mpys:accessories:delete')"  fixed="right" label="操作" width="200">
                <template slot-scope="scope">
                    <el-button v-if="isAuth('mpys:accessories:update')" type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button v-if="isAuth('mpys:accessories:delete')" type="primary" size="mini" @click="handleDel(scope.$index, scope.row)">删除</el-button>
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


        <!--操作界面-->
        <el-dialog :title="title" v-model="formVisible" :visible.sync="formVisible">

            <el-form  :model="form" label-width="80px" :rules="formRules" ref="form">

                <el-form-item v-if="!classId" label="商品分类" prop="classId">
                        <el-cascader
                                v-model="form.classIdList"
                                placeholder="试试搜索：分类"
                                :options="classList"
                                :props="props"
                                filterable
                                clearable
                                @change="handleClassChange"
                                change-on-select
                        ></el-cascader>
                </el-form-item>

                <el-form-item v-else label="商品分类" prop="classId">
                    <el-cascader
                            v-model="form.classIdList"
                            placeholder="试试搜索：分类"
                            :options="classList"
                            :props="props"
                            filterable
                            clearable
                            disabled
                            change-on-select
                    ></el-cascader>
                </el-form-item>

                <el-form-item label="配件" prop="accList">
                    <el-button @click.native="accAdd" icon="el-icon-circle-plus-outline" style="margin-bottom: 5px;"></el-button>
                    <div v-for="item in form.accList">
                        <el-row :gutter="1" type="flex">
                            <el-col><el-input v-model="item.accName" auto-complete="off" clearable maxlength="255"></el-input></el-col>
                            <el-col :span="2"><el-button @click.native="accUp(item.index)" icon="el-icon-arrow-up"></el-button></el-col>
                            <el-col :span="2"><el-button @click.native="accDown(item.index)" icon="el-icon-arrow-down"></el-button></el-col>
                            <el-col :span="2"><el-button @click.native="accDel(item.index)" icon="el-icon-remove-outline"></el-button></el-col>
                        </el-row>
                    </div>
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
    import {productAccessoriesListFun,productAccessoriesDeleteFun,productClassTreeFun,productAccessoriesByIdFun,productAccessoriesInsertFun,productAccessoriesUpdateFun} from '../../../api/api';
    export default {
        data() {
        return {
            /**分类模板**/
            props: {
                value: 'id',
                label: 'name',
                children: 'children',
            },
            /**查询列表参数使用**/
            accessories: {
                classId: []
            },
            total: 0,
            pageNum: 1,
            pageSize: 10,

            /**页面基础数据**/
            list: [],
            classList:[],//分类列表

            listLoading: false,
            formVisible: false,//编辑界面是否显示
            editLoading: false,
            addLoading: false,
            title:'',
            classId:'',

            /**验证**/
            formRules: {
                classId: [{required: true, message: '请选择分类', trigger: 'blur'}],
                accList: [{required: true, message: '请选择配件属性', trigger: 'change', type : 'array'}],

            },
            /**操作界面数据**/
            form: {
                classId:'',
                accName:'',
                sortBy:'',
                enableFlag:'',
                accList:[],
                classIdList:[],
            },
            accDelList:[],
        }
    },
    methods: {

        /**获取分类树信息**/
        getClassList () {
            productClassTreeFun().then((res) => {
                this.listLoading = false;
                if (this.GLOBAL.isResonseSuccess(res)) {
                    this.classList = res.data;
                }
            }, (res) => { this.listLoading = false; } ).catch(() => {});
        },

        /** 获取商品配件列表 **/
        getAccessories() {
            let para = {
                classId:this.accessories.classId[this.accessories.classId.length-1],
                pageInfo: {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                }
            };
            this.listLoading = true;
            productAccessoriesListFun(para).then((res) => {
                this.listLoading = false;
                this.total = res.data.paginationInfo.total;
                this.list = res.data.list;
            }, (res) => { this.listLoading = false; } ).catch(() => {});
        },

        /**删除配件信息**/
        handleDel (index, row) {
            this.$confirm('确认删除该分类配件吗?', '提示', {
                type: 'warning'
            }).then(() => {
                this.listLoading = true;
                let para = {id: row.classId};
                productAccessoriesDeleteFun(para).then((res) => {
                    this.listLoading = false;
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getAccessories();
                    }
                });
            }).catch(() => {

            });
        },

        /**显示新增界面**/
        handleAdd () {
            this.classId="";
            this.title = "新增";
            this.formVisible = true;
            this.form.accList =[];
            this.form.classIdList = [];
        },

        /**根据classId回显数据**/
        handleClassChange: function () {
            this.getAccessoriesById(this.form.classIdList[this.form.classIdList.length - 1]);
        },

        /**显示编辑界面**/
        handleEdit (index, row) {
            this.classId="1";
            this.title = "编辑";
            this.formVisible = true;
            this.getAccessoriesById(row.classId);
            this.form.accDelList = [];
        },

        /**获取当前品质数据**/
        getAccessoriesById (id) {
            productAccessoriesByIdFun({id: id}).then((res) => {
                this.listLoading = false;
                if (this.GLOBAL.isResonseSuccess(res)) {
                    this.form = res.data;
                    this.form.accList = this.GLOBAL.deepCopy(this.form.accList);
                    this.accResetIndex();
                    this.form.classIdList = this.GLOBAL.deepCopy(this.form.classIdList);
                }
            }, (res) => { this.listLoading = false; } ).catch(() => {});
        },

        /**按钮操作**/
        operBrand () {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    let para = Object.assign({}, this.form);
                    para.accList = this.form.accList;
                    para.classId = this.form.classIdList[this.form.classIdList.length - 1];
                    if(this.form.classId != undefined && this.form.classId != ''){
                        this.$confirm('确认修改该配件信息吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            for(let i = 0; i < this.accDelList.length; i++) {
                                para.accList.push(this.accDelList[i]);
                            }
                            productAccessoriesUpdateFun(para).then((res) => {
                                this.editLoading = false;
                                if (this.GLOBAL.isResonseSuccess(res)) {
                                    this.$message({
                                        message: '修改成功',
                                        type: 'success'
                                    });
                                    this.$refs['form'].resetFields();
                                    this.formVisible = false;
                                    this.getAccessories();
                                }
                            });
                        });
                    }else{
                        this.$confirm('确认新增该配件信息吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            productAccessoriesInsertFun(para).then((res) => {
                                this.addLoading = false;
                                if (this.GLOBAL.isResonseSuccess(res)) {
                                    this.$message({
                                        message: '提交成功',
                                        type: 'success'
                                    });
                                    this.$refs['form'].resetFields();
                                    this.formVisible = false;
                                    this.getAccessories();
                                }
                            });
                        });
                    }
                }
            });
        },

        /**属性操作按钮**/

        accAdd () {
            let len = this.form.accList.length;
            if (len > 20) {
                this.$message({
                    message: '配件数量超过20个',
                    type: 'warning'
                });
                return;
            }
            this.form.accList.push({accName:'', index:len, delFlag:0});
            this.accResetIndex();
        },

        accDel (index) {
            let origin = this.form.accList;
            if (origin.length === 1) {
                this.$message({
                    message: '配件数量至少有1个',
                    type: 'warning'
                });
                return;
            }
            let newList = [];
            for(let i = 0; i < origin.length; i++) {
                let curObj = this.GLOBAL.deepCopy(origin[i]);
                if (i !== index) {
                    newList.push(curObj);
                } else if (curObj.id !== undefined) {
                    curObj.delFlag = 1;
                    this.accDelList.push(curObj);
                }
            }
            this.form.accList = newList;
            this.accResetIndex();
        },
        accUp (index) {
            if (index - 1 >= 0) {
                let temp = this.form.accList[index];
                this.form.accList[index] = this.form.accList[index - 1];
                this.form.accList[index - 1] = temp;
                this.accResetIndex();
            }
        },
        accDown (index) {
            if (index + 1 < this.form.accList.length) {
                let temp = this.form.accList[index];
                this.form.accList[index] = this.form.accList[index + 1];
                this.form.accList[index + 1] = temp;
                this.accResetIndex();
            }
        },
        accResetIndex () {
            for(let i = 0; i < this.form.accList.length; i++) {
                this.form.accList[i].index = i;
                this.form.accList[i].sortBy = i;
                this.form.accList[i].delFlag = 0;
            }
            this.form.accList = this.GLOBAL.deepCopy(this.form.accList);
        },

        /**查询使用**/
        seachDate(){
            this.handleCurrentChange(1);
        },

        /**处理分页操作**/
        handleSizeChange (val) {
            this.pageSize = val;
            this.getAccessories();
        },
        handleCurrentChange (val) {
            this.pageNum = val;
            this.getAccessories();
        }
    },
    mounted() {
        this.getAccessories();
        this.getClassList();
    }
    }
</script>
<style scoped>
    .el-col {
        margin-bottom: 5px;
    }
</style>