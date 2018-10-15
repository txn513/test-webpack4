<template>
    <section>

        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form style="float: right" :inline="true"  class="demo-form-inline">
                <el-form-item label="">
                    <el-input v-model="queryKey" placeholder="输入账号、昵称"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" v-on:click="search" :loading="listLoading" icon="el-icon-search">查询</el-button>
                </el-form-item>
                <el-form-item label="">
                    <el-button v-if="isAuth('scloud:shopAccount:insert')" type="primary" @click="addFormBtn">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--table-->
        <el-table v-loading="listLoading" element-loading-text="拼命加载中" :data="userList"
                  style="width: 100%;margin-top: 30px;">
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column sortable prop="account" label="账号"></el-table-column>
            <el-table-column sortable prop="trueName" label="真实姓名"></el-table-column>
            <el-table-column sortable prop="shopName" label="所属服务点&工厂"></el-table-column>
            <el-table-column v-if="isAuth('scloud:shopAccount:update')" fixed="right" label="操作" width="310">
                <template slot-scope="scope">
                    <el-button v-if="isAuth('scloud:shopAccount:update')" @click="edit(scope.row)" type="primary" size="mini">编辑</el-button>
                    <el-button v-if="isAuth('scloud:shopAccount:update')" @click="changeStatus(scope.row)" type="primary" size="mini">{{scope.row.disableFlag === 0 ? '禁用' : '启用'}}</el-button>
                    <el-button v-if="isAuth('scloud:shopAccount:view')"   @click="detail(scope.row)" type="primary" size="mini">详情</el-button>
                    <el-button type="primary" size="mini" @click="warn(scope.row)">推广码</el-button>
                </template>
            </el-table-column>
        </el-table>

        <template>
            <el-dialog title="注意!!!" :visible.sync="outerVisible" width="20%">
                <span>用户扫描推广码下载应用之后，务必让用户立即点开应用并进入首页，否则会统计不到。</span>
                <el-dialog width="30%" title="推广码" :visible.sync="innerVisible" append-to-body >
                    <span>用户扫描推广码下载应用之后，务必让用户立即点开应用并进入首页，否则会统计不到。</span>
                    <div style="text-align: center;margin:auto;max-height: 320px;overflow-y: auto;overflow-x:hidden">
                        <div style="float:none" v-for="item in detailList">
                            <div v-if="item.chaType === 0">
                                <p >APP二维码</p>
                                <p><img :src="APPQRCodeUrl" width="200"  ></p>
                                <el-button round @click="download(APPQRCodeUrl,0)" >下载图片</el-button>
                            </div>

                            <div v-if="item.chaType === 1">
                                <p>微信二维码</p>
                                <p><img :src="WXQRCodeUrl" width="200"  > </p>
                                <el-button round @click="download(WXQRCodeUrl,1)" ><a :href="WXQRCodeUrl" download="w3logo"></a>下载图片</el-button>
                            </div>
                        </div>
                        <div style="clear: both;"></div>
                    </div>

                </el-dialog>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="outerVisible = false">取 消</el-button>
                    <el-button type="primary" @click="getShowQRcode()">展示推广码</el-button>
                </div>
            </el-dialog>
        </template>

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

        <el-dialog title="新增" v-model="addFormVisible" :visible.sync="addFormVisible">
            <el-form ref="addForm" :model="addForm" label-width="80px" :rules="formRules" @submit.prevent="onSubmit" style="margin:20px;">
                <el-form-item label="用户名" prop="trueName">
                    <el-input v-model="addForm.trueName"></el-input>
                </el-form-item>
                <el-form-item label="账号" prop="account">
                    <el-input v-model="addForm.account"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="addForm.phone"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password" type="password"></el-input>
                </el-form-item>
                <el-form-item label="角色">
                    <el-radio-group v-model="addForm.roleFlag" @change="radioChange">
                        <el-radio-button label="0">无</el-radio-button>
                        <el-radio-button label="1">配送员</el-radio-button>
                        <el-radio-button label="2">驻点员</el-radio-button>
                        <el-radio-button label="3">司机</el-radio-button>
                        <el-radio-button label="4">洗护中心</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :label="serviceName" prop="shopId">
                    <el-cascader
                            :options="tree"
                            v-model="addForm.shopId"
                            :show-all-levels="false"
                            :clearable="true"
                            :props="defaultProps"
                    ></el-cascader>
                </el-form-item>
                <el-form-item label="是否组长">
                    <el-radio-group v-model="addForm.groupFlag">
                        <el-radio-button label="0">否</el-radio-button>
                        <el-radio-button label="1">是</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="addForm.remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addFormSubmit('addForm')" >提交</el-button>
            </div>
        </el-dialog>

        <el-dialog title="编辑" v-model="editFormVisible" :visible.sync="editFormVisible">
            <el-form ref="editForm" :model="editForm" label-width="80px" :rules="formRules" @submit.prevent="onSubmit" style="margin:20px;">
                <el-form-item label="用户名" prop="trueName">
                    <el-input v-model="editForm.trueName"></el-input>
                </el-form-item>
                <el-form-item label="账号" prop="account">
                    <el-input v-model="editForm.account" disabled ="true"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="editForm.phone"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="editForm.password" type="password"></el-input>
                </el-form-item>
                <el-form-item label="角色">
                    <el-radio-group v-model="editForm.roleFlag" @change="radioChange">
                        <el-radio-button label="0">无</el-radio-button>
                        <el-radio-button label="1">配送员</el-radio-button>
                        <el-radio-button label="2">驻点员</el-radio-button>
                        <el-radio-button label="3">司机</el-radio-button>
                        <el-radio-button label="4">洗护中心</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :label="serviceName" prop="shopId">
                    <el-cascader
                            :options="tree"
                            v-model="editForm.shopId"
                            :show-all-levels="false"
                            :clearable="true"
                            :props="defaultProps"
                    ></el-cascader>
                </el-form-item>
                <el-form-item label="是否组长">
                    <el-radio-group v-model="editForm.groupFlag">
                        <el-radio-button label="0">否</el-radio-button>
                        <el-radio-button label="1">是</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="editForm.remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
