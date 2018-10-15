<template>
    <section>
        <el-row :gutter="20">
            <el-col :span="6" :offset="8">
                <el-form :model="editForm" status-icon :rules="editFormRules" ref="editForm" label-width="100px" style="margin-top: 30%;">
                    <el-form-item label="原始密码" prop="password">
                        <el-input type="password" v-model="editForm.password" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="newPassword">
                        <el-input type="password" v-model="editForm.newPassword" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="newPasswordOnce">
                        <el-input type="password" v-model="editForm.newPasswordOnce" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="resetForm('editForm')">重置</el-button>
                        <el-button type="primary" @click.native="submit" :loading="loading">提交</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </section>
</template>

<script>
    import {updatePwd} from '../../api/api';
    import md5 from 'js-md5';
    export default {
        data() {
            let validateNewPassword = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.editForm.newPasswordOnce !== '') {
                        this.$refs.editForm.validateField('newPasswordOnce');
                    }
                    callback();
                }
            };
            let validateNewPasswordOnce = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.editForm.newPassword) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };

            let validatePassword = (rule, value, callback) => {
                let reg = new RegExp(/^(?:(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9])).{8,12}$/);
                if (!reg.test(value)) {
                    callback(new Error('密码必须包含字母大小数字特殊符号'));
                } else {
                    callback();
                }
            };

            return {
                loading: false,
                editFormRules: {
                    password: [{required: true, message: '请输入原始密码', trigger: 'blur'}],
                    newPassword: [
                        {min: 8, max: 12, message: '长度在8到12位', required: true, trigger: 'blur' },
                        {validator: validateNewPassword, required: true, trigger: 'blur'},
                        {validator: validatePassword,  required: true, trigger: 'blur'},
                    ],
                    newPasswordOnce: [{validator: validateNewPasswordOnce, required: true, trigger: 'blur'}],
                },
                //编辑界面数据
                editForm: {
                    password: '',
                    newPassword: '',
                    newPasswordOnce: '',
                },
            }
        },
        methods: {
            //修改
            submit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.loading = true;
                            let para = {
                                password: md5(this.editForm.password),
                                newPassword: this.editForm.newPassword,
                                newPasswordOnce: md5(this.editForm.newPasswordOnce),
                            };
                            updatePwd(para).then((res) => {
                                this.loading = false;
                                if (this.GLOBAL.isResonseSuccess(res)) {
                                    this.$message({
                                        message: '修改成功',
                                        type: 'success'
                                    });
                                    let user = JSON.parse(sessionStorage.getItem('user'));
                                    user.firstLoginFlag = false;
                                    sessionStorage.setItem('user',JSON.stringify(user));
                                    this.$refs['editForm'].resetFields();
                                    this.$router.push({path: '/index/index'});
                                }
                            });
                        });
                    }
                });
            },
        },

        //重置
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    }
</script>
<style scoped>
</style>