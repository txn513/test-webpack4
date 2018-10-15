<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">

            <el-form align="right" :inline="true"  class="demo-form-inline">
                <el-form-item label="优惠券类型" prop="couponType">
                    <el-select v-model="filters.couponType" placeholder="请选择类型" clearable filterable @change="resetPage">
                        <el-option
                                v-for="item in searchFlag"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" v-on:click="getCoupon">查询</el-button>
                </el-form-item>
                <el-form-item label="">
                    <el-button  v-if="isAuth('scloud:couponType:insert')" type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="list" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column  label="序号" type="index" width="100"></el-table-column>
            <el-table-column prop="couponType" label="类型" sortable :formatter="formatType" show-overflow-tooltip></el-table-column>
            <el-table-column prop="couponContent" label="优惠内容" sortable show-overflow-tooltip></el-table-column>
          <!--  <el-table-column  fixed="right" label="操作" width="260">
                <template slot-scope="scope">
                    <el-button v-if="isAuth('scloud:couponType:update')" type="primary"  size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button  v-if="isAuth('scloud:couponType:delete')" type="primary"  size="mini" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>-->
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


        <!--新增界面-->
        <el-dialog title="新增" v-model="addFormVisible" :visible.sync="addFormVisible" @close= "resetForm('addForm')">
            <el-form ref="addForm" :model="addForm" :rules="formRules" >
                <el-form-item label="优惠券类型" prop="couponType">
                    <el-radio-group v-model="addForm.couponType" @change="clearValidate('addForm')">
                        <el-radio :label="1">现金券</el-radio>
                        <!--<el-radio :label="2" >满减券</el-radio>
                        <el-radio :label="3" >折扣券</el-radio>-->
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="  " v-if="addForm.couponType==1" prop="couponSubtract">
                    <span>抵扣订单金额</span>
                    <el-input type="number" v-model="addForm.couponSubtract"  placeholder="" style="width: 150px" clearable></el-input>
                    <span>元</span>
                </el-form-item>
                <el-form-item v-if="addForm.couponType==2" prop="couponSum" >
                    <span>订单金额</span>
                    <el-input type="number" v-model="addForm.couponSum"  style="width: 150px" clearable></el-input>
                    <span>元时凭券抵扣</span>
                    <el-input type="number" v-model="addForm.couponDecrease"  style="width: 150px" clearable></el-input>
                    <span>元</span>
                </el-form-item>
                <el-form-item v-if="addForm.couponType==3" prop="couponDiscount">
                    <span>抵扣后的金额为商品总额的</span>
                    <el-input type="number" v-model="addForm.couponDiscount" style="width: 150px" min="0" clearable></el-input>
                    <span>%</span>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false" @click="resetForm('addForm')">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--编辑界面-->
       <!-- <el-dialog title="编辑" v-model="editFormVisible" :visible.sync="editFormVisible" @close= "resetForm('editForm')">
            <el-form ref="editForm" :model="editForm" :rules="formRules" >
                <el-form-item label="优惠券类型" prop="couponType">
                    <el-radio-group v-model="editForm.couponType" @change="clearValidate('editForm')">
                        <el-radio :label="1">现金券</el-radio>
                      &lt;!&ndash;  <el-radio :label="2">满减券</el-radio>
                        <el-radio :label="3">折扣券</el-radio>&ndash;&gt;
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="  " v-if="editForm.couponType==1" prop="couponSubtract">
                    <span>抵扣订单金额</span>
                    <el-input type="number" v-model="editForm.couponSubtract"  placeholder="" style="width: 150px" clearable></el-input>
                    <span>元</span>
                </el-form-item>
                <el-form-item v-if="editForm.couponType==2" prop="couponDecrease" >
                    <span>订单金额</span>
                    <el-input type="number" v-model="editForm.couponSum" style="width: 150px" clearable></el-input>
                    <span>元时凭券抵扣</span>
                    <el-input type="number" v-model="editForm.couponDecrease"style="width: 150px" clearable></el-input>
                    <span>元</span>
                </el-form-item>
                <el-form-item v-if="editForm.couponType==3" prop="couponDiscount">
                    <span>抵扣后的金额为商品总额的</span>
                    <el-input v-model="editForm.couponDiscount" style="width: 150px" type="number" min="0" clearable></el-input>
                    <span>%</span>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false" @click="resetForm('editForm')">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>
-->
    </section>

</template>

