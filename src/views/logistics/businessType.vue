<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">

            <el-form align="right" :inline="true"  class="demo-form-inline">
                <el-form-item label="业务类型名称">
                    <el-input v-model="filters.businessName" placeholder="业务类型名称"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" v-on:click="searchData">查询</el-button>
                </el-form-item>
                <el-form-item label="">
                    <el-button v-if="isAuth('mpys:businessType:insert')" type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="businessList" stripe border  highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
            <!--<el-table-column type="selection" ></el-table-column>-->
            <el-table-column prop="businessCode" label="业务编码"></el-table-column>
            <el-table-column prop="businessName" label="业务类型名称"></el-table-column>
            <el-table-column prop="sortBy" label="排序号" sortable></el-table-column>
            <el-table-column prop="enableFlag" label="是否启用" sortable :formatter="formatEnableFlag"></el-table-column>
            <el-table-column v-if="isAuth('mpys:businessType:update') || isAuth('mpys:businessType:delete')"  fixed="right" label="操作" width="250">
                <template slot-scope="scope">
                    <el-button v-if="isAuth('mpys:businessType:update')" type="primary"  size="mini" @click="editStatus(scope.$index, scope.row)">{{scope.row.enableFlag == 1 ? "停用" : "启用"}}</el-button>
                    <el-button v-if="isAuth('mpys:businessType:update') && scope.row.enableFlag == 0" type="primary"  size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button v-if="isAuth('mpys:businessType:delete') && scope.row.enableFlag == 0" type="primary"  size="mini" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" style="margin-top: 10px">
            <!--<el-button v-if="isAuth('mpys:businessType:delete')" type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>-->
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

        <!--编辑界面-->
        <el-dialog title="编辑" v-model="editFormVisible" :visible.sync="editFormVisible">
            <el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
                <el-form-item label="业务编码" prop="businessCode">
                    <el-input v-model="editForm.businessCode" auto-complete="off"  :readonly="true"></el-input>
                </el-form-item>
                <el-form-item label="业务类型名称" prop="businessName">
                    <el-input v-model="editForm.businessName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="排序号" prop="sortBy">
                    <el-input v-model="editForm.sortBy" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="是否启用" prop="enableFlag">
                    <!--<el-switch v-model="editForm.enableFlag" active-color="#13ce66" inactive-color="#ff4949"></el-switch>-->
                    <el-radio-group v-model="editForm.enableFlag">
                        <el-radio class="radio" :label="1">启用</el-radio>
                        <el-radio class="radio" :label="0">停用</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">保存</el-button>
                <el-button @click.native="editFormVisible = false">取消</el-button>
            </div>
        </el-dialog>

        <!--新增界面-->
        <el-dialog title="新增" v-model="addFormVisible" :visible.sync="addFormVisible">
            <el-form  :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
                <el-form-item label="业务编码" prop="businessCode">
                    <el-input v-model="addForm.businessCode" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="业务类型名称" prop="businessName">
                    <el-input v-model="addForm.businessName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="排序号" prop="sortBy">
                    <el-input v-model="addForm.sortBy" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="是否启用" prop="enableFlag">
                    <!--<el-switch v-model="addForm.enableFlag" active-color="#13ce66" inactive-color="#ff4949"></el-switch>-->
                    <el-radio-group v-model="addForm.enableFlag">
                        <el-radio class="radio" :label="1">启用</el-radio>
                        <el-radio class="radio" :label="0">停用</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import util from '../../common/js/util'
    import {getBusinessTypeList, removeBusinessType, batchRemoveBusinessType, editBusinessType, addBusinessType} from '../../api/api';
    import {editBusinessTypeEnable} from '../../api/api';

    export default {
        data() {
            return {
                filters: {
                    businessName:''
                },
                businessList: [],
                total: 0,
                pageNum: 1, //当前页码
                pageSize: 10,//页数
                listLoading: false,
                sels: [],//列表选中列
                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    businessCode: [{required: true, message: '请输入业务编码', trigger: 'blur'},
                        {max: 20, message: '长度不超过20个字符', trigger: 'blur' }],
                    businessName: [{required: true, message: '请输入业务类型名称', trigger: 'blur'},
                        {pattern: /[\u4e00-\u9fa5]/, message: '业务类型名称必须包含中文' },
                        {max: 40, message: '长度不超过40个字符', trigger: 'blur' }],
                    sortBy: [{pattern: /^\+?[1-9][0-9]*$/, message: '请输入大于0的数字', trigger: 'blur'}],
                },
                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    businessCode: [{required: true, message: '请输入业务编码', trigger: 'blur'},
                        {max: 20, message: '长度不超过20个字符', trigger: 'blur' }],
                    businessName: [{required: true, message: '请输入业务类型名称', trigger: 'blur'},
                        {pattern: /[\u4e00-\u9fa5]/, message: '业务类型名称必须包含中文' },
                        {max: 40, message: '长度不超过40个字符', trigger: 'blur' }],
                    sortBy: [{pattern: /^\+?[1-9][0-9]*$/, message: '请输入大于0的数字', trigger: 'blur'}],
                },
                //编辑界面数据
                editForm: {
                    businessCode:'',
                    businessName:'',
                    sortBy:'',
                    enableFlag:'',
                },
                //新增界面数据
                addForm: {
                    businessCode:'',
                    businessName:'',
                    sortBy:'',
                    enableFlag:'',
                }

            }
        },
        methods: {
            //状态显示转换
            formatEnableFlag: function (row, column) {
                return row.enableFlag === 1 ? '启用' : row.enableFlag === 0 ? '停用' : '未知';
            },

            //获取业务类型列表
            getBusinessType() {
                let para = {
                    businessName: this.filters.businessName,
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    }
                };
                this.listLoading = true;
                getBusinessTypeList(para).then((res) => {
                    this.listLoading = false;
                    this.total = res.data.paginationInfo.total;
                    this.businessList = res.data.list;
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },
            //点击查询
            searchData() {
                this.pageNum = 1;
                this.getBusinessType();
            },
            //切换页数
            handleCurrentChange(val) {
                this.pageNum = val;
                this.getBusinessType();
            },
            //处理分页条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.getBusinessType();
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let para = {id: row.id};
                    removeBusinessType(para).then((res) => {
                        this.listLoading = false;
                        if (res.code == 1) {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                        }
                        else {
                            this.$message({
                                message: res.message,
                                type: 'warning'
                            });
                        }
                        this.getBusinessType();
                    });
                }).catch(() => {

                });
            },

            //修改状态
            editStatus: function (index, row) {
                let para = {
                    enableFlag: row.enableFlag === 1 ? 0 : 1,
                    businessCode: row.businessCode,
                    id: row.id
                };
                this.listLoading = true;
                editBusinessTypeEnable(para).then((res) => {
                    this.listLoading = false;
                    if (res.code == 1) {
                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        });
                    }
                    else {
                        this.$message({
                            message: res.message,
                            type: 'warning'
                        });
                    }
                    this.getBusinessType();
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },


            //显示编辑界面
            handleEdit: function (index, row) {
                this.editForm = Object.assign({}, row);
                this.editFormVisible = true;

            },

            //显示新增界面
            handleAdd: function () {
                this.addFormVisible = true;

            },

            //编辑
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            let para = Object.assign({}, this.editForm);
                            editBusinessType(para).then((res) => {
                                this.editLoading = false;
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.getBusinessType();
                            });
                        });
                    }
                });
            },

            //新增
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            let para = Object.assign({}, this.addForm);
                            addBusinessType(para).then((res) => {
                                this.addLoading = false;
                                if (res.code == 1) {
                                    this.$message({
                                        message: '添加成功',
                                        type: 'success'
                                    });
                                }
                                else {
                                    this.$message({
                                        message: res.message,
                                        type: 'warning'
                                    });
                                }
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                this.getBusinessType();
                            });
                        });
                    }
                });
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            //批量删除
            batchRemove: function () {
                var ids = this.sels.map(item => item.id).toString();
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let para = {ids: ids};
                    batchRemoveBusinessType(para).then((res) => {
                        this.listLoading = false;
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getBusinessType();
                    });
                }).catch(() => {

                });
            }

        },
        mounted() {
            this.getBusinessType();
        }
    }

</script>

<style scoped>

</style>