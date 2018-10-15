<template>
    <section>
        <div class="toolbar el-col el-col-24" style="margin-top: 20px;text-align:right;">

            <!--订单号-->
            <el-input size="medium" v-model.trim="orderId" placeholder="请输入订单号" clearable style="width:370px;"></el-input>&nbsp;&nbsp;
            <!--客户号码-->
            <el-input size="medium" v-model.trim="receiverPhone" placeholder="请输入客户号码" clearable style="width:370px;"></el-input>&nbsp;&nbsp;
            <!--客户姓名-->
            <el-input size="medium" v-model.trim="receiverName" placeholder="请输入客户姓名" clearable style="width:370px;"></el-input>
            &nbsp;&nbsp;
            <!--提交按钮-->
            <el-button type="primary"  v-on:click="getOrderByCondition(true)" :loading="listLoading" icon="el-icon-search">查询</el-button>
            <el-button type="primary"  v-on:click="reset1">重置</el-button>
        </div>

        <div  v-loading="listLoading">
            <!--table-->
            <el-table
                    :data="orderReassignList"
                    style="width: 100%;margin-top: 30px;margin-left: 0%;">
                <el-table-column
                        align="center"
                        prop="orderId"
                        label="订单编号">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="orderStatus"
                        label="订单状态" :formatter="formatOrderStatus">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="servicePointCurrent"
                        label="当前服务点">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="receiverName"
                        label="客户姓名">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="receiverPhone"
                        label="客户号码">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="pickupType"
                        label="取件方式" :formatter="formatPickupType">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="trueName"
                        label="取件员">
                </el-table-column>

                <el-table-column
                        align="center"
                        label="操作"
                        width="260">
                    <template slot-scope="scope">
                        <el-button @click="detailClick(scope.row)" type="primary"  size="mini">订单详情</el-button>
                        <el-button @click="servicePointDispatch(scope.row)" type="primary"  size="mini">指定服务点</el-button>
                        <el-dialog title="指定服务点" :visible.sync="dialogTableVisible">
                            <div class="toolbar el-col el-col-24" style="text-align: right;margin-bottom: 25px;">
                                <!--地区选择-->
                                <el-select v-model="regionName" placeholder="门店所属城市" filterable style="width:140px;">
                                    <el-option
                                            v-for="item in cityList"
                                            :key="item.regionCode"
                                            :label="item.regionName"
                                            :value="item.regionName">
                                    </el-option>
                                </el-select>
                                <el-input v-model="trueName" placeholder="请输入名称" style="width:170px;"></el-input>
                                <el-button type="primary"  v-on:click="getReassignServicePointListByName" :loading="listLoading1" icon="el-icon-search">搜索</el-button>
                                <el-button type="primary"  v-on:click="reset">重置</el-button>
                            </div>

                            <el-table :data="servicePoints" v-loading="listLoading1" height="450">
                                <el-table-column align="center" property="orgName" label="服务点名称"></el-table-column>
                                <!--<el-table-column align="center" property="" label="距目的地距离"></el-table-column>-->
                                <el-table-column align="center" label="操作">
                                    <template slot-scope="scope">
                                        <el-button type="primary"  size="mini" @click="dispatch(scope.$index, scope.row)">改派</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-dialog>
                    </template>
                </el-table-column>
            </el-table>

            <!--分页-->
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
        </div>
    </section>
</template>

