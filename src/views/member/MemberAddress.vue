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
                <span>手机号：</span>
                <el-input size="medium" v-model="filterParams.customerPhone" placeholder="输入手机号" style="width:250px;"
                          clearable></el-input>
                <span>是否定位：</span>
                <el-form-item>
                    <el-select v-model="filterParams.isLocated" placeholder="是否定位">
                        <el-option v-for="item in locationConst" :key="item.key" :label="item.value"
                                   :value="item.key"></el-option>
                    </el-select>
                </el-form-item>
                <el-button type="primary" v-on:click="searchData()" :loading="listLoading">查询</el-button>
            </el-form>
        </el-col>

        <!-- 列表展示 -->
        <el-table :data="memberAddressList" stripe style="width: 100%">
            <el-table-column type="index" width="50px"></el-table-column>
            <el-table-column prop="businessTypeCode" label="业务类型" :formatter="parseBusinessType"
                             show-overflow-tooltip></el-table-column>
            <el-table-column prop="customerName" label="客户名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="customerPhone" label="客户号码" show-overflow-tooltip></el-table-column>
            <el-table-column prop="province" label="省份" show-overflow-tooltip></el-table-column>
            <el-table-column prop="city" label="城市" show-overflow-tooltip></el-table-column>
            <el-table-column prop="district" label="区域" show-overflow-tooltip></el-table-column>
            <el-table-column prop="addressDetail" label="详细地址" width="400px" show-overflow-tooltip></el-table-column>
            <el-table-column fixed="right" label="操作" width="70px" class-name="small-padding fixed-width" align="left">
                <template slot-scope="scope">
                    <el-button @click="editAddress(scope.row)" type="primary" size="mini">编辑</el-button>
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

        <!-- 编辑地址窗口 -->
        <el-dialog title="编辑会员地址" :visible.sync="editDialogVisible">
            <div style="margin-top: 0px;">
                <el-form :inline="true" :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="客户名称:" prop="customerName">{{ruleForm.customerName}}</el-form-item>
                    <el-form-item label="联系电话:" prop="customerPhone">{{ruleForm.customerPhone}}</el-form-item>
                    <!--<el-row :gutter="20">-->
                    <el-row :gutter="20">
                        <el-form-item label="地址:" prop="province">
                            <el-input v-model="ruleForm.province" style="width: 90px;"></el-input>
                        </el-form-item>
                        <el-form-item label="" prop="city">
                            <el-input v-model="ruleForm.city" style="width: 90px;"></el-input>
                        </el-form-item>
                        <el-form-item label="" prop="district">
                            <el-input v-model="ruleForm.district" style="width: 90px;"></el-input>
                        </el-form-item>
                        <el-form-item label="" prop="addressDetail">
                            <el-input v-model="ruleForm.addressDetail" style="width: 330px;" @blur="showMap"></el-input>
                        </el-form-item>
                    </el-row>
                    <!--经纬度-->
                    <el-form-item label="经纬度:" prop="longitude">
                        <el-input v-model="ruleForm.longitude" placeholder="经度" style="width: 120px;"></el-input>
                    </el-form-item>
                    <el-form-item label="" prop="latitude">
                        <el-input v-model="ruleForm.latitude" placeholder="纬度" style="width: 120px;"></el-input>
                    </el-form-item>
                    <!--提交按钮-->
                    <el-form-item style="margin-left: 100px;">
                        <el-button :loading="submitLoading" type="primary" @click="submitForm()">保存</el-button>
                    </el-form-item>
                    <div id="baiduMap"></div>
                </el-form>
            </div>
        </el-dialog>

    </section>
</template>