<script>
    import util from '@/common/js/util';
    import {getCouponList,addCoupon,editCoupon,deleteCoupon} from '../../api/api';
    export default {
        data() {
            return {
                filters: {
                    couponType: null
                },
                searchFlag: [{
                    value: 1,
                    label: '现金券'
                },{
                    value: 2,
                    label: '满减券'
                },{
                    value: 3,
                    label: '折扣券'
                }],
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
                formRules:{
                    couponType: [{required: true, message: '请选择优惠券类型', trigger: 'change'}],
                    couponSubtract: [{required: true, message: '请选择现金券抵扣金额', trigger: 'blur'},
                        {
                            validator: (rule,value,callback) => {
                                var reg = new RegExp(/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/);
                                if (!reg.test(value)) {
                                    callback(new Error('请输入只能保留两位小数的正数'))
                                }else{
                                    callback();
                                }
                            },
                            trigger: 'blur'
                        }
                    ],

                       couponSum: [{required: true, message: '请输入订单金额', trigger: 'blur'},
                           {
                               validator: (rule,value,callback) => {
                                   var reg = new RegExp(/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/);
                                   if (!reg.test(value)) {
                                       callback(new Error('请输入只能保留两位小数的正数'))
                                   }else{
                                       callback();
                                   }
                               },
                               trigger: 'blur'
                           }
                       ],
                    couponDecrease: [{required: true, message: '请输入订单抵扣金额', trigger: 'blur'},
                        {
                            validator: (rule,value,callback) => {
                                var reg = new RegExp(/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/);
                                if (!reg.test(value)) {
                                    callback(new Error('请输入只能保留两位小数的正数'))
                                }else{
                                    callback();
                                }
                            },
                            trigger: 'blur'
                        }
                    ],
                    couponDiscount: [{required: true, message: '请选择折扣券折扣率', trigger: 'blur'},
                        {
                            validator: (rule,value,callback) => {
                                var reg = new RegExp(/^[1-9]\d*$/);
                                if (!reg.test(value)) {
                                    callback(new Error('请输入正整数'))
                                }else{
                                    callback();
                                }
                            },
                            trigger: 'blur'
                        }
                    ],
                },
                //新增界面数据
                addForm: {
                    couponType: '',//优惠券
                    couponSubtract: '',//抵扣金额
                    couponSum:'',
                    couponDecrease: '',
                    couponDiscount: ''
                },

                //编辑界面数据
               /* editForm: {
                    couponType: '',//优惠券
                    couponSubtract: '',//抵扣金额
                    couponSum:'',
                    couponDecrease: '',
                    couponDiscount: ''
                },*/

            };
        },
        mounted() {

        },
        methods: {
            clearValidate(formName) {
                this.$refs[formName].clearValidate();

            },


            //切换页数
            handleCurrentChange(val) {
                this.pageNum = val;
                this.getCoupon();
            },
            //处理分页条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.getCoupon();
            },



            //显示新增界面
            handleAdd: function () {
                //debugger
                this.addFormVisible = true;
                this.addForm = {
                    couponType: 1,//优惠券
                    couponSubtract: '',//抵扣金额
                    couponSum:'',
                    couponDecrease: '',
                    couponDiscount: ''
                }
                //重置表单
                this.$nextTick(() => {
                    this.$refs.addForm.resetForm();
                });

            },
            //显示编辑界面
           /* handleEdit: function (index, row) {
                // debugger;

//                this.$nextTick(() => {
//                    this.$refs.editForm.resetFields();
//                });
                this.editForm.couponDiscount = 0;
                this.editForm = Object.assign({}, row);
                this.editForm.couponDiscount = row.couponDiscount*100;
                this.editFormVisible = true;
            },*/



            formatType:function (row, column) {
                return row.couponType === 1 ? '现金券' : row.couponType === 2 ? '满减券' : row.couponType === 3 ? '折扣券':'';
            },

            //获取优惠券列表
            getCoupon() {
                //debugger
                let para = {
                    couponType: this.filters.couponType,
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    }
                };

                this.listLoading = true;
                getCouponList(para).then((res) => {
                   //debugger
                   this.listLoading = false;
                   this.total = res.data.paginationInfo.total;
                   this.list = res.data.list;
               }, (res) => { this.listLoading = false; } ).catch(() => {});
            },

            //删除
           /* handleDel: function (index, row) {
                //debugger
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let para = {
                        id: row.id,
                    };
                    deleteCoupon(para).then((res) => {
                        if(res.code === 1){
                            this.$message({message: res.message, type: 'success'});
                            this.listLoading = false;
                        }else{
                            this.$message({ message: res.message, type: 'error'});
                        }
                        this.getCoupon();
                    });
                }).catch(() => {

                });
            },
*/
            //编辑
          /*  editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
//                        if(!this.editForm.couponSum){
//                            this.$message.error('请输入订单金额')
//                            return;
//                        }
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editForm.couponDiscount = this.editForm.couponDiscount/100
                            let para = Object.assign({}, this.editForm);
                            if(this.editForm.couponDiscount > 1){

                                this.$message.error("折扣率不能大于100%");
                                return ;
                            }
                            if(this.editForm.couponSum <  this.editForm.couponDecrease){
                                this.$message.error("满减扣除金额不能大于订单总额");
                                return ;
                            }
                            editCoupon(para).then((res) => {
                                this.editLoading = false;
                                if (this.GLOBAL.isResonseSuccess(res)) {
                                    this.$message({
                                        message: '修改成功',
                                        type: 'success'
                                    });
                                    this.$refs['editForm'].resetFields();
                                    this.editFormVisible = false;
                                    this.getCoupon();
                                }
                            });
                        });
                    }
                });
            },
*/
            //新增
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addForm.couponDiscount = this.addForm.couponDiscount/100
                            let para = Object.assign({}, this.addForm);

                            if(this.addForm.couponDiscount > 1){

                                this.$message.error("折扣率不能大于100%");
                                return ;
                            }
                            if( Number(this.addForm.couponSum) <  Number(this.addForm.couponDecrease)){
                                this.$message.error("满减扣除金额不能大于订单总额");
                                return ;
                            }

                            addCoupon(para).then((res) => {
                                this.addLoading = false;
                                if (this.GLOBAL.isResonseSuccess(res)) {
                                    this.$message({
                                        message: '新增成功',
                                        type: 'success'
                                    });
                                    this.$refs['addForm'].resetFields();
                                    this.addForm.storeT5ype = null;
                                    this.addFormVisible = false;
                                    this.getCoupon();
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
            resetPage(){
                if (this.filters.couponType !== ""){
                    this.pageNum = 1;
                }
            }

        },

         mounted() {
             this.getCoupon();
         }
    }

</script>

<style lang="scss" scoped>

</style>