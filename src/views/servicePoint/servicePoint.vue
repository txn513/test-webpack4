<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">

            <el-form align="right" :inline="true"  class="demo-form-inline">
                <el-form-item label="">
                    <el-input v-model="filters.orgName" placeholder="请输入服务点名称"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-select v-model="filters.servicePointType" clearable placeholder="服务点类型" >
                        <el-option :key="0" :value="0" label="虚拟服务点"></el-option>
                        <el-option :key="1" :value="1" label="实体服务点"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-select v-model="filters.pickupFlag" clearable placeholder="上门取件" >
                        <el-option :key="0" :value="0" label="关闭"></el-option>
                        <el-option :key="1" :value="1" label="开启"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-select v-model="filters.cabinetFlag" clearable placeholder="智能柜取件" >
                        <el-option :key="0" :value="0" label="关闭"></el-option>
                        <el-option :key="1" :value="1" label="开启"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-select v-model="filters.sendStoresFlag" clearable placeholder="用户自送门店" >
                        <el-option :key="0" :value="0" label="关闭"></el-option>
                        <el-option :key="1" :value="1" label="开启"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" v-on:click="searchData">查询</el-button>
                </el-form-item>
                <el-form-item label="">
                    <el-button v-if="isAuth('mpys:servicepoint:insert')" type="primary" @click="handleClick">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="list" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column prop="orgName" label="门店名称"   ></el-table-column>
            <el-table-column prop="disableFlag" label="门店状态"   :formatter="number2text"></el-table-column>
            <el-table-column prop="address" label="地址"   ></el-table-column>
            <el-table-column prop="servicePointType" label="服务点类型"  :formatter="number2text"></el-table-column>
            <el-table-column prop="openingTime" label="营业时间">
                <template slot-scope="scope" v-if="scope.row.openingTime!='' && scope.row.openingTime!=null">
                    <el-popover
                            placement="bottom"
                            title=""
                            trigger="hover">
                        <p v-for="item in scope.row.openingTime">
                            {{item.value2}}&nbsp;-&nbsp;{{item.value3}}&nbsp;&nbsp;{{item.value1}}&nbsp;&nbsp;
                            <span  v-if="item.value4">开启</span>
                            <span  v-else>关闭</span>
                        </p>
                        <el-button  type="text" slot="reference">查看</el-button>
                    </el-popover>

                </template>
            </el-table-column>
            <el-table-column prop="fastigiumTime" label="高峰时间">
                <template slot-scope="scope" v-if="scope.row.fastigiumTime!='' && scope.row.fastigiumTime!=null">
                    <el-popover
                            placement="bottom"
                            title=""
                            trigger="hover">
                        <p v-for="item in scope.row.fastigiumTime">
                            {{item.value2}}&nbsp;-&nbsp;{{item.value3}}&nbsp;&nbsp;{{item.value1}}&nbsp;&nbsp;
                            <span  v-if="item.value4">开启</span>
                            <span  v-else>关闭</span>
                        </p>
                        <el-button  type="text" slot="reference">查看</el-button>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column prop="pickupFlag" label="上门取件"  :formatter="number2text" ></el-table-column>
            <el-table-column prop="cabinetFlag" label="智能柜取件"  :formatter="number2text" ></el-table-column>
            <el-table-column prop="sendStoresFlag" label="自送门店" :formatter="number2text" ></el-table-column>


            <el-table-column  fixed="right" label="操作" width="230">
                <template slot-scope="scope">
                    <el-button v-if="isAuth('mpys:servicepoint:update')" type="primary" :disabled="scope.row.disableFlag == '1'" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button v-if="isAuth('mpys:servicepoint:update') && scope.row.disableFlag == 0" type="primary" size="mini" @click="updateDisableFlag(scope.row, 1)">停用</el-button>
                    <el-button v-if="isAuth('mpys:servicepoint:update') && scope.row.disableFlag == 1" type="primary" size="mini" @click="updateDisableFlag(scope.row, 0)">启用</el-button>
                    <el-button v-if="isAuth('mpys:servicepoint:view')" type="primary" size="mini" @click="handleInfo(scope.$index, scope.row)">详情</el-button>
                </template>
            </el-table-column>
        </el-table>

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
    </section>
</template>

