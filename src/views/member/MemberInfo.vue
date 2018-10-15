<template>
    <section>
        <!-- 列表筛选工具条 -->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form align="right" :inline="true" class="demo-form-inline">
                <span>业务类型：</span>
                <el-form-item>
                    <template>
                        <select-group :num ="number" :select="isSelect" @getresult = "getResultNumber"></select-group>
                    </template>
                </el-form-item>
                <span> 昵称或手机号：</span>
                <el-input size="medium" v-model="filterParams.userNameOrPhone" placeholder="输入昵称或手机号"
                          style="width:250px;" clearable></el-input>
                <span> 注册时间：</span>
                <el-date-picker
                        v-model="filterParams.registerTime"
                        type="daterange"
                        :picker-options="pickerOptions"
                        start-placeholder="注册开始日期"
                        end-placeholder="注册结束日期"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :default-time="['00:00:00', '23:59:59']">
                </el-date-picker>
                <span> 会员状态：</span>
                <el-form-item>
                    <el-select v-model="filterParams.statusFlag">
                        <el-option v-for="item in statusFilterConst" :key="item.key" :label="item.value" :value="item.key"></el-option>
                    </el-select>
                </el-form-item>
                <el-button type="primary" v-on:click="searchData()" :loading="listLoading">查询</el-button>

                <el-form-item>
                    <el-button v-if="isAuth('scloud:member:export')"  type="primary" @click="exportMemberInfo">导出</el-button>
                    <el-tooltip class="item" effect="dark" content="提示:导出结果最多只能有两万条数据" placement="top-start">
                        <span class="el-icon-question" style="position: relative;left:1px;bottom:12px;"></span>
                    </el-tooltip>
                </el-form-item>
            </el-form>
        </el-col>

        <!-- 列表展示 -->
        <el-table :data="memberList" stripe style="width: 100%">
            <el-table-column sortable prop="id" label="会员编号" width="150px" show-overflow-tooltip></el-table-column>
            <el-table-column prop="headPhoto" width="160" label="图片">
                <template slot-scope="scope">
                    <img :src="scope.row.headPhoto" width="60">
                </template>
            </el-table-column>
            <el-table-column prop="businessTypeCode" label="业务类型" :formatter="parseBusinessType"
                             show-overflow-tooltip></el-table-column>
            <el-table-column prop="userName" label="昵称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="phone" label="手机号码" show-overflow-tooltip></el-table-column>
            <el-table-column prop="rankName" label="会员等级" show-overflow-tooltip></el-table-column>
            <!--<el-table-column prop="wealthIntegral" label="当前积分" show-overflow-tooltip></el-table-column>
            <el-table-column prop="rankIntegral" label="累计积分" show-overflow-tooltip></el-table-column>-->
            <el-table-column prop="cityName" label="注册城市" show-overflow-tooltip></el-table-column>
            <el-table-column sortable prop="createTime" label="注册时间" width="155px" show-overflow-tooltip
                             :formatter="formatDate"></el-table-column>

            <el-table-column fixed="right" label="操作" width="250" class-name="small-padding fixed-width" align="left">
                <template slot-scope="scope">
                    <el-button v-if="isAuth('scloud:member:update')" @click="editDialog(scope.$index,scope.row)" type="primary" size="mini">编辑</el-button>
                    <el-button v-if="isAuth('scloud:member:view')" @click="viewDetail(scope.row)" type="primary" size="mini">查看</el-button>
                    <el-button v-if="isAuth('scloud:member:refund:view')" @click="refundDetail(scope.row)" type="primary" size="mini">退款</el-button>
                </template>
            </el-table-column>

        </el-table>
        <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageNum"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total" style="float: right;">
        </el-pagination>

        <!-- 查看详情 -->
        <el-dialog title="查看会员信息" :visible.sync="viewDialogVisible">
            <div id="box" style="height:540px;overflow-x:visible">
                <p>
                    <span>头像:</span>
                    <img :src="info.headPhoto" width="160">
                </p>
                <p><span>用户名:</span>{{ info.userName }}</p>
                <p><span>手机:</span>{{ info.phone }}</p>
                <p><span>等级积分:</span>{{ info.rankIntegral }}</p>
                <p><span>财富积分:</span>{{ info.wealthIntegral }}</p>
                <p><span>会员等级:</span>{{ info.rankName }}</p>
                <p><span>折扣:</span>{{ info.discount }}</p>
                <p><span>森特币数量:</span>{{ info.sinterCurrency }}</p>
                <p><span>创建时间:</span>{{ createTimeShow }}</p>
                <p><span>注册城市:</span>{{ info.cityName }}</p>
                <p><span>注册经度:</span>{{ info.regLongitude}}</p>
                <p><span>注册纬度:</span>{{ info.regLatitude}}</p>
                <div id="baiduMap" style="height: 400px;"></div>
            </div>
        </el-dialog>

        <!-- 编辑 -->
        <el-dialog title="会员编辑" :visible.sync="editDialogVisible" width="40%">
            <el-form :model="editForm" :rules="editRules" ref="editForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="用户名" prop="userName">
                    <el-input v-model="editForm.userName" style="width: 50%"></el-input>
                </el-form-item>
                <el-form-item label="头像" prop="headPhoto" v-if="editForm.headPhoto">
                    <img :src="editForm.headPhoto" width="25%">
                </el-form-item>
                <el-form-item label="手机" prop="phone">
                    <el-input disabled v-model="editForm.phone" style="width: 50%"></el-input>
                </el-form-item>
                <el-form-item label="财富积分" prop="wealthIntegral">
                    <el-input v-model="editForm.wealthIntegral" style="width: 50%"></el-input>
                </el-form-item>
                <el-form-item label="会员折扣" prop="discount">
                    <el-input v-model="editForm.discount" style="width: 50%"></el-input>
                </el-form-item>
                <el-form-item label="会员等级">
                    <span style="font-weight: bold;">{{editForm.rankName}}</span>
                </el-form-item>
                <el-form-item label="森特币数量" prop="sinterCurrency">
                    <template slot-scope="scope">
                        <el-input disabled v-model="editForm.sinterCurrency" style="width:15%"></el-input>
                        <span class="incr" @click="sinterCurrencyDialog('incr')">+</span>
                        <span class="decr" @click="sinterCurrencyDialog('decr')">-</span>
                    </template>
                </el-form-item>
                <el-form-item label="状态" prop="statusFlag">
                    <el-select v-model="editForm.statusFlag" style="width:15%">
                        <el-option v-for="item in statusTypeConst" :key="item.key" :label="item.value" :value="item.key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="测试账号" prop="testDataFlag">
                    <el-select v-model="editForm.testDataFlag" style="width:15%">
                        <el-option v-for="item in testTypeConst" :key="item.key" :label="item.value" :value="item.key"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm('editForm')" v-loading="submitLoading">保存</el-button>
                <el-button @click="editDialogVisible=false">取消</el-button>
            </div>
        </el-dialog>

        <!-- 修改森特币弹出框 -->
        <el-dialog :title="title" :visible.sync="updateSinterCurrencyVisible" width="24%">
            <el-form label-width="100px" class="demo-ruleForm">
                <el-form-item label="森特币数量">
                    <el-input v-model="sinterCurrencyNum" style="width: 60%;"></el-input>
                </el-form-item>

                <el-form-item label="备注">
                    <el-input type="textarea" v-model="remark" style="width: 60%;"></el-input>
                </el-form-item>


            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitSinterCurrency()"
                           v-loading="submitSinterCurrencyLoading">提交
                </el-button>
                <el-button @click="updateSinterCurrencyVisible=false">取消</el-button>
            </div>

        </el-dialog>

        <el-dialog title="退款详情" :visible.sync="refundVisible">
            <el-row>
                <el-col>
                    <h3>
                        <span>手机: </span>{{refundInfo.phone}}
                        <span>&nbsp;</span>
                        <span>森特币数量:</span>{{ memberSinterCount.sinterCurrencyCount }}
                    </h3>

                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <h4>收入</h4>
                </el-col>
                <el-col :span="20">
                    <el-table :data="memberSinterInfo" border stripe height="250"
                              :summary-method = "memberSinterInfoCount"
                              show-summary>
                        <el-table-column prop="changeNun" label="收入金额" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="changeDescribe" label="收入类型" show-overflow-tooltip></el-table-column>
                        <el-table-column sortable prop="createTime" label="创建时间" width="155px" show-overflow-tooltip
                                         :formatter="formatDate"></el-table-column>
                    </el-table>
                    <el-pagination
                            background
                            @size-change="rechargeSizeChange"
                            @current-change="rechargeCurrentChange"
                            :current-page="memberSinterInfoPageNum"
                            :page-size="memberSinterInfoPageSize"
                            layout="total, prev, pager, next"
                            :total="memberSinterInfoTotal" style="float: right;">
                    </el-pagination>
                </el-col>
            </el-row>

            <el-row>
                <el-col>
                    <h4>支出</h4>
                </el-col>
                <el-col :span="20">
                    <el-table :data="memberSinterExpend" border stripe height="250"
                              :summary-method = "memberSinterExpendCount"
                              show-summary>
                        <el-table-column prop="changeNun" label="支出金额" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="changeDescribe" label="支出类型" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="orderId" label="订单号" show-overflow-tooltip></el-table-column>
                        <el-table-column sortable prop="createTime" label="创建时间" width="155px" show-overflow-tooltip
                                         :formatter="formatDate"></el-table-column>
                    </el-table>
                    <el-pagination
                            background
                            @size-change="refundSizeChange"
                            @current-change="refundCurrentChange"
                            :current-page="memberSinterExpendPageNum"
                            :page-size="memberSinterExpendPageSize"
                            layout="total, prev, pager, next"
                            :total="memberSinterExpendTotal" style="float: right;">
                    </el-pagination>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <h4>
                        <span>余额: </span>{{this.memberSinterCount.currencyIncreaseAmount - this.memberSinterCount.currencyExpendAmount}}
                    </h4>
                </el-col>
                <el-col>
                    <el-form>
                        <el-form-item label="建议退款">
                            <el-input v-model="useCurrency" style="width: 30%;" disabled="true"></el-input> <span v-if="memberSinterCount.sinterCharge === 0" style="color: red">(备注: 当前用户未充值)</span>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </el-dialog>
    </section>
