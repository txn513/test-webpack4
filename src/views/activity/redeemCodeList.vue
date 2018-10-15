<template>
    <section>
        <!--工具条-->
            <el-form ref="searchData"  :model="searchData" label-position="left"  align="left" :inline="true"  class="demo-form-inline search-form">
                <el-form-item label="兑换码" prop="couponCode">
                    <el-input v-model="searchData.redeemCode" placeholder="请输入兑换码" clearable></el-input>
                </el-form-item>
                <el-form-item label="券类型" >
                    <el-select v-model="couponType" placeholder="请选择券类型">
                        <el-option
                                v-for="item in couponTypes"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="券规则" >
                    <el-select v-model="searchData.couponType" placeholder="请选择券类型">
                        <el-option
                                v-for="item in coupon"
                                :key="item.id"
                                :label="item.couponContent"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="兑换状态" >
                    <el-select v-model="searchData.redeemCodeStatus" placeholder="请选择兑换状态">
                        <el-option v-for="item in redeemCodeStatusList" :key="item.id"    :label="item.lable" :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="使用城市" >
                    <el-select v-model="searchData.cityName" placeholder="请选择使用城市">
                        <el-option v-for="item in cityNameList" :key="item"    :label="item" :value="item" />
                    </el-select>
                </el-form-item>

                <el-form-item label="兑换渠道" >
                    <el-select v-model="searchData.channelType" placeholder="请选择领取渠道">
                        <el-option v-for="item in channelType" :key="item.id"    :label="item.showName" :value="item.id" />
                    </el-select>
                </el-form-item>

                <el-form-item label="兑换日期" >
                    <el-date-picker
                            v-model="getDate"
                            type="daterange"
                            :picker-options="pickerOptions"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            align="right">
                    </el-date-picker>
                </el-form-item>



                <el-form-item label="所属活动" >
                    <el-select v-model="searchData.activityId" placeholder="所属活动">
                        <el-option v-for="item in activityList" :key="item.activityId"    :label="item.activityName" :value="item.activityId" />
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button   type="primary" @click="search">查询</el-button>
                </el-form-item>

                <el-form-item>
                    <el-button   type="primary" @click="resetForm">重置</el-button>
                </el-form-item>
                <el-form-item>
                    <el-dropdown @command="handleCommandExport" v-if="isAuth('scloud:redeemCodeCount:export')">
                        <el-button type="primary">
                            导出兑换码<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="1">导出选中</el-dropdown-item>
                            <el-dropdown-item command="2">导出条件</el-dropdown-item>
                            <el-dropdown-item command="3">导出所有</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-form-item>

            </el-form>

        <!--列表-->
        <el-table :data="list"  highlight-current-row v-loading="listLoading"  style="width: 100%;" @selection-change="selsChange">
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column  type="index" />
            <el-table-column prop="redeemCodeName" label="兑换码名称"   sortable  show-overflow-tooltip></el-table-column>
            <el-table-column prop="redeemCode" label="兑换码"   sortable  show-overflow-tooltip></el-table-column>
            <el-table-column prop="redeemCodeStatus" label="状态"  :formatter="formatStatus" sortable      show-overflow-tooltip></el-table-column>
            <el-table-column prop="couponSubtractCount" label="含现金券"   sortable      show-overflow-tooltip></el-table-column>
            <el-table-column prop="couponSubtract" label="现金券金额"   sortable      show-overflow-tooltip></el-table-column>

            <!--<el-table-column prop="couponDiscountCount" label="含折扣券"   sortable      show-overflow-tooltip></el-table-column>-->
            <!--<el-table-column prop="couponDiscount" label="折扣百分比"   sortable      show-overflow-tooltip></el-table-column>-->
            <!--<el-table-column prop="couponDecreaseCount" label="含满减券"   sortable      show-overflow-tooltip></el-table-column>-->
            <!--<el-table-column prop="couponDecrease" label="满减额"   sortable      show-overflow-tooltip></el-table-column>-->

            <el-table-column prop="cityName" label="使用城市"   sortable    show-overflow-tooltip></el-table-column>
            <el-table-column prop="channelName" label="兑换渠道"  :formatter="formatChannel" sortable     show-overflow-tooltip></el-table-column>
            <el-table-column prop="validityTime" label="兑换日期"  :formatter="formatDate" sortable    show-overflow-tooltip   ></el-table-column>
            <!--<el-table-column prop="redeemCodeTime" label="有效期"   sortable    show-overflow-tooltip   ></el-table-column>-->
            <el-table-column prop="activityName" label="所属活动"   sortable    show-overflow-tooltip   ></el-table-column>

        </el-table>
        <!--工具条-->
        <el-col :span="24" style="margin-top: 10px">
            <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync = "pageNum"

                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total" style="float: right">
            </el-pagination>
        </el-col>

    </section>
</template>

