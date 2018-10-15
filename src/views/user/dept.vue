<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">

            <el-form align="right" :inline="true"  class="demo-form-inline">
                <el-form-item label="">
                    <el-input v-model="filters.deptNum" placeholder="部门编号"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-input v-model="filters.name" placeholder="部门名称"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" v-on:click="searchData">查询</el-button>
                </el-form-item>
                <el-form-item label="">
                    <el-button v-if="isAuth('mpys:dept:insert')" type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="list"  highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column type="selection" ></el-table-column>
            <el-table-column prop="deptNum" label="部门编码"   sortable></el-table-column>
            <el-table-column prop="name" label="部门名称"   sortable></el-table-column>
            <el-table-column prop="orderNum" label="排序"   sortable></el-table-column>
            <el-table-column prop="createTime" label="创建时间"  :formatter="formatTime" sortable></el-table-column>

            <el-table-column v-if="isAuth('mpys:dept:update') || isAuth('mpys:dept:delete')" fixed="right" label="操作" width="160">
                <template slot-scope="scope">
                    <el-button v-if="isAuth('mpys:dept:update')" type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button v-if="isAuth('mpys:dept:delete')" type="primary" size="mini" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" style="margin-top: 10px">
            <el-button v-if="isAuth('mpys:dept:delete')" type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
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
            <el-form :model="editForm" label-width="80px" :rules="formRules" ref="editForm">
               <el-form-item label="部门编码" prop="deptNum">
                  <el-input v-model="editForm.deptNum" auto-complete="off" :disabled="true"></el-input>
               </el-form-item>
               <el-form-item label="部门名称" prop="name">
                  <el-input v-model="editForm.name" auto-complete="off"></el-input>
               </el-form-item>
               <el-form-item label="排序" prop="orderNum">
                  <el-input v-model="editForm.orderNum" auto-complete="off"></el-input>
               </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">保存</el-button>
                <el-button @click.native="editFormVisible = false">取消</el-button>
            </div>
        </el-dialog>

        <!--新增界面-->
        <el-dialog title="新增" v-model="addFormVisible" :visible.sync="addFormVisible">
            <el-form :model="addForm" label-width="80px" :rules="formRules" ref="addForm">
                <el-form-item label="部门编码" prop="deptNum">
                    <el-input v-model="addForm.deptNum" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="部门名称" prop="name">
                    <el-input v-model="addForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="orderNum">
                    <el-input v-model="addForm.orderNum" auto-complete="off"></el-input>
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
    import {getDeptList, removeDept, batchRemoveDept, editDept, addDept} from '../../api/api';
    import util from '../../common/js/util';
    export default {
        data() {
            let checkNum = (rule, value, callback) => {
                let reg = new RegExp(/^\d+$/);
                if (!reg.test(value)) {
                    callback(new Error('排序号必须是数字'));
                } else {
                    callback();
                }
            };
            return {
                filters: {
                    name: '',
                    deptNum:'',
                },
                list: [],
                total: 0,
                pageNum: 1, //当前页码
                pageSize: 10,//页数
                listLoading: false,
                sels: [],//列表选中列
                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                formRules: {
                    name: [{required: true, message: '请输入部门名称', trigger: 'blur'}],
                    deptNum:[{required: true, message: '请输入部门编号', trigger: 'blur'}],
                    orderNum:[
                        {required: true, message: '请输入排序号', trigger: 'blur'},
                        {validator: checkNum, trigger: 'blur'}
                        ],
                },
                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                //编辑界面数据
                editForm: {
                    id:0 ,
                    deptNum:'' ,
                    name:'' ,
                    orderNum:'' ,
                },
                //新增界面数据
                addForm: {
                    deptNum:'' ,
                    name:'' ,
                    orderNum:'' ,
                }

            }
        },
        methods: {

            formatTime(row) {
                return util.dateFormat('yyyy-MM-dd hh:mm:ss', new Date(row.createTime));
            },
            //切换页数
            handleCurrentChange(val) {
                this.pageNum = val;
                this.getData();
            },
            //处理分页条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.getData();
            },

            searchData(){
                this.pageNum = 1;
                this.getData();
            },

            //获取用户列表
            getData() {
                let para = {
                    name: this.filters.name,
                    deptNum: this.filters.deptNum,
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    }
                };
                this.listLoading = true;
                getDeptList(para).then((res) => {
                    this.listLoading = false;
                    this.total = res.data.paginationInfo.total;
                    this.list = res.data.list;
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let para = {id: row.id};
                    removeDept(para).then((res) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(res)) {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getData();
                        }
                    });
                }).catch(() => {

                });
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
                            editDept(para).then((res) => {
                                this.editLoading = false;
                                if (this.GLOBAL.isResonseSuccess(res)) {
                                    this.$message({
                                        message: '提交成功',
                                        type: 'success'
                                    });
                                    this.$refs['editForm'].resetFields();
                                    this.editFormVisible = false;
                                    this.getData();
                                }
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
                            addDept(para).then((res) => {
                                this.addLoading = false;
                                if (this.GLOBAL.isResonseSuccess(res)) {
                                    this.$message({
                                        message: '提交成功',
                                        type: 'success'
                                    });
                                    this.$refs['addForm'].resetFields();
                                    this.addFormVisible = false;
                                    this.getData();
                                }
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
                let ids = this.sels.map(item => item.id).toString();
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let para = {ids: ids};
                    batchRemoveDept(para).then((res) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(res)) {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getData();
                        }
                    });
                }).catch(() => {

                });
            }
        },
        mounted() {
            this.getData();
        }
    }

</script>

<style scoped>

</style>