<template>
    <section>
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form align="right" :inline="true"  class="demo-form-inline">
                <el-form-item>
                    <template>
                        <select-group :num ="number" :select="isSelect" @getresult = 'getResultNumber'></select-group>
                    </template>
                </el-form-item>
                <el-button type="primary" v-on:click="getList">查询</el-button>
                <el-button type="primary" v-if="isAuth('scloud:contentcategory:insert')" @click="addFormBtn()">新增</el-button>
            </el-form>
        </el-col>

        <div class="hello">
            <TreeContentCategory :columns="columns" :tree-structure="true" @handleEdit="handleEdit" @handleDel="handleDel" :data-source="dataSource"></TreeContentCategory>
        </div>
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

        <!--新增弹出栏-->
        <el-dialog title="新增" style="width: 100%" v-model="addFormVisible" :visible.sync="addFormVisible">
            <el-form ref="addForm" :model="addForm" :rules="formRules" label-width="140px" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
                <el-form-item label="业务类型" prop="businessTypeCode">
                    <template>
                        <select-group-add :num ="addForm.businessTypeCode"  :select="isAddSelect" @getresult = 'businessTypeChange'></select-group-add>
                    </template>
                </el-form-item>
                <el-form-item label="内容类型" prop="contentType">
                    <el-select @change="contentTypeChange" v-model="addForm.contentType" placeholder="请选择内容类型">
                        <el-option
                                v-for="item in contentTypes"
                                :key="item.distValue"
                                :label="item.distLabel"
                                :value="item.distValue">
                        </el-option>

                    </el-select>
                </el-form-item>
                <el-form-item label="分类名称" prop="className">
                    <el-input  v-model="addForm.className" type="text" style="width: 60%;"></el-input>
                </el-form-item>
                <el-form-item label="权重" prop="sortBy">
                    <el-input v-model="addForm.sortBy" type="number" style="width: 60%;"></el-input>
                </el-form-item>
                <el-form-item label="上级分类" prop="parentId">
                    <el-cascader
                            placeholder="请选择上级分类"
                            :options="tree"
                            v-model="addForm.parentId"
                            change-on-select
                            :clearable="true"
                            ref="addForm"
                            :props="props"
                    ></el-cascader>
                    <el-popover
                            placement="right"
                            title="友情提示"
                            width="450"
                            trigger="hover"
                    >
                        1、可在任意分类节点下添加节点，选中之后只需将鼠标点击任意空白处<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;即可选中<br/>
                        <el-button slot="reference" icon="el-icon-question"></el-button>
                    </el-popover>
                </el-form-item>
                <el-form-item label="是否为系统分类">
                    <el-radio-group v-model="addForm.systemFlag">
                        <el-radio-button label=0>否</el-radio-button>
                        <el-radio-button label=1>是</el-radio-button>
                    </el-radio-group>
                    <el-popover
                            placement="right"
                            title="友情提示"
                            width="450"
                            trigger="hover"
                    >
                        1、如选择'是'，则表示该分类为系统分类，系统分类不能进行修改,删除<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;操作<br/>
                        <el-button slot="reference" icon="el-icon-question"></el-button>
                    </el-popover>
                </el-form-item>
