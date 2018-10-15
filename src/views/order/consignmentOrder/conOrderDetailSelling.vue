<template>
    <div  >
        <consignmentOrderDetail ref="child"  @loadedData="loaded"></consignmentOrderDetail>

        <div v-if="isSelling">
            <div style="text-align: center;margin-top: 20px">
                <el-button  v-if="isAuth(CON_PRIVILEGE.UPDATE)"  type="success" style="align-content: center; " @click="btnFinish"> 转到已完成</el-button>
                <el-button   v-if="isAuth(CON_PRIVILEGE.UPDATE)" type="warning" style="align-content: center; " @click="btnReturnShow"> 转到退货处理</el-button>
            </div>
            <!--编辑界面-->
            <el-dialog title="退货原因" v-model="returnFormVisible" :visible.sync="returnFormVisible" @close= "resetForm('returnForm')">
                <el-form :model="returnForm" label-width="80px" :rules="returnFormRules" ref="returnForm"   v-loading="returnLoading" >
                    <el-form-item label="退货原因"  prop="returnReason" >
                        <el-col :span="16">
                            <el-input v-model="returnForm.returnReason" type="textarea" :rows="3" placeholder="请填写备注"></el-input>
                        </el-col>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="returnFormVisible = false" @click="resetForm('returnForm')">取消</el-button>
                    <el-button type="primary" @click.native="btnReturn" :loading="returnLoading">提交</el-button>
                </div>
            </el-dialog>
        </div>
        <!--    -->

    </div>
</template>

<script >
    import consignmentOrderDetail  from "./consignmentOrderDetail"
    import OrderUtil from '../../../common/js/OrderUtil';
    import {getConsignmentOrderstatusFinish,getConsignmentOrderReturn} from "../../../api/api";
    export default {
        data(){
            return {
                //寄卖订单状态枚举常量
                CON_STATUS : OrderUtil.data().CON_STATUS,
                CON_PRIVILEGE:OrderUtil.data().CON_PRIVILEGE,
                //
                orderSatus:  0,
                isSelling: false,
                returnFormVisible:false,
                returnLoading: false,
                returnForm:{
                    returnReason :'',
                },
                returnFormRules:{
                    returnReason: [{required: true, message: '请填写决绝理由', trigger: 'blur'}],
                }
            };
        },
        components:{
            consignmentOrderDetail
        },
        methods:{
            //子组件回调
            loaded(){
                this.orderStatus = this.$refs.child.orderData[0].orderStatus;
                this.isSelling  = OrderUtil.data().CON_STATUS.SELLING==this.orderStatus;
            },

            //寄卖中-----------------------
            btnFinish(){
                this.$confirm('确认完成吗？', '提示', {}).then(() => {
                    let para = {"id": this.$refs.child.id};
                    getConsignmentOrderstatusFinish(para).then((res) => {
                       OrderUtil.handleResult(res,()=>{
                           this.$refs.child.getData();
                       });
                    });
                });
            },
            btnReturnShow(){
                this.returnFormVisible = true;
            },
            btnReturn(){
                this.$refs.returnForm.validate((valid) => {
                    if(valid){
                        let para = Object.assign({}, this.returnForm);
                        para.id=this.$refs.child.id;
                        para.orderSource=1; //
                        para.orderStatus=this.$refs.child.orderData[0].orderStatus;

                        getConsignmentOrderReturn(para).then((res) => {
                            OrderUtil.handleResult(res,()=>{
                                //重新加载数据
                                this.$refs.child.getData();
                            });
                            this.returnFormVisible =false;
                            this.returnLoading =false;
                        }, (res) => { this.listLoading = false; } ).catch(() => {});
                    }
                });
            },
            //寄卖中---end--------------------

            //重置
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        },
        mounted(){
            console.log(this.$refs.child.id);
            console.log(this.$refs.child.orderData[0]);
            // this.orderStatus= this.$refs.child.orderData[0].orderStatus;
            // console.log(this.orderStatus);
        },
    }
</script>

<style scoped>


</style>


