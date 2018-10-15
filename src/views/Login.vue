<template>
    <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
        <h3 class="title">{{ $t("login.title") }}{{ flagString }}</h3>

        <el-form-item prop="account">
            <el-input type="text" v-model="ruleForm2.account" auto-complete="off" :placeholder="$t('login.hintAccount')"></el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
            <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" :placeholder="$t('login.hintPassword')"></el-input>
        </el-form-item>
        <el-form-item prop="captcha">
            <el-row :gutter="20">
                <el-col :span="10">
                    <el-input v-model="ruleForm2.captcha" auto-complete="off" :placeholder="$t('login.hintCaptcha')" @keyup.enter.native="handleSubmit2">
                    </el-input>
                </el-col>
                <el-col :span="5" class="login-captcha">
                    <img :src="captchaPath" @click="getCaptcha()" alt="">
                </el-col>
            </el-row>
        </el-form-item>

        <el-checkbox v-model="checked"  class="remember" disabled>{{ $t("login.btnRemember") }} </el-checkbox>

        <el-form-item style="width:100%;">
            <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">{{ $t("login.btnLogin") }}</el-button>
            <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
        </el-form-item>
        <div class="hint">支持浏览器: IE9+、Firefox45+、Safari10.10+、Chrome54+</div>
    </el-form>

</template>

<script>
    import util from '@/common/js/util';
    import {requestLogin, getCaptchaUrl,getBusinessList} from '../api/api';
    import md5 from 'js-md5';

    //import NProgress from 'nprogress'
    export default {
        data() {
            return {
                flagString: process.env.API_FLAGSTRING,
                logining: false,
                ruleForm2: {
                    account: process.env.TEST_USERNAME,
                    checkPass: process.env.TEST_PASSWORD,
                    uuid: '',
                    captcha:'',
                },
                rules2: {
                    account: [
                        { required: true, message: this.$t('login.hintAccountEx'), trigger: 'blur' },
                    ],
                    checkPass: [
                        { required: true, message: this.$t('login.hintPasswordEx'), trigger: 'blur' },
                    ],
                    captcha: [
                        { required: true, message: this.$t('login.hintCaptchaEx'), trigger: 'blur' },
                    ],
                },
                checked: false,
                captchaPath:'',
            };
        },
        mounted() {
            this.getCaptcha();
        },
        methods: {
            // 获取验证码
            getCaptcha () {
                this.ruleForm2.uuid = util.getUUID();
                this.captchaPath =  getCaptchaUrl(this.ruleForm2.uuid);
            },

            handleReset2() {
                this.$refs.ruleForm2.resetFields();
            },

            handleSubmit2() {
                this.$refs.ruleForm2.validate((valid) => {
                    if (valid) {
                        this.logining = true;
                        let loginParams = {
                            userName: this.ruleForm2.account,
                            userPwd: md5(this.ruleForm2.checkPass),
                            uuid: this.ruleForm2.uuid,
                            captcha: this.ruleForm2.captcha
                        };
                        requestLogin(loginParams).then(data => {
                                this.logining = false;
                                if (this.GLOBAL.isResonseSuccess(data)){
                                    if ((data.data)) {
                                        sessionStorage.setItem('menuList',JSON.stringify(data.data.menuList || '[]'));
                                        sessionStorage.setItem('roleList',JSON.stringify(data.data.roleList || '[]'));
                                        sessionStorage.setItem('dataRoleList',JSON.stringify(data.data.dataRoleList || '[]'));
                                        data.data.roleList = [];
                                        data.data.menuList = [];
                                        sessionStorage.setItem('user', JSON.stringify(data.data));
                                    }
                                    if (data.data.firstLoginFlag) {
                                        this.$alert('第一次登陆，请修改密码！', '提示', {
                                            confirmButtonText: '确定',
                                            callback: action => {
                                                this.$router.push({path: '/updatePwd'});
                                            }
                                        });
                                    } else {
                                        getBusinessList({}).then((res) => {
                                            if (this.GLOBAL.isResonseSuccess(res)) {
                                                sessionStorage.setItem('businessList',JSON.stringify(res.data || '[]'));
                                                this.$router.push({path: '/index/index'});
                                            }
                                        }, (res) => { this.editLoading = false; } ).catch(() => {});

                                    }
                                }
                                this.getCaptcha();
                            }
                            ,data => { this.logining = false; });
                    } else {
                        return false;
                    }
                });
            }
        },
    }

</script>

<style lang="scss" scoped>
    .login-container {
        /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
        -webkit-border-radius: 5px;
        border-radius: 5px;
        -moz-border-radius: 5px;
        background-clip: padding-box;
        margin: 180px auto;
        width: 350px;
        padding: 35px 35px 15px 35px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;
        .title {
            margin: 0px auto 40px auto;
            text-align: center;
            color: #505458;
        }
        .hint {
            text-align: center;
            font-size: smaller;
            color: #909399;
        }
        .remember {
            margin: 0px 0px 35px 0px;
        }
    }
</style>