<script>
    import {getServicePointList,updateServicePointStatus} from '../../api/api';

    export default {
        data() {
            return {
                filters: {
                    orgName: '',
                    servicePointType: '',//服务点类型(0虚拟服务点,1实体服务点)
                    pickupFlag: '',//是否支开启上门取件(0否,1是)
                    cabinetFlag: '',//是否开启智能柜取件(0否,1是)
                    sendStoresFlag:''//是否开启自送门店(0否,1是)
                },
                list: [],
                total: 0,
                title:"新增",//弹出框标题
                pageNum: 1, //当前页码
                pageSize: 10,//页数
                listLoading: false,
                sels: [],//列表选中列
                formVisible: false,//编辑界面是否显示
                loading: false,
                formRules: {
                    name: [{required: true, message: '请输入姓名', trigger: 'blur'}]
                },
                //编辑界面数据
                form: {
                    id:'' ,
                    orgCode:'' ,
                    orgName:'' ,
                    abbr:'' ,
                    type:'' ,
                    shopType:1 ,//`shop_type` int(11) NOT NULL COMMENT '商家类型（1:门店;2加工中心;）',
                    regionCode:'' ,
                    keeper:'' ,
                    telephone:'' ,
                    phoneOne:'' ,
                    phoneTwo:'' ,
                    address:'' ,
                    area:'' ,
                    longitude:'' ,
                    latitude:'' ,
                    disableFlag:'' ,
                    imgPath:'' ,
                    delFlag:'' ,
                    areaCode:'' ,
                    cityName:'' ,
                    remark:'' ,
                    label:'' ,
                    servicePointType:'' ,
                    pickupFlag:'' ,
                    sendStoresFlag:'' ,
                    cabinetFlag:'' ,
                    openingTime:'' ,
                    fastigiumTime:'' ,
                    createTime:'' ,
                    updateTime:'' ,
                    dataSource:''
                },

            }
        },
        methods: {
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
            searchData(){
                this.pageNum = 1;
                this.getData();
            },
            //获取用户列表
            getData() {
                let para = {
                    orgName: this.filters.orgName,
                    servicePointType: this.filters.servicePointType,//服务点类型(0虚拟服务点,1实体服务点)
                    pickupFlag: this.filters.pickupFlag,//是否支开启上门取件(0否,1是)
                    cabinetFlag: this.filters.cabinetFlag,//是否开启智能柜取件(0否,1是)
                    sendStoresFlag:this.filters.sendStoresFlag,//是否开启自送门店(0否,1是)
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    }
                };
                this.listLoading = true;
                getServicePointList(para).then((res) => {
                    this.listLoading = false;
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        var d = res.data.list;
                        for(var i=0;i<d.length;i++){
                            //营业时间
                            if(d[i].openingTime!=''){
                                d[i].openingTime=JSON.parse(d[i].openingTime);
                            }
                            //高峰时间
                            if(d[i].fastigiumTime!=''){
                                d[i].fastigiumTime=JSON.parse(d[i].fastigiumTime);
                            }
                        }
                        this.list=d;
                        this.total = res.data.paginationInfo.total;
                     //   this.list = res.data.list;
                    }
                }, () => { this.listLoading = false; });
            },


            selsChange: function (sels) {
                this.sels = sels;
            },
            success: function(message){
                this.$message({
                    message: message,
                    type: 'success'
                });
            },
            number2text(row, column) {
                var property = column.property;
                var value = row[column.property];
                if ("disableFlag" == property){
                    switch (value){
                        case 0: return "启用";
                        case 1: return "停用";
                    }
                }else if("servicePointType" == property){
                    switch (value){
                        case 0: return "虚拟服务点";
                        case 1: return "实体服务点";
                    }
                }else if("pickupFlag" == property){
                    switch (value){
                        case 0: return "关闭";
                        case 1: return "开启";
                    }
                }else if("sendStoresFlag" == property){
                    switch (value){
                        case 0: return "关闭";
                        case 1: return "开启";
                    }
                }else if("cabinetFlag" == property){
                    switch (value){
                        case 0: return "关闭";
                        case 1: return "开启";
                    }
                }
                return null;
            },
            updateDisableFlag(row, statu){
                let para = {
                    id: row.id,
                    disableFlag: statu,
                }
                updateServicePointStatus(para).then((res) => {
                    if (this.GLOBAL.isResonseSuccess(res)) {
                        this.getData();
                    }else{
                        this.$message.error(res.message());
                    }
                });

            },
            //跳转到添加页
            handleClick(row) {
              //  this.$router.push({path: 'servicePointAdd'});
                this.$router.push({path: 'editOrAdd?id=null&actionType=add'});
            },
            //跳转到编辑页面
            handleEdit(index, row) {
                //console.log(index, row);
                this.$router.push({path: 'editOrAdd?id='+row.id+'&actionType=edit'});
            },
            //跳转到详情页面
            handleInfo(index, row) {
                //console.log(index, row);
                this.$router.push({path: 'stationdetail?id='+row.id});
            },
        },
        mounted() {
            this.getData();
        }
    }

</script>

<style scoped>

</style>