</template>

<script>
    import {queryMemberInfos, modifySinterCurrency, modifyMemberInfo,getIntegralAndSinter,exportMember} from '../../api/api';
    import {getMemberSinterCount, getMemberSinterInfo, getMemberSinterExpend} from '../../api/api';
    import moment from 'moment';
    import defaultUserImg from '@/assets/user.png';
    import BMap from 'BMap';
    import selectGroup from '@/components/selectGroup';

    export default {
        components:{
            selectGroup
        },
        data() {
            //折扣 validator 设置
            var validate = (rule, value, callback) => {
                if (value > 1 || value <= 0) {
                    callback(new Error('折扣设置错误，数值应在0-1之间'));
                } else {
                    callback();
                }
            };
            return {
                statusFilterConst,      // 会员状态筛选下拉值
                statusTypeConst,        // 会员状态类型下拉值
                testTypeConst,        // 是否为测试类型下拉值
                memberList: [],         // 表格数据--会员列表
                listLoading: false,     // 表格展示Loading
                submitSinterCurrencyLoading: false,  // 森特币修改Loading
                submitLoading: false,   // 会员编辑Loading
                total: 0,               // 总记录数
                pageNum: 1,             // 当前页码
                pageSize: 10,           // 分页size
                filterParams: {         // 筛选查询的参数
                    userNameOrPhone: "",
                    registerTime: "",
                    statusFlag: -1
                },
                refundVisible: false,  //退款
                viewDialogVisible: false,   // 查看详情窗口
                editDialogVisible: false,   // 编辑详情窗口
                updateSinterCurrencyVisible: false, // 修改森特币窗口
                info: {
                    rankIntegral: 0,
                    wealthIntegral: 0,
                    sinterCurrency: 0
                },                    // 查看会员详情的数据
                editForm: {
                    rankIntegral: 0,
                    wealthIntegral: 0,
                    sinterCurrency: 0
                },                 // 编辑会员详情的数据
                createTimeShow: "",         // 详情页中的创建时间

                sinterCurrencyFlag: 1,      //增加或修改森特币标志(0减少,1增加)
                sinterCurrencyNum: "",      //增加或减少森特币的数量
                index: 0,
                title: "",                  // 森特币修改弹出框标题
                remark: "",                 // 修改森特币的备注
                useCurrency:0,
                number: -1,                  // 后台传过来的十进制数据
                isSelect: true,             // 是否可选
                selectedBusinessCode: -1,   // 筛选的业务类型编码

                refundInfo: {},          // 查看会员退款详情
                memberSinterCount:{},    //森特币
                memberSinterInfo:[],    //森特币收入总额
                memberSinterInfoTotal: 0,               // 总记录数
                memberSinterInfoPageNum: 1,             // 当前页码
                memberSinterInfoPageSize: 10,           // 分页size
                memberSinterExpend:[],    //森特币支出总额
                memberSinterExpendTotal: 0,               // 总记录数
                memberSinterExpendPageNum: 1,             // 当前页码
                memberSinterExpendPageSize: 10,           // 分页size

                editRules: {                // 前端校验
                    /* userName: [
                         {required: true, message: '请输入用户名', trigger: 'blur'},
                         {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
                     ],*/
                    discount: [
                        {required: false, validator: validate, trigger: 'blur'},
                    ]
                },
                //日期控件
                pickerOptions: {
                    shortcuts: [
                        {
                            text: '最近三天',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
                                picker.$emit('pick', [start, end]);
                            }
                        },
                        {
                            text: '最近一周',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                                picker.$emit('pick', [start, end]);
                            }
                        },
                        {
                            text: '最近一个月',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                                picker.$emit('pick', [start, end]);
                            }
                        }]
                },
            }
        },
        methods: {
            //导出
            exportMemberInfo(){
                var registerBeginTime = null;
                var registerEndTime = null;
                var registerTime = this.filterParams.registerTime;
                if(registerTime==null || registerTime==''){
                    this.open('请选择时间段!');//弹出框提示
                    return;
                }
                registerBeginTime = registerTime[0];
                registerEndTime = registerTime[1];
                var userNameOrPhoneParam = String.trim(this.filterParams.userNameOrPhone);

                var d = new Date(registerEndTime).getTime()-new Date(registerBeginTime).getTime();
                if(d>31*24*60*60*1000){
                    this.open('日期范围不能超过一个月');//弹出框提示
                    return;
                }

                var params="";
                if(this.selectedBusinessCode){
                    params+="&businessTypeCode="+this.selectedBusinessCode;
                }
                if(userNameOrPhoneParam){
                    params+="&userNameOrPhone="+userNameOrPhoneParam;
                }
                if(registerBeginTime){
                    params+="&registerBeginTime="+registerBeginTime;
                }
                if(registerEndTime){
                    params+="&registerEndTime="+registerEndTime;
                }
                if(this.filterParams.statusFlag>=0){
                    params+="&statusFlag="+this.filterParams.statusFlag;
                }
                location.href = exportMember(params);
            },

            // 查询会员列表
            queryMemberList() {
                // 创建时间
                var registerBeginTime = null;
                var registerEndTime = null;
                var registerTime = this.filterParams.registerTime;
                if (registerTime != null) {
                    registerBeginTime = registerTime[0];
                    registerEndTime = registerTime[1];
                }
                var userNameOrPhoneParam = String.trim(this.filterParams.userNameOrPhone);

                let param = {
                    businessTypeCode: this.selectedBusinessCode,
                    userNameOrPhone: userNameOrPhoneParam,
                    registerBeginTime: registerBeginTime,
                    registerEndTime: registerEndTime,
                    statusFlag: this.filterParams.statusFlag,
                    orderField: 'create_time',
                    sortType: 'desc',
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    }
                };
                this.listLoading = true;
                queryMemberInfos(param).then(
                    res => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(res)) {    // 请求成功
                            var ipUrl = process.env.IMG_URL;
                            var defaultImg = defaultUserImg;
                            var tempList = res.data.list;
                            // 拼接图片路径，没有图片显示默认图片
                            for (var i = 0; i < tempList.length; i++) {
                                if (tempList[i].headPhoto == null || tempList[i].headPhoto == "") {
                                    tempList[i].headPhoto = defaultImg;
                                } else {
                                    tempList[i].headPhoto = ipUrl + tempList[i].headPhoto;
                                }
                            }
                            this.total = res.data.paginationInfo.total;
                            this.memberList = tempList;
                        }
                    }).catch(err => {
                    this.listLoading = false;
                    var errMsg = err.response.data.message;
                    this.$message({showClose: true, message: errMsg, type: 'error'});
                });
            },

            // 点击查询按钮
            searchData() {
                this.pageNum = 1;
                this.queryMemberList();
            },

            //弹出框提示
            open(msg) {
                this.$alert(msg, {
                    confirmButtonText: '确定',
                });
            },

            // 查看会员详情
            viewDetail(row){
                this.viewDialogVisible = true;
                // 通过会员ID查询财富信息
                let param = {
                    memberId: row.id,                     // 会员编号
                    businessType: 1   // 业务类型
                };
                getIntegralAndSinter(param).then(
                    res => {
                        this.info.rankIntegral = res.data.rankIntegral;
                        this.info.wealthIntegral = res.data.wealthIntegral;
                        this.info.sinterCurrency = res.data.sinterCurrency;
                    }).catch(err => {
                    var errMsg = err.response.data.message;
                    this.$message({showClose: true, message: errMsg, type: 'error'});
                });
                this.info = row;
                this.createTimeShow = moment(row.createTime).format('YYYY-MM-DD HH:mm:ss');
                setTimeout(() => {
                    this.showMap();
                }, 500);
            },


            memberSinterInfoCount(param) {
                const sums = [];
                sums.push('总收入');
                sums.push('');
                sums.push(this.memberSinterCount.currencyIncreaseAmount);
                return sums;
            },

            memberSinterExpendCount(param) {
                const sums = [];
                sums.push('总支出');
                sums.push('');
                sums.push(this.memberSinterCount.currencyExpendAmount);
                return sums;
            },

            //退款详情
            // 查看会员详情
            refundDetail(row){
                this.refundInfo = row;
                //获取总额
                this.getMemberSinterCount();
                //获取收入详情
                this.getMemberSinterInfo();
                //获取支出详情
                this.getMemberSinterExpend();
                this.refundVisible = true;
            },

            getMemberSinterCount() {
                let params = {
                    memberId: this.refundInfo.id,
                    businessType: this.refundInfo.businessTypeCode,
                };
                getMemberSinterCount(params).then(res => {
                    this.listLoading = false;
                    if (this.GLOBAL.isResonseSuccess(res)) {    // 请求成功
                        this.memberSinterCount = res.data;
                        this.useCurrency = res.data.refundSinterCurrency;
                    }
                }).catch(err => {
                    this.listLoading = false;
                    var errMsg = err.response.data.message;
                    this.$message({showClose: true, message: errMsg, type: 'error'});
                });
            },

            getMemberSinterInfo() {
                let params = {
                    memberId: this.refundInfo.id,
                    businessType: this.refundInfo.businessTypeCode,
                    pageInfo: {
                        pageNum: this.memberSinterInfoPageNum,
                        pageSize: this.memberSinterInfoPageSize,
                    }
                };
                getMemberSinterInfo(params).then(res => {
                    this.listLoading = false;
                    if (this.GLOBAL.isResonseSuccess(res)) {    // 请求成功
                        this.memberSinterInfo = res.data.list;
                        this.memberSinterInfoTotal = res.data.paginationInfo.total;
                    }
                }).catch(err => {
                    this.listLoading = false;
                    var errMsg = err.response.data.message;
                    this.$message({showClose: true, message: errMsg, type: 'error'});
                });
            },

            getMemberSinterExpend(){
                let params = {
                    memberId: this.refundInfo.id,
                    businessType: this.refundInfo.businessTypeCode,
                    pageInfo: {
                        pageNum: this.memberSinterExpendPageNum,
                        pageSize: this.memberSinterExpendPageSize,
                    }
                };
                getMemberSinterExpend(params).then(res => {
                    this.listLoading = false;
                    if (this.GLOBAL.isResonseSuccess(res)) {    // 请求成功
                        this.memberSinterExpend = res.data.list;
                        this.memberSinterExpendTotal = res.data.paginationInfo.total;
                    }
                }).catch(err => {
                    this.listLoading = false;
                    var errMsg = err.response.data.message;
                    this.$message({showClose: true, message: errMsg, type: 'error'});
                });
            },


            showMap(){
                var lon = this.info.regLongitude;
                var lat = this.info.regLatitude;
                if (lon > 0 && lat > 0) {
                    //控制地图高度
                    document.getElementById("baiduMap").style.height = '400px';
                    var map = new BMap.Map("baiduMap");
                    var point = new BMap.Point(lon, lat);
                    map.centerAndZoom(point, 15);
                    var marker = new BMap.Marker(point);  // 创建标注
                    map.addOverlay(marker);               // 将标注添加到地图中
                    map.enableScrollWheelZoom();                //启用滚轮放大缩小
                    map.panBy(305, 165);
                } else {
                    document.getElementById("allmap").innerHTML = '';
                    document.getElementById("allmap").style = '';
                }
            },

            // 编辑弹出框
            editDialog(index, row){
                this.editDialogVisible = true;
                // 通过会员ID查询财富信息
                let param = {
                    memberId: row.id,                     // 会员编号
                    businessType: 1   // 业务类型
                };
                getIntegralAndSinter(param).then(
                    res => {
                        this.editForm.rankIntegral = res.data.rankIntegral;
                        this.editForm.wealthIntegral = res.data.wealthIntegral;
                        this.editForm.sinterCurrency = res.data.sinterCurrency;
                    }).catch(err => {
                    var errMsg = err.response.data.message;
                    this.$message({showClose: true, message: errMsg, type: 'error'});
                });
                this.editForm = row;
                this.index = index;
            },

            // 修改森特币弹出框
            sinterCurrencyDialog(name){
                this.remark = "";
                this.sinterCurrencyNum = "";
                this.title = name == 'incr' ? '增加森特币' : '减少森特币';
                this.sinterCurrencyFlag = name == 'incr' ? 1 : 0;
                this.updateSinterCurrencyVisible = true;
            },

            // 提交增加或减少森特币操作
            submitSinterCurrency(){
                // 森特币操作(增加或减少)
                var optType = this.sinterCurrencyFlag === 0 ? 7 : 8;
                if(optType === 7){
                    if(this.sinterCurrencyNum > this.editForm.sinterCurrency){
                        this.$message({showClose: true, message: '减少的数量不能大于现有的数量,请重新输入！', type: 'error'});
                        this.sinterCurrencyNum = '';
                        return;
                    }
                }

                let param = {
                    memberId: this.editForm.id,                     // 会员编号
                    businessType: 1,   // 业务类型
                    useType: optType,                               // 修改类型:7后台减少森特币、8后台增加森特币
                    useCurrency: this.sinterCurrencyNum,            // 变化的森特币数量
                    remark: this.remark
                };
                this.submitSinterCurrencyLoading = true;
                modifySinterCurrency(param).then(
                    res => {
                        this.submitSinterCurrencyLoading = false;
                        if (this.GLOBAL.isResonseSuccess(res)) {    // 请求成功
                            this.$message({showClose: true, message: '操作成功!', type: 'success'});
                            this.updateSinterCurrencyVisible = false;
                            this.queryMemberList();
                            this.editForm.sinterCurrency = res.data;     // 编辑窗口显示森特币更新后的数量
                        } else {
                            this.$message({showClose: true, message: res.message, type: 'error'});
                        }
                    }).catch(err => {
                    this.submitSinterCurrencyLoading = false;
                    var errMsg = err.response.data.message;
                    this.$message({showClose: true, message: errMsg, type: 'error'});
                });
            },

            // 点击更新会员信息
            submitForm(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.update();
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            // 更新会员信息
            update(){
                let param = {
                    memberId: this.editForm.id,                         // 会员编号
                    username: this.editForm.userName,                   // 会员昵称
                    wealthIntegral: this.editForm.wealthIntegral,       //  财富积分
                    discount: this.editForm.discount,                   // 折扣
                    statusFlag: this.editForm.statusFlag,               // 状态
                    testDataFlag: this.editForm.testDataFlag,               // 是否为测试账号
                    businessTypeCode: 1                                 // 业务类型,目前只有洗护有财富积分
                };
                modifyMemberInfo(param).then(
                    res => {
                        this.submitLoading = false;
                        if (this.GLOBAL.isResonseSuccess(res)) {    // 请求成功
                            this.$message({showClose: true, message: '编辑成功!', type: 'success'});
                            this.editDialogVisible = false;
                            this.queryMemberList();
                        } else {
                            this.$message({showClose: true, message: res.message, type: 'error'});
                        }
                    }).catch(err => {
                    this.submitLoading = false;
                    var errMsg = err.response.data.message;
                    this.$message({showClose: true, message: errMsg, type: 'error'});
                });
            },


            // 切换页数
            handleCurrentChange(val) {
                this.pageNum = val;
                this.queryMemberList();
            },
            // 处理分页条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.queryMemberList();
            },

            //收入分页
            rechargeCurrentChange(val) {
                this.memberSinterInfoPageNum = val;
                this.getMemberSinterInfo();
            },

            rechargeSizeChange(val) {
                this.memberSinterInfoPageSize = val;
                this.getMemberSinterInfo();
            },

            //支出分页
            refundCurrentChange(val) {
                this.memberSinterExpendPageNum = val;
                this.getMemberSinterExpend()
            },
            refundSizeChange(val) {
                this.memberSinterExpendPageSize = val;
                this.getMemberSinterExpend()
            },

            // 获取业务类型下拉值
            getResultNumber(result){
                this.selectedBusinessCode = result;
            },

            // 时间格式化:YYYY-MM-DD HH:mm:ss
            formatDate(row, column, cellValue) {
                if (cellValue === null || cellValue === undefined || cellValue === (-2209017600000)) {
                    return '';
                }
                return moment(cellValue).format('YYYY-MM-DD HH:mm:ss');
            },

            // 手机号码格式化
            formatPhone(row, column, cellValue) {
                if (cellValue === null || cellValue === undefined) {
                    return '';
                }
                return cellValue.substr(0, 3) + '****' + cellValue.substr(7);
            },

            // 解析会员业务类型
            parseBusinessType(row, column, cellValue) {
                switch (cellValue) {
                    case 1:
                        return '森特尔洗护';
                        break;
                    case 2:
                        return '名品易手';
                        break;
                    case 4:
                        return '态奢';
                        break;
                    default:
                        return '未知会员业务类型';
                }
            }
        },
        mounted() {
            this.queryMemberList();
        }
    }

    // 会员状态类型下拉选项
    const statusTypeConst = [
        { key: 0, value: '停用' },
        { key: 1, value: '启用' }
    ];

    // 会员状态类型下拉选项
    const testTypeConst = [
        { key: 0, value: '否' },
        { key: 1, value: '是' }
    ];

    // 会员状态筛选下拉选项
    const statusFilterConst = [
        { key: -1, value: '全部' },
        { key: 0, value: '停用' },
        { key: 1, value: '启用' }
    ];

</script>
<style>
    #box {
        text-align: left;
    }

    #box span {
        font-weight: bold;
        width: 100px;
        text-align: right;
        display: inline-block;
        padding-right: 8px;
    }

    .incr {
        font-size: 18px;
        cursor: pointer;
        position: relative;
        bottom: 8px;
        right: -2px;
    }

    .decr {
        font-size: 18px;
        cursor: pointer;
        position: relative;
        right: 9px;
        top: 10px;

    }
</style>