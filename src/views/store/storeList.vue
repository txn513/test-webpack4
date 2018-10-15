<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">

            <el-form align="right" :inline="true"  class="demo-form-inline">
                <el-form-item label="仓库编码">
                    <el-input v-model="filters.storeNo" placeholder="仓库编码" clearable filterable @change="resetPage"></el-input>
                </el-form-item>
                <el-form-item label="仓库名称">
                    <el-input v-model="filters.storeName" placeholder="仓库名称" clearable filterable @change="resetPage"></el-input>
                </el-form-item>
                <el-form-item label="负责人">
                    <el-input v-model="filters.leader" placeholder="负责人" clearable filterable @change="resetPage"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-select v-model="filters.status" placeholder="请选择状态" clearable filterable @change="resetPage">
                        <el-option
                                v-for="item in searchFlag"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" v-on:click="getStore">查询</el-button>
                </el-form-item>
                <el-form-item label="">
                    <el-button v-if="" type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="list" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column prop="storeNo" label="仓库编码" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="storeName" label="仓库名称" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="storeAbbr" label="简称" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="storeType" label="类型" sortable :formatter="formatType" show-overflow-tooltip></el-table-column>
            <el-table-column prop="areaName" label="区域" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="leader" label="负责人" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="phone" label="电话" sortable ></el-table-column>
            <el-table-column prop="telephone" label="座机" sortable ></el-table-column>
            <el-table-column prop="address" label="地址" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="area" label="面积" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="lngLat" label="经纬度" show-overflow-tooltip></el-table-column>
            <el-table-column prop="status" label="状态"  sortable :formatter="formatStatus" show-overflow-tooltip></el-table-column>
            <el-table-column  fixed="right" label="操作" width="260">
                <template slot-scope="scope">
                    <el-button v-if="isAuth('mpys:storeInfo:update')"  type="primary"  size="mini" @click="editFlag(scope.$index, scope.row)">
                        {{scope.row.status == 0 ? "启用" : "停用"}}
                    </el-button>
                    <el-button v-if="isAuth('mpys:storeInfo:update')&&scope.row.status == 0" type="primary"  size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button  v-if="isAuth('mpys:storeInfo:delete')&&scope.row.status == 0" type="primary"  size="mini" @click="handleDel(scope.$index, scope.row)">删除</el-button>
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
                <el-form-item label="仓库编码" prop="storeNo">
                    <el-input v-model="editForm.storeNo" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="仓库名称" prop="storeName">
                    <el-input v-model="editForm.storeName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="仓库简称" prop="storeAbbr">
                    <el-input v-model="editForm.storeAbbr" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="storeType">
                    <el-select v-model="editForm.storeType" placeholder="请选择">
                        <el-option
                                v-for="item in searchType"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="区域" prop="regionCode">
                    <el-select v-model="editForm.regionCode" placeholder="请选择">
                        <el-option
                                v-for="item in regionList"
                                :key="item.distValue"
                                :label="item.distLabel"
                                :value="item.distValue">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="面积" prop="area" >
                    <el-input v-model="editForm.area" auto-complete="off" type="number" min="0"></el-input>
                </el-form-item>
                <el-form-item label="负责人" prop="leader">
                    <el-input v-model="editForm.leader" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="仓库座机" prop="telephone">
                    <el-input v-model="editForm.telephone" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="phone">
                    <el-input v-model="editForm.phone" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="地址" prop="address">
                    <el-input v-model="editForm.address" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="经度" prop="longitude">
                    <el-input v-model="editForm.longitude" auto-complete="off" ></el-input>
                </el-form-item>
                <el-form-item label="纬度" prop="latitude">
                    <el-input v-model="editForm.latitude" auto-complete="off" ></el-input>
                </el-form-item>


            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">保存</el-button>
                <el-button @click.native="editFormVisible = false" @click="resetForm('editForm')">取消</el-button>
            </div>
        </el-dialog>

        <!--新增界面-->
        <el-dialog title="新增" v-model="addFormVisible" :visible.sync="addFormVisible" @close= "resetForm('addForm')">

            <el-form  :model="addForm" label-width="80px" :rules="formRules" ref="addForm">
                <el-form-item label="仓库编码" prop="storeNo">
                    <el-input v-model="addForm.storeNo" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="仓库名称" prop="storeName">
                    <el-input v-model="addForm.storeName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="仓库简称" prop="storeAbbr">
                    <el-input v-model="addForm.storeAbbr" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="类型"  prop="storeType">
                    <el-select v-model="addForm.storeType" placeholder="请选择">
                        <el-option
                                v-for="item in searchType"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>

                    </el-select>
                </el-form-item>
                <el-form-item label="区域" prop="regionCode">
                    <el-select v-model="addForm.regionCode" placeholder="请选择">
                        <el-option
                                v-for="item in regionList"
                                :key="item.distValue"
                                :label="item.distLabel"
                                :value="item.distValue">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="面积" prop="area">
                    <el-input v-model="addForm.area" auto-complete="off" type="number" min="0"></el-input>
                </el-form-item>
                <el-form-item label="负责人" prop="leader">
                    <el-input v-model="addForm.leader" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="仓库座机" prop="telephone">
                <el-input v-model="addForm.telephone" auto-complete="off"></el-input>
            </el-form-item>
                <el-form-item label="电话" prop="phone">
                    <el-input v-model="addForm.phone" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="地址" prop="address">
                    <el-input v-model="addForm.address" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="经度" prop="longitude">
                    <el-input v-model="addForm.longitude" auto-complete="off" ></el-input>
                </el-form-item>
                <el-form-item label="纬度" prop="latitude">
                    <el-input v-model="addForm.latitude" auto-complete="off" ></el-input>
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
    import {getStoreList, addStore,editStore,updateState,flagDelete,queryArea} from '../../api/api';
    export default {
        data() {

            var checkPhone = (rule, value, callback) => {
                var reg = new RegExp(/^1[34578]\d{9}$/);
                if (!reg.test(value)) {
                    callback(new Error('请填写11位手机号码'));
                } else {
                    callback();
                }
            };
            var checkMobile = (rule, value, callback) => {
                var reg = new RegExp(/(^0\d{2,3}-?\d{7,8}$)|(^400[0-9]{7}$)|(^(400)-(\d{3})-(\d{4}$))|(^(400)-(\d{4})-(\d{3}$))|(^1[34578]\d{9}$)/);
                if (reg.test(value) || ""==value) {
                    callback();
                }else if(value!="" && !reg.test(value)){
                    callback(new Error('请填写正确格式的电话号码'));
                }else {
                    callback();
                }
            };
            var checkStoreCode = (rule, value, callback) => {
                var reg = new RegExp("^[0-9]*$");
                if (!reg.test(value)) {
                    callback(new Error('请输入仓库编码(必须是数字类型)'));
                }else {
                    callback();
                }
            };

            return {
                filters: {
                    storeNo: null,
                    storeName:null,
                    leader:null,
                    status: null
                },
                searchFlag:[{
                    value: 0,
                    label: '停用'
                },{
                    value: 1,
                    label: '启用'
                }],
                searchType: [{
                        value: 0,
                        label: '总仓'
                    },{
                        value: 1,
                        label: '自营分仓'
                    },{
                        value: 2,
                        label: '加盟分仓'
                    }],
                list: [],
                regionList:[],//区域列表
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
                    storeNo: [{required: true, message: '请输入仓库编码(必须是数字类型)', trigger: 'blur'},
                               {max: 12, message: '仓库编码长度过长,请重新输入', trigger: 'blur' },
                               {validator:checkStoreCode,trigger: 'blur'}],
                    storeName: [{required: true, message: '请输入仓库名称', trigger: 'blur'},
                                 {max: 20, message: '仓库名称长度过长,请重新输入', trigger: 'blur' }
                    ],
                    storeAbbr: [{max: 20, message: '仓库简称长度过长,请重新输入', trigger: 'blur' }],
                    storeType: [{required: true, message: '请选择仓库类型', trigger: 'change'}],
                    regionCode: [{required: true, message: '请选择区域', trigger: 'change'}],
                    leader: [{required: true, message: '请输入负责人', trigger: 'blur'},
                              {max: 10, message: '负责人长度过长,请重新输入', trigger: 'blur' }
                    ],
                    telephone:[{required: true, message: '请输入座机号', trigger: 'blur'},
                                {min: 0,validator:checkMobile, trigger: 'blur', message: '请输入正确格式的电话号码'}],
                    phone: [{required: true, message: '请输入手机号', trigger: 'blur'},
                             {validator: checkPhone, trigger: 'blur'}
                    ],
                    address: [{required: true, message: '请输入地址', trigger: 'blur'},
                               {max: 100, message: '地址长度过长,请重新输入', trigger: 'blur' }
                    ],
                    longitude: [
                        {required: true, message: '请输入经度', trigger: 'blur'},
                        {
                            validator: (rule,value,callback) => {
                                var reg = new RegExp(/^[\-\+]?(0?\d{1,2}\.\d{6}|1[0-7]?\d{1}\.\d{6}|180)$/);
                                if (!reg.test(value)) {
                                    callback(new Error('请输入保留小数点后六位的经度'))
                                }else{
                                    callback();
                                }
                            },
                            trigger: 'blur'
                        }
                    ],
                    latitude: [
                        {required: true, message: '请输入纬度', trigger: 'blur'},
                        {
                            validator: (rule,value,callback) => {
                                var reg = new RegExp(/^[\-\+]?([0-8]?\d{1}\.\d{6}|90)$/);
                                if (!reg.test(value)) {
                                    callback(new Error('请输入保留小数点后六位的纬度'))
                                }else{
                                    callback();
                                }
                            },
                            trigger: 'blur'
                        }
                    ],
                },
                //编辑界面数据
                editForm: {
                    storeNo:'',
                    storeName:'',
                    storeAbbr:'',
                    storeType:'',
                    regionNo:'',
                    area:'',
                    leader:'',
                    telephone:'',
                    phone:'',
                    address:'',
                    longitude:'',
                    latitude:'',
                },
                //新增界面数据
                addForm: {
                    storeNo:'',
                    storeName:'',
                    storeAbbr:'',
                    storeType:'',
                    regionCode:'',
                    area:'',
                    leader:'',
                    telephone:'',
                    phone:'',
                    address:'',
                    longitude:'',
                    latitude:'',
                }

            }
        },
        methods: {
            //切换页数
            handleCurrentChange(val) {
                this.pageNum = val;
                this.getStore();
            },
            //处理分页条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.getStore();
            },
            formatStatus: function (row, column) {
                return row.status === 0 ? '停用' : row.status === 1 ? '启用' :'';
            },
            formatType:function (row, column) {
                return row.storeType === 0 ? '总仓' : row.storeType === 1 ? '自营分仓' : row.storeType === 2 ? '加盟分仓':'';
            },

            //获取仓库列表
            getStore() {
                let para = {
                    storeNo: this.filters.storeNo,
                    storeName: this.filters.storeName,
                    leader: this.filters.leader,
                    status: this.filters.status,
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    }
                };

                this.listLoading = true;
                getStoreList(para).then((res) => {
                   //debugger
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
                    let para = {
                        id: row.id,
                        storeNo:row.storeNo
                    };
                    flagDelete(para).then((res) => {
                        if(res.code === 1){
                            this.$message({message: res.message, type: 'success'});
                            this.listLoading = false;
                        }else{
                            this.$message({ message: res.message, type: 'error'});
                        }
                        this.getStore();
                    });
                }).catch(() => {

                });
            },

            //修改状态
            editFlag: function (index, row) {
                //debugger
                let para = {
                     status: row.status === 1 ? 0 : 1,
                     id: row.id,
                     storeNo:row.storeNo
                };
                this.listLoading = true;
                updateState(para).then((res) => {
                    if(res.code === 1){
                        this.$message({message: res.message, type: 'success'});
                        this.listLoading = false;
                    }else{
                        this.$message({ message: res.message, type: 'error'});
                    }
                    this.getStore();
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },


            //显示编辑界面
            handleEdit: function (index, row) {
               // debugger;
                this.editForm = Object.assign({}, row);
                this.editFormVisible = true;
                this.getRegion();
                this.rebuildLatLon()
            },

            //显示新增界面
            handleAdd: function () {
                //debugger
                this.addFormVisible = true;
                this.getRegion();
            },

            rebuildLatLon(){
                let longitude = this.editForm.longitude;
                if (longitude != 180 && longitude != -180) {
                    this.editForm.longitude = longitude.toFixed(6);
                }

                let latitude = this.editForm.latitude;
                if (latitude != 90 && latitude != -90){
                    this.editForm.latitude = latitude.toFixed(6);
                }
            },

            //编辑
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            let para = Object.assign({}, this.editForm);
                            editStore(para).then((res) => {
                                this.editLoading = false;
                                if (this.GLOBAL.isResonseSuccess(res)) {
                                    this.$message({
                                        message: '修改成功',
                                        type: 'success'
                                    });
                                    this.$refs['editForm'].resetFields();
                                    this.editFormVisible = false;
                                    this.getStore();
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
                            addStore(para).then((res) => {
                                this.addLoading = false;
                                if (this.GLOBAL.isResonseSuccess(res)) {
                                    this.$message({
                                        message: '新增成功',
                                        type: 'success'
                                    });
                                    this.$refs['addForm'].resetFields();
                                    this.addForm.storeT5ype = null;
                                    this.addForm.regionCode = null;
                                    this.addFormVisible = false;
                                    this.getStore();
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
            selsChange: function (sels) {
                this.sels = sels;
            },
            //获取区域
            getRegion: function() {
                let para = {
                    classifyCode: '001',
                }
                queryArea(para).then((res) => {
                    this.listLoading = false;
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.regionList = res.data;
                    }
                   // return false;
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },

            resetPage(){
                if (this.filters.storeNo !== ""){
                    this.pageNum = 1;
                }if (this.filters.storeName !== ""){
                    this.pageNum = 1;
                }if (this.filters.leader !== ""){
                    this.pageNum = 1;
                }if (this.filters.status !== ""){
                    this.pageNum = 1;
                }
            }
        },
        mounted() {
            this.getStore();
            this.getRegion();
        }
    }

</script>

<style scoped>

</style>