<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">

            <el-form align="right" :inline="true"  class="demo-form-inline">
                <el-form-item label="">
                    <el-input v-model="filters.serviceNo" placeholder="服务编码" clearable filterable @change="resetPage"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-input v-model="filters.serviceName" placeholder="服务名称" clearable filterable @change="resetPage"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" v-on:click="searchData">查询</el-button>
                </el-form-item>
                <el-form-item label="">
                    <el-button v-if="" type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="list" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column prop="serviceNo" label="服务编码" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="serviceName" label="服务名称" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="serviceUrl" label="链接" sortable ></el-table-column>
            <el-table-column prop="orderNum" label="排序" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="status" label="状态"  sortable :formatter="formatStatus" show-overflow-tooltip></el-table-column>
            <el-table-column sortable prop="createTime" label="创建时间" show-overflow-tooltip :formatter="formatDate"></el-table-column>
            <el-table-column  fixed="right" label="操作" width="260">
                <template slot-scope="scope">
                    <el-button v-if="isAuth('mpys:serviceInfo:update')"  type="primary"  size="mini" @click="editFlag(scope.$index, scope.row)">
                        {{scope.row.status == 0 ? "启用" : "停用"}}
                    </el-button>
                    <el-button v-if="isAuth('mpys:serviceInfo:update')" type="primary"  size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button  v-if="isAuth('mpys:serviceInfo:delete')&&scope.row.status == 0" type="primary"  size="mini" @click="handleDel(scope.$index, scope.row)">删除</el-button>
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

        <!--编辑界面-->
        <el-dialog title="编辑" v-model="editFormVisible" :visible.sync="editFormVisible"  @close= "resetForm('editForm')">
            <el-form  :model="editForm" label-width="80px" :rules="formRules" ref="editForm">

                <el-form-item label="服务编码" prop="serviceNo">
                    <el-input v-model="editForm.serviceNo" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="服务名称" prop="serviceName">
                    <el-input v-model="editForm.serviceName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="链接" prop="serviceUrl">
                    <el-input v-model="editForm.serviceUrl" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="orderNum" >
                    <el-input v-model="editForm.orderNum" auto-complete="off" type="number" min="0"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-select v-model="editForm.status" placeholder="请选择">
                        <el-option
                                v-for="item in searchStatus"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="服务logo" prop="serviceLogo">
                    <fileupload @getresult="getResult" :imglist = "imgList" :number="num" :type="type"></fileupload>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">保存</el-button>
                <el-button @click.native="editFormVisible = false" @click="resetForm('editForm')">取消</el-button>
            </div>
        </el-dialog>


        <!--新增界面-->
        <el-dialog title="新增" v-model="addFormVisible" :visible.sync="addFormVisible" @close= "resetForm('addForm')" >
            <el-form  :model="addForm" label-width="80px" :rules="formRules" ref="addForm">

                <el-form-item label="服务编码" prop="serviceNo">
                    <el-input v-model="addForm.serviceNo" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="服务名称" prop="serviceName">
                    <el-input v-model="addForm.serviceName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="链接" prop="serviceUrl">
                    <el-input v-model="addForm.serviceUrl" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="orderNum" >
                    <el-input v-model="addForm.orderNum" auto-complete="off" type="number" min="0"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-select v-model="addForm.status" placeholder="请选择">
                        <el-option
                                v-for="item in searchStatus"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="服务logo" prop="serviceLogo">
                    <fileupload @getresult="getResult" :imglist = "imgList" :number="num" :type="type"></fileupload>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false" @click="resetForm('addForm')">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import util from '../../common/js/util'
    import {getServiceList, addService,editService,updateServiceState,deleteService} from '../../api/api';
    import fileupload from '@/components/fileUpload';
    import moment from 'moment';
    export default {

        components:{
            fileupload
        },
        data() {
            var checkServiceNo = (rule, value, callback) => {
                var reg = new RegExp("^[0-9]*$");
                if (!reg.test(value)) {
                    callback(new Error('请输入服务编码(必须是数字类型)'));
                }else {
                    callback();
                }
            };
            var checkOrderNum = (rule, value, callback) => {
                var reg = new RegExp("^[0-9]*$");
                if (!reg.test(value)) {
                    callback(new Error('请输入排序字段(必须是数字类型)'));
                }else {
                    callback();
                }
            };

            return {
                filters: {
                    serviceNo:null,
                    serviceName:null
                },
                searchStatus:[{
                    value: 0,
                    label: '停用'
                },{
                    value: 1,
                    label: '启用'
                }],

                type:"1",//这个是上传图片的类型 1为上传普通图片 2为上传头像 3为上传商品图片
                num:'1',//参数为1限制为只能上传一张2为多张
                imageUrl:"",
                imgList:[],
                list: [],
                total: 0,
                pageNum: 1, //当前页码
                pageSize: 10,//页数
                listLoading: false,
                sels: [],//列表选中列
                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                addFormVisible: false,//新增界面是否显示
                addLoading: false,

                formRules: {
                    serviceNo: [{required: true, message: '请输入服务编码(必须是数字类型)', trigger: 'blur'},
                        {max: 12, message: '服务编码长度过长,请重新输入', trigger: 'blur' },
                        {validator:checkServiceNo,trigger: 'blur'}],
                    serviceName: [{required: true, message: '请输入服务名称', trigger: 'blur'},
                        {max: 50, message: '服务名称长度过长,请重新输入', trigger: 'blur' }
                    ],
                    orderNum: [{required: true, message: '请输入排序字段(必须是数字类型)', trigger: 'blur'},
                        {validator:checkOrderNum,trigger: 'blur'}],
                    status: [{required: true, message: '请选择服务状态', trigger: 'change'}],
                    serviceLogo: [{required: true, message: '请上传图片', trigger: 'blur'}],
                },

                //编辑界面数据
                editForm: {
                    serviceNo:'',
                    serviceName:'',
                    serviceUrl:'',
                    orderNum:'',
                    status:'',
                    serviceLogo:'',
                },
                //新增界面数据
                addForm: {
                    serviceNo:'',
                    serviceName:'',
                    serviceUrl:'',
                    orderNum:'',
                    status:'',
                    serviceLogo:'',
                }
            }
        },
        methods: {
            //切换页数
            handleCurrentChange(val) {
                this.pageNum = val;
                this.getService();
            },
            //处理分页条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.getService();
            },
            formatStatus: function (row, column) {
                return row.status === 0 ? '停用' : row.status === 1 ? '启用' :'';
            },

             searchData(){
             this.pageNum = 1;
             this.getService();
             },
            //获取服务列表
            getService(){
                let para = {
                    serviceNo: this.filters.serviceNo,
                    serviceName: this.filters.serviceName,
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    }
                };
                this.listLoading = true;

                getServiceList(para).then((res) => {
                    // debugger
                    this.listLoading = false;
                    this.total = res.data.paginationInfo.total;
                    this.list = res.data.list;
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },
            //删除
            handleDel: function (index, row) {
                //debugger
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let para = {id: row.id};
                    deleteService(para).then((res) => {
                        if(res.code === 1){
                            this.$message({message: res.message, type: 'success'});
                            this.listLoading = false;
                        }else{
                            this.$message({ message: res.message, type: 'error'});
                        }
                        this.getService();
                    });
                }).catch(() => {
                });
            },

            //修改状态
            editFlag: function (index, row) {
                //debugger
                let para = {
                    status: row.status === 1 ? 0 : 1,
                    id: row.id
                };
                this.listLoading = true;
                updateServiceState(para).then((res) => {
                    if(res.code === 1){
                        this.$message({message: res.message, type: 'success'});
                        this.listLoading = false;
                    }else{
                        this.$message({ message: res.message, type: 'error'});
                    }
                    this.getService();
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },



            //显示编辑界面
            handleEdit: function (index, row) {
                //debugger;
                this.editForm = Object.assign({}, row);
                this.imageUrl = row.serviceLogo;
                this.imgList = [];
                this.imgList.push({name:"",url:this.GLOBAL.getImgUrl(row.serviceLogo)});
                //this.imgList.push({name:"",url:row.serviceLogo});
                this.editFormVisible = true;
            },

            //显示新增界面
            handleAdd: function () {
                //debugger
                this.addFormVisible = true;
                this.imgList = [];
                //this.imageUrl = '';
            },

            //编辑
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            let para = Object.assign({}, this.editForm);
                            para.serviceLogo = this.imageUrl;
                            editService(para).then((res) => {
                                this.editLoading = false;
                                if (this.GLOBAL.isResonseSuccess(res)) {
                                    this.$message({
                                        message: '修改成功',
                                        type: 'success'
                                    });
                                    this.$refs['editForm'].resetFields();
                                    this.editFormVisible = false;
                                    this.getService();
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
                            para.serviceLogo = this.imageUrl;
                            addService(para).then((res) => {
                                this.addLoading = false;
                                if (this.GLOBAL.isResonseSuccess(res)) {
                                    this.$message({
                                        message: '新增成功',
                                        type: 'success'
                                    });
                                    this.$refs['addForm'].resetFields();
                                    this.addFormVisible = false;
                                    this.getService();
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

            /**返回的图片地址**/
            getResult (result){
                //返回的图片地址
                if(result.length != 0){
                    for(let item of result){
                        this.imageUrl = item.relativeUrl;
                        this.editForm.serviceLogo = this.imageUrl;
                        this.addForm.serviceLogo = this.imageUrl;
                    }
                }else{
                    this.imageUrl = "";
                }
            },


            selsChange: function (sels) {
                this.sels = sels;
            },

            // 时间格式化:YYYY-MM-DD HH:mm:ss
            formatDate(row, column, cellValue) {
                if(cellValue === null || cellValue === undefined || cellValue === (-2209017600000)){
                    return '';
                }
                return moment(cellValue).format('YYYY-MM-DD HH:mm:ss');
            },

            resetPage(){
                if (this.filters.serviceNo !== ""){
                    this.pageNum = 1;
                }if (this.filters.serviceName !== ""){
                    this.pageNum = 1;
                }
            }
        },
        mounted() {
            this.getService();
        }
    }

</script>

<style scoped>



</style>