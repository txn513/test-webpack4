<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form align="right" :inline="true"  class="demo-form-inline">
                <el-form-item >
                    <el-input v-model="protection.protectName" placeholder="保障名称" clearable maxlength="40"></el-input>
                </el-form-item>
                <el-form-item >
                    <el-input v-model="protection.protectLabel" placeholder="保障规则" clearable maxlength="40" ></el-input>
                </el-form-item>
                <el-form-item >
                    <el-button type="primary" v-on:click="seachDate">查询</el-button>
                </el-form-item>
                <el-form-item >
                    <el-button v-if="isAuth('mpys:protection:insert')" type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!--列表-->
        <el-table :data="list" highlight-current-row v-loading="listLoading"
                  style="width: 100%;">
            <!--<el-table-column type="selection" ></el-table-column>-->
            <el-table-column prop="protectName" label="保障名称"  sortable show-overflow-tooltip ></el-table-column>
            <el-table-column prop="protectLabel" label="保障规则" sortable  show-overflow-tooltip ></el-table-column>
            <el-table-column v-if="isAuth('mpys:protection:update') || isAuth('mpys:protection:delete')"  fixed="right" label="操作" width="200">
                <template slot-scope="scope">
                    <el-button v-if="isAuth('mpys:protection:update')" type="primary"  size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button v-if="isAuth('mpys:protection:delete')" type="primary" size="mini" @click="handleDel(scope.$index, scope.row)">删除</el-button>
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


        <!--保障界面-->
        <el-dialog :title="title" v-model="formVisible" :visible.sync="formVisible">
            <el-form :model="form" label-width="80px" :rules="formRules" ref="form">
                <el-form-item label="保障名称" prop="protectName">
                    <el-input v-model="form.protectName" auto-complete="off" clearable maxlength="255"></el-input>
                </el-form-item>
                <el-form-item label="保障规则" prop="protectLabel">
                    <el-input v-model="form.protectLabel" auto-complete="off" clearable maxlength="255"></el-input>
                </el-form-item>
                <el-form-item v-if="form.id" label="是否启用" prop="enableFlag">
                    <el-radio-group v-model="form.enableFlag">
                        <el-radio class="radio" :label="0">启用</el-radio>
                        <el-radio class="radio" :label="1">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="保障说明" prop="remark">
                    <el-input type="textarea" v-model="form.remark" clearable maxlength="500"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="formVisible = false">取消</el-button>
                <el-button type="primary" @click.native="operBrand" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

    </section>
</template>
<script>
    import {productProtectionListFun,productProtectionDeleteFun,productProtectionAddFun,productProtectionByIdFun,productProtectionUpdateFun} from '../../../api/api';
    export default {
        data() {
        return {
            /**查询参数**/
            protection: {
                protectName:'',
                protectLabel:""
            },
            list: [],

            /**分页参数**/
            title:'',
            total: 0,
            pageNum: 1,
            pageSize: 10,
            listLoading: false,
            formVisible: false,
            editLoading: false,
            addLoading: false,
            /**参数验证**/
            formRules: {
                protectName: [{required: true, message: '请输入保障名称', trigger: 'blur'}],
                protectLabel: [{required: true, message: '请输入保障规则', trigger: 'blur'}],
                enableFlag: [{required: true, message: '请选择启用状态', trigger: 'blur'}],
                remark: [{required: false, message: '请输入保障说明', trigger: 'blur'}],
            },
            /**界面数据**/
            form: {
                id:'',
                protectName:'',
                protectLabel:'',
                enableFlag:'',
                remark:'',
            },

        }
    },
    methods: {
        /**获取商品配件列表**/
        getProtection() {
            let para = {
                protectName : this.protection.protectName,
                protectLabel : this.protection.protectLabel,
                pageInfo: {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                }
            };
            this.listLoading = true;
            productProtectionListFun(para).then((res) => {
                this.listLoading = false;
                this.total = res.data.paginationInfo.total;
                this.list = res.data.list;
            }, (res) => { this.listLoading = false; } ).catch(() => {});
        },

        /**删除**/
        handleDel (index, row) {
            this.$confirm('确认删除该保障信息吗?', '提示', {
                type: 'warning'
            }).then(() => {
                this.listLoading = true;
                let para = {id: row.id};
                productProtectionDeleteFun(para).then((res) => {
                    this.listLoading = false;
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getProtection();
                    }
                });
            }).catch(() => {

            });
        },

        /**编辑**/
        /**显示编辑界面**/
        handleEdit (index, row) {
            this.title = "修改",
            this.formVisible = true;
            this.form = {
                id:'',
                protectName:'',
                protectLabel:'',
                enableFlag:'',
                remark:'',
            },
            this.getProtectionById(row.id);
        },
        /**获取当前保障数据**/
        getProtectionById: function(id) {
            productProtectionByIdFun({id: id}).then((res) => {
                this.listLoading = false;
                if (this.GLOBAL.isResonseSuccess(res)) {
                    this.form = res.data;
                }
            }, (res) => { this.listLoading = false; } ).catch(() => {});
        },

        /**新增**/
        /**显示新增界面**/
        handleAdd () {
            this.title = "新增",
            this.form = {
                id:'',
                protectName:'',
                protectLabel:'',
                enableFlag:'',
                remark:'',
            },
            this.formVisible = true;
        },

        /**按钮操作**/
        operBrand () {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    let para = Object.assign({}, this.form);
                    para.brandLogo = this.imageUrl
                    if(this.form.id != undefined && this.form.id != ''){
                        this.$confirm('确认修改吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            productProtectionUpdateFun(para).then((res) => {
                                this.editLoading = false;
                                if (this.GLOBAL.isResonseSuccess(res)) {
                                    this.$message({
                                        message: '修改成功',
                                        type: 'success'
                                    });
                                    this.$refs['form'].resetFields();
                                    this.formVisible = false;
                                    this.getProtection();
                                }
                            });
                        });
                    }else{
                        this.$confirm('确认新增该品牌信息吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            productProtectionAddFun(para).then((res) => {
                                this.addLoading = false;
                                if (this.GLOBAL.isResonseSuccess(res)) {
                                    this.$message({
                                        message: '提交成功',
                                        type: 'success'
                                    });
                                    this.$refs['form'].resetFields();
                                    this.formVisible = false;
                                    this.getProtection();
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

        /**分页处理**/
        handleSizeChange(val) {
            this.pageSize = val;
            this.getProtection();
        },
        handleCurrentChange(val) {
            this.pageNum = val;
            this.getProtection();
        }
    },
    mounted() {
        this.getProtection();
    }
    }
</script>
<style scoped>
</style>