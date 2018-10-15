<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">

            <el-form align="right" :inline="true"  class="demo-form-inline">
             <!--   <el-form-item label="">
                    <el-input v-model="filters.orderNum" placeholder="排序" clearable filterable @change="resetPage"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" v-on:click="getBanner">查询</el-button>
                </el-form-item>-->
                <el-form-item label="">
                    <el-button v-if="" type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="list" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column
                    prop="bannerImg"
                    label="banner"
                    sortable
                    width="180">
                <template slot-scope="scope">
                    <img  :src="getImgUrl(scope.row.bannerImg)" alt="" style="width: 50px;height: 50px">
                </template>
            </el-table-column>
            <el-table-column prop="bannerTitle" label="图片主题" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="orderNum" label="排序" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="location" label="位置"  sortable :formatter="formatLocation" show-overflow-tooltip></el-table-column>
            <el-table-column prop="serviceUrl" label="链接" sortable ></el-table-column>
            <el-table-column prop="imageType" label="横幅类型" sortable :formatter="formatImageType" show-overflow-tooltip></el-table-column>
            <el-table-column prop="bannerType" label="banner类型" sortable :formatter="formatBannerType" show-overflow-tooltip></el-table-column>
            <el-table-column sortable prop="createTime" label="创建时间" show-overflow-tooltip :formatter="formatDate"></el-table-column>
             <el-table-column prop="status" label="状态"  sortable :formatter="formatStatus" show-overflow-tooltip></el-table-column>
            <el-table-column  fixed="right" label="操作" width="260">
                <template slot-scope="scope">
                    <el-button v-if="isAuth('mpys:serviceInfo:update')"  type="primary"  size="mini" @click="editFlag(scope.$index, scope.row)">
                        {{scope.row.status == 0 ? "启用" : "停用"}}
                    </el-button>
                    <el-button v-if="isAuth('mpys:serviceInfo:update')&&scope.row.status == 0" type="primary"  size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
                <el-form-item label="图片主题" prop="bannerTitle">
                    <el-input v-model="editForm.bannerTitle" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="orderNum" >
                    <el-input v-model="editForm.orderNum" auto-complete="off" type="number" min="0"></el-input>
                </el-form-item>
                <el-form-item label="位置" prop="location">
                    <el-select v-model="editForm.location" placeholder="请选择">
                        <el-option
                                v-for="item in searchLocation"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="横幅类型" prop="imageType">
                    <el-select v-model="editForm.imageType" placeholder="请选择">
                        <el-option
                                v-for="item in searchImageType"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="banner类型" prop="bannerType">
                    <el-select v-model="editForm.bannerType"   placeholder="请选择">
                        <el-option
                                v-for="item in searchBannerType"
                                :key="item.value"
                                :label="item.label"
                                :value ="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="链接" prop="serviceUrl">
                    <el-input v-model="editForm.serviceUrl" auto-complete="off"></el-input>
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
                <el-form-item label="banner图" prop="bannerImg">
                    <fileupload @getresult="getResult" :imglist = "imgList" :number="num" :type="type"></fileupload>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false" @click="resetForm('editForm')">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>


        <!--新增界面-->
        <el-dialog title="新增" v-model="addFormVisible" :visible.sync="addFormVisible" @close= "resetForm('addForm')" >
            <el-form  :model="addForm" label-width="80px" :rules="formRules" ref="addForm">
                <el-form-item label="图片主题" prop="bannerTitle">
                    <el-input v-model="addForm.bannerTitle" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="orderNum" >
                    <el-input v-model="addForm.orderNum" auto-complete="off" type="number" min="0    "></el-input>
                </el-form-item>
                <el-form-item label="位置" prop="location">
                    <el-select v-model="addForm.location" placeholder="请选择">
                        <el-option
                                v-for="item in searchLocation"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="横幅类型" prop="imageType">
                    <el-select v-model="addForm.imageType" placeholder="请选择">
                        <el-option
                                v-for="item in searchImageType"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="banner类型" prop="bannerTypes">
                    <el-select v-model="addForm.bannerTypes"  multiple placeholder="请选择">
                        <el-option
                                v-for="item in applicationSceneList"
                                :key="item.value"
                                :label="item.label"
                                :value ="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="链接" prop="serviceUrl">
                    <el-input v-model="addForm.serviceUrl" auto-complete="off"></el-input>
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
                <el-form-item label="banner图" prop="bannerImg">
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
    import {getBannerList, addBanner,editBanner,updateBannerState,deleteBanner} from '../../api/api';
    import fileupload from '@/components/fileUpload';
    import moment from 'moment';
    export default {

        components:{
            fileupload
        },
        data() {
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
                    orderNum:null
                },
                searchStatus:[{
                    value: 0,
                    label: '停用'
                },{
                    value: 1,
                    label: '启用'
                }],
                searchLocation:[{
                    value: 0,
                    label: '首页'
                }],
                searchImageType:[{
                    value: 0,
                    label: '首页横副'
                },{
                    value: 1,
                    label: '展示横副'
                }],
                searchBannerType:[
                    {
                        value: 0,
                        label: '小程序'
                    },{
                        value: 1,
                        label: '公众号'

                    },{
                        value:2,
                        label: 'APP'
                    }
                ],
                applicationSceneList:[{
                    value: 0,
                    label: '小程序'
                },{
                    value: 1,
                    label: '公众号'

                },{
                    value:2,
                    label: 'APP'
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
                    orderNum: [{required: true, message: '请输入排序数字(必须是数字类型)', trigger: 'blur'},
                        {validator:checkOrderNum,trigger: 'blur'}],
                    status: [{required: true, message: '请选择状态', trigger: 'change'}],
                    bannerTypes: [{required: true, message: '请选择banner类型', trigger: 'change'}],
                    bannerType: [{required: true, message: '请选择banner类型', trigger: 'change'}],
                    imageType: [{required: true, message: '请选择横幅类型', trigger: 'change'}],
                    bannerImg: [{required: true, message: '请上传图片', trigger: 'blur'}],
                    location: [{required: true, message: '请选择位置', trigger: 'change'}],
                },

                //编辑界面数据
                editForm: {
                    bannerTitle:'',
                    orderNum:'',
                    location:'',
                    serviceUrl:'',
                    status:'',
                    imageType:'',
                    bannerImg:'',
                    bannerType:'',
                    bannerTypes:[],
                },
                //新增界面数据
                addForm: {
                    bannerTitle:'',
                    orderNum:'',
                    location:'',
                    serviceUrl:'',
                    status:'',
                    imageType:'',
                    bannerImg:'',
                    bannerTypes:[],
                }
            }
        },
        methods: {
            //切换页数
            handleCurrentChange(val) {
                this.pageNum = val;
                this.getBanner();
            },
            //处理分页条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.getBanner();
            },
            formatLocation: function (row, column) {
                return row.location === 0 ? '首页' : row.location === 1 ? '其他' :'';
            },
            formatStatus: function (row, column) {
                return row.status === 0 ? '停用' : row.status === 1 ? '启用' :'';
            },
            formatImageType:function (row, column) {
                return row.imageType === 0 ? '首页横幅' : row.imageType === 1 ? '展示横幅' :'';
            },
            formatBannerType:function (row, column) {
                return row.bannerType === 0 ? '小程序' : row.bannerType === 1 ? '公众号' :row.bannerType === 2 ? 'APP':'';
            },

            /* searchData(){
             this.pageNum = 1;
             this.getService();
             },
             */
            //获取服务列表
            getBanner(){
                let para = {
                    orderNum: this.filters.orderNum,
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    }
                };
                this.listLoading = true;

                getBannerList(para).then((res) => {
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
                    deleteBanner(para).then((res) => {
                        this.listLoading = false;
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getBanner();
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
                updateBannerState(para).then((res) => {
                    this.listLoading = false;
                    this.getBanner();
                    this.$message({showClose: true, message: '状态更新成功', type: 'success'});
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },



            //显示编辑界面
            handleEdit: function (index, row) {
                //debugger;
                this.editForm = Object.assign({}, row);
                this.imageUrl = row.bannerImg;
                this.imgList = [];
                this.imgList.push({name:"",url:this.GLOBAL.getImgUrl(row.bannerImg)});
                //this.imgList.push({name:"",url:row.bannerImg});
                this.editFormVisible = true;
            },

            //显示新增界面
            handleAdd: function () {
                //debugger
                this.addFormVisible = true;
                this.imgList = [];
            },

            //编辑
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            let para = Object.assign({}, this.editForm);
                            para.bannerImg = this.imageUrl;
                            editBanner(para).then((res) => {
                                //debugger
                                this.editLoading = false;
                                if (this.GLOBAL.isResonseSuccess(res)) {
                                    this.$message({
                                        message: '修改成功',
                                        type: 'success'
                                    });
                                    this.$refs['editForm'].resetFields();
                                    this.editFormVisible = false;
                                    this.getBanner();
                                }else{
                                    this.$message.error(res.message());
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
                            //debugger
                            let para = Object.assign({}, this.addForm);
                            para.bannerImg = this.imageUrl;
                            addBanner(para).then((res) => {
                                this.addLoading = false;
                                if (this.GLOBAL.isResonseSuccess(res)) {
                                    this.$message({
                                        message: '新增成功',
                                        type: 'success'
                                    });
                                    this.$refs['addForm'].resetFields();
                                    this.addFormVisible = false;
                                    this.getBanner();
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
                        this.addForm.bannerImg = this.imageUrl;
                        this.editForm.bannerImg = this.imageUrl;
                    }
                }else{
                    this.imageUrl = "";
                }
            },

            /**图片拼接**/
            getImgUrl(result){
                return this.GLOBAL.getImgUrl(result);
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
            this.getBanner();
        }
    }

</script>

<style scoped>



</style>