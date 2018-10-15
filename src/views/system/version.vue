<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-form align="right" :inline="true"  class="demo-form-inline">
                <el-form-item label="版本类型：" prop="type">
                    <el-select v-model="addForm.type" placeholder="请选择" clearable >
                        <el-option v-for="item in type" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-button type="primary" v-on:click="showAddDialog">新增</el-button>
                <el-button type="primary" v-on:click="getList(1)">查询</el-button>
            </el-form>
        </el-col>
        <!--列表-->
        <el-table :data="list"  highlight-current-row  v-loading="listLoading" style="width: 100%;">
            <el-table-column prop="typeName" label="类型"width="200px" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="versionCode" label="版本号代码" width="200px" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="versionName" label="版本号名称"width="200px" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="softName" label="安装包名称" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="updateDescription" label="软件升级描述" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="downloadUrl" label="下载链接" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="forcedToUpdate" label="是否强制更新" :formatter="formatForced" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="createTime" label="发布时间" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="name" label="操作" width="220px" sortable show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-button v-if="scope.row.status==0" type="primary" size="mini" @click="enableVersion(scope.row)">启用</el-button>
                    <el-button v-if="scope.row.status==1" type="primary" size="mini" @click="disableVersion(scope.row)">禁用</el-button>
                    <el-button type="primary" size="mini" @click="showEditMdl(scope.row)">编辑</el-button>
                    <el-button type="primary" size="mini" @click="delVersion(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-row :gutter="24" style="padding-top: 10px;">
            <el-col :span="24">
                <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                               :current-page="pageNum"
                               :page-sizes="[10, 20, 30, 40]" :page-size="pageSize"
                               layout="total, sizes, prev, pager, next, jumper" :total="total" style="float: right">
                </el-pagination>
            </el-col>
        </el-row>

        <el-dialog title="添加版本" :visible.sync="addDialog" :before-close="handleClose">
            <el-form  v-loading="addLoading"  :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
                <el-form-item label="版本类型：" prop="type">
                    <el-select v-model="addForm.type" placeholder="请选择" clearable >
                        <el-option v-for="item in type" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="版本号：" prop="versionCode">
                    <el-input v-model="addForm.versionCode" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="版本名：" prop="versionName">
                    <el-input v-model="addForm.versionName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="软件名称：" prop="softName">
                    <el-input v-model="addForm.softName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="上传APK文件：" prop="supplierName">
                    <el-upload
                            ref="my-upload"
                            :action="uploadUrl"
                            :limit="1"
                            :show-file-list="true"
                            :multiple="false"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :before-remove="beforeRemove"
                            :on-exceed="handleExceed"
                            :file-list="fileList"
                            :before-upload="beforeAvatarUpload"
                            :on-success="handleAvatarSuccess"
                            :on-error="uploadError"
                    >
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="软件描述：" prop="updateDescription">
                    <el-input type="textarea" v-model="addForm.updateDescription" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="下载链接：" prop="downloadUrl">
                    <el-input v-model="addForm.downloadUrl" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="是否强制更新：" prop="downloadUrl">
                    <el-radio-group v-model="addForm.forcedToUpdate">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addDialog = false" >取消</el-button>
                <el-button type="primary" @click.native="addVersion" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
        <el-dialog title="修改版本" :visible.sync="editDialog" :before-close="handleClose">
            <el-form  v-loading="editLoading"  :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
                <el-form-item label="版本类型：" prop="type">
                    <el-select v-model="editForm.type" :disabled="true" placeholder="请选择" clearable >
                        <el-option v-for="item in type" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="版本号："  prop="versionCode">
                    <el-input v-model="editForm.versionCode" :disabled="true" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="版本名："  prop="versionName">
                    <el-input v-model="editForm.versionName" :disabled="true" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="软件名称：" prop="softName">
                    <el-input v-model="editForm.softName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="上传APK文件：" prop="supplierName">
                    <el-upload
                            ref="my-upload"
                            :action="uploadUrl"
                            :limit="1"
                            :show-file-list="true"
                            :multiple="false"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :before-remove="beforeRemove"
                            :on-exceed="handleExceed"
                            :file-list="fileList"
                            :before-upload="beforeAvatarUpload"
                            :on-success="handleAvatarSuccess"
                            :on-error="uploadError"
                    >
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="软件描述：" prop="updateDescription">
                    <el-input type="textarea" v-model="editForm.updateDescription" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="下载链接：" prop="downloadUrl">
                    <el-input v-model="editForm.downloadUrl" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="是否强制更新：" prop="downloadUrl">
                    <el-radio-group v-model="editForm.forcedToUpdate">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editDialog = false" >取消</el-button>
                <el-button type="primary" @click.native="editVersion" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import {getVersionList,addVersion,enableVersion,disableVersion,delVersion,getUploadOthersUrl,versionTypeList,getVersion,editVersion} from '../../api/api';

    export default {
        data() {
            return {
                type:[],
                fileList:[],
                addForm:this.getInitData(),
                addFormRules:{
                    type: [{required: true, message: '请选择版本类型', trigger: 'blur'}],
                    versionCode: [{required: true, message: '请输入版本号', trigger: 'blur'}, {
                        pattern: /^[0-9]\d{0,8}$/,
                        message: '版本号只能为小于8位的纯数字'
                    }],
                    versionName: [{required: true, message: '请输入版本名称', trigger: 'blur'}],
                    softName: [{required: true, message: '请输入软件名称', trigger: 'blur'}],
                    updateDescription: [{required: true, message: '请输入软件描述', trigger: 'blur'}],
                },
                editFormRules:{
                    type: [{required: true, message: '请选择版本类型', trigger: 'blur'}],
                    versionCode: [{required: true, message: '请输入版本号', trigger: 'blur'}, {
                        pattern: /^[0-9]\d{0,8}$/,
                        message: '版本号只能为小于8位的纯数字'
                    }],
                    versionName: [{required: true, message: '请输入版本名称', trigger: 'blur'}],
                    softName: [{required: true, message: '请输入软件名称', trigger: 'blur'}],
                    updateDescription: [{required: true, message: '请输入软件描述', trigger: 'blur'}],
                },
                editForm:{},
                listLoading: false,
                addLoading:false,
                editLoading:false,
                addDialog:false,
                editDialog:false,
                uploadUrl: getUploadOthersUrl(),
                list:[],
                total: 0,
                pageNum: 1, //当前页码
                pageSize: 10,//页数
            }
        },
        methods: {
            formatForced: function(row){
                return row.forcedToUpdate == true ? "是" :"否";
            },
            handleClose(done) {
                this.$confirm('还未保存确认关闭？').then(_ => {
                    this.clearForm();
                    this.addDialog = false;
                }).catch(_ => {});
            },
            //获取初始化数据
            getInitData:function(){
                return {
                    type:'',
                    versionCode:'',
                    versionName:'',
                    softName:'',
                    updateDescription:'',
                    downloadUrl:'',
                    forcedToUpdate:1
                };
            },
            clearForm: function(){
                this.addForm = this.getInitData();
                this.$refs['my-upload'].clearFiles();
            },
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
            initTypeList(){
                this.listLoading = true;
                versionTypeList().then((res) => {
                    this.listLoading = false;
                    this.type = res.data;
                }).catch(err => {
                    var errMsg = err.response.data.message;
                    this.$message({showClose: true, message: errMsg, type: 'error'});
                });
            },
            //获取数据列表
            getList(pageNum) {
                this.listLoading = true;
                this.pageNum = pageNum || this.pageNum;
                let para = {
                    type :this.addForm.type,
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    }
                };
                getVersionList(para).then((res) => {
                    this.listLoading = false;
                    this.total = res.data.paginationInfo.total;
                    this.list = res.data.list;
                }).catch(err => {
                    var errMsg = err.response.data.message;
                    this.$message({showClose: true, message: errMsg, type: 'error'});
                });
            },
            showAddDialog(){
                this.addDialog = true;
            },
            addVersion(){
                this.$refs.addForm.validate((valid) => {
                    if(valid){
                        if((this.addForm.type == 0 ||this.addForm.type == 2 || this.addForm.type == 4 || this.addForm.type == 6) && this.addForm.downloadUrl == ''){
                            this.$message({ message: '安卓端请填写下载地址', type: 'error' });
                            return;
                        }
                        addVersion(this.addForm).then((res) => {
                            if (res.code==1) {
                                this.addDialog = false;
                                this.$message({ message: '添加成功', type: 'success' });
                                this.clearForm();
                                this.getList(1);
                            }else{
                                this.$message({showClose: true, message: res.message, type: 'error'});
                            }
                        }).catch(err => {
                            var errMsg = err.response.data.message;
                            this.$message({showClose: true, message: errMsg, type: 'error'});
                        });
                    }
                });
            },
            enableVersion(row){
                enableVersion(row.id).then((res) => {
                    if (res.code==1) {
                        this.$message({ message: '启用成功', type: 'success' });
                        this.getList();
                    }
                }).catch(err => {
                    var errMsg = err.response.data.message;
                    this.$message({showClose: true, message: errMsg, type: 'error'});
                });
            },
            disableVersion(row){
                disableVersion(row.id).then((res) => {
                    if (res.code==1) {
                        this.$message({ message: '禁用成功', type: 'success' });
                        this.getList();
                    }
                }).catch(err => {
                    var errMsg = err.response.data.message;
                    this.$message({showClose: true, message: errMsg, type: 'error'});
                });
            },
            delVersion(row){
                this.$confirm('确认删除该记录吗?', '提示', { type: 'warning' }).then(() => {
                    delVersion(row.id).then((res) => {
                        if (res.code==1) {
                            this.$message({ message: '删除成功', type: 'success' });
                            this.getList();
                        }
                    }).catch(err => {
                        var errMsg = err.response.data.message;
                        this.$message({showClose: true, message: errMsg, type: 'error'});
                    });
                }).catch(() => {});
            },
            showEditMdl(row){
                getVersion(row.id).then((res) => {
                    if (res.code==1) {
                        this.editDialog = true;
                        this.editForm = res.data;
                    }
                }).catch(err => {  });
            },
            editVersion(){
                this.$refs.editForm.validate((valid) => {
                    if(valid){
                        if((this.editForm.type == 0 ||this.editForm.type == 2 || this.editForm.type == 4 || this.editForm.type == 6) && this.editForm.downloadUrl == ''){
                            this.$message({ message: '安卓端请填写下载地址', type: 'error' });
                            return;
                        }
                        editVersion(this.editForm).then((res) => {
                            if (res.code==1) {
                                this.editDialog = false;
                                this.$message({ message: '修改成功', type: 'success' });
                                this.clearForm();
                                this.getList(1);
                            }else{
                                this.$message({showClose: true, message: "修改失败", type: 'error'});
                            }
                        }).catch(err => {
                            this.$message({showClose: true, message: "修改失败", type: 'error'});
                        });
                    }
                });
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
                this.addForm.downloadUrl = '';
            },
            handlePreview(file) {
                console.log(file);
            },
            handleExceed(files, fileList) {
                this.$message.warning('当前限制选择 1 个文件');
            },
            beforeRemove(file, fileList) {
                return this.$confirm('确定移除?');
            },
            beforeAvatarUpload(file) {

            },handleAvatarSuccess(res, file) {
                if(this.editDialog){
                    this.editForm.downloadUrl = process.env.IMG_URL + res.data.relativePath;
                }else if(this.addDialog){
                    this.addForm.downloadUrl = process.env.IMG_URL + res.data.relativePath;
                }
            },
            uploadError(response, file, fileList){
                this.$message({ message: '上传失败', type: 'error' });
            }
        },
        mounted() {
            this.initTypeList();
            this.getList();
        }
    }
</script>