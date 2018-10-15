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
                        align="center"
                        prop="picUrl"
                        label="图片">
                    <template slot-scope="scope">
                        <div v-if="scope.row.picUrl">
                            <img v-for="item in scope.row.picUrl.split(',')" :src="getImgUrl(item)"
                                 style="width: 100px;height: 100px;margin-left: 10px" >
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="weight"
                        label="排序值">
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
                        <el-button @click="handleUpdate(scope.row)" size="mini" type="primary">修改</el-button>
                        <el-button v-if="scope.row.delFlag == 0"  type="primary" size="mini" @click="handleSale(scope.$index, scope.row,1)">停用</el-button>
                        <el-button v-if="scope.row.delFlag == 1" type="primary" size="mini" @click="handleSale(scope.$index, scope.row,0)">启用</el-button>
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
                <el-form-item label="排序值" prop="weight">
                    <el-input style="width: 350px" v-model="addForm.weight" type="number" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="图片" prop="picUrl">
                    <fileupload @getresult="getResult" :imglist = "imgList" :number="num" :type="type"></fileupload>
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
                    <el-form-item label="排序值" prop="weight">
                        <el-input style="width: 350px" v-model="editForm.weight" type="number" auto-complete="off"></el-input>
                    </el-form-item>
                <el-form-item label="图片" prop="picUrl">
                    <fileupload @getresult="getResultForEdit" :imglist = "imgList" :number="num" :type="type"></fileupload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false" >取消</el-button>
                <el-button type="primary" @click.native="editServiceIntroduceFun('editForm')" >提交</el-button>
            </div>
        </el-dialog>

    </section>
</template>

<script>
    import {getServiceIntroduceList,deleteServiceIntroduceFun,addServiceIntroduce,editServiceIntroduce,isUse} from '../../api/api';
    import util from '../../common/js/util';
    import fileupload from '@/components/fileUpload';

    export default {
        components:{
            fileupload
        },
        data() {
            return {
                type:"4",//这个是上传图片的类型 1为上传普通图片 2为上传头像 3为上传商品图片 4为业务图片上传
                num:'1',//参数为1限制为只能上传一张2为多张
                imgList:[
                ],//此数组为空说明是新增

                listLoading: false,
                pageSize:this.GLOBAL.CONSTANT_DATA.PAGESIZE,
                totalPage:0,
                page: 1,
                total:0,
                pageNum: 1, //当前页码

                orderList:[],//表格数据
                picUrl:'',
                createTime:'',
                weight:'',
                updateTime:'',

                //新增弹出框
                addFormVisible : false,
                addForm : {
                    weight:'',
                    picUrl:'',
                },
                //校验规则
                addFormRules: {
                    weight: [{required: true, message: '请输入权重', trigger: 'blur'}],
                    picUrl: [{ required: true, message: '请选择图片', trigger: 'blur' }]
                },
                //编辑弹出框
                editFormVisible : false,
                editForm : {
                    weight:'',
                    picUrl:'',
                },
                //校验规则
                editFormRules: {
                    weight: [{required: true, message: '请输入权重', trigger: 'blur'}],
                    picUrl: [{ required: true, message: '请选择图片', trigger: 'blur' }]
                },

            };
        },
        methods:{

            //分页显示所有问题数据列表
            getIntroduceListFun() {
                var para = {
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    }
                };
                this.listLoading = true;
                getServiceIntroduceList(para).then((data) => {
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
                    deleteServiceIntroduceFun(para).then((data) => {
                        if (this.GLOBAL.isResonseSuccess(data)) {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getIntroduceListFun();
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
                this.imgList = [];
                this.addFormVisible = true;
                this.addForm = {
                    weight:'',
                    picUrl:''
                };
            },
            //数据表单提交
            addProblem(){
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        addServiceIntroduce(this.addForm).then((data) => {
                            if (this.GLOBAL.isResonseSuccess(data)) {
                                this.addFormVisible = false;
                                this.$message({
                                    message: '操作成功',
                                    type: 'success'
                                });
                                this.getIntroduceListFun();
                                // setTimeout("window.location.reload()",100);
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
                this.imgList = [];
                this.imgList.push({
                    name: '',
                    url : this.getImgUrl(row.picUrl),
                    relativeUrl : row.picUrl
                });
                this.editForm = {
                    id:row.id,
                    picUrl:this.imgList[0].relativeUrl,
                    weight:row.weight,
                    curWeight:row.weight,
                };
                this.editFormVisible = true;
            },
            //编辑数据表单提交
            editServiceIntroduceFun(){
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        editServiceIntroduce(this.editForm).then((data) => {
                            if (this.GLOBAL.isResonseSuccess(data)) {
                                this.editFormVisible = false;
                                this.$message({
                                    message: '操作成功',
                                    type: 'success'
                                });
                                this.getIntroduceListFun();
                                // setTimeout("window.location.reload()",100);
                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            //停用启用操作
            handleSale (index, row , status) {
                let tatle = "启用";
                if(status === 1 ){
                    tatle= "停用";
                }
                this.$confirm('确认'+tatle+'该商品信息吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let para = {id: row.id,
                        delFlag: status };
                    isUse(para).then((res) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(res)) {
                            this.$message({
                                message: tatle+'成功',
                                type: 'success'
                            });
                            this.getIntroduceListFun();
                        }
                    });
                }).catch(() => {

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

            // 图片拼接
            getImgUrl(result){
                return this.GLOBAL.getImgUrl(result);

            },
            getResult(result){
                //返回的图片地址
                if(result.length != 0){
                    this.addForm.picUrl = '';
                    for(let item of result){
                        this.addForm.picUrl = item.relativeUrl;
                    }
                }
            },
            getResultForEdit(result){
                //返回的图片地址
                if(result.length != 0){
                    this.editForm.picUrl = '';
                    for(let item of result){
                        this.editForm.picUrl = item.relativeUrl;
                    }
                }
            },
            //分页查询
            handleCurrentChange(page) {
                this.pageNum = page;
                this.getIntroduceListFun();
            },
            //处理分页条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.getIntroduceListFun();
            },
        },
        mounted(){
              this.getIntroduceListFun();
        }
    }

</script>

