<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">

            <el-form align="right" :inline="true"  class="demo-form-inline">
                <el-form-item label="保价产品">
                    <el-input v-model="filters.premiumProduct" placeholder="保价产品"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" v-on:click="searchData">查询</el-button>
                </el-form-item>
                <el-form-item label="">
                    <el-button v-if="isAuth('mpys:premium:insert')" type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="premiumList" stripe border  highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
            <!--<el-table-column type="selection" ></el-table-column>-->
            <el-table-column prop="premiumCode" label="保价编码" show-overflow-tooltip></el-table-column>
            <el-table-column prop="premiumProduct" label="保价产品" show-overflow-tooltip></el-table-column>
            <el-table-column prop="priceMin" label="商品售价从" sortable></el-table-column>
            <el-table-column prop="priceMax" label="商品售价到" sortable></el-table-column>
            <el-table-column prop="calculateType" label="计算方式"></el-table-column>
            <el-table-column prop="price" label="价格" sortable></el-table-column>
            <el-table-column prop="enableFlag" label="是否启用" sortable :formatter="formatEnableFlag"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip sortable :formatter="dateFormat"></el-table-column>
            <el-table-column v-if="isAuth('mpys:premium:update') || isAuth('mpys:premium:delete')" fixed="right" label="操作" width="240">
                <template slot-scope="scope">
                    <el-button v-if="isAuth('mpys:premium:update')" type="primary"  size="mini" @click="editStatus(scope.$index, scope.row)">{{scope.row.enableFlag == 1 ? "停用" : "启用"}}</el-button>
                    <el-button v-if="isAuth('mpys:premium:update') && scope.row.enableFlag == 0" type="primary"  size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button v-if="isAuth('mpys:premium:delete') && scope.row.enableFlag == 0" type="primary"  size="mini" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" style="margin-top: 10px">
            <!--<el-button v-if="isAuth('mpys:premium:delete')" type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>-->
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
            <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
                <el-form-item label="保价编码" prop="premiumCode">
                    <el-input v-model="editForm.premiumCode" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="保价产品" prop="premiumProduct">
                    <el-input v-model="editForm.premiumProduct" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="商品售价从" prop="priceMin">
                    <el-input v-model="editForm.priceMin" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="商品售价到" prop="priceMax">
                    <el-input v-model="editForm.priceMax" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="计算方式" prop="calculateType">
                    <el-select v-model="editForm.calculateType" placeholder="请选择计算方式">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="价格" prop="price">
                    <el-input v-model="editForm.price" auto-complete="off"></el-input>
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
            <el-form  :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm">
                <el-form-item label="保价编码" prop="premiumCode">
                    <el-input v-model="addForm.premiumCode" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="保价产品" prop="premiumProduct">
                    <el-input v-model="addForm.premiumProduct" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="商品售价从" prop="priceMin">
                    <el-input v-model="addForm.priceMin" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="商品售价到" prop="priceMax">
                    <el-input v-model="addForm.priceMax" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="计算方式" prop="calculateType">
                    <el-select v-model="addForm.calculateType" placeholder="请选择计算方式">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="价格" prop="price">
                    <el-input v-model="addForm.price" auto-complete="off"></el-input>
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
    import {getPremiumList, removePremium, batchRemovePremium, editPremium, addPremium} from '../../api/api';
    import {editPremiumEnable} from '../../api/api';

    export default {
        data() {
            return {
                options: [{
                    value: '+',
                    label: '+'
                },{
                    value: '*',
                    label: '*'
                }],
                filters: {
                    premiumProduct: ''
                },
                premiumList: [],
                total: 0,
                pageNum: 1, //当前页码
                pageSize: 10,//页数
                listLoading: false,
                sels: [],//列表选中列
                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    premiumCode: [{required: true, message: '请输入保价编码', trigger: 'blur'},
                        {max: 20, message: '长度不超过20个字符', trigger: 'blur' }],
                    premiumProduct: [{required: true, message: '请输入保价产品', trigger: 'blur'},
                        {pattern: /[\u4e00-\u9fa5]/, message: '保价产品必须包含中文' },
                        {max: 40, message: '长度不超过40个字符', trigger: 'blur' }],
                    priceMin: [{required: true, message: '请输入商品售价', trigger: 'blur'},
                        {pattern: /^\d+(?=\.{0,1}\d+$|$)/, message: '请输入正确金额' }],
                    priceMax: [{required: true, message: '请输入商品售价', trigger: 'blur'},
                        {pattern: /^\d+(?=\.{0,1}\d+$|$)/, message: '请输入正确金额' }],
                    calculateType: [{required: true, message: '请选择计算方式', trigger: 'blur'}],
                    price: [{required: true, message: '请输入价格', trigger: 'blur'},
                        {pattern: /^\d+(?=\.{0,1}\d+$|$)/, message: '请输入正确金额' }],
                },
                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    premiumCode: [{required: true, message: '请输入保价编码', trigger: 'blur'},
                        {max: 20, message: '长度不超过20个字符', trigger: 'blur' }],
                    premiumProduct: [{required: true, message: '请输入保价产品', trigger: 'blur'},
                        {pattern: /[\u4e00-\u9fa5]/, message: '保价产品必须包含中文' },
                        {max: 40, message: '长度不超过40个字符', trigger: 'blur' }],
                    priceMin: [{required: true, message: '请输入商品售价', trigger: 'blur'},
                        {pattern: /^\d+(?=\.{0,1}\d+$|$)/, message: '请输入正确金额' }],
                    priceMax: [{required: true, message: '请输入商品售价', trigger: 'blur'},
                        {pattern: /^\d+(?=\.{0,1}\d+$|$)/, message: '请输入正确金额' }],
                    calculateType: [{required: true, message: '请选择计算方式', trigger: 'blur'}],
                    price: [{required: true, message: '请输入价格', trigger: 'blur'},
                        {pattern: /^\d+(?=\.{0,1}\d+$|$)/, message: '请输入正确金额' }],
                },
                //编辑界面数据
                editForm: {
                    premiumCode:'',
                    premiumProduct:'',
                    priceMin:'',
                    priceMax:'',
                    calculateType:'',
                    enableFlag:'',
                    price:'',
                },
                //新增界面数据
                addForm: {
                    premiumCode:'',
                    premiumProduct:'',
                    priceMin:'',
                    priceMax:'',
                    calculateType:'',
                    enableFlag:'',
                    price:'',
                }

            }
        },
        methods: {
            //状态显示转换
            formatEnableFlag: function (row, column) {
                return row.enableFlag === 1 ? '启用' : row.enableFlag === 0 ? '停用' : '未知';
            },
            //时间格式化
            dateFormat:function(row, column) {
                var dateTime = row[column.property];
                if (!dateTime) {
                    return "";
                }
                return util.formatDate.format(new Date(dateTime), 'yyyy-MM-dd hh:mm:ss');
            },

            //获取业务类型列表
            getPremium() {
                let para = {
                    premiumProduct: this.filters.premiumProduct,
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    }
                };
                this.listLoading = true;
                getPremiumList(para).then((res) => {
                    this.listLoading = false;
                    this.total = res.data.paginationInfo.total;
                    this.premiumList = res.data.list;
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },
            //点击查询
            searchData() {
                this.pageNum = 1;
                this.getPremium();
            },
            //切换页数
            handleCurrentChange(val) {
                this.pageNum = val;
                this.getPremium();
            },
            //处理分页条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.getPremium();
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let para = {id: row.id};
                    removePremium(para).then((res) => {
                        this.listLoading = false;
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getPremium();
                    });
                }).catch(() => {

                });
            },

            //修改状态
            editStatus: function (index, row) {
                let para = {
                    enableFlag: row.enableFlag === 1 ? 0 : 1,
                    id: row.id
                };
                this.listLoading = true;
                editPremiumEnable(para).then((res) => {
                    this.listLoading = false;
                    this.getPremium();
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
                            editPremium(para).then((res) => {
                                this.editLoading = false;
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.getPremium();
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
                            addPremium(para).then((res) => {
                                this.addLoading = false;
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                this.getPremium();
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
                    batchRemovePremium(para).then((res) => {
                        this.listLoading = false;
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getPremium();
                    });
                }).catch(() => {

                });
            }

        },
        mounted() {
            this.getPremium();
        }
    }

</script>

<style scoped>

</style>