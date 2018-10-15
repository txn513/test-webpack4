<template>
    <section>
            <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                <el-form align="right" :inline="true"  class="demo-form-inline">
                    <el-form-item>
                        <template>
                            <select-group :num ="number" :select="isSelect" @getresult = 'getResultNumber'></select-group>
                        </template>
                    </el-form-item>
                    <el-button type="primary" v-on:click="searchData">查询</el-button>
                    <el-button v-if="isAuth('mpys:problem:insert')" type="primary"  v-on:click="addBtn" :loading="listLoading" >新增</el-button>
                </el-form>
            </el-col>

       <!--     <div class="toolbar el-col el-col-24" style="margin-top: 20px;text-align:right;">
                <el-button type="primary"  v-on:click="addBtn" :loading="listLoading" >新增</el-button>
            </div>-->

            <!--table-->
            <el-table
                    v-loading="listLoading"
                    element-loading-text="拼命加载中"
                    :data="orderList"
                    style="width: 100%;margin-top: 60px;">
                <el-table-column
                        sortable
                        align="center"
                        prop="problemType"
                        :formatter="formatRole"
                        label="问题类型">
                </el-table-column>
                <el-table-column
                        sortable
                        align="center"
                        prop="businessId"
                        :formatter="formatRoleBusiness"
                        label="业务类型">
                </el-table-column>
                <el-table-column
                        sortable
                        align="center"
                        prop="title"
                        label="标题">
                </el-table-column>
                <el-table-column
                        sortable
                        align="center"
                        prop="content"
                        :formatter="formatResult"
                        label="内容">
                </el-table-column>
                <el-table-column
                        sortable
                        align="center"
                        prop="weight"
                        label="权重">
                </el-table-column>

                <el-table-column
                        align="center"
                        prop="createTime"
                        :formatter="dateFormat"
                        label="创建时间">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="updateTime"
                        :formatter="dateFormat"
                        label="更新时间">
                </el-table-column>

                <el-table-column
                        align="center"
                        prop=""
                        label="操作">
                    <template slot-scope="scope">
                        <el-button v-if="isAuth('mpys:problem:update')" @click="handleUpdate(scope.row)" size="mini" type="primary">编辑</el-button>
                        <el-button v-if="isAuth('mpys:problem:delete')" @click="handleDelete(scope.row)" size="mini" type="primary">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        <!--分页-->
        <div class="block" style="text-align:right;">
            <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageNum"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total" style="float: right;margin-top: 10px">
            </el-pagination>
        </div>

        <!--新增界面-->
        <el-dialog title="新增" v-model="addFormVisible" :visible.sync="addFormVisible">

            <el-form  :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                <el-form-item label="问题类型"  prop="problemType">
                    <el-select v-model="addForm.problemType" placeholder="请选择">
                        <el-option
                                v-for="item in searchType"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>

                    </el-select>
                </el-form-item>
                <el-form-item label="业务类型" prop="businessId">
                    <template>
                        <select-group-add :num ="addForm.businessId" :select="isAddSelect" @getresult = 'getAddResultNumber'></select-group-add>
                    </template>
                </el-form-item>
                <el-form-item label="标题" prop="title">
                    <el-input style="width: 350px" v-model="addForm.title" type="txt" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="排序值" prop="weight">
                    <el-input style="width: 350px" v-model="addForm.weight" type="number" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="内容">
                    <editor class="editor" :value="content" :isImage="isImage"   @input="getContent"></editor>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false" >取消</el-button>
                <el-button type="primary" @click.native="addProblem('addForm')" >提交</el-button>
            </div>
        </el-dialog>
        <!--编辑界面-->
        <el-dialog title="编辑" v-model="editFormVisible" :visible.sync="editFormVisible" >

            <el-form  :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="问题类型"  prop="problemType">
                    <el-select v-model="editForm.problemType" placeholder="请选择">
                        <el-option
                                v-for="item in searchType"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>

                    </el-select>
                </el-form-item>
                <el-form-item label="业务类型" prop="businessId">
                    <template>
                        <select-group-add :num ="editForm.businessId" :select="isEditSelect" @getresult = 'getEditResultNumber'></select-group-add>
                    </template>
                </el-form-item>
                <el-form-item label="标题" prop="title">
                    <el-input style="width: 350px" v-model="editForm.title" type="text" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="排序值" prop="weight">
                    <el-input style="width: 350px" v-model="editForm.weight" type="number" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="内容" >
                    <editor class="editor" :value="content"   @input="getEditContent"></editor>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="editProblem('editForm')" >保存</el-button>
                <el-button @click.native="editFormVisible = false" >取消</el-button>
            </div>
        </el-dialog>

    </section>
</template>

