<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">

            <el-form align="right" :inline="true"  class="demo-form-inline">
                <el-form-item label="">
                    <el-input v-model="filters.userName"  placeholder="账号"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-input v-model="filters.name" placeholder="姓名"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" v-on:click="searchData">查询</el-button>
                </el-form-item>
                <el-form-item label="">
                    <el-button v-if="isAuth('mpys:user:insert')" type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="list"  highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column type="selection" show-overflow-tooltip></el-table-column>
            <el-table-column prop="userName" label="账号" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="name" label="姓名" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="deptName" label="部门" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="mobile" label="电话" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="email" label="邮箱" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="sex" label="性别" sortable :formatter="formatSex" show-overflow-tooltip></el-table-column>
            <el-table-column prop="status" label="状态" sortable :formatter="formatStatus" show-overflow-tooltip></el-table-column>
            <el-table-column prop="roleName" label="角色" sortable show-overflow-tooltip></el-table-column >
            <el-table-column prop="repertoryName" label="所属仓库"   sortable show-overflow-tooltip></el-table-column>
            <el-table-column v-if="isAuth('mpys:user:update') || isAuth('mpys:user:delete')"  fixed="right" label="操作" width="310">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" v-if="isAuth('mpys:user:update')" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="primary" size="mini"  v-if="isAuth('mpys:user:update')" @click="editStatus(scope.$index, scope.row)">{{scope.row.status === 1 ? "停用" : "启用"}}</el-button>
                    <el-button type="primary" size="mini"  v-if="isAuth('mpys:user:resetpwd')" @click="resetPwd(scope.$index, scope.row)">重置密码</el-button>
                    <el-button type="primary" size="mini"  v-if="isAuth('mpys:user:delete')" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" style="margin-top: 10px">
            <el-button v-if="isAuth('mpys:user:delete')" type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
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
        <el-dialog title="编辑" v-model="editFormVisible" :visible.sync="editFormVisible" @close= "resetForm('editForm')">
            <el-form :model="editForm" label-width="80px" :rules="formRules" ref="editForm">
                <el-form-item label="账号" prop="userName">
                    <el-input v-model="editForm.userName" auto-complete="off" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-radio-group v-model="editForm.sex">
                        <el-radio class="radio" :label="1">男</el-radio>
                        <el-radio class="radio" :label="0">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="电话" prop="mobile">
                    <el-input type="text" v-model="editForm.mobile" ></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input type="text"  v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="部门" prop="deptId">
                    <el-select v-model="editForm.deptId" placeholder="请选择">
                        <el-option
                                v-for="item in deptList"
                                :key="item.id"
                                :value ="item.id"
                                :label="item.name">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="仓库" prop="repertoryIds">
                    <el-select v-model="editForm.repertoryIds" multiple placeholder="请选择">
                        <el-option
                                v-for="item in repertoryList"
                                :key="item.id"
                                :value ="item.id"
                                :label="item.storeName">
                        </el-option>
                    </el-select>
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
                <el-row :gutter="30">
                    <el-col :span="16">
                        <el-form-item label="功能角色">
                            <el-transfer
                                    v-model="roleList"
                                    :props="{
                                          key: 'id',
                                          label: 'roleName'
                                        }"
                                    :titles="['角色列表', '已选角色']"
                                    :data="roleAllList">
                            </el-transfer>
                        </el-form-item>
                        <el-form-item label="数据角色">
                            <el-transfer
                                    v-model="dataRoleList"
                                    :props="{
                                      key: 'id',
                                      label: 'dataRoleName'
                                    }"
                                    :titles="['角色列表', '已选角色']"
                                    :data="dataRoleAllList">
                            </el-transfer>
                        </el-form-item>
                    </el-col>
                    <!--<el-col :span="8">-->
                        <!--<el-tree-->
                                <!--:data="orgList"-->
                                <!--show-checkbox-->
                                <!--node-key="id"-->
                                <!--ref="tree"-->
                                <!--:props="defaultProps">-->
                        <!--</el-tree>-->
                    <!--</el-col>-->
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">保存</el-button>
                <el-button @click.native="editFormVisible = false" @click="resetForm('editForm')">取消</el-button>
            </div>
        </el-dialog>

        <!--新增界面-->
        <el-dialog title="新增" v-model="addFormVisible" :visible.sync="addFormVisible" @close= "resetForm('addForm')">
            <el-form  :model="addForm" label-width="80px" :rules="formRules" ref="addForm">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="addForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="账号" prop="userName">
                    <el-input v-model="addForm.userName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-radio-group v-model="addForm.sex">
                        <el-radio class="radio" :label="1">男</el-radio>
                        <el-radio class="radio" :label="0">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="电话" prop="mobile">
                    <el-input type="text" v-model="addForm.mobile" ></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input type="text"  v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="部门" prop="deptId">
                    <el-select v-model="addForm.deptId" placeholder="请选择">
                        <el-option
                                v-for="item in deptList"
                                :key="item.id"
                                :value ="item.id"
                                :label="item.name">
                        </el-option>
                    </el-select>
                </el-form-item>
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
                <el-form-item label="仓库" prop="repertoryIds">
                    <el-select v-model="addForm.repertoryIds"  multiple placeholder="请选择">
                        <el-option
                                v-for="item in repertoryList"
                                :key="item.id"
                                :value ="item.id"
                                :label="item.storeName">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-row :gutter="30">
                    <el-col :span="16">
                        <el-form-item label="功能角色">
                            <el-transfer
                                    v-model="roleList"
                                    :props="{
                                          key: 'id',
                                          label: 'roleName'
                                        }"
                                    :titles="['功能角色', '已选角色']"
                                    :data="roleAllList">
                            </el-transfer>
                        </el-form-item>
                        <el-form-item label="数据角色">
                            <el-transfer
                                    v-model="dataRoleList"
                                    :props="{
                                      key: 'id',
                                      label: 'dataRoleName'
                                    }"
                                    :titles="['数据角色', '已选角色']"
                                    :data="dataRoleAllList">
                            </el-transfer>
                        </el-form-item>
                    </el-col>
                    <!--<el-col :span="8">-->
                        <!--<el-tree-->
                                <!--:data="orgList"-->
                                <!--show-checkbox-->
                                <!--ref="tree"-->
                                <!--node-key="id"-->
                                <!--:props="defaultProps">-->
                        <!--</el-tree>-->
                    <!--</el-col>-->
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false" @click="resetForm('addForm')">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import {getUserList, removeUser, batchRemoveUser, editUser, addUser,getRoleListByStatus, getRoleByUserId} from '../../api/api';
    import {editUserStatus, getDeptSelectList,resetPassword,getDataRoleByUserId,getDataRoleListByStatus} from '../../api/api';
    import {getOrgList,getOrgByUserId} from '../../api/api';

    import {getRepertoryList} from '../../api/api';

    import ElButton from "../../../node_modules/element-ui/packages/button/src/button";
    export default {
        components: {ElButton},
        data() {
            var checkMobile = (rule, value, callback) => {
                var reg = new RegExp(/^1[34578]\d{9}$/);
                if (!reg.test(value)) {
                    callback(new Error('请确认手机号码是否填写正确'));
                } else {
                    callback();
                }
            };
            // var checkEmail = (rule, value, callback) => {
            //     var reg = new RegExp(/[a-zA-Z0-9]{1,10}@[a-zA-Z0-9]{1,5}\.[a-zA-Z0-9]{1,5}/);
            //     if (!reg.test(value)) {
            //         callback(new Error('请确认邮箱是否填写正确'));
            //     } else {
            //         callback();
            //     }
            // };
            return {
                options: [{
                    value: 1,
                    label: '启用'
                },{
                    value: 0,
                    label: '停用'
                }],
                filters: {
                    name: '',
                    userName:''
                },
                defaultProps: {
                    children: 'children',
                    label: 'orgName',
                    id:'id'
                },
                list: [],
                repertoryList:[],//仓库列表
                orgList:[],//组织列表
                deptList:[],//部门列表
                roleAllList:[],//所有功能角色列表
                roleList:[],//当前用户拥有功能角色列表
                dataRoleAllList:[],//所有数据角色列表
                dataRoleList:[],//当前用户拥有数据角色列表
                total: 0,
                pageNum: 1, //当前页码
                pageSize: 10,//页数
                listLoading: false,
                sels: [],//列表选中列
                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                formRules: {
                    name: [{required: true, message: '请输入姓名', trigger: 'blur'}],
                    userName: [{required: true, message: '请输入账号', trigger: 'blur'}],
                    sex: [{required: true, message: '请选择性别', trigger: 'change'}],
                    status: [{required: true, message: '请选择状态', trigger: 'change'}],
                    deptId: [{required: true, message: '请选择部门', trigger: 'change'}],
                    repertoryIds:[{type: 'array', required: true, message: '请选择仓库', trigger: 'change'}],
                    mobile: [
                        {required: true, message: '请输入电话', trigger: 'blur'},
                        {validator: checkMobile, trigger: 'blur'}
                        ],
                   // email: [{validator: checkEmail, trigger: 'blur'}],
                },
                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                //编辑界面数据
                editForm: {
                    userName:'',
                    name:'',
                    sex:'',
                    mobile:'',
                    email:'',
                    deptId:'',
                    status:'',
                    roleIds:[],
                    dataRoleIds:[],
                    repertoryIds:[],
                },
                //新增界面数据
                addForm: {
                    userName:'',
                    name:'',
                    sex:'',
                    mobile:'',
                    email:'',
                    deptId:'',
                    status:'',
                    roleIds:[],
                    dataRoleIds:[],
                    repertoryIds:[],
                },
            }
        },
        methods: {
            //性别显示转换
            formatSex: function (row, column) {
                return row.sex === 1 ? '男' : row.sex === 0 ? '女' : '未知';
            },
            //状态显示转换
            formatStatus: function (row, column) {
                return row.status === 1 ? '启用' : row.status === 0 ? '停用' : '未知';
            },
            //切换页数
            handleCurrentChange(val) {
                this.pageNum = val;
                this.getUsers();
            },
            //处理分页条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.getUsers();
            },

            searchData(){
                this.pageNum = 1;
                this.getUsers();
            },

            //获取用户列表
            getUsers() {
                let para = {
                    name: this.filters.name,
                    userName: this.filters.userName,
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    }
                };
                this.listLoading = true;
                getUserList(para).then((res) => {
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
                    removeUser(para).then((res) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(res)) {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getUsers();
                        }
                    });
                }).catch(() => {

                });
            },

            //修改状态
            editStatus: function (index, row) {
                let para = {
                     status: row.status === 1 ? 0 : 1,
                     id: row.id
                };
                this.listLoading = true;
                editUserStatus(para).then((res) => {
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.listLoading = false;
                        this.getUsers();
                    }
                }, () => { this.listLoading = false; } ).catch(() => {});
            },


            //重置密码
            resetPwd: function (index, row) {
                let para = {
                    id: row.id
                };
                this.listLoading = true;
                resetPassword(para).then((res) => {
                    this.listLoading = false;
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.$message({
                            message: '重置密码成功',
                            type: 'success'
                        });
                        this.getUsers();
                    }
                }, () => { this.listLoading = false; } ).catch(() => {});
            },

            //显示编辑界面
            handleEdit: function (index, row) {
                if(row.repertoryId !== null){
                    row.repertoryIds = row.repertoryId.split(",").map((value)=> {
                        return  parseInt(value);
                    })
                }
                this.editForm = Object.assign({}, row);
                this.editFormVisible = true;
                this.deptList = [];
                this.roleAllList = [];
                this.orgList = [];
                this.repertoryList = [];
                //获取部门数据
                this.getDept();
                //获取所有功能角色信息
                this.getAllRole();
                //获取所有数据角色信息
                this.getAllDataRole();
                //获取所有组织信息
                this.getAllOrgList();
                //获取仓库信息
                this.getRepertory();
                //获取用户功能角色信息
                this.getUserRole(row.id);
                //获取用户数据角色信息
                this.getUserDataRole(row.id);
                //获取用户数据角色信息
                this.getUserOrg(row.id);
            },

            //显示新增界面
            handleAdd: function () {
                this.addFormVisible = true;
                this.orgList = [];
                this.deptList = [];
                this.roleAllList = [];
                this.dataRoleAllList = [];
                this.repertoryList = [];
                this.getDept();
                this.getAllRole();
                this.getAllDataRole();
                this.getAllOrgList();
                this.getRepertory();
                this.roleList = [];
                this.dataRoleList = [];
            },

            //编辑
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            let para = Object.assign({}, this.editForm);
                            para.roleIds = this.roleList;
                            para.dataRoleIds = this.dataRoleList;
                            //para.orgIds = this.$refs.tree.getCheckedKeys();
                            editUser(para).then((res) => {
                                this.editLoading = false;
                                if (this.GLOBAL.isResonseSuccess(res)) {
                                    this.$message({
                                        message: '提交成功',
                                        type: 'success'
                                    });
                                    this.$refs['editForm'].resetFields();
                                    this.editFormVisible = false;
                                    this.getUsers();
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
                            para.roleIds = this.roleList;
                            para.dataRoleIds = this.dataRoleList;
                            //para.orgIds = this.$refs.tree.getCheckedKeys();
                            addUser(para).then((res) => {
                                this.addLoading = false;
                                if (this.GLOBAL.isResonseSuccess(res)) {
                                    this.$message({
                                        message: '提交成功',
                                        type: 'success'
                                    });
                                    this.$refs['addForm'].resetFields();
                                    this.addFormVisible = false;
                                    this.getUsers();
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
                var ids = this.sels.map(item => item.id).toString();
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let para = {ids: ids};
                    batchRemoveUser(para).then((res) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(res)) {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getUsers();
                        }
                    });
                }).catch(() => {

                });
            },

            //获取部门
            getDept: function() {
                getDeptSelectList({}).then((res) => {
                    this.listLoading = false;
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.deptList = res.data.list;
                    }
                    return false;
                }, () => { this.listLoading = false; } ).catch(() => {});
            },


            //获取所有没有禁用的功能角色
            getAllRole: function() {
                getRoleListByStatus().then((res) => {
                    this.listLoading = false;
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.roleAllList = res.data.list;
                    }
                }, () => { this.listLoading = false; } ).catch(() => {});
            },

            //获取所有没有禁用的数据角色
            getAllDataRole: function() {
                getDataRoleListByStatus().then((res) => {
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.dataRoleAllList = res.data.list;
                    }
                }, () => {});
            },


            //获取用户已拥有的功能角色
            getUserRole: function(userId) {
                getRoleByUserId({id: userId}).then((res) => {
                    this.listLoading = false;
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.roleList = res.data;
                    }
                }, () => { this.listLoading = false; } ).catch(() => {});
            },

            //获取仓库
            getRepertory: function() {
                getRepertoryList({status:1}).then((res) => {
                    this.listLoading = false;
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.repertoryList = res.data;
                        if (this.repertoryList.length > 0) {
                            let pa = {
                                storeName:"特殊仓库",
                                storeNo:"-1",
                                id: -1
                            }
                            this.repertoryList.push(pa)
                        }
                    }
                    return false;
                }, () => { this.listLoading = false; } ).catch(() => {});
            },


            //获取用户已拥有的数据角色
            getUserDataRole: function(userId) {
                getDataRoleByUserId({id: userId}).then((res) => {
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.dataRoleList = res.data;
                    }
                }, () => {} ).catch(() => {});
            },


            //获取组织信息
            getAllOrgList: function() {
                getOrgList({}).then((res) => {
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.orgList = res.data;
                    }
                }, () => {} ).catch(() => {});
            },

            //获取用户已拥有组织
            getUserOrg: function(userId) {
                getOrgByUserId({id: userId}).then((res) => {
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.$refs.tree.setCheckedKeys(res.data);
                    }
                }, () => {} ).catch(() => {});
            },

            //重置
            resetForm(formName) {
                this.listLoading = false;
                this.editLoading = false;
                this.addLoading = false;
                this.$refs[formName].resetFields();
            }
        },
        mounted() {
            this.getUsers();
        }
    }

</script>

<style scoped>
    a{
        text-decoration: none;
        cursor: pointer;
        color: blue
    }
    a:hover {
        color: orange;
    }
    a:active {
        color: orange
    }
</style>