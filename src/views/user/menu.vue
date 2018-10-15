<template>
    <section class="content">
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">

            <el-form align="right" :inline="true"  class="demo-form-inline">
                <el-form-item label="菜单名称">
                    <el-input v-model="filters.name" placeholder="菜单名称"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="filters.status" placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" v-on:click="searchData">查询</el-button>
                </el-form-item>
                <el-form-item label="">
                    <el-button v-if="isAuth('mpys:menu:insert')" type="primary" @click="handleEditOrAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!--列表-->
        <tree-grid :columns="columns" :listLoading = 'listLoading' :tree-structure="true" @handleEdit="handleEditOrAdd" @handleDel="handleDel" @editStatus="editStatus" :data-source="dataSource"></tree-grid>

        <!--编辑界面-->
        <el-dialog :title="title" v-model="formVisible" :visible.sync="formVisible">
            <el-form :model="form" label-width="80px" :rules="formRules" ref="form">
                <el-form-item label="类型" prop="type">
                    <el-select v-model="form.type" placeholder="请选择" v-on:change="change">
                        <el-option
                                v-for="item in menuTypes"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="父菜单" prop="value">
                    <el-select v-model="form.parentId" placeholder="请选择" :disabled ="isDisabled" >
                        <el-option
                                v-for="item in menuList"
                                :key="item.id"
                                :label="item.value"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="菜单名称" prop="name">
                    <el-input v-model="form.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="菜单URL" prop="path">
                    <el-input v-model="form.path" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="授权" prop="perms">
                    <el-input v-model="form.perms" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="菜单图标" prop="iconCls">
                    <el-row :gutter="10">
                        <el-col :span="1">
                            <i :class="form.iconCls"></i>
                        </el-col>
                        <el-col :span="5">
                           <el-input v-model="form.iconCls" auto-complete="off" :disabled="true"></el-input>
                        </el-col>
                        <el-col :span="3">
                            <el-button size="small" @click="handleIcon" type="primary" plain>选择Icon</el-button>
                        </el-col>
                    </el-row>

                </el-form-item>
                <el-form-item label="排序" prop="orderNum">
                    <el-input v-model="form.orderNum" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-select v-model="form.status" placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="数据" prop="dataFlag" >
                    <el-select v-model="form.dataFlag" placeholder="请选择" :disabled="flag">
                        <el-option
                                v-for="item in dataFlag"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="submit" :loading="loading">保存</el-button>
                <el-button @click.native="formVisible = false">取消</el-button>
            </div>
        </el-dialog>

        <!--菜单图标界面-->
        <el-dialog title="菜单图标" v-model="iconVisible" :visible.sync="iconVisible" :modal-append-to-body="false">
            <el-col :span="24">
                <ul class="iconCls-list">
                    <li  v-for="item in iconData">
                        <span><i :class="item.iconName"></i><span @click="selectIcon" class="icon-name">{{item.iconName}}</span></span>
                    </li>
                </ul>
            </el-col>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="iconVisible = false">取消</el-button>
            </div>
        </el-dialog>


    </section>
</template>

