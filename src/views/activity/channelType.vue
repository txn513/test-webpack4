<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">

            <el-form align="right" :inline="true"  class="demo-form-inline">
                <el-form-item label="">
                    <el-input v-model="filters.channelName" placeholder="渠道名称"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-select v-model="filters.channelType" clearable placeholder="渠道类型" >
                       <!-- 1:小程序;2:公众号;3:APP;4:第三方渠道-->
                        <el-option :key="1" :value="1" label="小程序"></el-option>
                        <el-option :key="2" :value="2" label="公众号"></el-option>
                        <el-option :key="3" :value="3" label="APP"></el-option>
                        <el-option :key="4" :value="4" label="第三方渠道"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-select v-model="filters.enableFlag" clearable placeholder="启用状态" >
                        <el-option :key="1" :value="1" label="启动"></el-option>
                        <el-option :key="0" :value="0" label="停用"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" v-on:click="searchData">查询</el-button>
                </el-form-item>
                <el-form-item label="">
                    <el-button v-if="isAuth('scloud:channeltypemanage:insert')" type="primary" @click="handleEditOrAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="list"   highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
             <el-table-column prop="channelName" label="渠道名称"   ></el-table-column>
             <el-table-column prop="channelType" label="渠道类型" :formatter="number2Text" ></el-table-column>
             <el-table-column prop="remark" label="备注"  ></el-table-column>
             <el-table-column prop="enableFlag" label="启用状态" :formatter="number2Text"></el-table-column>

<!--            <el-table-column v-if="isAuth('scloud:channeltypemanage:update') || isAuth('scloud:channeltypemanage:delete')" fixed="right" label="操作" width="150">
                <template slot-scope="scope">
                    <el-button v-if="isAuth('scloud:channeltypemanage:update') && scope.row.enableFlag == 1" type="primary" size="mini" @click="updateDisableFlag(scope.row, 0)">停用</el-button>
                    <el-button v-if="isAuth('scloud:channeltypemanage:update') && scope.row.enableFlag == 0" type="primary" size="mini" @click="updateDisableFlag(scope.row, 1)">启用</el-button>
                </template>
            </el-table-column>-->
        </el-table>

        <!--工具条 跳页-->
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
        <el-dialog :title="title" v-model="formVisible" :visible.sync="formVisible">
            <el-form :model="form" label-width="80px" :rules="formRules" ref="form">
               <el-form-item label="渠道名称" prop="channelName">
                  <el-input v-model="form.channelName" auto-complete="off"></el-input>
               </el-form-item>
               <el-form-item label="渠道类型" prop="channelType">
                  <!--<el-input v-model="form.channelType" auto-complete="off"></el-input>-->
                   <el-select v-model="form.channelType" clearable placeholder="渠道类型" >
                       <!-- 1:小程序;2:公众号;3:APP;4:第三方渠道-->
                       <el-option :key="1" :value="1" label="小程序"></el-option>
                       <el-option :key="2" :value="2" label="公众号"></el-option>
                       <el-option :key="3" :value="3" label="APP"></el-option>
                       <el-option :key="4" :value="4" label="第三方渠道"></el-option>
                   </el-select>
               </el-form-item>
               <el-form-item label="备注" prop="remark">
                  <el-input v-model="form.remark" auto-complete="off"></el-input>
               </el-form-item>
               <el-form-item label="启用状态" prop="enableFlag">
                  <!--<el-input v-model="form.enableFlag" auto-complete="off"></el-input>-->
                   <el-radio v-model="form.enableFlag" label="1">启用</el-radio>
                   <el-radio v-model="form.enableFlag" label="0">禁用</el-radio>
               </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="formVisible = false">取消</el-button>
                <el-button type="primary" @click.native="submit" :loading="loading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import {getChannelTypeList, updateChannelTypeStatus, addChannelType} from '../../api/api';

    export default {
        data() {
            return {
                filters: {
                    channelName:'' ,
                    channelType:'' ,
                    enableFlag:''
                },
                list: [],
                total: 0,
                title:"新增",//弹出框标题
                pageNum: 1, //当前页码
                pageSize: 10,//页数
                listLoading: false,
                sels: [],//列表选中列
                formVisible: false,//编辑界面是否显示
                loading: false,
                formRules: {
                    channelName: [{required: true, message: '请输入渠道名称', trigger: 'blur'},
                        {max: 40, message: '请输入渠道名称最多40个字符,请重新输入', trigger: 'blur' }],
                    channelType: [{required: true, message: '请选择渠道类型', trigger: 'change'}],
                    enableFlag: [{required: true, message: '请选是否启用渠道', trigger: 'blur'}],
                },
                //编辑界面数据
                form: {
                      id:'' ,
                      channelName:'' ,
                      channelType:'' ,
                      remark:'' ,
                      businessId:'' ,
                      sortBy:'' ,
                      enableFlag:'' ,
                      delFlag:'' ,
                      createTime:'' ,
                      updateTime:'' 
                },

            }
        },
        methods: {
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
                this.pageNum = 1;
                this.getData();
            },
            //获取用户列表
            getData() {
                let para = {
                    channelName: this.filters.channelName,
                    channelType: this.filters.channelType,
                    enableFlag: this.filters.enableFlag,
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    }
                };
                this.listLoading = true;
                getChannelTypeList(para).then((res) => {
                    this.listLoading = false;
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.total = res.data.paginationInfo.total;
                        this.list = res.data.list;
                    }
                }, () => { this.listLoading = false; });
            },
            //启用/禁用
            updateDisableFlag(row, statu){
                let para = {
                    id: row.id,
                    enableFlag: statu,
                }
                updateChannelTypeStatus(para).then((res) => {
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.getData();
                    }else{
                        this.$message.error(res.message());
                    }
                });

            },
            //显示编辑/新增界面
            handleEditOrAdd: function (index, row) {
                if (row) {
                    this.title= "编辑";
                    this.form = Object.assign({}, row);
                } else {
                    this.title= "新增";
                    this.form = {};
                }
                this.formVisible = true;
            },
            //编辑
            submit: function () {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.loading = true;
                            let para = this.form;
                            if(para.id) {
                                editChannelType(para).then((res) => {
                                    this.loading = false;
                                    if (this.GLOBAL.isResonseSuccess(res)){
                                        this.success("修改成功");
                                        this.$refs['form'].resetFields();
                                        this.formVisible = false;
                                        this.getData();
                                     }
                                })
                            } else {
                                addChannelType(para).then((res) => {
                                    this.loading = false;
                                    if (this.GLOBAL.isResonseSuccess(res)) {
                                        this.$message({
                                            message: '提交成功',
                                            type: 'success'
                                        });
                                        this.$refs['form'].resetFields();
                                        this.formVisible = false;
                                        this.getData();
                                    }
                                });
                            }
                        });
                    }
                });
            },
            number2Text(row, column) {
                var property = column.property;
                var value = row[column.property];
                if ("enableFlag" == property){
                    switch (value){
                        case 0: return "停用";
                        case 1: return "启用";
                    }
                }else if("channelType" == property){
                    //渠道类型(1:小程序;2:公众号;3:APP;4:第三方渠道)
                    switch (value){
                        case 1: return "小程序";
                        case 2: return "公众号";
                        case 3: return "APP";
                        case 4: return "第三方渠道";
                    }
                }
                return null;
            },
            selsChange: function (sels) {
                this.sels = sels;
            },

            success: function(message){
                this.$message({
                    message: message,
                    type: 'success'
                });
            }
        },
        mounted() {
            this.getData();
        }
    }

</script>

<style scoped>

</style>