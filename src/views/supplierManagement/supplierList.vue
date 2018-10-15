<template>
    <section>
       <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">

            <el-form align="right" :inline="true"  class="demo-form-inline" style="float: right">
                <el-form-item label="供应商编码">
                    <el-input v-model="filters.supplierCode" placeholder="供应商编码" clearable filterable @change="resetPage"></el-input>
                </el-form-item>
                <el-form-item label="供应商名称">
                    <el-input v-model="filters.supplierName" placeholder="供应商名称" clearable  filterable @change="resetPage"></el-input>
                </el-form-item>
                <el-form-item label="角色" prop="role">
                    <el-select v-model="filters.role" placeholder="请选择角色" clearable filterable @change="resetPage">
                      <el-option
                            v-for="item in searchRole"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                      </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="enableFlag">
                    <el-select v-model="filters.enableFlag" placeholder="请选择状态" clearable filterable @change="resetPage">
                      <el-option
                              v-for="item in searchFlag"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                      </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-button v-if="isAuth('mpys:supplier:view')" type="primary" v-on:click="getList">查询</el-button>
                </el-form-item>
                <el-form-item label="">
                    <el-button v-if="isAuth('mpys:supplier:insert')" type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
           <el-table :data="list" highlight-current-row v-loading="listLoading"  style="width: 100%;">
               <el-table-column prop="supplierCode" label="供应商编码" sortable show-overflow-tooltip></el-table-column>
               <el-table-column prop="supplierName" label="供应商名称" sortable show-overflow-tooltip></el-table-column>
               <el-table-column prop="role" label="角色" sortable :formatter="formatRole" show-overflow-tooltip></el-table-column>
               <el-table-column prop="linkman" label="联系人" sortable show-overflow-tooltip></el-table-column>
               <el-table-column prop="mobile" label="电话" sortable show-overflow-tooltip></el-table-column>
               <el-table-column prop="phone" label="手机号" sortable show-overflow-tooltip></el-table-column>
               <el-table-column prop="address" label="地址" sortable show-overflow-tooltip></el-table-column>
               <el-table-column prop="enableFlag" label="状态" sortable :formatter="formatStatus" show-overflow-tooltip></el-table-column>
               <el-table-column prop="remark" label="备注" sortable show-overflow-tooltip></el-table-column>
               <el-table-column prop="createTime" label="创建时间" sortable :formatter="formatDate" show-overflow-tooltip></el-table-column>
               <el-table-column v-if="isAuth('mpys:supplier:update') || isAuth('mpys:supplier:delete') || isAuth('mpys:supplier:view')"  fixed="right" label="操作" width="310" >
                <template slot-scope="scope">
                    <el-button type="primary" size="mini"  v-if="isAuth('mpys:supplier:update') && scope.row.enableFlag === 1" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="primary" size="mini" v-if="isAuth('mpys:supplier:view')" @click="handleView(scope.$index, scope.row)">查看</el-button>
                    <el-button type="primary" size="mini"  v-if="isAuth('mpys:supplier:update')" @click="editFlag(scope.$index, scope.row)">{{scope.row.enableFlag == 0 ? "停用" : "启用"}}</el-button>
                    <el-button type="primary" size="mini"  v-if="isAuth('mpys:supplier:delete') && scope.row.enableFlag === 1" @click="handleDel(scope.$index, scope.row)">删除</el-button>
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

        <!--start 编辑修改界面 -->
        <el-dialog title="编辑" v-model="editFormVisible" :visible.sync="editFormVisible" @close= "resetForm('editForm')">
            <h2>基本信息</h2>
                <el-form  :model="editForm" label-width="120px" :rules="formRules" ref="editForm">
                    <el-form-item label="供应商编码" prop="supplierCode">
                        <el-input v-model="editForm.supplierCode" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="供应商名称" prop="supplierName">
                        <el-input v-model="editForm.supplierName" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="角色" prop="role">
                        <el-select v-model="editForm.role" placeholder="请选择角色" clearable  @change="chooseRoleEdit">
                           <el-option
                               v-for="item in searchRole"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value">
                         </el-option>
                        </el-select>
                    </el-form-item>

            <div  v-show="isShow">
            <h2>开票信息</h2>
                <el-form-item label="开票公司名称"  prop="invoiceCompanyName">
                    <el-input v-model="editForm.invoiceCompanyName"></el-input>
                </el-form-item>
                <el-form-item label="纳税人识别号" prop="invoiceCompanyCode">
                    <el-input v-model="editForm.invoiceCompanyCode"></el-input>
                    </el-form-item>
                <el-form-item label="开票地址"  prop="invoiceCompanyAddress">
                    <el-input v-model="editForm.invoiceCompanyAddress"></el-input>
                </el-form-item>
                <el-form-item label="开票电话"  prop="invoiceCompanyMobile">
                    <el-input v-model="editForm.invoiceCompanyMobile"></el-input>
                </el-form-item>
                <el-form-item label="开户行"  prop="invoiceCompanyBank">
                    <el-input v-model="editForm.invoiceCompanyBank"></el-input>
                </el-form-item>
                <el-form-item label="开户账号"  prop="invoiceCompanyAccount">
                    <el-input v-model="editForm.invoiceCompanyAccount"></el-input>
                </el-form-item>
            </div>

            <h2>详细信息</h2>
                <el-form-item label="联系人" prop="linkman">
                    <el-input v-model="editForm.linkman"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="editForm.phone"></el-input>
                </el-form-item>

                <el-form-item label="地区选择" >
                    <addr-select :editData ="editData" ref="child" @getresult = "getResult"></addr-select>
                </el-form-item>

                <el-form-item label="详细地址" prop="address">
                    <el-input v-model="editForm.address"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="editForm.remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">保存</el-button>
                <el-button @click.native="editFormVisible = false" @click="resetForm('editForm')">取消</el-button>
            </div>
        </el-dialog>
        <!--end 编辑修改界面 -->

        <!--start 新增界面-->
        <el-dialog title="新增" v-model="addFormVisible" :visible.sync="addFormVisible" @close= "resetForm('addForm')" >
            <h2>基本信息</h2>
                <el-form  :model="addForm" label-width="120px" :rules="formRules" ref="addForm">
                    <el-form-item label="供应商编码" prop="supplierCode">
                        <el-input v-model="addForm.supplierCode" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="供应商名称" prop="supplierName">
                        <el-input v-model="addForm.supplierName" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="角色" prop="role">
                        <el-select v-model="addForm.role" placeholder="请选择角色" clearable  @change="chooseRoleAdd">
                            <el-option
                                v-for="item in searchRole"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                          </el-option>
                        </el-select>
                    </el-form-item>

            <div  v-show="isShow">
            <h2>开票信息</h2>
                <el-form-item label="开票公司名称" prop="invoiceCompanyName">
                    <el-input v-model="addForm.invoiceCompanyName"></el-input>
                </el-form-item>
                <el-form-item label="纳税人识别号" prop="invoiceCompanyCode">
                    <el-input v-model="addForm.invoiceCompanyCode"></el-input>
                    </el-form-item>
                <el-form-item label="开票地址" prop="invoiceCompanyAddress">
                    <el-input v-model="addForm.invoiceCompanyAddress"></el-input>
                </el-form-item>
                <el-form-item label="开票电话" prop="invoiceCompanyMobile">
                    <el-input v-model="addForm.invoiceCompanyMobile"></el-input>
                </el-form-item>
                <el-form-item label="开户行" prop="invoiceCompanyBank">
                    <el-input v-model="addForm.invoiceCompanyBank"></el-input>
                </el-form-item>
                <el-form-item label="开户账号" prop="invoiceCompanyAccount">
                    <el-input v-model="addForm.invoiceCompanyAccount"></el-input>
                </el-form-item>
             </div>

            <h2>详细信息</h2>
                <el-form-item label="联系人" prop="linkman">
                    <el-input v-model="addForm.linkman"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                    </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="addForm.phone"></el-input>
                </el-form-item>

                <el-form-item label="地区选择" >
                    <addr-select ref="child" @getresult = "getResult"></addr-select>
                </el-form-item>

                <el-form-item label="详细地址" prop="address">
                    <el-input v-model="addForm.address"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="addForm.remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false" @click="resetForm('addForm')">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
        <!--end 新增界面 -->


        <!--start 查看详情界面 -->
        <el-dialog title="详情" v-model="viewFormVisible" :visible.sync="viewFormVisible">
            <h2>基本信息</h2>
                <el-form  :model="viewForm" label-width="120px" ref="viewForm" >
                    <el-form-item label="供应商编码" prop="supplierCode">
                        <el-input v-model="viewForm.supplierCode" auto-complete="off" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="供应商名称" prop="supplierName">
                        <el-input v-model="viewForm.supplierName" auto-complete="off" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="角色">
                        <el-select v-model="viewForm.role" disabled @change="chooseRoleView">
                            <el-option
                                v-for="item in searchRole"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                          </el-option>
                        </el-select>
                    </el-form-item>

                <div  v-show="isShow" >
                <h2>开票信息</h2>
                    <el-form-item label="开票公司名称">
                        <el-input v-model="viewForm.invoiceCompanyName" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="纳税人识别号">
                        <el-input v-model="viewForm.invoiceCompanyCode" disabled></el-input>
                        </el-form-item>
                    <el-form-item label="开票地址">
                        <el-input v-model="viewForm.invoiceCompanyAddress" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="开票电话">
                        <el-input v-model="viewForm.invoiceCompanyMobile" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="开户行">
                        <el-input v-model="viewForm.invoiceCompanyBank" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="开户账号">
                        <el-input v-model="viewForm.invoiceCompanyAccount" disabled></el-input>
                    </el-form-item>
                </div>

                <h2>详细信息</h2>
                    <el-form-item label="联系人">
                        <el-input v-model="viewForm.linkman" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="电话">
                        <el-input v-model="viewForm.mobile" disabled></el-input>
                        </el-form-item>
                    <el-form-item label="手机号">
                        <el-input v-model="viewForm.phone" disabled></el-input>
                    </el-form-item>

                    <el-form-item label="地区选择" >
                        <el-input v-model="viewForm.provinceName" disabled  style="width:175px"></el-input>
                        &nbsp;
                        <el-input v-model="viewForm.cityName" disabled  style="width:175px"></el-input>
                        &nbsp;
                        <el-input v-model="viewForm.areaName" disabled  style="width:175px"></el-input>
                    </el-form-item>

                    <el-form-item label="详细地址">
                        <el-input v-model="viewForm.address" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input v-model="viewForm.remark" disabled></el-input>
                    </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button disabled @click.native="viewFormVisible = false" >保存</el-button>
                <el-button @click.native="viewFormVisible = false">取消</el-button>
            </div>
        </el-dialog>
        <!--end 查看详情界面 -->
    </section>
