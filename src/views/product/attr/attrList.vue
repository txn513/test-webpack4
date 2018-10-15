<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form align="right" :inline="true"  class="demo-form-inline">
                <el-form-item >
                    <el-input v-model="attr.attrName" placeholder="请输入属性名" clearable maxlength="40"></el-input>
                </el-form-item>
                <el-form-item >
                    <el-button type="primary" v-on:click="seachDate">查询</el-button>
                </el-form-item>
                <el-form-item >
                    <el-button v-if="isAuth('mpys:attr:insert')" type="primary" @click="handleAdd" >新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="list"  highlight-current-row v-loading="listLoading"
                  style="width: 100%;">
            <!--<el-table-column type="selection" ></el-table-column>-->
            <el-table-column prop="attrName" label="属性名称"   sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="attrvals" label="属性参数"   sortable show-overflow-tooltip></el-table-column>
            <el-table-column  fixed="right" label="操作" width="260">
                <template slot-scope="scope">
                    <el-button v-if="isAuth('mpys:attr:update')" type="primary"  size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button v-if="isAuth('mpys:attr:delete')" type="primary"  size="mini" @click="handleDel(scope.$index, scope.row)">删除</el-button>
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
            <el-form :model="form" label-width="80px" :rules="formRules" ref="form">
                <el-form-item label="属性名称" prop="attrName">
                    <el-input v-model="form.attrName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="属性值" prop="attrList">
                    <el-button @click.native="attrAdd" icon="el-icon-circle-plus-outline" style="margin-bottom: 5px;"></el-button>
                    <div v-for="item in attrList">
                        <el-row :gutter="1" type="flex">
                            <el-col><el-input v-model="item.attrValue"></el-input></el-col>
                            <el-col :span="2"><el-button @click.native="attrUp(item.index)" icon="el-icon-arrow-up"></el-button></el-col>
                            <el-col :span="2"><el-button @click.native="attrDown(item.index)" icon="el-icon-arrow-down"></el-button></el-col>
                            <el-col :span="2"><el-button @click.native="attrDel(item.index)" icon="el-icon-remove-outline"></el-button></el-col>
                        </el-row>
                    </div>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="formVisible = false">取消</el-button>
                <el-button type="primary" @click.native="operBrand" :loading="loading">提交</el-button>
            </div>
        </el-dialog>

    </section>
