<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form style="float: right" :inline="true"  class="demo-form-inline">
                <el-form-item label="角色名称">
                    <el-input v-model="filters.dataRoleName" placeholder="角色名称"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" v-on:click="searchData">查询</el-button>
                </el-form-item>
                <el-form-item label="">
                    <el-button v-if="isAuth('mpys:role:insert')" type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="list"  highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column type="selection" ></el-table-column>
            <el-table-column prop="dataRoleName" label="角色名称" sortable></el-table-column>
            <el-table-column prop="remark" label="备注" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="status" label="状态"  sortable :formatter="formatStatus"></el-table-column>
            <!--<el-table-column prop="createTime" label="创建时间"   sortable></el-table-column>-->

            <el-table-column v-if="isAuth('mpys:datarole:update') || isAuth('mpys:datarole:delete')" fixed="right" label="操作" width="260">
                <template slot-scope="scope">
                    <el-button v-if="isAuth('mpys:datarole:update') && scope.row.adminRoleFlag === 0" type="primary" size="mini" @click="editStatus(scope.$index, scope.row)">{{scope.row.status == 1 ? "停用" : "启用"}}</el-button>
                    <el-button v-if="isAuth('mpys:datarole:update') && scope.row.adminRoleFlag === 0" type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button v-if="isAuth('mpys:datarole:delete') && scope.row.adminRoleFlag === 0" type="primary" size="mini" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" style="margin-top: 10px">
            <el-button v-if="isAuth('mpys:datarole:delete')" type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
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
        <el-dialog title="编辑" v-model="editFormVisible" :visible.sync="editFormVisible" @close= "closeEditFrom">
            <el-form :model="editForm" label-width="80px" :rules="formRules" ref="editForm">
                <el-form-item label="角色名称" prop="dataRoleName">
                    <el-input v-model="editForm.dataRoleName" auto-complete="off" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="editForm.remark" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-select v-model="editForm.status" placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="授权" prop="">
                    <el-row>
                        <el-button size="mini" @click="openBatchSetting">批量设置</el-button>
                    </el-row>
                    <el-tree :data="menuList"  node-key="id" :props="defaultProps">
                      <span class="custom-tree-node" slot-scope="{node, data}">
                        <span>{{data.name}} </span>
                        <span v-if="!data.children">
                              <el-checkbox
                                      v-model = "businessTypeList"
                                      v-for="item in businessList"
                                      v-if="item.name"
                                      :label="data.id + '-' + item.code"
                                      :key="data.id + '-' + item.code">
                                  {{item.name}}
                              </el-checkbox>
                        </span>
                      </span>
                    </el-tree>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">保存</el-button>
                <el-button @click.native="closeEditFrom">取消</el-button>
            </div>
        </el-dialog>

        <!--新增界面-->
        <el-dialog title="新增" v-model="addFormVisible" :visible.sync="addFormVisible" @close= "closeAddFrom">
            <el-form :model="addForm" label-width="80px" :rules="formRules" ref="addForm">
                <el-form-item label="角色名称" prop="dataRoleName">
                    <el-input v-model="addForm.dataRoleName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="addForm.remark" auto-complete="off"></el-input>
                </el-form-item>
                <!--<el-form-item label="部门ID" prop="deptId">-->
                <!--<el-input v-model="editForm.deptId" auto-complete="off"></el-input>-->
                <!--</el-form-item>-->
                <el-form-item label="状态" prop="status">
                    <el-select v-model="addForm.status" placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="授权" prop="">
                    <el-row>
                        <el-button size="mini" @click="openBatchSetting">批量设置</el-button>
                    </el-row>
                    <el-tree :data="menuList"  node-key="id" :props="defaultProps">
                      <span class="custom-tree-node" slot-scope="{node, data}">
                        <span>{{data.name}} </span>
                        <span v-if="!data.children">
                                  <el-checkbox
                                          v-model="businessTypeList"
                                          v-for="item in businessList"
                                          v-if="item.name"
                                          :label="data.id + '-' + item.code"
                                          :key="data.id + '-' + item.code">{{item.name}}
                                  </el-checkbox>
                        </span>
                      </span>
                    </el-tree>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="closeAddFrom">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>

        <el-dialog title="批量设置" :visible.sync="batchSettingVisible" width="20%">
            <span>
                <el-checkbox-group v-model="checkList">
                   <el-checkbox v-for="item in businessList"
                                v-if="item.name"
                                :label="item.code"
                                :key="item.code" >{{item.name}}</el-checkbox>
                </el-checkbox-group>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button size="mini" @click="batchSettingVisible = false">取 消</el-button>
                <el-button size="mini" type="primary" @click="batchSetting">确 定</el-button>
            </span>
        </el-dialog>
    </section>
</template>