</template>

<script>
    import util from '../../common/js/util'
    import {getSupplierList,addSupplier, editSupplier,updateFlagOpenClose,updateFlagDel} from '../../api/api';
    import addrSelect from '@/components/addrSelect'
    import moment from 'moment';
    import ElButton from "../../../node_modules/element-ui/packages/button/src/button";

    export default {
        components:{
            ElButton,
            addrSelect
        },
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
            var checkSupplierCode = (rule, value, callback) => {
                var reg = new RegExp(/^[0-9]*$/);
                if (!reg.test(value)) {
                    callback(new Error('请输入供应商编码(必须是数字类型)'));
                }else {
                    callback();
                }
            };
            return {
                filters: {
                    supplierCode: '',
                    supplierName: '',
                    role: '',
                    enableFlag: ''
                },
                searchFlag: [{
                    value: 0,
                    label: '启用'
                },{
                    value: 1,
                    label: '停用'
                }],
                searchRole: [{
                    value: 0,
                    label: '公司'
                },{
                    value: 1,
                    label: '个人'
                },{
                    value: 2,
                    label: '其他'
                }],
                list: [],
                province:{options: [{}],value:''},
                city:{options: [{}],value:''},
                area:{options: [{}],value:''},
                editData: [],
                total: 0,
                pageNum: 1, //当前页码
                pageSize: 10,//页数
                listLoading: false,

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,

                addFormVisible: false,//新增界面是否显示
                addLoading: false,

                isShow:true,//选择角色时显示开票信息的显示与隐藏


                viewFormVisible: false,//详情界面是否显示
                viewLoading: false,
                formRules: {
                    supplierCode: [{required: true, message: '请输入供应商编码(必须是数字类型)', trigger: 'blur'},
                                    {max: 12, message: '供应商编码长度过长,请重新输入', trigger: 'blur' },
                                    {validator:checkSupplierCode,trigger: 'blur'}],
                    supplierName: [{required: true, message: '请输入供应商名称', trigger: 'blur'},
                                   {max: 50, message: '供应商名称长度过长,请重新输入', trigger: 'blur' }
                    ],
                    role: [{required: true, message: '请选择角色', trigger: 'change'}],
                    mobile:[{min: 0,validator:checkMobile, trigger: 'blur', message: '请输入正确格式的电话号码'}],
                    phone: [{required: true, message: '请输入手机号', trigger: 'blur'},
                            {validator: checkPhone, trigger: 'blur'}
                    ],
                    linkman: [{required: true, message: '请输入联系人名称', trigger: 'blur'},
                              {max: 20, message: '联系人长度过长,请重新输入', trigger: 'blur' }
                    ],
                    address: [{required: true, message: '请输入详细地址', trigger: 'blur'},
                              {max:100,message: '详细地址长度过长,请重新输入', trigger: 'blur'}
                    ],
                    remark: [{max:200,message: '备注长度过长,请重新输入', trigger: 'blur'}],
                    invoiceCompanyName: [{required: true, message: '请输入开票公司', trigger: 'blur'}],
                    invoiceCompanyCode: [{required: true, message: '请输入纳税人识别号', trigger: 'blur'}],
                    invoiceCompanyAddress: [{required: true, message: '请输入开票公司地址', trigger: 'blur'}],
                    invoiceCompanyMobile: [{required: true, message: '请输入开票公司电话', trigger: 'blur'}],
                    invoiceCompanyBank: [{required: true, message: '请输入开户行', trigger: 'blur'}],
                    invoiceCompanyAccount: [{required: true, message: '请输入开户账号', trigger: 'blur'}],
                },
                //编辑界面数据
                editForm: {
                  supplierCode: '',
                  supplierName: '',
                  role: '',
                  linkman: '',
                  mobile: '',
                  phone: '',
                  provinceCode:'',
                  cityCode:'',
                  areaCode:'',
                  address: '',
                  remark: '',
                  invoiceCompanyName: '',
                  invoiceCompanyCode: '',
                  invoiceCompanyAddress: '',
                  invoiceCompanyMobile: '',
                  invoiceCompanyBank: '',
                  invoiceCompanyAccount: ''
                },
                //新增界面数据
                addForm: {
                  supplierCode: '',
                  supplierName: '',
                  role: '',
                  linkman: '',
                  mobile: '',
                  phone: '',
                  address: '',
                  remark: '',
                  invoiceCompanyName: '',
                  invoiceCompanyCode: '',
                  invoiceCompanyAddress: '',
                  invoiceCompanyMobile: '',
                  invoiceCompanyBank: '',
                  invoiceCompanyAccount: ''
                },

                //详情界面数据
                viewForm: {
                  supplierCode: '',
                  supplierName: '',
                  role: '',
                  linkman: '',
                  mobile: '',
                  phone: '',
                  address: '',
                  provinceName:'',
                  cityName:'',
                  areaName:'',
                  remark: '',
                  invoiceCompanyName: '',
                  invoiceCompanyCode: '',
                  invoiceCompanyAddress: '',
                  invoiceCompanyMobile: '',
                  invoiceCompanyBank: '',
                  invoiceCompanyAccount: ''
                }
            }
        },
        methods: {
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
            formatStatus (row, column) {
                return row.enableFlag === 0 ? '启用' : row.enableFlag === 1 ? '停用' :'';
            },
            formatRole (row, column) {
              return row.role === 0 ? '公司' : row.role === 1 ? '个人' : '其他';
            },

            // 时间格式化:YYYY-MM-DD HH:mm:ss
            formatDate(row, column, cellValue) {
                if(cellValue === null || cellValue === undefined || cellValue === (-2209017600000)){
                    return '';
                }
                return moment(cellValue).format('YYYY-MM-DD HH:mm:ss');
            },

            //获取供应商列表
            getList() {
                let para = {
                    supplierCode: this.filters.supplierCode,
                    supplierName: this.filters.supplierName,
                    role: this.filters.role,
                    enableFlag: this.filters.enableFlag,
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    }
                };
                this.listLoading = true;
                getSupplierList(para).then((res) => {
                    this.listLoading = false;
                    this.total = res.data.paginationInfo.total;
                    this.list = res.data.list;
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },

            getResult(result){
                var code = result.split(" ");
                this.addForm.provinceCode = code[0];
                this.addForm.cityCode = code[1];
                this.addForm.areaCode = code [2];

                this.editForm.provinceCode = code[0];
                this.editForm.cityCode = code[1];
                this.editForm.areaCode = code [2];

            },

            //删除  将enableFlag改为2
            handleDel (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let para = {id: row.id};
                    updateFlagDel(para).then((res) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(res)) {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getList();
                        }
                    });
                }).catch(() => {

                });
            },

            //修改状态
            editFlag (index, row) {
                let para = {
                     enableFlag: row.enableFlag === 1 ? 0 : 1,
                     id: row.id
                };
                this.listLoading = true;
                updateFlagOpenClose(para).then((res) => {
                    this.listLoading = false;
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.getList();
                    }
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },


            //显示编辑界面
            handleEdit (index, row) {
                this.editForm = {},
                //先清空表单
                this.editData = [];
                this.editForm = Object.assign({}, row );
                this.editData.push(this.editForm.provinceCode);
                this.editData.push(this.editForm.cityCode);
                this.editData.push(this.editForm.areaCode);
                this.editFormVisible = true;
                this.chooseRoleEdit();//加载时判断角色是否为个人/公司
            },

            //显示新增界面
            handleAdd () {
                this.addFormVisible = true;
                this.isShow=true;
            },


            //显示详情界面
            handleView (index, row) {
                this.viewForm = Object.assign({}, row);
                this.chooseRoleView();//加载时判断角色是否为个人/公司
                this.viewFormVisible = true;
            },

            //编辑
            editSubmit () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认修改吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            let region = {
                                "provinceCode": this.editForm.provinceCode,
                                "cityCode": this.editForm.cityCode,
                                "areaCode": this.editForm.areaCode,
                             };
                            let para = Object.assign({}, this.editForm ,region);
                            editSupplier(para).then((res) => {
                                this.editLoading = false;
                                if (this.GLOBAL.isResonseSuccess(res)) {
                                    this.$message({
                                        message: '修改成功',
                                        type: 'success'
                                    });
                                    this.$refs['editForm'].resetFields();
                                    this.$refs.child.resetForm();
                                    this.editFormVisible = false;
                                    this.getList();
                                }
                            });
                        });
                    }
                });
            },

            //新增
            addSubmit () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认保存吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            let region = {
                                "provinceCode": this.addForm.provinceCode,
                                "cityCode": this.addForm.cityCode,
                                "areaCode": this.addForm.areaCode,
                            };
                            let para = Object.assign({}, this.addForm,region);//Object.assign  (目标对象，源对象1，源对象2)--浅拷贝
                            addSupplier(para).then((res) => {
                               this.addLoading = false;
                               if (this.GLOBAL.isResonseSuccess(res)) {
                                    this.$message({
                                        message: '保存成功',
                                        type: 'success'
                                    });
                                    this.$refs['addForm'].resetFields();
                                    this.$refs.child.resetForm();
                                    this.addFormVisible = false;
                                    this.getList();
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

            clearInvoice(){
                this.formRules.invoiceCompanyName = [];
                this.formRules.invoiceCompanyCode = [];
                this.formRules.invoiceCompanyAddress = [];
                this.formRules.invoiceCompanyMobile = [];
                this.formRules.invoiceCompanyBank = [];
                this.formRules.invoiceCompanyAccount = [];
            },

            //添加供应商：角色改变时 开票信息的验证
            chooseRoleAdd(){
                if(this.addForm.role === 1){
                    this.isShow = false;//选择个人时隐藏
                    this.clearInvoice();
                    //清空之前所选择公司时所存的开票信息
                    this.addForm.invoiceCompanyName = "";
                    this.addForm.invoiceCompanyCode = "";
                    this.addForm.invoiceCompanyAddress = "";
                    this.addForm.invoiceCompanyMobile = "";
                    this.addForm.invoiceCompanyBank = "";
                    this.addForm.invoiceCompanyAccount = "";
                }else if(this.addForm.role === 0){
                    this.formRules.invoiceCompanyName.push({required: true, message: '请输入开票公司', trigger: 'blur'}) ;
                    this.formRules.invoiceCompanyCode.push({required: true, message: '请输入纳税人识别号', trigger: 'blur'}) ;
                    this.formRules.invoiceCompanyAddress.push({required: true, message: '请输入开票公司地址', trigger: 'blur'}) ;
                    this.formRules.invoiceCompanyMobile.push({required: true, message: '请输入开票公司电话', trigger: 'blur'}) ;
                    this.formRules.invoiceCompanyBank.push({required: true, message: '请输入开户行', trigger: 'blur'}) ;
                    this.formRules.invoiceCompanyAccount.push({required: true, message: '请输入开户账号', trigger: 'blur'}) ;
                    this.isShow = true;//选择公司时显示
                }else if(this.addForm.role === 2){
                    this.clearInvoice();
                    this.isShow = true;//选择其他时显示
                }

              },

              //编辑供应商：角色改变时 开票信息的验证
              chooseRoleEdit(){
                  if(this.editForm.role === 1){//选择个人时隐藏
                      this.isShow = false;
                      this.clearInvoice();
                      //清空之前所选择公司时所存的开票信息
                      this.editForm.invoiceCompanyName = "";
                      this.editForm.invoiceCompanyCode = "";
                      this.editForm.invoiceCompanyAddress = "";
                      this.editForm.invoiceCompanyMobile = "";
                      this.editForm.invoiceCompanyBank = "";
                      this.editForm.invoiceCompanyAccount = "";
                  }else if(this.editForm.role === 0){//选择公司显示
                      this.formRules.invoiceCompanyName.push({required: true, message: '请输入开票公司', trigger: 'blur'}) ;
                      this.formRules.invoiceCompanyCode.push({required: true, message: '请输入纳税人识别号', trigger: 'blur'}) ;
                      this.formRules.invoiceCompanyAddress.push({required: true, message: '请输入开票公司地址', trigger: 'blur'}) ;
                      this.formRules.invoiceCompanyMobile.push({required: true, message: '请输入开票公司电话', trigger: 'blur'}) ;
                      this.formRules.invoiceCompanyBank.push({required: true, message: '请输入开户行', trigger: 'blur'}) ;
                      this.formRules.invoiceCompanyAccount.push({required: true, message: '请输入开户账号', trigger: 'blur'}) ;
                      this.isShow = true;
                  }else if(this.editForm.role === 2){
                      this.clearInvoice();
                      this.isShow = true;//选择其他时显示
                  }
            },

            //查看供应商：角色改变时 开票信息的验证
            chooseRoleView(){
                  if(this.viewForm.role === 1){
                      this.isShow = false;//选择个人时隐藏
                  }else if(this.viewForm.role === 0){
                      this.isShow = true;//选择公司时显示
                  }else if(this.viewForm.role === 2){
                      this.isShow = true;//选择其他时显示
                  }
            },

            resetPage(){
                if (this.filters.supplierCode !== ""){
                    this.pageNum = 1;
                }if (this.filters.supplierName !== ""){
                    this.pageNum = 1;
                }if (this.filters.role !== ""){
                    this.pageNum = 1;
                }if (this.filters.enableFlag !== ""){
                    this.pageNum = 1;
                }
            }
        },
        mounted() {
            this.getList();
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