<script>
    import {getRedeemCodeCountList,getActivityInfo,getCouponType,getCityNameList,getExportCount } from '@/api/api';
    export default {
        data() {
            return {
                list: [],
                pageNum: 1, //当前页码
                pageSize: 10,//页数
                listLoading: false,
                total: 0,
                getDate:[],
                useDate:[],
                rebackDate:[],
                activityList:[],
                couponType:null,
                couponTypes:[
                    {
                        id: 1,
                        name: '现金券'
                    }
                ],
                coupon:[],//券面值
                searchData:{
                    redeemCode:null,
                    cityName:null,
                    channelType:null,
                    validityTime:null,
                    redeemCodeStatus:null,
                    activityId:null,
                    couponType:null,
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    },

                },
                cityNameList:[],
                redeemCodeStatusList:[
                    {id:0,lable:'未兑换'},
                    {id:1,lable:'已兑换'},
                ],
                channelType:[
                    {id:1,showName:'小程序'},
                    {id:2,showName:'公众号'},
                    {id:3,showName:'app'},
                    {id:4,showName:'第三方渠道'}
                    ],
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
                sels: [],//列表选中列
            };
        },
        mounted() {
            this.getCouponType();
            this.getData();
            this.getActivityInfo();
            this.getCityName()
        },
        methods: {

            //优惠券类型
            getCouponType() {
                getCouponType({couponType: 1}).then((res) => {
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.coupon = res.data;
                    }
                }, () => { this.listLoading = false; } ).catch(() => {});
            },


            //渠道转换
            formatChannel: function (row, column) {
                var channelName;
                if (row.channelName === 1) {
                    channelName = '小程序';
                } else if (row.channelName === 2) {
                    channelName = '公众号';
                } else if (row.channelName === 3) {
                    channelName = 'app';
                } else if (row.channelName === 4) {
                    channelName = '第三方渠道'
                } else {
                    channelName = '-'
                }
                return channelName;
            },
            formatDate: function (row, column) {
                return row.validityTime === '1900-01-01 00:00:00' ? '-' : row.validityTime;
            },

            //状态显示转换
            formatStatus: function (row, column) {
                return row.redeemCodeStatus === 1 ? '已兑换' : row.redeemCodeStatus === 0 ? '未兑换' : '未知';
            },

            selsChange: function (sels) {
                this.sels = sels;
                console.log(sels);
            },

            handleCommandExport(command){
                getExportCount(this.searchData).then((res) => {
                        if (this.GLOBAL.isResonseSuccess(res)){
                            this.exportData(command);
                        }
                    }
                    ,() => {}
                );
            },

            exportData(command) {
                let param = {};
                let type = parseInt(command);
                param.exportType = type;
                if(type === 1) {
                    //选中
                    if(this.sels === null) {
                        this.$message('请勾选数据');
                        return ;
                    }
                    let codes = this.sels.map(item => item.id);
                    if(codes.length <= 0){
                        this.$message('请勾选数据');
                        return ;
                    }
                    param.ids = codes.join(",");
                    this.export(param);
                }else if(type === 2) {
                    param = this.buildSearchParam();
                    param.exportType = type;
                    this.export(param);
                }else if(type === 3) {
                    //所有
                    this.export(param);
                }else {
                    this.$message('导出类型有误');
                }
            },

            getActivityInfo() {
                getActivityInfo().then((res) => {
                        if (this.GLOBAL.isResonseSuccess(res)){
                            console.log(res.data);
                            this.activityList = res.data
                        }
                    }
                    ,res => {}
                );
            },

            getCityName() {
                getCityNameList().then((res) => {
                        if (this.GLOBAL.isResonseSuccess(res)){
                            console.log(res.data);
                            this.cityNameList = res.data
                        }
                    }
                    ,res => {}
                );
            },

            export(param){
                let token = JSON.parse(sessionStorage.getItem('user')).token;
                if(token != null) {
                    param.token = token;
                    var url = process.env.API_ROOT+"/redeemCodeCount/export";
                    let p = this.urlEncode(param);
                    window.location.href = url + "?" + p.substr(1,p.length);
                }
            },
            /**
             * param 将要转为URL参数字符串的对象
             * key URL参数字符串的前缀
             * encode true/false 是否进行URL编码,默认为true
             *
             * return URL参数字符串
             */
            urlEncode (param, key, encode) {
                if(param==null) return '';
                var paramStr = '';
                var t = typeof (param);
                if (t == 'string' || t == 'number' || t == 'boolean') {
                    paramStr += '&' + key + '=' + ((encode==null||encode) ? encodeURIComponent(param) : param);
                } else {
                    for (var i in param) {
                        var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
                        paramStr += this.urlEncode(param[i], k, encode);
                    }
                }
                return paramStr;
            },


            buildSearchParam(){
                return {
                    redeemCode:this.searchData.redeemCode,
                    cityName:this.searchData.cityName,
                    channelType:this.searchData.channelType,
                    validityTime:this.searchData.validityTime,
                    redeemCodeStatus:this.searchData.redeemCodeStatus,
                    activityId:this.searchData.activityId,
                    startTime: (!this.getDate || !this.getDate[0])?null:this.getDate[0].getTime(),
                    endTime: (!this.getDate|| !this.getDate[1])?null:this.getDate[1].getTime(),
                    activityConfigureId:this.searchData.couponType,
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    },
                };
            },

            search() {
                this.pageNum = 1;
                this.getData()
            },

            getData(){
                let pageInfo=  {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                };
                let param = this.buildSearchParam();
                param.pageInfo = pageInfo;
                this.listLoading = true;
                getRedeemCodeCountList(param).then((res) => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(res)){
                            this.list = res.data.list;
                            this.total = res.data.paginationInfo == null ? 0 : res.data.paginationInfo.total;
                        }
                    }
                    ,data => { this.listLoading = false;}
                );
            },

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

            resetForm() {
                this.searchData={};
            }
        },
    }

</script>

<style lang="scss" scoped>
    .search-form{
        margin: 50px;
    }
</style>