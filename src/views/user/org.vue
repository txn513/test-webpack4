<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">

            <el-form align="right" :inline="true"  class="demo-form-inline">
                <el-form-item label="" >
                    <el-input v-model="filters.orgName" placeholder="请输入组织名称"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" v-on:click="searchData">查询</el-button>
                </el-form-item>
                <el-form-item label="">
                    <el-button v-if="isAuth('mpys:org:insert')" type="primary" @click="handleEditOrAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <tree-org :columns="columns" :tree-structure="true" @handleEdit="handleEditOrAdd" @handleDel="handleDel" @editStatus="editStatus" :data-source="dataSource"></tree-org>


        <!--编辑界面-->
        <el-dialog :title="title" v-model="formVisible" :visible.sync="formVisible" @close="closeDialog">
            <el-form :model="form" label-width="80px" :rules="formRules" ref="form">
                <el-form-item label="上级组织" prop="orgLevel">
                    <el-select v-model="form.parentId" placeholder="请选择">
                        <el-option
                                v-for="item in orgList"
                                :key="item.id"
                                :label="item.value"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

               <el-form-item label="编码" prop="orgCode">
                  <el-input v-model="form.orgCode" auto-complete="off"></el-input>
               </el-form-item>
               <el-form-item label="名称" prop="orgName">
                  <el-input v-model="form.orgName" auto-complete="off"></el-input>
               </el-form-item>
               <el-form-item label="类型" prop="orgType">
                   <el-select v-model="form.orgType" placeholder="请选择" v-on:change="change()">
                       <el-option
                               v-for="item in orgTypes"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value">
                       </el-option>
                   </el-select>
               </el-form-item>
               <el-form-item label="排序" prop="orgNo">
                  <el-input v-model="form.orgNo" auto-complete="off"></el-input>
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

                <el-form-item label="业务类型" prop="systemType" v-if="isShow">
                    <el-select v-model="form.systemType"  placeholder="请选择" v-on:change="changeSystemType()" v-on:remove-tag="removeSystemType()" multiple>
                        <el-option
                                v-for="item in systemTypeList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="仓库" prop="storeId" v-if="isStoreShow">
                    <el-select v-model="form.storeId" placeholder="请选择" multiple>
                        <el-option
                                v-for="item in storeList"
                                :key="item.id"
                                :label="item.orgName"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="工厂" prop="factoryId" v-if="isFactoryShow">
                    <el-select v-model="form.factoryId" placeholder="请选择">
                        <el-option
                                v-for="item in factoryList"
                                :key="item.id"
                                :label="item.orgName"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="submit" :loading="loading">保存</el-button>
                <el-button @click.native="closeDialog">取消</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import {TreeOrg} from '../../components/treeTable'
    import {getOrgList, removeOrg, editOrg, addOrg,editOrgStatus,getOrgListNoChildren,getOrgListByType,getBusinessList} from '../../api/api';

    export default {
        components: {
            TreeOrg
        },
        data() {
            return {
                options: [{
                    value: 1,
                    label: '启用'
                },{
                    value: 0,
                    label: '停用'
                }],
                orgTypes: [{
                    value: 1,
                    label: '工厂'
                },{
                    value: 2,
                    label: '门店'
                },{
                    value: 3,
                    label: '仓库'
                }],
                filters: {
                    orgName: '',
                },
                columns: [
                    {dataIndex: "orgCode", text: "编码"},
                    {dataIndex: "orgName", text: "名称"},
                    {dataIndex: "orgLevel", text: "级别"},
                    {dataIndex: "orgTypeName", text: "类型"},
                    {dataIndex: "orgNo", text: "顺序"},
                    {dataIndex: "statusType", text: "状态"}],
                dataSource: [],
                orgList: [],
                factoryList:[],
                storeList:[],
                systemTypeList:[],
                title:"新增",//弹出框标题
                listLoading: false,
                sels: [],//列表选中列
                formVisible: false,//编辑界面是否显示
                isShow: false,//业务类型默认不显示
                isFactoryShow: false,//新增或编辑时工厂下拉框默认不显示
                isStoreShow: false,//新增或编辑时仓库下拉框默认不显示
                loading: false,
                formRules: {
                    parentId: [{required: true, message: '请输上级组织', trigger: 'blur'}],
                    orgCode: [{required: true, message: '请输入组织编码', trigger: 'blur'}],
                    orgName: [{required: true, message: '请输入组织名称', trigger: 'blur'}],
                    status: [{required: true, message: '请选择状态', trigger: 'blur'}],
                },
                //编辑界面数据
                form: {
                    id:'' ,
                    parentId:'',
                    orgCode:'' ,
                    orgName:'' ,
                    orgLevel:'' ,
                    orgType:'' ,
                    orgNo:'' ,
                    status:'' ,
                    storeId:[],
                    factoryId:'',
                    systemType:[],
                },

            }
        },
        methods: {
            searchData(){
                this.pageNum = 1;
                this.getData();
            },

            change() {
                let type = this.form.orgType;
                if (type === 2) {
                    getBusinessList().then((res) => {
                        if (this.GLOBAL.isResonseSuccess(res)) {
                            this.systemTypeList = res.data;
                        }
                    }, () => {});
                    this.isShow = true;
                } else {
                    this.isShow = false;
                    this.isFactoryShow = false;
                    this.isStoreShow = false;
                }

            },

            changeSystemType() {
                let type = this.form.systemType;
                //经确定 1：洗护 2：名品
                //类型(1,工厂;2,门店;3,仓库)
                this.isFactoryShow = false;
                //工厂
               if (type.indexOf(1) !== -1) {
                   getOrgListByType({orgType: 1}).then((res) => {
                       if (this.GLOBAL.isResonseSuccess(res)) {
                           this.factoryList = res.data;
                       }
                       this.isFactoryShow = true;
                   }, () => {});
               }
                this.isStoreShow = false;

                //仓库
               if(type.indexOf(2) !== -1) {
                   getOrgListByType({orgType: 3}).then((res) => {
                       if (this.GLOBAL.isResonseSuccess(res)) {
                           this.storeList = res.data;
                       }
                       this.isStoreShow = true;
                   }, () => {});
               }
            },

            removeSystemType() {
                let type = this.form.systemType;
                //工厂
                if (type.indexOf(1) !== -1) {
                    this.isFactoryShow = false;
                    this.form.factoryId = '';
                }
                //仓库
                if(type.indexOf(2) !== -1) {
                    this.isStoreShow = false;
                    this.form.storeId = [];
                }
            },

            //获取列表
            getData() {
                let para = {
                    orgName: this.filters.orgName,
                };
                this.listLoading = true;
                getOrgList(para).then((res) => {
                    this.listLoading = false;
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.dataSource = res.data;
                    }
                }, () => { this.listLoading = false; });
            },

            //修改状态
            editStatus: function (index, row) {
                let para = {
                    status: row.status === 1 ? 0 : 1,
                    id: row.id
                };
                this.listLoading = true;
                editOrgStatus(para).then((res) => {
                    this.listLoading = false;
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.getData();
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
                    removeOrg(para).then((res) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(res)) {
                            this.success();
                            this.getData();
                        }
                    });
                }).catch(() => {});
            },


            //显示编辑/新增界面
            handleEditOrAdd: function (index, row) {
                if (row) {
                    this.title= "编辑";
                    this.form = Object.assign({}, row);
                    this.form.children = null;
                    this.form._parent = null;
                    this.form.orgType = this.form.orgType === 0 ? null : this.form.orgType;
                    this.form.factoryId = this.form.factoryId === -1 ? null : this.form.factoryId;
                    if (this.form.systemType) {
                        this.form.systemType = [];
                        this.form.storeId = [];
                        let array = row.systemType.split(",");
                        for (let item in array) {
                            this.form.systemType.push(parseInt(array[item]))
                        }
                        let storeArray = row.storeId.split(",");
                        for (let item in storeArray) {
                            this.form.storeId.push(parseInt(storeArray[item]))
                        }
                        getBusinessList().then((res) => {
                            if (this.GLOBAL.isResonseSuccess(res)) {
                                this.systemTypeList = res.data;
                            }
                        }, () => {});
                        this.isShow = true;
                        this.changeSystemType();
                    }
                } else {
                    this.title= "新增";
                    this.form = {};
                }
                getOrgListNoChildren().then((res) => {
                    this.listLoading = false;
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.orgList = res.data;
                    }
                });
                this.formVisible = true;
            },

            closeDialog() {
                this.formVisible = false;
                this.isShow = false;
                this.isStoreShow = false;
                this.isFactoryShow = false;
                this.loading = false;
            },

            //编辑
            submit: function () {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.loading = true;
                            let para = this.form;
                            if (para.systemType === '') {
                                para.systemType = [];
                            }
                            if (para.storeId === '') {
                                para.storeId = [];
                            }
                            if(para.id) {
                                editOrg(para).then((res) => {
                                    this.loading = false;
                                    if (this.GLOBAL.isResonseSuccess(res)){
                                        this.success("修改成功");
                                        this.$refs['form'].resetFields();
                                        this.formVisible = false;
                                        this.getData();
                                     }
                                })
                            } else {
                                addOrg(para).then((res) => {
                                    this.loading = false;
                                    if (this.GLOBAL.isResonseSuccess(res)) {
                                        this.success("新增成功");
                                        this.$refs['form'].resetFields();
                                        this.formVisible = false;
                                        this.getData();
                                    }
                                });
                            }

                        });
                    }
                });
            },

            selsChange: function (sels) {
                this.sels = sels;
            },

            success: function(message){
                this.$message({
                    message: message,
                    type: 'success'
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