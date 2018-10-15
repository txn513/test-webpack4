<template>

    <section>
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form align="right" :inline="true"  class="demo-form-inline">
                <el-form-item>
                    <template>
                        <select-group :num ="number" :select="isSelect" @getresult = 'getResultNumber'></select-group>
                    </template>
                </el-form-item>
                <el-form-item label="标题">
                    <el-input v-model="filters.title" placeholder="标题" clearable filterable ></el-input>
                </el-form-item>
                <span>时间：</span>
                <el-date-picker
                        v-model="filters.releaseTime"
                        type="daterange"
                        start-placeholder="发布开始日期"
                        end-placeholder="发布结束日期"
                        :default-time="['00:00:00', '23:59:59']">
                </el-date-picker>
                <el-form-item label="">
                    <el-button type="primary" v-on:click="getContentList">查询</el-button>
                </el-form-item>
                <el-button type="primary"  v-on:click="addBtn" :loading="listLoading" >新增</el-button>
            </el-form>
        </el-col>

        <!--table-->
        <el-table v-loading="listLoading" stripe border element-loading-text="拼命加载中" :data="orderList" @selection-change="selsChange" style="width: 100%;margin-top: 30px;">
            <!--  <el-table-column
                      type="index"
                      show-overflow-tooltip
              >
              </el-table-column>-->
            <el-table-column  align="center" prop="title" label="标题" show-overflow-tooltip></el-table-column>
            <el-table-column  align="center" prop="readCount" label="阅读次数" show-overflow-tooltip></el-table-column>
            <el-table-column  align="center" prop="keyWord" label="关键词" show-overflow-tooltip></el-table-column>
            <el-table-column  align="center" prop="label" label="标签" show-overflow-tooltip></el-table-column>
            <el-table-column  align="center" prop="className" label="分类名称" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="businessTypeCode" label="业务类型"  :formatter="formatBusinessType" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="enableFlag" label="是否禁用" :formatter="formatStatus" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="statusFlag" label="内容状态" :formatter="formatVideoStatus" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="enableFlag" label="状态"  :formatter="formatStatus" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="releaseTime" :formatter="dateFormat" label="发布时间"  show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="createTime" :formatter="dateFormat" label="创建时间"  show-overflow-tooltip></el-table-column>
            <el-table-column  align="center" label="操作"  width="240">
                <template slot-scope="scope">
                    <el-button  type="primary"  size="mini" @click="editFlag(scope.$index, scope.row)">
                        {{scope.row.enableFlag == 0 ? "启用" : "禁用"}}
                    </el-button>
                    <el-button @click="handleView(scope.$index, scope.row)" size="mini" type="primary">查看</el-button>
                    <el-button @click="handleUpdate(scope.$index, scope.row)" size="mini" type="primary">编辑</el-button>
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
        <el-dialog title="新增" v-model="addFormVisible" :visible.sync="addFormVisible" @close='addClose'>

            <el-form  :model="addForm" label-width="80px" :rules="formRules" ref="addForm" >
                <el-form-item label="业务类型" prop="businessTypeCode">
                    <template>
                        <select-group-add :num ="addForm.businessTypeCode"  :select="isAddSelect" @getresult = 'selectClassTwo'></select-group-add>
                    </template>
                </el-form-item>

                <el-form-item label="所属品类" prop="classSelectedOptions">
                    <el-cascader
                            placeholder="请选择品类"
                            :options="classList"
                            clearable
                            v-model="addForm.classSelectedOptions"
                            style="width: 350px"
                            :props="props"
                            :disabled="isClass">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="标题" prop="title">
                    <el-input style="width: 350px" v-model="addForm.title" type="text" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="标签" prop="label">
                    <el-input style="width: 350px" v-model="addForm.label" type="text" auto-complete="off"></el-input>
                    <el-popover
                            placement="right"
                            title="友情提示"
                            width="450"
                            trigger="hover"
                    >
                        1、多个标签用,分割<br/>
                        <el-button slot="reference" icon="el-icon-question"></el-button>
                    </el-popover>
                </el-form-item>
                <el-form-item label="关键词" prop="keyWord">
                    <el-input style="width: 350px" v-model="addForm.keyWord" type="text" auto-complete="off"></el-input>
                    <el-popover
                            placement="right"
                            title="友情提示"
                            width="450"
                            trigger="hover"
                    >
                        1、多个关键词用,分割<br/>
                        <el-button slot="reference" icon="el-icon-question"></el-button>
                    </el-popover>
                </el-form-item>
                <el-form-item label="简介" prop="remark">
                    <el-input style="width: 350px" v-model="addForm.remark" type="text" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="发布时间" prop="releaseTime">
                    <el-date-picker
                            style="width: 350px"
                            v-model="addForm.releaseTime"
                            type="datetime"
                            placeholder="选择日期时间">
                    </el-date-picker>
                    <el-popover
                            placement="right"
                            title="友情提示"
                            width="450"
                            trigger="hover"
                    >
                        1、默认为当前时间<br/>
                        <el-button slot="reference" icon="el-icon-question"></el-button>
                    </el-popover>
                </el-form-item>
                <el-form-item label="封面图" prop="coverImgPath">
                    <fileupload @getresult="getResult" :imglist = "imgList" :number="num" :type="type"></fileupload>
                </el-form-item>
                <el-form-item label="内容" prop="content">
                    <editor class="editor" :value="content" :isImage="isImage"  @input="getContent"></editor>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addClose" >取消</el-button>
                <el-button type="primary"  @click.native="saveVideo('addForm')" >存草稿</el-button>
                <el-button type="primary" @click.native="releaseVideo('addForm')" >发布</el-button>
            </div>
        </el-dialog>

        <!--编辑界面-->
        <el-dialog title="编辑" v-model="editFormVisible" :visible.sync="editFormVisible" @close='editClose'>

            <el-form  :model="editForm" label-width="80px" :rules="formRules" ref="editForm">
                <el-form-item label="业务类型" prop="businessTypeCode">
                    <template>
                        <select-group-add :num ="editForm.businessTypeCode"  :select="isEditSelect" @getresult = 'selectClassTwo'></select-group-add>
                    </template>
                </el-form-item>

                <el-form-item label="所属品类" prop="classSelectedOptions">
                    <el-cascader
                            placeholder="请选择品类"
                            :options="classList"
                            clearable
                            v-model="editForm.classSelectedOptions"
                            style="width: 350px"
                            :props="props"
                            :disabled="isClass">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="标题" prop="title">
                    <el-input style="width: 350px"  v-model="editForm.title" type="text" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="标签" prop="label">
                    <el-input style="width: 350px" v-model="editForm.label" type="text" auto-complete="off"></el-input>
                    <el-popover
                            placement="right"
                            title="友情提示"
                            width="450"
                            trigger="hover"
                    >
                        1、多个标签用,分割<br/>
                        <el-button slot="reference" icon="el-icon-question"></el-button>
                    </el-popover>
                </el-form-item>
                <el-form-item label="关键词" prop="keyWord">
                    <el-input style="width: 350px" v-model="editForm.keyWord" type="text" auto-complete="off"></el-input>
                    <el-popover
                        placement="right"
                        title="友情提示"
                        width="450"
                        trigger="hover"
                >
                    1、多个关键词用,分割<br/>
                    <el-button slot="reference" icon="el-icon-question"></el-button>
                    </el-popover>
                </el-form-item>
                <el-form-item label="简介" prop="remark">
                    <el-input style="width: 350px" v-model="editForm.remark" type="text" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="发布时间" prop="releaseTime">
                    <el-date-picker
                            style="width: 350px"
                            v-model="editForm.releaseTime"
                            type="datetime"
                            placeholder="选择日期时间">
                    </el-date-picker>
                    <el-popover
                            placement="right"
                            title="友情提示"
                            width="450"
                            trigger="hover"
                    >
                        1、默认为当前时间<br/>
                        <el-button slot="reference" icon="el-icon-question"></el-button>
                    </el-popover>
                </el-form-item>

                <el-form-item label="封面图" prop="coverImgPath">
                    <fileupload @getresult="getResult" :imglist = "imgEditList" :number="num" :type="type"></fileupload>
                </el-form-item>
                <el-form-item label="内容" prop="content">
                    <editor class="editor" :value="content" :isImage="isImage"   @input="getEditContent"></editor>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editClose" >取消</el-button>
                <el-button type="primary" @click.native="releaseEditVideo('editForm')" >发布</el-button>
            </div>
        </el-dialog>

    </section>