<script>
    import {getDataRoleList, removeDataRole, batchRemoveDataRole, editDataRole, addDataRole,getBusinessTypeByDataRoleId} from '../../api/api';
    import {editDataRoleStatus, dynamicUpdatePerms, getMenuListByDataFlag,getBusinessList,getMenuIdList} from '../../api/api';
    export default {
        data() {
            return {
                options: [{
                    value: 1,
                    label: '启用'
                },{
                    value: 0,
                    label: '停用'
                }],
                filters: {
                    dataRoleName:''
                },
                list: [],
                checkList:[],//批量设置业务类型
                businessTypeList:[],//各个菜单对应业务类型
                businessList:[],//业务类型
                total: 0,
                pageNum: 1, //当前页码
                pageSize: 10,//页数
                listLoading: false,
                sels: [],//列表选中列
                menuList:[],//菜单
                roleList:[],//角色拥有菜单id
                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                batchSettingVisible: false, //批量设置框默认不显示
                formRules: {
                    dataRoleName: [{required: true, message: '请输入角色名称', trigger: 'blur'}],
                    status: [{required: true, message: '请选择状态', trigger: 'blur'}],
                },
                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                //编辑界面数据
                editForm: {
                    id:'',
                    dataRoleName:'' ,
                    remark:'' ,
                    status:'',
                },
                //新增界面数据
                addForm: {
                    dataRoleName:'' ,
                    remark:'' ,
                    status:'',
                },
                defaultProps: {
                    children: 'children',
                    label: 'name',
                    id:'id'
                }

            }
        },
        methods: {

            //状态显示转换
            formatStatus: function (row, column) {
                return row.status === 1 ? '启用' : row.status === 0 ? '停用' : '未知';
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

            closeAddFrom(){
                this.addLoading = false;
                this.addFormVisible = false;
                this.$refs['addForm'].resetFields();
            },
            closeEditFrom(){
                this.editLoading = false;
                this.editFormVisible = false;
                this.$refs['editForm'].resetFields();
            },

            getBusinessTypeByDataRoleId(id) {
                getBusinessTypeByDataRoleId({id: id}).then((res) => {
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.businessTypeList = res.data;
                    }
                }, () => {}).catch(() => {});
            },

            getBusinessType() {
                getBusinessList().then((res) => {
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.businessList = res.data;
                    }
                }, () => {}).catch(() => {});
            },

            //修改状态
            editStatus: function (index, row) {
                let para = {
                    status: row.status === 1 ? 0 : 1,
                    id: row.id
                };
                this.listLoading = true;
                editDataRoleStatus(para).then((res) => {
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.listLoading = false;
                        this.getData();
                    }
                }, () => { this.listLoading = false; } ).catch(() => {});
            },


            //获取用户列表
            getData() {
                let para = {
                    dataRoleName: this.filters.dataRoleName,
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    }
                };
                this.listLoading = true;
                getDataRoleList(para).then((res) => {
                    this.listLoading = false;
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.total = res.data.paginationInfo.total;
                        this.list = res.data.list;
                    }
                }, () => { this.listLoading = false; } ).catch(() => {});
            },


            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let para = {id: row.id};
                    removeDataRole(para).then((res) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(res)) {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getData();
                        }
                    });
                }).catch(() => {});
            },

            openBatchSetting(){
                this.batchSettingVisible = true;
                this.checkList = [];
            },

            batchSetting: function () {
                getMenuIdList({}).then((res) => {
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        let menuIds = res.data;
                        let checkList = this.checkList;
                        this.businessTypeList = [];
                        for (let i in checkList) {
                            for (let j in menuIds) {
                                this.businessTypeList.push(menuIds[j] + "-" + checkList[i]);
                            }
                        }
                        console.log(this.businessTypeList);
                    }
                }, () => {}).catch(() => {});
                this.batchSettingVisible = false;
            },


            //显示编辑界面
            handleEdit: function (index, row) {
                this.editForm = Object.assign({}, row);
                this.businessTypeList = [];
                this.editFormVisible = true;
                this.listLoading = true;
                getMenuListByDataFlag({}).then((res) => {
                    this.listLoading = false;
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.menuList = res.data;
                        this.getBusinessType();
                    }
                }, () => { this.listLoading = false; } ).catch(() => {});
                this.getBusinessTypeByDataRoleId(row.id);
            },


            //显示新增界面
            handleAdd: function () {
                this.addFormVisible = true;
                this.listLoading = true;
                this.businessTypeList = [];
                getMenuListByDataFlag({}).then((res) => {
                    this.listLoading = false;
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.menuList = res.data;
                        this.getBusinessType();
                    }
                }, () => { this.listLoading = false; } ).catch(() => {});
            },


            //编辑界面提交
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            let para = Object.assign({}, this.editForm);
                            para.businessTypeList = this.businessTypeList;
                            editDataRole(para).then((res) => {
                                this.editLoading = false;
                                if (this.GLOBAL.isResonseSuccess(res)) {
                                    this.$message({
                                        message: '提交成功',
                                        type: 'success'
                                    });
                                    this.$refs['editForm'].resetFields();
                                    this.editFormVisible = false;
                                    this.getData();
                                    //this.updatePerms();
                                }
                            });
                        }).catch(() => {this.editLoading = false;});
                    }
                });
            },


            //新增界面提交
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            let para = Object.assign({}, this.addForm);
                            para.businessTypeList = this.businessTypeList;
                            addDataRole(para).then((res) => {
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
                        }).catch(() => {this.addLoading = false;});
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
                    batchRemoveDataRole(para).then((res) => {
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

            updatePerms: function () {
                dynamicUpdatePerms({}).then((data) => {
                    if (this.GLOBAL.isResonseSuccess(data)){
                        if ((data.data)) {
                            sessionStorage.setItem('menuList',JSON.stringify(data.data.menuList || '[]'));
                            sessionStorage.setItem('roleList',JSON.stringify(data.data.roleList || '[]'));
                            data.data.roleList = [];
                            data.data.menuList = [];
                            sessionStorage.setItem('user', JSON.stringify(data.data));
                        }
                    }
                });
            }
        },
        mounted() {
            this.getData();
        }
    }

</script>

<style scoped>
    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }
</style>