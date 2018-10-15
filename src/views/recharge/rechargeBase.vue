<template>
    <section>
        <el-dialog title="充值项目" :visible.sync="dialogFormVisible" width="30%">
            <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
                <el-form-item label="项目的森特币数量" :label-width="formLabelWidth" prop="sinterCurrencyAmount">
                    <el-input v-model="form.sinterCurrencyAmount" auto-complete="off" style="width: 160px;"></el-input>
                </el-form-item>
  <!--              <el-form-item label="" :label-width="formLabelWidth">
                    <el-button type="primary" @click="submitForm('form')" v-loading="submitLoading">提 交</el-button>
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                </el-form-item>-->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm('form')" v-loading="submitLoading">提 交</el-button>
            </div>
        </el-dialog>
        <div class="toolbar el-col el-col-24" style="margin-top: 20px;">
            <el-button type="primary" @click="addDialog">新增</el-button>
        </div>

        <div id="list" class="el-col el-col-24" v-loading="listLoading" style="margin:0;padding:0;background: none;">
            <div class="li" v-for="(item,index) in items">
                <p class="p1">{{item.sinterCurrencyAmount}}</p>
                <p class="p2" @click="confirmDel(item.id,index)">删除</p>
            </div>
        </div>

    </section>
</template>

<script>
    import {getRechargeBaseListFun,deleteRechargeBaseFun,addRechargeBaseFun} from '../../api/api';

    export default {
        data() {
            //自定义验证森特币数量
            var validate = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入森特币数量'));
                } else if(!(new RegExp(/^([1-9][0-9]*){1,5}$/).test(value))){
                    callback(new Error('森特币数量只能为正整数'));
                }else{
                    callback();
                }
            };
            return {
                dialogFormVisible: false,
                listLoading: false,
                submitLoading: false,
                items:[],
                formLabelWidth: '150px',

                form:{
                    sinterCurrencyAmount:'',//充值森特币项目数量
                },
                rules: {
                    sinterCurrencyAmount: [
                        { required: true, validator: validate, trigger: 'blur' },
                    ]
                },
            };
        },
        methods:{
            //获取基础充值面额列表
            getRechargeList(){
                this.listLoading = true;
                getRechargeBaseListFun(null).then((res) => {
                    this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(res)){
                            this.items=res.data;
                        }
                    },res => { this.listLoading = false; }
                );
            },
            //执行删除操作
            deleteRechargeBase(id,index){
                deleteRechargeBaseFun({id:id}).then((res) => {
                        if (this.GLOBAL.isResonseSuccess(res)){
                            if (res.code == 1) {
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                                //删除数组的值
                                this.items.splice(index, 1);
                            }
                            else {
                                this.$message({
                                    type: 'error',
                                    message: '删除失败!'
                                });
                            }
                        }
                    }
                );
            },
            //执行添加操作
            addRechargeBase(){
                var para={
                    sinterCurrencyAmount:this.form.sinterCurrencyAmount
                };
                this.submitLoading=true;
                addRechargeBaseFun(para).then((res) => {
                    this.submitLoading=false;
                    if (this.GLOBAL.isResonseSuccess(res)){
                        if (res.code == 1) {
                            this.$message({
                                type: 'success',
                                message: '添加成功!'
                            });
                            //更新dom
                            this.items.push({id: null, sinterCurrencyAmount: this.form.sinterCurrencyAmount});
                            this.dialogFormVisible = false;
                        }
                        else {
                            this.$message({
                                type: 'error',
                                message: '添加失败!该面额在系统中已存在'
                            });
                        }
                    }
                });
            },
            //删除一个面额
            confirmDel(id,index){
                this.$confirm('您确定执行删除操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    //执行删除操作
                    if(id){
                        this.deleteRechargeBase(id,index);
                    }else{
                        this.$message({
                            type: 'info',
                            message: '请刷新重试!'
                        });
                    }

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            //新增弹出框
            addDialog(){
                this.form.sinterCurrencyAmount='';
                this.dialogFormVisible = true
            },
            //提交新增操作
            submitForm(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.addRechargeBase();
                    } else {
                        return false;
                    }
                });
            }
        },

        mounted(){
            this.getRechargeList();
        }
    }

</script>

<style>
    .li{
        float: left;
        text-align: center;
        background-color: #909399;
        border-radius: 4px;
        width: 160px;
        color: #fff;
        font-size: 14px;
        margin-left: 25px;
        margin-bottom: 25px;
    }

    .li .p1{
        padding:25px 0;
        margin:0;
    }

    .li .p2{
        border-top: 1px solid #737373;
        padding:8px 0;
        margin:0;
        cursor: pointer;
    }

</style>