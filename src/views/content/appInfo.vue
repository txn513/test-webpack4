<template>
    <section>
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">

            <el-form :model="filters" align="right" :inline="true"  class="demo-form-inline">
                <el-form-item label="">
                    <el-input v-model="filters.appTitle" placeholder="应用名称"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" v-on:click="searchData" >查询</el-button>
                </el-form-item>
               <el-form-item label="">
                    <el-button type="primary" @click="addDialog" >新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table v-loading="listLoading" stripe border @selection-change="selsChange" :data="list" style="width: 100%;margin-top: 30px;">
           <!-- <el-table-column type="index"></el-table-column>-->
            <!--<el-table-column prop="appImg" width="160" label="应用图片">
                <template slot-scope="scope">
                    <img :src="scope.row.appImg" width="60">
                </template>
            </el-table-column>-->
            <el-table-column  label="应用图片">
                <template slot-scope="scope"><img  :src="getImgUrl(scope.row.appImg)" style="width: 50px;height: 50px" ></template>
            </el-table-column>
            <el-table-column prop="appTitle" label="应用名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="bringAndroid" label="安卓(APP唯一标识)" ></el-table-column>
            <el-table-column prop="bringIos" label="苹果(APP唯一标识)" ></el-table-column>
            <el-table-column prop="marketAndroidUrl" label="安卓应用市场url" ></el-table-column>
            <el-table-column prop="marketIosUrl" label="苹果应用市场url" ></el-table-column>
            <el-table-column prop="createTime" label="创建时间" sortable :formatter="createFormat"></el-table-column>
            <el-table-column prop="updateTime" label="更新时间" sortable :formatter="updateFormat"></el-table-column>
            <el-table-column  sortable align="center" prop="percentage" label="操作">
                <template slot-scope="scope">
                    <el-button @click="isDelete(scope.row)" type="primary"  size="mini" >{{scope.row.enableFlag}}</el-button>
                    <el-button  type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)" >编辑</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--分页工具条-->
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

        <!--新增/编辑界面-->
       <el-dialog title="新增" v-model="addInfoFormVisible" :visible.sync="addInfoFormVisible" @close='addClose'>
            <el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm" class="demo-ruleForm">
                <el-form-item label="应用名称" prop="appTitle">
                    <el-input v-model="addForm.appTitle" ></el-input>
                </el-form-item>
                <el-form-item label="应用图片" prop="appImg">
                    <fileupload @getresult="getAddResult" :imglist = "imgList" :number="num" :type="type"></fileupload>
                </el-form-item>
                <el-form-item label="安卓标识" prop="bringAndroid">
                    <el-input type="text" v-model="addForm.bringAndroid" ></el-input>
                </el-form-item>
                <el-form-item label="苹果标识" prop="bringIos">
                    <el-input type="text" v-model="addForm.bringIos"></el-input>
                </el-form-item>
                <el-form-item label="安卓市场url" prop="marketAndroidUrl">
                    <el-input type="text" v-model="addForm.marketAndroidUrl"></el-input>
                </el-form-item>
                <el-form-item label="苹果市场url" prop="marketIosUrl">
                    <el-input type="text" v-model="addForm.marketIosUrl"></el-input>
                </el-form-item>
                <el-form-item label="排序号" prop="sortBy">
                    <el-input v-model="addForm.sortBy" type="number"  style="width: 10%;"></el-input>
                </el-form-item>
                <el-form-item label="是否启用" prop="enableFlag">
                    <el-switch v-model="addForm.enableFlag"></el-switch>
                </el-form-item>
            </el-form>
           <div slot="footer" class="dialog-footer">
               <el-button @click.native="addClose">取消</el-button>
               <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
           </div>
        </el-dialog>

        <!--新增/编辑界面-->
        <el-dialog title="编辑" v-model="editInfoFormVisible" :visible.sync="editInfoFormVisible" @close='editClose'>
            <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm" class="demo-ruleForm">
                <el-form-item label="应用名称" prop="appTitle">
                    <el-input v-model="editForm.appTitle" ></el-input>
                </el-form-item>
                <el-form-item label="应用图片" prop="appImg">
                    <fileupload @getresult="getEditResult" :imglist = "imgEditList" :number="num" :type="type"></fileupload>
                </el-form-item>
                <el-form-item label="安卓标识" prop="bringAndroid">
                    <el-input type="text" v-model="editForm.bringAndroid" ></el-input>
                </el-form-item>
                <el-form-item label="苹果标识" prop="bringIos">
                    <el-input type="text" v-model="editForm.bringIos"></el-input>
                </el-form-item>
                <el-form-item label="安卓市场url" prop="marketAndroidUrl">
                    <el-input type="text" v-model="editForm.marketAndroidUrl"></el-input>
                </el-form-item>
                <el-form-item label="苹果市场url" prop="marketIosUrl">
                    <el-input type="text" v-model="editForm.marketIosUrl"></el-input>
                </el-form-item>
                <el-form-item label="排序号" prop="sortBy">
                    <el-input v-model="editForm.sortBy" type="number"  style="width: 10%;"></el-input>
                </el-form-item>
                <el-form-item label="是否启用" prop="enableFlag">
                    <el-switch v-model="editForm.enableFlag"></el-switch>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button  @click.native="editClose">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import {getAppList,getDisable,addIndex,updateIndex} from '../../api/api';
    import util from '@/common/js/util';
    import fileupload from '@/components/fileUpload';

    export default {
        components:{
            fileupload
        },
        data() {
            return {

                filters: {
                    appTitle:'',
                },
                listLoading: false,
                list: [],
                pageNum: 1, //当前页码
                pageSize: 10,//页数
                total:0,
                type:"1",//这个是上传图片的类型 1为上传普通图片 2为上传头像 3为上传商品图片
                num:'0',//参数为1限制为只能上传一张2为多张
                //表单数据
                addForm : {
                    appTitle: "",
                    appImg: "",
                    bringAndroid: "",
                    bringIos: "",
                    marketAndroidUrl: "",
                    marketIosUrl:"",
                    sortBy: "",
                    enableFlag : "",
                },

                editForm : {
                    id:"",
                    appTitle: "",
                    appImg: "",
                    bringAndroid: "",
                    bringIos: "",
                    marketAndroidUrl: "",
                    marketIosUrl:"",
                    sortBy: "",
                    enableFlag : "",
                },
                addInfoFormVisible : false,
                editInfoFormVisible : false,
                //图片处理
                imgList:[],
                imgEditList:[],
                imageUrl:"",
                addLoading: false,
                editLoading: false,

                //数据校验
                addFormRules: {
                    appTitle: [{required: true, message: '请输入名称', trigger: 'blur'},
                               {max: 15, message: '长度不超过15个字符', trigger: 'blur' }],
                    appImg: [{required: true, message: '请上传图片', trigger: 'blur'}],
                    bringAndroid: [{required: true, message: '请输入唯一标识', trigger: 'blur'},
                               {max: 50, message: '长度不超过50个字符', trigger: 'blur' } ],
                    bringIos: [{required: true, message: '请输入唯一标识', trigger: 'blur'},
                               {max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
                    marketAndroidUrl: [{required: true, message: '请输入安卓市场url', trigger: 'blur'},
                               {max: 100, message: '长度不超过100个字符', trigger: 'blur' }],
                    marketIosUrl: [{required: true, message: '请输入苹果市场url', trigger: 'blur'},
                               {max: 50, message: '长度不超过50个字符', trigger: 'blur' }],

                    sortBy: [{required: true, pattern: /^\+?[1-9][0-9]*$/, message: '请输入大于0的数字', trigger: 'blur'}],
                },
                //数据校验
                editFormRules: {
                    appTitle: [{required: true, message: '请输入名称', trigger: 'blur'},
                        {max: 15, message: '长度不超过15个字符', trigger: 'blur' }],
                    appImg: [{required: true, message: '请上传图片', trigger: 'blur'}],
                    bringAndroid: [{required: true, message: '请输入唯一标识', trigger: 'blur'},
                        {max: 50, message: '长度不超过50个字符', trigger: 'blur' } ],
                    bringIos: [{required: true, message: '请输入唯一标识', trigger: 'blur'},
                        {max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
                    marketAndroidUrl: [{required: true, message: '请输入安卓市场url', trigger: 'blur'},
                        {max: 100, message: '长度不超过100个字符', trigger: 'blur' }],
                    marketIosUrl: [{required: true, message: '请输入苹果市场url', trigger: 'blur'},
                        {max: 50, message: '长度不超过50个字符', trigger: 'blur' }],

                    sortBy: [{required: true, pattern: /^\+?[1-9][0-9]*$/, message: '请输入大于0的数字', trigger: 'blur'}],
                },

            };
        },
        methods:{
            //列表选中
            selsChange: function (sels) {
                this.sels = sels;
            },
            createFormat:function(row ,column){
                if(row.createTime == undefined){
                    return ''
                }
                return  util.dateFormat("yyyy-MM-dd hh:mm:ss",new Date(row.createTime));
            },
            updateFormat:function(row ,column){
                if(row.createTime == undefined){
                    return ''
                }
                return  util.dateFormat("yyyy-MM-dd hh:mm:ss",new Date(row.updateTime));
            },


            /**图片拼接**/
            getImgUrl(result){
                return this.GLOBAL.getImgUrl(result);
            },
            getAddResult (result){
                //返回的图片地址
                if(result.length != 0){
                    for(let item of result){
                        this.imageUrl = item.relativeUrl;
                        this.addForm.appImg = this.imageUrl;
                    }
                }else{
                    this.imageUrl = "";
                }
            },
            getEditResult (result){
                //返回的图片地址
                if(result.length != 0){
                    for(let item of result){
                        this.imageUrl = item.relativeUrl;
                        this.editForm.appImg = this.imageUrl;
                    }
                }else{
                    this.imageUrl = "";
                }
            },

            //点击查询
            searchBannerInfo() {
                this.pageNum = 1;
                this.getData();
            },
            //切换页数
            handleCurrentChange(val) {
                this.pageNum = val;
                this.getData();
            },
            //处理分页条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.getData();
            },

            searchData(){
                this.pageNum=1;
                this.getData();
            },

            //新增弹出框
            addDialog(){
                this.imgList = [],
                this.addForm = {
                    appImg: "",
                    appTitle: "",
                    bringAndroid: "",
                    bringIos: "",
                    marketAndroidUrl: "",
                    marketIosUrl:"",
                    sortBy: "",
                    enableFlag : true
                }
                this.addInfoFormVisible = true;
            },

            handleEdit:function (index, row) {
                this.imageUrl ="";
                this.imgEditList = [];
                this.editForm = {
                    id :row.id,
                    appImg: row.appImg,
                    appTitle: row.appTitle,
                    bringAndroid: row.bringAndroid,
                    bringIos: row.bringIos,
                    marketAndroidUrl: row.marketAndroidUrl,
                    marketIosUrl:row.marketIosUrl,
                    sortBy : row.sortBy,
                    enableFlag : row.enableFlag== 0 ? false : true
                };
                this.imageUrl = row.appImg;
                this.imgEditList.push({name:"",url:this.GLOBAL.getImgUrl(row.appImg)});
                this.editInfoFormVisible = true;
            },

            editClose: function(){
                this.imgEditList = [];
                this.editInfoFormVisible = false;
                this.resetForm('editForm');
            },
            addClose: function(){
                this.imgList = [];
                this.addInfoFormVisible = false;
                this.resetForm('addForm');
            },

            //编辑
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            let para = Object.assign({}, this.editForm);
                            if(!this.imageUrl){
                                this.$message({
                                    message: '请上传图片',
                                    type: 'warning'
                                });
                                return;
                            }
                            para.appImg=this.imageUrl;
                            if(this.editForm.enableFlag){
                                para.enableFlag=1;
                            }else{
                                para.enableFlag=0;
                            }
                            updateIndex(para).then((res) => {
                                this.editLoading = false;
                                if (this.GLOBAL.isResonseSuccess(res)) {
                                    this.$refs['editForm'].resetFields();
                                    this.editInfoFormVisible = false;
                                    this.imgEditList = [];
                                    this.getData();
                                    this.$message({
                                        message: '修改成功',
                                        type: 'success'
                                    });
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
                            para.appImg = this.imageUrl;
                            if(this.addForm.enableFlag){
                                para.enableFlag=1;
                            }else{
                                para.enableFlag=0;
                            }
                            addIndex(para).then((res) => {
                                this.addLoading = false;
                                if (this.GLOBAL.isResonseSuccess(res)) {
                                    this.$refs['addForm'].resetFields();
                                    this.addInfoFormVisible = false;
                                    this.imgList = [];
                                    this.getData();
                                    this.$message({
                                        message: '新增成功',
                                        type: 'success'
                                    });
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


            //禁用/启动渠道详细信息
            isDelete(row){
                var del = {
                    id :row.id,
                    enableFlag : row.enableFlag == "禁用" ? 1 :0
                };
                getDisable(del).then((data) => {
                    if (this.GLOBAL.isResonseSuccess(data)){
                        var data ={
                            id : row.id
                        }
                        this.getData(data);
                    }
                });
            },

            //获取列表
            getData() {
                let para = {
                    appTitle:this.filters.appTitle,
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    }
                };
                this.listLoading = true;
                getAppList(para).then((res) => {

                    this.listLoading = false;
                    if (this.GLOBAL.isResonseSuccess(res)) {

                        var dataList = res.data.list;

                        for (var i = 0; i < dataList.length; i++) {
                            if (dataList[i].enableFlag == 0) {
                                dataList[i].enableFlag = "禁用";
                            } else {
                                dataList[i].enableFlag = "启用";
                            }
                        }
                        this.list = dataList;
                        this.total = res.data.paginationInfo.total;
                    }
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            }
        },

        mounted(){
           this.getData();
        }
    }

</script>