<!--                <el-form-item>
                    <el-button @click.native="addFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="add('addForm')" >提交</el-button>
                </el-form-item>-->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="add('addForm')" >提交</el-button>
            </div>
        </el-dialog>
        <!--编辑弹出栏-->
        <el-dialog title="编辑" style="width: 100%" v-model="editFormVisible" :visible.sync="editFormVisible">
            <el-form ref="editForm" :model="editForm" :rules="formRules" label-width="140px" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
                <!--<el-form-item label="业务类型" prop="businessTypeCode">-->
                    <!--<el-select disabled v-model="editForm.businessTypeCode" placeholder="请选择业务类型">-->
                        <!--<el-option-->
                                <!--v-for="item in options"-->
                                <!--:key="item.value"-->
                                <!--:label="item.label"-->
                                <!--:value="item.value">-->
                        <!--</el-option>-->

                    <!--</el-select>-->
                <!--</el-form-item>-->
                <el-form-item label="业务类型" prop="businessTypeCode">
                    <template>
                        <select-group-add :num ="editForm.businessTypeCode"  :select="isEditSelect" ></select-group-add>
                    </template>
                </el-form-item>
                <el-form-item label="内容类型" prop="contentType">
                    <el-select disabled v-model="editForm.contentType" placeholder="请选择内容类型">
                        <el-option
                                v-for="item in contentTypes"
                                :key="item.distValue"
                                :label="item.distLabel"
                                :value="item.distValue">
                        </el-option>

                    </el-select>
                </el-form-item>
                <el-form-item label="分类名称" prop="className">
                    <el-input  v-model="editForm.className" type="text" style="width: 60%;"></el-input>
                </el-form-item>
                <el-form-item label="权重" prop="sortBy">
                    <el-input v-model="editForm.sortBy" type="number" style="width: 60%;"></el-input>
                </el-form-item>
                <el-form-item label="上级分类" prop="parentId">
                    <el-cascader
                            placeholder="请选择上级分类"
                            :options="tree"
                            disabled
                            v-model="editForm.parentId"
                            change-on-select
                            :clearable="true"
                            ref="editForm"
                            :props="props"
                    ></el-cascader>
                    <!--<el-popover-->
                            <!--placement="right"-->
                            <!--title="友情提示"-->
                            <!--width="450"-->
                            <!--trigger="hover"-->
                    <!--&gt;-->
                        <!--1、可在任意分类节点下添加节点，选中之后只需将鼠标点击任意空白处<br/>-->
                        <!--&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;即可选中<br/>-->
                        <!--<el-button slot="reference" icon="el-icon-question"></el-button>-->
                    <!--</el-popover>-->
                </el-form-item>
                <el-form-item label="是否为系统分类">
                    <el-radio-group disabled="true" v-model="editForm.systemFlag">
                        <el-radio-button label=0>否</el-radio-button>
                        <el-radio-button label=1>是</el-radio-button>
                    </el-radio-group>
                    <el-popover
                            placement="right"
                            title="友情提示"
                            width="450"
                            trigger="hover"
                    >
                        1、如果为系统分类就不能进行修改,删除<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;操作<br/>
                        <el-button slot="reference" icon="el-icon-question"></el-button>
                    </el-popover>
                </el-form-item>
<!--                <el-form-item>
                    <el-button @click.native="editFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="edit('editForm')" >提交</el-button>
                </el-form-item>-->
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="edit('editForm')" >保存</el-button>
                <el-button @click.native="editFormVisible = false">取消</el-button>
            </div>
        </el-dialog>
    </section>

</template>

