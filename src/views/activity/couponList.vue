<template>
    <section>
        <el-row >
            <el-col  style="padding-bottom: 0px; margin: 5px 0px 0px 0px"></el-col>

            <!--工具条-->
            <el-form ref="searchData"  :model="searchData" label-position="left"  align="left" :inline="true"  class="demo-form-inline search-form">
                <!--<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">-->
                <el-col :span="24"  style="padding-bottom: 0px;">
                    <el-form-item label="券码" prop="couponCode" placeholder="请输入优惠券码">
                        <el-input v-model="searchData.couponCode" placeholder="" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="券类型" >
                        <el-select v-model="searchData.couponTypeId" placeholder="请选择券类型">
                            <el-option v-for="item in couponType" :key="item.id"    :label="item.couponContent" :value="item.id" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="领券日期" >
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
                    <el-form-item label="使用日期" >
                        <el-date-picker
                                v-model="useDate"
                                type="daterange"
                                :picker-options="pickerOptions"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                align="right">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="退回日期" >
                        <el-date-picker
                                v-model="rebackDate"
                                type="daterange"
                                :picker-options="pickerOptions"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                align="right">
                        </el-date-picker>
                    </el-form-item>
                    <!--                </el-col>
                                     <el-col :span="24" style="padding-bottom: 0px;">-->
                    <el-form-item label="券状态" >
                        <el-select v-model="searchData.getFlag" placeholder="请选择券状态">
                            <el-option v-for="item in discountStatus" :key="item.id"    :label="item.showName" :value="item.id" />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="使用城市" >
                        <el-select v-model="searchData.shopCity" placeholder="请选择使用城市">
                            <el-option v-for="item in cityList" :key="item.id"    :label="item.regionName" :value="item.regionName" />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="领取渠道" >
                        <el-select v-model="searchData.getChannelType" placeholder="请选择领取渠道">
                            <el-option v-for="item in channelType" :key="item.id"    :label="item.showName" :value="item.id" />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="使用渠道" >
                        <el-select v-model="searchData.useChannelType" placeholder="请选择使用渠道">
                            <el-option v-for="item in channelType" :key="item.id"    :label="item.showName" :value="item.id" />
                        </el-select>
                    </el-form-item>

                    <el-form-item>
                        <el-button   type="primary" @click="getData(1)"  v-if="isAuth('scloud:couponinfo:view')">查询</el-button>
                    </el-form-item>

                    <el-form-item>
                        <el-button   type="primary" @click="resetForm" v-if="isAuth('scloud:couponinfo:view')">重置</el-button>
                    </el-form-item>

                    <el-dropdown @command="handleCommandExport" v-if="isAuth('scloud:couponinfo:export') && isAuth('scloud:couponinfo:view')">
                        <el-button type="primary"  >
                            导出<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="1">导出选中</el-dropdown-item>
                            <el-dropdown-item command="2">导出条件</el-dropdown-item>
                            <el-dropdown-item command="3">导出所有</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-col>
            </el-form>
        </el-row>

        <!--列表-->
        <el-table :data="list"  highlight-current-row v-loading="listLoading"  style="width: 100%;" @selection-change="selsChange">
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column  type="index" />
            <el-table-column prop="couponCode" label="券码"   sortable  show-overflow-tooltip></el-table-column>
            <el-table-column prop="couponTypeS" label="券类型"   sortable      show-overflow-tooltip></el-table-column>
            <el-table-column prop="shopCity" label="使用城市"   sortable    show-overflow-tooltip></el-table-column>
            <el-table-column prop="getChannelTypeS" label="领取渠道"   sortable     show-overflow-tooltip></el-table-column>
            <el-table-column prop="useChannelTypeS" label="使用渠道"   sortable     show-overflow-tooltip></el-table-column>
            <el-table-column prop="createTimeS" label="领券日期"   sortable    show-overflow-tooltip     ></el-table-column>
            <el-table-column prop="useTimeS" label="使用日期"   sortable    show-overflow-tooltip   ></el-table-column>
            <el-table-column prop="rebackTimeS" label="退回日期"   sortable    show-overflow-tooltip  ></el-table-column>
            <el-table-column prop="status" label="券状态"   sortable      show-overflow-tooltip></el-table-column>

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
    /* import util from '@/common/js/util';*/
    import {couponInfoList,couponInfoListSelf,getCouponList,getCityListData,couponInfoExport,couponInfoCount} from '@/api/api';
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
                searchData:{
                    couponCode:null,
                    couponTypeId:null,
                    getFlag:null,
                    useFlag:null,
                    shopCity:null,
                    getChannelType:null,
                    useChannelType:null,
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    },

                },
                couponType:[],
                cityList:[],
                discountStatus:[{id:0,showName:'未领取'},{id:1,showName:'未使用'},{id:2,showName:'已使用'},{id:3,showName:'已退回'}],
                channelType:[{id:1,showName:'小程序'},{id:2,showName:'公众号'},{id:3,showName:'app'},{id:4,showName:'第三方渠道'}],
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
            this.getCouponTypeList();
            this.getCityListData();
            this.getData();

            console.log(this.isAuth('scloud:couponinfo:export'));
            console.log(this.isAuth('scloud:couponinfo:view'));
            console.log(this.isAuth('scloud:couponinfo:export') && this.isAuth('scloud:couponinfo:view'));


        },
        methods: {
            selsChange: function (sels) {
                this.sels = sels;
                console.log(sels);
            },
            handleCommandExport(command){
                let param ={};
                if(command==1) {
                    //选中
                    if(this.sels==null  ) {
                        this.$message('没有选中数据');
                        return ;
                    }
                    let codes = this.sels.map(item => item.couponCode);
                    if(codes.length<=0){
                        this.$message('没有选中数据');
                        return ;
                    }
                    param.codes=codes.join(",");
                    param.type=command;
                    this.exeExport(param);
                    return ;
                }else if(command==2) {
                    param = this.buildSearchParam();
                }else if(command==3) {
                    //所有
                }else {
                    this.$message('导出类型有误');
                    return ;
                }
                //导出前先判断数据
                couponInfoCount(param).then((res) => {
                        if (this.GLOBAL.isResonseSuccess(res)){
                            param.type=command;
                            this.exeExport(param);
                        }else {
                            this.$message(res.message);
                        }
                    }
                    ,res => { this.listLoading = false;}
                );

            },
            exeExport(param){
                let token = JSON.parse(sessionStorage.getItem('user')).token;
                if(token!=null){
                    param.token= token;
                    var url = process.env.API_ROOT+"/couponInfo/export";
                    let p = this.urlEncode(param);
                    location=url+"?"+p.substr(1,p.length);
                }
            },
            /**
             * param 将要转为URL参数字符串的对象
             * key URL参数字符串的前缀
             * encode true/false 是否进行URL编码,默认为true
             *
             * return URL参数字符串
             var obj={name:'tom','class':{className:'class1'},classMates:[{name:'lily'}]};
             console.log(urlEncode(obj));
             //output: &name=tom&class.className=class1&classMates[0].name=lily
             console.log(urlEncode(obj,'stu'));
             //output: &stu.name=tom&stu.class.className=class1&stu.classMates[0].name=lily
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

            getCouponTypeList(){
                //TODO 下拉数目需要全显示出来
                let param = {
                    pageInfo: {
                        pageSize: 10000
                    }
                };
                getCouponList(param).then((data) => {
                        if (this.GLOBAL.isResonseSuccess(data)){
                            let couponTypeList = data.data.list;
                            this.couponType = couponTypeList;
                        }
                    }
                    ,data => {}
                );

            },
            getCityListData(){
                getCityListData({}).then((data) => {
                        if (this.GLOBAL.isResonseSuccess(data)){
                            this.cityList = data.data;
                        }
                    }
                    ,data => { }
                );
            },
            buildSearchParam(){
                let getFlag = this.searchData.getFlag;
                if(this.searchData.getFlag>0){
                    this.searchData.useFlag=this.searchData.getFlag-1;
                    getFlag=1;
                }else{
                    this.searchData.useFlag=  null;
                }
                let param={
                    couponCode:this.searchData.couponCode,
                    couponTypeId:this.searchData.couponTypeId,
                    getStartTime: (!this.getDate || !this.getDate[0])?null:this.getDate[0].getTime(),
                    getEndTime: (!this.getDate|| !this.getDate[1])?null:this.getDate[1].getTime(),
                    useStartTime: (!this.useDate|| !this.useDate[0])?null:this.useDate[0].getTime(),
                    useEndTime: (!this.useDate|| !this.useDate[1])?null:this.useDate[1].getTime(),
                    rebackStartTime: (!this.rebackDate|| !this.rebackDate[0])?null:this.rebackDate[0].getTime(),
                    rebackEndTime:( !this.rebackDate|| !this.rebackDate[1])?null:this.rebackDate[1].getTime(),
                    getFlag:  getFlag,
                    useFlag:  this.searchData.useFlag,
                    shopCity:this.searchData.shopCity,
                    getChannelType: this.searchData.getChannelType,
                    useChannelType: this.searchData.useChannelType,
                };
                return param;

            },
            getData(pageNum){
                this.pageNum = pageNum || this.pageNum;
                let pageInfo=  {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                };
                let param = this.buildSearchParam()
                param.pageInfo = pageInfo;
                this.listLoading = true;
                //let start = new Date().getTime();
                couponInfoListSelf(param).then((res) => {
                // couponInfoList(param).then((res) => {
                        //let end = new Date().getTime();//self 1625  , auto 2639
                        //console.log(end-start);
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(res)){
                            //console.log(res);
                            this.total = res.data.paginationInfo.total;
                            this.list = res.data.list;
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
            //时间格式化
            /*dateFormat: function (row, column, cellValue) {
                if(cellValue == undefined){
                    return ''
                }
                let time = util.dateFormat("yyyy-MM-dd hh:mm:ss",new Date(cellValue));
                if(time.startsWith("1900")) {
                    return "";
                }
                return  time;
            },*/
            /*statusFormat: function (row, column, cellValue) {
                let getFlag = row.getFlag;
                if(getFlag==0){
                    return "未领取";
                }
                let useFlag = row.useFlag;
                let xx =   this.discountStatus[useFlag+1];
                if( !xx){
                    return "";
                }
                return xx.showName;
            },*/

            /*channelFormat: function (row, column, cellValue) {
                let xx = this.channelType[cellValue];
                if( !xx){
                    return "";
                }
                return xx.showName;
            },*/
            /*couponTypeFormat: function (item) {
                let t = item.couponType;
                let value="";
                if(t==1){
                    value="现金券-"+item.couponSubtract+"元";
                }
                else  if(t==2){
                    value="满减券-满"+item.couponSum+"减"+item.couponDecrease;
                }else  if(t==3){
                    value="折扣券-"+item.couponDiscount+"折";
                }else{
                    value="未知种类券";
                }
                item.showName = value;
            },*/
            /*couponTypeShowFormat: function  (row, column) {
                let t = row.couponType;
                if(t==1){
                    return "现金券-"+row.couponSubtract+"元";
                }
                else if(t==2){
                    return "满减券-满"+row.couponSum+"减"+row.couponDecrease;
                }else  if(t==3){
                    return "折扣券-"+row.couponDiscount+"折";
                }else{
                    return "未知种类券";
                }
            },*/
            resetForm() {
                this.searchData={};
                this.getDate=[];
                this.useDate=[];
                this.rebackDate=[];
            }
        },
    }

</script>

<style lang="scss" scoped>
    /*.search-form{
        margin: 50px;
    }*/
</style>