</template>
<script>
    import {productAttrRelListFun,productAttrRelInsertFun,productAttrRelDeleteFun,productAttrRelByIdFun,productAttrRelUpdateFun} from '../../../api/api';
    export default {
        data() {
        return {
            /**查询使用**/
            attr: {
                attrName: ''
            },
            list: [],
            /**分页**/
            total: 0,
            pageNum: 1,
            pageSize: 10,
            listLoading: false,

            /**编辑界面数据**/
            title:'',
            formVisible: false,
            loading: false,
            formRules: {
                attrName: [{required: true, message: '请输入属性名称', trigger: 'blur'}],
                attrType: [{required: true, message: '请选择属性分类', trigger: 'blur'}],
                /*attrList: [{required: true, message: '请输入属性值', trigger: 'blur'}],*/
            },
            attrList:[
                {
                    attrValue:'',
                    index:0,
                    delFlag:0
                }
            ],
            form: {
                attrName: '',
                attrType: 0,
            },
            attrDelList:[],
        }
    },
    methods: {
        /** 获取商品配件列表 **/
        getAttr() {
            let para = {
                attrType:0,
                attrName : this.attr.attrName,
                alias : '',
                pageInfo: {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                }
            };
            this.listLoading = true;
            productAttrRelListFun(para).then((res) => {
                this.listLoading = false;
                this.total = res.data.paginationInfo.total;
                this.list = res.data.list;
            }, (res) => { this.listLoading = false; } ).catch(() => {});
        },
        /**显示新增界面**/
        handleAdd() {
            this.formVisible = true;
            this.title = "新增";
            this.form = {
                attrName: '',
                attrType: 0,
            };
            this.attrList =[
                {
                    attrValue:'',
                    index:0,
                    delFlag:0
                }
            ];
        },
        /**显示编辑界面**/
        handleEdit(index, row) {
            this.title = "编辑";
            this.formVisible = true;
            this.getAttrById(row.id);
        },
        /**获取当前属性数据**/
        getAttrById(id) {
            productAttrRelByIdFun({id: id}).then((res) => {
                this.listLoading = false;
                if (this.GLOBAL.isResonseSuccess(res)) {
                    this.form = res.data;
                    this.attrList = this.GLOBAL.deepCopy(this.form.attrvals);
                    this.attrResetIndex();
                }
            }, (res) => { this.listLoading = false; } ).catch(() => {});
        },


        /**按钮操作**/
        operBrand () {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    let para = Object.assign({}, this.form);
                    para.attrvals = this.attrList;
                    para.attrType = 0;
                    if(this.form.id != undefined && this.form.id != ''){
                        this.$confirm('确认修改该属性吗？', '提示', {}).then(() => {
                            this.loading = true;
                            for(let i = 0; i < this.attrDelList.length; i++) {
                                para.attrvals.push(this.attrDelList[i]);
                            }
                            productAttrRelUpdateFun(para).then((res) => {
                                this.loading = false;
                                if (this.GLOBAL.isResonseSuccess(res)) {
                                    this.$message({
                                        message: '修改成功',
                                        type: 'success'
                                    });
                                    this.$refs['form'].resetFields();
                                    this.formVisible = false;
                                    this.getAttr();
                                }
                            });
                        });
                    }else{
                        this.$confirm('确认新增该属性吗？', '提示', {}).then(() => {
                            this.loading = true;
                            productAttrRelInsertFun(para).then((res) => {
                                this.loading = false;
                                if (this.GLOBAL.isResonseSuccess(res)) {
                                    this.$message({
                                        message: '提交成功',
                                        type: 'success'
                                    });
                                    this.$refs['form'].resetFields();
                                    this.formVisible = false;
                                    this.getAttr();
                                }
                            });
                        });
                    }
                }
            });
        },


        /**删除**/
        handleDel(index, row) {
            this.$confirm('确认删除该属性吗?', '提示', {
                type: 'warning'
            }).then(() => {
                this.listLoading = true;
                let para = {id: row.id};
                productAttrRelDeleteFun(para).then((res) => {
                    this.listLoading = false;
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getAttr();
                    }
                });
            }).catch(() => {

            });
        },

        /**属性操作按钮**/
        attrAdd() {
            let len = this.attrList.length;
            if (len > 10) {
                this.$message({
                    message: '配件数量超过10个',
                    type: 'warning'
                });
                return;
            }
            this.attrList.push({attrValue:'', index:len, delFlag:0});
            this.attrResetIndex();
        },
        attrUp(index) {
            if (index - 1 >= 0) {
                let temp = this.attrList[index];
                this.attrList[index] = this.attrList[index - 1];
                this.attrList[index - 1] = temp;
                this.attrResetIndex();
            }
        },
        attrDown(index) {
            if (index + 1 < this.attrList.length) {
                let temp = this.attrList[index];
                this.attrList[index] = this.attrList[index + 1];
                this.attrList[index + 1] = temp;
                this.attrResetIndex();
            }
        },
        attrDel(index) {
            this.attrDelList = [];
            let origin = this.attrList;
            if (origin.length === 1) {
                this.$message({
                    message: '属性数量至少有1个',
                    type: 'warning'
                });
                return;
            }
            let newList = [];
            for(let i = 0; i < origin.length; i++) {
                let attrObj = this.GLOBAL.deepCopy(origin[i]);
                if (i !== index) {
                    newList.push(attrObj);
                } else if (attrObj.id !== undefined) {
                    attrObj.delFlag = 1;
                    this.attrDelList.push(attrObj);
                }
            }
            this.attrList = newList;
            this.attrResetIndex();
        },
        attrResetIndex() {
            for(let i = 0; i < this.attrList.length; i++) {
                this.attrList[i].index = i;
                this.attrList[i].sortBy = i;
                this.attrList[i].delFlag = 0;
            }
            this.attrList = this.GLOBAL.deepCopy(this.attrList);
        },
        /**查询使用**/
        seachDate(){
            this.handleCurrentChange(1);
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.getAttr();
        },
        handleCurrentChange(val) {
            this.pageNum = val;
            this.getAttr();
        }
    },
    mounted() {
        this.getAttr();
    }
    }
</script>