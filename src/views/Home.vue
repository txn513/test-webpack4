<template>
    <section>
        <el-row class="container">
            <el-col :span="24" class="header">
                <el-col :span="10" class="logo"  :collapse="collapsed" :class="collapsed?'logo-collapse-width':'logo-width'">
                    {{collapsed?'':sysName}}
                </el-col>
                <el-col :span="10">
                    <div class="tools" @click.prevent="collapse">
                        <i class="fa fa-align-justify"></i>
                    </div>
                </el-col>
                <el-col :span="4" class="userinfo">
                    <el-dropdown trigger="hover">
                        <span class="el-dropdown-link userinfo-inner"><img :src="this.sysUserAvatar" /> {{sysUserName}}</span>
                        <el-dropdown-menu slot="dropdown">
                            <!--
                            <el-dropdown-item>我的消息</el-dropdown-item>
                            <el-dropdown-item>设置</el-dropdown-item>
                            <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
                            -->
                            <el-dropdown-item @click.native="handleUpdate">修改密码</el-dropdown-item>
                            <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-col>
            </el-col>
            <el-col :span="24" class="main">
                <aside :class="collapsed?'menu-collapsed':'menu-expanded'">
                    <SearchMenu :span="24" :collapse="collapsed" :class="collapsed?'SearchMenu-hide':'SearchMenu-show'"></SearchMenu>
                    <!--导航菜单-->
                    <el-menu :default-active="$route.path" class="el-menu-vertical-demo" @open="handleopen" @close="handleclose" @select="handleselect"
                             unique-opened router :collapse="collapsed" >
                        <!--<template v-for="(item,index) in nodes" >-->
                            <!--<el-submenu :index="index+''" v-if="item.children">-->
                                <!--<template slot="title"><i :class="item.iconCls"></i><span slot="title">{{item.name}}</span></template>-->
                                <!--<el-menu-item v-for="child in item.children" :index="child.path" :key="child.path">{{child.name}}</el-menu-item>-->
                            <!--</el-submenu>-->
                        <!--</template>-->
                        <MenuTree :nodes="this.nodes"></MenuTree>
                    </el-menu>
                </aside>
                <section class="content-container">
                    
                    <div class="grid-content bg-purple-light">
                        <el-col v-if="$route.name!='首页'"  :span="24" class="breadcrumb-container">
                            <strong class="title">{{$route.name}} 
                                <el-button type="text" size="mini" icon="el-icon-d-arrow-left" style="margin-left: 20px;" @click="goBack">返回</el-button>
                            </strong>
                            <el-breadcrumb separator="/" class="breadcrumb-inner">
                                <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
                                    {{ item.name }}
                                </el-breadcrumb-item>
                            </el-breadcrumb>
                        </el-col>
                        <el-col :span="24" class="content-wrapper">
                            <transition name="fade" mode="out-in">
                                <router-view></router-view>
                            </transition>
                        </el-col>
                    </div>
                </section>
            </el-col>
        </el-row>
        <!--修改密码界面-->
        <el-dialog title="修改密码" v-model="editFormVisible" :visible.sync="editFormVisible">
            <el-form :model="editForm" status-icon :rules="editFormRules" ref="editForm" label-width="100px">
                <el-form-item label="原始密码" prop="password">
                    <el-input type="password" v-model="editForm.password" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                    <el-input type="password" v-model="editForm.newPassword" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="newPasswordOnce">
                    <el-input type="password" v-model="editForm.newPasswordOnce" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetForm('editForm')">重置</el-button>
                <el-button type="primary" @click.native="submit" :loading="loading">修改</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import { requestLogout,updatePwd } from '../api/api';
    import MenuTree from '@/views/MenuTree';
    import SearchMenu from "@/components/searchMenu";
    import demoMenu from '@/demoMenu';
    import avatarImg from '@/assets/user.png';
    import md5 from 'js-md5';
    export default {
        components: {
            MenuTree,
            SearchMenu
        },
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
                //nodes: this.$router.options.routes,
                nodes: [],
                sysName:'森特 后台管理',
                collapsed:false,
                sysUserName: '',
                sysUserAvatar: avatarImg,
                form: {
                    name: '',
                    region: '',
                    date1: '',
                    date2: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: ''
                },
                loading: false,
                editFormVisible:false,//修改密码页面默认不显示
                editFormRules: {
                    password: [{required: true, message: '请输入原始密码', trigger: 'blur'}],
                    newPassword: [
                        {validator: validateNewPassword,required: true, trigger: 'blur'},
                        {validator: validatePassword,required: true, trigger: 'blur'},
                        {min: 8, max: 12, message: '长度在8到12位',required: true, trigger: 'blur' },
                    ],
                    newPasswordOnce: [{validator: validateNewPasswordOnce,required: true, trigger: 'blur'}],
                },
                //编辑界面数据
                editForm: {
                    password: '',
                    newPassword: '',
                    newPasswordOnce: '',
                },

            }
        },
        created() {
            let data = JSON.parse(window.sessionStorage.getItem('menuList'));
            this.nodes.push({"id":185,"parentId":0,"name":"首页","path":"/index/index","perms":"","type":1,"menuType":null,"iconCls":"el-icon-star-on","orderNum":0,"status":1,"menuStatus":null,"isSelectButton":null,"children":null});
            this.nodes.push(...data);
            if (true === process.env.DEMO_MENU) {
                this.nodes.push(...demoMenu);
            }
            //console.log(this.nodes)
        },
        methods: {
            //返回上一页
            goBack() {
                window.history.go(-1);
            },
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
                                    this.editFormVisible = false;
                                    let user = JSON.parse(sessionStorage.getItem('user'));
                                    user.firstLoginFlag = false;
                                    sessionStorage.setItem('user',JSON.stringify(user));
                                    this.$refs['editForm'].resetFields();
                                }
                            });
                        });
                    }
                });
            },

            //重置
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },

            //显示修改密码界面
            handleUpdate: function () {
                this.editFormVisible = true;

            },


            onSubmit() {
                console.log('submit!');
            },
            handleopen() {
                //console.log('handleopen');
            },
            handleclose() {
                //console.log('handleclose');
            },
            handleselect: function (a, b) {
            },
            //退出登录
            logout: function () {
                var _this = this;

                this.$confirm('确认退出吗?', '提示', {
                    //type: 'warning'
                }).then(() => {
                    var userParams = sessionStorage.getItem('user');
                    if (userParams) {
                        userParams = JSON.parse(userParams);
                        let reqObj = {};
                        reqObj.userId = userParams.userId;
                        reqObj.token = userParams.token;
                        requestLogout(reqObj).then(data => {
                            if (this.GLOBAL.isResonseSuccess(data)){
                                if (1 === data.data) {
                                    sessionStorage.removeItem('user');
                                    sessionStorage.removeItem('roleList');
                                    sessionStorage.removeItem('dataRoleList');
                                    sessionStorage.removeItem('menuList');
                                    _this.$router.push('/login');
                                } else {
                                    this.$message({
                                        type: 'error',
                                        message: '退出登录失败'
                                    });
                                }
                            }
                        }).catch(() => {
                        });
                    }
                }).catch(() => {
                });


            },
            //折叠导航栏
            collapse:function(){
                this.collapsed=!this.collapsed;
            },
            showMenu(i,status){
                this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-'+i)[0].style.display=status?'block':'none';
            }
        },
        mounted() {
            let user = sessionStorage.getItem('user');
            if (user) {
                user = JSON.parse(user);
                this.sysUserName = user.name || '';
                this.sysUserAvatar = user.avatar || avatarImg;
            }

        }
    }

