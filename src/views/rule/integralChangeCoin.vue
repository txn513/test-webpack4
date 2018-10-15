<template>
    <section>
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form align="right" :inline="true"  class="demo-form-inline" style="float: right">
                <el-form-item label="">
                    <el-button  type="primary" @click="handleAdd" v-if="isAuth('scloud:rule:insert')">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!--列表-->
        <el-table :data="list" highlight-current-row v-loading="listLoading"  style="width: 100%;">
            <el-table-column prop="minUnit" label="最小兑换单位" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="maxUnit" label="最大兑换单位" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="rankName" label="等级名称" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="getUnit" label="兑换到的财富值" sortable  show-overflow-tooltip></el-table-column>
            <el-table-column prop="remark" label="备注说明" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="createTime" label="创建时间" :formatter="dateFormat" sortable  show-overflow-tooltip></el-table-column>
            <el-table-column v-if=""  fixed="right" label="操作" width="200" >
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)" v-if="isAuth('scloud:rule:update')">编辑</el-button>
                </template>
            </el-table-column>
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


        <!--start 新增界面-->
        <el-dialog title="新增" v-model="addFormVisible" :visible.sync="addFormVisible" @close= "resetForm('addForm')" >
            <el-form  :model="addForm" label-width="120px" :rules="formRules" ref="addForm">

                <el-form-item label="最小兑换单位" prop="minUnit">
                    <el-input v-model="addForm.minUnit"></el-input>
                </el-form-item>
                <el-form-item label="最大兑换单位" prop="maxUnit">
                    <el-input v-model="addForm.maxUnit"></el-input>
                </el-form-item>
                <el-form-item label="等级名称" prop="rankName">
                    <el-input v-model="addForm.rankName"></el-input>
                </el-form-item>
                <el-form-item label="兑换到的财富值" prop="getUnit">
                    <el-input v-model="addForm.getUnit"></el-input>
                </el-form-item>
                <el-form-item label="备注说明" prop="remark">
                    <el-input v-model="addForm.remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">保存</el-button>
                <el-button @click.native="addFormVisible = false" @click="resetForm('addForm')">取消</el-button>
            </div>
        </el-dialog>
        <!--end 新增界面 -->


        <!--start 编辑界面-->
        <el-dialog title="编辑" v-model="editFormVisible" :visible.sync="editFormVisible" @close= "resetForm('editForm')" >
            <el-form  :model="editForm" label-width="120px" :rules="formRules" ref="editForm">

                <el-form-item label="最小兑换单位" prop="minUnit">
                    <el-input v-model="editForm.minUnit"></el-input>
                </el-form-item>
                <el-form-item label="最大兑换单位" prop="maxUnit">
                    <el-input v-model="editForm.maxUnit"></el-input>
                </el-form-item>
                <el-form-item label="等级名称" prop="rankName">
                    <el-input v-model="editForm.rankName"></el-input>
                </el-form-item>
                <el-form-item label="兑换到的财富值" prop="getUnit">
                    <el-input v-model="editForm.getUnit"></el-input>
                </el-form-item>
                <el-form-item label="备注说明" prop="remark">
                    <el-input v-model="editForm.remark"></el-input>
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
    import {getRuleListForIntegralLevel,insertRule, updateRule} from '../../api/api';
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

            var validateMax = (rule, value, callback) => {
                var reg = new RegExp(/^[1-9]\d*$/);
                if (!reg.test(value)) {
                    callback(new Error('所输字段必须是非0整数类型，请重新输入'));
                } else if (parseInt(value) < parseInt(this.addForm.minUnit)) {
                    callback(new Error('最大兑换单位必须大于最小兑换单位!'));
                } else if (parseInt(value) < parseInt(this.editForm.minUnit)) {
                    callback(new Error('最大兑换单位必须大于最小兑换单位!'));
                } else {
                    callback();
                }
            };

            var validateMin = (rule, value, callback) => {
                var reg = new RegExp(/^[1-9]\d*$/);
                if (!reg.test(value)) {
                    callback(new Error('所输字段必须是非0整数类型，请重新输入'));
                } else if (parseInt(value) > parseInt(this.addForm.maxUnit)) {
                    callback(new Error('最小兑换单位必须小于最大兑换单位!'));
                } else if (parseInt(value) > parseInt(this.editForm.maxUnit)) {
                    callback(new Error('最小兑换单位必须小于最大兑换单位!'));
                } else {
                    callback();
                }
            };
            return {
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
                    minUnit:[{required: true, message: '请输入最小兑换单位(必须是非0整数类型)', trigger: 'blur'},
                        {validator:validateMin,trigger: 'blur'}],
                    maxUnit:[{required: true, message: '请输入最大兑换单位(必须是非0整数类型)', trigger: 'blur'},
                        {validator:validateMax,trigger: 'blur'}],
                    rankName:[{required: true, message: '请输入等级名称', trigger: 'blur'}],
                    getUnit:[{required: true, message: '请输入可兑换到的财富值(必须是非0整数类型)', trigger: 'blur'},
                        {validator:checkNum,trigger: 'blur'}],
                    remark:[{required: true, message: '请输入备注说明', trigger: 'blur'}],
                },

                //新增界面数据
                addForm: {
                    minUnit: '',
                    maxUnit: '',
                    rankName: '',
                    getUnit: 1,
                    remark: ''
                },

                //编辑界面数据
                editForm: {
                    minUnit: '',
                    maxUnit: '',
                    rankName: '',
                    getUnit: '',
                    remark: ''

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
            // 时间格式化:YYYY-MM-DD HH:mm:ss
            // formatDate(row, column, cellValue) {
            //     if(cellValue === null || cellValue === undefined || cellValue === (-2209017600000)){
            //         return '';
            //     }
            //     return moment(cellValue).format('YYYY-MM-DD HH:mm:ss');
            // },

            //时间格式化
            dateFormat:function(row, column) {
                var dateTime = row[column.property];
                if (!dateTime) {
                    return "";
                }
                return util.formatDate.format(new Date(dateTime), 'yyyy-MM-dd hh:mm:ss');
            },

            getList() {
                let para = {
                    ruleType:2,//0-积分兑换森特币
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    }
                };
                this.listLoading = true;
                getRuleListForIntegralLevel(para).then((res) => {
                    this.listLoading = false;
                    this.total = res.data.paginationInfo.total;
                    this.list = res.data.list;
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },

            //显示新增界面
            handleAdd () {
                this.addFormVisible = true;
            },
            //显示编辑界面
            handleEdit (index, row) {
                this.editForm = {},
                    //先清空表单
                    this.editForm = Object.assign({}, row );
                this.editFormVisible = true;
            },

            //新增
            addSubmit () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认保存吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            let region = {
                                "ruleType": 2,//积分兑换森特币
                            };
                            let para = Object.assign({}, this.addForm,region);//Object.assign  (目标对象，源对象1，源对象2)--浅拷贝
                            insertRule(para).then((res) => {
                                this.addLoading = false;
                                if (this.GLOBAL.isResonseSuccess(res)) {
                                    this.$message({
                                        message: '保存成功',
                                        type: 'success'
                                    });
                                    this.$refs['addForm'].resetFields();
                                    this.addFormVisible = false;
                                    this.getList();
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
                            this.editLoading = true;
                            let region = {
                                "ruleType": 2,//积分兑换森特币
                            };
                            let para = Object.assign({}, this.editForm ,region);
                            updateRule(para).then((res) => {
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

        },
        mounted() {
            this.getList();
        }
    }

</script>