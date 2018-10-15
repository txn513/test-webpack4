<template>
    <section>
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">

            <el-form align="right" :inline="true"  class="demo-form-inline">
                <el-form-item label="业务类型">
                    <template>
                        <select-group :num ="number" :select="isSelect" @getresult = 'getResultNumber'></select-group>
                    </template>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" v-on:click="searchHotBrand">查询</el-button>
                </el-form-item>
                <el-form-item label="">
                    <el-button v-if="isAuth('mpys:marketingInfo:insert')" type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table v-loading="listLoading" stripe border  highlight-current-row :data="tableData" style="width: 100%;margin-top: 30px;">
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="brandImg" width="160" label="图片">
                <template slot-scope="scope">
                    <img :src="scope.row.brandImg" width="60">
                </template>
            </el-table-column>
            <el-table-column prop="brandName" label="品牌名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="businessId" label="业务类型" :formatter="formatBusiness"></el-table-column>
            <el-table-column prop="channelType" label="类型" :formatter="formatChannelType"></el-table-column>
            <el-table-column prop="skipUrl" label="链接"></el-table-column>
            <el-table-column prop="enableFlag" label="是否启用" sortable :formatter="formatEnableFlag"></el-table-column>
            <el-table-column v-if="isAuth('mpys:marketingInfo:update') || isAuth('mpys:marketingInfo:delete')"  fixed="right" label="操作" width="250">
                <template slot-scope="scope">
                    <el-button v-if="isAuth('mpys:marketingInfo:update')" type="primary"  size="mini" @click="editStatus(scope.row)">{{scope.row.enableFlag == 1 ? "停用" : "启用"}}</el-button>
                    <el-button v-if="isAuth('mpys:marketingInfo:update') && scope.row.enableFlag == 0" type="primary"  size="mini" @click="editHotBrandBtn(scope.row)">编辑</el-button>
                    <el-button v-if="isAuth('mpys:marketingInfo:delete') && scope.row.enableFlag == 0" type="primary"  size="mini" @click="handleDel(scope.row)">删除</el-button>
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

        <!--新增界面-->
        <el-dialog title="新增" v-model="addFormVisible" :visible.sync="addFormVisible">
            <el-form :model="addTrademarkForm" label-width="100px" :rules="addFormRules" ref="addTrademarkForm" class="demo-ruleForm">
                <el-form-item label="名牌图片" prop="brandImg">
                    <el-upload
                            class="avatar-uploader"
                            :action="uploadUrl"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" style="width:400px;height: 300px "  class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="业务类型" prop="businessId">
                    <el-select v-model="addTrademarkForm.businessId" placeholder="请选择">
                        <el-option
                                v-for="item in businessIdOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="类型" prop="channelType">
                    <el-select v-model="addTrademarkForm.channelType" placeholder="请选择">
                        <el-option
                                v-for="item in channelTypeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="品牌名称" prop="brandName">
                    <el-input v-model="addTrademarkForm.brandName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="链接" prop="skipUrl">
                    <el-input type="text" v-model="addTrademarkForm.skipUrl" ></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input type="textarea" v-model="addTrademarkForm.remark"></el-input>
                </el-form-item>
                <el-form-item label="排序号" prop="sortBy">
                    <el-input v-model="addTrademarkForm.sortBy" type="number"  style="width: 10%;"></el-input>
                </el-form-item>
                <el-form-item label="是否启用" prop="enableFlag">
                    <el-switch v-model="addTrademarkForm.enableFlag"></el-switch>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addOrEditSubmit">提交</el-button>
            </div>
        </el-dialog>
        <!--编辑界面-->
        <el-dialog title="编辑" v-model="addFormVisible" :visible.sync="addFormVisible">
            <el-form :model="addTrademarkForm" label-width="100px" :rules="addFormRules" ref="addTrademarkForm" class="demo-ruleForm">
                <el-form-item label="名牌图片" prop="brandImg">
                    <el-upload
                            class="avatar-uploader"
                            :action="uploadUrl"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" style="width:400px;height: 300px "  class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="业务类型" prop="businessId">
                    <el-select v-model="addTrademarkForm.businessId" placeholder="请选择">
                        <el-option
                                v-for="item in businessIdOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="类型" prop="channelType">
                    <el-select v-model="addTrademarkForm.channelType" placeholder="请选择">
                        <el-option
                                v-for="item in channelTypeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="品牌名称" prop="brandName">
                    <el-input v-model="addTrademarkForm.brandName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="链接" prop="skipUrl">
                    <el-input type="text" v-model="addTrademarkForm.skipUrl" ></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input type="textarea" v-model="addTrademarkForm.remark"></el-input>
                </el-form-item>
                <el-form-item label="排序号" prop="sortBy">
                    <el-input v-model="addTrademarkForm.sortBy" type="number"  style="width: 10%;"></el-input>
                </el-form-item>
                <el-form-item label="是否启用" prop="enableFlag">
                    <el-switch v-model="addTrademarkForm.enableFlag"></el-switch>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="addOrEditSubmit">保存</el-button>
                <el-button @click.native="addFormVisible = false">取消</el-button>
            </div>
        </el-dialog>

    </section>