</script>

<style scoped lang="scss">
    @import '~scss_vars';

    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 230px;
        min-height: 100%;
    }
    .container {
        position: absolute;
        top: 0px;
        bottom: 0px;
        width: 100%;
        .header {
            height: 60px;
            line-height: 60px;
            //background: $color-primary;
            background: teal;
            color:#fff;
            .userinfo {
                text-align: right;
                padding-right: 35px;
                float: right;
                .userinfo-inner {
                    cursor: pointer;
                    color:#fff;
                    img {
                        width: 40px;
                        height: 40px;
                        border-radius: 20px;
                        margin: 10px 0px 10px 10px;
                        float: right;
                    }
                }
            }
            .logo {
                //width:230px;
                height:60px;
                font-size: 22px;
                padding-left:20px;
                padding-right:20px;
                border-color: rgba(238,241,146,0.3);
                border-right-width: 1px;
                border-right-style: solid;
                img {
                    width: 40px;
                    float: left;
                    margin: 10px 10px 10px 18px;
                }
                .txt {
                    color:#fff;
                }
            }
            .logo-width{
                width:230px;
            }
            .logo-collapse-width{
                width:65px
            }
            .tools{
                padding: 0px 23px;
                width:14px;
                height: 60px;
                line-height: 60px;
                cursor: pointer;
            }
        }
        .main {
            display: flex;
            // background: #324057;
            position: absolute;
            top: 60px;
            bottom: 0px;
            overflow: hidden;
            aside {
                flex:0 0 230px;
                width: 230px;

                overflow-y: auto;
                overflow-x: hidden;
                // position: absolute;
                // top: 0px;
                // bottom: 0px;
                .el-menu{
                    height: 100%;
                }
                .collapsed{

                    width:60px;
                    .item{
                        position: relative;
                    }
                    .submenu{
                        position:absolute;
                        top:0px;
                        left:60px;
                        z-index:99999;
                        height:auto;
                        display:none;
                    }

                }
            }

            .menu-collapsed{
                flex:0 0 65px;
                width: 65px;
                margin-top: 0;
            }
            .menu-expanded{
                flex:0 0 231px;
                width: 231px;
                margin-top: 60px;
            }

            .content-container {
                // background: #f1f2f7;
                flex:1;
                // position: absolute;
                // right: 0px;
                // top: 0px;
                // bottom: 0px;
                // left: 230px;
                overflow-y: scroll;
                padding: 20px;
                .breadcrumb-container {
                    //margin-bottom: 15px;
                    .title {
                        width: 200px;
                        float: left;
                        color: #475669;
                    }
                    .breadcrumb-inner {
                        float: right;
                    }
                }
                .content-wrapper {
                    background-color: #fff;
                    box-sizing: border-box;
                }
            }
        }
    }
    .SearchMenu-hide {
        display: none;
    }
    .SearchMenu-show {
        display: block;
    }
</style>