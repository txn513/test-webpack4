<template>
    <section>
        <el-col :span="24"  class="toolbar" style="padding-bottom: 10px;">
            <div style="text-align:right;">
                <el-button type="primary" @click="add">新增</el-button>
            </div>
        </el-col>
        <!--列表-->
        <el-table :data="list" highlight-current-row v-loading="listLoading" @selection-change="selsChange"style="width: 100%;">
            <el-table-column prop="regionCode" label="区位码"></el-table-column>
            <el-table-column prop="regionName" label="名称" ></el-table-column>
            <el-table-column prop="orderNum" label="排序"   sortable></el-table-column>
            <el-table-column prop="enableFlag" label="状态" :formatter="formatStatus"></el-table-column>

            <el-table-column  fixed="right" label="操作" width="150">
                <template slot-scope="scope">
                    <el-button v-if="isAuth('mpys:city:update')" type="primary" size="mini" @click="edit(scope.$index, scope.row)">编辑</el-button>
                    <el-button v-if="isAuth('mpys:city:update') && scope.row.enableFlag == 0" type="primary" size="mini" @click="updateStatus(scope.row, 1)">启用</el-button>
                    <el-button v-if="isAuth('mpys:city:update') && scope.row.enableFlag == 1" type="primary" size="mini" @click="updateStatus(scope.row, 0)">停用</el-button>
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

        <!--新增界面-->
        <el-dialog title="新增" v-if="this.isDestory" v-model="addFormVisible" :visible.sync="addFormVisible" @close="closeDialog">
            <el-form :model="form" label-width="80px" :rules="formRules" ref="form">
                <el-form-item label="名称" prop="regionCode">
                    <template slot-scope="scope">
                        <el-select v-model="province.value" placeholder="请选择" style="width: 15%"  @change="initCity">
                            <el-option v-for="(item,index) in province.options" :key="item.code" :label="item.regionNameC" :value="index" />
                        </el-select>
                        <el-select v-model="city.value" placeholder="请选择" style="width: 15%">
                            <el-option v-for="(item,index) in city.options" :key="item.code" :label="item.regionNameC" :value="index" />
                        </el-select>
                    </template>
                </el-form-item>
                <el-form-item label="图片" prop="imgPath">
                    <fileupload @getresult="getResult" :imglist = "imgList" :number="num" :type="type"></fileupload>
                </el-form-item>
                <el-form-item label="排序" prop="orderNum">
                    <el-input v-model="form.orderNum"style="width: 100px" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="remark">
                    <el-input type="textarea" :row="5" v-model="form.remark" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="submit" :loading="loading">提交</el-button>
            </div>
        </el-dialog>

        <!--编辑界面-->
        <el-dialog title="编辑" v-if="this.isDestory" v-model="editFormVisible" :visible.sync="editFormVisible" @close="closeDialog">
            <el-form :model="form" label-width="80px" :rules="formRules" ref="form">
                <el-form-item label="区位码" prop="regionCode">
                    {{form.regionCode}}
                </el-form-item>
                <el-form-item label="名称" prop="regionName">
                    {{form.regionName}}
                </el-form-item>
                <el-form-item label="图片" prop="imgPath">
                    <fileupload @getresult="getResult" :imglist = "imgList" :number="num" :type="type"></fileupload>
                </el-form-item>
                <el-form-item label="排序" prop="orderNum">
                    <el-input v-model="form.orderNum" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="remark">
                    <el-input type="textarea" :row="5" v-model="form.remark" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="submit" :loading="loading">保存</el-button>
                <el-button @click.native="editFormVisible = false">取消</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import {getCityList,editCity, addCity,getRegion,updateStatus} from '../../api/api';
    import fileupload from '@/components/fileUpload';
    import OrderUtil from '../../common/js/OrderUtil';
    import  {VDT ,VDATA} from '@/common/js/validate';

    export default {
        components:{
            fileupload
        },
        data() {
            return {
                filters: {
                    name: '',
                },
                region:[],
                list: [],
                type:"1",//这个是上传图片的类型 1为上传普通图片 2为上传头像 3为上传商品图片
                num:'1',//参数为1限制为只能上传一张2为多张
                imgList:[],
                total: 0,
                isDestory : false,
                title:"新增",//弹出框标题
                pageNum: 1, //当前页码
                pageSize: 10,//页数
                listLoading: false,
                sels: [],//列表选中列
                addFormVisible: false,
                editFormVisible: false,
                loading: false,
                formRules: {
                    imgPath:[
                        {required: true, message: '请选择图片', trigger: 'blur'}],
                    orderNum: [
                        {required: true, message: '请输入排序', trigger: 'blur'},
                        {
                            validator: (rule,value,callback) => {
                                let vdt = VDATA(value, {"digits" : {msg:"请输入有效的数字"}})
                                if (!vdt.result) {
                                    callback(new Error(vdt.msg))
                                }else{
                                    callback();
                                }
                            },
                            trigger: 'blur'
                        }
                    ],
                    remark: [
                        {required: true, message: '请输入内容', trigger: 'blur'}]
                },
                //省市区
                province:{options:[],value:null},
                city:{options: [],value:null},
                //编辑界面数据
                form: {
                    id:'' ,
                    regionCode:'',
                    imgPath:'' ,
                    remark:'' ,
                    orderNum:'',
                    createBy:'',
                    updateBy:''
                },

            }
        },
        methods: {
            initProvince(){
                getRegion({upperRegion:0}).then((res) => {
                    OrderUtil.handleResult(res,()=>{
                        if(res.data.length<=0){
                            return ;
                        }
                        this.province.options = res.data;
                        this.province.value = 0;
                        this.city={options: [],value:null};
                        this.initCity();
                    },undefined,false);

                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },
            initCity(){
                let code= this.province.options[this.province.value].code;
                getRegion({upperRegion:code}).then((res) => {
                    OrderUtil.handleResult(res,()=>{
                        if(res.data.length<=0){
                            return ;
                        }
                        this.city.options = res.data;
                        this.city.value=0;
                    },undefined,false);
                    this.form.regionCode = this.city.options[this.city.value].code;
                }, (res) => { this.listLoading = false; } ).catch(() => {});
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
            getResult(result){
                let img = "";
                //返回的图片地址
                if(result.length==0){
                    console.log("当前没有图片");
                    this.form.imgPath = "";
                }else{
                    for(let item of result){
                        img += item.relativeUrl;
                    }
                    this.form.imgPath = img;
                }
            },
            //获取用户列表
            getData() {
                let para = {
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    }
                };
                this.listLoading = true;
                getCityList(para).then((res) => {
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.listLoading = false;
                        this.total = res.data.paginationInfo.total;
                        this.list = res.data.list;
                    }else{
                        this.$message.error(res.message());
                    }
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },
            updateStatus(row, status){
                let para = {
                    id: row.id,
                    enableFlag: status,
                }
                updateStatus(para).then((res) => {
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.getData();
                    }else{
                        this.$message.error(res.message());
                    }
                });

            },
            //显示编辑/新增界面
            add() {
                debugger;
                this.addFormVisible = true;
                this.isDestory = true;
                this.form = {};
                this.initProvince();
            },
            edit(index, row) {
                this.title= "编辑";
                this.form = Object.assign({}, row);
                if (row.imgPath != ''){
                    this.imgList.push({name:"",url:this.GLOBAL.getImgUrl(row.imgPath)});
                }
                this.editFormVisible = true;
                this.isDestory = true;
            },
            //提交
            submit: function () {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.loading = true;
                            let para = Object.assign({}, this.form);
                            let user = JSON.parse(sessionStorage.getItem('user'));
                            if(para.id) {
                                para.updateBy = user.id;
                                editCity(para).then((res) => {
                                    this.loading = false;
                                    if (this.GLOBAL.isResonseSuccess(res)) {
                                        this.$message({
                                            message: '提交成功',
                                            type: 'success'
                                        });
                                        this.imgList = [];
                                        this.isDestory = false;
                                        this.editFormVisible = false;
                                        this.getData();
                                    }else{
                                        this.$message.error(res.message());
                                    }
                                });
                            } else {
                                para.createBy = user.id;
                                this.form.regionCode = this.city.options[this.city.value].code;
                                addCity(para).then((res) => {
                                    this.loading = false;
                                    if (this.GLOBAL.isResonseSuccess(res)) {
                                        this.$message({
                                            message: '提交成功',
                                            type: 'success'
                                        });
                                        this.imgList = [];
                                        this.isDestory = false;
                                        this.addFormVisible = false;
                                        this.getData();
                                    }else{
                                        //this.$message.error(res.message());
                                    }
                                });
                            }
                        });
                    }
                });
            },
            closeDialog: function(){
                this.isDestory = false;
                this.imgList = [];
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            formatStatus(row, column) {
                var property = column.property;
                var value = row[column.property];
                if ("enableFlag" == property){
                    switch (value){
                        case 0: return "停用";
                        case 1: return "启用";
                    }
                }
                return null;
            },
        },
        mounted() {
            this.getData();
        }
    }
</script>