<script>
    import {getProlemList,deleteProblemFun,addProblemFun,editProblemFun} from '../../api/api';
    import util from '../../common/js/util';
    import editor from '@/components/editor'
    import selectGroup from '@/components/selectGroup';
    import selectGroupAdd from '@/components/selectGroupAdd';

    export default {
        components:{
            editor ,selectGroup,selectGroupAdd
        },
        data() {
            return {
                number:-1,//后台传过来的十进制数据
                isSelect: true,//是否可选
                isEditSelect: true,//是否可选
                isAddSelect: true,//是否可选
                businessId: -1,


                isImage:false,
                listLoading: false,
                pageSize:this.GLOBAL.CONSTANT_DATA.PAGESIZE,
                totalPage:0,
                page: 1,
                total:0,
                pageNum: 1, //当前页码

                orderList:[],//表格数据
                title:'',
                problemType:'',
                content:'',
                createTime:'',
                weight:'',
                updateTime:'',

                //新增弹出框
                addFormVisible : false,
                addForm : {
                    problemType:"",
                    businessId:'' ,//业务类型
                    title:"",
                    weight:'',
                    content:''
                },
                //校验规则
                addFormRules: {
                    problemType: [
                        { required: true, message: '请选择问题类型', trigger: 'blur' },
                    ],
                    businessId: [//业务类型
                        { required: true, message: '请选择业务类型', trigger: 'blur' },
                    ],
                    title: [{required: true, message: '请输入标题', trigger: 'blur' }],
                    weight: [{required: true, message: '请输入权重', trigger: 'blur'}],
                },
                //编辑弹出框
                editFormVisible : false,
                editForm : {
                    problemType:"",
                    businessId:'' ,//业务类型
                    title:"",
                    weight:'',
                    content:''
                },
                //校验规则
                editFormRules: {
                    problemType: [
                        { required: true, message: '请选择问题类型', trigger: 'blur' },
                    ],
                    businessId: [//业务类型
                        { required: true, message: '请选择业务类型', trigger: 'blur' },
                    ],
                    title: [{required: true, message: '请输入标题', trigger: 'blur' }],
                    weight: [{required: true, message: '请输入权重', trigger: 'blur'}],
                },

                searchType: [{
                    value: 0,
                    label: '用户端'
                },{
                    value: 1,
                    label: '门店配送员端'
                },{
                    value: 2,
                    label: '门店端'
                },{
                    value: 3,
                    label: '加工中心端'
                },{
                    value: 4,
                    label: '加工配送员端'
                }],

            };
        },
        methods:{
            getResultNumber(result){
                this.businessId = result;
            },
            getEditResultNumber(result){
                this.editForm.businessId = result;
            },
            getAddResultNumber(result){
                this.addForm.businessId = result;
            },

            searchData(){
                this.pageNum = 1;
                this.getProblemListFun();
            },

            //分页显示所有问题数据列表
            getProblemListFun() {
                var para = {
                    businessId: this.businessId,
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    }
                };
                this.listLoading = true;
                getProlemList(para).then((data) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(data)) {
                            this.total = data.data.paginationInfo.total;
                            this.orderList = data.data.list;
                            var d = data.data.list;
                        }
                    }
                    , data => {
                        this.listLoading = false;
                    }
                );
            },

            //删除函数
            handleDelete(row) {
                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var para = {id: row.id};
                    deleteProblemFun(para).then((data) => {
                        if (this.GLOBAL.isResonseSuccess(data)) {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getProblemListFun();
                        } else {
                            alert("删除失败");
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '删除已取消!'
                    });
                });
            },

            //显示新增界面
            addBtn: function () {
                //debugger
                this.content = '';
                this.addFormVisible = true;
                this.addForm = {
                        problemType:"",
                        title:"",
                        content:'',
                        weight:'',
                        businessId:'',
                };
            },
            //数据表单提交
            addProblem(){
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        addProblemFun(this.addForm).then((data) => {
                            if (this.GLOBAL.isResonseSuccess(data)) {
                                this.addFormVisible = false;
                                this.$message({
                                    message: '操作成功',
                                    type: 'success'
                                });
                                this.getProblemListFun();
                                setTimeout("window.location.reload()",100);
                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //显示编辑界面
            handleUpdate(row){
                 this.content = row.content;
                this.editFormVisible = true;
                this.editForm = {
                    id:row.id,
                    problemType:row.problemType,
                    title:row.title,
                    content:row.content,
                    weight:row.weight,
                    businessId:row.businessId,
                };
            },
            //编辑数据表单提交
            editProblem(){
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        editProblemFun(this.editForm).then((data) => {
                            if (this.GLOBAL.isResonseSuccess(data)) {
                                this.editFormVisible = false;
                                this.$message({
                                    message: '操作成功',
                                    type: 'success'
                                });
                                this.getProblemListFun();
                                setTimeout("window.location.reload()",100);
                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            //当前时间格式化
            dateFormat:function(row, column) {
                var dateTime = row[column.property];
                if (!dateTime) {
                    return "";
                }
                return util.formatDate.format(new Date(dateTime), 'yyyy-MM-dd hh:mm:ss');
            },

            //分页查询
            handleCurrentChange(page) {
                this.pageNum = page;
                this.getProblemListFun();
            },
            //处理分页条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.getProblemListFun();
            },
            formatResult(row){
                 var replace = row.content.replace(/<\/?[^>]*>/g, "");
                return replace.replace(/&nbsp;/ig, "");
            },
            getContent(content){
                this.addForm.content = content;
            },
            getEditContent(content){
                this.editForm.content = content;
            },
            formatRole (row) {
                return row.problemType === 0 ? '用户端' : row.problemType === 1 ? '门店配送员端' : row.problemType === 2 ? '门店端': row.problemType === 3 ? '加工中心端':row.problemType === 4 ? '加工配送员端':'其他端';
            },
            formatRoleBusiness(row) {
                return row.businessId === 1 ? '洗护' : row.businessId === 2 ? '名品' : row.businessId === 4 ? '态奢': row.businessId === 8 ? '悦生活':'其他';
            },
        },
        mounted(){
             this.getProblemListFun();
        }
    }

</script>

