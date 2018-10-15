<template>
    <div>
        <consignmentOrderDetail ref="child"></consignmentOrderDetail>

        <el-form label-width="120px">
            <el-form-item label="处理备注">
                <el-col :span="16">
                    <el-input type="textarea" :rows="3" placeholder="请填写备注"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item style="align-content: center;width: 50%;text-align: center;">
                <el-button type="primary" @click="btnOk">同意</el-button>
                <el-button @click="btnRejectShow"> 拒绝</el-button>
            </el-form-item>
        </el-form>

        <!--编辑界面-->
        <el-dialog title="拒绝原因" v-model="rejectFormVisible" :visible.sync="rejectFormVisible"
                   @close="resetForm('rejectForm')">
            <el-form :model="rejectForm" label-width="80px" :rules="rejectFormRules" ref="rejectForm"
                     v-loading="rejectLoading">
                <el-form-item label="拒绝原因" prop="rejectReason">
                    <el-col :span="16">
                        <el-input v-model="rejectForm.rejectReason" type="textarea" :rows="3"
                                  placeholder="请填写备注"></el-input>
                    </el-col>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="rejectFormVisible = false" @click="resetForm('rejectForm')">取消</el-button>
                <el-button type="primary" @click.native="btnReject" :loading="rejectLoading">提交</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import consignmentOrderDetail from "./consignmentOrderDetail"

    export default {
        data() {
            return {
                rejectFormVisible: false,
                rejectLoading: false,
                rejectForm: {
                    rejectReason: '',
                },
                rejectFormRules: {
                    rejectReason: [{required: true, message: '请填写决绝理由', trigger: 'blur'}],
                }
            };
        },
        components: {
            consignmentOrderDetail
        },
        methods: {
            btnOk() {
                let t = this.$refs.child.id;
                console.log(t);
            },
            btnRejectShow() {
                this.rejectFormVisible = true;
            },
            btnReject() {
                this.$refs.rejectForm.validate((valid) => {
                    alert(valid);
                    if (valid) {
                        this.rejectLoading = true;
                        let para = Object.assign({}, this.rejectForm);
                        console.log(para)
                    }
                });


            },
            //重置
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        },
        mounted() {
            console.log(this.$refs.child.id);
        }
    }
</script>

<style scoped>


</style>


