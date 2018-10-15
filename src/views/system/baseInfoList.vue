<template>
    <section>
            <div class="toolbar el-col el-col-24" style="margin-top: 20px;text-align:right;">
                <el-button type="primary"  v-on:click="addBtn" :loading="listLoading" >新增</el-button>
            </div>

            <!--table-->
            <el-table
                    v-loading="listLoading"
                    element-loading-text="拼命加载中"
                    :data="orderList"
                    style="width: 100%;margin-top: 60px;">
                <el-table-column
                        type="index"
                        show-overflow-tooltip
                        >
                </el-table-column>
                <el-table-column
                        sortable
                        align="center"
                        prop="title"
                        label="信息标题">
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
                        <el-button @click="handleUpdate(scope.row)" size="mini" type="primary">编辑</el-button>
                        <el-button @click="handleView(scope.row)" size="mini" type="primary">查看</el-button>
                        <el-button @click="handleDelete(scope.row)" size="mini" type="primary">删除</el-button>
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
                <el-form-item label="标题" prop="title">
                    <el-input style="width: 350px" v-model="addForm.title" type="text" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="信息类别" prop="infoType">
                    <el-select v-model="addForm.infoType" placeholder="请选择">
                        <el-option
                                v-for="item in searchType"
                                :key="item.distValue"
                                :label="item.distLabel"
                                :value="item.distValue">
                        </el-option>

                    </el-select>
                    <!--<el-input style="width: 350px" v-model="addForm.infoType" type="number" auto-complete="off"></el-input>-->
                </el-form-item>
                <el-form-item label="内容">
                    <editor class="editor" :value="content" :isImage="isImage"  @input="getContent"></editor>
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
                <el-form-item label="标题" prop="title">
                    <el-input style="width: 350px"  v-model="editForm.title" type="text" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="信息类别" prop="infoType">
                    <el-select v-model="editForm.infoType" placeholder="请选择">
                        <el-option
                                v-for="item in searchType"
                                :key="item.distValue"
                                :label="item.distLabel"
                                :value="item.distValue">
                        </el-option>

                    </el-select>
                    <!--<el-input style="width: 350px"  v-model="editForm.infoType" type="number" auto-complete="off"></el-input>-->
                </el-form-item>
                <el-form-item label="内容" >
                    <editor class="editor" :value="content" :isImage="isImage"   @input="getEditContent"></editor>
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
    import {getSysListFun,deleteSysFun,addSysFun,editSysFun,seeFun,getBillUrl,getInfoTypelist} from '../../api/api';
    import util from '../../common/js/util';
    import editor from '@/components/editor'

    export default {
        components:{
            'editor':editor
        },
        data() {
            return {
                listLoading: false,
                pageSize:this.GLOBAL.CONSTANT_DATA.PAGESIZE,
                totalPage:0,
                page: 1,
                total:0,
                pageNum: 1, //当前页码

                orderList:[],//表格数据
                title:'',
                createTime:'',
                updateTime:'',
                content:'',
                isImage:true,

                //新增弹出框
                addFormVisible : false,
                addForm : {
                    title:"",
                    infoType:'',
                    content:''
                },
                //校验规则
                addFormRules: {
                    content: [
                        { required: true, message: '内容不能为空', trigger: 'blur' },
                    ],
                    title: [{required: true, message: '请输入标题', trigger: 'blur' }],
                    infoType: [{required: true, message: '请选择信息类别', trigger: 'blur'}],
                },
                //编辑弹出框
                editFormVisible : false,
                editForm : {
                    title:"",
                    infoType:'',
                    content:''
                },
                //校验规则
                editFormRules: {
                    content: [
                        { required: true, message: '内容不能为空', trigger: 'blur' },
                    ],
                    title: [{required: true, message: '请输入标题', trigger: 'blur' }],
                    infoType: [{required: true, message: '请选择信息类别', trigger: 'blur'}],
                },

                searchType: [
                ],

            };
        },
        methods:{

            //分页显示所有数据列表
            getSysList() {
                var para = {
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    }
                };
                this.listLoading = true;
                getSysListFun(para).then((data) => {
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
                    deleteSysFun(para).then((data) => {
                        if (this.GLOBAL.isResonseSuccess(data)) {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getSysList();
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

            //查看函数
            handleView(row) {
                var orderNo = row.id;
                getBillUrl("/sysInfo/see?id=" + orderNo);
            },

            //显示新增界面
            addBtn: function () {
                //debugger
                this.content = '';
                this.addFormVisible = true;
                this.addForm = {
                    title:"",
                    infoType:'',
                    content:''
                };
            },
            //数据表单提交
            addProblem(){
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        addSysFun(this.addForm).then((data) => {
                            if (this.GLOBAL.isResonseSuccess(data)) {
                                this.addFormVisible = false;
                                this.$message({
                                    message: '操作成功',
                                    type: 'success'
                                });
                                this.getSysList();
                                setTimeout("window.location.reload()",500);
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
                    title:row.title,
                    content:row.content,
                    infoType:row.infoType,
                    type:row.infoType,
                };
            },
            //编辑数据表单提交
            editProblem(){
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        editSysFun(this.editForm).then((data) => {
                            if (this.GLOBAL.isResonseSuccess(data)) {
                                this.editFormVisible = false;
                                this.$message({
                                    message: '操作成功',
                                    type: 'success'
                                });
                                this.getSysList();
                                // setTimeout("window.location.reload()",100);
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
                this.getSysList();
            },
            //处理分页条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.getSysList();
            },
            // formatResult(content){
            //     return content.replace(/<[\/\!]*[^<>]*>/ig,"");
            // },
            getContent(content){
                this.addForm.content = content;
            },
            getEditContent(content){
                this.editForm.content = content;
            },
            formatRole: function (row) {
                switch (row.type){
                    case 0:
                        return "用户协议";
                    case 1:
                        return "积分使用说明";
                    case 2:
                        return "森特币使用说明";
                    case 3:
                        return "用户充值协议";
                }
                return '未知';
            },

            //获取下拉信息类别列表数据
            getInfoTypelist() {
                this.listLoading = true;
                getInfoTypelist().then((data) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(data)) {
                            this.searchType = data.data;
                        }
                    }
                    , data => {
                        this.listLoading = false;
                    }
                );
            },
        },
        mounted(){
             this.getSysList();
             this.getInfoTypelist();
        }
    }

</script>