<!--                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editFormSubmit('editForm')" >提交</el-button>-->
                <el-button type="primary" @click.native="editFormSubmit('editForm')" >保存</el-button>
                <el-button @click.native="editFormVisible = false">取消</el-button>
            </div>
        </el-dialog>

        <el-dialog title="详情" v-model="detailVisible" :visible.sync="detailVisible">
            <div>
                <el-row type="flex" justify="center">
                    <el-col :span="4"><div class="grid-content "><b>用户名：</b></div></el-col>
                    <el-col :span="6"><div class="grid-content ">{{accountDetail.trueName}}</div></el-col>
                </el-row>
                <el-row type="flex" justify="center">
                    <el-col :span="4"><div class="grid-content "><b>账号：</b></div></el-col>
                    <el-col :span="6"><div class="grid-content ">{{accountDetail.account}}</div></el-col>
                </el-row>
                <el-row type="flex" justify="center">
                    <el-col :span="4"><div class="grid-content "><b>电话：</b></div></el-col>
                    <el-col :span="6"><div class="grid-content ">{{accountDetail.phone}}</div></el-col>
                </el-row>
                <el-row type="flex" justify="center">
                    <el-col :span="4"><div class="grid-content "><b>角色：</b></div></el-col>
                    <el-col :span="6"><div class="grid-content ">{{accountDetail.role}}</div></el-col>
                </el-row>
                <el-row type="flex" justify="center">
                    <el-col :span="4"><div class="grid-content "><b>所属服务点&工厂：</b></div></el-col>
                    <el-col :span="6"><div class="grid-content ">{{accountDetail.shopName}}</div></el-col>
                </el-row>
                <el-row type="flex" justify="center">
                    <el-col :span="4"><div class="grid-content "><b>是否组长：</b></div></el-col>
                    <el-col :span="6"><div class="grid-content ">{{accountDetail.group}}</div></el-col>
                </el-row>
                <el-row type="flex" justify="center">
                    <el-col :span="4"><div class="grid-content "><b>备注：</b></div></el-col>
                    <el-col :span="6"><div class="grid-content ">{{accountDetail.remark}}</div></el-col>
                </el-row>
                <el-row type="flex" justify="center">
                    <el-button @click.native="detailVisible = false">关闭</el-button>
                </el-row>
            </div>
        </el-dialog>

    </section>

</template>

<style>
    .el-col {
        border-radius: 4px;
    }
    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }
</style>