<script>
    import util from '../../common/js/util'
    import {queryMemberAddresses, modifyMemberAddressInfo} from '../../api/api';
    import moment from 'moment';
    import BMap from 'BMap';
    import selectGroup from '@/components/selectGroup';

    export default {
        components:{
            selectGroup
        },
        data() {
            return {
                memberAddressList: [],           // 表格数据--会员地址列表
                listLoading: false,             // 表格展示Loading
                submitLoading: false,           // 会员地址编辑Loading
                locationConst,                  // 是否定位下拉值
                total: 0,                       // 总记录数
                pageNum: 1,                     // 当前页码
                pageSize: 10,                   // 分页size
                filterParams: {                 // 筛选查询的参数
                    customerPhone: "",
                    isLocated: null
                },
                ruleForm: {},                    // 编辑会员地址的数据
                editDialogVisible: false,        // 编辑详情窗口
                number: -1,                     // 后台传过来的十进制数据
                isSelect: true,                 // 是否可选
                selectedBusinessCode: -1        // 筛选的业务类型编码
            }
        },
        methods: {
            // 查询会员地址列表
            queryMemberAddresses() {
                let param = {
                    businessTypeCode: this.selectedBusinessCode,
                    customerPhone: this.filterParams.customerPhone,
                    isLocated: this.filterParams.isLocated,
                    orderField: 'create_time',
                    sortType: 'desc',
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    }
                };
                this.listLoading = true;
                queryMemberAddresses(param).then(
                    res => {
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(res)) {    // 请求成功
                            this.total = res.data.paginationInfo.total;
                            this.memberAddressList = res.data.list;
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
                this.queryMemberAddresses();
            },

            // 切换页数
            handleCurrentChange(val) {
                this.pageNum = val;
                this.queryMemberAddresses();
            },
            // 处理分页条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.queryMemberAddresses();
            },

            // 编辑会员地址信息
            editAddress(row){
                this.editDialogVisible = true;
                this.ruleForm = row;
                setTimeout(() => {
                    this.showMap();
                }, 500);
            },
            showMap(){
                var _this = this;
                var address = this.ruleForm.province + this.ruleForm.city + this.ruleForm.district + this.ruleForm.addressDetail;
                var map = new BMap.Map("baiduMap");
                // 创建地址解析器实例
                var myGeo = new BMap.Geocoder();
                // 将地址解析结果显示在地图上,并调整地图视野
                myGeo.getPoint(address, function (point) {
                    if (point) {
                        map.centerAndZoom(point, 16);
                        map.addOverlay(new BMap.Marker(point));
                        _this.ruleForm.longitude = point.lng;
                        _this.ruleForm.latitude = point.lat;
                    } else {
                        alert("您选择地址没有解析到结果!");
                        address = _this.ruleForm.city + _this.ruleForm.district;
                        map.centerAndZoom(address, 16);
                    }
                }, this.city);
                //启用滚轮放大缩小，默认禁用
                map.enableScrollWheelZoom(true);
                //启用地图惯性拖拽，默认禁用
                map.enableContinuousZoom(true);
                //单击获取点击的经纬度
                map.addEventListener("click", function (e) {
                    //清除覆盖物
                    map.clearOverlays();
                    //添加新的覆盖物
                    map.addOverlay(new BMap.Marker(e.point));
                    _this.ruleForm.longitude = e.point.lng;
                    _this.ruleForm.latitude = e.point.lat;
                });

                //控制地图高度
                document.getElementById("baiduMap").style.height = document.documentElement.clientHeight - 210 + "px";
            },

            // 点击更新会员地址信息
            submitForm(){
                debugger
                let param = {
                    addressId: this.ruleForm.id,
                    province: this.ruleForm.province,
                    city: this.ruleForm.city,
                    district: this.ruleForm.district,
                    addressDetail: this.ruleForm.addressDetail,
                    longitude: this.ruleForm.longitude,
                    latitude: this.ruleForm.latitude,
                };
                modifyMemberAddressInfo(param).then(
                    res => {
                        this.submitLoading = false;
                        if (this.GLOBAL.isResonseSuccess(res)) {    // 请求成功
                            if (res.data === true) {
                                this.$message({showClose: true, message: '编辑成功!', type: 'success'});
                                this.editDialogVisible = false;
                                this.queryMemberAddresses();
                            } else {
                                this.$message({showClose: true, message: '编辑失败!', type: 'error'});
                            }
                        } else {
                            this.$message({showClose: true, message: res.message, type: 'error'});
                        }
                    }).catch(err => {
                    this.submitLoading = false;
                    var errMsg = err.response.data.message;
                    this.$message({showClose: true, message: errMsg, type: 'error'});
                });
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
                        return '未知业务类型';
                }
            }
        },
        mounted() {
            this.queryMemberAddresses();
        }
    }

    //出库类型下拉选项
    const locationConst = [
        {key: null, value: '全部'},
        {key: 0, value: '未定位'},
        {key: 1, value: '已定位'}
    ]

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