</template>

<script>
    import {getHotBrandList,getHotBrandOne,addHotBrand,updateHotBrand,deleteHotBrand,enableHotBrand,getUploadImgUrl} from '../../api/api';
    import util from '../../common/js/util';
    import selectGroup from '@/components/selectGroup';
    // 要更改默认图片
    import marketingImg from '@/assets/marketingImg.png';

    export default {
        components:{
            selectGroup
        },
        data() {
            return {
                pageNum: 1, //当前页码
                pageSize: 10,//页数
                total:0,
                number: -1,//后台传过来的十进制数据
                isSelect: true,//是否可选
                businessId:-1,//业务类型
                addFormVisible : false,
                //图片处理
                imageUrl: '',
                uploadUrl: getUploadImgUrl(),

                businessIdOptions:[{
                    value: 1,
                    label: '洗护'
                },{
                    value: 2,
                    label: '名品'
                },{
                    value: 4,
                    label: '态奢'
                }],
                channelTypeOptions:[{
                    value: 1,
                    label: '小程序'
                },{
                    value: 2,
                    label: '公众号'
                },{
                    value:3,
                    label: 'APP'
                },{
                    value:4,
                    label: '商城'
                }],
                //表单数据
                addTrademarkForm : {
                    brandImg: "",
                    businessId: "",
                    channelType: "",
                    brandName: "",
                    skipUrl: "",
                    remark: "",
                    sortBy: "",
                    enableFlag : false
                },
                addFormRules :{
                    brandImg: [{required: true, message: '请上传图片', trigger: 'blur'}],
                    businessId: [{required: true, message: '请选择业务类型', trigger: 'blur'}],
                    channelType: [{required: true, message: '请选择类型', trigger: 'blur'}],
                    brandName: [{required: true, message: '请输入品牌名称', trigger: 'blur'},
                        {max: 20, message: '长度不超过20个字符', trigger: 'blur' }],
                    sortBy: [{pattern: /^\+?[1-9][0-9]*$/, message: '请输入大于0的数字', trigger: 'blur'}]
                },

                listLoading: false,
                tableData:[],//表格数据
            };
        },
        methods: {
            getResultNumber(result){
                this.businessId = result;
            },
            //业务类型转换
            formatBusiness:function (row, column) {
                return row.businessId === 1 ? '洗护' : row.businessId === 2 ? '名品' : row.businessId === 4 ? '态奢' : '';
            },
            //类型转换
            formatChannelType:function (row, column) {
                return row.channelType === 1 ? '小程序' : row.channelType === 2 ? '公众号' : row.channelType === 3 ? 'APP' : '商城';
            },
            //状态显示转换
            formatEnableFlag: function (row, column) {
                return row.enableFlag === 1 ? '启用' : row.enableFlag === 0 ? '停用' : '未知';
            },

            //获取品牌列表数据
            getHotBrand() {
                let para = {
                    businessId: this.businessId,
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    }
                };
                this.listLoading = true;
                getHotBrandList(para).then((res) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(res)) {
                            var ipUrl = process.env.IMG_URL;
                            var defaultImg = marketingImg;

                            var list = res.data.list;
                            for (var i = 0; i < list.length; i++) {
                                if (list[i].brandImg == null || list[i].brandImg == "") {
                                    list[i].brandImg = defaultImg;
                                } else {
                                    list[i].brandImg = ipUrl + list[i].brandImg;
                                }
                            }

                            this.tableData=list;
                            this.total = res.data.paginationInfo.total;
                        }
                    }
                    ,res => { this.listLoading = false;}
                );
            },

            //图片上传
            beforeAvatarUpload(file){
                const isJPG = file.type === 'image/jpeg';
                const isGIF = file.type === 'image/gif';
                const isPNG = file.type === 'image/png';
                const isBMP = file.type === 'image/bmp';
                const isLt2M = file.size / 1024 / 1024 < 5;

                if (!isJPG && !isGIF && !isPNG && !isBMP) {
                    this.common.errorTip('上传图片必须是JPG/GIF/PNG/BMP 格式!');
                }
                if (!isLt2M) {
                    this.common.errorTip('上传图片大小不能超过 5MB!');
                }
                return (isJPG || isBMP || isGIF || isPNG) && isLt2M;
            },

            handleAvatarSuccess(res, file) {
                this.imageUrl = process.env.IMG_URL + res.data.relativePath;
                this.addTrademarkForm.brandImg = res.data.relativePath;
            },

            //点击查询
            searchHotBrand() {
                this.pageNum = 1;
                this.getHotBrand();
            },
            //切换页数
            handleCurrentChange(val) {
                this.pageNum = val;
                this.getHotBrand();
            },
            //处理分页条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.getHotBrand();
            },

            //添加按钮
            handleAdd(){
                this.addFormVisible = true;
                this.addTrademarkForm = {
                    id :"",
                    businessId: "",
                    channelType: "",
                    brandName: "",
                    skipUrl: "",
                    remark: "",
                    sortBy: "",
                    enableFlag : false
                }
                this.imageUrl =""
            },

            //编辑按钮
            editHotBrandBtn(row){
                var para={id:row.id};
                getHotBrandOne(para).then((res) => {
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.addTrademarkForm = {
                            id :res.data.id,
                            businessId: res.data.businessId,
                            channelType: res.data.channelType,
                            brandName: res.data.brandName,
                            skipUrl: res.data.skipUrl,
                            brandImg : res.data.brandImg,
                            remark:res.data.remark,
                            sortBy : res.data.sortBy,
                            enableFlag : res.data.enableFlag== 0 ? false : true
                        }
                        this.imageUrl = process.env.IMG_URL +res.data.brandImg;
                        this.addFormVisible = true;
                    }
                })
            },

            //添加/编辑信息
            addOrEditSubmit(ve){
                this.$refs.addTrademarkForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            if(this.addTrademarkForm.enableFlag){
                                this.addTrademarkForm.enableFlag = 1;
                            }else{
                                this.addTrademarkForm.enableFlag = 0;
                            }
                            if(this.addTrademarkForm.id== null || this.addTrademarkForm.id ==""){
                                //新增
                                addHotBrand(this.addTrademarkForm).then((res) => {
                                    if (this.GLOBAL.isResonseSuccess(res)) {
                                        this.addFormVisible = false;
                                        this.getHotBrand();
                                        this.$message({
                                            message: '提交成功',
                                            type: 'success'
                                        });
                                    }
                                });
                            }else{
                                //修改
                                updateHotBrand(this.addTrademarkForm).then((res) => {
                                    if (this.GLOBAL.isResonseSuccess(res)) {
                                        this.addFormVisible = false;
                                        this.getHotBrand();
                                        this.$message({
                                            message: '更新成功',
                                            type: 'success'
                                        });
                                    }
                                });
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },

            //删除按钮
            handleDel(row){
                this.$confirm('确认删除该记录吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var para={id:row.id};
                    deleteHotBrand(para).then((res) => {
                        if (this.GLOBAL.isResonseSuccess(res)) {
                            this.getHotBrand();
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '删除失败!'
                    });
                });
            },

            //启用/禁用状态
            editStatus: function (row) {
                let para = {
                    enableFlag: row.enableFlag === 1 ? 0 : 1,
                    id: row.id
                };
                this.listLoading = true;
                enableHotBrand(para).then((res) => {
                    if (this.GLOBAL.isResonseSuccess(res)){
                        this.listLoading = false;
                        this.getHotBrand();
                    }
                }, (res) => { this.listLoading = false; } ).catch(() => {});
            }

        },

        mounted(){
            this.getHotBrand();
        }
    }

</script>