<script>
    import {TreeGrid} from '../../components/treeTable'
    import {getMenuList, removeMenu, batchRemoveMenu, editMenu, addMenu} from '../../api/api';
    import {editMenuStatus, getMenuNoButton,dynamicUpdatePerms} from '../../api/api';

    export default {
        components: {
            TreeGrid
        },
        data() {
            return {
                listLoading:false,
                filters: {
                    name: '',
                    status:''
                },
                op:[],
                options: [{
                    value: 1,
                    label: '启用'
                },{
                    value: 0,
                    label: '停用'
                }],
                dataFlag: [{
                    value: 1,
                    label: '区分'
                },{
                    value: 0,
                    label: '不区分'
                }],
                menuTypes: [{
                    value: 1,
                    label: '目录'
                },{
                    value: 2,
                    label: '菜单'
                },{
                    value: 3,
                    label: '按钮'
                }],
                columns: [
                    {dataIndex: "name", text: "菜单名称"},
                    {dataIndex: "iconCls", text: "菜单图标"},
                    {dataIndex: "orderNum", text: "排序"},
                    {dataIndex: "path", text: "菜单URL"},
                    {dataIndex: "menuType", text: "类型"},
                    {dataIndex: "perms", text: "授权"},
                    {dataIndex: "menuStatus", text: "状态"},
                    {dataIndex: "menuDataFlag", text: "数据"}],
                dataSource: [],
                menuList:[],//不含按钮的菜单
                total: 0,
                pageNum: 1, //当前页码
                pageSize: 10,//页数
                title:"新增",//弹出框标题
                listLoading: false,
                iconVisible: false, //菜单界面是否显示
                sels: [],//列表选中列
                formVisible: false,//新增/编辑界面是否显示
                loading: false,
                isDisabled: false,//父菜单默认不禁用
                flag:true,
                formRules: {
                    type: [{required: true, message: '请选择类型', trigger: 'blur'}],
                    name: [{required: true, message: '请输入菜单', trigger: 'blur'}],
                    status: [{required: true, message: '请选择状态', trigger: 'blur'}],
                },
                value:'',//下拉框显示值
                //编辑/新增界面数据
                form: {
                    id:'' ,
                    parentId:'' ,
                    name:'' ,
                    path:'' ,
                    perms:'' ,
                    type:'' ,
                    iconCls:'' ,
                    orderNum:'' ,
                    status:'' ,
                    dataFlag:'',
                },
                /*下拉图表数据*/
                iconData:[
                    {iconName:"el-icon-error"},
                    {iconName:"el-icon-success"},
                    {iconName:"el-icon-warning"},
                    {iconName:"el-icon-question"},
                    {iconName:"el-icon-back"},
                    {iconName:"el-icon-arrow-down"},
                    {iconName:"el-icon-arrow-right"},
                    {iconName:"el-icon-arrow-up"},
                    {iconName:"el-icon-caret-left"},
                    {iconName:"el-icon-caret-bottom"},
                    {iconName:"el-icon-caret-top"},
                    {iconName:"el-icon-caret-right"},
                    {iconName:"el-icon-d-arrow-left"},
                    {iconName:"el-icon-d-arrow-right"},
                    {iconName:"el-icon-remove-outline"},
                    {iconName:"el-icon-circle-plus-outline"},
                    {iconName:"el-icon-close"},
                    {iconName:"el-icon-check"},
                    {iconName:"el-icon-circle-close"},
                    {iconName:"el-icon-circle-check"},
                    {iconName:"el-icon-circle-close-outline"},
                    {iconName:"el-icon-circle-check-outline"},
                    {iconName:"el-icon-zoom-out"},
                    {iconName:"el-icon-zoom-in"},
                    {iconName:"el-icon-d-caret"},
                    {iconName:"el-icon-sort"},
                    {iconName:"el-icon-sort-down"},
                    {iconName:"el-icon-sort-up"},
                    {iconName:"el-icon-tickets"},
                    {iconName:"el-icon-document"},
                    {iconName:"el-icon-goods"},
                    {iconName:"el-icon-sold-out"},
                    {iconName:"el-icon-news"},
                    {iconName:"el-icon-message"},
                    {iconName:"el-icon-date"},
                    {iconName:"el-icon-printer"},
                    {iconName:"el-icon-time"},
                    {iconName:"el-icon-bell"},
                    {iconName:"el-icon-mobile-phone"},
                    {iconName:"el-icon-service"},
                    {iconName:"el-icon-view"},
                    {iconName:"el-icon-menu"},
                    {iconName:"el-icon-more"},
                    {iconName:"el-icon-more-outline"},
                    {iconName:"el-icon-star-on"},
                    {iconName:"el-icon-star-off"},
                    {iconName:"el-icon-location"},
                    {iconName:"el-icon-location-outline"},
                    {iconName:"el-icon-phone"},
                    {iconName:"el-icon-phone-outline"},
                    {iconName:"el-icon-picture"},
                    {iconName:"el-icon-picture-outline"},
                    {iconName:"el-icon-delete"},
                    {iconName:"el-icon-search"},
                    {iconName:"el-icon-edit"},
                    {iconName:"el-icon-rank"},
                    {iconName:"el-icon-refresh"},
                    {iconName:"el-icon-share"},
                    {iconName:"el-icon-setting"},
                    {iconName:"el-icon-upload"},
                    {iconName:"el-icon-upload2"},
                    {iconName:"el-icon-download"},
                    {iconName:"el-icon-loading"}
                ],
                defaultProps: {
                    children: 'children',
                    label: 'name',
                    id:'id'
                }
            }
        },
        methods: {

            change() {
                let type = this.form.type;
                this.isDisabled = type === 1;
                this.flag = type !== 2;

            },

            searchData(){
                this.pageNum = 1;
                this.getData();
            },

            //修改状态
            editStatus: function (index, row) {
                let para = {
                    status: row.status === 1 ? 0 : 1,
                    id: row.id
                };
                this.listLoading = true;
                editMenuStatus(para).then((res) => {
                    this.listLoading = false;
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.updatePerms();
                        this.getData();
                    }
                }, () => { this.listLoading = false; } ).catch(() => {});
            },

            //获取菜单列表
            getData() {
                let para = {
                    name: this.filters.name,
                    status: this.filters.status,
                };
                this.listLoading = true;
                getMenuList(para).then((res) => {
                    this.listLoading = false;
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.dataSource = res.data.list;
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
                    removeMenu(para).then((res) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(res)) {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.updatePerms();
                        }
                        this.getData();
                    });
                }).catch(() => {});
            },
            //选择图标单击事件
            selectIcon(event){
                this.form.iconCls = event.target.innerText;
                this.iconVisible = false;
            },
            //显示选择菜单图片界面
            handleIcon: function(){
                this.iconVisible = true;
            },


            //显示编辑/新增界面
            handleEditOrAdd: function (index, row) {
                if (row) {
                    this.title= "编辑";
                    this.form = Object.assign({}, row);
                    this.form.children = null;
                    this.form._parent = null;
                    this.flag = parseInt(this.form.type) !== 2;
                } else {
                    this.title= "新增";
                    this.form = {};
                }
                this.formVisible = true;
                this.listLoading = true;
                getMenuNoButton({}).then((res) => {
                    this.listLoading = false;
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.menuList = res.data;
                    }
                }, () => { this.listLoading = false; } ).catch(() => {});
            },


            //编辑/新增
            submit: function () {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.loading = true;
                            let para = this.form;
                            if(para.id){
                                para.parentId = para.type === 1 ? 0 : para.parentId;
                                editMenu(para).then((res) => {
                                    this.loading = false;
                                    if (this.GLOBAL.isResonseSuccess(res)) {
                                        this.$message({
                                            message: '修改成功',
                                            type: 'success'
                                        });
                                        this.updatePerms();
                                    }
                                    this.$refs['form'].resetFields();
                                    this.formVisible = false;
                                    this.getData();
                                });
                            } else {
                                para.parentId = para.type === 1 ? 0 : para.parentId;
                                addMenu(para).then((res) => {
                                    this.loading = false;
                                    if (this.GLOBAL.isResonseSuccess(res)) {
                                        this.$message({
                                            message: '新增成功',
                                            type: 'success'
                                        });
                                        this.updatePerms();
                                    }
                                    this.$refs['form'].resetFields();
                                    this.formVisible = false;
                                    this.getData();
                                });
                            }

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
                    batchRemoveMenu(para).then((res) => {
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
            },
        },
        mounted() {
            this.getData();
        }
    }

</script>

<style scoped>
    /*图标选择样式*/

    .iconCls-list li{
        list-style: none;
        float: left;
        width: 200px;
        height: 50px;

    }
    .iconCls-list li span{
        cursor: pointer;
    }
    .iconCls-name{
        margin-left: 10px;
    }

</style>