<script>
    import {orderDispatchShopFun,getReassignServicePointFun,getCityListData} from '../../api/api';
    import {getOrderReassignFun} from '../../api/api';
    import util from '../../common/js/util';


    export default {
        data() {
            return {
                num:0,//订单数量
                currentState:'',//配送员状态
                trueName:'',//配送员姓名或id
                shopId:null,//所属服务点
                servicePoints:[],//服务点列表
                shopList:[],//某个城市下的店铺列表
                selectShopName:'',//某个城市下的店铺

                listLoading: false,
                //异常列表分页参数
                total: 0,
                pageNum: 1, //当前页码
                pageSize: 10,//页数
                //totalPage:0,
                page: 1,
                //配送员分页参数
                totalPage1:0,
                page1: 1,
                pageSize1:10,
                listLoading1: false,

                orderId:'',//订单号
                receiverPhone:'',//客户号码
                receiverName:'',//客户姓名
                orderReassignList:[],//订单列表
                //配送员列表
                dispatchList: [],
                dialogTableVisible: false,//指定服务点弹框默认隐藏
                dialogFormVisible: false,

                currOrderId:null,//当前用户选择的异常订单的id
                dispatchOrderId:'',//要改派的订单Id
                dispatchOrderStatus:'',//要改派的订单状态
                //dispatchOrderServiceName:'',//要改派的订单所属服务点

                regionName: '',//默认地区
                cityList: [],//地区列表
            };
        },
        methods:{

            //切换页数
            handleCurrentChange(val) {
                this.pageNum = val;
                this.getOrderByCondition();
            },
            //处理分页条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.getOrderByCondition();
            },

            //依据订单号、客户名称、客户号码查询订单
            getOrderByCondition(flag){
                var para = {
                    pageInfo:{
                        pageNum:flag===true?1:this.pageNum,
                        pageSize:this.pageSize,
                    },
                    orderId:this.orderId,
                    receiverName:this.receiverName,
                    receiverPhone:this.receiverPhone,
                };
                //加载中样式显示
                if(this.orderId.length==0 && this.receiverName.length==0 && this.receiverPhone.length==0){
                    alert("请至少输入一个查询条件");
                    return false;
                }

                this.listLoading = true;
                getOrderReassignFun(para).then((data) =>{
                    //debugger
                        this.listLoading = false;
                        if (this.GLOBAL.isResonseSuccess(data)){
                            this.num=data.data.list.length;
                            this.orderReassignList=data.data.list;
                            this.total = data.data.paginationInfo.total;
                        }
                    },
                    data=>{this.listLoading = false;}
                );
            },

            //进入订单详情页面
            detailClick(row) {
                this.$router.push({path: 'orderSelf/queryDetailById?id='+row.orderId+'&orderStatus='+row.orderStatus});
            },

            //进入订单改派服务点页面
            servicePointDispatch(row) {
               //debugger
                //订单所属城市
                this.regionName=row.cityName;

                this.dispatchOrderId = row.orderId;
                //显示指定服务点弹框
                this.dialogTableVisible = true;
                //oldShopName
                this.dispatchOrderServiceName = row.servicePointCurrent;
                //修改前的订单状态
                this.dispatchOrderStatus = row.orderStatus;
                //获取该订单的服务点id
                var servicePointCurrentId = row.servicePointCurrentId;
                //获取该订单的取件方式
                this.dispatchOrderPickupType = row.pickupType

                var para = {
                    //pageNum:this.page,
                    //pageSize:this.pageSize1,
                    //id:servicePointCurrentId,
                    id:"",
                    shopName:this.trueName,
                    cityName:this.regionName,
                    //selectShopName:this.selectShopName
                };
                //console.log(para);
                //首次点击分配服务点
                getReassignServicePointFun(para).then((data) => {
                    //debugger
                        if (this.GLOBAL.isResonseSuccess(data)){

                            this.servicePoints = data.data;

                        }
                    }
                );
            },
            //搜索
            getReassignServicePointListByName(){
                var para = {
                   // pageNum:this.page,
                    //pageSize:this.pageSize1,
                    shopName:this.trueName,
                    ID:"",
                    cityName:this.regionName,
                };
                getReassignServicePointFun(para).then((data) => {
                    //debugger
                        if (this.GLOBAL.isResonseSuccess(data)){
                            this.servicePoints = data.data;
                        }
                    }
                );
            },


            //执行ajax,为订单改派服务点
            orderDispatchShop(orderId,shopId,index,newShopName){
                //debugger

                var param={
                    orderId:orderId,
                    shopId:shopId,
                    newShopName:newShopName,
                    oldShopName:this.dispatchOrderServiceName,
                    oldOrderStatus:this.dispatchOrderStatus,
                    pickupType:this.dispatchOrderPickupType
                }
                orderDispatchShopFun(param).then((data) => {
                        if (this.GLOBAL.isResonseSuccess(data)){
                            this.$message({
                                type: 'success',
                                message: '订单改派成功!'
                            });
                            //关闭弹窗
                            this.dialogTableVisible=false;
                            this.getOrderByCondition();
                        }else{
                            this.$message({
                                type: 'error',
                                message: '此单暂时无法改派!'
                            });
                        }
                    }
                );
            },
            //开始为订单指定派送员
            startDispatch(orderId,shopId,index,newShopName){
                this.$confirm('您确定将订单改派到该服务点吗?', '提示', {
                    confirmButtonText: '提交',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    //执行ajax
                    this.orderDispatchShop(orderId,shopId,index,newShopName);
                });
            },

            //服务点分页查询
            handleCurrentChange1(page1) {
                this.page = page1;
                this.getReassignServicePointListByName();
            },
            //重置配送员搜索条件
            reset() {
                this.trueName='';
            },
            //重置配送员搜索条件
            reset1() {
                this.orderId='' ;
                this.receiverName='';
                this.receiverPhone='';
                //this.selectShopName='';
            },
            //为订单改派服务点
            dispatch(index, row){
                //订单id,   服务点id
                this.startDispatch(this.dispatchOrderId,row.id,index,row.orgName);
            },
            //获取注册城市列表
            getCityList(){
                getCityListData(null).then((data) => {
                        if (this.GLOBAL.isResonseSuccess(data)){
                            //debugger
                            data.data.unshift({regionCode: null, regionName: '所有城市'});
                            this.cityList=data.data;
                        }
                    }
                );
            },

            formatOrderStatus: function (row, column) {
                if (row.orderStatus === 0){
                    return '提交状态';
                } else if (row.orderStatus === 10){
                    return '申请取消';
                } else if (row.orderStatus === 20){
                    return '待发货';
                } else if (row.orderStatus === 30){
                    return '待收货';
                } else if (row.orderStatus === 40){
                    return '智能柜预约中';
                } else if (row.orderStatus === 50){
                    return '智能柜预约失败';
                } else if (row.orderStatus === 60){
                    return '智能柜预约成功';
                } else if (row.orderStatus === 70){
                    return '用户已将货物存柜';
                } else if (row.orderStatus === 70){
                    return '用户已将货物存柜';
                } else if (row.orderStatus === 80){
                    return '门店已分配收件员';
                } else if (row.orderStatus === 90){
                    return '收件员确认前往';
                } else if (row.orderStatus === 100){
                    return '收件员从柜中取件';
                } else if (row.orderStatus === 110){
                    return '已关联订单';
                } else if (row.orderStatus === 120){
                    return '门店收到客户的货物';
                } else if (row.orderStatus === 130){
                    return '加工中心收货员从门店收货';
                } else if (row.orderStatus === 140){
                    return '加工中心已收货';
                } else if (row.orderStatus === 150){
                    return '清洗中';
                } else if (row.orderStatus === 160){
                    return '清洗完成';
                } else if (row.orderStatus === 170){
                    return '送回门店';
                } else if (row.orderStatus === 180){
                    return '门店确认收货';
                } else if (row.orderStatus === 190){
                    return '门店分配派件员';
                }  else if (row.orderStatus === 200){
                    return '派件员配送中';
                }  else if (row.orderStatus === 210){
                    return '派件员已存入柜中';
                }  else if (row.orderStatus === 220){
                    return '已签收';
                }  else if (row.orderStatus === 230){
                    return '用户确认已收货/已完成';
                }  else if (row.orderStatus === 240){
                    return '用户评价';
                }  else if (row.orderStatus === 250){
                    return '商家回收';
                }  else if (row.orderStatus === 260){
                    return '客户紧急取走';
                }  else if (row.orderStatus === 270){
                    return '提交退货';
                }  else if (row.orderStatus === 280){
                    return '已取消';
                }  else if (row.orderStatus === 290){
                    return '已退货';
                }  else if (row.orderStatus === 300){
                    return '关闭';
                } else {
                    return '未知';
                }
            },

            formatPickupType: function (row) {
                if (row.pickupType === 0){
                    return '上门取件';
                } else if (row.pickupType === 1){
                    return '自送门店';
                } else if(row.pickupType === 2){
                    return '自送智能柜';
                } else if (row.pickupType === 3){
                    return '快递配送';
                } else {
                    return '未知';
                }
            },

        },
        mounted(){
            this.getCityList();
        }
    }

</script>

