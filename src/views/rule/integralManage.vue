<template>
    <section>

        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">

            <el-form align="right" :inline="true"  class="demo-form-inline" style="float: right">
                <el-form-item label="手机号码">
                    <el-input v-model="filters.phone" placeholder="手机号码" clearable filterable @change="resetPage"></el-input>
                </el-form-item>

                <el-form-item label="">
                    <el-button v-if="isAuth('scloud:rule:view')" type="primary" v-on:click="getList(true)">查询</el-button>
                </el-form-item>

            </el-form>
        </el-col>
        <!--列表-->
        <el-table :data="list" highlight-current-row v-loading="listLoading"  style="width: 100%;">
            <el-table-column prop="username" label="账号" :formatter="formatUserName" show-overflow-tooltip></el-table-column>
            <el-table-column prop="phone" label="手机号码" :formatter="formatPhone" show-overflow-tooltip></el-table-column>
            <el-table-column prop="recordType" label="记录类型"  :formatter="formatRecordType" show-overflow-tooltip></el-table-column>
            <el-table-column prop="changeDescribe" label="变动类型" show-overflow-tooltip></el-table-column>
            <el-table-column prop="changeNun" label="变化数量" sortable  show-overflow-tooltip></el-table-column>
            <el-table-column prop="createTime" label="创建时间" :formatter="dateFormat" sortable  show-overflow-tooltip></el-table-column>
            <!--<el-table-column fixed="right" label="操作" width="200" >
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)" v-if="isAuth('scloud:rule:update')">编辑</el-button>
                </template>
            </el-table-column>-->
        </el-table>

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

        <!--start 编辑界面-->
        <el-dialog title="编辑" v-model="editFormVisible" :visible.sync="editFormVisible" @close= "resetForm('editForm')" >
            <el-form  :model="editForm" label-width="120px" :rules="formRules" ref="editForm">

                <el-form-item label="账号" prop="username">
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="记录类型" prop="recordType">
                    <el-input v-model="editForm.recordType" disabled></el-input>
                </el-form-item>
                <el-form-item label="变动类型" prop="changeType">
                    <el-input v-model="editForm.changeType" disabled></el-input>
                </el-form-item>
                <el-form-item label="变化数量" prop="changeNun">
                    <el-input v-model="editForm.changeNun"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">保存</el-button>
                <el-button @click.native="editFormVisible = false" @click="resetForm('editForm')">取消</el-button>
            </div>
        </el-dialog>
        <!--end 编辑界面 -->

    </section>
</template>


<script>
    import moment from 'moment';
    import util from '../../common/js/util'
    import {getWealthRecordList,editWealthRecord} from '../../api/api';
    export default {
        data() {
            var checkNum = (rule, value, callback) => {
                var reg = new RegExp(/^[1-9]\d*$/);
                if (!reg.test(value)) {
                    callback(new Error('所输字段必须是非0整数类型，请重新输入'));
                }else {
                    callback();
                }
            };
            return {
                filters: {
                    phone: ''
                },
                list: [],
                total: 0,
                pageNum: 1, //当前页码
                pageSize: 10,//页数
                listLoading: false,

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                formRules: {
                    changeNun:[{required: true, message: '请输入变化数量(必须是非0整数类型)', trigger: 'blur'},
                        {validator:checkNum,trigger: 'blur'}],
                },

                //编辑界面数据
                editForm: {
                    username:'',
                    recordType:'',
                    changeType:'',
                    changeNun:''
                },

            }
        },
        methods: {
            //切换页数
            handleCurrentChange(val) {
                this.pageNum = val;
                this.getList();
            },
            //处理分页条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.getList();
            },

            //格式化记录类型
            formatRecordType (row, column) {
                return row.recordType === 0 ? '积分变动' : row.recordType === 1 ? '森特币变动' :'';
            },

            //格式化记录类型
            formatUserName (row, column) {
                return row.username == null ? '---' :row.username === '' ? '---' :row.username;
            },

            // 手机号码格式化
            formatPhone(row, column, cellValue) {
                if (cellValue === null || cellValue === undefined || cellValue === '') {
                    return '---';
                }
                return cellValue.substr(0, 3) + '****' + cellValue.substr(7);
            },

            //时间格式化
            dateFormat:function(row, column) {
                var dateTime = row[column.property];
                if (!dateTime) {
                    return "";
                }
                return util.formatDate.format(new Date(dateTime), 'yyyy-MM-dd hh:mm:ss');
            },
            getList(flag) {
                let para = {
                    phone: this.filters.phone,
                    pageInfo: {
                        pageNum:flag===true?1:this.pageNum,
                        pageSize: this.pageSize,
                    }
                };
                this.listLoading = true;
                getWealthRecordList(para).then((res) => {
                    this.listLoading = false;
                    this.total = res.data.paginationInfo.total;
                    this.list = res.data.list;
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },


            //显示编辑界面
            handleEdit (index, row) {
                this.editForm = {},
                //先清空表单
                this.editForm = Object.assign({}, row );
                this.editFormVisible = true;
            },

            //编辑
            editSubmit () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认修改吗？', '提示', {}).then(() => {
                            this.editLoading = true;

                            let para = Object.assign({}, this.editForm );
                            editWealthRecord(para).then((res) => {
                                this.editLoading = false;
                                if (this.GLOBAL.isResonseSuccess(res)) {
                                    this.$message({
                                        message: '修改成功',
                                        type: 'success'
                                    });
                                    this.$refs['editForm'].resetFields();
                                    this.editFormVisible = false;
                                    this.getList();
                                }
                            });
                        });
                    }
                });
            },

            //重置
            resetForm(formName) {
                if (!this.$refs[formName]) {
                    this.$refs[formName].resetFields();
                }
                this.$refs[formName].resetFields();
            },

            resetPage(){
                if (this.filters.phone !== ""){
                    this.pageNum = 1;
                }
            }

        },
        mounted() {
            this.getList();
        }
    }

</script>