</template>

<script>
    import {getContentListFun,addContentFun,editContentFun,getBillUrl,updateContentFun,getContentCategoryFun} from '../../api/api';
    import util from '../../common/js/util';
    import editor from '@/components/editor';
    import fileupload from '@/components/fileUpload';
    import selectGroup from '@/components/selectGroup';
    import selectGroupAdd from '@/components/selectGroupAdd';

    export default {
        components:{
            'editor':editor,
            fileupload,
            selectGroup,
            selectGroupAdd
        },
        data() {
            return {
                filters: {
                    title:null,
                    releaseTime:null,
                },
                isAddSelect: true,
                isEditSelect: true,
                number:-1,//后台传过来的十进制数据
                isSelect: true,//是否可选
                businessTypeCode: -1,

                listLoading: false,
                total: 0,
                pageNum: 1, //当前页码
                pageSize: 10,//页数
                sels: [],//列表选中列
                type:"1",//这个是上传图片的类型 1为上传普通图片 2为上传头像 3为上传商品图片
                num:'1',//参数为1限制为只能上传一张2为多张
                imgList:[],
                imgEditList:[],
                imageUrl:"",
                orderList:[],//表格数据
                classList: [],//分类列表
                releaseTime:'',
                props:{
                    value: 'id',
                    label: 'className'
                },
                isClass: false,
                title:'',
                createTime:'',
                updateTime:'',
                content:'',
                isImage:true,

                //新增界面数据
                addFormVisible : false,
                addForm : {
                    title:'',
                    businessTypeCode:'',
                    contentType:'',
                    coverImgPath:'',
                    classSelectedOptions: [],
                    label:'',
                    keyWord:'',
                    releaseTime:'',
                    remark:'',
                    content:''
                },

                //编辑界面数据
                editFormVisible : false,
                editForm : {
                    title:'',
                    businessTypeCode:'',
                    contentType:'',
                    coverImgPath:'',
                    classSelectedOptions: [],
                    label:'',
                    keyWord:'',
                    releaseTime:'',
                    remark:'',
                    content:''

                },

                //校验规则
                formRules: {
                    content: [
                        { required: true, message: '内容不能为空', trigger: 'blur' },
                    ],
                    title: [{required: true, message: '请输入标题', trigger: 'blur' }],
                    businessTypeCode: [{required: true, message: '请选择业务类型', trigger: 'blur'}],
                    contentType: [{required: true, message: '请选择内容类型', trigger: 'blur'}],
                    coverImgPath: [{required: true, message: '请上传图片', trigger: 'blur'}],
                    label: [{required: true, message: '请输入标签', trigger: 'blur'}],
                    keyWord: [{required: true, message: '请输入关键词', trigger: 'blur'}],
                    classSelectedOptions: [{required: true, message: '请选择所属品类', trigger: 'blur'}],
                },
                businessList: [{
                    value: 1,
                    label: '洗护'
                },{
                    value: 2,
                    label: '名品'
                },{
                    value: 4,
                    label: '态奢'
                },{
                    value: 8,
                    label: '悦生活'
                }],
                ifEdited: false,
            };
        },
        methods:{
            formatStatus: function (row, column) {
                return row.enableFlag === 0 ? '禁用' : row.enableFlag === 1 ? '启用' :'';
            },
            formatVideoStatus: function (row, column) {
                return row.statusFlag === 0 ? '未发布' : row.statusFlag === 1 ? '已发布' :'';
            },
            formatBusinessType:function (row, column) {
                return row.businessTypeCode === 1 ? '洗护' : row.businessTypeCode === 2 ? '名品' : row.businessTypeCode === 4 ? '态奢': row.businessTypeCode === 8 ? '悦生活':'';
            },

            getResultNumber(result){
                this.businessTypeCode = result;
            },

            editClose: function(){
                this.imgEditList = [];
                this.editFormVisible = false;
                this.resetForm('editForm');
            },
            addClose: function(){
                this.imgList = [];
                this.addFormVisible = false;
                this.resetForm('addForm');
            },

            //显示新增界面
            addBtn: function () {
                // debugger
                this.content = '';
                this.classList = [];
                this.addFormVisible = true;
                this.addForm = {
                    title:"",
                    businessTypeCode:'',
                    coverImgPath:'',
                    label:'',
                    keyWord:'',
                    releaseTime:'',
                    remark:'',
                    content:''
                };
                this.imgList = [];
                this.ifEdited = false;
                this.classSelectedOptions = [];
            },

            //显示编辑界面
            handleUpdate(index, row){
                var para = {};
                para.businessTypeCode = row.businessTypeCode;
                para.contentType = 2;
                getContentCategoryFun(para).then(res => {
                    if (this.GLOBAL.isResonseSuccess(res)){
                        this.classList = res.data;
                    }

                }, (res) => { this.listLoading = false; } ).catch(() => {});
                //debugger
                this.content = row.content;
                this.ifEdited = true;
                this.editForm = Object.assign({}, row);
                let cc = row.parentIds;
                let tt = cc.push(row.classId);
                let ids = cc.map(function (item) {
                    return parseInt(item);
                });
                this.editForm = {
                    id:row.id,
                    title:row.title,
                    content:row.content,
                    businessTypeCode:row.businessTypeCode,
                    coverImgPath:row.coverImgPath,
                    label:row.label,
                    keyWord:row.keyWord,
                    remark:row.remark,
                    releaseTime:row.releaseTime,
                    classSelectedOptions:ids
                };
                this.imageUrl ="";
                this.imgEditList = [];
                this.imageUrl = row.coverImgPath;
                this.imgEditList.push({name:"",url:this.GLOBAL.getImgUrl(row.coverImgPath)});
                this.editFormVisible = true;
                this.ifEdited = true;
            },

            selectClassTwo(result){
               // debugger
                var para = {};
                if (this.ifEdited) {
                    this.editForm.businessTypeCode = result;
                    para.businessTypeCode = this.editForm.businessTypeCode;
                    para.contentType = 2;
                } else {
                    this.addForm.businessTypeCode = result;
                    para.businessTypeCode = this.addForm.businessTypeCode;
                    para.contentType = 2;
                }
                console.log(para)
                getContentCategoryFun(para).then(res => {
                    if (this.GLOBAL.isResonseSuccess(res)){
                        this.addForm.classSelectedOptions = [];
                        this.editForm.classSelectedOptions = [];
                        this.classList = res.data;
                    }

                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },

            /**返回的图片地址**/
            getResult (result){
                //debugger
                //返回的图片地址
                if(result.length != 0){
                    for(let item of result){
                        this.imageUrl = item.relativeUrl;
                        this.editForm.coverImgPath = this.imageUrl;
                        this.addForm.coverImgPath = this.imageUrl;
                    }
                }else{
                    this.imageUrl = "";
                }
            },
            //分页显示所有数据列表
            getContentList() {
                // 创建时间
                var releaseBeginTime = null;
                var releaseEndTime = null;
                var releaseTime = this.filters.releaseTime;
                if(releaseTime != null){
                    releaseBeginTime = releaseTime[0];
                    releaseEndTime = releaseTime[1];
                }
                //debugger
                var para = {
                    businessTypeCode: this.businessTypeCode,
                    contentType:2,
                    releaseBeginTime: releaseBeginTime,
                    releaseEndTime: releaseEndTime,
                    title:this.filters.title,
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    }
                };
                this.listLoading = true;
                getContentListFun(para).then((res) => {
                    this.listLoading = false;
                    this.total = res.data.paginationInfo.total;
                    this.orderList = res.data.list;
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },


            // 发布文章
            releaseVideo(){
                this.addForm.statusFlag = 1;
                this.addCommon();
            },
            // 保存文章
            saveVideo(){
                this.addForm.statusFlag = 0;
                this.addCommon();
            },
            //新增数据表单提交
            addCommon(){
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            let para = Object.assign({}, this.addForm);
                            para.coverImgPath = this.imageUrl;
                            para.contentType = 2;
                            para.classId = this.addForm.classSelectedOptions.length?this.addForm.classSelectedOptions[this.addForm.classSelectedOptions.length-1]:''
                            addContentFun(para).then((res) => {
                                this.addLoading = false;
                                if (this.GLOBAL.isResonseSuccess(res)) {
                                    this.$message({
                                        message: '新增成功',
                                        type: 'success'
                                    });
                                    this.$refs['addForm'].resetFields();
                                    this.addFormVisible = false;
                                    this.imgList = [];
                                    this.getContentList();
                                    setTimeout("window.location.reload()",100);
                                }
                            });
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            // 发布编辑后视频
            releaseEditVideo(){
                this.editForm.statusFlag = 1;
                this.editCommon();
            },
            //编辑数据表单提交
            editCommon(){
                this.$refs.editForm.validate((valid) => {
                    if(valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            let para = Object.assign({}, this.editForm);
                            if(!this.imageUrl){
                                this.$message({
                                    message: '请上传图片',
                                    type: 'warning'
                                });
                                return;
                            }
                            para.coverImgPath = this.imageUrl;
                            para.classId = this.editForm.classSelectedOptions.length?this.editForm.classSelectedOptions[this.editForm.classSelectedOptions.length-1]:''
                            editContentFun(para).then((res) => {
                                this.editLoading = false;
                                if (this.GLOBAL.isResonseSuccess(res)) {
                                    this.$message({
                                        message: '修改成功',
                                        type: 'success'
                                    });
                                    this.$refs['editForm'].resetFields();
                                    this.editFormVisible = false;
                                    this.imgEditList = [];
                                    this.getContentList();
                                }
                            });
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },


            //修改状态
            editFlag: function (index, row) {
                let para = {
                    enableFlag: row.enableFlag === 1 ? 0 : 1,
                    id: row.id,
                };
                this.listLoading = true;
                updateContentFun(para).then((res) => {
                    if(res.code === 1){
                        this.$message({message: res.message, type: 'success'});
                        this.listLoading = false;
                    }else{
                        this.$message({ message: res.message, type: 'error'});
                    }
                    this.getContentList();
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            },

            //重置
            resetForm(formName) {
                if (!this.$refs[formName]) {
                    this.$refs[formName].resetFields();
                }
                this.$refs[formName].resetFields();
            },

            //查看函数
            handleView(index,row) {
                //debugger
                var id = row.id;
                getBillUrl("/contentInfo/view?id=" + id);
            },

            //当前时间格式化
            dateFormat:function(row, column) {
                var dateTime = row[column.property];
                if (!dateTime) {
                    return "";
                }
                return util.formatDate.format(new Date(dateTime), 'yyyy-MM-dd hh:mm:ss');
            },

            selsChange: function (sels) {
                this.sels = sels;
            },

            //分页查询
            handleCurrentChange(page) {
                this.pageNum = page;
                this.getContentList();
            },
            //处理分页条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.getContentList();
            },

            getContent(content){
                this.addForm.content = content;
            },
            getEditContent(content){
                this.editForm.content = content;
            },


        },
        mounted(){
            this.getContentList();
        }
    }

</script>

