<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">

            <el-form align="right" :inline="true"  class="demo-form-inline">
                <el-form-item label="物流公司">
                    <el-input v-model="filters.logisticsCompany" placeholder="物流公司"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" v-on:click="searchData">查询</el-button>
                </el-form-item>
                <el-form-item label="">
                    <el-button v-if="isAuth('mpys:logisticsFreight:insert')" type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="freightList" stripe border  highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
            <!--<el-table-column type="selection" ></el-table-column>-->
            <el-table-column prop="freightCode" label="运费编码" show-overflow-tooltip></el-table-column>
            <el-table-column prop="logisticsCompany" label="物流公司" show-overflow-tooltip></el-table-column>
            <el-table-column prop="logisticsProduct" label="物流产品" show-overflow-tooltip></el-table-column>
            <el-table-column prop="businessName" label="业务类型"></el-table-column>
            <el-table-column prop="firstCount" label="首件数量" sortable></el-table-column>
            <el-table-column prop="firstFreight" label="首件运费" sortable></el-table-column>
            <el-table-column prop="secondCount" label="续件数量" sortable></el-table-column>
            <el-table-column prop="secondFreight" label="续件运费" sortable></el-table-column>
            <el-table-column prop="enableFlag" label="是否启用" sortable :formatter="formatEnableFlag"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip sortable :formatter="dateFormat"></el-table-column>
            <el-table-column v-if="isAuth('mpys:logisticsFreight:update') || isAuth('mpys:logisticsFreight:delete')"  fixed="right" label="操作" width="240">
                <template slot-scope="scope">
                    <el-button v-if="isAuth('mpys:logisticsFreight:update')" type="primary"  size="mini" @click="editStatus(scope.$index, scope.row)">{{scope.row.enableFlag == 1 ? "停用" : "启用"}}</el-button>
                    <el-button v-if="isAuth('mpys:logisticsFreight:update') && scope.row.enableFlag == 0" type="primary"  size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button v-if="isAuth('mpys:logisticsFreight:delete') && scope.row.enableFlag == 0" type="primary"  size="mini" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" style="margin-top: 10px">
            <!--<el-button v-if="isAuth('mpys:logisticsFreight:delete')" type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>-->
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
                <el-form-item label="运费编码" prop="freightCode">
                    <el-input v-model="editForm.freightCode" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="物流公司" prop="companyCode">
                    <el-select v-model="editForm.companyCode" placeholder="请选择物流公司" @change="selectCompany">
                        <el-option
                                v-for="item in logisticsCompanyList"
                                :key="item.companyCode"
                                :value ="item.companyCode"
                                :label="item.logisticsCompany">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="物流产品" prop="logisticsProduct">
                    <el-input v-model="editForm.logisticsProduct" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="业务类型" prop="businessCode">
                    <el-select v-model="editForm.businessCode" placeholder="请选择业务类型" @change="selectBusiness">
                        <el-option
                                v-for="item in businessNameList"
                                :key="item.businessCode"
                                :value ="item.businessCode"
                                :label="item.businessName">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="首件数量" prop="firstCount">
                    <el-input v-model="editForm.firstCount" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="首件运费" prop="firstFreight">
                    <el-input v-model="editForm.firstFreight" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="续件数量" prop="secondCount">
                    <el-input v-model="editForm.secondCount" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="续件运费" prop="secondFreight">
                    <el-input v-model="editForm.secondFreight" auto-complete="off"></el-input>
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
                <el-form-item label="运费编码" prop="freightCode">
                    <el-input v-model="addForm.freightCode" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="物流公司" prop="companyCode">
                    <el-select v-model="addForm.companyCode" placeholder="请选择物流公司" @change="selectCompany">
                        <el-option
                                v-for="item in logisticsCompanyList"
                                :key="item.companyCode"
                                :value ="item.companyCode"
                                :label="item.logisticsCompany">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="物流产品" prop="logisticsProduct">
                    <el-input v-model="addForm.logisticsProduct" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="业务类型" prop="businessCode">
                    <el-select v-model="addForm.businessCode" placeholder="请选择业务类型" @change="selectBusiness">
                        <el-option
                                v-for="item in businessNameList"
                                :key="item.businessCode"
                                :value ="item.businessCode"
                                :label="item.businessName">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="首件数量" prop="firstCount">
                    <el-input v-model="addForm.firstCount" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="首件运费" prop="firstFreight">
                    <el-input v-model="addForm.firstFreight" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="续件数量" prop="secondCount">
                    <el-input v-model="addForm.secondCount" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="续件运费" prop="secondFreight">
                    <el-input v-model="addForm.secondFreight" auto-complete="off"></el-input>
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
    import {getLogisticsFreightList, removeLogisticsFreight, batchRemoveLogisticsFreight, editLogisticsFreight, addLogisticsFreight} from '../../api/api';
    import {editLogisticsFreightEnable, getAllLogisticsCompanyList, getAllBusinessTypeList} from '../../api/api';

    export default {
        data() {
            return {
                filters: {
                    logisticsCompany: ''
                },
                freightList: [],
                logisticsCompanyList:[],//物流公司列表
                businessNameList:[],//业务类型列表
                total: 0,
                pageNum: 1, //当前页码
                pageSize: 10,//页数
                listLoading: false,
                sels: [],//列表选中列
                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    freightCode: [{required: true, message: '请输入运费编码', trigger: 'blur'},
                        {max: 20, message: '长度不超过20个字符', trigger: 'blur' }],
                    companyCode: [{required: true, message: '请选择物流公司', trigger: 'blur'}],
                    logisticsProduct: [{required: true, message: '请输入物流产品', trigger: 'blur'},
                        {pattern: /[\u4e00-\u9fa5]/, message: '物流产品必须包含中文' },
                        {max: 40, message: '长度不超过40个字符', trigger: 'blur' }],
                    businessCode: [{required: true, message: '请选择业务类型', trigger: 'blur'}],
                    firstCount: [{required: true, message: '请输入首件数量', trigger: 'blur'},
                        {pattern: /^\+?[1-9][0-9]*$/, message: '请输入大于0的数字' }],
                    firstFreight: [{required: true, message: '请输入首件运费', trigger: 'blur'},
                        {pattern: /^\d+(?=\.{0,1}\d+$|$)/, message: '请输入正确金额' }],
                    secondCount: [{required: true, message: '请输入续件数量', trigger: 'blur'},
                        {pattern: /^\d+$/, message: '请输入数字' }],
                    secondFreight: [{required: true, message: '请输入续件运费', trigger: 'blur'},
                        {pattern: /^\d+(?=\.{0,1}\d+$|$)/, message: '请输入正确金额' }],
                },
                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    freightCode: [{required: true, message: '请输入运费编码', trigger: 'blur'},
                        {max: 20, message: '长度不超过20个字符', trigger: 'blur' }],
                    companyCode: [{required: true, message: '请选择物流公司', trigger: 'blur'}],
                    logisticsProduct: [{required: true, message: '请输入物流产品', trigger: 'blur'},
                        {pattern: /[\u4e00-\u9fa5]/, message: '物流产品必须包含中文' },
                        {max: 40, message: '长度不超过40个字符', trigger: 'blur' }],
                    businessCode: [{required: true, message: '请选择业务类型', trigger: 'blur'}],
                    firstCount: [{required: true, message: '请输入首件数量', trigger: 'blur'},
                        {pattern: /^\+?[1-9][0-9]*$/, message: '请输入大于0的数字' }],
                    firstFreight: [{required: true, message: '请输入首件运费', trigger: 'blur'},
                        {pattern: /^\d+(?=\.{0,1}\d+$|$)/, message: '请输入正确金额' }],
                    secondCount: [{required: true, message: '请输入续件数量', trigger: 'blur'},
                        {pattern: /^\d+$/, message: '请输入数字' }],
                    secondFreight: [{required: true, message: '请输入续件运费', trigger: 'blur'},
                        {pattern: /^\d+(?=\.{0,1}\d+$|$)/, message: '请输入正确金额' }],
                },
                //编辑界面数据
                editForm: {
                    freightCode:'',
                    companyCode:'',
                    logisticsCompany:'',
                    logisticsProduct:'',
                    businessCode:'',
                    businessName:'',
                    firstCount:'',
                    firstFreight:'',
                    secondCount:'',
                    secondFreight:'',
                    enableFlag:'',
                },
                //新增界面数据
                addForm: {
                    freightCode:'',
                    companyCode:'',
                    logisticsCompany:'',
                    logisticsProduct:'',
                    businessCode:'',
                    businessName:'',
                    firstCount:'',
                    firstFreight:'',
                    secondCount:'',
                    secondFreight:'',
                    enableFlag:'',
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

            //获取物流运费列表
            getLogisticsFreight() {
                let para = {
                    logisticsCompany: this.filters.logisticsCompany,
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    }
                };
                this.listLoading = true;
                getLogisticsFreightList(para).then((res) => {
                    this.listLoading = false;
                    this.total = res.data.paginationInfo.total;
                    this.freightList = res.data.list;
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },
            //点击查询
            searchData() {
                this.pageNum = 1;
                this.getLogisticsFreight();
            },
            //切换页数
            handleCurrentChange(val) {
                this.pageNum = val;
                this.getLogisticsFreight();
            },
            //处理分页条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.getLogisticsFreight();
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let para = {id: row.id};
                    removeLogisticsFreight(para).then((res) => {
                        this.listLoading = false;
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getLogisticsFreight();
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
                editLogisticsFreightEnable(para).then((res) => {
                    this.listLoading = false;
                    this.getLogisticsFreight();
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },


            //显示编辑界面
            handleEdit: function (index, row) {
                this.editForm = Object.assign({}, row);
                this.editFormVisible = true;
                this.getLogisticsCompany();
                this.getBusinessName();

            },

            //显示新增界面
            handleAdd: function () {
                this.addFormVisible = true;
                this.getLogisticsCompany();
                this.getBusinessName();

            },

            //编辑
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            let para = Object.assign({}, this.editForm);
                            editLogisticsFreight(para).then((res) => {
                                this.editLoading = false;
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.getLogisticsFreight();
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
                            addLogisticsFreight(para).then((res) => {
                                this.addLoading = false;
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                this.getLogisticsFreight();
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
                    batchRemoveLogisticsFreight(para).then((res) => {
                        this.listLoading = false;
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getLogisticsFreight();
                    });
                }).catch(() => {

                });
            },

            //获取未删除并且启用的物流公司
            getLogisticsCompany: function() {
                let para = {}
                getAllLogisticsCompanyList(para).then((res) => {
                    this.listLoading = false;
                    this.logisticsCompanyList = res.data.list;
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },

            //获取未删除并且启用的业务类型
            getBusinessName: function() {
                let para = {}
                getAllBusinessTypeList(para).then((res) => {
                    this.listLoading = false;
                    this.businessNameList = res.data.list;
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },

            selectCompany(vId){//这个vId也就是value值
                let obj = {};
                obj = this.logisticsCompanyList.find((item)=>{
                    return item.companyCode === vId;//筛选出匹配数据
                });
                this.addForm.logisticsCompany = obj.logisticsCompany;
                this.editForm.logisticsCompany = obj.logisticsCompany;
            },

            selectBusiness(vId){//这个vId也就是value值
                let obj = {};
                obj = this.businessNameList.find((item)=>{
                    return item.businessCode === vId;//筛选出匹配数据
                });
                this.addForm.businessName = obj.businessName;
                this.editForm.businessName = obj.businessName;
            }

        },
        mounted() {
            this.getLogisticsFreight();
        }
    }

</script>

<style scoped>

</style>