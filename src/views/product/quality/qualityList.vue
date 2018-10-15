<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form align="right" :inline="true"  class="demo-form-inline" >
                <el-form-item prop="qualityName">
                    <el-input v-model="quality.qualityName" placeholder="品质名称" clearable maxlength="40"></el-input>
                </el-form-item>
                <el-form-item prop="qualityLabel">
                    <el-input type="number" v-model="quality.qualityLabel" placeholder="品质标签" clearable maxlength="40"></el-input>
                </el-form-item>
                <el-form-item >
                    <el-button type="primary" v-on:click="seachDate">查询</el-button>
                </el-form-item>
                <el-form-item label="">
                    <el-button v-if="isAuth('mpys:quality:insert')" type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!--列表-->
        <el-table :data="list"  highlight-current-row v-loading="listLoading"
                  style="width: 100%;">
            <!--<el-table-column type="selection" ></el-table-column>-->
            <el-table-column prop="qualityName" label="品质名称"  sortable show-overflow-tooltip ></el-table-column>
            <el-table-column prop="qualityLabel" label="品质标签"  sortable show-overflow-tooltip ></el-table-column>
            <el-table-column prop="remark" label="品质说明"  sortable show-overflow-tooltip ></el-table-column>
            <el-table-column v-if="isAuth('mpys:quality:update') || isAuth('mpys:quality:delete')"  fixed="right" label="操作" width="200">
                <template slot-scope="scope">
                    <el-button v-if="isAuth('mpys:quality:update')" type="primary"  size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button v-if="isAuth('mpys:quality:delete')" type="primary" size="mini" @click="handleDel(scope.$index, scope.row)">删除</el-button>
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

        <!--品质界面-->
        <el-dialog :title="title" v-model="formVisible" :visible.sync="formVisible">
            <el-form :model="form" label-width="80px" :rules="formRules" ref="form">
                <el-form-item label="品质名称" prop="qualityName">
                    <el-input v-model="form.qualityName" auto-complete="off" clearable maxlength="255"></el-input>
                </el-form-item>
                <el-form-item label="品质标签" prop="qualityLabel">
                    <el-input type="number" v-model="form.qualityLabel" auto-complete="off" clearable maxlength="255"></el-input>
                </el-form-item>
                <el-form-item v-if="form.id" label="是否启用" prop="enableFlag">
                    <el-radio-group v-model="form.enableFlag">
                        <el-radio class="radio" :label="0">启用</el-radio>
                        <el-radio class="radio" :label="1">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="品质说明" prop="remark">
                    <el-input type="textarea" v-model="form.remark"></el-input>
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
    import {productQualityListFun,productQualityDeleteFun,productQualityAddFun,productQualityByIdFun,productQualityUpdateFun } from '../../../api/api';
    export default {
        data() {
            return {
                /**查询参数**/
                quality: {
                    qualityName:'',
                    qualityLabel:''
                },
                list: [],
                /**分页**/
                total: 0,
                pageNum: 1,
                pageSize: 10,
                listLoading: false,

                /**操作数据**/
                formVisible: false,
                editLoading: false,
                addLoading: false,

                /**通用参数验证**/
                formRules: {
                    qualityName: [{required: true, message: '请输入品质名称', trigger: 'blur'}],
                    qualityLabel: [{required: true, message: '请输入数字品质标签', trigger: 'blur'}],
                    enableFlag: [{required: true, message: '请选择启用状态', trigger: 'blur'}],
                    remark: [{required: true, message: '请输入品质说明', trigger: 'blur'}],
                },

                title:"",

                /**界面数据**/
                form: {
                    id:'',
                    qualityName:'',
                    qualityLabel:'',
                    enableFlag:'',
                    remark:''
                }

            }
        },
        methods: {
            /**获取商品配件列表**/
            getQuality() {

                    let para = {
                        qualityName : this.quality.qualityName,
                        qualityLabel : this.quality.qualityLabel,
                        pageInfo: {
                            pageNum: this.pageNum,
                            pageSize: this.pageSize,
                        }
                    };
                    this.listLoading = true;
                    productQualityListFun(para).then((res) => {
                        this.listLoading = false;
                        this.total = res.data.paginationInfo.total;
                        this.list = res.data.list;
                    }, (res) => { this.listLoading = false; } ).catch(() => {});

            },


            /**删除**/
            handleDel (index, row) {
                this.$confirm('确认删除该品质信息吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let para = {id: row.id};
                    productQualityDeleteFun(para).then((res) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(res)) {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getQuality();
                        }
                    });
                }).catch(() => {

                });
            },

            /**编辑**/
            /**显示编辑界面**/
            handleEdit(index, row) {
                this.title = "修改",
                this.formVisible = true,
                this.form = {
                    id:'',
                    qualityName:'',
                    qualityLabel:'',
                    enableFlag:'',
                    remark:'',
                },
                this.getQualityById(row.id);
            },
            /**新增**/
            /**显示新增界面**/
            handleAdd() {
                this.title = "新增",
                this.formVisible = true,
                this.form = {
                    id:'',
                    qualityName:'',
                    qualityLabel:'',
                    enableFlag:'',
                    remark:'',
                };
            },

            /**获取当前品质数据**/
            getQualityById(id) {
                productQualityByIdFun({id: id}).then((res) => {
                    this.listLoading = false;
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.form = res.data;
                    }
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },


            /**按钮操作**/
            operBrand () {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        let para = Object.assign({}, this.form);
                        if(this.form.id){
                            this.$confirm('确认修改该品质信息吗？', '提示', {}).then(() => {
                                this.editLoading = true;
                                productQualityUpdateFun(para).then((res) => {
                                    this.editLoading = false;
                                    if (this.GLOBAL.isResonseSuccess(res)) {
                                        this.$message({
                                            message: '修改成功',
                                            type: 'success'
                                        });
                                        this.$refs['form'].resetFields();
                                        this.formVisible = false;
                                        this.getQuality();
                                    }
                                });
                            });
                        }else{
                            this.$confirm('确认新增该品质信息吗？', '提示', {}).then(() => {
                                this.addLoading = true;
                                productQualityAddFun(para).then((res) => {
                                    this.addLoading = false;
                                    if (this.GLOBAL.isResonseSuccess(res)) {
                                        this.$message({
                                            message: '提交成功',
                                            type: 'success'
                                        });
                                        this.$refs['form'].resetFields();
                                        this.formVisible = false;
                                        this.getQuality();
                                    }
                                });
                            });
                        }
                    }
                });
            },

            /**查询使用**/
            seachDate(){
                this.handleCurrentChange(1);
            },

            /**分页**/
            handleSizeChange(val) {
                this.pageSize = val;
                this.getQuality();
            },
            handleCurrentChange(val) {
                this.pageNum = val;
                this.getQuality();
            }
        },
        mounted() {
            this.getQuality();
        }
    }
</script>
<style scoped>
</style>