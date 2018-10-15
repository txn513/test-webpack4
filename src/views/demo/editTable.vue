<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">

            <el-form align="right" :inline="true"  class="demo-form-inline">
                <el-form-item label="">
                    <el-input v-model="filters.name" placeholder="姓名"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" v-on:click="getUsers">查询</el-button>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table
                :data="users"
                height="500"
                highlight-current-row
                v-loading="listLoading"
                @selection-change="selsChange"
                style="width: 100%;">
            <el-table-column type="selection" >

            </el-table-column>
            <el-table-column prop="name" label="姓名"   sortable>
                <template slot-scope="scope">
                    <span v-if="!scope.row.editFlag">{{scope.row.name}}</span>
                    <el-input  v-if="scope.row.editFlag" size="small" v-model="scope.row.name" placeholder="请输入内容" ></el-input>
                </template>
            </el-table-column>
            <el-table-column prop="sex" label="性别"   sortable :formatter="formatSex">
                <template slot-scope="scope">
                    <span v-if="!scope.row.editFlag">{{scope.row.sex}}</span>
                    <el-radio-group v-if="scope.row.editFlag" v-model="scope.row.sex">
                        <el-radio class="radio" :label="1">男</el-radio>
                        <el-radio class="radio" :label="0">女</el-radio>
                    </el-radio-group>
                </template>
            </el-table-column>
            <el-table-column prop="age" label="年龄"   sortable>
                <template slot-scope="scope">
                    <span v-if="!scope.row.editFlag">{{scope.row.age}}</span>
                    <el-input  v-if="scope.row.editFlag" size="small" v-model="scope.row.age" placeholder="请输入内容"></el-input>
                </template>
            </el-table-column>
            <el-table-column prop="date" label="生日" sortable>
                <template slot-scope="scope">
                    <span v-if="!scope.row.editFlag">{{scope.row.date}}</span>
                    <el-input  v-if="scope.row.editFlag" size="small" v-model="scope.row.date" placeholder="请输入内容"></el-input>
                </template>
            </el-table-column>
            <el-table-column prop="address" label="地址">
                <template slot-scope="scope">
                    <span v-if="!scope.row.editFlag">{{scope.row.address}}</span>
                    <el-input  v-if="scope.row.editFlag" size="small" v-model="scope.row.address" placeholder="请输入内容" ></el-input>
                </template>
            </el-table-column>

            <el-table-column  fixed="right" label="操作" width="150">
                <template slot-scope="scope">
                    <el-button v-if="!scope.row.editFlag"  size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button v-if="!scope.row.editFlag"  type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                    <el-button v-if="scope.row.editFlag"  size="small" @click="addSubmit(scope.$index, scope.row)">确定</el-button>
                    <el-button v-if="scope.row.editFlag"   type="danger" size="small" @click="cancelAdd(scope.$index, scope.row)">取消</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" style="margin-top: 10px">
            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
            <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[1, 2, 3, 4]"
                    :page-size="4"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="50" style="float: right">
            </el-pagination>
        </el-col>
    </section>
</template>

<script>
    import util from '../../common/js/util'
    import {getUserListPage, removeUser, batchRemoveUser, editUser, addUser} from '../../api/api';

    export default {
        data() {
            return {
                filters: {
                    name: ''
                },
                users: [{
                    id:'1',
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄',
                    sex: 1,
                    age: '23',
                    editFlag:false
                }, {
                    id:'2',
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1517 弄',
                    sex: 1,
                    age: '23',
                    editFlag:false
                }, {
                    id:'3',
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1519 弄',
                    sex: 1,
                    age: '23',
                    editFlag:false
                }, {
                    id:'4',
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1516 弄',
                    sex: 1,
                    age: '25',
                    editFlag:false
                }],
                total: 50,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列
                currentPage:3,//当前页码
                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    name: [
                        {required: true, message: '请输入姓名', trigger: 'blur'}
                    ]
                },
                //编辑界面数据
                editForm: {
                    id: 0,
                    name: '',
                    sex: -1,
                    age: 0,
                    date: '',
                    address: ''
                },

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    name: [
                        {required: true, message: '请输入姓名', trigger: 'blur'}
                    ]
                },
                //新增数据
                addForm: {
                    name: '',
                    sex: -1,
                    age: 0,
                    date: '',
                    address: ''
                }

            }
        },
        methods: {
            //性别显示转换
            formatSex: function (row, column) {
                return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getUsers();
            },
            //处理分页条数
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            //切换页数
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
            },
            handleEdit:function(index,row){
                //editeFlag

            },

            //获取用户列表
            getUsers() {
                let para = {
                    page: this.page,
                    name: this.filters.name
                };
                this.listLoading = true;
                //NProgress.start();
                getUserListPage(para).then((res) => {
                    this.total = res.data.total;
                    this.users = res.data.users;
                    this.listLoading = false;
                    //NProgress.done();
                }, (res) => { this.listLoading = false; } ).catch(() => {

                });;
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = {id: row.id};
                    removeUser(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getUsers();
                    });
                }).catch(() => {

                });
            },
            //显示编辑界面
            handleEdit: function (index, row) {
                row.editFlag = true;

            },
            //显示新增界面
            handleAdd: function () {
                let addRow = {
                    name: '',
                    sex: -1,
                    age: 0,
                    date: '',
                    address: '',
                    editFlag: true

                };
                this.users.push(addRow);
            },
            //取消新增
            cancelAdd: function (index,row) {
                //根据是否包含id判断是新增还是修改
                if(row.id){
                    //修改
                   row. editFlag = false;
                   return;
                }

                //根据下标删除数组里那个新增的对象

                this.users.splice(index,1);

            },
            //新增
            addSubmit: function (index,row) {
                //根据是否包含id判断是新增还是修改
                if(row.id){
                    //修改
                    return;
                }
                //新增

                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.addForm);
                            para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
                            addUser(para).then((res) => {
                                this.addLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                this.getUsers();
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
                    //NProgress.start();
                    let para = {ids: ids};
                    batchRemoveUser(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getUsers();
                    });
                }).catch(() => {

                });
            }
        },
        mounted() {
            this.getUsers();
        }
    }

</script>

<style scoped>

</style>