<script>
    import {TreeContentCategory} from '../../components/treeTable'
    import util from '../../common/js/util';
    import {getContentCategoryListFun,getSelectListFun,addContentCategoryFun,queryContentCategoryById,editContentCategoryFun,removeContentCategoryFun,getContentCategoryListForDictFun} from '../../api/api';
    import selectGroup from '@/components/selectGroup';
    import selectGroupAdd from '@/components/selectGroupAdd';
    export default {
        name: 'hello',
        data () {
            return {
                isAddSelect: true,
                isEditSelect: false,
                number:-1,//后台传过来的十进制数据
                isSelect: true,//是否可选
                businessTypeCode: -1,
                listLoading: false,
                pageSize:this.GLOBAL.CONSTANT_DATA.PAGESIZE,
                totalPage:0,
                page: 1,
                total:0,
                pageNum: 1, //当前页码
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
                //编辑表单选项
                editForm : {
                    businessTypeCode: '',
                    contentType: '',
                    parentId: [],
                    className: '',
                    sortBy: '',
                    systemFlag: '',
                },
                //新增表单选项
                addForm : {
                    businessTypeCode: '',
                    contentType: '',
                    parentId: '',
                    className: '',
                    sortBy: '',
                    systemFlag: '',
                },
                formRules: {
                    className: [
                        { required: true, message: '请输入分类名称', trigger: 'blur' },
                        { min: 1, max: 40, message: '长度在 1 到 40 个字符', trigger: 'blur' }
                    ],
                    sortBy: [
                        { required: true, message: '请输入排序权重，越大越靠前', trigger: 'blur' },
                    ],
                    businessTypeCode: [
                        { required: true, message: '请选择业务类型', trigger: 'blur' },
                    ],
                    contentType: [
                        { required: true, message: '请选择内容类型', trigger: 'blur' },
                    ],
                    parentId: [
                        { required: true, message: '请选择上级分类', trigger: 'blur' },
                    ]
                },
                addFormVisible:false,
                editFormVisible:false,
                //级联选择器列表数据
                tree: [],//表格数据
                props: {
                    value: 'id',
                    label: 'className',
                    children: 'children'
                },

                options: [{
                    value: 1,
                    label: '洗护'
                }, {
                    value: 2,
                    label: '名品'
                }, {
                    value: 4,
                    label: '态奢'
                }, {
                    value: 8,
                    label: '悦生活'
                }],
                contentTypes: [],
                columns: [
                    {
                        text: '分类名称',
                        dataIndex: 'className'
                    },
                    {
                        text: '类型',
                        dataIndex: 'businessTypeCode'
                    },
                    {
                        text: '排序',
                        dataIndex: 'sortBy'
                    },
                    {
                        text: '创建时间',
                        dataIndex: 'createTime'
                    },
                    {
                        text: '修改时间',
                        dataIndex: 'updateTime'
                    }
                ],
                dataSource: [],
                parentIds:[]
            }
        },
        methods:{
            getResultNumber(result){
                this.businessTypeCode = result;
            },
            //分页显示所有数据列表
            getList() {
                var para = {
                    businessTypeCode: this.businessTypeCode,
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    }
                };
                this.listLoading = true;
                getContentCategoryListFun(para).then((data) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(data)) {
                            this.dataSource = data.data.list
                            this.total = data.data.paginationInfo.total;
                            this.assembleTree(this.dataSource);
                        }
                    }
                    , data => {
                        this.listLoading = false;
                    }
                );
            },
            assembleTree(list) {
                for(var i=0;i<list.length;i++){
                    if (list[i].businessTypeCode == 1){
                        list[i].businessTypeCode = "洗护";
                    }else if (list[i].businessTypeCode == 2){
                        list[i].businessTypeCode = "名品";
                    }else if (list[i].businessTypeCode == 4){
                        list[i].businessTypeCode = "态奢";
                    }else if (list[i].businessTypeCode == 8){
                        list[i].businessTypeCode = "悦生活";
                    }else{
                        list[i].businessTypeCode = "";
                    }
                    list[i].createTime=this.dateFormat(list[i].createTime);
                    list[i].updateTime=this.dateFormat(list[i].updateTime);
                    if (undefined != list[i].children && null != list[i].children) {
                        this.assembleTree(list[i].children);
                    }
                }
            },
            //当前时间格式化
            dateFormat:function(dateTime) {
                if (!dateTime) {
                    return "";
                }
                return util.dateFormat('yyyy-MM-dd hh:mm:ss',new Date(dateTime));
            },
            //添加按钮,打开新增框
            addFormBtn() {
               this.$nextTick(()=>{
                   this.$refs.addForm.resetFields();
                   this.addForm.parentId = [];
               })
                this.getContentCategoryListForDict();
                this.addFormVisible = true;
            },
            //数据表单提交
            add(){
                this.$refs.addForm.validate((valid) => {
                    let param = {
                        businessTypeCode: this.addForm.businessTypeCode,
                        contentType: this.addForm.contentType,
                        parentId: this.addForm.parentId[this.addForm.parentId.length-1],
                        className: this.addForm.className,
                        sortBy: this.addForm.sortBy,
                        systemFlag: this.addForm.systemFlag,
                    };
                    if (valid) {
                        addContentCategoryFun(param).then((data) => {
                            if (this.GLOBAL.isResonseSuccess(data)) {
                                this.addFormVisible = false;
                                this.$message({
                                    message: '操作成功',
                                    type: 'success'
                                });
                                this.getList();
                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //加载级联选择器数据
            getSelectList() {
                var para = {
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    }
                };
                this.listLoading = true;
                getSelectListFun(para).then((data) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(data)) {
                            this.tree = data.data;
                        }
                    }
                    , data => {
                        this.listLoading = false;
                    }
                );
            },
            //加载下拉框内容类型数据类表
            getContentCategoryListForDict() {
                this.listLoading = true;
                getContentCategoryListForDictFun().then((data) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(data)) {
                            this.contentTypes = data.data;
                        }
                    }
                    , data => {
                        this.listLoading = false;
                    }
                );
            },
            //编辑按钮，打开编辑框
            handleEdit(index, row) {
                this.getSelectList();
                this.getContentCategoryListForDict();
                var para={id:row.id};
                this.editFormVisible = true;
                queryContentCategoryById(para).then((data) => {
                    if (this.GLOBAL.isResonseSuccess(data)) {
                        this.editForm.id = data.data.id;
                        this.editForm.businessTypeCode = data.data.businessTypeCode;
                        this.editForm.contentType = data.data.contentType;
                        this.editForm.className = data.data.className;
                        this.editForm.sortBy = data.data.sortBy;
                        this.editForm.parentId = data.data.parentId;
                        this.parentIds = data.data.parentId;
                        this.editForm.systemFlag = data.data.systemFlag;
                    }
                })
            },
            //编辑表单提交
            edit(){
                this.$refs.editForm.validate((valid) => {
                    let length = this.parentIds.length;
                    this.editForm.parentId = this.parentIds[length-1];
                    if (valid) {
                        editContentCategoryFun(this.editForm).then((data) => {
                            if (this.GLOBAL.isResonseSuccess(data)) {
                                this.editFormVisible = false;
                                this.$message({
                                    message: '操作成功',
                                    type: 'success'
                                });
                                this.getList();
                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //删除函数
            handleDel(index, row) {
                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var para = {id: row.id};
                    removeContentCategoryFun(para).then((data) => {
                        if (this.GLOBAL.isResonseSuccess(data)) {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getList();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '删除已取消!'
                    });
                });
            },
            //处理分页条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.getList();
            },
            //分页查询
            handleCurrentChange(page) {
                this.pageNum = page;
                this.getList();
            },
            //选择业务类型下拉框触发事件，动态加载分类级联数据
            businessTypeChange(id){
                this.addForm.businessTypeCode = id;
                this.addForm.contentType = '';
                var para={businessTypeCode:id};
                //获取分类树形结构
                this.listLoading = true;
                getSelectListFun(para).then((data) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(data)){
                            this.tree=data.data;
                        }
                    }
                    ,data => { this.listLoading = false;}
                );
            },
            //选择内容类型下拉框触发事件，动态加载分类级联数据
            contentTypeChange(id){
                var para={
                    contentType:id,
                    businessTypeCode:this.addForm.businessTypeCode,
                };
                //获取分类树形结构
                this.listLoading = true;
                getSelectListFun(para).then((data) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(data)){
                            this.tree=data.data;
                        }
                    }
                    ,data => { this.listLoading = false;}
                );
            },

        },

        mounted(){
            this.getList();
        },
        components: {
            TreeContentCategory,
            selectGroup,
            selectGroupAdd
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    th,td{
        padding: 5px 0!important;
    }
</style>