<script>

    import {getShopAccountList,getAccountChaParameterList,getShopAccountDetail,shopAccountDelete,shopAccountEditStatus,getCascaderTree,shopAccountAdd,shopAccountEdit,shopAccountEditView,getQrImage} from '../../api/api';

    export default {
        data() {
            return {
                defaultProps: {
                    children: 'children',
                    label: 'name',
                    value: 'code'
                },
                detailList:[],
                outerVisible: false,
                innerVisible: false,
                listLoading: false,
                userId: "",
                total: 0,
                pageNum: 1, //当前页码
                pageSize: 10,//页数
                queryKey: "",
                userList: [],
                APPQRCodeUrl: "",
                WXQRCodeUrl: "",
                addFormVisible : false,
                editFormVisible : false,
                detailVisible : false,
                accountDetail: {},
                //表单数据
                addForm : {
                    account: "",
                    trueName: "",
                    password:"",
                    roleFlag: "",
                    shopId:[],
                    groupFlag:"",
                    remark:"",
                    phone:""
                },
                editForm : {
                    account: "",
                    trueName: "",
                    password:"",
                    passwordHide: "",
                    roleFlag: "",
                    shopId:[],
                    groupFlag:"",
                    remark:"",
                    phone:"",
                    id:""
                },
                tree: [],
                shopTreeCache: [],
                workCenterCache: [],
                formRules: {
                    account: [
                        { required: true, message: '请输入账号', trigger: 'blur' },
                        { min: 1, max: 40, message: '长度在 1 到 40 个字符', trigger: 'blur' }
                    ],
                    trueName: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 6, message: '长度必须大于等于 6 个字符', trigger: 'blur' },
                        { pattern:/^[0-9a-zA-Z]+$/, message: '格式为数字加字母' }
                    ],
                    shopId: [
                        { required: true, message: '请选择服务点或加工工厂', trigger: 'blur' },
                    ],
                    phone: [
                        { required: true, message: '请输入手机号', trigger: 'blur' },
                        { pattern:/^1[34578]\d{9}$/, message: '格式不正确' }
                    ]},
                serviceName: ""
            };
        },
        methods: {


            //切换页数
            handleCurrentChange(val) {
                this.pageNum = val;
                this.getList();
            },
            //处理分页条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.getList();
            },

            search() {
                this.pageNum = 1;
                this.getList();
            },

            getList() {
                let para = {
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    },
                    queryKey: this.queryKey
                };
                this.listLoading = true;
                getShopAccountList(para).then((data) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(data)) {
                            this.userList = data.data.list;
                            this.total = data.data.paginationInfo.total;
                        }
                    }, data => {
                        this.listLoading = false;
                    });
            },
            //警告提醒展示
            warn(row) {
                this.outerVisible = true;
                this.userId = row.id;
                this.shopName = row.shopName;
            },

            //获取展示二维码
            getShowQRcode() {
                let data = {
                    id: this.userId
                };
                this.APPQRCodeUrl = "";
                this.WXQRCodeUrl = "";
                //调用二维码
                getAccountChaParameterList(data).then((data) => {
                    if (this.GLOBAL.isResonseSuccess(data)) {
                        let list = data.data;
                        if (list != null && list.length > 0) {
                            for (let i = 0; i < list.length; i++) {
                                if (list[i].chaType === 0) {
                                    let qrValue = encodeURIComponent(process.env.APP_QRCode + list[i].chaParameter);
                                    let codeName = encodeURIComponent(this.shopName + "APP下载推广码.jpg");
                                    this.APPQRCodeUrl = process.env.API_ROOT + "/image/createQrcodeImage?size=2000&codeName=" + codeName + "&qrValue=" + qrValue;
                                    getQrImage(this.APPQRCodeUrl).then((data) => {
                                        this.innerVisible = true;
                                        this.outerVisible = false;
                                    });
                                } else if (list[i].chaType === 1) {
                                    let codeName = encodeURIComponent(this.shopName + "公众号推广码.jpg");
                                    this.WXQRCodeUrl = process.env.API_ROOT + "/image/createQrcodeImage?size=2000&codeName=" + codeName + "&qrValue=" + list[i].qrCode;
                                    getQrImage(this.WXQRCodeUrl).then((data) => {
                                        this.innerVisible = true;
                                        this.outerVisible = false;
                                    });
                                }
                            }
                            this.detailList=data.data;
                        } else {
                            this.$message({
                                message: '该员工未创建相关二维码信息，请转至员工推广渠道详细管理页面新增。',
                                type: 'error'
                            });
                            this.outerVisible = false;
                        }
                    }
                });

            },

            download(imgURL, type) {
                if (type === 0) {
                    this.APPQRCodeUrl = imgURL + "&isOpen=1";
                    window.location.href = this.APPQRCodeUrl;
                } else {
                    this.WXQRCodeUrl = imgURL + "&isOpen=1";
                    window.location.href = this.WXQRCodeUrl;
                }
            },
            //获取该门店订单列表
            getOrderListByShopId() {
                alert("该功能尚未启,请前往旧版后台操作!");
            },
            open(msg) {
                this.$alert(msg, {
                    confirmButtonText: '确定',
                });
            },

            detail(row) {
                let para = {
                    id: row.id
                };
                getShopAccountDetail(para).then((res) => {
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.accountDetail = res.data;
                        this.accountDetail.group = this.accountDetail.group === 1 ? "是" : "否";
                        if (this.accountDetail.role === 1) {
                            this.accountDetail.role = "配送员";
                        } else if (this.accountDetail.role === 2) {
                            this.accountDetail.role = "驻点员";
                        } else if (this.accountDetail.role === 3) {
                            this.accountDetail.role = "司机";
                        } else if (this.accountDetail.role === 4) {
                            this.accountDetail.role = "洗护中心";
                        } else {
                            this.accountDetail.role = "无";
                        }
                        this.detailVisible = true;
                    } else {
                        alert("操作失败");
                    }
                } , (res) => { } ).catch(() => {

                });
            },
            edit(row) {
                this.clearTreeCache();
                let para = {
                    id: row.id
                };
                shopAccountEditView(para).then((res) => {
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.editForm.account = res.data.account;
                        this.editForm.trueName = res.data.trueName;
                        this.editForm.password = res.data.password;
                        this.editForm.passwordHide = res.data.password;
                        this.editForm.roleFlag = res.data.roleFlag;
                        this.editForm.shopId = res.data.shopId;
                        this.editForm.groupFlag = res.data.groupFlag;
                        this.editForm.remark = res.data.remark;
                        this.editForm.phone = res.data.phone;
                        this.editForm.id = res.data.id;
                        this.tree = res.data.tree;
                        this.editFormVisible = true;
                        this.serviceName = res.data.roleFlag === 4 || res.data.roleFlag === 3 ? "加工厂" : '服务点';
                    } else {
                        alert("操作失败");
                    }
                } , (res) => { } ).catch(() => {

                });
            },
            changeStatus(row) {
                let status = row.disableFlag === 0 ? 1 : 0;
                let para = {
                    id: row.id,
                    status: status
                };
                shopAccountEditStatus(para).then((res) => {
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.getList()
                    } else {
                        alert("操作失败");
                    }
                } , (res) => { } ).catch(() => {

                });
            },
            remove(row) {
                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let para = {
                        id: row.id
                    };
                    shopAccountDelete(para).then((data) => {
                        if (this.GLOBAL.isResonseSuccess(data)) {
                            this.getList();
                        } else {
                            alert("操作失败");
                        }
                    } , (data) => {}).catch(() => {});
                }).catch(() => {
                });
            },

            addFormSubmit(ve){
                this.$refs[ve].validate((valid) => {
                    if (valid) {
                        shopAccountAdd(this.addForm).then((data) => {
                            if (this.GLOBAL.isResonseSuccess(data)) {
                                this.addFormVisible = false;
                                this.getList();
                            } else {
                                this.open(data.data);
                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            editFormSubmit(ve){
                this.$refs[ve].validate((valid) => {
                    if (valid) {
                        shopAccountEdit(this.editForm).then((data) => {
                            if (this.GLOBAL.isResonseSuccess(data)) {
                                this.editFormVisible = false;
                                this.getList();
                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            addFormBtn() {
                this.addFormVisible = true;
                this.addForm = {
                    account: "",
                    trueName: "",
                    password: "",
                    roleFlag: 0,
                    shopId: [],
                    groupFlag: 0,
                    remark: "",
                    phone: ""
                };
                this.serviceName = "服务点";
                this.clearTreeCache();
                this.getCascaderTreeList(1);
            },

            getCascaderTreeList(type) {
                this.clearTreeCache();
                let para = {
                    type: type
                };
                getCascaderTree(para).then((data) => {
                        if (this.GLOBAL.isResonseSuccess(data)) {
                            this.tree = data.data;
                            if (type === 1) {
                                this.shopTreeCache = data.data;
                            } else if (type === 2) {
                                this.workCenterCache = data.data;
                            }
                        }
                    }
                    , data => {
                    }
                );
            },
            radioChange(val) {
                this.addForm.shopId = [];
                this.editForm.shopId = [];
                let type = (parseInt(val) === 4 || parseInt(val) === 3) ? 2 : 1;
                this.serviceName = (parseInt(val) === 4 || parseInt(val) === 3) ? '加工厂' : '服务点';
                this.getCascaderTreeList(type);
            },
            clearTreeCache() {
                this.shopTreeCache = [];
                this.workCenterCache = [];
            }
        },
        mounted() {
            this.getList();
        }
    }

</script>
